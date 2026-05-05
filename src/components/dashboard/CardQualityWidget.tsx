"use client";

import { useEffect, useState } from "react";
import type { QualityScoreResult } from "@/lib/card-quality";

interface Props {
  orderId: string;
  editToken: string;
  locale?: "de" | "en" | "tr";
  onNavigateToSection?: (section: string) => void;
}

export function CardQualityWidget({
  orderId,
  editToken,
  locale = "de",
  onNavigateToSection,
}: Props) {
  const [result, setResult] = useState<QualityScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(
      `/api/card/edit/${orderId}/quality-score?t=${encodeURIComponent(editToken)}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data: QualityScoreResult | null) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, editToken]);

  if (loading) return <div className="animate-pulse h-20 rounded-xl bg-bg-2" />;
  if (!result) return null;

  const { score } = result;
  const scoreColor =
    score >= 90
      ? "text-signal-ok"
      : score >= 70
      ? "text-copper-500"
      : score >= 40
      ? "text-signal-warn"
      : "text-signal-err";
  const strokeColor =
    score >= 90
      ? "var(--signal-ok)"
      : score >= 70
      ? "var(--copper-500)"
      : score >= 40
      ? "var(--signal-warn)"
      : "var(--signal-err)";
  const label =
    locale === "de"
      ? score >= 90
        ? "Ausgezeichnet"
        : score >= 70
        ? "Gut"
        : score >= 40
        ? "Ausbaufähig"
        : "Unvollständig"
      : locale === "tr"
      ? score >= 90
        ? "Mükemmel"
        : score >= 70
        ? "İyi"
        : score >= 40
        ? "Geliştirilebilir"
        : "Eksik"
      : score >= 90
      ? "Excellent"
      : score >= 70
      ? "Good"
      : score >= 40
      ? "Improvable"
      : "Incomplete";

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const top3 = result.suggestions.slice(0, 3);

  return (
    <div className="rounded-xl border border-line bg-bg-1 overflow-hidden">
      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-2 transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* SVG circle score */}
        <div className="relative shrink-0 w-[68px] h-[68px]">
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle
              cx="34"
              cy="34"
              r={radius}
              fill="none"
              stroke="var(--line)"
              strokeWidth="5"
            />
            <circle
              cx="34"
              cy="34"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 34 34)"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-base font-semibold ${scoreColor}`}
          >
            {score}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink">
            {locale === "de"
              ? "Profilstärke"
              : locale === "tr"
              ? "Profil Gücü"
              : "Profile Strength"}
          </p>
          <p className="text-xs text-ink-300">{label}</p>
          {top3.length > 0 && (
            <p className="text-xs text-ink-400 mt-0.5">
              +{top3.reduce((sum, s) => sum + s.points, 0)}{" "}
              {locale === "de"
                ? "Punkte möglich"
                : locale === "tr"
                ? "puan mümkün"
                : "points possible"}
            </p>
          )}
        </div>

        <svg
          className={`shrink-0 text-ink-300 transition-transform ${open ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Suggestions panel */}
      {open && top3.length > 0 && (
        <div className="border-t border-line px-4 py-3 flex flex-col gap-2">
          {top3.map((s) => (
            <div
              key={s.key}
              className="flex items-start gap-3 rounded-lg bg-bg-2 px-3 py-2.5"
            >
              <span className="text-xs font-semibold text-copper-500 shrink-0 mt-0.5 w-8">
                +{s.points}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink font-medium leading-tight">
                  {s.title[locale]}
                </p>
                <p className="text-xs text-ink-300 mt-0.5 leading-snug">
                  {s.description[locale]}
                </p>
              </div>
              {onNavigateToSection && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToSection(s.targetSection);
                  }}
                  className="text-xs text-copper-500 hover:text-copper-400 shrink-0 font-medium"
                >
                  {locale === "de"
                    ? "Bearbeiten"
                    : locale === "tr"
                    ? "Düzenle"
                    : "Edit"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {score === 100 && (
        <div className="border-t border-line px-4 py-3 text-sm text-signal-ok text-center font-medium">
          {locale === "de"
            ? "Perfektes Profil"
            : locale === "tr"
            ? "Mükemmel Profil"
            : "Perfect Profile"}
        </div>
      )}
    </div>
  );
}
