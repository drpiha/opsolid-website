// =============================================================================
// AboutBlock — shared bio paragraph rendered at wrapper level, directly under
// the template card.
//
// Guarantees the owner's bio is visible on the 22 templates that do not
// render `cardData.bio` natively (suppressed via BIO_NATIVE_KEYS in
// registry.ts — derived from scripts/audit-template-coverage.ts).
//
// Returns null when bio is absent or whitespace.
// =============================================================================

import type { ReactElement } from "react";
import { linkify } from "@/lib/linkify";

interface Props {
  bio?: string | null;
  /** Brand-accent hex — used for the section heading hairline. */
  accentHex?: string | null;
  /** Localised heading, e.g. "Profil" / "Profil" / "About". */
  heading?: string;
}

export function AboutBlock({
  bio,
  accentHex,
  heading = "About",
}: Props): ReactElement | null {
  if (!bio || !bio.trim()) return null;

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
      <p className="rounded-xl border border-line bg-bg-2 px-4 py-3.5 text-sm leading-relaxed text-ink whitespace-pre-line">
        {linkify(bio)}
      </p>
    </section>
  );
}
