// =============================================================================
// Phase 7.9 — Custom sections renderer.
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
import type { CustomSection } from "@/lib/validation";

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
  if (!sections || sections.length === 0) return null;

  const isDark = tone === "dark";
  const accent = accentHex ?? "#C27940";

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
      {sections.map((section) => (
        <article key={section.id} className="space-y-2">
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
      ))}
    </section>
  );
}
