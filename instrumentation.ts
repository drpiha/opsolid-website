// =============================================================================
// Next.js 14 instrumentation hook — loads the right Sentry config per runtime.
// Only the server/edge configs run here; the client config is bundled by the
// Sentry compiler plugin wrapping next.config.mjs.
//
// No-op when DSN is missing: each config file guards its own init(), so
// importing them has no runtime effect beyond a no-op require.
// =============================================================================

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
