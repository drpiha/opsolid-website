import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { OG_LOCALE, OG_SIZE, ogImage, pickLocale } from "@/lib/seo-v4";
import { absUrl, alternates, type L3, type PageKey } from "@/lib/v7-routes";

/**
 * The share card of a page: its own card with the page headline (src/app/og/[locale]/[...card]/route.tsx)
 * for the marketing pages and journal posts, the locale card for the legal pages.
 */
export function shareImage(locale: L3, key: PageKey, sub: string, alt: string) {
  if (key === "impressum" || key === "privacy") return ogImage(locale);
  return { url: `/og/${locale}/${key}${sub}.png`, ...OG_SIZE, alt };
}

/**
 * Metadata for a v7 marketing page: self-canonical public URL per locale (localized slugs, the German
 * home at "/"), reciprocal hreflang with x-default → German, Open Graph and Twitter cards.
 * `title` must NOT include the brand: the root layout template appends " | OpSolid"
 * (use `absoluteTitle` for the home pages, whose title starts with the brand).
 * `sub` is a child path under the page (blog posts: "/my-post").
 */
export function v7Metadata(
  rawLocale: string | undefined,
  key: PageKey,
  meta: { title: string; description: string },
  opts?: { sub?: string; absoluteTitle?: boolean; noindex?: boolean; ogType?: "website" | "article" },
): Metadata {
  const locale = pickLocale(rawLocale) as L3;
  const sub = opts?.sub ?? "";
  const canonical = absUrl(key, locale, sub);
  const others = (Object.keys(OG_LOCALE) as L3[]).filter((l) => l !== locale).map((l) => OG_LOCALE[l]);
  const image = shareImage(locale, key, sub, meta.title);
  return {
    title: opts?.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical, languages: alternates(key, sub) },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: opts?.ogType ?? "website",
      siteName: SITE_CONFIG.name,
      locale: OG_LOCALE[locale],
      alternateLocale: others,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [image.url] },
    // Legal pages stay out of the index, but their links (home, contact) are still followed.
    robots: opts?.noindex ? { index: false, follow: true } : undefined,
  };
}
