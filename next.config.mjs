import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lean Docker image: only copies the runtime bundle, no node_modules.
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

// -----------------------------------------------------------------------------
// Sentry — only enable source-map upload when auth + org + project are present.
// Missing envs must not crash the build; Sentry no-ops gracefully.
// -----------------------------------------------------------------------------
const sentryBuildOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Disable source-map upload entirely when auth token is missing (dev /
  // operators who don't run Sentry).
  disableLogger: true,
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
  // Hide unhandled-route source maps from public chunks.
  hideSourceMaps: true,
  widenClientFileUpload: true,
  tunnelRoute: undefined,
};

export default withSentryConfig(nextConfig, sentryBuildOptions);
