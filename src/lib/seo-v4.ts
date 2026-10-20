import type { Metadata } from "next";
import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import type { L3 } from "@/content/v4/types";

/** Narrow any route param to one of the three public locales (others render EN). */
export function pickLocale(raw: string | undefined): L3 {
  const l = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return l === "de" || l === "tr" ? l : "en";
}

export const OG_LOCALE: Record<L3, string> = { de: "de_DE", en: "en_US", tr: "tr_TR" };

/** Share card (src/lib/og-card.tsx) size and per-locale tagline: the home-page title of each locale. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TAGLINE: Record<L3, string> = {
  de: "KI-Agenten, Websites und Automatisierung",
  en: "AI agents, websites and automation",
  tr: "YZ asistanları, web siteleri ve otomasyon",
};
/** Share-card claim: the home hero headline of each locale. */
export const OG_CLAIM: Record<L3, string> = {
  de: "Weniger Routine. Mehr Zeit für Ihre Kunden.",
  en: "Less routine. More time for your customers.",
  tr: "Daha az rutin. Müşterilere daha çok zaman.",
};
export function ogAlt(locale: L3): string {
  return `OpSolid · ${OG_TAGLINE[locale]} · ${OG_CLAIM[locale]}`;
}

/** The per-locale v4 share card (src/app/[locale]/opengraph-image.tsx); metadataBase makes the URL absolute. */
export function ogImage(locale: L3) {
  return { url: `/${locale}/opengraph-image`, ...OG_SIZE, alt: ogAlt(locale) };
}

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
      images: [ogImage(locale)],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [ogImage(locale).url] },
    robots: opts?.noindex ? { index: false, follow: false } : undefined,
  };
}

export { SITE_UPDATED_ISO };
