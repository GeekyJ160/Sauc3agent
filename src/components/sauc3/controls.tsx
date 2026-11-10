import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { engine, type MeterSnap } from "@/lib/sauc3/engine";
import { clamp, fmtDb, quantize } from "@/lib/sauc3/model";

type KnobProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  defaultValue?: number;
};

export function Knob({ label, value, min, max, step, display, onChange, defaultValue }: KnobProps) {
  const span = max - min || 1;
  const amount = clamp((value - min) / span, 0, 1);
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const sweep = circ * 0.75;
  const dash = sweep * amount;

  function commit(next: number) {
    onChange(clamp(quantize(next, step), min, max));
  }

  return (
    <div className="flex w-14 flex-col items-center gap-1">
      <button
        type="button"
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${label} ${display}`}
        className="relative grid size-11 place-items-center rounded-full"
        onDoubleClick={() => {
          if (defaultValue !== undefined) commit(defaultValue);
        }}
        onKeyDown={(event) => {
          const direction =
            event.key === "ArrowUp" || event.key === "ArrowRight"
              ? 1
              : event.key === "ArrowDown" || event.key === "ArrowLeft"
                ? -1
                : 0;
          if (!direction) return;
          event.preventDefault();
          const jump = event.shiftKey ? step : step * 4;
          commit(value + direction * jump);
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          const startY = event.clientY;
          const start = value;
          const target = event.currentTarget;
          target.setPointerCapture(event.pointerId);
          const move = (ev: PointerEvent) => {
            const fine = ev.shiftKey ? 0.25 : 1;
            const next = start + ((startY - ev.clientY) / 120) * span * fine;
            commit(next);
          };
          const up = () => {
            target.removeEventListener("pointermove", move);
            target.removeEventListener("pointerup", up);
          };
          target.addEventListener("pointermove", move);
          target.addEventListener("pointerup", up);
        }}
      >
        <svg viewBox="0 0 48 48" className="size-11" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${sweep} ${circ}`}
            transform="rotate(135 24 24)"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(135 24 24)"
          />
          <circle cx="24" cy="24" r="11" fill="var(--color-inset)" />
        </svg>
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 size-1 rounded-full bg-signal"
          style={{
            transform: `translate(-50%, -50%) rotate(${-135 + amount * 270}deg) translateY(-13px)`,
          }}
        />
      </button>
      <span className="font-mono-num text-xs text-fg">{display}</span>
      <span className="text-xs tracking-wide text-muted uppercase">{label}</span>
    </div>
  );
}

export function MeterBridge() {
  const [meters, setMeters] = useState<MeterSnap>({
    inputDb: -96,
    stagedDb: -96,
    outputDb: -96,
    inputClip: false,
    outputClip: false,
  });

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 48) {
        last = now;
        setMeters(engine.meters());
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-md">
      <div className="flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase">
        <span>In</span>
        <button type="button" className="font-mono-num text-fg" onClick={() => engine.clearClipLatch()}>
          {meters.inputClip ? "CLIP" : fmtDb(meters.inputDb)}
        </button>
      </div>
      <MeterBar db={meters.inputDb} clip={meters.inputClip} />
      <div className="flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase">
        <span>Staged</span>
        <span className="font-mono-num text-fg">{fmtDb(meters.stagedDb)}</span>
      </div>
      <MeterBar db={meters.stagedDb} mark={-18} />
      <div className="flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase">
        <span>Out</span>
        <span className={`font-mono-num ${meters.outputClip ? "text-clip" : "text-fg"}`}>
          {meters.outputClip ? "CLIP" : fmtDb(meters.outputDb)}
        </span>
      </div>
      <MeterBar db={meters.outputDb} clip={meters.outputClip} />
    </div>
  );
}

export function MeterBar({ db, clip = false, mark }: { db: number; clip?: boolean; mark?: number }) {
  const lit = clamp((db + 48) / 48, 0, 1);
  const markAt = mark === undefined ? null : clamp((mark + 48) / 48, 0, 1);
  return (
    <div className="relative h-2 overflow-hidden rounded-full bg-inset">
      <div
        className={`h-full ${clip ? "bg-clip" : "bg-signal"}`}
        style={{ width: `${lit * 100}%` }}
      />
      {markAt !== null ? (
        <span
          className="absolute top-0 h-full w-px bg-fg"
          style={{ left: `${markAt * 100}%` }}
        />
      ) : null}
    </div>
  );
}

type FaderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  compact?: boolean;
};

export function Fader({ label, value, min, max, step, display, onChange, compact = false }: FaderProps) {
  return (
    <label className={`flex min-w-0 flex-1 ${compact ? "flex-row items-center gap-2" : "flex-col gap-1"}`}>
      <span className={compact ? "sr-only" : "flex items-center justify-between gap-2 text-xs tracking-widest text-muted uppercase"}>
        {label}
        {compact ? null : <span className="font-mono-num text-fg">{display}</span>}
      </span>
      <Slider.Root
        className="relative flex h-11 w-full touch-none items-center"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => {
          if (next !== undefined) onChange(next);
        }}
        aria-label={label}
      >
        <Slider.Track className="relative h-1 grow rounded-full bg-inset">
          <Slider.Range className="absolute h-full rounded-full bg-signal" />
        </Slider.Track>
        <Slider.Thumb className="block size-5 rounded-full border border-line bg-fg shadow-ring" />
      </Slider.Root>
      {compact ? <span className="font-mono-num w-12 shrink-0 text-right text-xs text-fg">{display}</span> : null}
    </label>
  );
}
