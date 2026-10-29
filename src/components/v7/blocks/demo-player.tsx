"use client";

import { useEffect, useRef, useState } from "react";
import type { BlockOf } from "@/content/v7/types";

const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";
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
    <div className="mt-10 overflow-hidden rounded-[24px] border border-[#E3DCD1] bg-white md:mt-14">
      <style dangerouslySetInnerHTML={{ __html: "@keyframes v7bar{0%,100%{transform:scaleY(.14)}50%{transform:scaleY(1)}}@media (prefers-reduced-motion:no-preference){.v7-bars[data-on=true] i{animation:v7bar 1.1s ease-in-out infinite}}" }} />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3DCD1] p-4 md:p-5">
        <p className={`${mono} rounded-full border border-[#B5623A]/50 px-3 py-1 text-[12px] uppercase text-[#8A4524]`}>{block.chip}</p>
        <button
          type="button"
          onClick={run}
          disabled={state === "running"}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[16px] bg-[#16191D] px-6 text-[15px] font-medium text-[#F6F2EC] transition-colors hover:bg-[#8A4524] disabled:cursor-default disabled:opacity-60 disabled:hover:bg-[#16191D]"
        >
          {state === "running" ? "…" : state === "done" ? block.again : block.play}
        </button>
      </div>

      <div aria-hidden="true" data-on={speaking !== "idle"} className="v7-bars flex h-12 items-center justify-center gap-[3px] px-4">
        {Array.from({ length: BARS }, (_, i) => (
          <i
            key={i}
            className={`block h-8 w-[3px] origin-center rounded-full ${speaking === "agent" ? "bg-[#B5623A]" : "bg-[#CFC6B8]"}`}
            style={{ transform: "scaleY(.14)", animationDelay: `${((i * 97) % 700) / 1000}s` }}
          />
        ))}
      </div>

      <div ref={box} aria-hidden="true" className="max-h-[360px] min-h-[160px] space-y-3 overflow-y-auto px-4 pb-5 md:px-6">
        {lines.map((l, i) => (
          <p key={i} className={`flex max-w-[52ch] flex-col gap-1 text-[16px] ${l.agent ? "" : "ml-auto items-end text-right"}`}>
            <b className={`${mono} text-[11px] font-normal uppercase ${l.agent ? "text-[#8A4524]" : "text-[#6B665F]"}`}>{l.who}</b>
            <span className={`rounded-[16px] px-4 py-2.5 ${l.agent ? "bg-[#F6F2EC]" : "border border-[#E3DCD1]"}`}>{l.text}</span>
          </p>
        ))}
      </div>

      <p className="sr-only">{block.sr}</p>
      <p className="border-t border-[#E3DCD1] p-4 text-[14px] leading-[1.6] text-[#6B665F] md:px-5">{block.disclaimer}</p>
    </div>
  );
}
