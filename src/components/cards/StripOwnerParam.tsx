"use client";

// =============================================================================
// OwnerSessionKeeper (exported as StripOwnerParam for callsite continuity) —
// converts the one-shot `?owner=<editToken>` URL into a persistent owner
// session, then cleans the address bar.
//
// Why both steps:
//   1. POST /api/card/owner-session stores the validated token in a per-card
//      httpOnly cookie, so a refresh (or returning tomorrow on the same
//      phone) still renders owner mode — no more "create your own card"
//      banner on your own card.
//   2. history.replaceState removes `owner` from the URL, so the browser's
//      native share / copy-address can never leak the edit token.
//
// Ordering matters: the cookie write is fired first and the URL is cleaned
// regardless of its outcome — worst case (request fails) we degrade to the
// old behavior, never to a leaked token.
// =============================================================================

import { useEffect } from "react";

export function StripOwnerParam({ orderId }: { orderId: string }) {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("owner");
      if (!token) return;

      void fetch(`/api/card/owner-session?t=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }).catch(() => {
        /* cookie persistence is best-effort */
      });

      url.searchParams.delete("owner");
      window.history.replaceState(
        null,
        "",
        url.pathname + (url.searchParams.size ? `?${url.searchParams}` : "") + url.hash,
      );
    } catch {
      /* very old browsers — leave the URL untouched */
    }
  }, [orderId]);
  return null;
}
