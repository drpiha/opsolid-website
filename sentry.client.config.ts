// =============================================================================
// Sentry — browser SDK init (App Router, Next.js 14).
//
// Loaded automatically by @sentry/nextjs on the client via the compiler plugin
// (withSentryConfig). We explicitly no-op when NEXT_PUBLIC_SENTRY_DSN is unset
// so operators who choose not to adopt Sentry are never forced onto it.
// =============================================================================

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Keep the default sample rate low — we care about errors, not perf.
    tracesSampleRate: 0.1,
    // Session replay intentionally disabled; payment forms contain PII.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    environment: process.env.NODE_ENV,
    enabled: true,
  });
}
