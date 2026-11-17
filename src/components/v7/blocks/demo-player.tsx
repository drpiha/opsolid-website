"use client";

import { useEffect, useRef, useState } from "react";
import type { BlockOf } from "@/content/v7/types";

const BARS = 28;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Line = { who: string; agent: boolean; text: string };

/**
 * Scripted assistant scenario. Not a live call: no audio, no provider, no network. Types a sample
 * dialogue; the bars move only while it runs and only without prefers-reduced-motion.
 */
export function DemoPlayer({ block }: { block: BlockOf<"demo"> }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [state, setState] = useState<"ready" | "running" | "done">("ready");
  const [speaking, setSpeaking] = useState<"idle" | "agent" | "client">("idle");
  const alive = useRef(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);

  const run = async () => {
    if (state === "running") return;
    setState("running");
    setLines([]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const l of block.script) {
      if (!alive.current) return;
      setSpeaking(l.agent ? "agent" : "client");
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
    if (!alive.current) return;
    setSpeaking("idle");
    setState("done");
  };

  return (
    <div className="wk-card overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: "@keyframes v7bar{0%,100%{transform:scaleY(.14)}50%{transform:scaleY(1)}}@media (prefers-reduced-motion:no-preference){.v7-bars[data-on=true] i{animation:v7bar 1.1s ease-in-out infinite}}" }} />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-wk-line p-4 md:p-5">
        <p className="wk-etikett is-solid">{block.chip}</p>
        <button
          type="button"
          onClick={run}
          disabled={state === "running"}
          className="wk-btn wk-btn-ink wk-btn-sm disabled:hover:bg-wk-ink"
        >
          {state === "running" ? "…" : state === "done" ? block.again : block.play}
        </button>
      </div>

      <div aria-hidden="true" data-on={speaking !== "idle"} className="v7-bars flex h-12 items-center justify-center gap-[3px] px-4">
        {Array.from({ length: BARS }, (_, i) => (
          <i
            key={i}
            className={`block h-8 w-[3px] origin-center rounded-full ${speaking === "agent" ? "bg-wk-copper" : "bg-wk-line-2"}`}
            style={{ transform: "scaleY(.14)", animationDelay: `${((i * 97) % 700) / 1000}s` }}
          />
        ))}
      </div>

      <div ref={box} aria-hidden="true" className="max-h-[360px] min-h-[160px] space-y-3 overflow-y-auto px-4 pb-5 md:px-6">
        {lines.map((l, i) => (
          <p key={i} className={`flex max-w-[52ch] flex-col gap-1 text-[16px] ${l.agent ? "" : "ml-auto items-end text-right"}`}>
            <b className={`f-mono text-[13px] font-normal ${l.agent ? "text-wk-copper-deep" : "text-wk-muted"}`}>{l.who}</b>
            <span className={`rounded-[10px] px-4 py-2.5 ${l.agent ? "border border-wk-copper/45 bg-[color-mix(in_srgb,var(--wk-copper)_5%,#fff)]" : "border border-wk-line bg-wk-paper"}`}>{l.text}</span>
          </p>
        ))}
      </div>

      <p className="sr-only">{block.sr}</p>
      <p className="f-mono border-t border-wk-line p-4 text-[13px] leading-[1.5] text-wk-muted md:px-5">{block.disclaimer}</p>
    </div>
  );
}
