import {
  EMPTY_MACROS,
  MODULE_ORDER,
  makeRack,
  type Macros,
  type ModuleKind,
  type TrackId,
} from "@/lib/sauc3/model";

export type Preset = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  hpfHz: number;
  macros: Macros;
  order: ModuleKind[];
  patches: Parameters<typeof makeRack>[2];
  disabled?: ModuleKind[];
  forBeat?: boolean;
};

const vocalOrder: ModuleKind[] = ["eq", "comp", "deess", "sat", "space", "width", "limit"];
const drivenOrder: ModuleKind[] = ["sat", "eq", "comp", "deess", "space", "width", "limit"];

export const PRESETS: Preset[] = [
  {
    id: "raw",
    name: "Raw",
    tag: "Utility",
    blurb: "A clean vocal lane. Light squeeze, a hint of air, almost no room.",
    hpfHz: 80,
    macros: { warmth: 0.18, air: 0.28, space: 0.14, glue: 0.32, width: 0.16 },
    order: vocalOrder,
    patches: {
      eq: { low: 0, body: -0.6, presence: 0.4, air: 1.2 },
      comp: { threshold: -16, ratio: 2.4, attack: 14, release: 140, makeup: 1.5 },
      deess: { freq: 7200, amount: 2.5 },
      sat: { drive: 0.12, mix: 0.28, tone: 0.6 },
      space: { delayMix: 0.06, delayNote: 1, feedback: 0.18, verbMix: 0.1, decay: 0.28 },
      width: { amount: 0.12, delayMs: 14 },
      limit: { ceiling: -1, push: 0.8 },
    },
  },
  {
    id: "honey",
    name: "Honey Glaze",
    tag: "R&B",
    blurb: "Slow opto feel, a warm low shelf, and a small room that never washes the lyric.",
    hpfHz: 70,
    macros: { warmth: 0.62, air: 0.4, space: 0.38, glue: 0.48, width: 0.42 },
    order: vocalOrder,
    patches: {
      eq: { low: 2.2, body: -1.4, presence: 1.1, air: 2.4 },
      comp: { threshold: -20, ratio: 3.2, attack: 22, release: 200, makeup: 3 },
      deess: { freq: 6500, amount: 3.5 },
      sat: { drive: 0.48, mix: 0.55, tone: 0.42 },
      space: { delayMix: 0.16, delayNote: 1, feedback: 0.32, verbMix: 0.26, decay: 0.48 },
      width: { amount: 0.38, delayMs: 18 },
      limit: { ceiling: -1, push: 2 },
    },
  },
  {
    id: "pepper",
    name: "Black Pepper",
    tag: "Trap",
    blurb: "Fast squeeze, forward presence, a short throw, and enough drive to sit on an 808.",
    hpfHz: 100,
    macros: { warmth: 0.55, air: 0.72, space: 0.34, glue: 0.78, width: 0.3 },
    order: drivenOrder,
    patches: {
      eq: { low: 1, body: -2.4, presence: 2.8, air: 3.6 },
      comp: { threshold: -24, ratio: 6, attack: 6, release: 90, makeup: 4 },
      deess: { freq: 8200, amount: 5.5 },
      sat: { drive: 0.66, mix: 0.7, tone: 0.62 },
      space: { delayMix: 0.22, delayNote: 2, feedback: 0.28, verbMix: 0.12, decay: 0.26 },
      width: { amount: 0.26, delayMs: 12 },
      limit: { ceiling: -0.8, push: 4.5 },
    },
  },
  {
    id: "simmer",
    name: "Slow Simmer",
    tag: "Soul",
    blurb: "Tube-leaning mids, a patient release, and a room you can stand in.",
    hpfHz: 60,
    macros: { warmth: 0.7, air: 0.32, space: 0.46, glue: 0.4, width: 0.36 },
    order: vocalOrder,
    patches: {
      eq: { low: 2.6, body: 0.8, presence: 0.4, air: 1 },
      comp: { threshold: -18, ratio: 2.8, attack: 28, release: 240, makeup: 2.4 },
      deess: { freq: 6800, amount: 2 },
      sat: { drive: 0.58, mix: 0.62, tone: 0.34 },
      space: { delayMix: 0.1, delayNote: 3, feedback: 0.22, verbMix: 0.34, decay: 0.62 },
      width: { amount: 0.34, delayMs: 20 },
      limit: { ceiling: -1.2, push: 1.5 },
    },
  },
  {
    id: "flash",
    name: "Flash Fry",
    tag: "Hyperpop",
    blurb: "Bright shelf, tight de-ess, a sparkle delay, and width that feels synthetic on purpose.",
    hpfHz: 110,
    macros: { warmth: 0.22, air: 0.86, space: 0.52, glue: 0.7, width: 0.74 },
    order: vocalOrder,
    patches: {
      eq: { low: -1.5, body: -2, presence: 2.2, air: 5.5 },
      comp: { threshold: -22, ratio: 5, attack: 5, release: 70, makeup: 3.5 },
      deess: { freq: 9000, amount: 4.5 },
      sat: { drive: 0.35, mix: 0.4, tone: 0.86 },
      space: { delayMix: 0.28, delayNote: 0, feedback: 0.42, verbMix: 0.18, decay: 0.22 },
      width: { amount: 0.72, delayMs: 11 },
      limit: { ceiling: -0.6, push: 3.5 },
    },
  },
  {
    id: "smoke",
    name: "Smoke Room",
    tag: "Tape",
    blurb: "Worn saturation, a dark top, thump around the low shelf, bite pulled off 3 kHz.",
    hpfHz: 50,
    macros: { warmth: 0.78, air: 0.12, space: 0.3, glue: 0.44, width: 0.22 },
    order: drivenOrder,
    patches: {
      eq: { low: 2.4, body: 1.2, presence: -1.6, air: -1.2 },
      comp: { threshold: -17, ratio: 2.6, attack: 18, release: 180, makeup: 2 },
      deess: { freq: 6000, amount: 1.5 },
      sat: { drive: 0.72, mix: 0.75, tone: 0.22 },
      space: { delayMix: 0.08, delayNote: 3, feedback: 0.2, verbMix: 0.22, decay: 0.55 },
      width: { amount: 0.18, delayMs: 22 },
      limit: { ceiling: -1.4, push: 1.2 },
    },
  },
  {
    id: "citrus",
    name: "Citrus Air",
    tag: "Pop",
    blurb: "Radio sheen. Present mids, controlled esses, a short plate, nothing romantic.",
    hpfHz: 90,
    macros: { warmth: 0.3, air: 0.68, space: 0.36, glue: 0.6, width: 0.4 },
    order: vocalOrder,
    patches: {
      eq: { low: 0.4, body: -1.8, presence: 2.4, air: 3.8 },
      comp: { threshold: -20, ratio: 3.8, attack: 10, release: 110, makeup: 3.2 },
      deess: { freq: 7500, amount: 4.8 },
      sat: { drive: 0.28, mix: 0.36, tone: 0.7 },
      space: { delayMix: 0.14, delayNote: 1, feedback: 0.24, verbMix: 0.2, decay: 0.32 },
      width: { amount: 0.36, delayMs: 14 },
      limit: { ceiling: -0.8, push: 2.8 },
    },
  },
  {
    id: "reduction",
    name: "Reduction",
    tag: "Stack",
    blurb: "Dry on purpose. For doubles and ad-libs that have to tuck under a lead.",
    hpfHz: 120,
    macros: { warmth: 0.16, air: 0.34, space: 0.05, glue: 0.55, width: 0.08 },
    order: vocalOrder,
    patches: {
      eq: { low: -0.8, body: -1.2, presence: 1.4, air: 1.6 },
      comp: { threshold: -18, ratio: 3.4, attack: 8, release: 100, makeup: 2 },
      deess: { freq: 7800, amount: 4 },
      sat: { drive: 0.1, mix: 0.2, tone: 0.58 },
      space: { delayMix: 0.02, delayNote: 1, feedback: 0.1, verbMix: 0.03, decay: 0.2 },
      width: { amount: 0.06, delayMs: 10 },
      limit: { ceiling: -1, push: 1 },
    },
  },
  {
    id: "roux",
    name: "Midnight Roux",
    tag: "Afro",
    blurb: "Rhythmic eighth-note throw, mid presence, light heat. Built to dance with percussion.",
    hpfHz: 85,
    macros: { warmth: 0.48, air: 0.5, space: 0.44, glue: 0.5, width: 0.46 },
    order: vocalOrder,
    patches: {
      eq: { low: 1.4, body: -0.8, presence: 2, air: 2.2 },
      comp: { threshold: -19, ratio: 3.4, attack: 12, release: 130, makeup: 2.6 },
      deess: { freq: 7000, amount: 3 },
      sat: { drive: 0.4, mix: 0.5, tone: 0.5 },
      space: { delayMix: 0.26, delayNote: 1, feedback: 0.36, verbMix: 0.16, decay: 0.3 },
      width: { amount: 0.44, delayMs: 15 },
      limit: { ceiling: -1, push: 2.2 },
    },
  },
  {
    id: "canyon",
    name: "Canyon Moon",
    tag: "Ambient",
    blurb: "Long decay, rolled harshness, slow attack. A desert room, not a club.",
    hpfHz: 70,
    macros: { warmth: 0.4, air: 0.22, space: 0.82, glue: 0.28, width: 0.58 },
    order: vocalOrder,
    patches: {
      eq: { low: 1, body: -0.4, presence: -1.2, air: 0.6 },
      comp: { threshold: -16, ratio: 2, attack: 40, release: 280, makeup: 1.2 },
      deess: { freq: 6400, amount: 2.2 },
      sat: { drive: 0.3, mix: 0.4, tone: 0.3 },
      space: { delayMix: 0.2, delayNote: 5, feedback: 0.48, verbMix: 0.55, decay: 0.86 },
      width: { amount: 0.6, delayMs: 24 },
      limit: { ceiling: -1.5, push: 0.6 },
    },
  },
  {
    id: "bed",
    name: "Bed",
    tag: "Beat",
    blurb: "A light desk for drums and loops. Low shelf, gentle glue, no vocal de-ess.",
    hpfHz: 28,
    macros: { warmth: 0.34, air: 0.2, space: 0.12, glue: 0.4, width: 0.18 },
    order: MODULE_ORDER,
    forBeat: true,
    disabled: ["deess"],
    patches: {
      eq: { low: 1.6, body: -0.8, presence: 0.6, air: 0.4 },
      comp: { threshold: -14, ratio: 2.2, attack: 18, release: 120, makeup: 1 },
      sat: { drive: 0.22, mix: 0.3, tone: 0.45 },
      space: { delayMix: 0.04, delayNote: 1, feedback: 0.12, verbMix: 0.08, decay: 0.24 },
      width: { amount: 0.16, delayMs: 12 },
      limit: { ceiling: -1, push: 1.4 },
    },
  },
];

export function presetById(id: string) {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
}

export function rackFromPreset(trackId: TrackId, preset: Preset) {
  return makeRack(trackId, preset.order, preset.patches, preset.disabled ?? []);
}

export function initialTracks() {
  return [
    track("lead", "Lead", "Main vocal", "vocal", "raw", true),
    track("double", "Double", "Stacked take", "vocal", "reduction", false),
    track("adlib", "Ad-lib", "Throws", "vocal", "flash", false),
    track("beat", "Beat", "Instrumental", "beat", "bed", false),
  ];
}

function track(
  id: TrackId,
  name: string,
  hint: string,
  role: "vocal" | "beat",
  presetId: string,
  armed: boolean,
) {
  const preset = presetById(presetId);
  return {
    id,
    name,
    hint,
    role,
    volume: role === "beat" ? 0.72 : 0.86,
    mute: false,
    solo: false,
    armed,
    trimDb: 0,
    hpfHz: preset.hpfHz,
    polarity: false,
    presetId,
    custom: false,
    macros: { ...preset.macros },
    rack: rackFromPreset(id, preset),
  };
}

export { EMPTY_MACROS };
