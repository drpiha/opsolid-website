"use client";

// =============================================================================
// SaveContactButton — sticky "Save Contact" CTA shown on every published card
// page. Triggers a download of /api/cards/[slug]/vcard which iOS opens in
// Contacts directly, Android offers Contacts/Gmail import.
//
// Sticky positioning at the bottom of the viewport so the action is always one
// thumb-tap away during scroll — by far the highest-intent interaction on a
// digital business card. We hide it once the user scrolls past 90% of the
// document so it doesn't cover footer credits at the very bottom.
// =============================================================================

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";

interface Props {
  slug: string;
  /** Optional brand color override (hex). Falls back to ink/amber palette. */
  primaryHex?: string | null;
  /** "Save Contact" label — pass localized text from the page. */
  label?: string;
}

export function SaveContactButton({
  slug,
  primaryHex,
  label = "Save Contact",
}: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop + window.innerHeight;
      const total = doc.scrollHeight;
      // Hide when within 60px of the bottom — frees up the footer area.
      setHidden(total - scrolled < 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accent = primaryHex ?? "#15120F";

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),16px)] transition-all duration-300 ${
        hidden
          ? "translate-y-4 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <a
        href={`/api/cards/${encodeURIComponent(slug)}/vcard`}
        download
        className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/15 backdrop-blur transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: accent }}
      >
        <UserPlus size={18} strokeWidth={2.2} />
        <span>{label}</span>
      </a>
    </div>
  );
}
