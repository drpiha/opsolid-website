// =============================================================================
// OpSolid — Digital Business Card (DBC) Templates
//
// Source of truth for the template catalog. Numbered 1..N so customers can
// reference a design by its number ("Ich möchte Design #03"). The matching
// React component lives under src/components/cards/templates/<componentKey>.tsx
// and the thumbnail at /images/templates/card-<id>.png.
//
// Three billing modes per template:
//   - monthly (recurring)     — lowest-friction entry
//   - yearly  (recurring)     — ~35% discount vs monthly, the "sweet spot"
//   - one-time (lifetime)     — pricey anchor, rare in market
//
// Stripe Price IDs are populated by scripts/setup-stripe.ts. Re-run it with
// the LIVE secret key to get a parallel set for production.
// =============================================================================

export interface CardTemplateDef {
  id: number;
  slug: string;
  name: string;
  sectorHint:
    | "general"
    | "realEstate"
    | "salon"
    | "restaurant"
    | "creator"
    | "clinic"
    | "freelancer";
  componentKey:
    | "Template01"
    | "Template02"
    | "Template03"
    | "Template04"
    | "Template05";
  previewPath: string;
  /** One-time "lifetime" purchase — no renewal. */
  oneTimeCents: number;
  /** Monthly subscription (EUR). Null = not offered for this template. */
  monthlyCents: number | null;
  /** Yearly subscription (EUR). Null = not offered. */
  yearlyCents: number | null;
  stripeOneTimePriceId?: string;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  isActive: boolean;
  sortOrder: number;
}

export const cardTemplates: readonly CardTemplateDef[] = [
  // Pricing rationale (2026-04-23 rev2):
  //
  // Market floor references (researched 2026-04-23):
  //   TR: vTAG ₺79/ay Standard (~€2), vTAG Pro+ ₺129/ay (~€3.4), Digi Card
  //       Starter ₺299/ay (~€7.7). Physical NFC ₺500-600 one-time.
  //   Global: Blinq Premium $5.89/mo, Lemontaps €6/mo, Popl ~€60/yr teams.
  //
  // We match Blinq / Lemontaps on monthly (global market floor) and sit
  // ~40% below them on yearly — since our annual price anchors long-term.
  // One-time is deliberately priced ~1.5× yearly so subscription is the
  // obvious default.
  {
    id: 1,
    slug: "minimal-mono",
    name: "Minimal Mono",
    sectorHint: "general",
    componentKey: "Template01",
    previewPath: "/images/templates/card-01.png",
    monthlyCents: 500, // €5 / month  (~₺190)
    yearlyCents: 3900, // €39 / year (~₺1.480) — 35% off monthly
    oneTimeCents: 7900, // €79 lifetime (~₺3.000)
    stripeOneTimePriceId: "price_1TPLkX25H593hnObbB3cDjRZ",
    stripeMonthlyPriceId: "price_1TPLkX25H593hnObFsuYfkwG",
    stripeYearlyPriceId: "price_1TPLkX25H593hnObhWn3obfm",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    slug: "warm-serif",
    name: "Warm Serif",
    sectorHint: "creator",
    componentKey: "Template02",
    previewPath: "/images/templates/card-02.png",
    monthlyCents: 600, // €6 / month
    yearlyCents: 4900, // €49 / year
    oneTimeCents: 9900, // €99 lifetime
    stripeOneTimePriceId: "price_1TPLkY25H593hnObMOVYfp1B",
    stripeMonthlyPriceId: "price_1TPLkY25H593hnObd5Q7nkuA",
    stripeYearlyPriceId: "price_1TPLkY25H593hnObrtlEaUmW",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    slug: "estate-brass",
    name: "Estate Brass",
    sectorHint: "realEstate",
    componentKey: "Template03",
    previewPath: "/images/templates/card-03.png",
    monthlyCents: 700, // €7 / month   (premium — real-estate buyer)
    yearlyCents: 5900, // €59 / year
    oneTimeCents: 12900, // €129 lifetime
    stripeOneTimePriceId: "price_1TPLkZ25H593hnObjnIT7vxk",
    stripeMonthlyPriceId: "price_1TPLkZ25H593hnObZUdrkDxI",
    stripeYearlyPriceId: "price_1TPLkZ25H593hnOb6qOoofB1",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    slug: "atelier-clean",
    name: "Atelier Clean",
    sectorHint: "salon",
    componentKey: "Template04",
    previewPath: "/images/templates/card-04.png",
    monthlyCents: 600,
    yearlyCents: 4900,
    oneTimeCents: 9900,
    stripeOneTimePriceId: "price_1TPLka25H593hnObJmK5wAeF",
    stripeMonthlyPriceId: "price_1TPLka25H593hnObfAyNuZ0d",
    stripeYearlyPriceId: "price_1TPLka25H593hnObXq3wHwq0",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 5,
    slug: "restaurant-noir",
    name: "Restaurant Noir",
    sectorHint: "restaurant",
    componentKey: "Template05",
    previewPath: "/images/templates/card-05.png",
    monthlyCents: 600,
    yearlyCents: 4900,
    oneTimeCents: 9900,
    stripeOneTimePriceId: "price_1TPLkb25H593hnObAB5WaiHB",
    stripeMonthlyPriceId: "price_1TPLkb25H593hnObuLNC7kEz",
    stripeYearlyPriceId: "price_1TPLkb25H593hnOb6U92Tq4k",
    isActive: true,
    sortOrder: 5,
  },
];

export function getTemplateById(id: number): CardTemplateDef | undefined {
  return cardTemplates.find((t) => t.id === id);
}

export function getActiveTemplates(): CardTemplateDef[] {
  return cardTemplates
    .filter((t) => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Format a cent amount as a localized euro string (e.g. 4900 -> "€49,00" in de).
 */
export function formatEuro(cents: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
