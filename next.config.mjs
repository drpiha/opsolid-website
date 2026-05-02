import { withSentryConfig } from "@sentry/nextjs";

// C3 — Security headers applied to all responses.
// CSP is report-only for now (no block) so a misconfigured directive doesn't
// break live cards; upgrade to enforce once the policy is validated in prod.
const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Report-only CSP — change to Content-Security-Policy to enforce.
    // Allows YouTube embeds (youtube.com, youtube-nocookie.com) and
    // Vercel Analytics (va.vercel-scripts.com).
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lean Docker image: only copies the runtime bundle, no node_modules.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Locale-conventional aliases for the privacy page so direct URL hits work
  // for users who type the German/Turkish convention (datenschutz / gizlilik).
  // Internal links should continue to use /[locale]/privacy.
  async redirects() {
    return [
      { source: "/de/datenschutz", destination: "/de/privacy", permanent: true },
      { source: "/tr/gizlilik", destination: "/tr/privacy", permanent: true },
      { source: "/datenschutz", destination: "/de/privacy", permanent: true },
      { source: "/gizlilik", destination: "/tr/privacy", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    // @napi-rs/canvas ships native .node binaries that webpack can't bundle.
    // Externalizing tells Next.js to leave it as a runtime require() in
    // server bundles, which is what we need for the QR rendering pipeline
    // (src/lib/qr/styled-server.ts, src/lib/qr/ai-art.ts).
    // jsqr is pure JS but lives next to canvas in our QR pipeline; keeping
    // them grouped here documents the dependency.
    serverComponentsExternalPackages: ["@napi-rs/canvas", "jsqr"],
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
