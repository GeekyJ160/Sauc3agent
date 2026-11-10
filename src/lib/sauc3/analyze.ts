import {
  NOTE_NAMES,
  clamp,
  type AssistNote,
  type Bands,
  type Fix,
  type KeyResult,
  type StageResult,
  type TakeAnalysis,
} from "@/lib/sauc3/model";

const MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];

function fftInPlace(re: Float64Array, im: Float64Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]!;
      re[i] = re[j]!;
      re[j] = tr;
      const ti = im[i]!;
      im[i] = im[j]!;
      im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wlenRe = Math.cos(ang);
    const wlenIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      const half = len >> 1;
      for (let j = 0; j < half; j++) {
        const uRe = re[i + j]!;
        const uIm = im[i + j]!;
        const vRe = re[i + j + half]! * wRe - im[i + j + half]! * wIm;
        const vIm = re[i + j + half]! * wIm + im[i + j + half]! * wRe;
        re[i + j] = uRe + vRe;
        im[i + j] = uIm + vIm;
        re[i + j + half] = uRe - vRe;
        im[i + j + half] = uIm - vIm;
        const next = wRe * wlenRe - wIm * wlenIm;
        wIm = wRe * wlenIm + wIm * wlenRe;
        wRe = next;
      }
    }
  }
}

function rotate(profile: number[], tonic: number) {
  const out = new Array<number>(12).fill(0);
  for (let i = 0; i < 12; i++) out[(i + tonic) % 12] = profile[i]!;
  return out;
}

function pearson(a: number[], b: number[]) {
  const n = a.length;
  let meanA = 0;
  let meanB = 0;
  for (let i = 0; i < n; i++) {
    meanA += a[i]!;
    meanB += b[i]!;
  }
  meanA /= n;
  meanB /= n;
  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i]! - meanA;
    const db = b[i]! - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  return num / Math.sqrt(denA * denB + 1e-12);
}

function bandMean(mag: Float64Array, sampleRate: number, lo: number, hi: number) {
  const nfft = mag.length * 2;
  const start = Math.max(1, Math.floor((lo * nfft) / sampleRate));
  const end = Math.min(mag.length - 1, Math.ceil((hi * nfft) / sampleRate));
  if (end <= start) return 0;
  let sum = 0;
  for (let i = start; i <= end; i++) sum += mag[i]!;
  return sum / (end - start + 1);
}

function fundamental(samples: Float32Array, offset: number, length: number, sampleRate: number) {
  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.min(length - 1, Math.floor(sampleRate / 70));
  if (maxLag <= minLag) return null;
  let bestLag = -1;
  let best = 0;
  const stride = 4;
  const score = (lag: number) => {
    let corr = 0;
    let left = 0;
    let right = 0;
    const limit = length - lag;
    for (let i = 0; i < limit; i += stride) {
      const a = samples[offset + i] ?? 0;
      const b = samples[offset + i + lag] ?? 0;
      corr += a * b;
      left += a * a;
      right += b * b;
    }
    return corr / Math.sqrt(left * right + 1e-12);
  };
  for (let lag = minLag; lag <= maxLag; lag += 2) {
    const norm = score(lag);
    if (norm > best) {
      best = norm;
      bestLag = lag;
    }
  }
  if (bestLag < 0 || best < 0.42) return null;
  const from = Math.max(minLag, bestLag - 2);
  const to = Math.min(maxLag, bestLag + 2);
  for (let lag = from; lag <= to; lag++) {
    const norm = score(lag);
    if (norm > best) {
      best = norm;
      bestLag = lag;
    }
  }
  let energy = 0;
  for (let i = 0; i < length; i += stride) energy += (samples[offset + i] ?? 0) ** 2;
  return { freq: sampleRate / bestLag, weight: energy * best };
}

export function detectKey(samples: Float32Array, sampleRate: number): { key: KeyResult; bands: Bands } {
  const emptyBands: Bands = { mud: 0, presence: 0, sib: 0, air: 0 };
  const unknown: KeyResult = {
    label: "No key",
    root: 0,
    mode: "unknown",
    confidence: 0,
    chroma: new Array<number>(12).fill(0),
  };
  const frame = 2048;
  if (samples.length < frame) return { key: unknown, bands: emptyBands };
  const hop = 2048;
  const total = Math.floor((samples.length - frame) / hop);
  const maxFrames = 72;
  const step = Math.max(1, Math.ceil((total + 1) / maxFrames));
  const chroma = new Array<number>(12).fill(0);
  const bandAcc = { mud: 0, presence: 0, sib: 0, air: 0, n: 0 };
  let visited = 0;
  let pitched = 0;
  const window = new Float64Array(4096);
  for (let i = 0; i < 4096; i++) window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / 4095));

  for (let index = 0; index <= total; index += step) {
    const offset = index * hop;
    visited += 1;
    const pitch = fundamental(samples, offset, frame, sampleRate);
    if (pitch && pitch.freq > 70 && pitch.freq < 1100) {
      pitched += 1;
      const midi = Math.round(69 + 12 * Math.log2(pitch.freq / 440));
      const pc = ((midi % 12) + 12) % 12;
      chroma[pc] += pitch.weight;
    }
    if (offset + 4096 <= samples.length && bandAcc.n < 20) {
      const re = new Float64Array(4096);
      const im = new Float64Array(4096);
      for (let i = 0; i < 4096; i++) re[i] = (samples[offset + i] ?? 0) * window[i]!;
      fftInPlace(re, im);
      const mag = new Float64Array(2048);
      let energy = 0;
      for (let i = 1; i < mag.length; i++) {
        mag[i] = Math.hypot(re[i]!, im[i]!);
        energy += mag[i]!;
      }
      if (energy > 0) {
        bandAcc.n += 1;
        bandAcc.mud += bandMean(mag, sampleRate, 180, 400);
        bandAcc.presence += bandMean(mag, sampleRate, 1800, 4500);
        bandAcc.sib += bandMean(mag, sampleRate, 5500, 9000);
        bandAcc.air += bandMean(mag, sampleRate, 9000, 14000);
      }
    }
  }

  const bands: Bands =
    bandAcc.n === 0
      ? emptyBands
      : {
          mud: bandAcc.mud / bandAcc.n,
          presence: bandAcc.presence / bandAcc.n,
          sib: bandAcc.sib / bandAcc.n,
          air: bandAcc.air / bandAcc.n,
        };

  const totalEnergy = chroma.reduce((sum, value) => sum + value, 0);
  if (totalEnergy < 1e-8 || pitched < 6 || pitched / Math.max(1, visited) < 0.2) return { key: unknown, bands };
  const norm = chroma.map((value) => value / totalEnergy);

  let best = { score: -Infinity, root: 0, mode: "minor" as "major" | "minor" };
  let second = -Infinity;
  for (let tonic = 0; tonic < 12; tonic++) {
    for (const mode of ["major", "minor"] as const) {
      const profile = mode === "major" ? MAJOR : MINOR;
      const corr = pearson(norm, rotate(profile, tonic));
      const scale = mode === "major" ? MAJOR_SCALE : MINOR_SCALE;
      const set = new Set(scale.map((degree) => (degree + tonic) % 12));
      let inside = 0;
      let outside = 0;
      for (let i = 0; i < 12; i++) {
        if (set.has(i)) inside += norm[i]!;
        else outside += norm[i]!;
      }
      const third = norm[(tonic + (mode === "major" ? 4 : 3)) % 12]!;
      const score =
        corr * 0.65 +
        (inside / (inside + outside + 1e-9)) * 0.25 +
        norm[tonic]! * 1.35 +
        norm[(tonic + 7) % 12]! * 0.35 +
        third * 0.7;
      if (score > best.score) {
        second = best.score;
        best = { score, root: tonic, mode };
      } else if (score > second) {
        second = score;
      }
    }
  }

  const margin = best.score - (Number.isFinite(second) ? second : best.score);
  const confidence = clamp(margin / 0.22, 0, 1);
  return {
    key: {
      label: `${NOTE_NAMES[best.root]} ${best.mode}`,
      root: best.root,
      mode: best.mode,
      confidence,
      chroma: norm,
    },
    bands,
  };
}

export function stageAudio(samples: Float32Array): StageResult {
  let peak = 0;
  let sum = 0;
  const count = samples.length || 1;
  for (let i = 0; i < samples.length; i++) {
    const value = samples[i]!;
    const abs = Math.abs(value);
    if (abs > peak) peak = abs;
    sum += value * value;
  }
  const rms = Math.sqrt(sum / count);
  const peakDb = 20 * Math.log10(peak + 1e-8);
  const rmsDb = 20 * Math.log10(rms + 1e-8);
  let suggested = -18 - rmsDb;
  if (peakDb + suggested > -1) suggested = -1 - peakDb;
  suggested = clamp(Math.round(suggested * 10) / 10, -24, 18);
  const clipped = peak >= 0.999;
  let zone: StageResult["zone"] = "staged";
  if (clipped || peakDb > -0.3) zone = "clip";
  else if (rmsDb > -14) zone = "hot";
  else if (rmsDb < -26) zone = "quiet";
  return {
    peakDb,
    rmsDb,
    crestDb: peakDb - rmsDb,
    suggestedTrimDb: suggested,
    clipped,
    zone,
  };
}

function pushNote(notes: AssistNote[], note: AssistNote) {
  notes.push(note);
}

export function buildNotes(
  key: KeyResult,
  stage: StageResult,
  bands: Bands,
  role: "vocal" | "beat",
): { notes: AssistNote[]; fixes: Fix[] } {
  const notes: AssistNote[] = [];
  const fixes: Fix[] = [];

  if (stage.zone === "clip") {
    const fix: Fix = { op: "trim", db: stage.suggestedTrimDb };
    fixes.push(fix);
    pushNote(notes, {
      id: "clip",
      tone: "warn",
      title: "Clipping the converters",
      detail: `Peak ${stage.peakDb.toFixed(1)} dB. Pull the trim to ${stage.suggestedTrimDb.toFixed(1)} dB before the rack sees it.`,
      fixes: [fix],
    });
  } else if (stage.zone === "hot") {
    const fix: Fix = { op: "trim", db: stage.suggestedTrimDb };
    fixes.push(fix);
    pushNote(notes, {
      id: "hot",
      tone: "fix",
      title: "Printed hot",
      detail: `RMS ${stage.rmsDb.toFixed(1)} dB, crest ${stage.crestDb.toFixed(1)} dB. Stage to −18 so the comp isn't already slamming.`,
      fixes: [fix],
    });
  } else if (stage.zone === "quiet") {
    const fix: Fix = { op: "trim", db: stage.suggestedTrimDb };
    fixes.push(fix);
    pushNote(notes, {
      id: "quiet",
      tone: "fix",
      title: "Under the noise floor",
      detail: `RMS ${stage.rmsDb.toFixed(1)} dB. Lift ${stage.suggestedTrimDb.toFixed(1)} dB, then stop before the peak crosses −1.`,
      fixes: [fix],
    });
  } else {
    pushNote(notes, {
      id: "staged",
      tone: "good",
      title: "Gain is in the pocket",
      detail: `RMS ${stage.rmsDb.toFixed(1)} dB, peak ${stage.peakDb.toFixed(1)} dB. Leave the trim unless you want color from the saturator.`,
      fixes: [],
    });
  }

  if (key.mode === "unknown" || key.confidence < 0.22) {
    pushNote(notes, {
      id: "key-shy",
      tone: "warn",
      title: "Key is shy",
      detail: "Not enough pitched energy to trust. A sung phrase with a clear tonic will lock harder than a drum loop.",
      fixes: [],
    });
  } else {
    pushNote(notes, {
      id: "key",
      tone: "good",
      title: key.label,
      detail: `${Math.round(key.confidence * 100)}% lock. Scale-aware notes on the tuner follow this tonic.`,
      fixes: [],
    });
  }

  if (role === "vocal") {
    const presence = bands.presence + 1e-9;
    if (bands.sib / presence > 1.05) {
      const fix: Fix = { op: "param", kind: "deess", key: "amount", value: 5.5, enable: true };
      const freq: Fix = { op: "param", kind: "deess", key: "freq", value: 7200, enable: true };
      fixes.push(fix, freq);
      pushNote(notes, {
        id: "sib",
        tone: "fix",
        title: "Sibilance is leading",
        detail: "5–9 kHz outweighs the presence band. De-ess around 7.2 kHz before you add air.",
        fixes: [fix, freq],
      });
    }
    if (bands.mud / presence > 1.25) {
      const fix: Fix = { op: "param", kind: "eq", key: "body", value: -2.6, enable: true };
      fixes.push(fix);
      pushNote(notes, {
        id: "mud",
        tone: "fix",
        title: "Low-mid haze",
        detail: "Energy piles up around 180–400 Hz. A small Body cut opens the lyric without thinning the chest.",
        fixes: [fix],
      });
    }
    if (bands.air / presence < 0.45 && stage.zone !== "clip") {
      const fix: Fix = { op: "param", kind: "eq", key: "air", value: 2.4, enable: true };
      fixes.push(fix);
      pushNote(notes, {
        id: "air",
        tone: "fix",
        title: "Top is shy",
        detail: "Air above 9 kHz is thin next to the mids. A gentle shelf, after de-ess, keeps it expensive not brittle.",
        fixes: [fix],
      });
    }
    if (stage.crestDb > 16) {
      const fix: Fix = { op: "param", kind: "comp", key: "threshold", value: -20, enable: true };
      fixes.push(fix);
      pushNote(notes, {
        id: "dynamic",
        tone: "fix",
        title: "Wide dynamics",
        detail: `Crest ${stage.crestDb.toFixed(1)} dB. A medium squeeze will keep the quiet words in the beat.`,
        fixes: [fix],
      });
    }
  }

  return { notes, fixes };
}

export function analyzeTake(samples: Float32Array, sampleRate: number, role: "vocal" | "beat"): TakeAnalysis {
  const stage = stageAudio(samples);
  const { key, bands } = detectKey(samples, sampleRate);
  const { notes, fixes } = buildNotes(key, stage, bands, role);
  return { key, stage, bands, notes, fixes };
}

export function buildPeaks(samples: Float32Array, buckets = 360) {
  const count = Math.max(1, Math.min(buckets, samples.length));
  const peaks: { min: number; max: number }[] = [];
  const size = Math.floor(samples.length / count) || 1;
  for (let i = 0; i < count; i++) {
    const start = i * size;
    const end = i === count - 1 ? samples.length : Math.min(samples.length, start + size);
    let min = 0;
    let max = 0;
    for (let j = start; j < end; j++) {
      const value = samples[j]!;
      if (value < min) min = value;
      if (value > max) max = value;
    }
    peaks.push({ min, max });
  }
  return peaks;
}

function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function addVoice(
  data: Float32Array,
  sampleRate: number,
  midi: number,
  start: number,
  dur: number,
  amp: number,
  sib: boolean,
) {
  const f0 = midiToFreq(midi);
  const i0 = Math.max(0, Math.floor(start * sampleRate));
  const i1 = Math.min(data.length, Math.floor((start + dur) * sampleRate));
  const harms = [1, 0.78, 0.5, 0.32, 0.18, 0.1, 0.05];
  for (let i = i0; i < i1; i++) {
    const t = (i - i0) / sampleRate;
    const attack = Math.min(1, t / 0.018);
    const release = Math.min(1, Math.max(0, dur - t) / 0.05);
    const env = attack * release;
    const vib = f0 * (1 + 0.007 * Math.sin(2 * Math.PI * 5.1 * (start + t)));
    let sample = 0;
    for (let h = 0; h < harms.length; h++) {
      sample += Math.sin(2 * Math.PI * vib * (h + 1) * t + h * 0.4) * harms[h]!;
    }
    sample *= 0.32;
    if (sib && t < 0.055) {
      const noise = Math.sin(2 * Math.PI * 7200 * t + (i % 17)) * ((i * 17) % 7) * 0.15;
      sample += (Math.random() * 2 - 1) * 0.35 * (1 - t / 0.055) + noise * (1 - t / 0.055);
    }
    data[i] = (data[i] ?? 0) + sample * env * amp;
  }
}

function addKick(data: Float32Array, sampleRate: number, start: number) {
  const i0 = Math.floor(start * sampleRate);
  const len = Math.floor(0.18 * sampleRate);
  for (let i = 0; i < len && i0 + i < data.length; i++) {
    const t = i / sampleRate;
    const f = 140 * Math.exp(-t * 18) + 46;
    const env = Math.exp(-t * 10);
    data[i0 + i] = (data[i0 + i] ?? 0) + Math.sin(2 * Math.PI * f * t) * env * 0.42;
  }
}

function addSnare(data: Float32Array, sampleRate: number, start: number) {
  const i0 = Math.floor(start * sampleRate);
  const len = Math.floor(0.12 * sampleRate);
  for (let i = 0; i < len && i0 + i < data.length; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 22);
    const body = Math.sin(2 * Math.PI * 188 * t) * Math.exp(-t * 30);
    const noise = (Math.random() * 2 - 1) * 0.7;
    data[i0 + i] = (data[i0 + i] ?? 0) + (body + noise) * env * 0.22;
  }
}

function addHat(data: Float32Array, sampleRate: number, start: number, amp: number) {
  const i0 = Math.floor(start * sampleRate);
  const len = Math.floor(0.035 * sampleRate);
  for (let i = 0; i < len && i0 + i < data.length; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 80);
    data[i0 + i] = (data[i0 + i] ?? 0) + (Math.random() * 2 - 1) * env * amp;
  }
}

export function makeDemo(sampleRate = 44100) {
  const seconds = 8;
  const vocal = new Float32Array(seconds * sampleRate);
  const beat = new Float32Array(seconds * sampleRate);
  const phrase: { midi: number; t: number; dur: number; sib?: boolean; amp?: number }[] = [
    { midi: 66, t: 0.15, dur: 0.55, amp: 1 },
    { midi: 69, t: 0.72, dur: 0.38, sib: true, amp: 0.85 },
    { midi: 73, t: 1.15, dur: 0.48, amp: 0.9 },
    { midi: 71, t: 1.68, dur: 0.32, amp: 0.75 },
    { midi: 69, t: 2.05, dur: 0.42, sib: true, amp: 0.88 },
    { midi: 66, t: 2.52, dur: 0.7, amp: 1 },
    { midi: 68, t: 3.35, dur: 0.3, amp: 0.7 },
    { midi: 73, t: 3.7, dur: 0.46, sib: true, amp: 0.92 },
    { midi: 76, t: 4.22, dur: 0.4, amp: 0.8 },
    { midi: 73, t: 4.68, dur: 0.36, amp: 0.78 },
    { midi: 69, t: 5.1, dur: 0.4, sib: true, amp: 0.86 },
    { midi: 66, t: 5.55, dur: 0.85, amp: 1 },
    { midi: 64, t: 6.5, dur: 0.28, amp: 0.66 },
    { midi: 66, t: 6.85, dur: 0.9, amp: 0.98 },
  ];
  for (const note of phrase) {
    addVoice(vocal, sampleRate, note.midi, note.t, note.dur, note.amp ?? 0.8, Boolean(note.sib));
  }
  for (let i = 0; i < vocal.length; i++) {
    const driven = Math.tanh(vocal[i]! * 2.4);
    vocal[i] = driven * 0.92;
  }

  const bpm = 140;
  const beatSec = 60 / bpm;
  const beats = Math.floor(seconds / beatSec);
  for (let step = 0; step < beats; step++) {
    const t = step * beatSec;
    if (step % 2 === 0) addKick(beat, sampleRate, t);
    if (step % 4 === 2) addSnare(beat, sampleRate, t);
    addHat(beat, sampleRate, t, step % 2 ? 0.05 : 0.08);
    addHat(beat, sampleRate, t + beatSec * 0.5, 0.04);
  }
  return { vocal, beat, sampleRate, bpm, vocalName: "Demo vocal — printed hot", beatName: "Demo bed — 140" };
}
