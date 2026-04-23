// =============================================================================
// Sentry — Node.js server init.
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
    // Avoid noisy DB logs in breadcrumbs.
    integrations: (defaults) => defaults,
  });
}
