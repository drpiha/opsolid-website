// =============================================================================
// GalleryBlock — universal photo gallery appended after the template (wrapper-
// level block, like VideoBlock). The gallery editor is offered to every owner,
// but only ~6 templates render cardData.gallery natively; the other 90 dropped
// the photos silently. This block shows them on ALL templates, self-hiding when
// empty and suppressed on the templates that render a gallery themselves.
//
// Server-safe (no "use client", no state) — a plain responsive grid.
// =============================================================================

import Image from "next/image";

interface GalleryItem {
  src: string;
  alt?: string;
}

interface GalleryBlockProps {
  gallery?: GalleryItem[] | null;
  tone?: "light" | "dark";
  heading?: string;
}

function resolveSrc(path: string): string {
  if (/^(https?:|blob:|data:)/.test(path) || path.startsWith("/")) return path;
  return `/${path}`;
}

export function GalleryBlock({ gallery, tone = "light", heading = "Galerie" }: GalleryBlockProps) {
  const items = (gallery ?? []).filter((g) => g?.src).slice(0, 24);
  if (items.length === 0) return null;
  const isDark = tone === "dark";

  return (
    <div className={["px-6 py-5", isDark ? "border-t border-white/10" : "border-t border-line"].join(" ")}>
      <h2
        className={[
          "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]",
          isDark ? "text-white/60" : "text-ink-400",
        ].join(" ")}
      >
        {heading}
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative aspect-square overflow-hidden rounded-xl border border-line bg-bg-1"
          >
            <Image
              src={resolveSrc(item.src)}
              alt={item.alt ?? ""}
              fill
              unoptimized
              sizes="(max-width: 480px) 30vw, 140px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
