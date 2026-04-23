// =============================================================================
// Sentry — edge runtime init (middleware + edge routes).
// No-op when SENTRY_DSN is unset.
// =============================================================================

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    enabled: true,
  });
}
