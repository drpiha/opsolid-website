import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { V4Sync } from "@/components/layout/V4Sync";
import { ContentGate } from "@/components/layout/ContentGate";
import { LOCALES, type Locale, isLocale } from "@/lib/i18n";
import { SITE_STR } from "@/content/v7/site";
import { SiteHeader } from "@/components/v7/shell/SiteHeader";
import { SiteFooter } from "@/components/v7/shell/SiteFooter";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  tr: "tr_TR",
  es: "es_ES",
  it: "it_IT",
  fr: "fr_FR",
  ar: "ar_AE",
};

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "en";
  return {
    openGraph: {
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    // canonical/hreflang are deliberately NOT set in this layout: it wraps every
    // /[locale] route, so a canonical here forces all sub-pages (blog posts,
    // service pages) to canonicalize to the locale homepage and silently
    // de-indexes them. Each page.tsx sets its own alternates instead.
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const h = headers();
  // The URL the browser shows (middleware sets x-public-path); x-pathname is the internal path.
  const publicPath = h.get("x-public-path") ?? h.get("x-pathname") ?? "/";
  const raw = h.get("x-opsolid-suggest");
  const suggest = raw === "en" || raw === "tr" ? raw : "";
  const l3 = params.locale === "de" || params.locale === "tr" ? params.locale : "en";
  const skip = SITE_STR[l3].skip;

  return (
    <ClientProviders initialLocale={params.locale}>
      <V4Sync />
      <a href="#main" className="v7-skip">
        {skip}
      </a>
      {/* Marketing paths get the server-rendered Werkstatt shell as a slot; app surfaces keep their own chrome. */}
      <Header marketing={<SiteHeader locale={l3} publicPath={publicPath} suggest={suggest} />} />
      <main id="main" className="flex-1 relative z-[2]">
        <ContentGate>
          {children}
        </ContentGate>
      </main>
      <Footer marketing={<SiteFooter locale={l3} publicPath={publicPath} />} />
    </ClientProviders>
  );
}
