"use client";

// =============================================================================
// CardCoachPanel — Phase 8.6
//
// Full coaching suggestion list (all criteria, not just top-3) fetched from
// GET /api/card/edit/[orderId]/coach?t=TOKEN.
// Each tile is clickable and navigates the editor to the relevant section.
// Provider abstraction: rule-based by default; AI-backed available on request.
// =============================================================================

import { useEffect, useState } from "react";
import type { QualitySuggestion } from "@/lib/card-quality";

interface Props {
  orderId: string;
  editToken: string;
  locale?: "de" | "en" | "tr";
  onNavigateToSection?: (section: string) => void;
}

const PRIORITY_LABEL: Record<string, Record<string, string>> = {
  high:   { de: "Hoch", en: "High",   tr: "Yüksek" },
  medium: { de: "Mittel", en: "Medium", tr: "Orta"  },
  low:    { de: "Niedrig", en: "Low", tr: "Düşük"  },
};

export function CardCoachPanel({
  orderId,
  editToken,
  locale = "de",
  onNavigateToSection,
}: Props) {
  const [suggestions, setSuggestions] = useState<QualitySuggestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const url = `/api/card/edit/${orderId}/coach?t=${encodeURIComponent(editToken)}`;

  useEffect(() => {
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { suggestions: QualitySuggestion[] } | null) => {
        if (d) setSuggestions(d.suggestions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  if (loading) return <div className="animate-pulse h-12 rounded-xl bg-bg-2" />;
  if (!suggestions || suggestions.length === 0) return null;

  const headerText =
    locale === "de"
      ? "Coach-Tipps"
      : locale === "tr"
      ? "Koç Önerileri"
      : "Coach Tips";
  const editLabel =
    locale === "de" ? "Bearbeiten" : locale === "tr" ? "Düzenle" : "Edit";
  const collapseLabel =
    locale === "de"
      ? open
        ? "Weniger anzeigen"
        : `${suggestions.length} Verbesserungen anzeigen`
      : locale === "tr"
      ? open
        ? "Daha az göster"
        : `${suggestions.length} iyileştirme göster`
      : open
      ? "Show less"
      : `Show ${suggestions.length} improvements`;

  return (
    <div className="rounded-xl border border-line bg-bg-1 overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-bg-2 transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{headerText}</span>
          <span className="inline-flex items-center rounded-full bg-copper-500/10 px-2 py-0.5 text-xs font-semibold text-copper-600">
            {suggestions.length}
          </span>
        </div>
        <svg
          className={`shrink-0 text-ink-300 transition-transform ${open ? "rotate-180" : ""}`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-line px-4 py-3 flex flex-col gap-2">
          {suggestions.map((s) => (
            <div
              key={s.key}
              className="flex items-start gap-3 rounded-lg border border-line bg-bg-2 px-3 py-2.5 group"
            >
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                <span className="text-xs font-bold text-copper-500">+{s.points}</span>
                <span
                  className={[
                    "text-[9px] font-semibold uppercase tracking-wide rounded px-1",
                    s.priority === "high"
                      ? "bg-signal-err/10 text-signal-err"
                      : s.priority === "medium"
                      ? "bg-signal-warn/10 text-signal-warn"
                      : "bg-bg-3 text-ink-400",
                  ].join(" ")}
                >
                  {PRIORITY_LABEL[s.priority]?.[locale] ?? s.priority}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">
                  {s.title[locale as keyof typeof s.title] ?? s.title.en}
                </p>
                <p className="text-xs text-ink-300 mt-0.5 leading-snug">
                  {s.description[locale as keyof typeof s.description] ?? s.description.en}
                </p>
              </div>

              {onNavigateToSection && (
                <button
                  onClick={() => onNavigateToSection(s.targetSection)}
                  className="text-xs text-copper-500 hover:text-copper-400 shrink-0 font-medium self-start pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {editLabel}
                </button>
              )}
            </div>
          ))}

          <p className="text-xs text-ink-400 text-center pt-1">
            {locale === "de"
              ? "KI-Analyse folgt in einer späteren Version"
              : locale === "tr"
              ? "Yapay zeka analizi ilerleyen sürümlerde gelecek"
              : "AI-powered analysis coming in a future version"}
          </p>
        </div>
      )}

      {!open && (
        <div className="border-t border-line px-4 py-2">
          <button
            onClick={() => setOpen(true)}
            className="text-xs text-copper-500 hover:text-copper-400 transition-colors"
          >
            {collapseLabel}
          </button>
        </div>
      )}
    </div>
  );
}
