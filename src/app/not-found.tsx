// =============================================================================
// Global (root-level) 404 — misses outside the [locale] segment (URLs the
// middleware skips, unknown first segments). No header, footer or locale
// provider here, so it renders the German v4 404 with its own graphite tokens.
// Unknown URLs under /de, /en and /tr get the localized one in
// src/app/[locale]/not-found.tsx.
// =============================================================================

import type { Metadata } from "next";
import { NotFoundView, NOT_FOUND_TITLE } from "@/components/v4/NotFoundView";

// robots: null drops the root layout's "index, follow"; Next adds the single
// <meta name="robots" content="noindex"> to every 404 itself.
export const metadata: Metadata = { title: NOT_FOUND_TITLE, robots: null };

export default function RootNotFound() {
  return (
    <main id="main" className="flex-1" style={{ background: "#12110f" }}>
      <NotFoundView locale="de" standalone />
    </main>
  );
}
