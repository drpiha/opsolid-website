// =============================================================================
// StatsBlock — shared proof-stats section rendered at wrapper level.
//
// Guarantees the owner's stats are visible on every template that does not
// render them natively (suppressed via STATS_NATIVE_KEYS in registry.ts —
// audit-derived, same model as TestimonialsBlock).
//
// Returns null when stats are absent or empty — a card never shows numbers
// the owner didn't enter.
// =============================================================================

import type { ReactElement } from "react";
import type { CardData } from "@/lib/validation";
import { resolveStats } from "@/components/cards/templates/v2/shared/profileExtras";

interface Props {
  stats: CardData["stats"];
  tone: "dark" | "light";
  /** Brand-accent hex — colors the stat values. */
  accentHex?: string | null;
}

export function StatsBlock({ stats, tone, accentHex }: Props): ReactElement | null {
  const items = resolveStats(stats);
  if (!items) return null;

  const dark = tone === "dark";

  return (
    <section className="mt-6">
      <ul
        className={`grid gap-2 ${items.length >= 3 ? "grid-cols-3" : "grid-cols-2"} ${
          items.length === 4 ? "sm:grid-cols-4" : ""
        }`}
      >
        {items.map((s, i) => (
          <li
            key={`stat-${i}-${s.label.slice(0, 12)}`}
            className={`rounded-xl border px-3 py-3 text-center ${
              dark ? "border-white/10 bg-white/5" : "border-line bg-bg-2"
            }`}
          >
            <p
              className={`text-lg font-semibold tracking-tight ${
                dark ? "text-white" : "text-ink"
              }`}
              style={accentHex ? { color: accentHex } : undefined}
            >
              {s.value}
            </p>
            <p
              className={`mt-0.5 text-[11px] uppercase tracking-[0.5px] ${
                dark ? "text-white/55" : "text-ink-300"
              }`}
            >
              {s.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
