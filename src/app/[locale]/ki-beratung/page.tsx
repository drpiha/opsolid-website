import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { KiBeratungV2 } from "@/components/v2/ki-beratung/KiBeratungV2";
import { isPreviewV2 } from "@/lib/preview";
import { content as en } from "@/content/en";
import { content as de } from "@/content/de";
import { content as tr } from "@/content/tr";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

type Params = { locale?: string };

// V2 sections wired (M3.2)
const SLUG = "ki-beratung";

const META_BY_LOCALE = {
  de: de.v2.services.kiBeratung.meta,
  en: en.v2.services.kiBeratung.meta,
  tr: tr.v2.services.kiBeratung.meta,
} as const;

export function generateMetadata({ params }: { params: Params }): Metadata {
  const locale = isLocale(params?.locale) ? params!.locale! : DEFAULT_LOCALE;
  const m =
    locale === "de" || locale === "en" || locale === "tr"
      ? META_BY_LOCALE[locale]
      : META_BY_LOCALE.en;
  const canonical = `https://opsolid.de/${locale}/${SLUG}`;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical,
      languages: {
        de: `https://opsolid.de/de/${SLUG}`,
        en: `https://opsolid.de/en/${SLUG}`,
        tr: `https://opsolid.de/tr/${SLUG}`,
        "x-default": `https://opsolid.de/de/${SLUG}`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: canonical,
      type: "website",
      locale,
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.description },
  };
}

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (isPreviewV2(searchParams)) {
    return (
      <>
        <ServiceJsonLd serviceKey="kiBeratung" />
        <KiBeratungV2 />
      </>
    );
  }
  return (
    <>
      <ServiceJsonLd serviceKey="kiBeratung" />
      <ServicePage serviceKey="kiBeratung" />
    </>
  );
}
