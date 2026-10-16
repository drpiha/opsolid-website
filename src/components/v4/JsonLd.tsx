import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import type { L3, PageDef } from "@/content/v4/types";

const ORG = `${SITE_CONFIG.url}/#organization`;
const PERSON = `${SITE_CONFIG.url}/#person`;
const SITE = `${SITE_CONFIG.url}/#website`;

const ORG_DESC: Record<L3, string> = {
  de: "OpSolid ist eine unabhängige Praxis für KI-Agents, Websites, Prozessautomatisierung und KI-Schulungen in Arnsberg.",
  en: "OpSolid is an independent practice for AI agents, websites, process automation and AI training, based in Arnsberg, Germany.",
  tr: "OpSolid, Arnsberg'de bağımsız bir pratiktir: YZ agent'ları, web siteleri, süreç otomasyonu ve YZ eğitimleri.",
};
const DISAMBIG = "OpSolid is an independent AI and automation practice. It is not TopSolid (CAD/CAM software).";
const JOB: Record<L3, string> = {
  de: "Automatisierungsspezialist und KI-Berater",
  en: "Automation specialist and AI consultant",
  tr: "Otomasyon uzmanı ve YZ danışmanı",
};

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
  kind?: "WebPage" | "ProfilePage" | "CollectionPage" | "ContactPage";
  extra?: Record<string, unknown>[];
}) {
  const url = `${SITE_CONFIG.url}/${locale}${slug ? `/${slug}` : ""}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "ProfessionalService",
      "@id": ORG,
      name: SITE_CONFIG.name,
      legalName: "OpSolid (Einzelunternehmen Hasan Dönmez)",
      url: SITE_CONFIG.url,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/icons/icon-512.png`, width: 512, height: 512 },
      image: `${SITE_CONFIG.url}/icons/icon-512.png`,
      description: ORG_DESC[locale],
      disambiguatingDescription: DISAMBIG,
      email: SITE_CONFIG.email,
      telephone: SITE_CONFIG.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_CONFIG.address.city,
        addressCountry: "DE",
      },
      areaServed: [
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Switzerland" },
      ],
      knowsLanguage: ["de", "en", "tr"],
      founder: { "@id": PERSON },
      sameAs: ["https://www.linkedin.com/company/opsolid/"],
    },
    {
      "@type": "Person",
      "@id": PERSON,
      name: "Hasan Dönmez",
      jobTitle: JOB[locale],
      url: `${SITE_CONFIG.url}/${locale}/ueber-mich`,
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
      areaServed: [
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Switzerland" },
      ],
      url,
      ...(page.service.offers?.length
        ? {
            offers: page.service.offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              priceCurrency: "EUR",
              ...(o.from
                ? { priceSpecification: { "@type": "PriceSpecification", priceCurrency: "EUR", minPrice: o.price } }
                : { price: o.price }),
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
