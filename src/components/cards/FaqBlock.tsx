// =============================================================================
// FaqBlock — shared accordion rendered at wrapper level for ALL v2 templates.
//
// Modelled after the inline SmartCardFaq in SmartCard.tsx (which renders for
// the legacy fallback template only). This block ensures every v2 template
// shows the owner's FAQ items without each template needing its own
// implementation.
//
// Returns null when faqs is absent or empty.
// =============================================================================

import type { ReactElement } from "react";
import { linkify } from "@/lib/linkify";
import type { CardData } from "@/lib/validation";

interface Props {
  faqs: CardData["faqs"];
  /** Brand-accent hex — used for the section heading hairline. */
  accentHex?: string | null;
  /** Localised heading, e.g. "FAQ" / "Häufige Fragen" / "Sık Sorulan". */
  heading?: string;
}

export function FaqBlock({ faqs, accentHex, heading = "FAQ" }: Props): ReactElement | null {
  if (!faqs || faqs.length === 0) return null;

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
        {faqs.map((f, i) => (
          <li
            key={`faq-${i}-${f.q.slice(0, 12)}`}
            className="rounded-xl border border-line bg-bg-2"
          >
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-ink">
                <span>{f.q}</span>
                <span
                  aria-hidden
                  className="shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <div className="border-t border-line px-4 py-3 text-xs leading-relaxed text-ink-300 whitespace-pre-line">
                {linkify(f.a)}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
