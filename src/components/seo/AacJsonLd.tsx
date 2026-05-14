"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * /ai-automation-check structured data — Service + FAQPage + Breadcrumb.
 * "Service" with `provider: ProfessionalService` is the closest schema.org
 * fit for a consulting offer with no fixed price (kept as offers with
 * "PriceSpecification" hidden behind `priceRange: "P.O.A."`).
 */
export function AacJsonLd() {
  const { t, locale } = useLocale();
  const p = t.v2.aiAutomationCheckPage;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}/${locale}/ai-automation-check#service`,
    serviceType: "AI & Automation Consulting",
    name: "AI & Automation Check",
    description: p.hero.lead,
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
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/${locale}/ai-automation-check`,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: p.deliverables.headline,
      itemListElement: p.deliverables.items.map((d, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: d },
      })),
    },
    inLanguage: locale,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_CONFIG.url}/${locale}/ai-automation-check#faq`,
    mainEntity: p.faq.items.map((item) => ({
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
        name: "AI & Automation Check",
        item: `${SITE_CONFIG.url}/${locale}/ai-automation-check`,
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
