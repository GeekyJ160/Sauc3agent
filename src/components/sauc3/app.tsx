import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Pause,
  Play,
  Power,
  Repeat,
  Save,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { Fader, Knob, MeterBridge } from "@/components/sauc3/controls";
import { LiveMic, SpokenLine } from "@/components/sauc3/mic";
import { engine } from "@/lib/sauc3/engine";
import {
  MODULE_SPECS,
  NOTE_NAMES,
  fmtDb,
  fmtParam,
  type ClipInfo,
  type TrackId,
} from "@/lib/sauc3/model";
import { PRESETS, presetById } from "@/lib/sauc3/presets";
import { persistSession, readPersisted, useSession } from "@/lib/sauc3/store";

const CHIPS = ["warmer, like tape", "more air", "more room", "tighter", "de-ess it", "dry it out", "wider", "canyon moon"];

function syncEngine() {
  const state = useSession.getState();
  engine.sync({
    tracks: state.tracks,
    selectedId: state.selectedId,
    bpm: state.bpm,
    loop: state.loop,
    masterDb: state.masterDb,
  });
}

export function Sauc3App() {
  const tracks = useSession((state) => state.tracks);
  const selectedId = useSession((state) => state.selectedId);
  const bpm = useSession((state) => state.bpm);
  const loop = useSession((state) => state.loop);
  const mode = useSession((state) => state.mode);
  const masterDb = useSession((state) => state.masterDb);
  const playing = useSession((state) => state.playing);
  const recording = useSession((state) => state.recording);
  const clips = useSession((state) => state.clips);
  const treatments = useSession((state) => state.treatments);
  const log = useSession((state) => state.log);
  const ready = useSession((state) => state.ready);
  const fileRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  const track = tracks.find((item) => item.id === selectedId) ?? tracks[0]!;
  const clip = clips[selectedId];
  const preset = presetById(track.presetId);
  const signature = useMemo(
    () => JSON.stringify({ tracks, selectedId, bpm, loop, masterDb }),
    [tracks, selectedId, bpm, loop, masterDb],
  );

  useEffect(() => {
    setMounted(true);
    const saved = readPersisted();
    if (saved) useSession.getState().hydrate(saved);
    else useSession.setState({ ready: true });
    engine.onTransport = (next) => useSession.getState().setPlaying(next);
    engine.onRecordState = (next) => useSession.getState().setRecording(next);
    engine.onError = (message) => useSession.getState().pushLine("agent", message);
    engine.onRecorded = (payload) => {
      const printed = engine.describe(
        payload.name,
        payload.samples,
        payload.sampleRate,
        payload.duration,
        payload.trackId,
      );
      useSession.getState().setClip(payload.trackId, printed);
      const key = printed.analysis.key;
      useSession.getState().pushLine(
        "agent",
        `Mic take is in. ${key.label} at ${Math.round(key.confidence * 100)}% lock, RMS ${printed.analysis.stage.rmsDb.toFixed(1)} dB. Use headphones on the next pass.`,
      );
      syncEngine();
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.code !== "Space") return;
      event.preventDefault();
      void engine.togglePlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    syncEngine();
  }, [signature]);

  useEffect(() => {
    if (!ready) return;
    persistSession();
  }, [treatments, mode, bpm, ready]);

  async function takeFile(file: File | undefined) {
    if (!file) return;
    try {
      const printed = await engine.ingestFile(selectedId, file);
      useSession.getState().setClip(selectedId, printed);
      syncEngine();
      const key = printed.analysis.key;
      useSession.getState().pushLine(
        "agent",
        `${printed.name} on ${track.name}. ${key.mode === "unknown" ? "No stable key" : key.label} · peak ${printed.analysis.stage.peakDb.toFixed(1)} dB · RMS ${printed.analysis.stage.rmsDb.toFixed(1)} dB.`,
      );
    } catch {
      useSession.getState().pushLine("agent", "That file wouldn't decode. Try wav, mp3, or m4a.");
    }
  }

  const flow = [
    "STAGE",
    ...track.rack.filter((module) => module.enabled).map((module) => MODULE_SPECS[module.kind].title),
    "MASTER",
  ].join("  →  ");

  if (!mounted) {
    return (
      <main className="min-h-dvh bg-bg px-4 py-6 text-fg">
        <p className="font-mono-num text-xs tracking-widest text-signal uppercase">Vocal rack</p>
        <h1 className="text-xl font-semibold tracking-widest">SAUC3 AGENT</h1>
      </main>
    );
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg text-fg select-none">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 p-3 lg:h-dvh lg:min-h-0 lg:p-4">
        <header className="flex flex-wrap items-center gap-4 rounded-panel bg-surface p-3 shadow-ring">
          <div className="mr-auto min-w-0">
            <p className="font-mono-num text-xs tracking-widest text-signal uppercase">Vocal rack</p>
            <h1 className="text-xl font-semibold tracking-widest">
              SAUC3 <span className="text-muted">AGENT</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <TransportButton
              label={playing ? "Pause" : "Play"}
              hot={playing}
              onClick={() => void engine.togglePlay()}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
            </TransportButton>
            <TransportButton label="Stop" onClick={() => engine.stop()}>
              <Square className="size-3.5 fill-current" />
            </TransportButton>
            <TransportButton
              label={recording ? "Stop recording" : "Record"}
              hot={recording}
              danger
              onClick={() => void engine.toggleRecord(selectedId)}
            >
              <span className={`size-3 rounded-full ${recording ? "bg-fg" : "bg-clip"}`} />
            </TransportButton>
            <TransportButton label="Loop" hot={loop} onClick={() => useSession.getState().setLoop(!loop)}>
              <Repeat className="size-4" />
            </TransportButton>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Readout label="Key" value={clip ? clip.analysis.key.label : "—"} />
            <Readout
              label="Stage"
              value={clip ? clip.analysis.stage.zone.toUpperCase() : "WAIT"}
              warn={clip?.analysis.stage.zone === "clip" || clip?.analysis.stage.zone === "hot"}
            />
            <label className="flex h-11 items-center gap-2 rounded-well bg-inset px-3">
              <span className="text-xs tracking-widest text-muted uppercase">BPM</span>
              <input
                className="font-mono-num w-12 bg-transparent text-sm text-fg focus:outline-none"
                inputMode="numeric"
                value={bpm}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next)) useSession.getState().setBpm(Math.min(240, Math.max(40, Math.round(next))));
                }}
              />
            </label>
          </div>
          <MeterBridge />
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
            <Panel title="Bay" eyebrow="Tracks">
              <ul className="flex flex-col gap-2">
                {tracks.map((item) => (
                  <li key={item.id}>
                    <TrackRow id={item.id} active={item.id === selectedId} clip={clips[item.id]} />
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Sauces" eyebrow="Presets">
              <ul className="flex flex-col gap-1">
                {PRESETS.filter((item) => (track.role === "beat" ? true : !item.forBeat) || item.id === track.presetId).map(
                  (item) => {
                    const active = item.id === track.presetId;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => useSession.getState().loadPreset(item.id)}
                          className={`flex h-11 w-full items-center gap-2 rounded-well px-3 text-left ${
                            active ? "bg-inset shadow-ring-strong" : "hover:bg-inset"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${active ? "bg-signal" : "bg-line"}`} />
                          <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                          <span className="font-mono-num text-xs text-muted uppercase">{item.tag}</span>
                        </button>
                      </li>
                    );
                  },
                )}
              </ul>
            </Panel>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-col gap-3">
            <section
              className={`rounded-panel bg-surface p-3 shadow-ring ${dragOver ? "shadow-ring-strong" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                void takeFile(event.dataTransfer.files[0]);
              }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-widest text-muted uppercase">{track.hint}</p>
                  <h2 className="truncate text-lg font-medium">
                    {clip?.name ?? `${track.name} is empty`}
                    {track.custom ? <span className="text-muted"> · edited</span> : null}
                  </h2>
                </div>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-well bg-inset px-3 text-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="size-4" />
                  Load
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-well bg-signal px-3 text-sm font-medium text-bg"
                  onClick={() => void useSession.getState().audition()}
                >
                  Audition
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(event) => {
                    void takeFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </div>
              <Waveform clip={clip} />
              <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                <Headphones className="size-3.5 shrink-0" />
                Monitoring is wet. The file stays dry, so you can restage after the take. Space plays.
              </p>
            </section>

            <section className="overflow-hidden rounded-panel bg-surface shadow-ring">
              <form
                className="flex flex-col lg:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  const input = promptRef.current;
                  if (!input) return;
                  useSession.getState().ask(input.value);
                  input.value = "";
                }}
              >
                <LiveMic
                  playing={playing}
                  recording={recording}
                  agentLineId={log.filter((line) => line.role === "agent").at(-1)?.id ?? ""}
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-4">
                  <div>
                    <p className="text-xs tracking-widest text-signal uppercase">Mic · live</p>
                    <SpokenLine
                      text={
                        log.filter((line) => line.role === "agent").at(-1)?.text ??
                        "Tap an example and I'll rebuild the rack."
                      }
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-xs tracking-widest text-muted uppercase">Examples</p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          className="h-11 shrink-0 rounded-full bg-inset px-4 text-sm text-fg"
                          onClick={() => useSession.getState().ask(chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-well bg-inset px-3">
                    <input
                      ref={promptRef}
                      className="h-11 min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
                      placeholder="Warm tape, less harsh, a small room behind the vocal"
                      aria-label="Describe the rack"
                    />
                    <button
                      type="submit"
                      className="grid size-11 place-items-center rounded-full bg-signal text-sm font-semibold text-bg"
                      aria-label="Build rack"
                    >
                      ↑
                    </button>
                  </div>
                </div>
              </form>
            </section>

            <section className="flex min-h-0 flex-1 flex-col gap-3 lg:overflow-y-auto">
              <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                <div className="min-w-0">
                  <p className="text-xs tracking-widest text-muted uppercase">Rack · {preset.name}</p>
                  <p className="truncate font-mono-num text-xs text-fg">{flow}</p>
                </div>
                <div className="flex rounded-well bg-inset p-1">
                  {(["simple", "advanced"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`h-11 rounded px-3 text-xs tracking-widest uppercase ${
                        mode === item ? "bg-face text-fg" : "text-muted"
                      }`}
                      onClick={() => useSession.getState().setMode(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <article className="rounded-panel bg-face p-3 shadow-ring">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono-num text-xs text-muted">01</span>
                  <h3 className="text-sm font-semibold tracking-widest">STAGE</h3>
                  <span className="text-xs text-muted">Pinned · gain before the rack</span>
                  <button
                    type="button"
                    className="ml-auto h-11 rounded-well bg-signal px-3 text-sm font-medium text-bg"
                    onClick={() => useSession.getState().stageToTarget()}
                  >
                    Stage to −18
                  </button>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <Knob
                    label="Trim"
                    value={track.trimDb}
                    min={-24}
                    max={18}
                    step={0.1}
                    display={fmtDb(track.trimDb)}
                    defaultValue={0}
                    onChange={(value) => useSession.getState().setTrim(value)}
                  />
                  <Knob
                    label="HPF"
                    value={track.hpfHz}
                    min={20}
                    max={240}
                    step={1}
                    display={`${Math.round(track.hpfHz)}`}
                    defaultValue={preset.hpfHz}
                    onChange={(value) => useSession.getState().setHpf(value)}
                  />
                  <button
                    type="button"
                    className={`h-11 rounded-well px-3 text-sm ${track.polarity ? "bg-signal text-bg" : "bg-inset text-fg"}`}
                    onClick={() => useSession.getState().togglePolarity()}
                  >
                    {track.polarity ? "Polarity flipped" : "Polarity"}
                  </button>
                  <p className="min-w-0 flex-1 pb-2 text-sm text-muted">
                    {clip
                      ? `Source peak ${fmtDb(clip.analysis.stage.peakDb)} · RMS ${fmtDb(clip.analysis.stage.rmsDb)} · crest ${clip.analysis.stage.crestDb.toFixed(1)} · suggest ${fmtDb(clip.analysis.stage.suggestedTrimDb)}`
                      : "Waiting on audio. The mark on the staged meter is −18 dBFS."}
                  </p>
                </div>
              </article>

              <div className="rounded-panel bg-face p-3 shadow-ring">
                <p className="mb-2 text-xs tracking-widest text-muted uppercase">Macros</p>
                <div className="flex flex-wrap gap-3">
                  <Knob
                    label="Warmth"
                    value={track.macros.warmth}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(track.macros.warmth * 100)}`}
                    onChange={(value) => useSession.getState().setMacro("warmth", value)}
                  />
                  <Knob
                    label="Air"
                    value={track.macros.air}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(track.macros.air * 100)}`}
                    onChange={(value) => useSession.getState().setMacro("air", value)}
                  />
                  <Knob
                    label="Space"
                    value={track.macros.space}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(track.macros.space * 100)}`}
                    onChange={(value) => useSession.getState().setMacro("space", value)}
                  />
                  <Knob
                    label="Glue"
                    value={track.macros.glue}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(track.macros.glue * 100)}`}
                    onChange={(value) => useSession.getState().setMacro("glue", value)}
                  />
                  <Knob
                    label="Width"
                    value={track.macros.width}
                    min={0}
                    max={1}
                    step={0.01}
                    display={`${Math.round(track.macros.width * 100)}`}
                    onChange={(value) => useSession.getState().setMacro("width", value)}
                  />
                </div>
              </div>

              {mode === "simple" ? (
                <div className="flex flex-wrap gap-2">
                  {track.rack.map((module) => (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => useSession.getState().toggleModule(module.kind)}
                      className={`h-11 rounded-full px-4 text-sm tracking-widest ${
                        module.enabled ? "bg-signal text-bg" : "bg-face text-muted shadow-ring"
                      }`}
                    >
                      {MODULE_SPECS[module.kind].title}
                    </button>
                  ))}
                </div>
              ) : (
                track.rack.map((module, index) => {
                  const spec = MODULE_SPECS[module.kind];
                  return (
                    <article key={module.id} className="rounded-panel bg-face p-3 shadow-ring">
                      <div className="mb-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={module.enabled ? `Bypass ${spec.title}` : `Enable ${spec.title}`}
                          aria-pressed={module.enabled}
                          onClick={() => useSession.getState().toggleModule(module.kind)}
                          className={`grid size-11 place-items-center rounded-full ${
                            module.enabled ? "bg-signal text-bg" : "bg-inset text-muted"
                          }`}
                        >
                          <Power className="size-4" />
                        </button>
                        <span className="font-mono-num text-xs text-muted">{spec.index}</span>
                        <h3 className="text-sm font-semibold tracking-widest">{spec.title}</h3>
                        {!module.enabled ? <span className="text-xs text-muted">Bypassed</span> : null}
                        <div className="ml-auto flex gap-1">
                          <IconButton
                            label={`Move ${spec.title} earlier`}
                            disabled={index === 0}
                            onClick={() => useSession.getState().moveModule(index, -1)}
                          >
                            <ChevronUp className="size-4" />
                          </IconButton>
                          <IconButton
                            label={`Move ${spec.title} later`}
                            disabled={index === track.rack.length - 1}
                            onClick={() => useSession.getState().moveModule(index, 1)}
                          >
                            <ChevronDown className="size-4" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={`flex flex-wrap gap-3 ${module.enabled ? "" : "opacity-40"}`}>
                        {spec.params.map((param) => (
                          <Knob
                            key={param.key}
                            label={param.label}
                            value={module.params[param.key] ?? param.defaultValue}
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            display={fmtParam(param, module.params[param.key] ?? param.defaultValue)}
                            defaultValue={param.defaultValue}
                            onChange={(value) => useSession.getState().setParam(module.kind, param.key, value)}
                          />
                        ))}
                      </div>
                    </article>
                  );
                })
              )}

              <div className="rounded-panel bg-surface p-3 shadow-ring">
                <Fader
                  label="Master"
                  value={masterDb}
                  min={-24}
                  max={6}
                  step={0.1}
                  display={fmtDb(masterDb)}
                  onChange={(value) => useSession.getState().setMaster(value)}
                />
              </div>
            </section>
          </main>

          <aside className="flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
            <Panel title={clip?.analysis.key.label ?? "Key"} eyebrow="Auto key">
              {clip ? (
                <>
                  <p className="font-mono-num text-3xl text-fg">{clip.analysis.key.label}</p>
                  <p className="mt-1 text-sm text-muted">
                    {clip.analysis.key.mode === "unknown"
                      ? "Not enough pitch to call it."
                      : `${Math.round(clip.analysis.key.confidence * 100)}% clearer than the next candidate.`}
                  </p>
                  <div className="mt-3 flex h-16 items-end gap-1">
                    {clip.analysis.key.chroma.map((amount, index) => (
                      <div key={NOTE_NAMES[index]} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                        <div className="flex h-12 w-full items-end rounded-sm bg-inset">
                          <div
                            className={`w-full rounded-sm ${index === clip.analysis.key.root ? "bg-signal" : "bg-line"}`}
                            style={{ height: `${Math.max(8, Math.min(100, amount * 1200))}%` }}
                          />
                        </div>
                        <span className="font-mono-num text-xs text-muted">{NOTE_NAMES[index]}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted">Key lands after a take. Drums usually stay shy. Vocals should lock.</p>
              )}
            </Panel>

            <Panel title="Notes" eyebrow="Read">
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="h-11 rounded-well bg-inset px-3 text-sm"
                  onClick={() => {
                    if (!clip) {
                      useSession.getState().pushLine("agent", "Give me a take before I read it.");
                      return;
                    }
                    const lead = clip.analysis.notes[0];
                    useSession.getState().pushLine(
                      "agent",
                      `${clip.analysis.key.label}. ${lead?.title ?? "Clean"}. ${lead?.detail ?? ""}`,
                    );
                  }}
                >
                  Read take
                </button>
                <button
                  type="button"
                  className="h-11 rounded-well bg-signal px-3 text-sm font-medium text-bg disabled:opacity-40"
                  disabled={!clip?.analysis.fixes.length}
                  onClick={() => clip && useSession.getState().applyFixes(clip.analysis.fixes)}
                >
                  Apply fixes
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {(clip?.analysis.notes ?? []).map((note) => (
                  <li key={note.id} className="rounded-well bg-inset p-3">
                    <p className={`text-sm font-medium ${note.tone === "good" ? "text-signal" : "text-fg"}`}>{note.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{note.detail}</p>
                    {note.fixes.length ? (
                      <button
                        type="button"
                        className="mt-2 h-11 text-sm text-signal"
                        onClick={() => useSession.getState().applyFixes(note.fixes)}
                      >
                        Do this
                      </button>
                    ) : null}
                  </li>
                ))}
                {!clip ? <li className="text-sm text-muted">Analysis waits on audio.</li> : null}
              </ul>
            </Panel>

            <Panel
              title="Library"
              eyebrow="Treatments"
              action={
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-well bg-inset"
                  aria-label="Save treatment"
                  onClick={() => useSession.getState().saveTreatment()}
                >
                  <Save className="size-4" />
                </button>
              }
            >
              {treatments.length === 0 ? (
                <p className="text-sm text-muted">Saved racks stay in this browser. Recall them on any track.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {treatments.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-11 min-w-0 flex-1 truncate rounded-well bg-inset px-3 text-left text-sm"
                        onClick={() => useSession.getState().loadTreatment(item.id)}
                      >
                        {item.name}
                      </button>
                      <button
                        type="button"
                        className="grid size-11 place-items-center rounded-well bg-inset text-muted"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => useSession.getState().removeTreatment(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex h-11 min-w-0 items-center gap-2 rounded-well bg-inset px-3">
      <span className="text-xs tracking-widest text-muted uppercase">{label}</span>
      <span className={`font-mono-num truncate text-sm ${warn ? "text-clip" : "text-fg"}`}>{value}</span>
    </div>
  );
}

function TrackRow({ id, active, clip }: { id: TrackId; active: boolean; clip?: ClipInfo }) {
  const track = useSession((state) => state.tracks.find((item) => item.id === id)!);
  return (
    <div className={`rounded-well p-2 ${active ? "bg-inset shadow-ring-strong" : "bg-transparent"}`}>
      <button type="button" className="flex h-11 w-full items-center gap-2 px-1 text-left" onClick={() => useSession.getState().select(id)}>
        <span className={`size-2 rounded-full ${active ? "bg-signal" : "bg-line"}`} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{track.name}</span>
          <span className="block truncate text-xs text-muted">{clip?.name ?? track.hint}</span>
        </span>
      </button>
      <div className="flex items-center gap-1 px-1">
        <Tiny
          label={`Mute ${track.name}`}
          hot={track.mute}
          onClick={() => useSession.getState().patchTrack(id, { mute: !track.mute })}
        >
          M
        </Tiny>
        <Tiny
          label={`Solo ${track.name}`}
          hot={track.solo}
          onClick={() => useSession.getState().patchTrack(id, { solo: !track.solo })}
        >
          S
        </Tiny>
        <Fader
          compact
          label={`${track.name} level`}
          value={track.volume}
          min={0}
          max={1}
          step={0.01}
          display={track.volume <= 0.001 ? "−∞" : fmtDb(20 * Math.log10(track.volume))}
          onChange={(value) => useSession.getState().patchTrack(id, { volume: value })}
        />
      </div>
    </div>
  );
}

function Waveform({ clip }: { clip?: ClipInfo }) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setPosition(engine.position());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const peaks = clip?.peaks ?? [];
  const stride = Math.max(1, Math.ceil(peaks.length / 140));
  const bars = peaks.filter((_, index) => index % stride === 0);
  const duration = clip?.duration ?? engine.duration();
  const ratio = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <div
      className="relative h-20 overflow-hidden rounded-well bg-inset"
      onClick={(event) => {
        if (!duration) return;
        const rect = event.currentTarget.getBoundingClientRect();
        engine.seek(((event.clientX - rect.left) / rect.width) * duration);
      }}
      role="slider"
      aria-label="Playhead"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration * 1000)}
      aria-valuenow={Math.round(position * 1000)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") engine.seek(position + 0.5);
        if (event.key === "ArrowLeft") engine.seek(Math.max(0, position - 0.5));
      }}
    >
      {bars.length ? (
        <div className="flex h-full items-center gap-px px-2">
          {bars.map((peak, index) => (
            <span
              key={index}
              className="min-w-0 flex-1 rounded-sm bg-signal"
              style={{ height: `${Math.max(8, Math.min(100, (peak.max - peak.min) * 55))}%` }}
            />
          ))}
        </div>
      ) : (
        <p className="grid h-full place-items-center px-4 text-center text-sm text-muted">
          Drop a vocal, a loop, or audition the printed-hot demo.
        </p>
      )}
      <span className="pointer-events-none absolute inset-y-0 w-px bg-fg" style={{ left: `${ratio * 100}%` }} />
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-panel bg-surface p-3 shadow-ring">
      <div className="mb-3 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-widest text-muted uppercase">{eyebrow}</p>
          <h2 className="truncate text-base font-medium">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TransportButton({
  label,
  onClick,
  children,
  hot = false,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  hot?: boolean;
  danger?: boolean;
}) {
  const hotClass = danger ? "bg-clip text-fg" : "bg-signal text-bg";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={hot}
      onClick={onClick}
      className={`grid size-11 place-items-center rounded-full ${hot ? hotClass : "bg-inset text-fg"}`}
    >
      {children}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-well bg-inset text-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Tiny({
  label,
  hot,
  onClick,
  children,
}: {
  label: string;
  hot: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={hot}
      onClick={onClick}
      className={`grid size-11 shrink-0 place-items-center rounded-well text-xs ${hot ? "bg-signal text-bg" : "bg-face text-muted"}`}
    >
      {children}
    </button>
  );
}
