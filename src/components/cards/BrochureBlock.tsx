// =============================================================================
// BrochureBlock — shared download row rendered at wrapper level.
//
// Guarantees an uploaded brochure/portfolio URL is reachable on every template
// that does not render it natively (suppressed via BROCHURE_NATIVE_KEYS in
// registry.ts — derived from scripts/audit-template-coverage.ts). Before this
// block, 81 of 96 templates silently dropped `brochureUrl`.
//
// Returns null when brochureUrl is absent.
// =============================================================================

import type { ReactElement } from "react";

interface Props {
  brochureUrl?: string | null;
  /** Brand-accent hex — used for the icon tint. */
  accentHex?: string | null;
  /** Localised label, e.g. "Broschüre" / "Broşür" / "Brochure". */
  label?: string;
}

export function BrochureBlock({
  brochureUrl,
  accentHex,
  label = "Brochure",
}: Props): ReactElement | null {
  if (!brochureUrl) return null;

  return (
    <section className="mt-6">
      <a
        href={brochureUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-2 px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:border-line-firm"
      >
        <span className="flex items-center gap-2.5">
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentHex ?? "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          {label}
        </span>
        <span aria-hidden className="text-ink-400">
          ↗
        </span>
      </a>
    </section>
  );
}
