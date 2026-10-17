import type { Metadata } from "next";
import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import type { L3 } from "@/content/v4/types";

/** Narrow any route param to one of the three public locales (others render EN). */
export function pickLocale(raw: string | undefined): L3 {
  const l = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return l === "de" || l === "tr" ? l : "en";
}

const OG_LOCALE: Record<L3, string> = { de: "de_DE", en: "en_US", tr: "tr_TR" };

/**
 * Self-canonical per locale, reciprocal hreflang with x-default → /de.
 * `title` must NOT include the brand: the root layout template appends
 * " | OpSolid" (absolute titles bypass it).
 */
export function pageMetadata(rawLocale: string | undefined, slug: string, meta: { title: string; description: string }, opts?: { absoluteTitle?: boolean; noindex?: boolean }): Metadata {
  const locale = pickLocale(rawLocale);
  const path = slug ? `/${slug}` : "";
  const abs = (l: string) => `${SITE_CONFIG.url}/${l}${path}`;
  const canonical = abs(locale);
  return {
    title: opts?.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: { de: abs("de"), en: abs("en"), tr: abs("tr"), "x-default": abs("de") },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
      siteName: SITE_CONFIG.name,
      locale: OG_LOCALE[locale],
      alternateLocale: (Object.keys(OG_LOCALE) as L3[]).filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    robots: opts?.noindex ? { index: false, follow: false } : undefined,
  };
}

export { SITE_UPDATED_ISO };
