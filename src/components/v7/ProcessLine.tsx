"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import type { BlockOf } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { Reveal } from "./Reveal";

type Step = BlockOf<"process">["steps"][number];

const L: Record<L3, { step: string; result: string }> = {
  de: { step: "Schritt", result: "Ergebnis" },
  en: { step: "Step", result: "Result" },
  tr: { step: "Adım", result: "Sonuç" },
};

function StepNode({ active }: { active: boolean }) {
  return (
    <span className="absolute left-0 top-[6px] grid size-[24px] place-items-center rounded-[8px] border border-[#B5623A] bg-[#F6F2EC]" aria-hidden="true">
      <span className={`block size-[10px] rounded-[3px] bg-[#B5623A] transition-transform duration-300 ${active ? "scale-100" : "scale-0"}`} />
    </span>
  );
}

function StepRow({ s, n, total, last, locale }: { s: Step; n: number; total: number; last: boolean; locale: L3 }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -45% 0px" });
  const [rm, setRm] = useState(false);
  useEffect(() => setRm(!!reduce), [reduce]);
  const active = rm || inView;
  const t = L[locale];
  return (
    <li ref={ref} className={`relative pl-12 md:pl-20 ${last ? "" : "pb-16 md:pb-24"}`}>
      <StepNode active={active} />
      <div className="grid gap-8 md:grid-cols-12 md:gap-x-8">
        <Reveal className="md:col-span-6">
          <p className="f-mono text-[12px] uppercase text-[#6B665F]">
            {t.step} {String(n).padStart(2, "0")}
          </p>
          <h3 className="f-display mt-2 text-[30px] leading-[1.1] md:text-[36px]">{s.h}</h3>
          {s.meta && <p className="f-mono mt-3 inline-block rounded-full border border-[#B5623A]/50 px-3 py-1 text-[13px] text-[#8A4524]">{s.meta}</p>}
          <p className="mt-4 text-[#16191D]">{s.p}</p>
        </Reveal>
        <Reveal className="md:col-span-6" delay={0.1}>
          <div className="rounded-[18px] border border-[#E3DCD1] bg-white p-5 shadow-[0_1px_0_rgba(22,25,29,0.04),0_24px_44px_-28px_rgba(22,25,29,0.28)] md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E3DCD1] pb-3">
              <span className="f-mono text-[11px] uppercase text-[#6B665F]">
                {n}/{total} · {s.name}
              </span>
              <span className="f-mono text-[11px] uppercase text-[#8A4524]">{t.result}</span>
            </div>
            <p className="f-display text-[22px] leading-[1.25] md:text-[26px]">{s.result}</p>
          </div>
        </Reveal>
      </div>
    </li>
  );
}

/** Process line: a copper line draws itself with scroll progress through the four steps. */
export function ProcessLine({ steps, locale }: { steps: Step[]; locale: L3 }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const [h, setH] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 55%"] });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <ol ref={ref} className="relative">
      {h > 0 && (
        <svg className="pointer-events-none absolute left-0 top-0" width="24" height={h} viewBox={`0 0 24 ${h}`} aria-hidden="true">
          <path d={`M12 16V${h}`} stroke="#E3DCD1" strokeWidth="1" fill="none" />
          <motion.path d={`M12 16V${h}`} stroke="#B5623A" strokeWidth="1.5" fill="none" style={{ pathLength: reduce ? 1 : scrollYProgress }} />
        </svg>
      )}
      {steps.map((s, i) => (
        <StepRow key={s.name} s={s} n={i + 1} total={steps.length} last={i === steps.length - 1} locale={locale} />
      ))}
    </ol>
  );
}
