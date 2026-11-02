import type { PageDef } from "@/content/v7/types";
import { SITE_CONFIG } from "@/lib/constants";
import { absUrl, type L3 } from "@/lib/v7-routes";
import { pageUpdated } from "@/lib/v7-updated";
import type { Crumb } from "./Breadcrumbs";

const ORG = `${SITE_CONFIG.url}/#organization`;
const PERSON = `${SITE_CONFIG.url}/#person`;
const SITE = `${SITE_CONFIG.url}/#website`;
/** Raster logo on a plain porcelain background (public/img/v7/logo-jsonld.png). */
const LOGO = { url: `${SITE_CONFIG.url}/img/v7/logo-jsonld.png`, width: 1400, height: 400 };

const ORG_DESC: Record<L3, string> = {
  de: "OpSolid ist eine unabhängige Beratung für KI-Automatisierung. Wir finden mit Unternehmen die Abläufe, bei denen sich KI und Automatisierung lohnen, bauen die erste Lösung zum Festpreis und bieten KI-Schulungen an. Sitz in Arnsberg (NRW).",
  en: "OpSolid is an independent AI automation consultancy. With companies, we find the workflows where AI and automation pay off, build the first solution at a fixed price and offer AI training. Based in Arnsberg, Germany.",
  tr: "OpSolid, bağımsız bir YZ otomasyonu danışmanlığıdır. Şirketlerle birlikte yapay zekâ ve otomasyonun işe yaradığı süreçleri bulur, ilk çözümü sabit fiyatla kurar ve YZ eğitimleri sunar. Merkezi Almanya'nın Arnsberg şehrindedir.",
};
// Same wording as the footer trademark line (content trademarkText) and the About page section.
const DISAMBIG: Record<L3, string> = {
  de: "OpSolid ist eine Beratung für KI-Automatisierung aus Arnsberg. OpSolid ist nicht TopSolid (CAD/CAM-Software) und steht in keiner Verbindung dazu.",
  en: "OpSolid is an AI automation consultancy based in Arnsberg, Germany. It is not TopSolid (CAD/CAM software) and has no connection to it.",
  tr: "OpSolid, Arnsberg merkezli bir yapay zeka otomasyonu danışmanlığıdır. OpSolid, TopSolid (CAD/CAM yazılımı) ile ilgili değildir ve onunla bağlantısı yoktur.",
};
// The firm name of the sole proprietorship, as in the Impressum heading.
const LEGAL_NAME = "OpSolid, Inh. Hasan Dönmez";
// Only topics the site itself offers.
const KNOWS_ABOUT: Record<L3, string[]> = {
  de: ["KI-Automatisierung", "Prozessautomatisierung", "Microsoft 365 und Copilot", "KI-Assistenten für Telefon und Chat", "KI-Schulungen", "KI-Kompetenz nach Art. 4 KI-Verordnung"],
  en: ["AI automation", "Process automation", "Microsoft 365 and Copilot", "AI assistants for phone and chat", "AI training", "AI literacy under Article 4 of the EU AI Act"],
  tr: ["Yapay zeka otomasyonu", "Süreç otomasyonu", "Microsoft 365 ve Copilot", "Telefon ve sohbet için yapay zeka asistanları", "Yapay zeka eğitimleri", "AB Yapay Zeka Tüzüğü 4. madde kapsamında yapay zeka yetkinliği"],
};
const JOB: Record<L3, string> = {
  de: "Gründer von OpSolid, KI-Berater",
  en: "Founder of OpSolid, AI consultant",
  tr: "OpSolid kurucusu, YZ danışmanı",
};
// Same value as the Impressum (content impressum.sections.vatIdText); keep the two in step.
const VAT_ID = "DE462227107";
const AREA_SERVED = [
  { "@type": "Country", name: "Germany" },
  { "@type": "Country", name: "Austria" },
  { "@type": "Country", name: "Switzerland" },
  { "@type": "Country", name: "Türkiye" },
];

const PAGE_KIND: Partial<Record<PageDef["key"], string>> = { ueber: "AboutPage", kontakt: "ContactPage", blog: "CollectionPage" };

function offer(o: { name?: string; price: number; from?: boolean }) {
  return {
    "@type": "Offer",
    ...(o.name ? { name: o.name } : {}),
    priceCurrency: "EUR",
    ...(o.from ? {} : { price: o.price }),
    eligibleCustomerType: "https://schema.org/Business",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: "EUR",
      ...(o.from ? { minPrice: o.price } : { price: o.price }),
      valueAddedTaxIncluded: false,
    },
  };
}

type Node = Record<string, unknown>;

/** The shared nodes every graph carries in full: the website, the organization and its founder. */
export function sharedNodes(locale: L3): Node[] {
  return [
    {
      "@type": "WebSite",
      "@id": SITE,
      url: `${SITE_CONFIG.url}/`,
      name: "OpSolid",
      alternateName: "OpSolid.de",
      inLanguage: ["de", "en", "tr"],
      publisher: { "@id": ORG },
    },
    {
      "@type": "ProfessionalService",
      "@id": ORG,
      name: SITE_CONFIG.name,
      legalName: LEGAL_NAME,
      alternateName: "OpSolid.de",
      url: SITE_CONFIG.url,
      logo: { "@type": "ImageObject", ...LOGO },
      image: LOGO.url,
      description: ORG_DESC[locale],
      disambiguatingDescription: DISAMBIG[locale],
      email: SITE_CONFIG.email,
      telephone: SITE_CONFIG.phone,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: SITE_CONFIG.email,
        telephone: SITE_CONFIG.phone,
        availableLanguage: ["de", "en", "tr"],
        url: absUrl("kontakt", locale),
      },
      knowsAbout: KNOWS_ABOUT[locale],
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address.street,
        postalCode: SITE_CONFIG.address.postalCode,
        addressLocality: SITE_CONFIG.address.city,
        addressRegion: "NRW",
        addressCountry: "DE",
      },
      vatID: VAT_ID,
      areaServed: AREA_SERVED,
      knowsLanguage: ["de", "en", "tr"],
      founder: { "@id": PERSON },
      // No Organization sameAs yet: add the company profile URLs here once they exist (LinkedIn page, Google Business Profile).
    },
    {
      "@type": "Person",
      "@id": PERSON,
      name: "Hasan Dönmez",
      jobTitle: JOB[locale],
      url: absUrl("ueber", locale),
      worksFor: { "@id": ORG },
      knowsLanguage: ["de", "en", "tr"],
      sameAs: ["https://www.linkedin.com/in/hasanhd/"],
    },
  ];
}

/**
 * WebPage (or a more specific kind) plus the BreadcrumbList that equals the visible breadcrumb. The home
 * pages show no breadcrumb, so they carry none (a one-item list would only repeat the page).
 */
export function webPageNodes(o: { key: PageDef["key"]; locale: L3; name: string; description: string; crumbs: Crumb[]; home?: boolean }): Node[] {
  const url = absUrl(o.key, o.locale);
  const crumbs = !o.home && o.crumbs.length > 1;
  return [
    {
      "@type": PAGE_KIND[o.key] ?? "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: o.name,
      description: o.description,
      inLanguage: o.locale,
      isPartOf: { "@id": SITE },
      about: { "@id": ORG },
      dateModified: pageUpdated(o.key),
      ...(crumbs ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    },
    ...(crumbs
      ? [
          {
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            itemListElement: o.crumbs.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              item: `${SITE_CONFIG.url}${c.path}`,
            })),
          },
        ]
      : []),
  ];
}

/** JSON for a <script type="application/ld+json">: "<" and the JS line separators are escaped, so no value can close the tag. */
export function ldJson(nodes: Node[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes })
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** Light entry for pages without a PageDef (journal list and posts): the caller passes the full node list. */
export function JsonLdGraph({ nodes }: { nodes: Node[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: ldJson(nodes) }}
    />
  );
}

/** One @graph per page. Breadcrumb equals the visible one; FAQPage only with a visible FAQ; offers only for published prices. */
export function JsonLd({ page, locale, crumbs }: { page: PageDef; locale: L3; crumbs: Crumb[] }) {
  const url = absUrl(page.key, locale);
  const home = page.key === "home";
  const graph: Node[] = [...sharedNodes(locale)];

  graph.push(...webPageNodes({ key: page.key, locale, name: page.meta.title, description: page.meta.description, crumbs, home }));

  const s = page.schema;
  if (s?.service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: s.service.name,
      description: s.service.description,
      serviceType: s.service.serviceType,
      provider: { "@id": ORG },
      areaServed: AREA_SERVED,
      url,
      ...(s.service.offers?.length ? { offers: s.service.offers.map(offer) } : {}),
    });
  }
  s?.courses?.forEach((c, i) => {
    graph.push({
      "@type": "Course",
      "@id": `${url}#course-${i + 1}`,
      name: c.name,
      description: c.description,
      provider: { "@id": ORG },
      inLanguage: ["de", "en"],
      courseMode: "online",
      ...(c.price !== undefined ? { offers: [offer({ price: c.price, from: c.from })] } : {}),
    });
  });
  if (s?.software) {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: s.software.name,
      description: s.software.description,
      operatingSystem: s.software.os.join(", "),
      applicationCategory: s.software.category,
      publisher: { "@id": ORG },
      url,
    });
  }

  if (page.faq) {
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

  return <JsonLdGraph nodes={graph} />;
}
