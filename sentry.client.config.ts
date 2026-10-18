// =============================================================================
// Sentry — browser SDK init (App Router, Next.js 14).
//
// Loaded automatically by @sentry/nextjs on the client via the compiler plugin
// (withSentryConfig). We explicitly no-op when NEXT_PUBLIC_SENTRY_DSN is unset
// so operators who choose not to adopt Sentry are never forced onto it.
//
// No static import of @sentry/nextjs: the SDK (~40 KB gz) would otherwise ship
// in the shared first-load chunk of every page, DSN or not (Next 14 leaves an
// unset NEXT_PUBLIC_ variable as a runtime lookup, so the branch is not
// removed at build time). The async chunk is only requested when a DSN is
// set, and only once the browser is idle. Trade-off: errors thrown before
// that point are not captured.
// =============================================================================

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && typeof window !== "undefined") {
  const boot = () =>
    import("@sentry/nextjs").then((Sentry) =>
      Sentry.init({
        dsn,
        // Keep the default sample rate low — we care about errors, not perf.
        tracesSampleRate: 0.1,
        // Session replay intentionally disabled; payment forms contain PII.
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        environment: process.env.NODE_ENV,
        enabled: true,
      }),
    );
  if ("requestIdleCallback" in window) window.requestIdleCallback(boot, { timeout: 5000 });
  else setTimeout(boot, 3000);
}

export {};
