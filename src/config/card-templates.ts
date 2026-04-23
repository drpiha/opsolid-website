// =============================================================================
// OpSolid — Digital Business Card (DBC) Templates
//
// Source of truth for the template catalog. Numbered 1..N so customers can
// reference a design by its number ("Ich möchte Design #03"). The matching
// React component lives under src/components/cards/templates/<componentKey>.tsx
// and the thumbnail at /images/templates/card-<id>.png.
//
// Stripe Price IDs below are from the TEST account (see scripts/setup-stripe.ts).
// When flipping to LIVE mode, re-run the setup script with the LIVE secret key
// to create a parallel set of products + prices, then replace the IDs here.
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
  oneTimeCents: number;
  yearlyCents: number | null;
  stripeOneTimePriceId?: string;
  stripeYearlyPriceId?: string;
  isActive: boolean;
  sortOrder: number;
}

export const cardTemplates: readonly CardTemplateDef[] = [
  // Pricing rationale (2026-04-23): matches the lowest credible tier in the
  // DBC market while staying viable in TR at the EUR/TRY ~38 rate.
  // Comparison (yearly): Lemontaps ~€72, Blinq Pro ~€66, Popl Pro ~€47.
  // We sit below all of them; one-time is rare in this category, so it's
  // priced as the "own forever" anchor above the yearly.
  {
    id: 1,
    slug: "minimal-mono",
    name: "Minimal Mono",
    sectorHint: "general",
    componentKey: "Template01",
    previewPath: "/images/templates/card-01.png",
    oneTimeCents: 2900, // €29 (~1.100 TL)
    yearlyCents: 1900, // €19 / year (~720 TL)
    stripeOneTimePriceId: "price_1TPLaH25H593hnObCutXteCI",
    stripeYearlyPriceId: "price_1TPLaI25H593hnObLjPVh9M4",
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
    oneTimeCents: 3900, // €39
    yearlyCents: 2400, // €24 / year
    stripeOneTimePriceId: "price_1TPLaI25H593hnObqLsPQUku",
    stripeYearlyPriceId: "price_1TPLaJ25H593hnObGTW9aPBC",
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
    oneTimeCents: 4900, // €49  (premium — real-estate buyer)
    yearlyCents: 2900, // €29 / year
    stripeOneTimePriceId: "price_1TPLaJ25H593hnObjNY6xDfE",
    stripeYearlyPriceId: "price_1TPLaK25H593hnObLsTVic9j",
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
    oneTimeCents: 3900, // €39
    yearlyCents: 2400,
    stripeOneTimePriceId: "price_1TPLaK25H593hnObcYJKTL3X",
    stripeYearlyPriceId: "price_1TPLaL25H593hnOb31kNJvFq",
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
    oneTimeCents: 3900, // €39
    yearlyCents: 2400,
    stripeOneTimePriceId: "price_1TPLaL25H593hnObS0T81ycc",
    stripeYearlyPriceId: "price_1TPLaM25H593hnObdoEQvkvU",
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
