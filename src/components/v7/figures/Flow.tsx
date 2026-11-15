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
  de: ["Eingang", "Regeln", "Entwurf", "Mensch"],
  en: ["Input", "Rules", "Draft", "Person"],
  tr: ["Giriş", "Kurallar", "Taslak", "Kişi"],
};
const XS = [36, 136, 236, 336];

/** Small hairline flow: input, rules, draft, person. Draws once when it enters the viewport. */
export function Flow({ alt, locale, labels: custom }: { alt: string; locale: L3; labels?: readonly string[] }) {
  const reduce = useReducedMotion();
  const labels = placeLabels(custom ?? LABELS[locale], XS, 372, 11);
  return (
    <svg viewBox="0 0 372 84" className="h-auto w-full" role="img" aria-label={alt}>
      <motion.path
        d="M44 30H328"
        strokeWidth="1"
        fill="none"
        style={{ stroke: LINE }}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {XS.map((x, i) => (
        <g key={x}>
          <rect x={x - 8} y={22} width={16} height={16} rx={5} strokeWidth="1.25" style={{ fill: i === 3 ? LAST : NODE, stroke: i === 3 ? LAST : RING }} />
          <text x={labels[i].x} y={64} textAnchor="middle" fontSize={labels[i].fs} style={{ fill: LABEL, fontFamily: "var(--wk-mono)" }}>
            {labels[i].text}
          </text>
        </g>
      ))}
    </svg>
  );
}
