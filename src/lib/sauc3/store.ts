import { create } from "zustand";
import { makeDemo } from "@/lib/sauc3/analyze";
import { engine } from "@/lib/sauc3/engine";
import {
  type AgentLine,
  type ClipInfo,
  type Fix,
  type Macros,
  type ModuleKind,
  type TrackId,
  type TrackModel,
  type Treatment,
} from "@/lib/sauc3/model";
import { initialTracks, presetById, rackFromPreset } from "@/lib/sauc3/presets";
import { interpretPrompt, macroPatch } from "@/lib/sauc3/prompt";

const STORAGE_KEY = "sauc3-agent-v1";

type Persisted = {
  treatments: Treatment[];
  mode: "simple" | "advanced";
  bpm: number;
};

export type SessionState = {
  tracks: TrackModel[];
  selectedId: TrackId;
  bpm: number;
  loop: boolean;
  mode: "simple" | "advanced";
  masterDb: number;
  playing: boolean;
  recording: boolean;
  clips: Partial<Record<TrackId, ClipInfo>>;
  treatments: Treatment[];
  log: AgentLine[];
  ready: boolean;
  select: (id: TrackId) => void;
  patchTrack: (id: TrackId, patch: Partial<TrackModel>) => void;
  setParam: (kind: ModuleKind, key: string, value: number) => void;
  toggleModule: (kind: ModuleKind) => void;
  moveModule: (index: number, direction: -1 | 1) => void;
  setTrim: (db: number) => void;
  setHpf: (hz: number) => void;
  togglePolarity: () => void;
  loadPreset: (id: string) => void;
  setMacro: (key: keyof Macros, value: number) => void;
  setMode: (mode: "simple" | "advanced") => void;
  setBpm: (bpm: number) => void;
  setLoop: (loop: boolean) => void;
  setMaster: (db: number) => void;
  setPlaying: (playing: boolean) => void;
  setRecording: (recording: boolean) => void;
  setClip: (id: TrackId, clip: ClipInfo) => void;
  applyFixes: (fixes: Fix[]) => void;
  stageToTarget: () => void;
  ask: (text: string) => void;
  saveTreatment: () => void;
  loadTreatment: (id: string) => void;
  removeTreatment: (id: string) => void;
  pushLine: (role: AgentLine["role"], text: string) => void;
  hydrate: (data: Persisted) => void;
  audition: () => Promise<void>;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function selected(state: SessionState) {
  return state.tracks.find((track) => track.id === state.selectedId) ?? state.tracks[0]!;
}

function mapSelected(state: SessionState, mapper: (track: TrackModel) => TrackModel) {
  return state.tracks.map((track) => (track.id === state.selectedId ? mapper(track) : track));
}

export const useSession = create<SessionState>((set, get) => ({
  tracks: initialTracks(),
  selectedId: "lead",
  bpm: 140,
  loop: false,
  mode: "advanced",
  masterDb: -1.2,
  playing: false,
  recording: false,
  clips: {},
  treatments: [],
  log: [
    {
      id: "hello",
      role: "agent",
      text: "Hi, I'm Mic, your personal sound engineer. Tap an example below, or tell me the record you want.",
    },
  ],
  ready: false,
  select: (id) =>
    set({
      selectedId: id,
      tracks: get().tracks.map((item) => ({ ...item, armed: item.id === id })),
    }),
  patchTrack: (id, patch) =>
    set({
      tracks: get().tracks.map((track) => (track.id === id ? { ...track, ...patch } : track)),
    }),
  setParam: (kind, key, value) =>
    set({
      tracks: mapSelected(get(), (track) => ({
        ...track,
        custom: true,
        rack: track.rack.map((module) =>
          module.kind === kind ? { ...module, params: { ...module.params, [key]: value } } : module,
        ),
      })),
    }),
  toggleModule: (kind) =>
    set({
      tracks: mapSelected(get(), (track) => ({
        ...track,
        custom: true,
        rack: track.rack.map((module) =>
          module.kind === kind ? { ...module, enabled: !module.enabled } : module,
        ),
      })),
    }),
  moveModule: (index, direction) =>
    set({
      tracks: mapSelected(get(), (track) => {
        const next = track.rack.slice();
        const target = index + direction;
        if (target < 0 || target >= next.length) return track;
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item!);
        return { ...track, custom: true, rack: next };
      }),
    }),
  setTrim: (db) =>
    set({
      tracks: mapSelected(get(), (track) => ({ ...track, trimDb: db })),
    }),
  setHpf: (hz) =>
    set({
      tracks: mapSelected(get(), (track) => ({ ...track, hpfHz: hz })),
    }),
  togglePolarity: () =>
    set({
      tracks: mapSelected(get(), (track) => ({ ...track, polarity: !track.polarity })),
    }),
  loadPreset: (id) => {
    const preset = presetById(id);
    set({
      tracks: mapSelected(get(), (track) => ({
        ...track,
        presetId: id,
        custom: false,
        macros: { ...preset.macros },
        hpfHz: preset.hpfHz,
        rack: rackFromPreset(track.id, preset),
      })),
    });
    get().pushLine("agent", `${preset.name} — ${preset.blurb}`);
  },
  setMacro: (key, value) => {
    const state = get();
    const track = selected(state);
    const draft = track.rack.map((module) => ({
      ...module,
      params: { ...module.params },
    }));
    const macros = macroPatch(key, value, draft, track.macros);
    set({
      tracks: mapSelected(state, (item) => ({ ...item, custom: true, macros, rack: draft })),
    });
  },
  setMode: (mode) => set({ mode }),
  setBpm: (bpm) => set({ bpm }),
  setLoop: (loop) => set({ loop }),
  setMaster: (db) => set({ masterDb: db }),
  setPlaying: (playing) => set({ playing }),
  setRecording: (recording) => set({ recording }),
  setClip: (id, clip) => set({ clips: { ...get().clips, [id]: clip } }),
  applyFixes: (fixes) => {
    if (!fixes.length) return;
    let tracks = get().tracks;
    const id = get().selectedId;
    tracks = tracks.map((track) => {
      if (track.id !== id) return track;
      let next = track;
      for (const fix of fixes) {
        if (fix.op === "trim") next = { ...next, trimDb: fix.db };
        else if (fix.op === "hpf") next = { ...next, hpfHz: fix.hz };
        else {
          next = {
            ...next,
            rack: next.rack.map((module) =>
              module.kind === fix.kind
                ? { ...module, enabled: fix.enable || module.enabled, params: { ...module.params, [fix.key]: fix.value } }
                : module,
            ),
          };
        }
      }
      return { ...next, custom: true };
    });
    set({ tracks });
    get().pushLine("agent", "Applied the fixes on the selected track. The dry take is unchanged — only the rack moved.");
  },
  stageToTarget: () => {
    const clip = get().clips[get().selectedId];
    if (!clip) {
      get().pushLine("agent", "Nothing to stage yet. Load audio first so I can see the peak and RMS.");
      return;
    }
    const db = clip.analysis.stage.suggestedTrimDb;
    get().setTrim(db);
    get().pushLine(
      "agent",
      `Trim set to ${db.toFixed(1)} dB so RMS lands near −18, with the peak held under −1.`,
    );
  },
  ask: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const state = get();
    const track = selected(state);
    const draft = interpretPrompt(trimmed, track.id, presetById(track.presetId));
    set({
      tracks: mapSelected(state, (item) => ({
        ...item,
        presetId: draft.presetId,
        custom: draft.title === "Custom rack",
        macros: draft.macros,
        hpfHz: draft.hpfHz,
        rack: draft.rack,
      })),
    });
    get().pushLine("you", trimmed);
    get().pushLine("agent", draft.blurb);
  },
  saveTreatment: () => {
    const state = get();
    const track = selected(state);
    const preset = presetById(track.presetId);
    const treatment: Treatment = {
      id: uid(),
      name: track.custom ? `${preset.name} edit` : preset.name,
      blurb: state.log.filter((line) => line.role === "agent").at(-1)?.text ?? preset.blurb,
      hpfHz: track.hpfHz,
      macros: { ...track.macros },
      modules: track.rack.map((module) => ({
        kind: module.kind,
        enabled: module.enabled,
        params: { ...module.params },
      })),
      createdAt: Date.now(),
    };
    set({ treatments: [treatment, ...state.treatments].slice(0, 24) });
    get().pushLine("agent", `Saved “${treatment.name}” to this browser.`);
  },
  loadTreatment: (id) => {
    const treatment = get().treatments.find((item) => item.id === id);
    if (!treatment) return;
    set({
      tracks: mapSelected(get(), (track) => ({
        ...track,
        custom: true,
        macros: { ...treatment.macros },
        hpfHz: treatment.hpfHz,
        rack: treatment.modules.map((module) => ({
          id: `${track.id}-${module.kind}`,
          kind: module.kind,
          enabled: module.enabled,
          params: { ...module.params },
        })),
      })),
    });
    get().pushLine("agent", `Recalled ${treatment.name}.`);
  },
  removeTreatment: (id) => set({ treatments: get().treatments.filter((item) => item.id !== id) }),
  pushLine: (role, text) =>
    set({
      log: [...get().log, { id: uid(), role, text }].slice(-12),
    }),
  hydrate: (data) =>
    set({
      treatments: data.treatments ?? [],
      mode: data.mode ?? "advanced",
      bpm: data.bpm || 140,
      ready: true,
    }),
  audition: async () => {
    const demo = makeDemo();
    await engine.ingestMono("lead", demo.vocal, demo.sampleRate);
    await engine.ingestMono("beat", demo.beat, demo.sampleRate);
    const lead = engine.describe(demo.vocalName, demo.vocal, demo.sampleRate, demo.vocal.length / demo.sampleRate, "lead");
    const beat = engine.describe(demo.beatName, demo.beat, demo.sampleRate, demo.beat.length / demo.sampleRate, "beat");
    set({
      bpm: demo.bpm,
      clips: { ...get().clips, lead, beat },
      selectedId: "lead",
      tracks: get().tracks.map((track) => ({ ...track, armed: track.id === "lead" })),
    });
    const key = lead.analysis.key;
    const stage = lead.analysis.stage;
    get().pushLine(
      "agent",
      `Demo take is in. Lead reads ${key.label} (${Math.round(key.confidence * 100)}%). RMS ${stage.rmsDb.toFixed(1)} dB — ${stage.zone}. The bed is on Beat at ${demo.bpm}.`,
    );
    const next = get();
    engine.sync({
      tracks: next.tracks,
      selectedId: next.selectedId,
      bpm: next.bpm,
      loop: next.loop,
      masterDb: next.masterDb,
    });
  },
}));

export function persistSession() {
  const { treatments, mode, bpm } = useSession.getState();
  const payload: Persisted = { treatments, mode, bpm };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode */
  }
}

export function readPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || !Array.isArray(parsed.treatments)) return null;
    return parsed;
  } catch {
    return null;
  }
}

