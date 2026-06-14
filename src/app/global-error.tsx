// =============================================================================
// Global error boundary — catches React render errors that escape the root
// layout (where `error.tsx` cannot reach). Reports to Sentry and renders a
// self-contained, provider-free fallback: no LocaleProvider/theme here, so the
// copy is short + trilingual and styling stays on the theme-independent
// neutral/copper scale (mirrors src/app/not-found.tsx).
//
// Resolves the Next.js build warning:
//   "It seems like you don't have a global error handler set up."
// =============================================================================

"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#FAFAFA",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        {/* Hidden Next default to keep accessible status semantics */}
        <div style={{ display: "none" }}>
          <NextError statusCode={500} />
        </div>
        <p
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#A3A3A3",
          }}
        >
          OpSolid
        </p>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#171717",
            margin: 0,
          }}
        >
          Etwas ist schiefgelaufen · Bir şeyler ters gitti · Something went wrong
        </h1>
        <p
          style={{
            maxWidth: "28rem",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "#737373",
            margin: 0,
          }}
        >
          Bitte laden Sie die Seite neu. — Lütfen sayfayı yenileyin. — Please
          reload the page.
        </p>
        <a
          href="/"
          style={{
            marginTop: "1rem",
            borderRadius: "9999px",
            background: "#171717",
            color: "#FAFAFA",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          opsolid.de
        </a>
      </body>
    </html>
  );
}
