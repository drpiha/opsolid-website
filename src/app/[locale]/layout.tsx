import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AmbientBackdrop } from "@/components/visual/AmbientBackdrop";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { LOCALES, type Locale, isLocale } from "@/lib/i18n";

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
      siteName: "OpSolid",
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      // Default share image for /[locale] pages that don't define their own
      // openGraph (legal, dashboard, …). Pages that DO set openGraph replace
      // this whole block, so those carry the image via pageMetadata() instead.
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "OpSolid — Practical Automation & AI Systems for Business Operations",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/opengraph-image"],
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

  return (
    <ClientProviders initialLocale={params.locale}>
      <LenisProvider>
        <AmbientBackdrop />
        <Header />
        <main className="flex-1 relative z-[1]">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </LenisProvider>
    </ClientProviders>
  );
}
