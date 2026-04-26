/**
 * VoiceStatCard — KPI tile used at the top of dashboard pages.
 *
 * Layout: panel surface, copper-tinted icon top-right, large display value,
 * mono caps title underneath, optional subtext + trend indicator. Trend uses
 * signal-ok for positive deltas and signal-err for negative.
 */

import { type LucideIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VoiceStatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  /** Percentage change vs previous period. Positive = up, negative = down. */
  trend?: number;
  /** Optional trend label override. */
  trendLabel?: string;
  icon?: LucideIcon;
  /** Optional emphasis: "hot" tints the value with copper for the headline KPI. */
  emphasis?: "hot" | "default";
  className?: string;
}

export default function VoiceStatCard({
  title,
  value,
  subtext,
  trend,
  trendLabel,
  icon: Icon,
  emphasis = "default",
  className,
}: VoiceStatCardProps) {
  const hasTrend = typeof trend === "number" && !Number.isNaN(trend);
  const trendUp = hasTrend && trend! >= 0;

  return (
    <div
      className={cn(
        "panel relative flex flex-col gap-3 px-5 py-5",
        // Subtle inner rule beneath icon — adds the "instrument panel" feel.
        className,
      )}
    >
      {Icon && (
        <div
          aria-hidden
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-hot/60 bg-copper-500/[0.08] text-copper-300"
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="meta text-[10px] text-ink-400">{title}</span>
        <span
          className={cn(
            "font-display text-[28px] font-medium leading-none tracking-tight tabular-nums",
            emphasis === "hot" ? "text-copper-300" : "text-ink",
          )}
        >
          {value}
        </span>
      </div>

      {(subtext || hasTrend) && (
        <div className="flex items-center gap-2 pt-1">
          {hasTrend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-pill border px-1.5 py-0.5 font-mono text-[10px] tracking-tight tabular-nums",
                trendUp
                  ? "border-signal-ok/30 bg-signal-ok/[0.08] text-signal-ok"
                  : "border-signal-err/30 bg-signal-err/[0.08] text-signal-err",
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              ) : (
                <ArrowDownRight className="h-3 w-3" aria-hidden />
              )}
              {trendUp ? "+" : ""}
              {trend!.toFixed(0)}%
            </span>
          )}
          {(subtext || trendLabel) && (
            <span className="text-[11px] leading-tight text-ink-400">
              {trendLabel ?? subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
