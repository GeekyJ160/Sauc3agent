import { analyzeTake, buildPeaks } from "@/lib/sauc3/analyze";
import {
  DELAY_NOTES,
  dbToGain,
  type ClipInfo,
  type ModuleDef,
  type TrackId,
  type TrackModel,
} from "@/lib/sauc3/model";

export type MeterSnap = {
  inputDb: number;
  stagedDb: number;
  outputDb: number;
  inputClip: boolean;
  outputClip: boolean;
};

type Built = {
  input: AudioNode;
  output: AudioNode;
  update: (params: Record<string, number>, bpm: number) => void;
  dispose: () => void;
};

type TrackChain = {
  entry: GainNode;
  trim: GainNode;
  hpf: BiquadFilterNode;
  fader: GainNode;
  preAnalyser: AnalyserNode;
  stagedAnalyser: AnalyserNode;
  postAnalyser: AnalyserNode;
  modules: Map<string, Built>;
  orderKey: string;
};

type Snapshot = {
  tracks: TrackModel[];
  selectedId: TrackId;
  bpm: number;
  loop: boolean;
  masterDb: number;
};

type Recorded = {
  trackId: TrackId;
  samples: Float32Array;
  sampleRate: number;
  duration: number;
  name: string;
};

const NOTE_BEATS = [0.25, 0.5, 0.75, 1, 1.5, 2];

function safeDisconnect(node: AudioNode) {
  try {
    node.disconnect();
  } catch {
    /* already disconnected */
  }
}

function mixdown(buffer: AudioBuffer) {
  const length = buffer.length;
  const mono = new Float32Array(length);
  const channels = buffer.numberOfChannels;
  for (let channel = 0; channel < channels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) mono[i] = (mono[i] ?? 0) + data[i]! / channels;
  }
  return mono;
}

class RackEngine {
  private ctx: AudioContext | null = null;
  private masterSum: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private masterAnalyser: AnalyserNode | null = null;
  private chains = new Map<TrackId, TrackChain>();
  private buffers = new Map<TrackId, AudioBuffer>();
  private sources: AudioBufferSourceNode[] = [];
  private playing = false;
  private loopOn = false;
  private startedAt = 0;
  private offset = 0;
  private timer = 0;
  private selectedId: TrackId = "lead";
  private bpm = 120;
  private recording = false;
  private recordingTrack: TrackId | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private mic: MediaStreamAudioSourceNode | null = null;
  private recStream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private time = new Float32Array(1024);
  private hold = { inputDb: -96, stagedDb: -96, outputDb: -96 };
  private inputClip = false;
  private outputClip = false;
  private irCache = new Map<string, AudioBuffer>();
  private curveCache = new Map<number, Float32Array>();

  onRecorded: ((clip: Recorded) => void) | null = null;
  onTransport: ((playing: boolean) => void) | null = null;
  onRecordState: ((recording: boolean) => void) | null = null;
  onError: ((message: string) => void) | null = null;

  position() {
    if (!this.playing || !this.ctx) return this.offset;
    return this.offset + (this.ctx.currentTime - this.startedAt);
  }

  duration() {
    let max = 0;
    for (const buffer of this.buffers.values()) max = Math.max(max, buffer.duration);
    return max;
  }

  isPlaying() {
    return this.playing;
  }

  isRecording() {
    return this.recording;
  }

  clearClipLatch() {
    this.inputClip = false;
    this.outputClip = false;
  }

  meters(): MeterSnap {
    const chain = this.chains.get(this.selectedId);
    const input = chain ? this.ballistic("inputDb", this.level(chain.preAnalyser)) : -96;
    const staged = chain ? this.ballistic("stagedDb", this.level(chain.stagedAnalyser)) : -96;
    const output = this.masterAnalyser ? this.ballistic("outputDb", this.level(this.masterAnalyser)) : -96;
    if (input > -0.4) this.inputClip = true;
    if (output > -0.4) this.outputClip = true;
    return {
      inputDb: input,
      stagedDb: staged,
      outputDb: output,
      inputClip: this.inputClip,
      outputClip: this.outputClip,
    };
  }

  async unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.buildMaster();
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
    return this.ctx;
  }

  async ingestBuffer(trackId: TrackId, buffer: AudioBuffer) {
    await this.unlock();
    this.buffers.set(trackId, buffer);
  }

  async ingestMono(trackId: TrackId, samples: Float32Array, sampleRate: number) {
    const ctx = await this.unlock();
    const buffer = ctx.createBuffer(1, samples.length, sampleRate);
    const copy = new Float32Array(samples.length);
    copy.set(samples);
    buffer.copyToChannel(copy as unknown as Float32Array<ArrayBuffer>, 0);
    this.buffers.set(trackId, buffer);
  }

  async ingestFile(trackId: TrackId, file: File): Promise<ClipInfo> {
    const ctx = await this.unlock();
    const encoded = await file.arrayBuffer();
    const buffer = await ctx.decodeAudioData(encoded.slice(0));
    this.buffers.set(trackId, buffer);
    const samples = mixdown(buffer);
    return this.describe(file.name.replace(/\.[^.]+$/, ""), samples, buffer.sampleRate, buffer.duration, trackId);
  }

  describe(name: string, samples: Float32Array, sampleRate: number, duration: number, trackId: TrackId): ClipInfo {
    const role = trackId === "beat" ? "beat" : "vocal";
    return {
      name,
      duration,
      sampleRate,
      analysis: analyzeTake(samples, sampleRate, role),
      peaks: buildPeaks(samples),
    };
  }

  sync(snapshot: Snapshot) {
    this.loopOn = snapshot.loop;
    this.bpm = snapshot.bpm;
    this.selectedId = snapshot.selectedId;
    if (!this.ctx || !this.masterSum || !this.masterGain) return;
    const ctx = this.ctx;
    const anySolo = snapshot.tracks.some((track) => track.solo);
    for (const track of snapshot.tracks) {
      let chain = this.chains.get(track.id);
      if (!chain) {
        chain = this.createChain(ctx);
        this.chains.set(track.id, chain);
        chain.fader.connect(this.masterSum);
      }
      const sign = track.polarity ? -1 : 1;
      chain.trim.gain.setTargetAtTime(dbToGain(track.trimDb) * sign, ctx.currentTime, 0.015);
      chain.hpf.frequency.setTargetAtTime(Math.max(18, track.hpfHz), ctx.currentTime, 0.02);
      const audible = !track.mute && (!anySolo || track.solo);
      const level = audible ? track.volume : 0;
      chain.fader.gain.setTargetAtTime(level, ctx.currentTime, 0.015);
      this.ensureModules(ctx, chain, track.rack);
      for (const module of track.rack) {
        chain.modules.get(module.id)?.update(module.params, snapshot.bpm);
      }
      const orderKey = track.rack.map((module) => `${module.id}:${module.enabled ? 1 : 0}`).join("|");
      if (orderKey !== chain.orderKey) {
        chain.orderKey = orderKey;
        this.relink(chain, track.rack);
      }
    }
    this.masterGain.gain.setTargetAtTime(dbToGain(snapshot.masterDb), ctx.currentTime, 0.02);
  }

  async togglePlay() {
    if (this.playing) this.pause();
    else await this.play();
  }

  async play() {
    const ctx = await this.unlock();
    if (this.duration() <= 0) {
      this.onError?.("Load a take or hit Audition before you roll.");
      return;
    }
    this.stopSources();
    if (this.offset >= this.duration() - 0.03) this.offset = 0;
    const when = ctx.currentTime + 0.05;
    this.startedAt = when;
    let started = 0;
    for (const [id, buffer] of this.buffers) {
      if (this.recording && this.recordingTrack === id) continue;
      const chain = this.chains.get(id);
      if (!chain) continue;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(chain.entry);
      const offset = Math.min(this.offset, Math.max(0, buffer.duration - 0.01));
      if (buffer.duration - offset <= 0.01) continue;
      src.start(when, offset);
      this.sources.push(src);
      started += 1;
    }
    if (!started && !this.recording) return;
    this.playing = true;
    this.onTransport?.(true);
    window.clearTimeout(this.timer);
    this.watchEnd();
  }

  pause() {
    if (this.recording) {
      void this.finishRecording();
      return;
    }
    if (!this.playing) return;
    this.offset = Math.min(Math.max(0, this.position()), this.duration());
    this.playing = false;
    this.stopSources();
    window.clearTimeout(this.timer);
    this.onTransport?.(false);
  }

  stop() {
    if (this.recording) {
      void this.finishRecording();
      return;
    }
    this.playing = false;
    this.offset = 0;
    this.stopSources();
    window.clearTimeout(this.timer);
    this.onTransport?.(false);
  }

  seek(seconds: number) {
    const was = this.playing;
    this.offset = Math.min(Math.max(0, seconds), this.duration() || 0);
    if (was) void this.play();
  }

  async toggleRecord(trackId: TrackId) {
    if (this.recording) {
      await this.finishRecording();
      return;
    }
    try {
      const ctx = await this.unlock();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
        },
        video: false,
      });
      this.recStream = stream;
      this.mic = ctx.createMediaStreamSource(stream);
      const chain = this.chains.get(trackId);
      if (!chain) {
        this.onError?.("The rack isn't awake yet. Tap the console once and arm the track again.");
        this.stopMic();
        return;
      }
      this.mic.connect(chain.entry);
      const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const mime = types.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      this.chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) this.chunks.push(event.data);
      };
      recorder.start();
      this.mediaRecorder = recorder;
      this.recording = true;
      this.recordingTrack = trackId;
      this.onRecordState?.(true);
      this.offset = 0;
      await this.play();
    } catch {
      this.stopMic();
      this.recording = false;
      this.recordingTrack = null;
      this.onRecordState?.(false);
      this.onError?.("Mic stayed closed. Allow the microphone, and use headphones so the rack doesn't feed back.");
    }
  }

  private async finishRecording() {
    const recorder = this.mediaRecorder;
    const trackId = this.recordingTrack;
    if (!recorder || !trackId || !this.ctx) return;
    this.recording = false;
    this.recordingTrack = null;
    const blob = await new Promise<Blob>((resolve) => {
      recorder.addEventListener(
        "stop",
        () => resolve(new Blob(this.chunks, { type: recorder.mimeType || "audio/webm" })),
        { once: true },
      );
      if (recorder.state !== "inactive") recorder.stop();
      else resolve(new Blob(this.chunks, { type: recorder.mimeType || "audio/webm" }));
    });
    this.stopMic();
    this.mediaRecorder = null;
    this.offset = Math.min(Math.max(0, this.position()), this.duration() || 0);
    this.playing = false;
    this.stopSources();
    window.clearTimeout(this.timer);
    this.onTransport?.(false);
    this.onRecordState?.(false);
    try {
      const decoded = await this.ctx.decodeAudioData(await blob.arrayBuffer());
      this.buffers.set(trackId, decoded);
      const samples = mixdown(decoded);
      this.onRecorded?.({
        trackId,
        samples,
        sampleRate: decoded.sampleRate,
        duration: decoded.duration,
        name: "Mic take",
      });
    } catch {
      this.onError?.("The take recorded, but this browser couldn't decode it back into the rack.");
    }
  }

  private stopMic() {
    try {
      this.mic?.disconnect();
    } catch {
      /* noop */
    }
    this.mic = null;
    this.recStream?.getTracks().forEach((track) => track.stop());
    this.recStream = null;
  }

  private watchEnd = () => {
    if (!this.playing) return;
    const end = this.duration();
    if (end > 0 && this.position() >= end - 0.02) {
      if (this.loopOn && !this.recording) {
        this.offset = 0;
        void this.play();
        return;
      }
      if (this.recording) {
        void this.finishRecording();
        return;
      }
      this.playing = false;
      this.offset = 0;
      this.stopSources();
      this.onTransport?.(false);
      return;
    }
    this.timer = window.setTimeout(this.watchEnd, 80);
  };

  private stopSources() {
    for (const source of this.sources) {
      try {
        source.stop();
      } catch {
        /* not started */
      }
      safeDisconnect(source);
    }
    this.sources = [];
  }

  private buildMaster() {
    const ctx = this.ctx;
    if (!ctx) return;
    this.masterSum = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -1.2;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.08;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.9;
    this.masterAnalyser = ctx.createAnalyser();
    this.masterAnalyser.fftSize = 2048;
    this.masterSum.connect(limiter);
    limiter.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);
    this.masterGain.connect(this.masterAnalyser);
  }

  private createChain(ctx: AudioContext): TrackChain {
    const entry = ctx.createGain();
    const trim = ctx.createGain();
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.Q.value = 0.707;
    hpf.frequency.value = 80;
    const fader = ctx.createGain();
    const preAnalyser = ctx.createAnalyser();
    const stagedAnalyser = ctx.createAnalyser();
    const postAnalyser = ctx.createAnalyser();
    for (const analyser of [preAnalyser, stagedAnalyser, postAnalyser]) analyser.fftSize = 2048;
    entry.connect(preAnalyser);
    entry.connect(trim);
    trim.connect(hpf);
    trim.connect(stagedAnalyser);
    return {
      entry,
      trim,
      hpf,
      fader,
      preAnalyser,
      stagedAnalyser,
      postAnalyser,
      modules: new Map(),
      orderKey: "",
    };
  }

  private ensureModules(ctx: AudioContext, chain: TrackChain, rack: ModuleDef[]) {
    const live = new Set(rack.map((module) => module.id));
    for (const [id, built] of chain.modules) {
      if (!live.has(id)) {
        built.dispose();
        chain.modules.delete(id);
        chain.orderKey = "";
      }
    }
    for (const module of rack) {
      if (!chain.modules.has(module.id)) {
        chain.modules.set(module.id, this.buildModule(ctx, module));
        chain.orderKey = "";
      }
    }
  }

  private relink(chain: TrackChain, rack: ModuleDef[]) {
    safeDisconnect(chain.hpf);
    for (const built of chain.modules.values()) safeDisconnect(built.output);
    let node: AudioNode = chain.hpf;
    for (const module of rack) {
      if (!module.enabled) continue;
      const built = chain.modules.get(module.id);
      if (!built) continue;
      node.connect(built.input);
      node = built.output;
    }
    node.connect(chain.fader);
    node.connect(chain.postAnalyser);
  }

  private buildModule(ctx: AudioContext, module: ModuleDef): Built {
    switch (module.kind) {
      case "eq":
        return this.buildEq(ctx);
      case "comp":
        return this.buildComp(ctx);
      case "deess":
        return this.buildDeess(ctx);
      case "sat":
        return this.buildSat(ctx);
      case "space":
        return this.buildSpace(ctx);
      case "width":
        return this.buildWidth(ctx);
      case "limit":
        return this.buildLimit(ctx);
    }
  }

  private buildEq(ctx: AudioContext): Built {
    const low = ctx.createBiquadFilter();
    low.type = "lowshelf";
    low.frequency.value = 140;
    const body = ctx.createBiquadFilter();
    body.type = "peaking";
    body.frequency.value = 280;
    body.Q.value = 0.9;
    const presence = ctx.createBiquadFilter();
    presence.type = "peaking";
    presence.frequency.value = 3200;
    presence.Q.value = 0.9;
    const air = ctx.createBiquadFilter();
    air.type = "highshelf";
    air.frequency.value = 10000;
    low.connect(body);
    body.connect(presence);
    presence.connect(air);
    return {
      input: low,
      output: air,
      update: (params) => {
        const now = ctx.currentTime;
        low.gain.setTargetAtTime(params.low ?? 0, now, 0.02);
        body.gain.setTargetAtTime(params.body ?? 0, now, 0.02);
        presence.gain.setTargetAtTime(params.presence ?? 0, now, 0.02);
        air.gain.setTargetAtTime(params.air ?? 0, now, 0.02);
      },
      dispose: () => {
        safeDisconnect(low);
        safeDisconnect(body);
        safeDisconnect(presence);
        safeDisconnect(air);
      },
    };
  }

  private buildComp(ctx: AudioContext): Built {
    const comp = ctx.createDynamicsCompressor();
    const makeup = ctx.createGain();
    comp.connect(makeup);
    return {
      input: comp,
      output: makeup,
      update: (params) => {
        const now = ctx.currentTime;
        comp.threshold.setTargetAtTime(params.threshold ?? -18, now, 0.02);
        comp.ratio.setTargetAtTime(params.ratio ?? 3, now, 0.02);
        comp.attack.setTargetAtTime((params.attack ?? 12) / 1000, now, 0.02);
        comp.release.setTargetAtTime((params.release ?? 140) / 1000, now, 0.03);
        comp.knee.setTargetAtTime(8, now, 0.02);
        makeup.gain.setTargetAtTime(dbToGain(params.makeup ?? 0), now, 0.02);
      },
      dispose: () => {
        safeDisconnect(comp);
        safeDisconnect(makeup);
      },
    };
  }

  private buildDeess(ctx: AudioContext): Built {
    const filter = ctx.createBiquadFilter();
    filter.type = "peaking";
    filter.Q.value = 1.3;
    return {
      input: filter,
      output: filter,
      update: (params) => {
        const now = ctx.currentTime;
        filter.frequency.setTargetAtTime(params.freq ?? 7000, now, 0.02);
        filter.gain.setTargetAtTime(-(params.amount ?? 0), now, 0.02);
      },
      dispose: () => safeDisconnect(filter),
    };
  }

  private buildSat(ctx: AudioContext): Built {
    const input = ctx.createGain();
    const dry = ctx.createGain();
    const pre = ctx.createGain();
    const shaper = ctx.createWaveShaper();
    shaper.oversample = "2x";
    let curveKey = -1;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    const wet = ctx.createGain();
    const sum = ctx.createGain();
    input.connect(dry);
    dry.connect(sum);
    input.connect(pre);
    pre.connect(shaper);
    shaper.connect(tone);
    tone.connect(wet);
    wet.connect(sum);
    return {
      input,
      output: sum,
      update: (params) => {
        const now = ctx.currentTime;
        const drive = params.drive ?? 0.2;
        const mix = params.mix ?? 0.4;
        pre.gain.setTargetAtTime(1 + drive * 18, now, 0.02);
        dry.gain.setTargetAtTime(Math.cos(mix * 0.5 * Math.PI), now, 0.02);
        wet.gain.setTargetAtTime(Math.sin(mix * 0.5 * Math.PI) * 0.85, now, 0.02);
        tone.frequency.setTargetAtTime(2500 + (params.tone ?? 0.5) * 14000, now, 0.03);
        const key = Math.round(drive * 40);
        if (key !== curveKey) {
          curveKey = key;
          const cached = this.curveCache.get(key);
          const curve = cached ?? this.curve(key / 40);
          if (!cached) this.curveCache.set(key, curve);
          shaper.curve = curve as unknown as Float32Array<ArrayBuffer>;
        }
      },
      dispose: () => {
        for (const node of [input, dry, pre, shaper, tone, wet, sum]) safeDisconnect(node);
      },
    };
  }

  private curve(drive: number) {
    const size = 1024;
    const curve = new Float32Array(size);
    const amount = 1 + drive * 12;
    const norm = Math.tanh(amount);
    for (let i = 0; i < size; i++) {
      const x = (i / (size - 1)) * 2 - 1;
      curve[i] = Math.tanh(amount * x) / norm;
    }
    return curve;
  }

  private buildSpace(ctx: AudioContext): Built {
    const input = ctx.createGain();
    const dry = ctx.createGain();
    const delay = ctx.createDelay(1.5);
    const feedback = ctx.createGain();
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 4500;
    const delayWet = ctx.createGain();
    const verbSend = ctx.createGain();
    const verb = ctx.createConvolver();
    const verbWet = ctx.createGain();
    const sum = ctx.createGain();
    dry.gain.value = 1;
    input.connect(dry);
    dry.connect(sum);
    input.connect(delay);
    delay.connect(damp);
    damp.connect(feedback);
    feedback.connect(delay);
    damp.connect(delayWet);
    delayWet.connect(sum);
    input.connect(verbSend);
    verbSend.connect(verb);
    verb.connect(verbWet);
    verbWet.connect(sum);
    let irKey = "";
    return {
      input,
      output: sum,
      update: (params) => {
        const now = ctx.currentTime;
        const note = Math.round(params.delayNote ?? 1);
        const beats = NOTE_BEATS[Math.min(DELAY_NOTES.length - 1, Math.max(0, note))] ?? 0.5;
        const seconds = Math.min(1.25, (60 / Math.max(40, this.bpm)) * beats);
        delay.delayTime.setTargetAtTime(seconds, now, 0.03);
        feedback.gain.setTargetAtTime(params.feedback ?? 0.25, now, 0.02);
        delayWet.gain.setTargetAtTime(params.delayMix ?? 0, now, 0.02);
        verbWet.gain.setTargetAtTime((params.verbMix ?? 0) * 1.4, now, 0.02);
        const decay = params.decay ?? 0.35;
        const key = `${Math.round(decay * 12)}`;
        if (key !== irKey) {
          irKey = key;
          verb.buffer = this.impulse(0.35 + decay * 2.8, 0.35 + (1 - decay) * 0.4);
        }
      },
      dispose: () => {
        for (const node of [input, dry, delay, feedback, damp, delayWet, verbSend, verb, verbWet, sum]) {
          safeDisconnect(node);
        }
      },
    };
  }

  private impulse(seconds: number, damp: number) {
    const ctx = this.ctx;
    if (!ctx) throw new Error("no audio");
    const key = `${seconds.toFixed(2)}:${damp.toFixed(2)}:${ctx.sampleRate}`;
    const cached = this.irCache.get(key);
    if (cached) return cached;
    const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let previous = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const env = Math.pow(1 - t, 1.6) * Math.exp(-2.4 * t);
        const noise = Math.random() * 2 - 1;
        previous = previous * damp + noise * (1 - damp);
        data[i] = previous * env * (channel === 0 ? 1 : 0.92);
      }
    }
    this.irCache.set(key, buffer);
    return buffer;
  }

  private buildWidth(ctx: AudioContext): Built {
    const input = ctx.createGain();
    const delay = ctx.createDelay(0.05);
    const wet = ctx.createGain();
    const invert = ctx.createGain();
    invert.gain.value = -1;
    const dryL = ctx.createGain();
    const dryR = ctx.createGain();
    const merger = ctx.createChannelMerger(2);
    input.connect(dryL);
    input.connect(dryR);
    dryL.connect(merger, 0, 0);
    dryR.connect(merger, 0, 1);
    input.connect(delay);
    delay.connect(wet);
    wet.connect(merger, 0, 1);
    wet.connect(invert);
    invert.connect(merger, 0, 0);
    return {
      input,
      output: merger,
      update: (params) => {
        const now = ctx.currentTime;
        const amount = params.amount ?? 0;
        delay.delayTime.setTargetAtTime((params.delayMs ?? 16) / 1000, now, 0.02);
        dryL.gain.setTargetAtTime(1 - amount * 0.2, now, 0.02);
        dryR.gain.setTargetAtTime(1 - amount * 0.2, now, 0.02);
        wet.gain.setTargetAtTime(amount * 0.75, now, 0.02);
      },
      dispose: () => {
        for (const node of [input, delay, wet, invert, dryL, dryR, merger]) safeDisconnect(node);
      },
    };
  }

  private buildLimit(ctx: AudioContext): Built {
    const drive = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.ratio.value = 20;
    comp.knee.value = 0;
    comp.attack.value = 0.002;
    comp.release.value = 0.06;
    drive.connect(comp);
    return {
      input: drive,
      output: comp,
      update: (params) => {
        const now = ctx.currentTime;
        drive.gain.setTargetAtTime(dbToGain(params.push ?? 0), now, 0.02);
        comp.threshold.setTargetAtTime(params.ceiling ?? -1, now, 0.02);
      },
      dispose: () => {
        safeDisconnect(drive);
        safeDisconnect(comp);
      },
    };
  }

  private level(analyser: AnalyserNode) {
    analyser.getFloatTimeDomainData(this.time);
    let peak = 0;
    for (let i = 0; i < this.time.length; i++) peak = Math.max(peak, Math.abs(this.time[i]!));
    return 20 * Math.log10(peak + 1e-8);
  }

  private ballistic(slot: "inputDb" | "stagedDb" | "outputDb", value: number) {
    const previous = this.hold[slot];
    const next = value > previous ? value : previous - 3.5;
    this.hold[slot] = next;
    return next;
  }
}

export const engine = new RackEngine();
