// =============================================================================
// OpSolid — Digital Business Card (DBC) Templates
//
// Source of truth for the template catalog. Numbered 1..N so customers can
// reference a design by its number ("Ich möchte Design #03"). The matching
// React component lives under src/components/cards/templates/<componentKey>.tsx
// and the thumbnail at /images/templates/card-<id>.png.
//
// When adding a new template: (1) add an entry here with the next id and
// sortOrder, (2) create the React component, (3) drop the thumbnail PNG at
// public/images/templates/, (4) run the seed script to sync the DB copy.
// =============================================================================

export interface CardTemplateDef {
  id: number;
  slug: string;
  name: string;
  /** One of the supported sector hints — controls the default copy/colors on the form. */
  sectorHint:
    | "general"
    | "realEstate"
    | "salon"
    | "restaurant"
    | "creator"
    | "clinic"
    | "freelancer";
  /** Must match a key in src/components/cards/templates/index.ts */
  componentKey:
    | "Template01"
    | "Template02"
    | "Template03"
    | "Template04"
    | "Template05";
  previewPath: string;
  /** Price in EUR cents for the one-time purchase option. */
  oneTimeCents: number;
  /** Price in EUR cents for the yearly subscription option (null = not offered). */
  yearlyCents: number | null;
  /**
   * Stripe Price IDs — create these in the Stripe dashboard and paste here.
   * Until filled, the backend falls back to `price_data` inline pricing
   * (useful during dev, but a real Price ID is cleaner for reporting).
   */
  stripeOneTimePriceId?: string;
  stripeYearlyPriceId?: string;
  isActive: boolean;
  sortOrder: number;
}

export const cardTemplates: readonly CardTemplateDef[] = [
  {
    id: 1,
    slug: "minimal-mono",
    name: "Minimal Mono",
    sectorHint: "general",
    componentKey: "Template01",
    previewPath: "/images/templates/card-01.png",
    oneTimeCents: 4900, // €49
    yearlyCents: 2900, // €29/year
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
    oneTimeCents: 5900, // €59
    yearlyCents: 3900,
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
    oneTimeCents: 6900, // €69
    yearlyCents: 4900,
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
    oneTimeCents: 5900, // €59
    yearlyCents: 3900,
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
    oneTimeCents: 6900, // €69
    yearlyCents: 4900,
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
