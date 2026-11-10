export type ModuleKind = "eq" | "comp" | "deess" | "sat" | "space" | "width" | "limit";

export type TrackId = "lead" | "double" | "adlib" | "beat";

export type ParamSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: "db" | "hz" | "ms" | "pct" | "ratio" | "note";
  defaultValue: number;
};

export type ModuleDef = {
  id: string;
  kind: ModuleKind;
  enabled: boolean;
  params: Record<string, number>;
};

export type Macros = {
  warmth: number;
  air: number;
  space: number;
  glue: number;
  width: number;
};

export type TrackModel = {
  id: TrackId;
  name: string;
  hint: string;
  role: "vocal" | "beat";
  volume: number;
  mute: boolean;
  solo: boolean;
  armed: boolean;
  trimDb: number;
  hpfHz: number;
  polarity: boolean;
  presetId: string;
  custom: boolean;
  macros: Macros;
  rack: ModuleDef[];
};

export type KeyResult = {
  label: string;
  root: number;
  mode: "major" | "minor" | "unknown";
  confidence: number;
  chroma: number[];
};

export type StageZone = "quiet" | "staged" | "hot" | "clip";

export type StageResult = {
  peakDb: number;
  rmsDb: number;
  crestDb: number;
  suggestedTrimDb: number;
  clipped: boolean;
  zone: StageZone;
};

export type Fix =
  | { op: "trim"; db: number }
  | { op: "hpf"; hz: number }
  | { op: "param"; kind: ModuleKind; key: string; value: number; enable: boolean };

export type AssistNote = {
  id: string;
  tone: "good" | "warn" | "fix";
  title: string;
  detail: string;
  fixes: Fix[];
};

export type Bands = {
  mud: number;
  presence: number;
  sib: number;
  air: number;
};

export type TakeAnalysis = {
  key: KeyResult;
  stage: StageResult;
  bands: Bands;
  notes: AssistNote[];
  fixes: Fix[];
};

export type ClipInfo = {
  name: string;
  duration: number;
  sampleRate: number;
  analysis: TakeAnalysis;
  peaks: { min: number; max: number }[];
};

export type Treatment = {
  id: string;
  name: string;
  blurb: string;
  hpfHz: number;
  macros: Macros;
  modules: { kind: ModuleKind; enabled: boolean; params: Record<string, number> }[];
  createdAt: number;
};

export type AgentLine = {
  id: string;
  role: "you" | "agent";
  text: string;
};

export const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"] as const;

export const DELAY_NOTES = ["1/16", "1/8", "1/8.", "1/4", "1/4.", "1/2"] as const;

export const MODULE_SPECS: Record<ModuleKind, { title: string; index: string; params: ParamSpec[] }> = {
  eq: {
    title: "EQ",
    index: "02",
    params: [
      { key: "low", label: "Low", min: -8, max: 8, step: 0.1, unit: "db", defaultValue: 0 },
      { key: "body", label: "Body", min: -8, max: 8, step: 0.1, unit: "db", defaultValue: 0 },
      { key: "presence", label: "Presence", min: -8, max: 8, step: 0.1, unit: "db", defaultValue: 0 },
      { key: "air", label: "Air", min: -8, max: 8, step: 0.1, unit: "db", defaultValue: 0 },
    ],
  },
  comp: {
    title: "COMP",
    index: "03",
    params: [
      { key: "threshold", label: "Thresh", min: -40, max: 0, step: 0.5, unit: "db", defaultValue: -18 },
      { key: "ratio", label: "Ratio", min: 1, max: 12, step: 0.1, unit: "ratio", defaultValue: 3 },
      { key: "attack", label: "Attack", min: 3, max: 80, step: 1, unit: "ms", defaultValue: 12 },
      { key: "release", label: "Release", min: 40, max: 400, step: 1, unit: "ms", defaultValue: 140 },
      { key: "makeup", label: "Makeup", min: 0, max: 12, step: 0.1, unit: "db", defaultValue: 0 },
    ],
  },
  deess: {
    title: "DE-ESS",
    index: "04",
    params: [
      { key: "freq", label: "Freq", min: 4000, max: 11000, step: 100, unit: "hz", defaultValue: 7000 },
      { key: "amount", label: "Amount", min: 0, max: 12, step: 0.1, unit: "db", defaultValue: 0 },
    ],
  },
  sat: {
    title: "SAT",
    index: "05",
    params: [
      { key: "drive", label: "Drive", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.15 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.4 },
      { key: "tone", label: "Tone", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.55 },
    ],
  },
  space: {
    title: "SPACE",
    index: "06",
    params: [
      { key: "delayMix", label: "Delay", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.08 },
      { key: "delayNote", label: "Time", min: 0, max: 5, step: 1, unit: "note", defaultValue: 1 },
      { key: "feedback", label: "Repeat", min: 0, max: 0.72, step: 0.01, unit: "pct", defaultValue: 0.28 },
      { key: "verbMix", label: "Verb", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.12 },
      { key: "decay", label: "Decay", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.35 },
    ],
  },
  width: {
    title: "WIDTH",
    index: "07",
    params: [
      { key: "amount", label: "Width", min: 0, max: 1, step: 0.01, unit: "pct", defaultValue: 0.15 },
      { key: "delayMs", label: "Haas", min: 8, max: 28, step: 0.5, unit: "ms", defaultValue: 16 },
    ],
  },
  limit: {
    title: "LIMIT",
    index: "08",
    params: [
      { key: "ceiling", label: "Ceiling", min: -12, max: -0.3, step: 0.1, unit: "db", defaultValue: -1 },
      { key: "push", label: "Push", min: 0, max: 12, step: 0.1, unit: "db", defaultValue: 1 },
    ],
  },
};

export const MODULE_ORDER: ModuleKind[] = ["eq", "comp", "deess", "sat", "space", "width", "limit"];

export function defaultParams(kind: ModuleKind): Record<string, number> {
  const params: Record<string, number> = {};
  for (const spec of MODULE_SPECS[kind].params) params[spec.key] = spec.defaultValue;
  return params;
}

export function makeModule(
  trackId: string,
  kind: ModuleKind,
  params: Partial<Record<string, number>> = {},
  enabled = true,
): ModuleDef {
  const merged = defaultParams(kind);
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "number") merged[key] = value;
  }
  return {
    id: `${trackId}-${kind}`,
    kind,
    enabled,
    params: merged,
  };
}

export function makeRack(
  trackId: string,
  order: ModuleKind[],
  patches: Partial<Record<ModuleKind, Partial<Record<string, number>>>> = {},
  disabled: ModuleKind[] = [],
): ModuleDef[] {
  return order.map((kind) => makeModule(trackId, kind, patches[kind] ?? {}, !disabled.includes(kind)));
}

export const EMPTY_MACROS: Macros = { warmth: 0.2, air: 0.25, space: 0.2, glue: 0.35, width: 0.2 };

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function dbToGain(db: number) {
  return Math.pow(10, db / 20);
}

export function gainToDb(gain: number) {
  return 20 * Math.log10(Math.max(gain, 1e-8));
}

export function fmtDb(db: number) {
  if (!Number.isFinite(db) || db < -80) return "−∞";
  const rounded = Math.round(db * 10) / 10;
  const abs = Math.abs(rounded).toFixed(1);
  if (rounded > 0.05) return `+${abs}`;
  if (rounded < -0.05) return `−${abs}`;
  return "0.0";
}

export function fmtParam(spec: ParamSpec, value: number) {
  if (spec.unit === "db") return fmtDb(value);
  if (spec.unit === "hz") return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${Math.round(value)}`;
  if (spec.unit === "ms") return `${Math.round(value)}`;
  if (spec.unit === "pct") return `${Math.round(value * 100)}`;
  if (spec.unit === "ratio") return value.toFixed(1);
  return DELAY_NOTES[clamp(Math.round(value), 0, DELAY_NOTES.length - 1)] ?? "1/8";
}

export function quantize(value: number, step: number) {
  const q = Math.round(value / step) * step;
  const digits = step < 1 ? Math.ceil(-Math.log10(step)) : 0;
  return Number(q.toFixed(Math.min(4, digits)));
}
