import type { CSSProperties } from "react";
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

/**
 * Small hairline flow: input, rules, draft, person. The line draws once when it enters the viewport: a CSS draw
 * (.wk-draw in opsolid-v7-motion.css; RevealObserver holds it until the figure scrolls in). Server component, no
 * framer-motion. Reduced motion and no JS show the drawn line.
 */
export function Flow({ alt, locale, labels: custom }: { alt: string; locale: L3; labels?: readonly string[] }) {
  const labels = placeLabels(custom ?? LABELS[locale], XS, 372, 11);
  return (
    <svg viewBox="0 0 372 84" className="wk-draw-view h-auto w-full" role="img" aria-label={alt}>
      <path d="M44 30H328" pathLength={1} strokeWidth="1" fill="none" className="wk-draw" style={{ stroke: LINE, ["--dur" as string]: "1.2s" } as CSSProperties} />
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
