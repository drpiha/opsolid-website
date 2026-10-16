"use client";

/**
 * Scripted voice-agent scenario. Not a live call: it types a sample dialogue,
 * drives a wave and the 3D head's mouth via the shared voice state.
 */
import { useEffect, useRef, useState } from "react";
import { voice } from "@/lib/voice-sim";

type Line = { who: string; agent: boolean; text: string; ms: number };

const BARS = 28;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function AgentDemo({ chip, play, again, note, sr, script }: { chip: string; play: string; again: string; note: string; sr: string; script: Line[] }) {
  const [lines, setLines] = useState<{ who: string; agent: boolean; text: string }[]>([]);
  const [state, setState] = useState<"ready" | "running" | "done">("ready");
  const waveRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const alive = useRef(true);
  const visible = useRef(false);

  useEffect(() => {
    alive.current = true;
    let raf = 0;
    const bars = waveRef.current ? Array.from(waveRef.current.children) as HTMLElement[] : [];
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible.current || document.hidden) return;
      const t = now / 1000;
      bars.forEach((b, i) => {
        const s = 0.1 + voice.amp * (0.55 + 0.45 * Math.sin(t * 7 + i * 1.1)) * (0.6 + 0.4 * Math.sin(i * 0.37));
        b.style.transform = `scaleY(${Math.min(1, s).toFixed(3)})`;
      });
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(
      (es) => {
        visible.current = es[0].isIntersecting;
      },
      { threshold: 0.2 },
    );
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      alive.current = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      voice.mode = "idle";
    };
  }, []);

  const run = async () => {
    if (started.current && state === "running") return;
    started.current = true;
    setState("running");
    setLines([]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const l of script) {
      if (!alive.current) return;
      voice.mode = l.agent ? "speak" : "listen";
      if (reduce) {
        setLines((p) => [...p, { who: l.who, agent: l.agent, text: l.text }]);
        await wait(Math.min(l.ms, 900));
      } else {
        const t0 = performance.now();
        const span = l.ms * 0.82;
        setLines((p) => [...p, { who: l.who, agent: l.agent, text: "" }]);
        await new Promise<void>((res) => {
          const step = () => {
            if (!alive.current) return res();
            const k = Math.min(1, (performance.now() - t0) / span);
            const txt = l.text.slice(0, Math.ceil(l.text.length * k));
            setLines((p) => p.map((x, i) => (i === p.length - 1 ? { ...x, text: txt } : x)));
            if (k < 1) requestAnimationFrame(step);
            else wait(l.ms - span).then(res);
          };
          step();
        });
      }
      await wait(380);
    }
    voice.mode = "idle";
    if (alive.current) setState("done");
  };

  return (
    <div className="v4-demo" ref={rootRef}>
      <div className="v4-demo-head">
        <span className="v4-chip">{chip}</span>
        <button type="button" className="v4-btn v4-btn-primary" style={{ minHeight: 44, padding: "0 18px" }} onClick={run} disabled={state === "running"}>
          {state === "running" ? "…" : state === "done" ? again : play}
        </button>
      </div>
      <div className="v4-wave" ref={waveRef} aria-hidden="true">
        {Array.from({ length: BARS }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="v4-tx" aria-hidden="true">
        {lines.map((l, i) => (
          <p key={i} className={l.agent ? "ag" : "cl"}>
            <b>{l.who}</b>
            <span>{l.text}</span>
          </p>
        ))}
      </div>
      <p className="v4-sr">{sr}</p>
      <p className="v4-note">{note}</p>
    </div>
  );
}
