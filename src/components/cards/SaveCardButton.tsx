"use client";

// =============================================================================
// SaveCardButton — Phase 8.3
//
// Displayed on the public /c/[slug] card page. Checks if the current user has
// already saved this card via GET /api/cards/[slug]/save, then toggles
// save/unsave on click.
//
// If the user is not authenticated (401) the check silently hides the button
// until interaction; on click the visitor is redirected to login with `next`
// pointing back to the current card URL.
//
// Design tokens: copper-500 for active state, bg-bg-1/border-line for rest.
// No new npm packages, no framer-motion.
// =============================================================================

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  locale?: "de" | "en" | "tr";
  className?: string;
}

const LABELS: Record<"de" | "en" | "tr", { saved: string; unsaved: string; ariaRemove: string; ariaAdd: string }> = {
  de: { saved: "Gespeichert", unsaved: "Speichern", ariaRemove: "Aus Kontakten entfernen", ariaAdd: "Kontakt speichern" },
  en: { saved: "Saved", unsaved: "Save contact", ariaRemove: "Remove from contacts", ariaAdd: "Save contact" },
  tr: { saved: "Kaydedildi", unsaved: "Kaydet", ariaRemove: "Kişilerden kaldır", ariaAdd: "Kişiyi kaydet" },
};

export function SaveCardButton({ slug, locale = "de", className = "" }: Props) {
  const [saved, setSaved] = useState(false);
  // `authChecked` — true once we know whether the user is logged in.
  // We show the button regardless (guest or user), but guests are redirected
  // to login on click.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const labels = LABELS[locale];

  useEffect(() => {
    fetch(`/api/cards/${encodeURIComponent(slug)}/save`)
      .then((r) => {
        if (r.status === 401) {
          setLoading(false);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) setSaved(data.saved ?? false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  async function toggle() {
    setSubmitting(true);
    try {
      const method = saved ? "DELETE" : "POST";
      const res = await fetch(`/api/cards/${encodeURIComponent(slug)}/save`, { method });
      if (res.status === 401) {
        window.location.href = `/${locale}/login?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved ?? !saved);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Don't flash a button before the status check resolves.
  if (loading) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={submitting}
      aria-label={saved ? labels.ariaRemove : labels.ariaAdd}
      aria-pressed={saved}
      className={[
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        saved
          ? "border-copper-500 bg-copper-500/10 text-copper-500 hover:bg-copper-500/20"
          : "border-line bg-bg-1 text-ink hover:border-copper-500 hover:text-copper-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Star icon — filled when saved */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 2.5L9.8 6.2L14 6.9L11 9.8L11.6 14L8 12.1L4.4 14L5 9.8L2 6.9L6.2 6.2L8 2.5Z" />
      </svg>
      <span>{saved ? labels.saved : labels.unsaved}</span>
    </button>
  );
}
