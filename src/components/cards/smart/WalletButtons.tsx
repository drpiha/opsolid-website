// =============================================================================
// WalletButtons — server component that renders Apple/Google Wallet buttons,
// gated on env-var presence so the buttons disappear silently in dev/prod
// where wallet certs aren't configured (no broken click target).
//
// Reads `isAppleWalletConfigured()` / `isGoogleWalletConfigured()` at request
// time. Each button links to the matching API route, which itself returns 503
// if the env disappears between server-render and click (defense in depth).
//
// Visual style: matches the existing footer's warm-graphite + premium chrome.
// Multi-layer treatment per design memory — ring + shadow + subtle gradient,
// not a flat-padding-typography pill.
// =============================================================================

import { Wallet } from "lucide-react";
import {
  isAppleWalletConfigured,
  isGoogleWalletConfigured,
} from "@/lib/wallet/config";

export interface WalletButtonsProps {
  slug: string;
}

export function WalletButtons({ slug }: WalletButtonsProps) {
  const apple = isAppleWalletConfigured();
  const google = isGoogleWalletConfigured();
  if (!apple && !google) return null;

  const slugEnc = encodeURIComponent(slug);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {apple && (
        <a
          href={`/api/cards/${slugEnc}/wallet/apple`}
          // Apple's pkpass MIME triggers the wallet UI on iOS even without
          // `download`; we set it for desktop browsers that would otherwise
          // attempt to render the binary inline.
          download
          className={[
            "group inline-flex items-center gap-2 rounded-full",
            "bg-ink/95 px-4 py-2 text-xs font-semibold tracking-wide text-paper-cool",
            "ring-1 ring-inset ring-white/10 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_8px_24px_-12px_rgba(0,0,0,0.45)]",
            "transition hover:bg-ink hover:ring-white/15 active:scale-[0.98]",
          ].join(" ")}
          aria-label="Add to Apple Wallet"
        >
          <span
            aria-hidden
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
          >
            <Wallet size={11} strokeWidth={2.4} />
          </span>
          <span className="leading-none">Add to Apple Wallet</span>
        </a>
      )}
      {google && (
        <a
          href={`/api/cards/${slugEnc}/wallet/google`}
          className={[
            "group inline-flex items-center gap-2 rounded-full",
            // Slightly different chrome so the two buttons read as distinct
            // brands without breaking the warm-graphite palette.
            "bg-bg-1 px-4 py-2 text-xs font-semibold tracking-wide text-ink",
            "ring-1 ring-line shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_-14px_rgba(21,18,15,0.35)]",
            "transition hover:bg-bg-2 hover:ring-line-firm active:scale-[0.98]",
          ].join(" ")}
          aria-label="Save to Google Wallet"
        >
          <span
            aria-hidden
            className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/5 ring-1 ring-line"
          >
            <Wallet size={11} strokeWidth={2.4} />
          </span>
          <span className="leading-none">Save to Google Wallet</span>
        </a>
      )}
    </div>
  );
}
