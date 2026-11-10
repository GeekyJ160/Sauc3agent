import { presetById, PRESETS, rackFromPreset, type Preset } from "@/lib/sauc3/presets";
import {
  clamp,
  type Macros,
  type ModuleDef,
  type ModuleKind,
  type TrackId,
} from "@/lib/sauc3/model";

export type TreatmentDraft = {
  title: string;
  blurb: string;
  presetId: string;
  hpfHz: number;
  macros: Macros;
  rack: ModuleDef[];
};

const HINTS: { test: RegExp; id: string }[] = [
  { test: /trap|rage|pepper|808|drill/, id: "pepper" },
  { test: /r&b|rnb|silk|honey|smooth|neo/, id: "honey" },
  { test: /soul|gospel|simmer|motown/, id: "simmer" },
  { test: /hyper|fry|pc music|bright pop|glossy/, id: "flash" },
  { test: /smoke|vintage|tape|lo-?fi|70s|worn|mojo/, id: "smoke" },
  { test: /pop|citrus|radio|topline/, id: "citrus" },
  { test: /afro|roux|amapiano|dancehall/, id: "roux" },
  { test: /canyon|ambient|desert|hall|moon|huge space|ethereal/, id: "canyon" },
  { test: /dry|stack|double|ad-?lib|intimate|close/, id: "reduction" },
  { test: /beat|drum|instrumental|loop bed/, id: "bed" },
  { test: /raw|clean|natural|naked/, id: "raw" },
];

function setParam(rack: ModuleDef[], kind: ModuleKind, key: string, value: number) {
  const module = rack.find((item) => item.kind === kind);
  if (!module) return;
  module.enabled = true;
  const current = module.params[key] ?? 0;
  module.params[key] = value;
  return current;
}

function bump(rack: ModuleDef[], kind: ModuleKind, key: string, delta: number, min: number, max: number) {
  const module = rack.find((item) => item.kind === kind);
  if (!module) return 0;
  module.enabled = true;
  const next = clamp((module.params[key] ?? 0) + delta, min, max);
  const changed = next - (module.params[key] ?? 0);
  module.params[key] = next;
  return changed;
}

export function interpretPrompt(text: string, trackId: TrackId, current?: Preset): TreatmentDraft {
  const clean = text.trim().toLowerCase();
  const hinted = HINTS.find((hint) => hint.test.test(clean));
  const preset = presetById(hinted?.id ?? current?.id ?? "raw");
  const rack = rackFromPreset(trackId, preset);
  const macros: Macros = { ...preset.macros };
  let hpfHz = preset.hpfHz;
  const moves: string[] = [];

  if (/warm|body|thick|fat|analog/.test(clean)) {
    bump(rack, "sat", "drive", 0.22, 0, 1);
    bump(rack, "sat", "mix", 0.15, 0, 1);
    bump(rack, "eq", "low", 1.8, -8, 8);
    macros.warmth = clamp(macros.warmth + 0.2, 0, 1);
    moves.push("warmth into the saturator and a low shelf");
  }
  if (/air|shine|bright|open|sparkle|crisp/.test(clean)) {
    bump(rack, "eq", "air", 2.4, -8, 8);
    macros.air = clamp(macros.air + 0.22, 0, 1);
    moves.push("air at 10 kHz");
  }
  if (/mud|boxy|cloudy|honk/.test(clean)) {
    bump(rack, "eq", "body", -2.4, -8, 8);
    moves.push("a cut around 240 Hz");
  }
  if (/harsh|brittle|shrill|pierc/.test(clean)) {
    bump(rack, "eq", "presence", -2, -8, 8);
    bump(rack, "deess", "amount", 2, 0, 12);
    moves.push("presence pulled back");
  }
  if (/de-?ess|sibilan|essy|esses/.test(clean)) {
    bump(rack, "deess", "amount", 3, 0, 12);
    setParam(rack, "deess", "freq", 7400);
    moves.push("de-ess around 7.4 kHz");
  }
  if (/dry|intimate|close|no verb|no room|up front/.test(clean)) {
    setParam(rack, "space", "verbMix", 0.04);
    setParam(rack, "space", "delayMix", 0.03);
    macros.space = 0.06;
    moves.push("space almost closed");
  } else if (/canyon|huge|vast|cathedral|long/.test(clean)) {
    setParam(rack, "space", "verbMix", 0.58);
    setParam(rack, "space", "decay", 0.9);
    setParam(rack, "space", "delayNote", 5);
    macros.space = 0.86;
    moves.push("a long canyon decay");
  } else if (/room|plate|verb|space|hall|ambient/.test(clean)) {
    bump(rack, "space", "verbMix", 0.16, 0, 1);
    bump(rack, "space", "decay", 0.12, 0, 1);
    macros.space = clamp(macros.space + 0.16, 0, 1);
    moves.push("a little more room");
  }
  if (/delay|throw|slap|echo/.test(clean)) {
    bump(rack, "space", "delayMix", 0.16, 0, 1);
    if (/slap/.test(clean)) setParam(rack, "space", "delayNote", 0);
    moves.push("a tempo throw");
  }
  if (/tight|glue|squeeze|punch|control/.test(clean)) {
    bump(rack, "comp", "threshold", -4, -40, 0);
    bump(rack, "comp", "ratio", 1.2, 1, 12);
    macros.glue = clamp(macros.glue + 0.18, 0, 1);
    moves.push("a tighter squeeze");
  }
  if (/wide|double|stereo|haas/.test(clean)) {
    bump(rack, "width", "amount", 0.22, 0, 1);
    macros.width = clamp(macros.width + 0.2, 0, 1);
    moves.push("a wider image");
  }
  if (/tape|satura|drive|grit|dirty/.test(clean)) {
    bump(rack, "sat", "drive", 0.2, 0, 1);
    bump(rack, "sat", "mix", 0.12, 0, 1);
    macros.warmth = clamp(macros.warmth + 0.15, 0, 1);
    moves.push("more tape drive");
  }
  if (/dark|roll off|dull|muffled/.test(clean)) {
    bump(rack, "eq", "air", -2.2, -8, 8);
    bump(rack, "sat", "tone", -0.2, 0, 1);
    hpfHz = Math.max(40, hpfHz - 15);
    moves.push("the top rolled off");
  }
  if (/rumble|low cut|high pass|hpf/.test(clean)) {
    hpfHz = Math.min(180, hpfHz + 30);
    moves.push(`high-pass nearer ${Math.round(hpfHz)} Hz`);
  }

  const title = hinted ? preset.name : moves.length ? "Custom rack" : preset.name;
  const base = hinted ? preset.blurb : `Started from ${preset.name}.`;
  const blurb = moves.length
    ? `Built ${title} — ${moves.join(", ")}.`
    : `Built ${preset.name} — ${base.charAt(0).toLowerCase()}${base.slice(1)}`;

  return { title, blurb, presetId: preset.id, hpfHz, macros, rack };
}

export function macroPatch(key: keyof Macros, value: number, rack: ModuleDef[], macros: Macros): Macros {
  const next = { ...macros, [key]: value };
  if (key === "warmth") {
    setOwned(rack, "sat", "drive", 0.08 + value * 0.7);
    setOwned(rack, "sat", "mix", 0.2 + value * 0.6);
    setOwned(rack, "eq", "low", -1 + value * 4);
  } else if (key === "air") {
    setOwned(rack, "eq", "air", -1 + value * 7);
  } else if (key === "space") {
    setOwned(rack, "space", "verbMix", value * 0.6);
    setOwned(rack, "space", "delayMix", value * 0.32);
  } else if (key === "glue") {
    setOwned(rack, "comp", "threshold", -12 - value * 16);
    setOwned(rack, "comp", "ratio", 1.6 + value * 6);
    setOwned(rack, "comp", "makeup", value * 4);
  } else if (key === "width") {
    setOwned(rack, "width", "amount", value);
  }
  return next;
}

function setOwned(rack: ModuleDef[], kind: ModuleKind, key: string, value: number) {
  const module = rack.find((item) => item.kind === kind);
  if (!module) return;
  module.enabled = true;
  module.params[key] = value;
}

export function presetChoices() {
  return PRESETS;
}
