// =============================================================================
// Public card URL resolution — the single place that decides which address
// QR codes, share images and short-link redirects embed for a card.
//
// Two modes:
//   • NEXT_PUBLIC_CARD_HOST set (e.g. "card.opsolid.de") → pretty subdomain
//     URLs (`https://card.opsolid.de/<slug>`). Set this ONLY after verifying
//     that the subdomain's Traefik router actually points at THIS app — as
//     of 2026-06-12 card.opsolid.de is claimed by the separate Verso app, so
//     QRs encoding it dead-end in a 404.
//   • unset (default)  → canonical path URLs (`https://opsolid.de/c/<slug>`),
//     which always resolve because they ride the main domain.
//
// go.opsolid.de (short links) is configured separately via
// NEXT_PUBLIC_SHORT_HOST and is verified working — this module only covers
// the card page itself.
// =============================================================================

import { getSiteUrl } from "@/lib/stripe";

/** Absolute public URL for a published card. */
export function publicCardUrlFor(slug: string): string {
  const host = process.env.NEXT_PUBLIC_CARD_HOST?.trim();
  if (host) {
    return `https://${host.replace(/^https?:\/\//, "")}/${slug}`;
  }
  return `${getSiteUrl().replace(/\/$/, "")}/c/${slug}`;
}

/** Same URL without the protocol — for visible footers on share images. */
export function publicCardDisplayFor(slug: string): string {
  return publicCardUrlFor(slug).replace(/^https?:\/\//, "");
}
