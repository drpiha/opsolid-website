// =============================================================================
// SEO alternates helper — canonical + hreflang for locale-prefixed routes.
//
// Mirrors the inline pattern the service pages already use (see leistungen),
// centralised so every page emits a consistent canonical + hreflang set and a
// share image. Only locales with translated content get hreflang entries; the
// German market is the x-default (Germany-first B2B positioning).
// =============================================================================

import type { Metadata } from "next";

const SITE = "https://opsolid.de";

/** Locales that actually have translated content (and therefore hreflang). */
const HREFLANG_LOCALES = ["de", "en", "tr"] as const;

/** x-default points at the German market homepage/route. */
const X_DEFAULT_LOCALE = "de";

/** Absolute canonical URL for a locale-prefixed route. */
function canonicalFor(locale: string, path: string): string {
  const loc = (HREFLANG_LOCALES as readonly string[]).includes(locale)
    ? locale
    : X_DEFAULT_LOCALE;
  return `${SITE}/${loc}${path}`;
}

/**
 * Build canonical + hreflang alternates for a locale-prefixed route.
 *
 * @param locale requested locale (any string; non-content locales fall back)
 * @param path   route after the locale segment, e.g. "/blog" or "" for home
 */
export function localeAlternates(
  locale: string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of HREFLANG_LOCALES) languages[l] = `${SITE}/${l}${path}`;
  languages["x-default"] = `${SITE}/${X_DEFAULT_LOCALE}${path}`;

  return { canonical: canonicalFor(locale, path), languages };
}

/** Brand share image — the root opengraph-image route, resolved via metadataBase. */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "OpSolid — Practical Automation & AI Systems for Business Operations",
} as const;

/**
 * Full page metadata: title/description + canonical/hreflang + a complete
 * openGraph/twitter block (incl. the share image).
 *
 * Next.js REPLACES `openGraph`/`twitter` at the deepest segment that defines
 * them — a page that sets its own openGraph drops the layout's siteName/images.
 * So every page must carry the share image itself; this helper guarantees it
 * (and a consistent canonical + hreflang set) in one call.
 */
export function pageMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const canonical = canonicalFor(opts.locale, opts.path);
  const ogTitle = opts.ogTitle ?? opts.title;
  const ogDescription = opts.ogDescription ?? opts.description;
  return {
    title: opts.title,
    description: opts.description,
    alternates: localeAlternates(opts.locale, opts.path),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "OpSolid",
      type: "website",
      locale: opts.locale,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [OG_IMAGE.url],
    },
  };
}
