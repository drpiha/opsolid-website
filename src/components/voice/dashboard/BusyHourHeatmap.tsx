"use client";

/**
 * BusyHourHeatmap — 7×24 grid showing call volume by weekday × hour. Cells
 * are bucketed into four intensity tiers tied to copper shades, plus a base
 * neutral for empty cells. Hover renders a small tooltip via title attribute
 * and a custom popover.
 */

import { useMemo, useState } from "react";
import { WEEKDAYS_DE_SHORT } from "./format";
import { cn } from "@/lib/utils";

export interface BusyCell {
  /** 0=Sun..6=Sat (JS Date.getDay() convention). */
  weekday: number;
  /** 0..23 */
  hour: number;
  count: number;
}

interface BusyHourHeatmapProps {
  busyHours: BusyCell[];
}

// Display order: Mon..Sun (consistent with BusinessHoursGrid).
const DISPLAY_DOWS: number[] = [1, 2, 3, 4, 5, 6, 0];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const X_AXIS_LABELS = [0, 3, 6, 9, 12, 15, 18, 21];

const WEEKDAY_LONG = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

function tier(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  return 4;
}

const TIER_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-bg-2",
  1: "bg-copper-900/60",
  2: "bg-copper-800",
  3: "bg-copper-600",
  4: "bg-copper-500 shadow-bloom-sm",
};

export default function BusyHourHeatmap({ busyHours }: BusyHourHeatmapProps) {
  // Build a quick lookup map: "weekday-hour" -> count.
  const map = useMemo(() => {
    const m = new Map<string, number>();
    for (const cell of busyHours) {
      m.set(`${cell.weekday}-${cell.hour}`, cell.count);
    }
    return m;
  }, [busyHours]);

  const max = useMemo(
    () => busyHours.reduce((a, b) => Math.max(a, b.count), 0),
    [busyHours],
  );

  const [hover, setHover] = useState<{
    weekday: number;
    hour: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <section className="panel relative overflow-hidden p-0">
      <header className="flex items-end justify-between border-b border-line px-5 py-3">
        <div>
          <h3 className="font-display text-[14px] font-medium text-ink">
            Belegung nach Wochentag · Stunde
          </h3>
          <p className="mt-0.5 text-[12px] text-ink-400">
            Anrufaufkommen über die letzten 30 Tage
          </p>
        </div>
        <Legend max={max} />
      </header>

      <div className="px-5 py-4">
        <div className="grid grid-cols-[28px_1fr] gap-x-2">
          {/* y-axis labels + grid */}
          {DISPLAY_DOWS.map((dow) => (
            <div key={`row-${dow}`} className="contents">
              <div className="flex items-center text-right">
                <span className="meta text-[10px] text-ink-400">
                  {WEEKDAYS_DE_SHORT[DISPLAY_DOWS.indexOf(dow)]}
                </span>
              </div>
              <div className="grid grid-cols-24 gap-[3px]">
                {HOURS.map((h) => {
                  const count = map.get(`${dow}-${h}`) ?? 0;
                  const t = tier(count);
                  return (
                    <button
                      type="button"
                      key={`${dow}-${h}`}
                      className={cn(
                        "relative h-6 w-full rounded-[3px] border border-line-soft transition-transform duration-150 hover:scale-110 hover:border-line-hot",
                        TIER_CLASS[t],
                      )}
                      onMouseEnter={(e) => {
                        const rect = (
                          e.target as HTMLElement
                        ).getBoundingClientRect();
                        const parentRect = (
                          e.currentTarget.closest("section") as HTMLElement
                        ).getBoundingClientRect();
                        setHover({
                          weekday: dow,
                          hour: h,
                          count,
                          x: rect.left - parentRect.left + rect.width / 2,
                          y: rect.top - parentRect.top,
                        });
                      }}
                      onMouseLeave={() => setHover(null)}
                      aria-label={`${WEEKDAY_LONG[dow]} ${h}:00 — ${count} Anrufe`}
                      title={`${WEEKDAY_LONG[dow]} ${h.toString().padStart(2, "0")}:00 — ${count} Anrufe`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* x-axis labels (every 3 hours) */}
          <div />
          <div className="relative mt-2 grid grid-cols-24 gap-[3px]">
            {HOURS.map((h) => (
              <div key={`x-${h}`} className="text-center">
                {X_AXIS_LABELS.includes(h) && (
                  <span className="meta text-[9px] text-ink-400">
                    {h.toString().padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[110%] rounded-md border border-line-firm bg-bg-3 px-3 py-1.5 text-[11px] shadow-depth-2"
          style={{ left: hover.x, top: hover.y }}
        >
          <div className="font-display text-[12px] text-ink">
            {WEEKDAY_LONG[hover.weekday]} ·{" "}
            <span className="font-mono tabular-nums">
              {hover.hour.toString().padStart(2, "0")}:00
            </span>
          </div>
          <div className="mt-0.5 text-ink-300">
            <span className="font-mono tabular-nums text-copper-300">
              {hover.count}
            </span>{" "}
            {hover.count === 1 ? "Anruf" : "Anrufe"}
          </div>
        </div>
      )}

      {/* The grid uses 24 columns — declare via inline style fallback for tailwind */}
      <style jsx>{`
        .grid-cols-24 {
          grid-template-columns: repeat(24, minmax(0, 1fr));
        }
      `}</style>
    </section>
  );
}

function Legend({ max }: { max: number }) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <span className="meta text-[10px] text-ink-400">Wenig</span>
      <div className="flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((t) => (
          <span
            key={t}
            className={cn(
              "h-3 w-4 rounded-[3px] border border-line-soft",
              TIER_CLASS[t as 0 | 1 | 2 | 3 | 4],
            )}
            aria-hidden
          />
        ))}
      </div>
      <span className="meta text-[10px] text-ink-400">
        Viel{max > 0 ? ` · max ${max}` : ""}
      </span>
    </div>
  );
}
