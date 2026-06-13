"use client";

// =============================================================================
// Stats editor — manages `cardData.stats`, the proof-point numbers templates
// render as stat strips ("12 — Jahre Erfahrung", "180+ — Abschlüsse").
//
// 2026-06 hardcoded-data purge: templates used to ship FABRICATED stats
// ("7+ Jahre / 60+ Projekte") that owners could not edit or remove. Stats are
// now fully owner-controlled here; an empty list means templates render no
// stat block at all (resolveStats returns null).
// =============================================================================

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CardStat } from "@/lib/validation";

const MAX_STATS = 4;

interface Props {
  stats: CardStat[] | undefined;
  onStatsChange: (next: CardStat[] | undefined) => void;
  L: (k: string, fallback: string) => string;
}

export function StatsEditor({ stats, onStatsChange, L }: Props) {
  const items = stats ?? [];
  const atLimit = items.length >= MAX_STATS;

  const setField = (idx: number, key: keyof CardStat, value: string) => {
    onStatsChange(items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  };

  const addRow = () => {
    if (atLimit) return;
    onStatsChange([...items, { value: "", label: "" }]);
  };

  const removeRow = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    onStatsChange(next.length > 0 ? next : []);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-xs text-ink-300">
          {L(
            "statsEmpty",
            "No stats yet. Add real numbers you're proud of (e.g. 12 — Years of experience). Cards without stats simply don't show this section.",
          )}
        </p>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-2 rounded-xl border border-line bg-bg-0 p-3"
        >
          <input
            type="text"
            className="field w-28 shrink-0"
            placeholder={L("statsValue", "12+")}
            value={item.value}
            maxLength={16}
            onChange={(e) => setField(idx, "value", e.target.value)}
          />
          <input
            type="text"
            className="field w-full"
            placeholder={L("statsLabel", "Years of experience")}
            value={item.label}
            maxLength={48}
            onChange={(e) => setField(idx, "label", e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeRow(idx)}
            aria-label={L("statsRemove", "Remove")}
            className="mt-1 shrink-0 rounded-lg border border-line bg-white p-2 text-ink-300 transition-colors hover:border-signal-err hover:text-signal-err"
          >
            <Trash2 size={14} />
          </button>
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
          {L("statsAdd", "Add stat")}
        </button>
        <span className="ml-auto mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {items.length} / {MAX_STATS}
        </span>
      </div>
    </div>
  );
}
