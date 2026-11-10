import { useEffect, useState } from "react";
import { engine } from "@/lib/sauc3/engine";

type Pose = "idle" | "talk" | "listen" | "record";

const POSE_SRC: Record<Pose, string> = {
  idle: "/mic/idle.jpg",
  talk: "/mic/talk.jpg",
  listen: "/mic/listen.jpg",
  record: "/mic/record.jpg",
};

const STATUS: Record<Pose, string> = {
  idle: "Standing by",
  talk: "On the vocal",
  listen: "In the groove",
  record: "Recording",
};

export function LiveMic({
  playing,
  recording,
  agentLineId,
}: {
  playing: boolean;
  recording: boolean;
  agentLineId: string;
}) {
  const [talking, setTalking] = useState(false);
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    if (!agentLineId) return;
    setTalking(true);
    const timer = window.setTimeout(() => setTalking(false), 3400);
    return () => window.clearTimeout(timer);
  }, [agentLineId]);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 48) {
        last = now;
        const db = engine.meters().outputDb;
        const next = playing ? Math.min(1, Math.max(0, (db + 36) / 36)) : 0;
        setEnergy((prev) => prev * 0.55 + next * 0.45);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const pose: Pose = recording ? "record" : talking ? "talk" : playing ? "listen" : "idle";
  const motion = pose === "talk" ? "mic-talk" : pose === "listen" || pose === "record" ? "mic-groove" : "mic-idle";
  const groove = pose === "listen" ? 0.9 - energy * 0.45 : pose === "record" ? 0.72 : undefined;

  return (
    <figure
      className="relative mx-auto aspect-2/3 w-64 shrink-0 overflow-hidden bg-stage"
      role="img"
      aria-label={`Mic is ${STATUS[pose].toLowerCase()}`}
    >
      <div
        className={`absolute -inset-4 ${motion}`}
        style={groove ? { animationDuration: `${groove}s` } : undefined}
      >
        {(Object.keys(POSE_SRC) as Pose[]).map((key) => (
          <img
            key={key}
            src={POSE_SRC[key]}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              pose === key ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      {recording ? <div className="mic-lamp pointer-events-none absolute inset-0 bg-clip/20" /> : null}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-bg/80 to-transparent px-3 pt-10 pb-3">
        <span className={`size-1.5 rounded-full ${recording ? "bg-clip" : "bg-signal"}`} />
        <span className="text-xs tracking-widest text-fg uppercase">{STATUS[pose]}</span>
      </figcaption>
    </figure>
  );
}

export function SpokenLine({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
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

  return (
    <p className="min-h-16 text-base leading-6 text-fg" aria-live="polite">
      {shown}
      {shown.length < text.length ? <span className="text-signal">▍</span> : null}
    </p>
  );
}
