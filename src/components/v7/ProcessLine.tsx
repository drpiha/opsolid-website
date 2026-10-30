"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
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
          <div className="rounded-[5px] border border-l-[3px] border-[#E3DCD1] border-l-[#8A4524] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E3DCD1] pb-3">
              <span className="f-mono text-[12px] uppercase text-[#6B665F]">
                {n}/{total} · {s.name}
              </span>
              <span className="f-mono text-[12px] uppercase text-[#8A4524]">{t.result}</span>
            </div>
            <p className="f-display text-[22px] leading-[1.25] md:text-[26px]">{s.result}</p>
          </div>
        </Reveal>
      </div>
    </li>
  );
}

const MARK = 46;
const DEEP = "#8A4524";
/** Squares of the mark, outermost first; they fill copper-deep from the innermost outwards, one per step passed. */
const RINGS = [0, 1, 2, 3].map((k) => ({ inset: k * (MARK / 8), rx: MARK * 0.31 - k * (MARK * 0.067) }));

/** The nested-squares mark (the brand's own sign) at the head of the line: one more square fills with each step passed. */
function ProgressMark({ filled, pop }: { filled: number; pop: boolean }) {
  // Each newly filled step remounts the mark with a 200 ms scale pop (1.14 to 1); the filled state is kept.
  return (
    <motion.div key={filled} initial={pop && filled > 0 ? { scale: 1.14 } : false} animate={{ scale: 1 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
    <svg width={MARK} height={MARK} viewBox={`0 0 ${MARK} ${MARK}`} aria-hidden="true" className="block overflow-visible">
      <rect x={0.5} y={0.5} width={MARK - 1} height={MARK - 1} rx={MARK * 0.32} fill="#F6F2EC" />
      {RINGS.map((r, k) => {
        const on = filled >= RINGS.length - k;
        return (
          <rect
            key={k}
            x={r.inset + 0.5}
            y={r.inset + 0.5}
            width={MARK - r.inset * 2 - 1}
            height={MARK - r.inset * 2 - 1}
            rx={r.rx}
            stroke={DEEP}
            strokeWidth="1.25"
            fill={DEEP}
            fillOpacity={on ? 0.26 : 0}
          />
        );
      })}
    </svg>
    </motion.div>
  );
}

/**
 * Process line: a copper line draws itself with scroll progress through the four steps; its head carries the
 * nested-squares mark, which fills one square per step passed. Scroll-linked only (no pinning, no scroll
 * hijack); under reduced motion the line is complete and the mark sits at the last step, fully filled.
 */
export function ProcessLine({ steps, locale }: { steps: Step[]; locale: L3 }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const [h, setH] = useState(0);
  const [rm, setRm] = useState(false);
  const [filled, setFilled] = useState(0);
  const geo = useRef({ h: 0, nodes: [] as number[] });
  const headY = useMotionValue(16);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 55%"] });

  useEffect(() => setRm(!!reduce), [reduce]);

  const sync = useCallback(
    (p: number) => {
      const { h: height, nodes } = geo.current;
      if (!height || !nodes.length) return;
      const y = rm ? nodes[nodes.length - 1] : 16 + Math.min(1, Math.max(0, p)) * (height - 16);
      headY.set(y);
      const n = rm ? nodes.length : nodes.filter((ny) => ny <= y + 1).length;
      setFilled((prev) => (prev === n ? prev : n));
    },
    [headY, rm],
  );

  useMotionValueEvent(scrollYProgress, "change", sync);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      geo.current = {
        h: el.offsetHeight,
        nodes: Array.from(el.children).map((c) => (c as HTMLElement).offsetTop + 18),
      };
      setH(el.offsetHeight);
      sync(scrollYProgress.get());
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [scrollYProgress, sync]);

  return (
    <ol ref={ref} className="relative">
      {h > 0 && (
        <svg className="pointer-events-none absolute left-0 top-0" width="24" height={h} viewBox={`0 0 24 ${h}`} aria-hidden="true">
          <path d={`M12 16V${h}`} stroke="#E3DCD1" strokeWidth="1" fill="none" />
          <motion.path d={`M12 16V${h}`} stroke={DEEP} strokeWidth="1.75" fill="none" style={{ pathLength: rm ? 1 : scrollYProgress }} />
        </svg>
      )}
      {h > 0 && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-10"
          style={{ left: 12 - MARK / 2, top: -MARK / 2, y: headY }}
        >
          <ProgressMark filled={filled} pop={!rm} />
        </motion.div>
      )}
      {steps.map((s, i) => (
        <StepRow key={s.name} s={s} n={i + 1} total={steps.length} last={i === steps.length - 1} locale={locale} />
      ))}
    </ol>
  );
}
