// =============================================================================
// Public card URL resolution — the single place that decides which address
// QR codes, share images and short-link redirects embed for a card.
//
// Two modes:
//   • NEXT_PUBLIC_CARD_HOST set AND CARD_HOST_VERIFIED=true → pretty
//     subdomain URLs (`https://card.opsolid.de/<slug>`).
//   • otherwise (default) → canonical path URLs
//     (`https://opsolid.de/c/<slug>`), which always resolve because they
//     ride the main domain.
//
// Why the double switch: as of 2026-06-12 card.opsolid.de's Traefik routing
// is claimed by the separate Verso app, so QRs encoding it dead-end in a
// 404 — and the production .env was found to carry the host value from the
// old documentation. Requiring an explicit CARD_HOST_VERIFIED=true means a
// stale host value alone can never put a dead address on a printed QR; the
// operator flips the flag only after `curl -I https://<host>/<any-slug>`
// returns this app's card page.
//
// go.opsolid.de (short links) is configured separately via
// NEXT_PUBLIC_SHORT_HOST and is verified working — this module only covers
// the card page itself.
// =============================================================================

import { getSiteUrl } from "@/lib/stripe";

/** Absolute public URL for a published card. */
export function publicCardUrlFor(slug: string): string {
  const host = process.env.NEXT_PUBLIC_CARD_HOST?.trim();
  if (host && process.env.CARD_HOST_VERIFIED === "true") {
    return `https://${host.replace(/^https?:\/\//, "")}/${slug}`;
  }
  return `${getSiteUrl().replace(/\/$/, "")}/c/${slug}`;
}

/** Same URL without the protocol — for visible footers on share images. */
export function publicCardDisplayFor(slug: string): string {
  return publicCardUrlFor(slug).replace(/^https?:\/\//, "");
}
