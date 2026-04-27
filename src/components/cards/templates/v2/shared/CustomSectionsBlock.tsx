"use client";

// =============================================================================
// Phase 7.9 — Custom sections renderer.
// Phase 8  — multi-image: 1 photo = full-bleed spotlight, 2-3 = 2-col grid,
//            4-6 = 3-col grid. Tap any photo to open the lightbox.
//
// Drops in at the bottom of every v2 template. Reads cardData.customSections
// and renders each as a titled paragraph block. Looks intentionally "neutral"
// (uses the parent template's CSS variables for fonts + the brand accent for
// the title rule) so it inherits the surrounding template's identity rather
// than fighting it.
//
// Returns null when no sections exist, so legacy cards render unchanged.
// =============================================================================

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  type CustomSection,
  type SectionMedia,
  readSectionMedia,
} from "@/lib/validation";

// Mirror the resolveAssetUrl logic the templates use, kept inline so this
// shared component stays decoupled from any one template file.
function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

interface Props {
  sections: CustomSection[] | undefined;
  /** Brand accent — used for the hairline above each title and the eyebrow tone. */
  accentHex?: string;
  /** When true, render with a dark-surface palette (white-ish text on transparent). */
  tone?: "light" | "dark";
  /** Optional override for the wrapping container className. */
  className?: string;
}

export function CustomSectionsBlock({
  sections,
  accentHex,
  tone = "light",
  className = "",
}: Props) {
  // Lightbox state — tracks the (sectionIndex, mediaIndex) of the open image.
  const [openIdx, setOpenIdx] = React.useState<{ s: number; m: number } | null>(
    null
  );

  if (!sections || sections.length === 0) return null;

  const isDark = tone === "dark";
  const accent = accentHex ?? "#C27940";

  // Pre-resolve media per section so the render path stays linear.
  const resolved = sections.map((section) =>
    readSectionMedia(section)
      .map((m) => ({ ...m, url: resolveAssetUrl(m.src) }))
      .filter((m): m is SectionMedia & { url: string } => Boolean(m.url))
  );

  const open = openIdx ? resolved[openIdx.s]?.[openIdx.m] : null;

  return (
    <section
      className={[
        "px-7 py-7 space-y-6",
        isDark
          ? "border-t border-white/10"
          : "border-t border-black/[0.08] bg-black/[0.015]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {sections.map((section, sIdx) => {
        const media = resolved[sIdx];
        return (
          <article key={section.id} className="space-y-2.5">
            <header className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-px w-6"
                style={{ background: accent }}
              />
              <h3
                className={[
                  "text-[11px] font-semibold uppercase tracking-[0.18em]",
                  isDark ? "text-white/85" : "text-black/80",
                ].join(" ")}
                style={{
                  fontFamily:
                    "var(--tpl-font-display, var(--card-display-font, inherit))",
                }}
              >
                {section.title}
              </h3>
            </header>

            {media.length > 0 ? (
              <SectionMediaGrid
                media={media}
                onOpen={(m) => setOpenIdx({ s: sIdx, m })}
                isDark={isDark}
              />
            ) : null}

            <p
              className={[
                "whitespace-pre-line text-[13px] leading-[1.6]",
                isDark ? "text-white/70" : "text-black/65",
              ].join(" ")}
              style={{
                fontFamily:
                  "var(--tpl-font-body, var(--card-body-font, inherit))",
              }}
            >
              {section.body}
            </p>
          </article>
        );
      })}

      <Dialog.Root
        open={openIdx !== null}
        onOpenChange={(o) => !o && setOpenIdx(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
          <Dialog.Content
            aria-label="Image preview"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
          >
            {/* Hidden but accessible title — Radix requires it for screen readers. */}
            <Dialog.Title className="sr-only">Image preview</Dialog.Title>
            {open ? (
              <button
                type="button"
                onClick={() => setOpenIdx(null)}
                className="relative max-h-[90vh] max-w-[95vw]"
                aria-label="Close"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={open.url}
                  alt={open.alt ?? ""}
                  className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
                />
              </button>
            ) : null}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SectionMediaGrid — adaptive layout per photo count:
//   1     full-bleed spotlight
//   2-3   2-col side-by-side
//   4-6   3-col grid (1 row of 3, second row 1-3)
// -----------------------------------------------------------------------------
function SectionMediaGrid({
  media,
  onOpen,
  isDark,
}: {
  media: Array<SectionMedia & { url: string }>;
  onOpen: (mediaIdx: number) => void;
  isDark: boolean;
}) {
  const ringClass = isDark
    ? "ring-1 ring-white/10 hover:ring-white/30"
    : "ring-1 ring-black/5 hover:ring-black/15";

  if (media.length === 1) {
    const m = media[0];
    return (
      <button
        type="button"
        onClick={() => onOpen(0)}
        className={`block w-full overflow-hidden rounded-xl ${ringClass} transition`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.url}
          alt={m.alt ?? ""}
          loading="lazy"
          className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
        />
      </button>
    );
  }

  if (media.length <= 3) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {media.map((m, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpen(i)}
            className={`overflow-hidden rounded-lg ${ringClass} transition`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.url}
              alt={m.alt ?? ""}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>
    );
  }

  // 4-6 → 3-col grid
  return (
    <div className="grid grid-cols-3 gap-1">
      {media.map((m, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(i)}
          className={`overflow-hidden rounded-md ${ringClass} transition`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.url}
            alt={m.alt ?? ""}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
