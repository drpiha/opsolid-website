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
  de: ["Anfrage", "Prüfung", "Entwurf", "Freigabe"],
  en: ["Request", "Review", "Draft", "Approval"],
  tr: ["Talep", "İnceleme", "Taslak", "Onay"],
};
const XS = [40, 146, 254, 360];

/** Nested rounded squares (the mark) over a hairline workflow with four stage labels (per page via `labels`). Draws itself once on
 * load: a CSS draw (.wk-draw.is-fade in opsolid-v7-motion.css), so it needs no JS and no framer-motion. Reduced motion
 * shows the end state. */
export function Squares({ alt, locale, labels: custom }: { alt: string; locale: L3; labels?: readonly string[] }) {
  const draw = (i: number) => ({
    pathLength: 1,
    className: "wk-draw is-fade",
    style: { stroke: LINE, ["--dur" as string]: "1.4s", ["--delay" as string]: `${(0.25 + i * 0.18).toFixed(2)}s` } as CSSProperties,
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
        <rect
          key={i}
          x={40 + s.inset}
          y={10 + s.inset}
          width={320 - s.inset * 2}
          height={320 - s.inset * 2}
          rx={s.rx}
          fill="none"
          strokeWidth={1}
          strokeOpacity={s.o}
          {...draw(i)}
        />
      ))}
      <path d="M52 392H348" strokeWidth="1" fill="none" {...draw(4)} />
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
