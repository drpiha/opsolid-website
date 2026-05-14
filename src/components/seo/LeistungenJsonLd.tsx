"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * /leistungen structured data — Service catalog + FAQPage + Breadcrumb.
 * Lists the five consulting service areas as an OfferCatalog of Services
 * provided by ProfessionalService.
 */
export function LeistungenJsonLd() {
  const { t, locale } = useLocale();
  const l = t.v2.leistungen;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}/${locale}/leistungen#service`,
    serviceType: "AI & Automation Consulting",
    name: l.hero.title.pre + l.hero.title.italic + l.hero.title.post,
    description: l.hero.lead,
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: l.cards.headline,
      itemListElement: l.cards.items.map((card, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: card.title,
          description: card.body,
          url: `${SITE_CONFIG.url}/${locale}/${card.slug}`,
        },
      })),
    },
    inLanguage: locale,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_CONFIG.url}/${locale}/leistungen#faq`,
    mainEntity: l.faq.items.map((item) => ({
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
