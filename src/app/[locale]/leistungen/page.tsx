import type { Metadata } from "next";
import { LeistungenPage } from "./LeistungenPage";
import { LeistungenJsonLd } from "@/components/seo/LeistungenJsonLd";
import { content as en } from "@/content/en";
import { content as de } from "@/content/de";
import { content as tr } from "@/content/tr";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

type Params = { locale?: string };

const META_BY_LOCALE = {
  de: de.v2.leistungen.meta,
  en: en.v2.leistungen.meta,
  tr: tr.v2.leistungen.meta,
} as const;

export function generateMetadata({ params }: { params: Params }): Metadata {
  const locale = isLocale(params?.locale) ? params!.locale! : DEFAULT_LOCALE;
  const m =
    locale === "de" || locale === "en" || locale === "tr"
      ? META_BY_LOCALE[locale]
      : META_BY_LOCALE.en;
  const canonical = `https://opsolid.de/${locale}/leistungen`;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical,
      languages: {
        de: "https://opsolid.de/de/leistungen",
        en: "https://opsolid.de/en/leistungen",
        tr: "https://opsolid.de/tr/leistungen",
        "x-default": "https://opsolid.de/de/leistungen",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: canonical,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
  };
}

export default function Page() {
  return (
    <>
      <LeistungenJsonLd />
      <LeistungenPage />
    </>
  );
}
