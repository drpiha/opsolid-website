"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";
import type { Content } from "@/content/en";

type ServiceKey =
  | "kiBeratung"
  | "prozessautomatisierung"
  | "microsoft365"
  | "interneTools"
  | "kiSchulungen";

type ServiceContent = Content["v2"]["services"][ServiceKey];

/**
 * Per-service-page structured data: Service + FAQPage + BreadcrumbList.
 * Reused by all five /leistungen sub-pages via the `serviceKey` prop.
 */
export function ServiceJsonLd({ serviceKey }: { serviceKey: ServiceKey }) {
  const { t, locale } = useLocale();
  const s = t.v2.services[serviceKey] as ServiceContent;

  const url = `${SITE_CONFIG.url}/${locale}/${s.slug}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    serviceType: "AI & Automation Consulting",
    name: s.hero.title.pre + s.hero.title.italic + s.hero.title.post,
    description: s.hero.lead,
    provider: {
      "@type": "ProfessionalService",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: [
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
    ],
    url,
    inLanguage: locale,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: s.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_CONFIG.url}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Leistungen",
        item: `${SITE_CONFIG.url}/${locale}/leistungen`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: s.hero.metaChip || s.slug,
        item: url,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([service, faqPage, breadcrumb]),
      }}
    />
  );
}
