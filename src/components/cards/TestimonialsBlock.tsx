// =============================================================================
// TestimonialsBlock — shared quotes section rendered at wrapper level.
//
// Guarantees the owner's testimonials are visible on every template that does
// not render them natively (suppressed via TESTIMONIALS_NATIVE_KEYS in
// registry.ts — derived from scripts/audit-template-coverage.ts, NOT
// hand-curated; the previous hand-curated attempt missed native renderers and
// double-rendered, which is why it was reverted in 2026-06).
//
// Note: 9 templates read testimonials only for a review-count chip
// (e.g. restaurant-pure) — those are NOT in the Set, so this block shows the
// actual quotes below the card. Count chip + quotes coexist by design.
//
// Returns null when testimonials is absent or empty.
// =============================================================================

import type { ReactElement } from "react";
import type { CardData } from "@/lib/validation";

interface Props {
  testimonials: CardData["testimonials"];
  /** Brand-accent hex — used for the section heading hairline. */
  accentHex?: string | null;
  /** Localised heading, e.g. "Stimmen" / "Yorumlar" / "Testimonials". */
  heading?: string;
}

export function TestimonialsBlock({
  testimonials,
  accentHex,
  heading = "Testimonials",
}: Props): ReactElement | null {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="mt-6">
      <h2
        className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-ink-300"
        style={
          accentHex
            ? { borderBottom: `1px solid ${accentHex}40`, paddingBottom: 6 }
            : undefined
        }
      >
        {heading}
      </h2>
      <ul className="grid gap-2">
        {testimonials.map((t, i) => (
          <li
            key={`tstm-${i}-${t.author.slice(0, 12)}`}
            className="rounded-xl border border-line bg-bg-2 px-4 py-3.5"
          >
            <blockquote className="text-sm leading-relaxed text-ink">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <p className="mt-2 text-xs text-ink-300">
              — {t.author}
              {t.role ? <span className="text-ink-400"> · {t.role}</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
