/**
 * Stage-label layout for the SVG figures. Labels are mono (advance about 0.6 em plus the letter spacing),
 * so the width is estimated, the font size is reduced for long German/Turkish words, and the anchor is
 * clamped so a label never leaves the viewBox.
 */
export type Placed = { text: string; x: number; fs: number };

export function placeLabels(labels: readonly string[], xs: readonly number[], viewW: number, maxFs = 12, minFs = 9.5, slot = 98): Placed[] {
  return labels.map((text, i) => {
    const em = text.length * 0.63;
    const fs = Math.max(minFs, Math.min(maxFs, slot / Math.max(em, 1)));
    const half = (em * fs) / 2;
    const x = Math.min(viewW - 2 - half, Math.max(2 + half, xs[i]));
    return { text, x, fs };
  });
}
