"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { L3 } from "@/lib/v7-routes";
import { placeLabels } from "./fit";

// C strokes: copper-deep lines, sheet nodes with an ink ring, the last node filled in copper; labels in Plex Mono.
const LINE = "var(--wk-copper-deep)";
const NODE = "var(--wk-sheet)";
const RING = "var(--wk-ink)";
const LAST = "var(--wk-copper)";
const LABEL = "var(--wk-muted)";
const LABELS: Record<L3, readonly string[]> = {
  de: ["Anfrage", "Prüfung", "Entwurf", "Freigabe"],
  en: ["Request", "Review", "Draft", "Approval"],
  tr: ["Talep", "İnceleme", "Taslak", "Onay"],
};
const XS = [40, 146, 254, 360];

/** Nested rounded squares (the mark) over a hairline workflow with four stage labels (per page via `labels`). Draws itself once; reduced motion shows the end state. */
export function Squares({ alt, locale, labels: custom }: { alt: string; locale: L3; labels?: readonly string[] }) {
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
  const labels = placeLabels(custom ?? LABELS[locale], XS, 400);
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
          strokeWidth={1}
          strokeOpacity={s.o}
          style={{ stroke: LINE }}
          {...draw(i)}
        />
      ))}
      <motion.path d="M52 392H348" strokeWidth="1" fill="none" style={{ stroke: LINE }} {...draw(4)} />
      {XS.map((x, i) => (
        <g key={x}>
          <rect x={x - 8} y={384} width={16} height={16} rx={5} strokeWidth="1.25" style={{ fill: i === 3 ? LAST : NODE, stroke: i === 3 ? LAST : RING }} />
          <text x={labels[i].x} y={426} textAnchor="middle" fontSize={labels[i].fs} style={{ fill: LABEL, fontFamily: "var(--wk-mono)" }}>
            {labels[i].text}
          </text>
        </g>
      ))}
    </svg>
  );
}
