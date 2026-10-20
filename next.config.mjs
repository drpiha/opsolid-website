import { withSentryConfig } from "@sentry/nextjs";

// C3 — Security headers applied to all responses.
// CSP here is report-only (no block) so a misconfigured directive doesn't
// break live cards on the app surfaces. The v4 marketing documents get an
// enforced policy from src/middleware.ts (V4_CSP).
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
    // Allows YouTube embeds (youtube.com, youtube-nocookie.com).
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: https://card.opsolid.de",
      "media-src 'self' https: https://card.opsolid.de",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

// Public files without a content hash in their name: fresh for a day, then
// served stale while revalidating for a week, so an updated screenshot or
// icon shows up within a day. (/_next/static and next/font files are already
// immutable for a year.)
const publicAssetCache = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lean Docker image: only copies the runtime bundle, no node_modules.
  output: "standalone",
  productionBrowserSourceMaps: false,
  // Don't advertise the framework (X-Powered-By: Next.js).
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      { source: "/img/:path*", headers: publicAssetCache },
      // Hero video and posters (src/components/v4/HeroScene.tsx).
      { source: "/media/:path*", headers: publicAssetCache },
      { source: "/images/:path*", headers: publicAssetCache },
      { source: "/icons/:path*", headers: publicAssetCache },
      // Only image files: /blog/<slug> without a locale is a page redirect.
      { source: "/blog/:file([^/]+\\.(?:jpg|jpeg|png|webp|avif))", headers: publicAssetCache },
      { source: "/site.webmanifest", headers: publicAssetCache },
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
    // GHSA-2xp9-vwfh-vxw4: bypass server image optimization until the
    // framework upgrade is validated. Disabling AVIF output alone does not
    // stop AVIF input decoding. Images are served at their original size;
    // /_next/image must remain unavailable while this mitigation is active.
    unoptimized: true,
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
    //
    // nodemailer + resend + @sentry/nextjs are imported dynamically via
    // `await import(...)` inside email/notifications/Sentry helpers. The
    // Next.js standalone tracer does not follow dynamic specifiers, so
    // without this list the runtime image is missing the modules entirely —
    // every magic-link / notification email throws MODULE_NOT_FOUND that's
    // swallowed by silent .catch handlers (root cause for "magic link gelmedi").
    serverComponentsExternalPackages: [
      "@napi-rs/canvas",
      "jsqr",
      "nodemailer",
      "resend",
      "@sentry/nextjs",
    ],
  },
};

// -----------------------------------------------------------------------------
// Sentry — only enable source-map upload when auth + org + project are present.
// Unconfigured builds do not generate maps or call the Sentry build service.
// -----------------------------------------------------------------------------
const sentryUploadConfigured = Boolean(
  process.env.SENTRY_AUTH_TOKEN?.trim() &&
  process.env.SENTRY_ORG?.trim() &&
  process.env.SENTRY_PROJECT?.trim(),
);

const sentryBuildOptions = {
  silent: true,
  telemetry: false,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
  sourcemaps: {
    disable: !sentryUploadConfigured,
    // Keep maps useful to Sentry, but never copy them to the public image.
    deleteSourcemapsAfterUpload: true,
  },
  release: {
    create: sentryUploadConfigured,
    finalize: sentryUploadConfigured,
  },
  widenClientFileUpload: true,
  tunnelRoute: undefined,
};

export default withSentryConfig(nextConfig, sentryBuildOptions);
