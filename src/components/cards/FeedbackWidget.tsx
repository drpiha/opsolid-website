"use client";

// =============================================================================
// FeedbackWidget — Phase 8.4
//
// Displayed on the public /c/[slug] card page. Fetches the aggregate feedback
// data from GET /api/cards/[slug]/feedback and either:
//   • hides itself entirely when feedback is disabled (enabled: false)
//   • shows aggregate bar chart in "view" mode
//   • offers a 7-category star rating form in "form" mode
//
// On 401 the user is redirected to /[locale]/login?next=<current path>.
// On cannot_review_own_card error a localised message is shown inline.
//
// Design tokens: copper-500 accent, bg-bg-1/bg-bg-2 surfaces, border-line,
// text-ink/text-ink-300/text-ink-400. No new npm deps.
// =============================================================================

import { useEffect, useState } from "react";

const CATEGORIES = [
  { key: "design", label: { de: "Design", en: "Design", tr: "Tasarım" } },
  { key: "readability", label: { de: "Lesbarkeit", en: "Readability", tr: "Okunabilirlik" } },
  { key: "photo", label: { de: "Foto/Logo", en: "Photo/Logo", tr: "Fotoğraf/Logo" } },
  { key: "cta", label: { de: "Handlungsaufforderung", en: "Call to Action", tr: "CTA Netliği" } },
  { key: "mobile", label: { de: "Mobil-Layout", en: "Mobile Layout", tr: "Mobil Görünüm" } },
  { key: "trust", label: { de: "Vertrauenssignale", en: "Trust Signals", tr: "Güven Unsurları" } },
  { key: "content", label: { de: "Inhalt", en: "Content", tr: "İçerik" } },
] as const;

type Category = typeof CATEGORIES[number]["key"];
type Ratings = Record<Category, number>;

interface Aggregate {
  enabled: boolean;
  count: number;
  averages: Partial<Record<Category, number>>;
}

interface Props {
  slug: string;
  locale?: "de" | "en" | "tr";
}

function StarRow({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="text-xl leading-none disabled:cursor-default"
          aria-label={`${n} Stern`}
        >
          <span className={(hover || value) >= n ? "text-copper-500" : "text-line"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function FeedbackWidget({ slug, locale = "de" }: Props) {
  const [aggregate, setAggregate] = useState<Aggregate | null>(null);
  const [mode, setMode] = useState<"view" | "form" | "done">("view");
  const [ratings, setRatings] = useState<Partial<Ratings>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cards/${slug}/feedback`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Aggregate | null) => d && setAggregate(d))
      .catch(() => {});
  }, [slug]);

  // Self-hide when feedback is disabled or not yet loaded
  if (!aggregate?.enabled) return null;

  const allRated = CATEGORIES.every((c) => (ratings[c.key] ?? 0) > 0);

  const t = (de: string, en: string, tr: string) =>
    locale === "en" ? en : locale === "tr" ? tr : de;

  async function submit() {
    if (!allRated) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${slug}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratings,
          comment: comment.trim() || undefined,
        }),
      });
      if (res.status === 401) {
        window.location.href = `/${locale}/login?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(
          d.error === "cannot_review_own_card"
            ? t(
                "Eigene Karte kann nicht bewertet werden.",
                "You cannot review your own card.",
                "Kendi kartınızı değerlendiremezsiniz.",
              )
            : t("Fehler beim Senden.", "Error submitting feedback.", "Gönderilirken hata oluştu."),
        );
        return;
      }
      setMode("done");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-bg-1 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">
            {t("Profil-Feedback", "Profile Feedback", "Profil Geri Bildirimi")}
          </p>
          {aggregate.count > 0 && (
            <p className="text-xs text-ink-300">
              {aggregate.count}{" "}
              {t("Bewertung(en)", "review(s)", "değerlendirme")}
            </p>
          )}
        </div>
        {mode === "view" && (
          <button
            onClick={() => setMode("form")}
            className="text-xs text-copper-500 hover:text-copper-400 font-medium border border-copper-500/30 rounded-lg px-3 py-1.5 hover:bg-copper-500/5 transition-colors"
          >
            {t("Bewerten", "Rate this card", "Değerlendir")}
          </button>
        )}
      </div>

      {/* Aggregate bars — visible in view mode when there are reviews */}
      {aggregate.count > 0 && mode === "view" && (
        <div className="px-4 py-3 grid grid-cols-1 gap-2">
          {CATEGORIES.map((c) => {
            const avg = aggregate.averages[c.key] ?? 0;
            return (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-xs text-ink-300 w-32 shrink-0">
                  {c.label[locale]}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-bg-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-copper-500 transition-all"
                    style={{ width: `${(avg / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-ink-300 w-6 text-right">
                  {avg || "–"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating form */}
      {mode === "form" && (
        <div className="px-4 py-3 flex flex-col gap-3">
          {CATEGORIES.map((c) => (
            <div key={c.key} className="flex items-center justify-between gap-2">
              <span className="text-sm text-ink">{c.label[locale]}</span>
              <StarRow
                value={ratings[c.key] ?? 0}
                onChange={(v) =>
                  setRatings((r) => ({ ...r, [c.key]: v }))
                }
              />
            </div>
          ))}
          <textarea
            placeholder={t(
              "Optionaler Kommentar…",
              "Optional comment…",
              "İsteğe bağlı yorum…",
            )}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={2}
            className="w-full rounded-lg border border-line bg-bg-0 px-3 py-2 text-sm text-ink placeholder:text-ink-400 resize-none focus:outline-none focus:border-copper-500"
          />
          {error && <p className="text-xs text-signal-err">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setMode("view")}
              className="text-sm text-ink-300 hover:text-ink px-3 py-1.5"
            >
              {t("Abbrechen", "Cancel", "İptal")}
            </button>
            <button
              onClick={submit}
              disabled={!allRated || submitting}
              className="text-sm font-medium bg-copper-500 text-white rounded-lg px-4 py-1.5 hover:bg-copper-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "…" : t("Senden", "Submit", "Gönder")}
            </button>
          </div>
        </div>
      )}

      {/* Success state */}
      {mode === "done" && (
        <div className="px-4 py-4 text-center text-sm text-signal-ok">
          {t(
            "Vielen Dank für Ihr Feedback!",
            "Thank you for your feedback!",
            "Geri bildiriminiz için teşekkürler!",
          )}
        </div>
      )}
    </div>
  );
}
