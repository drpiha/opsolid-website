import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ProblemBlock } from "@/components/sections/ProblemBlock";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AutomationCheckCard } from "@/components/sections/AutomationCheckCard";
import { UseCasesGrid } from "@/components/sections/UseCasesGrid";
import { TargetGroup } from "@/components/sections/TargetGroup";
import { Process } from "@/components/sections/Process";
import { TrustBlock } from "@/components/sections/TrustBlock";
import { HomepageFaq } from "@/components/sections/FaqAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeV2 } from "@/components/v2/home/HomeV2";
import { V2Shell } from "@/components/v2/V2Shell";
import { isPreviewV2 } from "@/lib/preview";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

const HOME_META: Record<string, { title: string; description: string }> = {
  de: {
    title: "KI & Automatisierung für Unternehmen",
    description:
      "OpSolid unterstützt mittelständische Unternehmen bei KI-Beratung, Prozessautomatisierung und digitalen Workflows. Jetzt kostenloses Erstgespräch anfragen.",
  },
  en: {
    title: "AI & Automation Consulting for SMEs",
    description:
      "OpSolid helps small and mid-sized businesses simplify manual tasks, Excel processes and internal workflows with AI and automation. Book a free discovery call.",
  },
  tr: {
    title: "KOBİ'ler için AI & Otomasyon Danışmanlığı",
    description:
      "OpSolid, KOBİ'lere manuel görevleri, Excel süreçlerini ve dahili iş akışlarını AI ve otomasyonla sadeleştirmede yardımcı olur. Ücretsiz görüşme planlayın.",
  },
};

export function generateMetadata({ params }: { params: { locale?: string } }): Metadata {
  const locale = isLocale(params?.locale) ? params!.locale! : DEFAULT_LOCALE;
  const m = HOME_META[locale] ?? HOME_META.de;
  const canonical = `https://opsolid.de/${locale}`;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical,
      languages: {
        de: "https://opsolid.de/de",
        en: "https://opsolid.de/en",
        tr: "https://opsolid.de/tr",
        "x-default": "https://opsolid.de/de",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: canonical,
      type: "website",
      locale,
    },
  };
}

/**
 * Homepage composition — consulting positioning ("AI & Automation
 * Consulting for SMEs", 2026-05).
 * Hero (with 3 benefit chips)
 *   → Problem (5 pain points)
 *   → Services (4 consulting pillars, anchor #services)
 *   → AutomationCheckCard (entry-engagement offer block)
 *   → UseCases (8 typical workflows)
 *   → TargetGroup (5 audience qualifiers)
 *   → Process (4 steps · refreshed copy)
 *   → TrustBlock (6 trust factors)
 *   → FAQ (7 questions)
 *   → FinalCTA (book a discovery call)
 *
 * The older Capabilities + Specimen sections are retired from this surface
 * but kept in the codebase — type-safe content keys stay populated so
 * unrelated pages that still import them continue to compile.
 */
export default function HomePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (isPreviewV2(searchParams)) {
    return (
      <V2Shell>
        <HomeJsonLd />
        <HomeV2 />
      </V2Shell>
    );
  }
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <ProblemBlock />
      <ServicesGrid />
      <AutomationCheckCard />
      <UseCasesGrid />
      <TargetGroup />
      <Process />
      <TrustBlock />
      <HomepageFaq />
      <FinalCTA />
    </>
  );
}
