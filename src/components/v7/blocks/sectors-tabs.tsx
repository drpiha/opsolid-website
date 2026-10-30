"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { BlockOf } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";

const STAYS: Record<L3, string> = { de: "Bleibt beim Menschen", en: "Stays with people", tr: "İnsanda kalır" };

const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";
const display = "font-[family-name:var(--font-fraunces),Georgia,serif] font-light [font-variation-settings:'SOFT'_50]";

/** Tabs on md+ (roving tabindex, arrows, Home/End), stacked cards on phones. */
export function SectorTabs({ block, locale }: { block: BlockOf<"sectors">; locale: L3 }) {
  const uid = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = block.items.length;

  const go = (i: number) => {
    const k = (i + n) % n;
    setSel(k);
    tabs.current[k]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(n - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="mt-10 md:mt-14">
      <div role="tablist" aria-label={block.h} className="hidden flex-wrap gap-x-8 gap-y-1 border-b border-[#E3DCD1] md:flex">
        {block.items.map((s, i) => (
          <button
            key={s.name}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={sel === i}
            aria-controls={`${uid}-p${i}`}
            tabIndex={sel === i ? 0 : -1}
            onClick={() => setSel(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`${mono} -mb-px min-h-[48px] border-b-2 py-2 text-[12px] uppercase transition-colors ${
              sel === i ? "border-[#B5623A] text-[#8A4524]" : "border-transparent text-[#6B665F] hover:text-[#16191D]"
            }`}
          >
            {s.tab ?? s.name}
          </button>
        ))}
      </div>

      <div className="mt-0 space-y-4 md:mt-10 md:space-y-0">
        {block.items.map((s, i) => (
          <div
            key={s.name}
            role="tabpanel"
            id={`${uid}-p${i}`}
            aria-labelledby={`${uid}-t${i}`}
            tabIndex={0}
            className={`rounded-[24px] border border-[#E3DCD1] bg-white p-5 md:rounded-none md:border-0 md:bg-transparent md:p-0 ${sel === i ? "" : "md:hidden"}`}
          >
            <p className={`${mono} text-[12px] uppercase text-[#8A4524] md:hidden`}>{s.name}</p>
            <div className="mt-3 grid gap-x-10 gap-y-8 md:mt-0 md:grid-cols-9">
              <div className="md:col-span-5">
                <h3 className={`${display} text-balance text-[1.5rem] leading-[1.15] md:text-[2rem]`}>{s.h}</h3>
                <p className="mt-4 max-w-[52ch]">{s.p}</p>
                <p className="mt-6 border-l border-[#B5623A] pl-5 text-[16px] leading-[1.6]">
                  <span className={`${mono} mb-1 block text-[12px] uppercase text-[#8A4524]`}>{STAYS[locale]}</span>
                  {s.stays}
                </p>
              </div>
              <div className="md:col-span-4">
                <p className={`${mono} inline-block rounded-full border border-[#B5623A]/50 px-3 py-1 text-[12px] uppercase text-[#8A4524]`}>{block.tag}</p>
                <ul className="mt-4 divide-y divide-[#E3DCD1] border-y border-[#E3DCD1]">
                  {s.ideas.map((idea) => (
                    <li key={idea} className="py-3 text-[16px]">
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
