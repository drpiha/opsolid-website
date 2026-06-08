"use client";

// =============================================================================
// FaqEditor — manages `cardData.faqs`, the list of FAQ items rendered as an
// accordion on the public card. Owners add/edit/remove rows of { q, a }.
// Mirrors ServicesEditor structure, styling and controlled-component pattern.
// =============================================================================

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CardFaqItem } from "@/lib/validation";

const MAX_FAQS = 12;

interface Props {
  faqs: CardFaqItem[] | undefined;
  onFaqsChange: (next: CardFaqItem[] | undefined) => void;
  L: (k: string, fallback: string) => string;
}

export function FaqEditor({ faqs, onFaqsChange, L }: Props) {
  const items = faqs ?? [];
  const atLimit = items.length >= MAX_FAQS;

  const update = (next: CardFaqItem[]) => onFaqsChange(next);

  const setField = (
    idx: number,
    key: keyof CardFaqItem,
    value: string,
  ) => {
    const next = items.map((it, i) =>
      i === idx ? { ...it, [key]: value } : it,
    );
    update(next);
  };

  const addRow = () => {
    if (atLimit) return;
    update([...items, { q: "", a: "" }]);
  };

  const removeRow = (idx: number) => {
    update(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-xs text-ink-300">
          {L("faqEmpty", "No FAQ items yet. Add a question to get started.")}
        </p>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-line bg-bg-0 p-3 space-y-2"
        >
          <div className="flex items-start gap-2">
            <input
              type="text"
              className="field w-full"
              placeholder={L("faqQuestion", "Question")}
              value={item.q}
              maxLength={240}
              onChange={(e) => setField(idx, "q", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeRow(idx)}
              aria-label={L("faqRemove", "Remove")}
              className="mt-1 shrink-0 rounded-lg border border-line bg-white p-2 text-ink-300 transition-colors hover:border-signal-err hover:text-signal-err"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            className="field w-full resize-none"
            placeholder={L("faqAnswer", "Answer")}
            value={item.a}
            maxLength={1200}
            rows={3}
            onChange={(e) => setField(idx, "a", e.target.value)}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={addRow}
          disabled={atLimit}
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all",
            atLimit
              ? "cursor-not-allowed border border-line bg-bg-1 text-ink/35"
              : "border border-copper/40 bg-copper/10 text-ink hover:border-copper hover:bg-copper/20",
          ].join(" ")}
        >
          <Plus size={13} />
          {L("faqAdd", "Add question")}
        </button>

        <span className="ml-auto mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {items.length} / {MAX_FAQS}
        </span>
      </div>
    </div>
  );
}
