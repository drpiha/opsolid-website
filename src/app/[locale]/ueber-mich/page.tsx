import type { Metadata } from "next";
import { AboutPage } from "@/app/[locale]/about/AboutPage";
import { AboutV2 } from "@/components/v2/about/AboutV2";
import { V2Shell } from "@/components/v2/V2Shell";
import { isPreviewV2 } from "@/lib/preview";
import { content as en } from "@/content/en";
import { content as de } from "@/content/de";
import { content as tr } from "@/content/tr";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

type Params = { locale?: string };

const META_BY_LOCALE = {
  de: de.v2.about.meta,
  en: en.v2.about.meta,
  tr: tr.v2.about.meta,
} as const;

export function generateMetadata({ params }: { params: Params }): Metadata {
  const locale = isLocale(params?.locale) ? params!.locale! : DEFAULT_LOCALE;
  const m =
    locale === "de" || locale === "en" || locale === "tr"
      ? META_BY_LOCALE[locale]
      : META_BY_LOCALE.en;
  const canonical = `https://opsolid.de/${locale}/ueber-mich`;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical,
      languages: {
        de: "https://opsolid.de/de/ueber-mich",
        en: "https://opsolid.de/en/ueber-mich",
        tr: "https://opsolid.de/tr/ueber-mich",
        "x-default": "https://opsolid.de/de/ueber-mich",
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
      <V2Shell>
        <AboutV2 />
      </V2Shell>
    );
  }
  return <AboutPage />;
}
