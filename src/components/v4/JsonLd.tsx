import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import type { L3, PageDef } from "@/content/v4/types";

const ORG = `${SITE_CONFIG.url}/#organization`;
const PERSON = `${SITE_CONFIG.url}/#person`;
const SITE = `${SITE_CONFIG.url}/#website`;

const ORG_DESC: Record<L3, string> = {
  de: "OpSolid entwickelt für Unternehmen KI-Agents, Websites, Prozessautomatisierung, Microsoft-365-Automatisierung und interne Tools. Dazu kommen KI-Beratung und KI-Schulungen. Sitz in Arnsberg, Deutschland.",
  en: "OpSolid builds AI agents, websites, process automation, Microsoft 365 automation and internal tools for businesses, and offers AI consulting and AI training. Based in Arnsberg, Germany.",
  tr: "OpSolid, işletmeler için YZ agent'ları, web siteleri, süreç otomasyonu, Microsoft 365 otomasyonu ve dahili araçlar geliştirir; ayrıca YZ danışmanlığı ve YZ eğitimleri sunar. Merkezi Almanya'nın Arnsberg şehrindedir.",
};
const DISAMBIG = "OpSolid is an AI and automation service provider based in Arnsberg, Germany. It is not TopSolid (CAD/CAM software) and has no connection to it.";
const JOB: Record<L3, string> = {
  de: "Gründer von OpSolid, Automatisierungsspezialist und KI-Berater",
  en: "Founder of OpSolid, automation specialist and AI consultant",
  tr: "OpSolid kurucusu, otomasyon uzmanı ve YZ danışmanı",
};
// Same value as the Impressum (content impressum.sections.vatIdText); keep the two in step.
const VAT_ID = "DE462227107";
const UNIT_CODE = { month: "MON", year: "ANN" } as const;
const AREA_SERVED = [
  { "@type": "Country", name: "Germany" },
  { "@type": "Country", name: "Austria" },
  { "@type": "Country", name: "Switzerland" },
  { "@type": "Country", name: "Türkiye" },
];

type Crumb = { name: string; path: string };

export function JsonLdGraph({
  locale,
  slug,
  name,
  description,
  crumbs,
  page,
  kind = "WebPage",
  extra = [],
}: {
  locale: L3;
  slug: string;
  name: string;
  description: string;
  crumbs: Crumb[];
  page?: PageDef;
  kind?: "WebPage" | "AboutPage" | "ProfilePage" | "CollectionPage" | "ContactPage";
  extra?: Record<string, unknown>[];
}) {
  const url = `${SITE_CONFIG.url}/${locale}${slug ? `/${slug}` : ""}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "ProfessionalService",
      "@id": ORG,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/icons/icon-512.png`, width: 512, height: 512 },
      image: `${SITE_CONFIG.url}/icons/icon-512.png`,
      description: ORG_DESC[locale],
      disambiguatingDescription: DISAMBIG,
      email: SITE_CONFIG.email,
      telephone: SITE_CONFIG.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address.street,
        postalCode: SITE_CONFIG.address.postalCode,
        addressLocality: SITE_CONFIG.address.city,
        addressCountry: "DE",
      },
      vatID: VAT_ID,
      areaServed: AREA_SERVED,
      knowsLanguage: ["de", "en", "tr"],
      founder: { "@id": PERSON },
    },
    {
      "@type": "Person",
      "@id": PERSON,
      name: "Hasan Dönmez",
      jobTitle: JOB[locale],
      url: `${SITE_CONFIG.url}/${locale}/ueber-uns`,
      worksFor: { "@id": ORG },
      knowsLanguage: ["de", "en", "tr"],
      knowsAbout: ["AI agents", "Process automation", "Microsoft 365", "Internal tools", "AI training"],
      sameAs: ["https://www.linkedin.com/in/hasanhd/"],
    },
    {
      "@type": "WebSite",
      "@id": SITE,
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
      alternateName: "OpSolid.de",
      inLanguage: ["de", "en", "tr"],
      publisher: { "@id": ORG },
    },
    {
      "@type": kind,
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: locale,
      isPartOf: { "@id": SITE },
      about: { "@id": ORG },
      dateModified: SITE_UPDATED_ISO,
      breadcrumb: { "@id": `${url}#breadcrumb` },
      ...(kind === "ProfilePage" ? { mainEntity: { "@id": PERSON } } : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: `${SITE_CONFIG.url}${c.path}`,
      })),
    },
  ];

  if (page?.service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name,
      description,
      serviceType: page.service.type,
      provider: { "@id": ORG },
      areaServed: AREA_SERVED,
      url,
      ...(page.service.offers?.length
        ? {
            // Published prices are net (plus VAT); recurring ones are per month or year.
            offers: page.service.offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              priceCurrency: "EUR",
              ...(o.from ? {} : { price: o.price }),
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                priceCurrency: "EUR",
                ...(o.from ? { minPrice: o.price } : { price: o.price }),
                valueAddedTaxIncluded: false,
                ...(o.unit ? { referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: UNIT_CODE[o.unit] } } : {}),
              },
            })),
          }
        : {}),
    });
  }

  if (page?.faq) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faq.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
  }

  graph.push(...extra);

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
