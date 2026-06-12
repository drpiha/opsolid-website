"use client";

// =============================================================================
// StripOwnerParam — removes `?owner=<editToken>` from the address bar after
// the server has already verified it and rendered owner mode.
//
// Why: right after creating a card the owner lands on /c/<slug>?owner=<token>.
// The natural next move at a fair is "share this page" via the browser's
// native share or copy-the-address-bar — which would hand the recipient the
// edit token (full owner powers). history.replaceState keeps the rendered
// owner view intact for this visit while making the shareable URL clean.
// A refresh shows the public view; owner tools remain one click away via the
// toolbar's edit/manage links and the card-live email.
// =============================================================================

import { useEffect } from "react";

export function StripOwnerParam() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("owner")) return;
      url.searchParams.delete("owner");
      window.history.replaceState(
        null,
        "",
        url.pathname + (url.searchParams.size ? `?${url.searchParams}` : "") + url.hash,
      );
    } catch {
      /* very old browsers — leave the URL untouched */
    }
  }, []);
  return null;
}
