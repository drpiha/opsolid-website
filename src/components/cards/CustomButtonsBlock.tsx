// =============================================================================
// CustomButtonsBlock — wrapper-level CTA buttons for ALL v2 templates.
//
// Renders cardData.customButtons[] uniformly, regardless of which template is
// active. Templates that already render their own custom buttons (Studio,
// MusicProducer) do so inside their own layout — this block appears AFTER the
// template body in page.tsx, so there is no double-render risk: those two
// templates consume customButtons as "tracks / mixes" labels, not as generic
// CTAs, and the block-level slot here covers every other template.
//
// Returns null when the array is absent, empty, or every entry has no label/href.
// =============================================================================

import type { ReactElement } from "react";
import type { CardData } from "@/lib/validation";

interface Props {
  buttons: CardData["customButtons"];
  /** Brand-primary hex — used as background for style="primary" buttons. */
  primaryHex?: string | null;
  /** Localised section heading label. */
  heading?: string;
  /** Accent hex — currently unused but kept for future heading underline. */
  accentHex?: string | null;
}

export function CustomButtonsBlock({
  buttons,
  primaryHex,
  heading,
}: Props): ReactElement | null {
  if (!buttons || buttons.length === 0) return null;

  const primary = primaryHex ?? "#C27940";

  return (
    <section className="mt-6">
      {heading ? (
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-ink-300">
          {heading}
        </h2>
      ) : null}
      <div
        className={`grid gap-2 ${buttons.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
      >
        {buttons.map((btn, i) => {
          const isPrimary = btn.style === "primary";
          const isGhost = btn.style === "ghost";

          return (
            <a
              key={`${btn.label}-${i}`}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex min-h-[48px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97]",
                isPrimary
                  ? "text-white shadow-sm"
                  : isGhost
                    ? "border-0 bg-transparent text-ink-200 hover:text-ink"
                    : "border border-line bg-bg-2 text-ink hover:border-line-firm hover:bg-bg-3",
              ]
                .join(" ")
                .trim()}
              style={isPrimary ? { background: primary } : undefined}
            >
              {btn.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
