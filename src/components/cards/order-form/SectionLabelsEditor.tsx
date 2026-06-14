"use client";

// =============================================================================
// SectionLabelsEditor — owner-editable section labels for the selected
// template. Shared by the order form and the live card editor.
//
// Editable keys are DERIVED from the template's exported COPY table
// (labelsRegistry) plus the universal wrapper-block headings, so the list
// always matches what the card renders. Each input is pre-filled with the
// owner's override (if any); the placeholder shows the localized default.
// Clearing an input deletes the override → the template default returns.
//
// Persisted into cardData.labels (see resolveLabels.ts on the render side).
// =============================================================================

import { useMemo } from "react";
import { getEditableLabels } from "@/components/cards/templates/v2/labelsRegistry";
import {
  UNIVERSAL_HEADINGS,
  UNIVERSAL_LABEL_KEYS,
  type BlockLocale,
} from "@/components/cards/templates/v2/shared/universalHeadings";

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

/** "aboutSub" → "About sub", "bookingCta" → "Booking cta". */
function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
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
    // Template's own COPY keys first…
    for (const f of getEditableLabels(templateKey, locale)) {
      if (seen.has(f.key)) continue;
      seen.add(f.key);
      out.push(f);
    }
    // …then the universal wrapper-block headings (gallery/faq/contact/…).
    const headings = UNIVERSAL_HEADINGS[locale] ?? UNIVERSAL_HEADINGS.en;
    for (const k of UNIVERSAL_LABEL_KEYS) {
      if (seen.has(k)) continue;
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
    <div className="grid gap-2 sm:grid-cols-2">
      {fields.map(({ key, default: def }) => (
        <label key={key} className="block">
          <span className="mb-1 block text-[11px] text-ink-300">
            {humanize(key)}
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
      ))}
    </div>
  );
}
