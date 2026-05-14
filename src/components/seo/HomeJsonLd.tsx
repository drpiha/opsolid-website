"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * Homepage structured data — ProfessionalService + FAQPage.
 * Emitted as a single <script type="application/ld+json"> so search engines
 * pick up both records in one request. Rendered client-side because it
 * depends on the active locale's FAQ copy.
 */
export function HomeJsonLd() {
  const { t, locale } = useLocale();
  const faq = t.v2.home.faq;
  const trust = t.v2.home.trust;

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: "OpSolid Consulting",
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    description: SITE_CONFIG.description,
    areaServed: [
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      postalCode: SITE_CONFIG.address.postalCode,
      addressLocality: SITE_CONFIG.address.city,
      addressCountry: "DE",
    },
    serviceType: [
      "AI consulting",
      "Process automation",
      "Microsoft 365 automation",
      "Workflow automation",
      "Internal tools development",
      "AI training",
    ],
    sameAs: [
      "https://www.linkedin.com/company/opsolid/",
    ],
    knowsAbout: trust.items.map((it) => it.title),
    inLanguage: locale,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_CONFIG.url}/${locale}#faq`,
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Server-side JSON.stringify avoids React's escaping noise inside script.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([professionalService, faqPage]),
      }}
    />
  );
}
