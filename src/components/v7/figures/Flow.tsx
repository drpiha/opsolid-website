"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { L3 } from "@/lib/v7-routes";
import { placeLabels } from "./fit";

const COPPER = "#B5623A";
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
        stroke={COPPER}
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {XS.map((x, i) => (
        <g key={x}>
          <rect x={x - 8} y={22} width={16} height={16} rx={5} fill={i === 3 ? COPPER : "#F6F2EC"} stroke={COPPER} strokeWidth="1" />
          <text x={labels[i].x} y={64} textAnchor="middle" fill="#6B665F" fontSize={labels[i].fs} style={{ fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.02em" }}>
            {labels[i].text}
          </text>
        </g>
      ))}
    </svg>
  );
}
