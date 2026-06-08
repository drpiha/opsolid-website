"use client";

// =============================================================================
// TestimonialsEditor — manages `cardData.testimonials`, up to 8 client quotes.
// Owners add/edit/remove rows of { author, role?, quote }.
// Mirrors ServicesEditor structure, styling and controlled-component pattern.
// =============================================================================

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CardTestimonial } from "@/lib/validation";

const MAX_TESTIMONIALS = 8;

interface Props {
  testimonials: CardTestimonial[] | undefined;
  onTestimonialsChange: (next: CardTestimonial[] | undefined) => void;
  L: (k: string, fallback: string) => string;
}

export function TestimonialsEditor({
  testimonials,
  onTestimonialsChange,
  L,
}: Props) {
  const items = testimonials ?? [];
  const atLimit = items.length >= MAX_TESTIMONIALS;

  const update = (next: CardTestimonial[]) => onTestimonialsChange(next);

  const setField = (
    idx: number,
    key: keyof CardTestimonial,
    value: string,
  ) => {
    const next = items.map((it, i) =>
      i === idx ? { ...it, [key]: value } : it,
    );
    update(next);
  };

  const addRow = () => {
    if (atLimit) return;
    update([...items, { author: "", quote: "" }]);
  };

  const removeRow = (idx: number) => {
    update(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-xs text-ink-300">
          {L(
            "testimonialsEmpty",
            "No testimonials yet. Add your first client quote.",
          )}
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
              placeholder={L("testimonialAuthor", "Name (e.g. Maria K.)")}
              value={item.author}
              maxLength={120}
              onChange={(e) => setField(idx, "author", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeRow(idx)}
              aria-label={L("testimonialRemove", "Remove")}
              className="mt-1 shrink-0 rounded-lg border border-line bg-white p-2 text-ink-300 transition-colors hover:border-signal-err hover:text-signal-err"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            className="field w-full"
            placeholder={L("testimonialRole", "Role / company (optional)")}
            value={item.role ?? ""}
            maxLength={160}
            onChange={(e) =>
              setField(idx, "role", e.target.value)
            }
          />
          <textarea
            className="field w-full resize-none"
            placeholder={L("testimonialQuote", "Quote")}
            value={item.quote}
            maxLength={600}
            rows={3}
            onChange={(e) => setField(idx, "quote", e.target.value)}
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
          {L("testimonialAdd", "Add testimonial")}
        </button>

        <span className="ml-auto mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {items.length} / {MAX_TESTIMONIALS}
        </span>
      </div>
    </div>
  );
}
