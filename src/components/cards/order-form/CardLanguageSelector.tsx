"use client";

// =============================================================================
// Card language selector — the EXPLICIT choice of which language the public
// card renders in (section headings, buttons, vCard labels on /c/[slug]).
//
// Previously `CardOrder.locale` was silently taken from the page locale; a
// visitor building from /tr could unknowingly publish a German card (or vice
// versa). The stored locale still drives /c/[slug] (?lang= visitor override >
// order.locale > "de") — this control just makes the creator's choice visible.
// =============================================================================

import * as React from "react";

export type CardLocale = "de" | "en" | "tr";

const OPTIONS: { value: CardLocale; label: string }[] = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
];

interface Props {
  value: CardLocale;
  onChange: (next: CardLocale) => void;
  L: (k: string, fallback: string) => string;
  /** Compact mode for tight layouts (quick create). */
  compact?: boolean;
}

export function CardLanguageSelector({ value, onChange, L, compact = false }: Props) {
  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <label className="text-xs font-semibold text-ink">
        {L("cardLanguageLabel", "Card language")}
      </label>
      <div
        role="radiogroup"
        aria-label={L("cardLanguageLabel", "Card language")}
        className="inline-flex rounded-full border border-line bg-bg-0 p-0.5"
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors",
              value === opt.value
                ? "bg-ink text-white"
                : "text-ink-300 hover:text-ink",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {!compact && (
        <p className="text-[11px] text-ink-300">
          {L(
            "cardLanguageHint",
            "The language your card's visitors will see. You can change it later in the editor.",
          )}
        </p>
      )}
    </div>
  );
}
