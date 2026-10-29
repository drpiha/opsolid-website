// =============================================================================
// Global (root-level) 404 — misses outside the [locale] segment (URLs the
// middleware skips, unknown first segments). No header, footer or locale
// provider and no html[data-v4] flag here, so the v7 look is inlined: porcelain
// page, ink text, copper accent, system serif display. German only.
// Unknown URLs under /de, /en and /tr get the localized one in
// src/app/[locale]/not-found.tsx.
// =============================================================================

import type { Metadata } from "next";

// robots: null drops the root layout's "index, follow"; Next adds the single
// <meta name="robots" content="noindex"> to every 404 itself.
export const metadata: Metadata = { title: "Seite nicht gefunden", robots: null };

export default function RootNotFound() {
  return (
    <main
      id="main"
      lang="de"
      style={{
        flex: 1,
        minHeight: "100vh",
        background: "#F6F2EC",
        color: "#16191D",
        padding: "clamp(40px, 10vw, 120px) 16px",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontSize: 18,
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p style={{ color: "#8A4524", fontSize: 13, letterSpacing: "0.02em", textTransform: "uppercase", margin: 0, fontFamily: "ui-monospace, Menlo, monospace" }}>
          Fehler 404
        </p>
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 300, fontSize: "clamp(2.25rem, 7vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "24px 0 0" }}>
          Diese Seite <em style={{ color: "#B5623A" }}>gibt es nicht.</em>
        </h1>
        <p style={{ marginTop: 24, maxWidth: "38rem" }}>Die Seite existiert nicht oder wurde verschoben.</p>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 52,
            marginTop: 32,
            padding: "0 28px",
            borderRadius: 16,
            background: "#16191D",
            color: "#F6F2EC",
            fontSize: 16,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Zur Startseite
        </a>
      </div>
    </main>
  );
}
