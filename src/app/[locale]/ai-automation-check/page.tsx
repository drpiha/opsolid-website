import type { Metadata } from "next";
import { AIAutomationCheck } from "./AIAutomationCheck";
import { AIAutomationCheckV2 } from "@/components/v2/ai-automation-check/AIAutomationCheckV2";
import { V2Shell } from "@/components/v2/V2Shell";
import { AacJsonLd } from "@/components/seo/AacJsonLd";
import { isPreviewV2 } from "@/lib/preview";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

type Params = { locale?: string };

const META: Record<string, { title: string; description: string }> = {
  de: {
    title: "AI & Automation Check für Unternehmen",
    description:
      "Identifizieren Sie konkrete Automatisierungspotenziale in Ihrem Unternehmen. OpSolid analysiert Prozesse und liefert einen umsetzbaren 30-Tage-Plan.",
  },
  en: {
    title: "AI & Automation Check for Businesses",
    description:
      "Identify concrete automation opportunities in your business. OpSolid maps processes and delivers an actionable 30-day plan.",
  },
  tr: {
    title: "İşletmeniz için AI & Automation Check",
    description:
      "Şirketinizdeki somut otomasyon fırsatlarını belirleyin. OpSolid süreçleri analiz eder ve uygulanabilir bir 30 günlük plan teslim eder.",
  },
};

export function generateMetadata({ params }: { params: Params }): Metadata {
  const locale = isLocale(params?.locale) ? params!.locale! : DEFAULT_LOCALE;
  const m = META[locale] ?? META.de;
  const canonical = `https://opsolid.de/${locale}/ai-automation-check`;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical,
      languages: {
        de: "https://opsolid.de/de/ai-automation-check",
        en: "https://opsolid.de/en/ai-automation-check",
        tr: "https://opsolid.de/tr/ai-automation-check",
        "x-default": "https://opsolid.de/de/ai-automation-check",
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

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (isPreviewV2(searchParams)) {
    return (
      <V2Shell>
        <AacJsonLd />
        <AIAutomationCheckV2 />
      </V2Shell>
    );
  }
  return (
    <>
      <AacJsonLd />
      <AIAutomationCheck />
    </>
  );
}
