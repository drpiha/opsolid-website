"use client";

// =============================================================================
// BrandPattern — SVG pattern generator used as a subtle background flourish on
// premium templates. Six built-in patterns (dots, lines, grid, organic,
// scribble, ticks) tinted with the card's brand color.
//
// Why SVG instead of images: infinitely scalable, single-color recolorable
// without a backend round-trip, and tiny (each pattern is ~200 bytes inlined).
// =============================================================================

import type { CSSProperties } from "react";

export type PatternKind =
  | "dots"
  | "lines"
  | "grid"
  | "organic"
  | "scribble"
  | "ticks";

interface Props {
  kind?: PatternKind;
  /** Hex color for the pattern strokes/fills. Brand primary by default. */
  color?: string;
  /** Pattern opacity — keep ≤ 0.18 to stay "ambient", not "noisy". */
  opacity?: number;
  /** Tile size in CSS pixels. Larger = more breathing room. */
  size?: number;
  className?: string;
}

function patternSvg(kind: PatternKind, color: string, size: number): string {
  switch (kind) {
    case "dots":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${size / 2}' cy='${size / 2}' r='1.4' fill='${color}'/></svg>`;
    case "lines":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><path d='M0 ${size} L${size} 0' stroke='${color}' stroke-width='0.7'/></svg>`;
    case "grid":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><path d='M${size} 0 L0 0 0 ${size}' fill='none' stroke='${color}' stroke-width='0.6'/></svg>`;
    case "organic":
      // Soft sine-like curve, repeats horizontally — feels "hand-drawn".
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${size * 2}' height='${size}'><path d='M0 ${size / 2} Q ${size / 2} 0 ${size} ${size / 2} T ${size * 2} ${size / 2}' fill='none' stroke='${color}' stroke-width='0.8'/></svg>`;
    case "scribble":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><path d='M2 4 Q 6 ${size - 4} ${size - 2} 6' fill='none' stroke='${color}' stroke-width='0.9' stroke-linecap='round'/></svg>`;
    case "ticks":
      // Tiny "+" marks on a grid — looks like a technical drawing.
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><g stroke='${color}' stroke-width='0.7'><line x1='${size / 2 - 2}' y1='${size / 2}' x2='${size / 2 + 2}' y2='${size / 2}'/><line x1='${size / 2}' y1='${size / 2 - 2}' x2='${size / 2}' y2='${size / 2 + 2}'/></g></svg>`;
  }
}

export function BrandPattern({
  kind = "dots",
  color = "#15120F",
  opacity = 0.08,
  size = 28,
  className = "",
}: Props) {
  const svg = patternSvg(kind, color, size);
  const dataUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  const style: CSSProperties = {
    backgroundImage: dataUri,
    backgroundRepeat: "repeat",
    opacity,
  };
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={style}
    />
  );
}
