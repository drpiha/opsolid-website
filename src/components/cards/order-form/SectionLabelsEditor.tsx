"use client";

// =============================================================================
// SectionLabelsEditor — rename the section TITLES the visitor sees on the card.
//
// Shared by the order form and the live card editor. The editable list is
// derived from the selected template's exported COPY table (labelsRegistry)
// plus the universal wrapper-block headings, so it always matches what the
// card renders. Each row shows the section's CURRENT title (so the owner
// recognises it) with an input to rename it; clearing the input restores the
// template default. Persisted into cardData.labels (see resolveLabels.ts).
//
// This editor only renames headings — it does NOT add content. The content
// itself (services, FAQ, gallery, testimonials, …) is entered in the sections
// above; a section with no content (and its title) never appears on the card.
//
// Action / footer / contact-button micro-labels ("Call", "WhatsApp", "Save",
// "Powered by", "Imprint", year markers, …) are NOT section titles, so they
// are hidden here to keep the list focused and uncluttered.
// =============================================================================

import { useMemo } from "react";
import { getEditableLabels } from "@/components/cards/templates/v2/labelsRegistry";
import {
  UNIVERSAL_HEADINGS,
  UNIVERSAL_LABEL_KEYS,
  type BlockLocale,
} from "@/components/cards/templates/v2/shared/universalHeadings";

/** COPY keys that are buttons / footer / contact actions — not section
 *  titles. Hidden from the heading editor so it stays focused. */
const HIDDEN_LABEL_KEYS = new Set<string>([
  // contact + booking buttons
  "saveContact", "save", "callNow", "call", "whatsapp", "whatsappLabel",
  "email", "book", "bookingCta", "bookingHint", "reservationCta",
  "findUsLabel", "detailLabel", "portfolioCta", "cta", "reel", "sendMyInfo",
  "share", "shareLabel", "walletLabel", "hours",
  // footer / legal / brand
  "poweredBy", "impressum", "privacy", "copyright", "copyrightNote",
  "est", "estYear",
]);

interface SectionLabelsEditorProps {
  /** Registry key of the selected template (e.g. "barber"). */
  templateKey: string | null | undefined;
  /** Card display language — drives which defaults are shown. */
  locale: BlockLocale;
  /** Current overrides (cardData.labels). */
  labels: Record<string, string> | undefined;
  /** Persist the next overrides map (undefined when empty). */
  onChange: (next: Record<string, string> | undefined) => void;
}

export function SectionLabelsEditor({
  templateKey,
  locale,
  labels,
  onChange,
}: SectionLabelsEditorProps) {
  const fields = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ key: string; default: string }> = [];
    // Template's own section headings first…
    for (const f of getEditableLabels(templateKey, locale)) {
      if (seen.has(f.key) || HIDDEN_LABEL_KEYS.has(f.key)) continue;
      if (!f.default || !f.default.trim()) continue; // skip empty defaults
      seen.add(f.key);
      out.push(f);
    }
    // …then the universal wrapper-block headings (gallery/faq/contact/…).
    const headings = UNIVERSAL_HEADINGS[locale] ?? UNIVERSAL_HEADINGS.en;
    for (const k of UNIVERSAL_LABEL_KEYS) {
      if (seen.has(k) || HIDDEN_LABEL_KEYS.has(k)) continue;
      seen.add(k);
      out.push({ key: k, default: headings[k] });
    }
    return out;
  }, [templateKey, locale]);

  if (fields.length === 0) return null;

  const update = (key: string, value: string) => {
    const next: Record<string, string> = { ...(labels ?? {}) };
    if (value.trim()) next[key] = value;
    else delete next[key];
    onChange(Object.keys(next).length > 0 ? next : undefined);
  };

  return (
    <div className="grid gap-x-3 gap-y-2.5 sm:grid-cols-2">
      {fields.map(({ key, default: def }) => {
        const overridden = !!labels?.[key]?.trim();
        return (
          <label key={key} className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] text-ink-300">
              <span className="truncate">{def}</span>
              {overridden && (
                <span className="shrink-0 rounded-full bg-copper/15 px-1.5 text-[9px] font-semibold uppercase tracking-wide text-copper">
                  •
                </span>
              )}
            </span>
            <input
              type="text"
              value={labels?.[key] ?? ""}
              placeholder={def}
              maxLength={80}
              onChange={(e) => update(key, e.target.value)}
              className="field w-full text-sm"
            />
          </label>
        );
      })}
    </div>
  );
}
