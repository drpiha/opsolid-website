"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { L3 } from "@/lib/v7-routes";

const COPPER = "#B5623A";
const LABELS: Record<L3, string[]> = {
  de: ["Anfrage", "Prüfung", "Entwurf", "Freigabe"],
  en: ["Request", "Review", "Draft", "Approval"],
  tr: ["Talep", "İnceleme", "Taslak", "Onay"],
};
const XS = [40, 146, 254, 360];

/** Nested rounded squares (the mark) over a hairline workflow. Draws itself once; reduced motion shows the end state. */
export function Squares({ alt, locale }: { alt: string; locale: L3 }) {
  const reduce = useReducedMotion();
  const draw = (i: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: reduce ? { duration: 0 } : { duration: 1.4, delay: 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
  });
  const squares = [
    { inset: 0, rx: 84, o: 1 },
    { inset: 30, rx: 62, o: 0.8 },
    { inset: 60, rx: 42, o: 0.6 },
    { inset: 90, rx: 24, o: 0.42 },
  ];
  const labels = LABELS[locale];
  return (
    <svg viewBox="0 0 400 440" className="h-auto w-full" role="img" aria-label={alt}>
      {squares.map((s, i) => (
        <motion.rect
          key={i}
          x={40 + s.inset}
          y={10 + s.inset}
          width={320 - s.inset * 2}
          height={320 - s.inset * 2}
          rx={s.rx}
          fill="none"
          stroke={COPPER}
          strokeWidth={1}
          strokeOpacity={s.o}
          {...draw(i)}
        />
      ))}
      <motion.path d="M52 392H348" stroke={COPPER} strokeWidth="1" fill="none" {...draw(4)} />
      {XS.map((x, i) => (
        <g key={x}>
          <rect x={x - 8} y={384} width={16} height={16} rx={5} fill={i === 3 ? COPPER : "#F6F2EC"} stroke={COPPER} strokeWidth="1" />
          <text x={x} y={426} textAnchor="middle" fill="#6B665F" fontSize="11" style={{ fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.02em" }}>
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
