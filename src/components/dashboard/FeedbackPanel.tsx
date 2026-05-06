"use client";

// =============================================================================
// FeedbackPanel — Phase 8.4
//
// Displayed in the card editor (CardEditClient) sidebar. Fetches feedback
// state for the owner via GET /api/card/edit/[orderId]/feedback?t=TOKEN and
// allows toggling feedback collection on/off via PATCH to the same endpoint.
//
// When enabled and reviews exist, shows per-category averages and the last
// 3 comments. Uses the same design tokens as CardQualityWidget.
// =============================================================================

import { useEffect, useState } from "react";

const CATEGORIES = [
  { key: "design", label: "Design" },
  { key: "readability", label: "Lesbarkeit" },
  { key: "photo", label: "Foto/Logo" },
  { key: "cta", label: "Call to Action" },
  { key: "mobile", label: "Mobil" },
  { key: "trust", label: "Vertrauen" },
  { key: "content", label: "Inhalt" },
];

interface FeedbackData {
  feedbackEnabled: boolean;
  count: number;
  averages: Record<string, number>;
  recent: Array<{ comment: string | null; createdAt: string }>;
}

interface Props {
  orderId: string;
  editToken: string;
}

export function FeedbackPanel({ orderId, editToken }: Props) {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const url = `/api/card/edit/${orderId}/feedback?t=${encodeURIComponent(editToken)}`;

  useEffect(() => {
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: FeedbackData | null) => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  async function toggleFeedback() {
    if (!data) return;
    setToggling(true);
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedbackEnabled: !data.feedbackEnabled }),
    });
    if (res.ok) {
      setData((d) =>
        d ? { ...d, feedbackEnabled: !d.feedbackEnabled } : d,
      );
    }
    setToggling(false);
  }

  if (loading) return <div className="animate-pulse h-20 rounded-xl bg-bg-2" />;
  if (!data) return null;

  return (
    <div className="rounded-xl border border-line bg-bg-1 overflow-hidden">
      {/* Header with toggle */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-line">
        <div>
          <p className="text-sm font-medium text-ink">Feedback-Modus</p>
          <p className="text-xs text-ink-300">
            {data.feedbackEnabled
              ? `Aktiv · ${data.count} Bewertung(en)`
              : "Inaktiv"}
          </p>
        </div>
        <button
          onClick={toggleFeedback}
          disabled={toggling}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            "disabled:opacity-60",
            data.feedbackEnabled ? "bg-copper-500" : "bg-line",
          ].join(" ")}
          role="switch"
          aria-checked={data.feedbackEnabled}
        >
          <span
            className={[
              "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
              data.feedbackEnabled ? "translate-x-6" : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Averages + recent comments — only when enabled and reviews exist */}
      {data.feedbackEnabled && data.count > 0 && (
        <div className="px-4 py-3 flex flex-col gap-2">
          {CATEGORIES.map((c) => {
            const avg = data.averages[c.key] ?? 0;
            return (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-xs text-ink-300 w-28 shrink-0">
                  {c.label}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-bg-2">
                  <div
                    className="h-full rounded-full bg-copper-500"
                    style={{ width: `${(avg / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-copper-500 font-medium w-6 text-right">
                  {avg || "–"}
                </span>
              </div>
            );
          })}
          {data.recent
            .filter((r) => r.comment)
            .slice(0, 3)
            .map((r, i) => (
              <p
                key={i}
                className="text-xs text-ink-300 bg-bg-2 rounded-lg px-3 py-2 italic"
              >
                &ldquo;{r.comment}&rdquo;
              </p>
            ))}
        </div>
      )}

      {/* Empty state when enabled but no reviews yet */}
      {data.feedbackEnabled && data.count === 0 && (
        <p className="px-4 py-3 text-xs text-ink-400">
          Noch keine Bewertungen erhalten.
        </p>
      )}
    </div>
  );
}
