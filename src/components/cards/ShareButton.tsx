"use client";

// =============================================================================
// ShareButton — Phase 5.
//
// Lightweight client wrapper rendered on the public card page. Mounts a
// "Paylaş" FAB that opens ShareDrawer. Placed above QRFlipOverlay in the
// DOM so both are accessible without collision (QR occupies bottom-right;
// this sits bottom-left).
// =============================================================================

import * as React from "react";
import { Share2 } from "lucide-react";
import { ShareDrawer } from "./ShareDrawer";

interface ShareButtonProps {
  slug: string;
  accentHex?: string;
  locale?: "de" | "en" | "tr";
}

const SHARE_ARIA_LABELS: Record<"de" | "en" | "tr", string> = {
  de: "Karte teilen",
  en: "Share card",
  tr: "Kartı paylaş",
};

export function ShareButton({
  slug,
  accentHex = "#C27940",
  locale = "de",
}: ShareButtonProps) {
  const [open, setOpen] = React.useState(false);
  const ariaLabel = SHARE_ARIA_LABELS[locale];

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_36px_-10px_rgba(0,0,0,0.45)] transition active:scale-95"
        style={{ background: accentHex }}
      >
        <Share2 size={24} strokeWidth={2.1} />
      </button>

      <ShareDrawer slug={slug} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
