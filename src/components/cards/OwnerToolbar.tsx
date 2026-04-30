"use client";

// =============================================================================
// OwnerToolbar — Phase 8.
//
// Renders a small floating bar on the public card page when the visitor is
// in fact the owner (verified server-side via ?owner=<editToken>). Gives the
// owner one-tap access to the edit page and the share-link affordance without
// having to find the original confirmation email.
// =============================================================================

import * as React from "react";
import { Pencil, Share2, Check } from "lucide-react";

interface Props {
  editHref: string;
  publicUrl: string;
  shareTitle: string;
  labels: {
    publicBannerLabel: string;
    editLabel: string;
    shareLabel: string;
  };
}

export function OwnerToolbar({
  editHref,
  publicUrl,
  shareTitle,
  labels,
}: Props) {
  const [copied, setCopied] = React.useState(false);

  const onShare = React.useCallback(async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ url: publicUrl, title: shareTitle });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard rejection — silent */
    }
  }, [publicUrl, shareTitle]);

  return (
    <div className="fixed left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-700/30 bg-emerald-50/95 px-3 py-1.5 text-xs shadow-[0_8px_24px_-12px_rgba(20,18,15,0.35)] backdrop-blur">
      <span className="flex items-center gap-1.5 px-1 font-semibold text-emerald-800">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
        {labels.publicBannerLabel}
      </span>
      <span className="h-3 w-px bg-emerald-700/20" />
      <a
        href={editHref}
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
      >
        <Pencil size={11} strokeWidth={2.4} />
        {labels.editLabel}
      </a>
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
      >
        {copied ? (
          <Check size={11} strokeWidth={2.4} />
        ) : (
          <Share2 size={11} strokeWidth={2.4} />
        )}
        {labels.shareLabel}
      </button>
    </div>
  );
}

// `constantTimeEquals` lives in `@/lib/constantTime` so server components can
// import it without going through the "use client" boundary (which would turn
// the function into a client proxy → "TypeError: D is not a function").
