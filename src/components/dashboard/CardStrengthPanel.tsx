"use client";

// =============================================================================
// CardStrengthPanel — single "Kartını güçlendir" panel.
//
// Replaces the two overlapping widgets (CardQualityWidget "Profilstärke" +
// CardCoachPanel "Coach-Tipps") which both read the same quality engine. One
// panel now: a score ring + "+N points possible" on top, then the FULL list of
// suggestions where EVERY row is fully tappable (the whole row navigates the
// editor to the relevant section). Fixes the mobile issue where the old "Edit"
// button was hover-only (opacity-0) and never appeared on touch.
//
// Data: GET /api/card/edit/[orderId]/quality-score?t=TOKEN -> QualityScoreResult
// (score + full suggestions). The separate /coach endpoint is no longer used.
// =============================================================================

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { QualityScoreResult } from "@/lib/card-quality";

type Loc = "de" | "en" | "tr";

interface Props {
  orderId: string;
  editToken: string;
  locale?: Loc;
  onNavigateToSection?: (section: string) => void;
}

const T = {
  title: { de: "Kartını güçlendir", en: "Strengthen your card", tr: "Kartını güçlendir" },
  pointsPossible: { de: "Punkte möglich", en: "points possible", tr: "puan mümkün" },
  edit: { de: "Bearbeiten", en: "Edit", tr: "Düzenle" },
  perfect: { de: "Perfektes Profil", en: "Perfect profile", tr: "Mükemmel profil" },
  priority: {
    high: { de: "Hoch", en: "High", tr: "Yüksek" },
    medium: { de: "Mittel", en: "Medium", tr: "Orta" },
    low: { de: "Niedrig", en: "Low", tr: "Düşük" },
  },
  label: {
    de: { a: "Ausgezeichnet", b: "Gut", c: "Ausbaufähig", d: "Unvollständig" },
    en: { a: "Excellent", b: "Good", c: "Improvable", d: "Incomplete" },
    tr: { a: "Mükemmel", b: "İyi", c: "Geliştirilebilir", d: "Eksik" },
  },
} as const;

export function CardStrengthPanel({
  orderId,
  editToken,
  locale = "de",
  onNavigateToSection,
}: Props) {
  const [result, setResult] = useState<QualityScoreResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/card/edit/${orderId}/quality-score?t=${encodeURIComponent(editToken)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: QualityScoreResult | null) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, editToken]);

  if (loading) return <div className="h-20 animate-pulse rounded-xl bg-bg-2" />;
  if (!result) return null;

  const { score } = result;
  const suggestions = result.suggestions ?? [];
  const remaining = suggestions.reduce((sum, s) => sum + s.points, 0);

  const strokeColor =
    score >= 90 ? "var(--signal-ok)"
    : score >= 70 ? "var(--copper-500)"
    : score >= 40 ? "var(--signal-warn)"
    : "var(--signal-err)";
  const scoreColor =
    score >= 90 ? "text-signal-ok"
    : score >= 70 ? "text-copper-500"
    : score >= 40 ? "text-signal-warn"
    : "text-signal-err";
  const lbl = T.label[locale];
  const label = score >= 90 ? lbl.a : score >= 70 ? lbl.b : score >= 40 ? lbl.c : lbl.d;

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-1">
      {/* Header — score ring + summary (not a toggle; the panel stays open). */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative h-[68px] w-[68px] shrink-0">
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r={radius} fill="none" stroke="var(--line)" strokeWidth="5" />
            <circle
              cx="34" cy="34" r={radius} fill="none" stroke={strokeColor} strokeWidth="5"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
              transform="rotate(-90 34 34)" style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-base font-semibold ${scoreColor}`}>
            {score}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{T.title[locale]}</p>
          <p className="text-xs text-ink-200">{label}</p>
          {remaining > 0 && (
            <p className="mt-0.5 text-xs font-medium text-copper-600">
              +{remaining} {T.pointsPossible[locale]}
            </p>
          )}
        </div>
      </div>

      {/* Full suggestion list — every row is a tap target. */}
      {suggestions.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-line px-4 py-3">
          {suggestions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onNavigateToSection?.(s.targetSection)}
              className="group flex w-full items-center gap-3 rounded-lg border border-line bg-bg-2 px-3 py-2.5 text-left transition-colors hover:border-copper-500/50 hover:bg-bg-3 active:scale-[0.99]"
            >
              <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
                <span className="text-xs font-bold text-copper-600">+{s.points}</span>
                <span
                  className={[
                    "rounded px-1 text-[9px] font-semibold uppercase tracking-wide",
                    s.priority === "high"
                      ? "bg-signal-err/10 text-signal-err"
                      : s.priority === "medium"
                      ? "bg-signal-warn/15 text-signal-warn"
                      : "bg-bg-3 text-ink-200",
                  ].join(" ")}
                >
                  {T.priority[s.priority]?.[locale] ?? s.priority}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight text-ink">
                  {s.title[locale] ?? s.title.en}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-ink-200">
                  {s.description[locale] ?? s.description.en}
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-copper-600">
                {T.edit[locale]}
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="border-t border-line px-4 py-3 text-center text-sm font-medium text-signal-ok">
          {T.perfect[locale]}
        </div>
      )}
    </div>
  );
}
