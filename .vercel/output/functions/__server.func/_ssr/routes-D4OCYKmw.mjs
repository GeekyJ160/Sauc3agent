import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Save, c as Play, d as ChevronUp, f as ChevronDown, i as Square, l as Pause, o as Repeat, r as Trash2, s as Power, t as Upload, u as Headphones } from "../_libs/lucide-react.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D4OCYKmw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NOTE_NAMES = [
	"C",
	"C♯",
	"D",
	"D♯",
	"E",
	"F",
	"F♯",
	"G",
	"G♯",
	"A",
	"A♯",
	"B"
];
var DELAY_NOTES = [
	"1/16",
	"1/8",
	"1/8.",
	"1/4",
	"1/4.",
	"1/2"
];
var MODULE_SPECS = {
	eq: {
		title: "EQ",
		index: "02",
		params: [
			{
				key: "low",
				label: "Low",
				min: -8,
				max: 8,
				step: .1,
				unit: "db",
				defaultValue: 0
			},
			{
				key: "body",
				label: "Body",
				min: -8,
				max: 8,
				step: .1,
				unit: "db",
				defaultValue: 0
			},
			{
				key: "presence",
				label: "Presence",
				min: -8,
				max: 8,
				step: .1,
				unit: "db",
				defaultValue: 0
			},
			{
				key: "air",
				label: "Air",
				min: -8,
				max: 8,
				step: .1,
				unit: "db",
				defaultValue: 0
			}
		]
	},
	comp: {
		title: "COMP",
		index: "03",
		params: [
			{
				key: "threshold",
				label: "Thresh",
				min: -40,
				max: 0,
				step: .5,
				unit: "db",
				defaultValue: -18
			},
			{
				key: "ratio",
				label: "Ratio",
				min: 1,
				max: 12,
				step: .1,
				unit: "ratio",
				defaultValue: 3
			},
			{
				key: "attack",
				label: "Attack",
				min: 3,
				max: 80,
				step: 1,
				unit: "ms",
				defaultValue: 12
			},
			{
				key: "release",
				label: "Release",
				min: 40,
				max: 400,
				step: 1,
				unit: "ms",
				defaultValue: 140
			},
			{
				key: "makeup",
				label: "Makeup",
				min: 0,
				max: 12,
				step: .1,
				unit: "db",
				defaultValue: 0
			}
		]
	},
	deess: {
		title: "DE-ESS",
		index: "04",
		params: [{
			key: "freq",
			label: "Freq",
			min: 4e3,
			max: 11e3,
			step: 100,
			unit: "hz",
			defaultValue: 7e3
		}, {
			key: "amount",
			label: "Amount",
			min: 0,
			max: 12,
			step: .1,
			unit: "db",
			defaultValue: 0
		}]
	},
	sat: {
		title: "SAT",
		index: "05",
		params: [
			{
				key: "drive",
				label: "Drive",
				min: 0,
				max: 1,
				step: .01,
				unit: "pct",
				defaultValue: .15
			},
			{
				key: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				step: .01,
				unit: "pct",
				defaultValue: .4
			},
			{
				key: "tone",
				label: "Tone",
				min: 0,
				max: 1,
				step: .01,
				unit: "pct",
				defaultValue: .55
			}
		]
	},
	space: {
		title: "SPACE",
		index: "06",
		params: [
			{
				key: "delayMix",
				label: "Delay",
				min: 0,
				max: 1,
				step: .01,
				unit: "pct",
				defaultValue: .08
			},
			{
				key: "delayNote",
				label: "Time",
				min: 0,
				max: 5,
				step: 1,
				unit: "note",
				defaultValue: 1
			},
			{
				key: "feedback",
				label: "Repeat",
				min: 0,
				max: .72,
				step: .01,
				unit: "pct",
				defaultValue: .28
			},
			{
				key: "verbMix",
				label: "Verb",
				min: 0,
				max: 1,
				step: .01,
				unit: "pct",
				defaultValue: .12
			},
			{
				key: "decay",
				label: "Decay",
				min: 0,
				max: 1,
				step: .01,
				unit: "pct",
				defaultValue: .35
			}
		]
	},
	width: {
		title: "WIDTH",
		index: "07",
		params: [{
			key: "amount",
			label: "Width",
			min: 0,
			max: 1,
			step: .01,
			unit: "pct",
			defaultValue: .15
		}, {
			key: "delayMs",
			label: "Haas",
			min: 8,
			max: 28,
			step: .5,
			unit: "ms",
			defaultValue: 16
		}]
	},
	limit: {
		title: "LIMIT",
		index: "08",
		params: [{
			key: "ceiling",
			label: "Ceiling",
			min: -12,
			max: -.3,
			step: .1,
			unit: "db",
			defaultValue: -1
		}, {
			key: "push",
			label: "Push",
			min: 0,
			max: 12,
			step: .1,
			unit: "db",
			defaultValue: 1
		}]
	}
};
var MODULE_ORDER = [
	"eq",
	"comp",
	"deess",
	"sat",
	"space",
	"width",
	"limit"
];
function defaultParams(kind) {
	const params = {};
	for (const spec of MODULE_SPECS[kind].params) params[spec.key] = spec.defaultValue;
	return params;
}
function makeModule(trackId, kind, params = {}, enabled = true) {
	const merged = defaultParams(kind);
	for (const [key, value] of Object.entries(params)) if (typeof value === "number") merged[key] = value;
	return {
		id: `${trackId}-${kind}`,
		kind,
		enabled,
		params: merged
	};
}
function makeRack(trackId, order, patches = {}, disabled = []) {
	return order.map((kind) => makeModule(trackId, kind, patches[kind] ?? {}, !disabled.includes(kind)));
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function dbToGain(db) {
	return Math.pow(10, db / 20);
}
function fmtDb(db) {
	if (!Number.isFinite(db) || db < -80) return "−∞";
	const rounded = Math.round(db * 10) / 10;
	const abs = Math.abs(rounded).toFixed(1);
	if (rounded > .05) return `+${abs}`;
	if (rounded < -.05) return `−${abs}`;
	return "0.0";
}
function fmtParam(spec, value) {
	if (spec.unit === "db") return fmtDb(value);
	if (spec.unit === "hz") return value >= 1e3 ? `${(value / 1e3).toFixed(1)}k` : `${Math.round(value)}`;
	if (spec.unit === "ms") return `${Math.round(value)}`;
	if (spec.unit === "pct") return `${Math.round(value * 100)}`;
	if (spec.unit === "ratio") return value.toFixed(1);
	return DELAY_NOTES[clamp(Math.round(value), 0, DELAY_NOTES.length - 1)] ?? "1/8";
}
function quantize(value, step) {
	const q = Math.round(value / step) * step;
	const digits = step < 1 ? Math.ceil(-Math.log10(step)) : 0;
	return Number(q.toFixed(Math.min(4, digits)));
}
var MAJOR = [
	6.35,
	2.23,
	3.48,
	2.33,
	4.38,
	4.09,
	2.52,
	5.19,
	2.39,
	3.66,
	2.29,
	2.88
];
var MINOR = [
	6.33,
	2.68,
	3.52,
	5.38,
	2.6,
	3.53,
	2.54,
	4.75,
	3.98,
	2.69,
	3.34,
	3.17
];
var MAJOR_SCALE = [
	0,
	2,
	4,
	5,
	7,
	9,
	11
];
var MINOR_SCALE = [
	0,
	2,
	3,
	5,
	7,
	8,
	10
];
function fftInPlace(re, im) {
	const n = re.length;
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			const tr = re[i];
			re[i] = re[j];
			re[j] = tr;
			const ti = im[i];
			im[i] = im[j];
			im[j] = ti;
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const ang = -2 * Math.PI / len;
		const wlenRe = Math.cos(ang);
		const wlenIm = Math.sin(ang);
		for (let i = 0; i < n; i += len) {
			let wRe = 1;
			let wIm = 0;
			const half = len >> 1;
			for (let j = 0; j < half; j++) {
				const uRe = re[i + j];
				const uIm = im[i + j];
				const vRe = re[i + j + half] * wRe - im[i + j + half] * wIm;
				const vIm = re[i + j + half] * wIm + im[i + j + half] * wRe;
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
function rotate(profile, tonic) {
	const out = new Array(12).fill(0);
	for (let i = 0; i < 12; i++) out[(i + tonic) % 12] = profile[i];
	return out;
}
function pearson(a, b) {
	const n = a.length;
	let meanA = 0;
	let meanB = 0;
	for (let i = 0; i < n; i++) {
		meanA += a[i];
		meanB += b[i];
	}
	meanA /= n;
	meanB /= n;
	let num = 0;
	let denA = 0;
	let denB = 0;
	for (let i = 0; i < n; i++) {
		const da = a[i] - meanA;
		const db = b[i] - meanB;
		num += da * db;
		denA += da * da;
		denB += db * db;
	}
	return num / Math.sqrt(denA * denB + 1e-12);
}
function bandMean(mag, sampleRate, lo, hi) {
	const nfft = mag.length * 2;
	const start = Math.max(1, Math.floor(lo * nfft / sampleRate));
	const end = Math.min(mag.length - 1, Math.ceil(hi * nfft / sampleRate));
	if (end <= start) return 0;
	let sum = 0;
	for (let i = start; i <= end; i++) sum += mag[i];
	return sum / (end - start + 1);
}
function fundamental(samples, offset, length, sampleRate) {
	const minLag = Math.floor(sampleRate / 900);
	const maxLag = Math.min(length - 1, Math.floor(sampleRate / 70));
	if (maxLag <= minLag) return null;
	let bestLag = -1;
	let best = 0;
	const stride = 4;
	const score = (lag) => {
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
	if (bestLag < 0 || best < .42) return null;
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
	return {
		freq: sampleRate / bestLag,
		weight: energy * best
	};
}
function detectKey(samples, sampleRate) {
	const emptyBands = {
		mud: 0,
		presence: 0,
		sib: 0,
		air: 0
	};
	const unknown = {
		label: "No key",
		root: 0,
		mode: "unknown",
		confidence: 0,
		chroma: new Array(12).fill(0)
	};
	const frame = 2048;
	if (samples.length < frame) return {
		key: unknown,
		bands: emptyBands
	};
	const hop = 2048;
	const total = Math.floor((samples.length - frame) / hop);
	const step = Math.max(1, Math.ceil((total + 1) / 72));
	const chroma = new Array(12).fill(0);
	const bandAcc = {
		mud: 0,
		presence: 0,
		sib: 0,
		air: 0,
		n: 0
	};
	let visited = 0;
	let pitched = 0;
	const window = /* @__PURE__ */ new Float64Array(4096);
	for (let i = 0; i < 4096; i++) window[i] = .5 * (1 - Math.cos(2 * Math.PI * i / 4095));
	for (let index = 0; index <= total; index += step) {
		const offset = index * hop;
		visited += 1;
		const pitch = fundamental(samples, offset, frame, sampleRate);
		if (pitch && pitch.freq > 70 && pitch.freq < 1100) {
			pitched += 1;
			const pc = (Math.round(69 + 12 * Math.log2(pitch.freq / 440)) % 12 + 12) % 12;
			chroma[pc] += pitch.weight;
		}
		if (offset + 4096 <= samples.length && bandAcc.n < 20) {
			const re = /* @__PURE__ */ new Float64Array(4096);
			const im = /* @__PURE__ */ new Float64Array(4096);
			for (let i = 0; i < 4096; i++) re[i] = (samples[offset + i] ?? 0) * window[i];
			fftInPlace(re, im);
			const mag = /* @__PURE__ */ new Float64Array(2048);
			let energy = 0;
			for (let i = 1; i < mag.length; i++) {
				mag[i] = Math.hypot(re[i], im[i]);
				energy += mag[i];
			}
			if (energy > 0) {
				bandAcc.n += 1;
				bandAcc.mud += bandMean(mag, sampleRate, 180, 400);
				bandAcc.presence += bandMean(mag, sampleRate, 1800, 4500);
				bandAcc.sib += bandMean(mag, sampleRate, 5500, 9e3);
				bandAcc.air += bandMean(mag, sampleRate, 9e3, 14e3);
			}
		}
	}
	const bands = bandAcc.n === 0 ? emptyBands : {
		mud: bandAcc.mud / bandAcc.n,
		presence: bandAcc.presence / bandAcc.n,
		sib: bandAcc.sib / bandAcc.n,
		air: bandAcc.air / bandAcc.n
	};
	const totalEnergy = chroma.reduce((sum, value) => sum + value, 0);
	if (totalEnergy < 1e-8 || pitched < 6 || pitched / Math.max(1, visited) < .2) return {
		key: unknown,
		bands
	};
	const norm = chroma.map((value) => value / totalEnergy);
	let best = {
		score: -Infinity,
		root: 0,
		mode: "minor"
	};
	let second = -Infinity;
	for (let tonic = 0; tonic < 12; tonic++) for (const mode of ["major", "minor"]) {
		const corr = pearson(norm, rotate(mode === "major" ? MAJOR : MINOR, tonic));
		const set = new Set((mode === "major" ? MAJOR_SCALE : MINOR_SCALE).map((degree) => (degree + tonic) % 12));
		let inside = 0;
		let outside = 0;
		for (let i = 0; i < 12; i++) if (set.has(i)) inside += norm[i];
		else outside += norm[i];
		const third = norm[(tonic + (mode === "major" ? 4 : 3)) % 12];
		const score = corr * .65 + inside / (inside + outside + 1e-9) * .25 + norm[tonic] * 1.35 + norm[(tonic + 7) % 12] * .35 + third * .7;
		if (score > best.score) {
			second = best.score;
			best = {
				score,
				root: tonic,
				mode
			};
		} else if (score > second) second = score;
	}
	const confidence = clamp((best.score - (Number.isFinite(second) ? second : best.score)) / .22, 0, 1);
	return {
		key: {
			label: `${NOTE_NAMES[best.root]} ${best.mode}`,
			root: best.root,
			mode: best.mode,
			confidence,
			chroma: norm
		},
		bands
	};
}
function stageAudio(samples) {
	let peak = 0;
	let sum = 0;
	const count = samples.length || 1;
	for (let i = 0; i < samples.length; i++) {
		const value = samples[i];
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
	const clipped = peak >= .999;
	let zone = "staged";
	if (clipped || peakDb > -.3) zone = "clip";
	else if (rmsDb > -14) zone = "hot";
	else if (rmsDb < -26) zone = "quiet";
	return {
		peakDb,
		rmsDb,
		crestDb: peakDb - rmsDb,
		suggestedTrimDb: suggested,
		clipped,
		zone
	};
}
function pushNote(notes, note) {
	notes.push(note);
}
function buildNotes(key, stage, bands, role) {
	const notes = [];
	const fixes = [];
	if (stage.zone === "clip") {
		const fix = {
			op: "trim",
			db: stage.suggestedTrimDb
		};
		fixes.push(fix);
		pushNote(notes, {
			id: "clip",
			tone: "warn",
			title: "Clipping the converters",
			detail: `Peak ${stage.peakDb.toFixed(1)} dB. Pull the trim to ${stage.suggestedTrimDb.toFixed(1)} dB before the rack sees it.`,
			fixes: [fix]
		});
	} else if (stage.zone === "hot") {
		const fix = {
			op: "trim",
			db: stage.suggestedTrimDb
		};
		fixes.push(fix);
		pushNote(notes, {
			id: "hot",
			tone: "fix",
			title: "Printed hot",
			detail: `RMS ${stage.rmsDb.toFixed(1)} dB, crest ${stage.crestDb.toFixed(1)} dB. Stage to −18 so the comp isn't already slamming.`,
			fixes: [fix]
		});
	} else if (stage.zone === "quiet") {
		const fix = {
			op: "trim",
			db: stage.suggestedTrimDb
		};
		fixes.push(fix);
		pushNote(notes, {
			id: "quiet",
			tone: "fix",
			title: "Under the noise floor",
			detail: `RMS ${stage.rmsDb.toFixed(1)} dB. Lift ${stage.suggestedTrimDb.toFixed(1)} dB, then stop before the peak crosses −1.`,
			fixes: [fix]
		});
	} else pushNote(notes, {
		id: "staged",
		tone: "good",
		title: "Gain is in the pocket",
		detail: `RMS ${stage.rmsDb.toFixed(1)} dB, peak ${stage.peakDb.toFixed(1)} dB. Leave the trim unless you want color from the saturator.`,
		fixes: []
	});
	if (key.mode === "unknown" || key.confidence < .22) pushNote(notes, {
		id: "key-shy",
		tone: "warn",
		title: "Key is shy",
		detail: "Not enough pitched energy to trust. A sung phrase with a clear tonic will lock harder than a drum loop.",
		fixes: []
	});
	else pushNote(notes, {
		id: "key",
		tone: "good",
		title: key.label,
		detail: `${Math.round(key.confidence * 100)}% lock. Scale-aware notes on the tuner follow this tonic.`,
		fixes: []
	});
	if (role === "vocal") {
		const presence = bands.presence + 1e-9;
		if (bands.sib / presence > 1.05) {
			const fix = {
				op: "param",
				kind: "deess",
				key: "amount",
				value: 5.5,
				enable: true
			};
			const freq = {
				op: "param",
				kind: "deess",
				key: "freq",
				value: 7200,
				enable: true
			};
			fixes.push(fix, freq);
			pushNote(notes, {
				id: "sib",
				tone: "fix",
				title: "Sibilance is leading",
				detail: "5–9 kHz outweighs the presence band. De-ess around 7.2 kHz before you add air.",
				fixes: [fix, freq]
			});
		}
		if (bands.mud / presence > 1.25) {
			const fix = {
				op: "param",
				kind: "eq",
				key: "body",
				value: -2.6,
				enable: true
			};
			fixes.push(fix);
			pushNote(notes, {
				id: "mud",
				tone: "fix",
				title: "Low-mid haze",
				detail: "Energy piles up around 180–400 Hz. A small Body cut opens the lyric without thinning the chest.",
				fixes: [fix]
			});
		}
		if (bands.air / presence < .45 && stage.zone !== "clip") {
			const fix = {
				op: "param",
				kind: "eq",
				key: "air",
				value: 2.4,
				enable: true
			};
			fixes.push(fix);
			pushNote(notes, {
				id: "air",
				tone: "fix",
				title: "Top is shy",
				detail: "Air above 9 kHz is thin next to the mids. A gentle shelf, after de-ess, keeps it expensive not brittle.",
				fixes: [fix]
			});
		}
		if (stage.crestDb > 16) {
			const fix = {
				op: "param",
				kind: "comp",
				key: "threshold",
				value: -20,
				enable: true
			};
			fixes.push(fix);
			pushNote(notes, {
				id: "dynamic",
				tone: "fix",
				title: "Wide dynamics",
				detail: `Crest ${stage.crestDb.toFixed(1)} dB. A medium squeeze will keep the quiet words in the beat.`,
				fixes: [fix]
			});
		}
	}
	return {
		notes,
		fixes
	};
}
function analyzeTake(samples, sampleRate, role) {
	const stage = stageAudio(samples);
	const { key, bands } = detectKey(samples, sampleRate);
	const { notes, fixes } = buildNotes(key, stage, bands, role);
	return {
		key,
		stage,
		bands,
		notes,
		fixes
	};
}
function buildPeaks(samples, buckets = 360) {
	const count = Math.max(1, Math.min(buckets, samples.length));
	const peaks = [];
	const size = Math.floor(samples.length / count) || 1;
	for (let i = 0; i < count; i++) {
		const start = i * size;
		const end = i === count - 1 ? samples.length : Math.min(samples.length, start + size);
		let min = 0;
		let max = 0;
		for (let j = start; j < end; j++) {
			const value = samples[j];
			if (value < min) min = value;
			if (value > max) max = value;
		}
		peaks.push({
			min,
			max
		});
	}
	return peaks;
}
function midiToFreq(midi) {
	return 440 * Math.pow(2, (midi - 69) / 12);
}
function addVoice(data, sampleRate, midi, start, dur, amp, sib) {
	const f0 = midiToFreq(midi);
	const i0 = Math.max(0, Math.floor(start * sampleRate));
	const i1 = Math.min(data.length, Math.floor((start + dur) * sampleRate));
	const harms = [
		1,
		.78,
		.5,
		.32,
		.18,
		.1,
		.05
	];
	for (let i = i0; i < i1; i++) {
		const t = (i - i0) / sampleRate;
		const env = Math.min(1, t / .018) * Math.min(1, Math.max(0, dur - t) / .05);
		const vib = f0 * (1 + .007 * Math.sin(2 * Math.PI * 5.1 * (start + t)));
		let sample = 0;
		for (let h = 0; h < harms.length; h++) sample += Math.sin(2 * Math.PI * vib * (h + 1) * t + h * .4) * harms[h];
		sample *= .32;
		if (sib && t < .055) {
			const noise = Math.sin(2 * Math.PI * 7200 * t + i % 17) * (i * 17 % 7) * .15;
			sample += (Math.random() * 2 - 1) * .35 * (1 - t / .055) + noise * (1 - t / .055);
		}
		data[i] = (data[i] ?? 0) + sample * env * amp;
	}
}
function addKick(data, sampleRate, start) {
	const i0 = Math.floor(start * sampleRate);
	const len = Math.floor(.18 * sampleRate);
	for (let i = 0; i < len && i0 + i < data.length; i++) {
		const t = i / sampleRate;
		const f = 140 * Math.exp(-t * 18) + 46;
		const env = Math.exp(-t * 10);
		data[i0 + i] = (data[i0 + i] ?? 0) + Math.sin(2 * Math.PI * f * t) * env * .42;
	}
}
function addSnare(data, sampleRate, start) {
	const i0 = Math.floor(start * sampleRate);
	const len = Math.floor(.12 * sampleRate);
	for (let i = 0; i < len && i0 + i < data.length; i++) {
		const t = i / sampleRate;
		const env = Math.exp(-t * 22);
		const body = Math.sin(2 * Math.PI * 188 * t) * Math.exp(-t * 30);
		const noise = (Math.random() * 2 - 1) * .7;
		data[i0 + i] = (data[i0 + i] ?? 0) + (body + noise) * env * .22;
	}
}
function addHat(data, sampleRate, start, amp) {
	const i0 = Math.floor(start * sampleRate);
	const len = Math.floor(.035 * sampleRate);
	for (let i = 0; i < len && i0 + i < data.length; i++) {
		const t = i / sampleRate;
		const env = Math.exp(-t * 80);
		data[i0 + i] = (data[i0 + i] ?? 0) + (Math.random() * 2 - 1) * env * amp;
	}
}
function makeDemo(sampleRate = 44100) {
	const seconds = 8;
	const vocal = new Float32Array(seconds * sampleRate);
	const beat = new Float32Array(seconds * sampleRate);
	for (const note of [
		{
			midi: 66,
			t: .15,
			dur: .55,
			amp: 1
		},
		{
			midi: 69,
			t: .72,
			dur: .38,
			sib: true,
			amp: .85
		},
		{
			midi: 73,
			t: 1.15,
			dur: .48,
			amp: .9
		},
		{
			midi: 71,
			t: 1.68,
			dur: .32,
			amp: .75
		},
		{
			midi: 69,
			t: 2.05,
			dur: .42,
			sib: true,
			amp: .88
		},
		{
			midi: 66,
			t: 2.52,
			dur: .7,
			amp: 1
		},
		{
			midi: 68,
			t: 3.35,
			dur: .3,
			amp: .7
		},
		{
			midi: 73,
			t: 3.7,
			dur: .46,
			sib: true,
			amp: .92
		},
		{
			midi: 76,
			t: 4.22,
			dur: .4,
			amp: .8
		},
		{
			midi: 73,
			t: 4.68,
			dur: .36,
			amp: .78
		},
		{
			midi: 69,
			t: 5.1,
			dur: .4,
			sib: true,
			amp: .86
		},
		{
			midi: 66,
			t: 5.55,
			dur: .85,
			amp: 1
		},
		{
			midi: 64,
			t: 6.5,
			dur: .28,
			amp: .66
		},
		{
			midi: 66,
			t: 6.85,
			dur: .9,
			amp: .98
		}
	]) addVoice(vocal, sampleRate, note.midi, note.t, note.dur, note.amp ?? .8, Boolean(note.sib));
	for (let i = 0; i < vocal.length; i++) {
		const driven = Math.tanh(vocal[i] * 2.4);
		vocal[i] = driven * .92;
	}
	const bpm = 140;
	const beatSec = 60 / bpm;
	const beats = Math.floor(seconds / beatSec);
	for (let step = 0; step < beats; step++) {
		const t = step * beatSec;
		if (step % 2 === 0) addKick(beat, sampleRate, t);
		if (step % 4 === 2) addSnare(beat, sampleRate, t);
		addHat(beat, sampleRate, t, step % 2 ? .05 : .08);
		addHat(beat, sampleRate, t + beatSec * .5, .04);
	}
	return {
		vocal,
		beat,
		sampleRate,
		bpm,
		vocalName: "Demo vocal — printed hot",
		beatName: "Demo bed — 140"
	};
}
var NOTE_BEATS = [
	.25,
	.5,
	.75,
	1,
	1.5,
	2
];
function safeDisconnect(node) {
	try {
		node.disconnect();
	} catch {}
}
function mixdown(buffer) {
	const length = buffer.length;
	const mono = new Float32Array(length);
	const channels = buffer.numberOfChannels;
	for (let channel = 0; channel < channels; channel++) {
		const data = buffer.getChannelData(channel);
		for (let i = 0; i < length; i++) mono[i] = (mono[i] ?? 0) + data[i] / channels;
	}
	return mono;
}
var RackEngine = class {
	ctx = null;
	masterSum = null;
	masterGain = null;
	masterAnalyser = null;
	chains = /* @__PURE__ */ new Map();
	buffers = /* @__PURE__ */ new Map();
	sources = [];
	playing = false;
	loopOn = false;
	startedAt = 0;
	offset = 0;
	timer = 0;
	selectedId = "lead";
	bpm = 120;
	recording = false;
	recordingTrack = null;
	mediaRecorder = null;
	mic = null;
	recStream = null;
	chunks = [];
	time = /* @__PURE__ */ new Float32Array(1024);
	hold = {
		inputDb: -96,
		stagedDb: -96,
		outputDb: -96
	};
	inputClip = false;
	outputClip = false;
	irCache = /* @__PURE__ */ new Map();
	curveCache = /* @__PURE__ */ new Map();
	onRecorded = null;
	onTransport = null;
	onRecordState = null;
	onError = null;
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
	meters() {
		const chain = this.chains.get(this.selectedId);
		const input = chain ? this.ballistic("inputDb", this.level(chain.preAnalyser)) : -96;
		const staged = chain ? this.ballistic("stagedDb", this.level(chain.stagedAnalyser)) : -96;
		const output = this.masterAnalyser ? this.ballistic("outputDb", this.level(this.masterAnalyser)) : -96;
		if (input > -.4) this.inputClip = true;
		if (output > -.4) this.outputClip = true;
		return {
			inputDb: input,
			stagedDb: staged,
			outputDb: output,
			inputClip: this.inputClip,
			outputClip: this.outputClip
		};
	}
	async unlock() {
		if (!this.ctx) {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			this.ctx = new Ctx();
			this.buildMaster();
		}
		if (this.ctx.state === "suspended") await this.ctx.resume();
		return this.ctx;
	}
	async ingestBuffer(trackId, buffer) {
		await this.unlock();
		this.buffers.set(trackId, buffer);
	}
	async ingestMono(trackId, samples, sampleRate) {
		const buffer = (await this.unlock()).createBuffer(1, samples.length, sampleRate);
		const copy = new Float32Array(samples.length);
		copy.set(samples);
		buffer.copyToChannel(copy, 0);
		this.buffers.set(trackId, buffer);
	}
	async ingestFile(trackId, file) {
		const ctx = await this.unlock();
		const encoded = await file.arrayBuffer();
		const buffer = await ctx.decodeAudioData(encoded.slice(0));
		this.buffers.set(trackId, buffer);
		const samples = mixdown(buffer);
		return this.describe(file.name.replace(/\.[^.]+$/, ""), samples, buffer.sampleRate, buffer.duration, trackId);
	}
	describe(name, samples, sampleRate, duration, trackId) {
		return {
			name,
			duration,
			sampleRate,
			analysis: analyzeTake(samples, sampleRate, trackId === "beat" ? "beat" : "vocal"),
			peaks: buildPeaks(samples)
		};
	}
	sync(snapshot) {
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
			chain.trim.gain.setTargetAtTime(dbToGain(track.trimDb) * sign, ctx.currentTime, .015);
			chain.hpf.frequency.setTargetAtTime(Math.max(18, track.hpfHz), ctx.currentTime, .02);
			const level = !track.mute && (!anySolo || track.solo) ? track.volume : 0;
			chain.fader.gain.setTargetAtTime(level, ctx.currentTime, .015);
			this.ensureModules(ctx, chain, track.rack);
			for (const module of track.rack) chain.modules.get(module.id)?.update(module.params, snapshot.bpm);
			const orderKey = track.rack.map((module) => `${module.id}:${module.enabled ? 1 : 0}`).join("|");
			if (orderKey !== chain.orderKey) {
				chain.orderKey = orderKey;
				this.relink(chain, track.rack);
			}
		}
		this.masterGain.gain.setTargetAtTime(dbToGain(snapshot.masterDb), ctx.currentTime, .02);
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
		if (this.offset >= this.duration() - .03) this.offset = 0;
		const when = ctx.currentTime + .05;
		this.startedAt = when;
		let started = 0;
		for (const [id, buffer] of this.buffers) {
			if (this.recording && this.recordingTrack === id) continue;
			const chain = this.chains.get(id);
			if (!chain) continue;
			const src = ctx.createBufferSource();
			src.buffer = buffer;
			src.connect(chain.entry);
			const offset = Math.min(this.offset, Math.max(0, buffer.duration - .01));
			if (buffer.duration - offset <= .01) continue;
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
			this.finishRecording();
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
			this.finishRecording();
			return;
		}
		this.playing = false;
		this.offset = 0;
		this.stopSources();
		window.clearTimeout(this.timer);
		this.onTransport?.(false);
	}
	seek(seconds) {
		const was = this.playing;
		this.offset = Math.min(Math.max(0, seconds), this.duration() || 0);
		if (was) this.play();
	}
	async toggleRecord(trackId) {
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
					channelCount: 1
				},
				video: false
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
			const mime = [
				"audio/webm;codecs=opus",
				"audio/webm",
				"audio/mp4"
			].find((type) => MediaRecorder.isTypeSupported(type));
			const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
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
	async finishRecording() {
		const recorder = this.mediaRecorder;
		const trackId = this.recordingTrack;
		if (!recorder || !trackId || !this.ctx) return;
		this.recording = false;
		this.recordingTrack = null;
		const blob = await new Promise((resolve) => {
			recorder.addEventListener("stop", () => resolve(new Blob(this.chunks, { type: recorder.mimeType || "audio/webm" })), { once: true });
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
				name: "Mic take"
			});
		} catch {
			this.onError?.("The take recorded, but this browser couldn't decode it back into the rack.");
		}
	}
	stopMic() {
		try {
			this.mic?.disconnect();
		} catch {}
		this.mic = null;
		this.recStream?.getTracks().forEach((track) => track.stop());
		this.recStream = null;
	}
	watchEnd = () => {
		if (!this.playing) return;
		const end = this.duration();
		if (end > 0 && this.position() >= end - .02) {
			if (this.loopOn && !this.recording) {
				this.offset = 0;
				this.play();
				return;
			}
			if (this.recording) {
				this.finishRecording();
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
	stopSources() {
		for (const source of this.sources) {
			try {
				source.stop();
			} catch {}
			safeDisconnect(source);
		}
		this.sources = [];
	}
	buildMaster() {
		const ctx = this.ctx;
		if (!ctx) return;
		this.masterSum = ctx.createGain();
		const limiter = ctx.createDynamicsCompressor();
		limiter.threshold.value = -1.2;
		limiter.knee.value = 0;
		limiter.ratio.value = 20;
		limiter.attack.value = .003;
		limiter.release.value = .08;
		this.masterGain = ctx.createGain();
		this.masterGain.gain.value = .9;
		this.masterAnalyser = ctx.createAnalyser();
		this.masterAnalyser.fftSize = 2048;
		this.masterSum.connect(limiter);
		limiter.connect(this.masterGain);
		this.masterGain.connect(ctx.destination);
		this.masterGain.connect(this.masterAnalyser);
	}
	createChain(ctx) {
		const entry = ctx.createGain();
		const trim = ctx.createGain();
		const hpf = ctx.createBiquadFilter();
		hpf.type = "highpass";
		hpf.Q.value = .707;
		hpf.frequency.value = 80;
		const fader = ctx.createGain();
		const preAnalyser = ctx.createAnalyser();
		const stagedAnalyser = ctx.createAnalyser();
		const postAnalyser = ctx.createAnalyser();
		for (const analyser of [
			preAnalyser,
			stagedAnalyser,
			postAnalyser
		]) analyser.fftSize = 2048;
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
			modules: /* @__PURE__ */ new Map(),
			orderKey: ""
		};
	}
	ensureModules(ctx, chain, rack) {
		const live = new Set(rack.map((module) => module.id));
		for (const [id, built] of chain.modules) if (!live.has(id)) {
			built.dispose();
			chain.modules.delete(id);
			chain.orderKey = "";
		}
		for (const module of rack) if (!chain.modules.has(module.id)) {
			chain.modules.set(module.id, this.buildModule(ctx, module));
			chain.orderKey = "";
		}
	}
	relink(chain, rack) {
		safeDisconnect(chain.hpf);
		for (const built of chain.modules.values()) safeDisconnect(built.output);
		let node = chain.hpf;
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
	buildModule(ctx, module) {
		switch (module.kind) {
			case "eq": return this.buildEq(ctx);
			case "comp": return this.buildComp(ctx);
			case "deess": return this.buildDeess(ctx);
			case "sat": return this.buildSat(ctx);
			case "space": return this.buildSpace(ctx);
			case "width": return this.buildWidth(ctx);
			case "limit": return this.buildLimit(ctx);
		}
	}
	buildEq(ctx) {
		const low = ctx.createBiquadFilter();
		low.type = "lowshelf";
		low.frequency.value = 140;
		const body = ctx.createBiquadFilter();
		body.type = "peaking";
		body.frequency.value = 280;
		body.Q.value = .9;
		const presence = ctx.createBiquadFilter();
		presence.type = "peaking";
		presence.frequency.value = 3200;
		presence.Q.value = .9;
		const air = ctx.createBiquadFilter();
		air.type = "highshelf";
		air.frequency.value = 1e4;
		low.connect(body);
		body.connect(presence);
		presence.connect(air);
		return {
			input: low,
			output: air,
			update: (params) => {
				const now = ctx.currentTime;
				low.gain.setTargetAtTime(params.low ?? 0, now, .02);
				body.gain.setTargetAtTime(params.body ?? 0, now, .02);
				presence.gain.setTargetAtTime(params.presence ?? 0, now, .02);
				air.gain.setTargetAtTime(params.air ?? 0, now, .02);
			},
			dispose: () => {
				safeDisconnect(low);
				safeDisconnect(body);
				safeDisconnect(presence);
				safeDisconnect(air);
			}
		};
	}
	buildComp(ctx) {
		const comp = ctx.createDynamicsCompressor();
		const makeup = ctx.createGain();
		comp.connect(makeup);
		return {
			input: comp,
			output: makeup,
			update: (params) => {
				const now = ctx.currentTime;
				comp.threshold.setTargetAtTime(params.threshold ?? -18, now, .02);
				comp.ratio.setTargetAtTime(params.ratio ?? 3, now, .02);
				comp.attack.setTargetAtTime((params.attack ?? 12) / 1e3, now, .02);
				comp.release.setTargetAtTime((params.release ?? 140) / 1e3, now, .03);
				comp.knee.setTargetAtTime(8, now, .02);
				makeup.gain.setTargetAtTime(dbToGain(params.makeup ?? 0), now, .02);
			},
			dispose: () => {
				safeDisconnect(comp);
				safeDisconnect(makeup);
			}
		};
	}
	buildDeess(ctx) {
		const filter = ctx.createBiquadFilter();
		filter.type = "peaking";
		filter.Q.value = 1.3;
		return {
			input: filter,
			output: filter,
			update: (params) => {
				const now = ctx.currentTime;
				filter.frequency.setTargetAtTime(params.freq ?? 7e3, now, .02);
				filter.gain.setTargetAtTime(-(params.amount ?? 0), now, .02);
			},
			dispose: () => safeDisconnect(filter)
		};
	}
	buildSat(ctx) {
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
				const drive = params.drive ?? .2;
				const mix = params.mix ?? .4;
				pre.gain.setTargetAtTime(1 + drive * 18, now, .02);
				dry.gain.setTargetAtTime(Math.cos(mix * .5 * Math.PI), now, .02);
				wet.gain.setTargetAtTime(Math.sin(mix * .5 * Math.PI) * .85, now, .02);
				tone.frequency.setTargetAtTime(2500 + (params.tone ?? .5) * 14e3, now, .03);
				const key = Math.round(drive * 40);
				if (key !== curveKey) {
					curveKey = key;
					const cached = this.curveCache.get(key);
					const curve = cached ?? this.curve(key / 40);
					if (!cached) this.curveCache.set(key, curve);
					shaper.curve = curve;
				}
			},
			dispose: () => {
				for (const node of [
					input,
					dry,
					pre,
					shaper,
					tone,
					wet,
					sum
				]) safeDisconnect(node);
			}
		};
	}
	curve(drive) {
		const size = 1024;
		const curve = new Float32Array(size);
		const amount = 1 + drive * 12;
		const norm = Math.tanh(amount);
		for (let i = 0; i < size; i++) {
			const x = i / 1023 * 2 - 1;
			curve[i] = Math.tanh(amount * x) / norm;
		}
		return curve;
	}
	buildSpace(ctx) {
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
				const beats = NOTE_BEATS[Math.min(DELAY_NOTES.length - 1, Math.max(0, note))] ?? .5;
				const seconds = Math.min(1.25, 60 / Math.max(40, this.bpm) * beats);
				delay.delayTime.setTargetAtTime(seconds, now, .03);
				feedback.gain.setTargetAtTime(params.feedback ?? .25, now, .02);
				delayWet.gain.setTargetAtTime(params.delayMix ?? 0, now, .02);
				verbWet.gain.setTargetAtTime((params.verbMix ?? 0) * 1.4, now, .02);
				const decay = params.decay ?? .35;
				const key = `${Math.round(decay * 12)}`;
				if (key !== irKey) {
					irKey = key;
					verb.buffer = this.impulse(.35 + decay * 2.8, .35 + (1 - decay) * .4);
				}
			},
			dispose: () => {
				for (const node of [
					input,
					dry,
					delay,
					feedback,
					damp,
					delayWet,
					verbSend,
					verb,
					verbWet,
					sum
				]) safeDisconnect(node);
			}
		};
	}
	impulse(seconds, damp) {
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
				data[i] = previous * env * (channel === 0 ? 1 : .92);
			}
		}
		this.irCache.set(key, buffer);
		return buffer;
	}
	buildWidth(ctx) {
		const input = ctx.createGain();
		const delay = ctx.createDelay(.05);
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
				delay.delayTime.setTargetAtTime((params.delayMs ?? 16) / 1e3, now, .02);
				dryL.gain.setTargetAtTime(1 - amount * .2, now, .02);
				dryR.gain.setTargetAtTime(1 - amount * .2, now, .02);
				wet.gain.setTargetAtTime(amount * .75, now, .02);
			},
			dispose: () => {
				for (const node of [
					input,
					delay,
					wet,
					invert,
					dryL,
					dryR,
					merger
				]) safeDisconnect(node);
			}
		};
	}
	buildLimit(ctx) {
		const drive = ctx.createGain();
		const comp = ctx.createDynamicsCompressor();
		comp.ratio.value = 20;
		comp.knee.value = 0;
		comp.attack.value = .002;
		comp.release.value = .06;
		drive.connect(comp);
		return {
			input: drive,
			output: comp,
			update: (params) => {
				const now = ctx.currentTime;
				drive.gain.setTargetAtTime(dbToGain(params.push ?? 0), now, .02);
				comp.threshold.setTargetAtTime(params.ceiling ?? -1, now, .02);
			},
			dispose: () => {
				safeDisconnect(drive);
				safeDisconnect(comp);
			}
		};
	}
	level(analyser) {
		analyser.getFloatTimeDomainData(this.time);
		let peak = 0;
		for (let i = 0; i < this.time.length; i++) peak = Math.max(peak, Math.abs(this.time[i]));
		return 20 * Math.log10(peak + 1e-8);
	}
	ballistic(slot, value) {
		const previous = this.hold[slot];
		const next = value > previous ? value : previous - 3.5;
		this.hold[slot] = next;
		return next;
	}
};
var engine = new RackEngine();
function Knob({ label, value, min, max, step, display, onChange, defaultValue }) {
	const span = max - min || 1;
	const amount = clamp((value - min) / span, 0, 1);
	const radius = 18;
	const circ = 2 * Math.PI * radius;
	const sweep = circ * .75;
	const dash = sweep * amount;
	function commit(next) {
		onChange(clamp(quantize(next, step), min, max));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-14 flex-col items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "slider",
				"aria-label": label,
				"aria-valuemin": min,
				"aria-valuemax": max,
				"aria-valuenow": value,
				"aria-valuetext": `${label} ${display}`,
				className: "relative grid size-11 place-items-center rounded-full",
				onDoubleClick: () => {
					if (defaultValue !== void 0) commit(defaultValue);
				},
				onKeyDown: (event) => {
					const direction = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 0;
					if (!direction) return;
					event.preventDefault();
					commit(value + direction * (event.shiftKey ? step : step * 4));
				},
				onPointerDown: (event) => {
					if (event.button !== 0) return;
					event.preventDefault();
					const startY = event.clientY;
					const start = value;
					const target = event.currentTarget;
					target.setPointerCapture(event.pointerId);
					const move = (ev) => {
						const fine = ev.shiftKey ? .25 : 1;
						commit(start + (startY - ev.clientY) / 120 * span * fine);
					};
					const up = () => {
						target.removeEventListener("pointermove", move);
						target.removeEventListener("pointerup", up);
					};
					target.addEventListener("pointermove", move);
					target.addEventListener("pointerup", up);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 48 48",
					className: "size-11",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "24",
							cy: "24",
							r: radius,
							fill: "none",
							stroke: "var(--color-line)",
							strokeWidth: "3",
							strokeLinecap: "round",
							strokeDasharray: `${sweep} ${circ}`,
							transform: "rotate(135 24 24)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "24",
							cy: "24",
							r: radius,
							fill: "none",
							stroke: "var(--color-signal)",
							strokeWidth: "3",
							strokeLinecap: "round",
							strokeDasharray: `${dash} ${circ}`,
							transform: "rotate(135 24 24)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "24",
							cy: "24",
							r: "11",
							fill: "var(--color-inset)"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute top-1/2 left-1/2 size-1 rounded-full bg-signal",
					style: { transform: `translate(-50%, -50%) rotate(${-135 + amount * 270}deg) translateY(-13px)` }
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono-num text-xs text-fg",
				children: display
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-wide text-muted uppercase",
				children: label
			})
		]
	});
}
function MeterBridge() {
	const [meters, setMeters] = (0, import_react.useState)({
		inputDb: -96,
		stagedDb: -96,
		outputDb: -96,
		inputClip: false,
		outputClip: false
	});
	(0, import_react.useEffect)(() => {
		let frame = 0;
		let last = 0;
		const tick = (now) => {
			if (now - last > 48) {
				last = now;
				setMeters(engine.meters());
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-1 flex-col gap-2 sm:max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "In" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "font-mono-num text-fg",
					onClick: () => engine.clearClipLatch(),
					children: meters.inputClip ? "CLIP" : fmtDb(meters.inputDb)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeterBar, {
				db: meters.inputDb,
				clip: meters.inputClip
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Staged" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono-num text-fg",
					children: fmtDb(meters.stagedDb)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeterBar, {
				db: meters.stagedDb,
				mark: -18
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `font-mono-num ${meters.outputClip ? "text-clip" : "text-fg"}`,
					children: meters.outputClip ? "CLIP" : fmtDb(meters.outputDb)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeterBar, {
				db: meters.outputDb,
				clip: meters.outputClip
			})
		]
	});
}
function MeterBar({ db, clip = false, mark }) {
	const lit = clamp((db + 48) / 48, 0, 1);
	const markAt = mark === void 0 ? null : clamp((mark + 48) / 48, 0, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-2 overflow-hidden rounded-full bg-inset",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full ${clip ? "bg-clip" : "bg-signal"}`,
			style: { width: `${lit * 100}%` }
		}), markAt !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-0 h-full w-px bg-fg",
			style: { left: `${markAt * 100}%` }
		}) : null]
	});
}
function Fader({ label, value, min, max, step, display, onChange, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `flex min-w-0 flex-1 ${compact ? "flex-row items-center gap-2" : "flex-col gap-1"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: compact ? "sr-only" : "flex items-center justify-between gap-2 text-xs tracking-widest text-muted uppercase",
				children: [label, compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono-num text-fg",
					children: display
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
				className: "relative flex h-11 w-full touch-none items-center",
				min,
				max,
				step,
				value: [value],
				onValueChange: ([next]) => {
					if (next !== void 0) onChange(next);
				},
				"aria-label": label,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
					className: "relative h-1 grow rounded-full bg-inset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-signal" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-5 rounded-full border border-line bg-fg shadow-ring" })]
			}),
			compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono-num w-12 shrink-0 text-right text-xs text-fg",
				children: display
			}) : null
		]
	});
}
var POSE_SRC = {
	idle: "/mic/idle.jpg",
	talk: "/mic/talk.jpg",
	listen: "/mic/listen.jpg",
	record: "/mic/record.jpg"
};
var STATUS = {
	idle: "Standing by",
	talk: "On the vocal",
	listen: "In the groove",
	record: "Recording"
};
function LiveMic({ playing, recording, agentLineId }) {
	const [talking, setTalking] = (0, import_react.useState)(false);
	const [energy, setEnergy] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!agentLineId) return;
		setTalking(true);
		const timer = window.setTimeout(() => setTalking(false), 3400);
		return () => window.clearTimeout(timer);
	}, [agentLineId]);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		let last = 0;
		const tick = (now) => {
			if (now - last > 48) {
				last = now;
				const db = engine.meters().outputDb;
				const next = playing ? Math.min(1, Math.max(0, (db + 36) / 36)) : 0;
				setEnergy((prev) => prev * .55 + next * .45);
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [playing]);
	const pose = recording ? "record" : talking ? "talk" : playing ? "listen" : "idle";
	const motion = pose === "talk" ? "mic-talk" : pose === "listen" || pose === "record" ? "mic-groove" : "mic-idle";
	const groove = pose === "listen" ? .9 - energy * .45 : pose === "record" ? .72 : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "relative mx-auto aspect-2/3 w-64 shrink-0 overflow-hidden bg-stage",
		role: "img",
		"aria-label": `Mic is ${STATUS[pose].toLowerCase()}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `absolute -inset-4 ${motion}`,
				style: groove ? { animationDuration: `${groove}s` } : void 0,
				children: Object.keys(POSE_SRC).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: POSE_SRC[key],
					alt: "",
					draggable: false,
					className: `absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${pose === key ? "opacity-100" : "opacity-0"}`
				}, key))
			}),
			recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mic-lamp pointer-events-none absolute inset-0 bg-clip/20" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-bg/80 to-transparent px-3 pt-10 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${recording ? "bg-clip" : "bg-signal"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tracking-widest text-fg uppercase",
					children: STATUS[pose]
				})]
			})
		]
	});
}
function SpokenLine({ text }) {
	const [shown, setShown] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(text);
			return;
		}
		setShown("");
		let index = 0;
		const timer = window.setInterval(() => {
			index += 2;
			setShown(text.slice(0, index));
			if (index >= text.length) window.clearInterval(timer);
		}, 16);
		return () => window.clearInterval(timer);
	}, [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "min-h-16 text-base leading-6 text-fg",
		"aria-live": "polite",
		children: [shown, shown.length < text.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-signal",
			children: "▍"
		}) : null]
	});
}
var vocalOrder = [
	"eq",
	"comp",
	"deess",
	"sat",
	"space",
	"width",
	"limit"
];
var drivenOrder = [
	"sat",
	"eq",
	"comp",
	"deess",
	"space",
	"width",
	"limit"
];
var PRESETS = [
	{
		id: "raw",
		name: "Raw",
		tag: "Utility",
		blurb: "A clean vocal lane. Light squeeze, a hint of air, almost no room.",
		hpfHz: 80,
		macros: {
			warmth: .18,
			air: .28,
			space: .14,
			glue: .32,
			width: .16
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: 0,
				body: -.6,
				presence: .4,
				air: 1.2
			},
			comp: {
				threshold: -16,
				ratio: 2.4,
				attack: 14,
				release: 140,
				makeup: 1.5
			},
			deess: {
				freq: 7200,
				amount: 2.5
			},
			sat: {
				drive: .12,
				mix: .28,
				tone: .6
			},
			space: {
				delayMix: .06,
				delayNote: 1,
				feedback: .18,
				verbMix: .1,
				decay: .28
			},
			width: {
				amount: .12,
				delayMs: 14
			},
			limit: {
				ceiling: -1,
				push: .8
			}
		}
	},
	{
		id: "honey",
		name: "Honey Glaze",
		tag: "R&B",
		blurb: "Slow opto feel, a warm low shelf, and a small room that never washes the lyric.",
		hpfHz: 70,
		macros: {
			warmth: .62,
			air: .4,
			space: .38,
			glue: .48,
			width: .42
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: 2.2,
				body: -1.4,
				presence: 1.1,
				air: 2.4
			},
			comp: {
				threshold: -20,
				ratio: 3.2,
				attack: 22,
				release: 200,
				makeup: 3
			},
			deess: {
				freq: 6500,
				amount: 3.5
			},
			sat: {
				drive: .48,
				mix: .55,
				tone: .42
			},
			space: {
				delayMix: .16,
				delayNote: 1,
				feedback: .32,
				verbMix: .26,
				decay: .48
			},
			width: {
				amount: .38,
				delayMs: 18
			},
			limit: {
				ceiling: -1,
				push: 2
			}
		}
	},
	{
		id: "pepper",
		name: "Black Pepper",
		tag: "Trap",
		blurb: "Fast squeeze, forward presence, a short throw, and enough drive to sit on an 808.",
		hpfHz: 100,
		macros: {
			warmth: .55,
			air: .72,
			space: .34,
			glue: .78,
			width: .3
		},
		order: drivenOrder,
		patches: {
			eq: {
				low: 1,
				body: -2.4,
				presence: 2.8,
				air: 3.6
			},
			comp: {
				threshold: -24,
				ratio: 6,
				attack: 6,
				release: 90,
				makeup: 4
			},
			deess: {
				freq: 8200,
				amount: 5.5
			},
			sat: {
				drive: .66,
				mix: .7,
				tone: .62
			},
			space: {
				delayMix: .22,
				delayNote: 2,
				feedback: .28,
				verbMix: .12,
				decay: .26
			},
			width: {
				amount: .26,
				delayMs: 12
			},
			limit: {
				ceiling: -.8,
				push: 4.5
			}
		}
	},
	{
		id: "simmer",
		name: "Slow Simmer",
		tag: "Soul",
		blurb: "Tube-leaning mids, a patient release, and a room you can stand in.",
		hpfHz: 60,
		macros: {
			warmth: .7,
			air: .32,
			space: .46,
			glue: .4,
			width: .36
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: 2.6,
				body: .8,
				presence: .4,
				air: 1
			},
			comp: {
				threshold: -18,
				ratio: 2.8,
				attack: 28,
				release: 240,
				makeup: 2.4
			},
			deess: {
				freq: 6800,
				amount: 2
			},
			sat: {
				drive: .58,
				mix: .62,
				tone: .34
			},
			space: {
				delayMix: .1,
				delayNote: 3,
				feedback: .22,
				verbMix: .34,
				decay: .62
			},
			width: {
				amount: .34,
				delayMs: 20
			},
			limit: {
				ceiling: -1.2,
				push: 1.5
			}
		}
	},
	{
		id: "flash",
		name: "Flash Fry",
		tag: "Hyperpop",
		blurb: "Bright shelf, tight de-ess, a sparkle delay, and width that feels synthetic on purpose.",
		hpfHz: 110,
		macros: {
			warmth: .22,
			air: .86,
			space: .52,
			glue: .7,
			width: .74
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: -1.5,
				body: -2,
				presence: 2.2,
				air: 5.5
			},
			comp: {
				threshold: -22,
				ratio: 5,
				attack: 5,
				release: 70,
				makeup: 3.5
			},
			deess: {
				freq: 9e3,
				amount: 4.5
			},
			sat: {
				drive: .35,
				mix: .4,
				tone: .86
			},
			space: {
				delayMix: .28,
				delayNote: 0,
				feedback: .42,
				verbMix: .18,
				decay: .22
			},
			width: {
				amount: .72,
				delayMs: 11
			},
			limit: {
				ceiling: -.6,
				push: 3.5
			}
		}
	},
	{
		id: "smoke",
		name: "Smoke Room",
		tag: "Tape",
		blurb: "Worn saturation, a dark top, thump around the low shelf, bite pulled off 3 kHz.",
		hpfHz: 50,
		macros: {
			warmth: .78,
			air: .12,
			space: .3,
			glue: .44,
			width: .22
		},
		order: drivenOrder,
		patches: {
			eq: {
				low: 2.4,
				body: 1.2,
				presence: -1.6,
				air: -1.2
			},
			comp: {
				threshold: -17,
				ratio: 2.6,
				attack: 18,
				release: 180,
				makeup: 2
			},
			deess: {
				freq: 6e3,
				amount: 1.5
			},
			sat: {
				drive: .72,
				mix: .75,
				tone: .22
			},
			space: {
				delayMix: .08,
				delayNote: 3,
				feedback: .2,
				verbMix: .22,
				decay: .55
			},
			width: {
				amount: .18,
				delayMs: 22
			},
			limit: {
				ceiling: -1.4,
				push: 1.2
			}
		}
	},
	{
		id: "citrus",
		name: "Citrus Air",
		tag: "Pop",
		blurb: "Radio sheen. Present mids, controlled esses, a short plate, nothing romantic.",
		hpfHz: 90,
		macros: {
			warmth: .3,
			air: .68,
			space: .36,
			glue: .6,
			width: .4
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: .4,
				body: -1.8,
				presence: 2.4,
				air: 3.8
			},
			comp: {
				threshold: -20,
				ratio: 3.8,
				attack: 10,
				release: 110,
				makeup: 3.2
			},
			deess: {
				freq: 7500,
				amount: 4.8
			},
			sat: {
				drive: .28,
				mix: .36,
				tone: .7
			},
			space: {
				delayMix: .14,
				delayNote: 1,
				feedback: .24,
				verbMix: .2,
				decay: .32
			},
			width: {
				amount: .36,
				delayMs: 14
			},
			limit: {
				ceiling: -.8,
				push: 2.8
			}
		}
	},
	{
		id: "reduction",
		name: "Reduction",
		tag: "Stack",
		blurb: "Dry on purpose. For doubles and ad-libs that have to tuck under a lead.",
		hpfHz: 120,
		macros: {
			warmth: .16,
			air: .34,
			space: .05,
			glue: .55,
			width: .08
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: -.8,
				body: -1.2,
				presence: 1.4,
				air: 1.6
			},
			comp: {
				threshold: -18,
				ratio: 3.4,
				attack: 8,
				release: 100,
				makeup: 2
			},
			deess: {
				freq: 7800,
				amount: 4
			},
			sat: {
				drive: .1,
				mix: .2,
				tone: .58
			},
			space: {
				delayMix: .02,
				delayNote: 1,
				feedback: .1,
				verbMix: .03,
				decay: .2
			},
			width: {
				amount: .06,
				delayMs: 10
			},
			limit: {
				ceiling: -1,
				push: 1
			}
		}
	},
	{
		id: "roux",
		name: "Midnight Roux",
		tag: "Afro",
		blurb: "Rhythmic eighth-note throw, mid presence, light heat. Built to dance with percussion.",
		hpfHz: 85,
		macros: {
			warmth: .48,
			air: .5,
			space: .44,
			glue: .5,
			width: .46
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: 1.4,
				body: -.8,
				presence: 2,
				air: 2.2
			},
			comp: {
				threshold: -19,
				ratio: 3.4,
				attack: 12,
				release: 130,
				makeup: 2.6
			},
			deess: {
				freq: 7e3,
				amount: 3
			},
			sat: {
				drive: .4,
				mix: .5,
				tone: .5
			},
			space: {
				delayMix: .26,
				delayNote: 1,
				feedback: .36,
				verbMix: .16,
				decay: .3
			},
			width: {
				amount: .44,
				delayMs: 15
			},
			limit: {
				ceiling: -1,
				push: 2.2
			}
		}
	},
	{
		id: "canyon",
		name: "Canyon Moon",
		tag: "Ambient",
		blurb: "Long decay, rolled harshness, slow attack. A desert room, not a club.",
		hpfHz: 70,
		macros: {
			warmth: .4,
			air: .22,
			space: .82,
			glue: .28,
			width: .58
		},
		order: vocalOrder,
		patches: {
			eq: {
				low: 1,
				body: -.4,
				presence: -1.2,
				air: .6
			},
			comp: {
				threshold: -16,
				ratio: 2,
				attack: 40,
				release: 280,
				makeup: 1.2
			},
			deess: {
				freq: 6400,
				amount: 2.2
			},
			sat: {
				drive: .3,
				mix: .4,
				tone: .3
			},
			space: {
				delayMix: .2,
				delayNote: 5,
				feedback: .48,
				verbMix: .55,
				decay: .86
			},
			width: {
				amount: .6,
				delayMs: 24
			},
			limit: {
				ceiling: -1.5,
				push: .6
			}
		}
	},
	{
		id: "bed",
		name: "Bed",
		tag: "Beat",
		blurb: "A light desk for drums and loops. Low shelf, gentle glue, no vocal de-ess.",
		hpfHz: 28,
		macros: {
			warmth: .34,
			air: .2,
			space: .12,
			glue: .4,
			width: .18
		},
		order: MODULE_ORDER,
		forBeat: true,
		disabled: ["deess"],
		patches: {
			eq: {
				low: 1.6,
				body: -.8,
				presence: .6,
				air: .4
			},
			comp: {
				threshold: -14,
				ratio: 2.2,
				attack: 18,
				release: 120,
				makeup: 1
			},
			sat: {
				drive: .22,
				mix: .3,
				tone: .45
			},
			space: {
				delayMix: .04,
				delayNote: 1,
				feedback: .12,
				verbMix: .08,
				decay: .24
			},
			width: {
				amount: .16,
				delayMs: 12
			},
			limit: {
				ceiling: -1,
				push: 1.4
			}
		}
	}
];
function presetById(id) {
	return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
}
function rackFromPreset(trackId, preset) {
	return makeRack(trackId, preset.order, preset.patches, preset.disabled ?? []);
}
function initialTracks() {
	return [
		track("lead", "Lead", "Main vocal", "vocal", "raw", true),
		track("double", "Double", "Stacked take", "vocal", "reduction", false),
		track("adlib", "Ad-lib", "Throws", "vocal", "flash", false),
		track("beat", "Beat", "Instrumental", "beat", "bed", false)
	];
}
function track(id, name, hint, role, presetId, armed) {
	const preset = presetById(presetId);
	return {
		id,
		name,
		hint,
		role,
		volume: role === "beat" ? .72 : .86,
		mute: false,
		solo: false,
		armed,
		trimDb: 0,
		hpfHz: preset.hpfHz,
		polarity: false,
		presetId,
		custom: false,
		macros: { ...preset.macros },
		rack: rackFromPreset(id, preset)
	};
}
var HINTS = [
	{
		test: /trap|rage|pepper|808|drill/,
		id: "pepper"
	},
	{
		test: /r&b|rnb|silk|honey|smooth|neo/,
		id: "honey"
	},
	{
		test: /soul|gospel|simmer|motown/,
		id: "simmer"
	},
	{
		test: /hyper|fry|pc music|bright pop|glossy/,
		id: "flash"
	},
	{
		test: /smoke|vintage|tape|lo-?fi|70s|worn|mojo/,
		id: "smoke"
	},
	{
		test: /pop|citrus|radio|topline/,
		id: "citrus"
	},
	{
		test: /afro|roux|amapiano|dancehall/,
		id: "roux"
	},
	{
		test: /canyon|ambient|desert|hall|moon|huge space|ethereal/,
		id: "canyon"
	},
	{
		test: /dry|stack|double|ad-?lib|intimate|close/,
		id: "reduction"
	},
	{
		test: /beat|drum|instrumental|loop bed/,
		id: "bed"
	},
	{
		test: /raw|clean|natural|naked/,
		id: "raw"
	}
];
function setParam(rack, kind, key, value) {
	const module = rack.find((item) => item.kind === kind);
	if (!module) return;
	module.enabled = true;
	const current = module.params[key] ?? 0;
	module.params[key] = value;
	return current;
}
function bump(rack, kind, key, delta, min, max) {
	const module = rack.find((item) => item.kind === kind);
	if (!module) return 0;
	module.enabled = true;
	const next = clamp((module.params[key] ?? 0) + delta, min, max);
	const changed = next - (module.params[key] ?? 0);
	module.params[key] = next;
	return changed;
}
function interpretPrompt(text, trackId, current) {
	const clean = text.trim().toLowerCase();
	const hinted = HINTS.find((hint) => hint.test.test(clean));
	const preset = presetById(hinted?.id ?? current?.id ?? "raw");
	const rack = rackFromPreset(trackId, preset);
	const macros = { ...preset.macros };
	let hpfHz = preset.hpfHz;
	const moves = [];
	if (/warm|body|thick|fat|analog/.test(clean)) {
		bump(rack, "sat", "drive", .22, 0, 1);
		bump(rack, "sat", "mix", .15, 0, 1);
		bump(rack, "eq", "low", 1.8, -8, 8);
		macros.warmth = clamp(macros.warmth + .2, 0, 1);
		moves.push("warmth into the saturator and a low shelf");
	}
	if (/air|shine|bright|open|sparkle|crisp/.test(clean)) {
		bump(rack, "eq", "air", 2.4, -8, 8);
		macros.air = clamp(macros.air + .22, 0, 1);
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
		setParam(rack, "space", "verbMix", .04);
		setParam(rack, "space", "delayMix", .03);
		macros.space = .06;
		moves.push("space almost closed");
	} else if (/canyon|huge|vast|cathedral|long/.test(clean)) {
		setParam(rack, "space", "verbMix", .58);
		setParam(rack, "space", "decay", .9);
		setParam(rack, "space", "delayNote", 5);
		macros.space = .86;
		moves.push("a long canyon decay");
	} else if (/room|plate|verb|space|hall|ambient/.test(clean)) {
		bump(rack, "space", "verbMix", .16, 0, 1);
		bump(rack, "space", "decay", .12, 0, 1);
		macros.space = clamp(macros.space + .16, 0, 1);
		moves.push("a little more room");
	}
	if (/delay|throw|slap|echo/.test(clean)) {
		bump(rack, "space", "delayMix", .16, 0, 1);
		if (/slap/.test(clean)) setParam(rack, "space", "delayNote", 0);
		moves.push("a tempo throw");
	}
	if (/tight|glue|squeeze|punch|control/.test(clean)) {
		bump(rack, "comp", "threshold", -4, -40, 0);
		bump(rack, "comp", "ratio", 1.2, 1, 12);
		macros.glue = clamp(macros.glue + .18, 0, 1);
		moves.push("a tighter squeeze");
	}
	if (/wide|double|stereo|haas/.test(clean)) {
		bump(rack, "width", "amount", .22, 0, 1);
		macros.width = clamp(macros.width + .2, 0, 1);
		moves.push("a wider image");
	}
	if (/tape|satura|drive|grit|dirty/.test(clean)) {
		bump(rack, "sat", "drive", .2, 0, 1);
		bump(rack, "sat", "mix", .12, 0, 1);
		macros.warmth = clamp(macros.warmth + .15, 0, 1);
		moves.push("more tape drive");
	}
	if (/dark|roll off|dull|muffled/.test(clean)) {
		bump(rack, "eq", "air", -2.2, -8, 8);
		bump(rack, "sat", "tone", -.2, 0, 1);
		hpfHz = Math.max(40, hpfHz - 15);
		moves.push("the top rolled off");
	}
	if (/rumble|low cut|high pass|hpf/.test(clean)) {
		hpfHz = Math.min(180, hpfHz + 30);
		moves.push(`high-pass nearer ${Math.round(hpfHz)} Hz`);
	}
	const title = hinted ? preset.name : moves.length ? "Custom rack" : preset.name;
	const base = hinted ? preset.blurb : `Started from ${preset.name}.`;
	return {
		title,
		blurb: moves.length ? `Built ${title} — ${moves.join(", ")}.` : `Built ${preset.name} — ${base.charAt(0).toLowerCase()}${base.slice(1)}`,
		presetId: preset.id,
		hpfHz,
		macros,
		rack
	};
}
function macroPatch(key, value, rack, macros) {
	const next = {
		...macros,
		[key]: value
	};
	if (key === "warmth") {
		setOwned(rack, "sat", "drive", .08 + value * .7);
		setOwned(rack, "sat", "mix", .2 + value * .6);
		setOwned(rack, "eq", "low", -1 + value * 4);
	} else if (key === "air") setOwned(rack, "eq", "air", -1 + value * 7);
	else if (key === "space") {
		setOwned(rack, "space", "verbMix", value * .6);
		setOwned(rack, "space", "delayMix", value * .32);
	} else if (key === "glue") {
		setOwned(rack, "comp", "threshold", -12 - value * 16);
		setOwned(rack, "comp", "ratio", 1.6 + value * 6);
		setOwned(rack, "comp", "makeup", value * 4);
	} else if (key === "width") setOwned(rack, "width", "amount", value);
	return next;
}
function setOwned(rack, kind, key, value) {
	const module = rack.find((item) => item.kind === kind);
	if (!module) return;
	module.enabled = true;
	module.params[key] = value;
}
var STORAGE_KEY = "sauc3-agent-v1";
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
function selected(state) {
	return state.tracks.find((track) => track.id === state.selectedId) ?? state.tracks[0];
}
function mapSelected(state, mapper) {
	return state.tracks.map((track) => track.id === state.selectedId ? mapper(track) : track);
}
var useSession = create((set, get) => ({
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
	log: [{
		id: "hello",
		role: "agent",
		text: "Hi, I'm Mic, your personal sound engineer. Tap an example below, or tell me the record you want."
	}],
	ready: false,
	select: (id) => set({
		selectedId: id,
		tracks: get().tracks.map((item) => ({
			...item,
			armed: item.id === id
		}))
	}),
	patchTrack: (id, patch) => set({ tracks: get().tracks.map((track) => track.id === id ? {
		...track,
		...patch
	} : track) }),
	setParam: (kind, key, value) => set({ tracks: mapSelected(get(), (track) => ({
		...track,
		custom: true,
		rack: track.rack.map((module) => module.kind === kind ? {
			...module,
			params: {
				...module.params,
				[key]: value
			}
		} : module)
	})) }),
	toggleModule: (kind) => set({ tracks: mapSelected(get(), (track) => ({
		...track,
		custom: true,
		rack: track.rack.map((module) => module.kind === kind ? {
			...module,
			enabled: !module.enabled
		} : module)
	})) }),
	moveModule: (index, direction) => set({ tracks: mapSelected(get(), (track) => {
		const next = track.rack.slice();
		const target = index + direction;
		if (target < 0 || target >= next.length) return track;
		const [item] = next.splice(index, 1);
		next.splice(target, 0, item);
		return {
			...track,
			custom: true,
			rack: next
		};
	}) }),
	setTrim: (db) => set({ tracks: mapSelected(get(), (track) => ({
		...track,
		trimDb: db
	})) }),
	setHpf: (hz) => set({ tracks: mapSelected(get(), (track) => ({
		...track,
		hpfHz: hz
	})) }),
	togglePolarity: () => set({ tracks: mapSelected(get(), (track) => ({
		...track,
		polarity: !track.polarity
	})) }),
	loadPreset: (id) => {
		const preset = presetById(id);
		set({ tracks: mapSelected(get(), (track) => ({
			...track,
			presetId: id,
			custom: false,
			macros: { ...preset.macros },
			hpfHz: preset.hpfHz,
			rack: rackFromPreset(track.id, preset)
		})) });
		get().pushLine("agent", `${preset.name} — ${preset.blurb}`);
	},
	setMacro: (key, value) => {
		const state = get();
		const track = selected(state);
		const draft = track.rack.map((module) => ({
			...module,
			params: { ...module.params }
		}));
		const macros = macroPatch(key, value, draft, track.macros);
		set({ tracks: mapSelected(state, (item) => ({
			...item,
			custom: true,
			macros,
			rack: draft
		})) });
	},
	setMode: (mode) => set({ mode }),
	setBpm: (bpm) => set({ bpm }),
	setLoop: (loop) => set({ loop }),
	setMaster: (db) => set({ masterDb: db }),
	setPlaying: (playing) => set({ playing }),
	setRecording: (recording) => set({ recording }),
	setClip: (id, clip) => set({ clips: {
		...get().clips,
		[id]: clip
	} }),
	applyFixes: (fixes) => {
		if (!fixes.length) return;
		let tracks = get().tracks;
		const id = get().selectedId;
		tracks = tracks.map((track) => {
			if (track.id !== id) return track;
			let next = track;
			for (const fix of fixes) if (fix.op === "trim") next = {
				...next,
				trimDb: fix.db
			};
			else if (fix.op === "hpf") next = {
				...next,
				hpfHz: fix.hz
			};
			else next = {
				...next,
				rack: next.rack.map((module) => module.kind === fix.kind ? {
					...module,
					enabled: fix.enable || module.enabled,
					params: {
						...module.params,
						[fix.key]: fix.value
					}
				} : module)
			};
			return {
				...next,
				custom: true
			};
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
		get().pushLine("agent", `Trim set to ${db.toFixed(1)} dB so RMS lands near −18, with the peak held under −1.`);
	},
	ask: (text) => {
		const trimmed = text.trim();
		if (!trimmed) return;
		const state = get();
		const track = selected(state);
		const draft = interpretPrompt(trimmed, track.id, presetById(track.presetId));
		set({ tracks: mapSelected(state, (item) => ({
			...item,
			presetId: draft.presetId,
			custom: draft.title === "Custom rack",
			macros: draft.macros,
			hpfHz: draft.hpfHz,
			rack: draft.rack
		})) });
		get().pushLine("you", trimmed);
		get().pushLine("agent", draft.blurb);
	},
	saveTreatment: () => {
		const state = get();
		const track = selected(state);
		const preset = presetById(track.presetId);
		const treatment = {
			id: uid(),
			name: track.custom ? `${preset.name} edit` : preset.name,
			blurb: state.log.filter((line) => line.role === "agent").at(-1)?.text ?? preset.blurb,
			hpfHz: track.hpfHz,
			macros: { ...track.macros },
			modules: track.rack.map((module) => ({
				kind: module.kind,
				enabled: module.enabled,
				params: { ...module.params }
			})),
			createdAt: Date.now()
		};
		set({ treatments: [treatment, ...state.treatments].slice(0, 24) });
		get().pushLine("agent", `Saved “${treatment.name}” to this browser.`);
	},
	loadTreatment: (id) => {
		const treatment = get().treatments.find((item) => item.id === id);
		if (!treatment) return;
		set({ tracks: mapSelected(get(), (track) => ({
			...track,
			custom: true,
			macros: { ...treatment.macros },
			hpfHz: treatment.hpfHz,
			rack: treatment.modules.map((module) => ({
				id: `${track.id}-${module.kind}`,
				kind: module.kind,
				enabled: module.enabled,
				params: { ...module.params }
			}))
		})) });
		get().pushLine("agent", `Recalled ${treatment.name}.`);
	},
	removeTreatment: (id) => set({ treatments: get().treatments.filter((item) => item.id !== id) }),
	pushLine: (role, text) => set({ log: [...get().log, {
		id: uid(),
		role,
		text
	}].slice(-12) }),
	hydrate: (data) => set({
		treatments: data.treatments ?? [],
		mode: data.mode ?? "advanced",
		bpm: data.bpm || 140,
		ready: true
	}),
	audition: async () => {
		const demo = makeDemo();
		await engine.ingestMono("lead", demo.vocal, demo.sampleRate);
		await engine.ingestMono("beat", demo.beat, demo.sampleRate);
		const lead = engine.describe(demo.vocalName, demo.vocal, demo.sampleRate, demo.vocal.length / demo.sampleRate, "lead");
		const beat = engine.describe(demo.beatName, demo.beat, demo.sampleRate, demo.beat.length / demo.sampleRate, "beat");
		set({
			bpm: demo.bpm,
			clips: {
				...get().clips,
				lead,
				beat
			},
			selectedId: "lead",
			tracks: get().tracks.map((track) => ({
				...track,
				armed: track.id === "lead"
			}))
		});
		const key = lead.analysis.key;
		const stage = lead.analysis.stage;
		get().pushLine("agent", `Demo take is in. Lead reads ${key.label} (${Math.round(key.confidence * 100)}%). RMS ${stage.rmsDb.toFixed(1)} dB — ${stage.zone}. The bed is on Beat at ${demo.bpm}.`);
		const next = get();
		engine.sync({
			tracks: next.tracks,
			selectedId: next.selectedId,
			bpm: next.bpm,
			loop: next.loop,
			masterDb: next.masterDb
		});
	}
}));
function persistSession() {
	const { treatments, mode, bpm } = useSession.getState();
	const payload = {
		treatments,
		mode,
		bpm
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	} catch {}
}
function readPersisted() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.treatments)) return null;
		return parsed;
	} catch {
		return null;
	}
}
var CHIPS = [
	"warmer, like tape",
	"more air",
	"more room",
	"tighter",
	"de-ess it",
	"dry it out",
	"wider",
	"canyon moon"
];
function syncEngine() {
	const state = useSession.getState();
	engine.sync({
		tracks: state.tracks,
		selectedId: state.selectedId,
		bpm: state.bpm,
		loop: state.loop,
		masterDb: state.masterDb
	});
}
function Sauc3App() {
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
	const fileRef = (0, import_react.useRef)(null);
	const promptRef = (0, import_react.useRef)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const track = tracks.find((item) => item.id === selectedId) ?? tracks[0];
	const clip = clips[selectedId];
	const preset = presetById(track.presetId);
	const signature = (0, import_react.useMemo)(() => JSON.stringify({
		tracks,
		selectedId,
		bpm,
		loop,
		masterDb
	}), [
		tracks,
		selectedId,
		bpm,
		loop,
		masterDb
	]);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const saved = readPersisted();
		if (saved) useSession.getState().hydrate(saved);
		else useSession.setState({ ready: true });
		engine.onTransport = (next) => useSession.getState().setPlaying(next);
		engine.onRecordState = (next) => useSession.getState().setRecording(next);
		engine.onError = (message) => useSession.getState().pushLine("agent", message);
		engine.onRecorded = (payload) => {
			const printed = engine.describe(payload.name, payload.samples, payload.sampleRate, payload.duration, payload.trackId);
			useSession.getState().setClip(payload.trackId, printed);
			const key = printed.analysis.key;
			useSession.getState().pushLine("agent", `Mic take is in. ${key.label} at ${Math.round(key.confidence * 100)}% lock, RMS ${printed.analysis.stage.rmsDb.toFixed(1)} dB. Use headphones on the next pass.`);
			syncEngine();
		};
		const onKey = (event) => {
			const target = event.target;
			if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
			if (event.code !== "Space") return;
			event.preventDefault();
			engine.togglePlay();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		syncEngine();
	}, [signature]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		persistSession();
	}, [
		treatments,
		mode,
		bpm,
		ready
	]);
	async function takeFile(file) {
		if (!file) return;
		try {
			const printed = await engine.ingestFile(selectedId, file);
			useSession.getState().setClip(selectedId, printed);
			syncEngine();
			const key = printed.analysis.key;
			useSession.getState().pushLine("agent", `${printed.name} on ${track.name}. ${key.mode === "unknown" ? "No stable key" : key.label} · peak ${printed.analysis.stage.peakDb.toFixed(1)} dB · RMS ${printed.analysis.stage.rmsDb.toFixed(1)} dB.`);
		} catch {
			useSession.getState().pushLine("agent", "That file wouldn't decode. Try wav, mp3, or m4a.");
		}
	}
	const flow = [
		"STAGE",
		...track.rack.filter((module) => module.enabled).map((module) => MODULE_SPECS[module.kind].title),
		"MASTER"
	].join("  →  ");
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-bg px-4 py-6 text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono-num text-xs tracking-widest text-signal uppercase",
			children: "Vocal rack"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold tracking-widest",
			children: "SAUC3 AGENT"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh overflow-x-hidden bg-bg text-fg select-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-[1440px] flex-col gap-3 p-3 lg:h-dvh lg:min-h-0 lg:p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-4 rounded-panel bg-surface p-3 shadow-ring",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mr-auto min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono-num text-xs tracking-widest text-signal uppercase",
							children: "Vocal rack"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-xl font-semibold tracking-widest",
							children: ["SAUC3 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "AGENT"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransportButton, {
								label: playing ? "Pause" : "Play",
								hot: playing,
								onClick: () => void engine.togglePlay(),
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 translate-x-px" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransportButton, {
								label: "Stop",
								onClick: () => engine.stop(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransportButton, {
								label: recording ? "Stop recording" : "Record",
								hot: recording,
								danger: true,
								onClick: () => void engine.toggleRecord(selectedId),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-3 rounded-full ${recording ? "bg-fg" : "bg-clip"}` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransportButton, {
								label: "Loop",
								hot: loop,
								onClick: () => useSession.getState().setLoop(!loop),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
								label: "Key",
								value: clip ? clip.analysis.key.label : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
								label: "Stage",
								value: clip ? clip.analysis.stage.zone.toUpperCase() : "WAIT",
								warn: clip?.analysis.stage.zone === "clip" || clip?.analysis.stage.zone === "hot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-11 items-center gap-2 rounded-well bg-inset px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tracking-widest text-muted uppercase",
									children: "BPM"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "font-mono-num w-12 bg-transparent text-sm text-fg focus:outline-none",
									inputMode: "numeric",
									value: bpm,
									onChange: (event) => {
										const next = Number(event.target.value);
										if (Number.isFinite(next)) useSession.getState().setBpm(Math.min(240, Math.max(40, Math.round(next))));
									}
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeterBridge, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[240px_minmax(0,1fr)_300px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex min-h-0 flex-col gap-3 lg:overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Bay",
							eyebrow: "Tracks",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-2",
								children: tracks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
									id: item.id,
									active: item.id === selectedId,
									clip: clips[item.id]
								}) }, item.id))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Sauces",
							eyebrow: "Presets",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-1",
								children: PRESETS.filter((item) => (track.role === "beat" ? true : !item.forBeat) || item.id === track.presetId).map((item) => {
									const active = item.id === track.presetId;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => useSession.getState().loadPreset(item.id),
										className: `flex h-11 w-full items-center gap-2 rounded-well px-3 text-left ${active ? "bg-inset shadow-ring-strong" : "hover:bg-inset"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${active ? "bg-signal" : "bg-line"}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate text-sm",
												children: item.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono-num text-xs text-muted uppercase",
												children: item.tag
											})
										]
									}) }, item.id);
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex min-h-0 min-w-0 flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: `rounded-panel bg-surface p-3 shadow-ring ${dragOver ? "shadow-ring-strong" : ""}`,
								onDragOver: (event) => {
									event.preventDefault();
									setDragOver(true);
								},
								onDragLeave: () => setDragOver(false),
								onDrop: (event) => {
									event.preventDefault();
									setDragOver(false);
									takeFile(event.dataTransfer.files[0]);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs tracking-widest text-muted uppercase",
													children: track.hint
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
													className: "truncate text-lg font-medium",
													children: [clip?.name ?? `${track.name} is empty`, track.custom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted",
														children: " · edited"
													}) : null]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "inline-flex h-11 items-center gap-2 rounded-well bg-inset px-3 text-sm",
												onClick: () => fileRef.current?.click(),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Load"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "inline-flex h-11 items-center gap-2 rounded-well bg-signal px-3 text-sm font-medium text-bg",
												onClick: () => void useSession.getState().audition(),
												children: "Audition"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: fileRef,
												type: "file",
												accept: "audio/*",
												className: "hidden",
												onChange: (event) => {
													takeFile(event.target.files?.[0]);
													event.target.value = "";
												}
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waveform, { clip }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 flex items-center gap-2 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-3.5 shrink-0" }), "Monitoring is wet. The file stays dry, so you can restage after the take. Space plays."]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "overflow-hidden rounded-panel bg-surface shadow-ring",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "flex flex-col lg:flex-row",
									onSubmit: (event) => {
										event.preventDefault();
										const input = promptRef.current;
										if (!input) return;
										useSession.getState().ask(input.value);
										input.value = "";
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMic, {
										playing,
										recording,
										agentLineId: log.filter((line) => line.role === "agent").at(-1)?.id ?? ""
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 flex-1 flex-col justify-center gap-3 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs tracking-widest text-signal uppercase",
												children: "Mic · live"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpokenLine, { text: log.filter((line) => line.role === "agent").at(-1)?.text ?? "Tap an example and I'll rebuild the rack." })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-2 text-xs tracking-widest text-muted uppercase",
												children: "Examples"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-2 overflow-x-auto pb-1",
												children: CHIPS.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "h-11 shrink-0 rounded-full bg-inset px-4 text-sm text-fg",
													onClick: () => useSession.getState().ask(chip),
													children: chip
												}, chip))
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 rounded-well bg-inset px-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													ref: promptRef,
													className: "h-11 min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none",
													placeholder: "Warm tape, less harsh, a small room behind the vocal",
													"aria-label": "Describe the rack"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "submit",
													className: "grid size-11 place-items-center rounded-full bg-signal text-sm font-semibold text-bg",
													"aria-label": "Build rack",
													children: "↑"
												})]
											})
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "flex min-h-0 flex-1 flex-col gap-3 lg:overflow-y-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-end justify-between gap-3 px-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs tracking-widest text-muted uppercase",
												children: ["Rack · ", preset.name]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-mono-num text-xs text-fg",
												children: flow
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex rounded-well bg-inset p-1",
											children: ["simple", "advanced"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: `h-11 rounded px-3 text-xs tracking-widest uppercase ${mode === item ? "bg-face text-fg" : "text-muted"}`,
												onClick: () => useSession.getState().setMode(item),
												children: item
											}, item))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: "rounded-panel bg-face p-3 shadow-ring",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono-num text-xs text-muted",
													children: "01"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-sm font-semibold tracking-widest",
													children: "STAGE"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted",
													children: "Pinned · gain before the rack"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "ml-auto h-11 rounded-well bg-signal px-3 text-sm font-medium text-bg",
													onClick: () => useSession.getState().stageToTarget(),
													children: "Stage to −18"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-end gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "Trim",
													value: track.trimDb,
													min: -24,
													max: 18,
													step: .1,
													display: fmtDb(track.trimDb),
													defaultValue: 0,
													onChange: (value) => useSession.getState().setTrim(value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "HPF",
													value: track.hpfHz,
													min: 20,
													max: 240,
													step: 1,
													display: `${Math.round(track.hpfHz)}`,
													defaultValue: preset.hpfHz,
													onChange: (value) => useSession.getState().setHpf(value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: `h-11 rounded-well px-3 text-sm ${track.polarity ? "bg-signal text-bg" : "bg-inset text-fg"}`,
													onClick: () => useSession.getState().togglePolarity(),
													children: track.polarity ? "Polarity flipped" : "Polarity"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "min-w-0 flex-1 pb-2 text-sm text-muted",
													children: clip ? `Source peak ${fmtDb(clip.analysis.stage.peakDb)} · RMS ${fmtDb(clip.analysis.stage.rmsDb)} · crest ${clip.analysis.stage.crestDb.toFixed(1)} · suggest ${fmtDb(clip.analysis.stage.suggestedTrimDb)}` : "Waiting on audio. The mark on the staged meter is −18 dBFS."
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-panel bg-face p-3 shadow-ring",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-2 text-xs tracking-widest text-muted uppercase",
											children: "Macros"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "Warmth",
													value: track.macros.warmth,
													min: 0,
													max: 1,
													step: .01,
													display: `${Math.round(track.macros.warmth * 100)}`,
													onChange: (value) => useSession.getState().setMacro("warmth", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "Air",
													value: track.macros.air,
													min: 0,
													max: 1,
													step: .01,
													display: `${Math.round(track.macros.air * 100)}`,
													onChange: (value) => useSession.getState().setMacro("air", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "Space",
													value: track.macros.space,
													min: 0,
													max: 1,
													step: .01,
													display: `${Math.round(track.macros.space * 100)}`,
													onChange: (value) => useSession.getState().setMacro("space", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "Glue",
													value: track.macros.glue,
													min: 0,
													max: 1,
													step: .01,
													display: `${Math.round(track.macros.glue * 100)}`,
													onChange: (value) => useSession.getState().setMacro("glue", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: "Width",
													value: track.macros.width,
													min: 0,
													max: 1,
													step: .01,
													display: `${Math.round(track.macros.width * 100)}`,
													onChange: (value) => useSession.getState().setMacro("width", value)
												})
											]
										})]
									}),
									mode === "simple" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: track.rack.map((module) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => useSession.getState().toggleModule(module.kind),
											className: `h-11 rounded-full px-4 text-sm tracking-widest ${module.enabled ? "bg-signal text-bg" : "bg-face text-muted shadow-ring"}`,
											children: MODULE_SPECS[module.kind].title
										}, module.id))
									}) : track.rack.map((module, index) => {
										const spec = MODULE_SPECS[module.kind];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "rounded-panel bg-face p-3 shadow-ring",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2 flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": module.enabled ? `Bypass ${spec.title}` : `Enable ${spec.title}`,
														"aria-pressed": module.enabled,
														onClick: () => useSession.getState().toggleModule(module.kind),
														className: `grid size-11 place-items-center rounded-full ${module.enabled ? "bg-signal text-bg" : "bg-inset text-muted"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono-num text-xs text-muted",
														children: spec.index
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "text-sm font-semibold tracking-widest",
														children: spec.title
													}),
													!module.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted",
														children: "Bypassed"
													}) : null,
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "ml-auto flex gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
															label: `Move ${spec.title} earlier`,
															disabled: index === 0,
															onClick: () => useSession.getState().moveModule(index, -1),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
															label: `Move ${spec.title} later`,
															disabled: index === track.rack.length - 1,
															onClick: () => useSession.getState().moveModule(index, 1),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
														})]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `flex flex-wrap gap-3 ${module.enabled ? "" : "opacity-40"}`,
												children: spec.params.map((param) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
													label: param.label,
													value: module.params[param.key] ?? param.defaultValue,
													min: param.min,
													max: param.max,
													step: param.step,
													display: fmtParam(param, module.params[param.key] ?? param.defaultValue),
													defaultValue: param.defaultValue,
													onChange: (value) => useSession.getState().setParam(module.kind, param.key, value)
												}, param.key))
											})]
										}, module.id);
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-panel bg-surface p-3 shadow-ring",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fader, {
											label: "Master",
											value: masterDb,
											min: -24,
											max: 6,
											step: .1,
											display: fmtDb(masterDb),
											onChange: (value) => useSession.getState().setMaster(value)
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex min-h-0 flex-col gap-3 lg:overflow-y-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: clip?.analysis.key.label ?? "Key",
								eyebrow: "Auto key",
								children: clip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono-num text-3xl text-fg",
										children: clip.analysis.key.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: clip.analysis.key.mode === "unknown" ? "Not enough pitch to call it." : `${Math.round(clip.analysis.key.confidence * 100)}% clearer than the next candidate.`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 flex h-16 items-end gap-1",
										children: clip.analysis.key.chroma.map((amount, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 flex-1 flex-col items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-12 w-full items-end rounded-sm bg-inset",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `w-full rounded-sm ${index === clip.analysis.key.root ? "bg-signal" : "bg-line"}`,
													style: { height: `${Math.max(8, Math.min(100, amount * 1200))}%` }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono-num text-xs text-muted",
												children: NOTE_NAMES[index]
											})]
										}, NOTE_NAMES[index]))
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Key lands after a take. Drums usually stay shy. Vocals should lock."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								title: "Notes",
								eyebrow: "Read",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 rounded-well bg-inset px-3 text-sm",
										onClick: () => {
											if (!clip) {
												useSession.getState().pushLine("agent", "Give me a take before I read it.");
												return;
											}
											const lead = clip.analysis.notes[0];
											useSession.getState().pushLine("agent", `${clip.analysis.key.label}. ${lead?.title ?? "Clean"}. ${lead?.detail ?? ""}`);
										},
										children: "Read take"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 rounded-well bg-signal px-3 text-sm font-medium text-bg disabled:opacity-40",
										disabled: !clip?.analysis.fixes.length,
										onClick: () => clip && useSession.getState().applyFixes(clip.analysis.fixes),
										children: "Apply fixes"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "flex flex-col gap-2",
									children: [(clip?.analysis.notes ?? []).map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-well bg-inset p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `text-sm font-medium ${note.tone === "good" ? "text-signal" : "text-fg"}`,
												children: note.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm leading-6 text-muted",
												children: note.detail
											}),
											note.fixes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "mt-2 h-11 text-sm text-signal",
												onClick: () => useSession.getState().applyFixes(note.fixes),
												children: "Do this"
											}) : null
										]
									}, note.id)), !clip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-sm text-muted",
										children: "Analysis waits on audio."
									}) : null]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Library",
								eyebrow: "Treatments",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-11 place-items-center rounded-well bg-inset",
									"aria-label": "Save treatment",
									onClick: () => useSession.getState().saveTreatment(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" })
								}),
								children: treatments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Saved racks stay in this browser. Recall them on any track."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "flex flex-col gap-2",
									children: treatments.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-11 min-w-0 flex-1 truncate rounded-well bg-inset px-3 text-left text-sm",
											onClick: () => useSession.getState().loadTreatment(item.id),
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-11 place-items-center rounded-well bg-inset text-muted",
											"aria-label": `Delete ${item.name}`,
											onClick: () => useSession.getState().removeTreatment(item.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									}, item.id))
								})
							})
						]
					})
				]
			})]
		})
	});
}
function Readout({ label, value, warn = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-11 min-w-0 items-center gap-2 rounded-well bg-inset px-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs tracking-widest text-muted uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono-num truncate text-sm ${warn ? "text-clip" : "text-fg"}`,
			children: value
		})]
	});
}
function TrackRow({ id, active, clip }) {
	const track = useSession((state) => state.tracks.find((item) => item.id === id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-well p-2 ${active ? "bg-inset shadow-ring-strong" : "bg-transparent"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex h-11 w-full items-center gap-2 px-1 text-left",
			onClick: () => useSession.getState().select(id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${active ? "bg-signal" : "bg-line"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm",
					children: track.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-xs text-muted",
					children: clip?.name ?? track.hint
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1 px-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tiny, {
					label: `Mute ${track.name}`,
					hot: track.mute,
					onClick: () => useSession.getState().patchTrack(id, { mute: !track.mute }),
					children: "M"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tiny, {
					label: `Solo ${track.name}`,
					hot: track.solo,
					onClick: () => useSession.getState().patchTrack(id, { solo: !track.solo }),
					children: "S"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fader, {
					compact: true,
					label: `${track.name} level`,
					value: track.volume,
					min: 0,
					max: 1,
					step: .01,
					display: track.volume <= .001 ? "−∞" : fmtDb(20 * Math.log10(track.volume)),
					onChange: (value) => useSession.getState().patchTrack(id, { volume: value })
				})
			]
		})]
	});
}
function Waveform({ clip }) {
	const [position, setPosition] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-20 overflow-hidden rounded-well bg-inset",
		onClick: (event) => {
			if (!duration) return;
			const rect = event.currentTarget.getBoundingClientRect();
			engine.seek((event.clientX - rect.left) / rect.width * duration);
		},
		role: "slider",
		"aria-label": "Playhead",
		"aria-valuemin": 0,
		"aria-valuemax": Math.round(duration * 1e3),
		"aria-valuenow": Math.round(position * 1e3),
		tabIndex: 0,
		onKeyDown: (event) => {
			if (event.key === "ArrowRight") engine.seek(position + .5);
			if (event.key === "ArrowLeft") engine.seek(Math.max(0, position - .5));
		},
		children: [bars.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full items-center gap-px px-2",
			children: bars.map((peak, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 rounded-sm bg-signal",
				style: { height: `${Math.max(8, Math.min(100, (peak.max - peak.min) * 55))}%` }
			}, index))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "grid h-full place-items-center px-4 text-center text-sm text-muted",
			children: "Drop a vocal, a loop, or audition the printed-hot demo."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute inset-y-0 w-px bg-fg",
			style: { left: `${ratio * 100}%` }
		})]
	});
}
function Panel({ title, eyebrow, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-panel bg-surface p-3 shadow-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: eyebrow
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "truncate text-base font-medium",
					children: title
				})]
			}), action]
		}), children]
	});
}
function TransportButton({ label, onClick, children, hot = false, danger = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		"aria-pressed": hot,
		onClick,
		className: `grid size-11 place-items-center rounded-full ${hot ? danger ? "bg-clip text-fg" : "bg-signal text-bg" : "bg-inset text-fg"}`,
		children
	});
}
function IconButton({ label, onClick, disabled, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		disabled,
		onClick,
		className: "grid size-11 place-items-center rounded-well bg-inset text-fg disabled:opacity-30",
		children
	});
}
function Tiny({ label, hot, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		"aria-pressed": hot,
		onClick,
		className: `grid size-11 shrink-0 place-items-center rounded-well text-xs ${hot ? "bg-signal text-bg" : "bg-face text-muted"}`,
		children
	});
}
var SplitComponent = Sauc3App;
//#endregion
export { SplitComponent as component };
