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
    | "freelancer"
    | "lawyer"
    | "clinic"
    | "fitness"
    | "music"
    | "architecture"
    | "retail"
    | "hospitality"
    | "events"
    | "construction"
    | "tourism"
    | "corporate"
    | "tech"
    | "consultant";
  componentKey:
    | "Template01"
    | "Template02"
    | "Template03"
    | "Template04"
    | "Template05"
    | "SmartCard";
  /**
   * Optional default theme preset for this template (Phase 6). The preview
   * thumbnail and the order form's "Style preset" select use this to seed
   * the customer's choice. CSS-only via `data-theme` on the SmartCard root —
   * no DOM swap. See src/lib/cardThemes.ts for available presets.
   */
  themeKey?: "aurora" | "editorial" | "cinema";
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
    componentKey: "SmartCard",
    themeKey: "editorial",
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
    componentKey: "SmartCard",
    themeKey: "editorial",
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
    componentKey: "SmartCard",
    themeKey: "cinema",
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
    componentKey: "SmartCard",
    themeKey: "aurora",
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
    componentKey: "SmartCard",
    themeKey: "cinema",
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

  // ---------------------------------------------------------------------------
  // Sector-tailored SmartCard presets (IDs 6–20). Each entry reuses the
  // SmartCard component but ships a sector-specific preset (see card-sectors.ts)
  // so the customer-facing copy/icons read native to the trade. Stripe price
  // IDs are populated by `npm run setup-stripe` once these become live SKUs.
  // ---------------------------------------------------------------------------
  {
    id: 6,
    slug: "avukat-hukuk",
    name: "Anwalt & Kanzlei",
    sectorHint: "lawyer",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-06.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCko25H593hnObiEXja3cd",
    stripeMonthlyPriceId: "price_1TQCkp25H593hnObJzi7IuBx",
    stripeYearlyPriceId: "price_1TQCkp25H593hnObxBk5EL2T",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: 7,
    slug: "fotograf-kreatif",
    name: "Fotografie & Kreativ",
    sectorHint: "creator",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-07.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkq25H593hnObfKAsn6ab",
    stripeMonthlyPriceId: "price_1TQCkq25H593hnObArGlInUU",
    stripeYearlyPriceId: "price_1TQCkq25H593hnObRqBI275I",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: 8,
    slug: "doktor-klinik",
    name: "Arzt & Klinik",
    sectorHint: "clinic",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-08.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkr25H593hnObcKA69AzJ",
    stripeMonthlyPriceId: "price_1TQCkr25H593hnObDFkAwRiC",
    stripeYearlyPriceId: "price_1TQCks25H593hnOb5jdKOyHZ",
    isActive: true,
    sortOrder: 8,
  },
  {
    id: 9,
    slug: "fitness-trainer",
    name: "Fitness & Personal Training",
    sectorHint: "fitness",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-09.png",
    oneTimeCents: 7900,
    monthlyCents: 500,
    yearlyCents: 3900,
    stripeOneTimePriceId: "price_1TQCkt25H593hnObwXLeNaWf",
    stripeMonthlyPriceId: "price_1TQCkt25H593hnObrKTFeL96",
    stripeYearlyPriceId: "price_1TQCkt25H593hnObY2PMOEc7",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: 10,
    slug: "dj-muzik",
    name: "DJ & Musik",
    sectorHint: "music",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-10.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCku25H593hnObfaQu44rw",
    stripeMonthlyPriceId: "price_1TQCku25H593hnOb7aUEVBP3",
    stripeYearlyPriceId: "price_1TQCku25H593hnObxFlkUgCw",
    isActive: true,
    sortOrder: 10,
  },
  {
    id: 11,
    slug: "mimar-tasarim",
    name: "Architektur & Design",
    sectorHint: "architecture",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-11.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCkv25H593hnObzwNJ16rP",
    stripeMonthlyPriceId: "price_1TQCkv25H593hnOb5Adb6AOX",
    stripeYearlyPriceId: "price_1TQCkw25H593hnObpCVBGhGN",
    isActive: true,
    sortOrder: 11,
  },
  {
    id: 12,
    slug: "eticaret-butik",
    name: "E-Commerce & Boutique",
    sectorHint: "retail",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-12.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkw25H593hnObDZneJL2x",
    stripeMonthlyPriceId: "price_1TQCkx25H593hnOb6tQUsYud",
    stripeYearlyPriceId: "price_1TQCkx25H593hnOb4ecB4pYH",
    isActive: true,
    sortOrder: 12,
  },
  {
    id: 13,
    slug: "otel-konaklama",
    name: "Hotel & Hospitality",
    sectorHint: "hospitality",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-13.png",
    oneTimeCents: 14900,
    monthlyCents: 800,
    yearlyCents: 6900,
    stripeOneTimePriceId: "price_1TQCky25H593hnObgPizsdIE",
    stripeMonthlyPriceId: "price_1TQCky25H593hnObfKUmM1zs",
    stripeYearlyPriceId: "price_1TQCky25H593hnOb3FrAwQCN",
    isActive: true,
    sortOrder: 13,
  },
  {
    id: 14,
    slug: "etkinlik-dugun",
    name: "Event & Hochzeit",
    sectorHint: "events",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-14.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkz25H593hnObxNBuGryn",
    stripeMonthlyPriceId: "price_1TQCkz25H593hnObZD93zURb",
    stripeYearlyPriceId: "price_1TQCl025H593hnObjR85tF3A",
    isActive: true,
    sortOrder: 14,
  },
  {
    id: 15,
    slug: "insaat-muteahhit",
    name: "Bau & Handwerk",
    sectorHint: "construction",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-15.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCl025H593hnObBKBIRdxI",
    stripeMonthlyPriceId: "price_1TQCl025H593hnObMjeJRuv2",
    stripeYearlyPriceId: "price_1TQCl125H593hnObO1l4ELQH",
    isActive: true,
    sortOrder: 15,
  },
  {
    id: 16,
    slug: "turizm-seyahat",
    name: "Tourismus & Reise",
    sectorHint: "tourism",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-16.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl125H593hnObu26AAzHw",
    stripeMonthlyPriceId: "price_1TQCl225H593hnObMuchpegq",
    stripeYearlyPriceId: "price_1TQCl225H593hnOb79HRO35d",
    isActive: true,
    sortOrder: 16,
  },
  {
    id: 17,
    slug: "kurumsal-ceo",
    name: "Corporate & Executive",
    sectorHint: "corporate",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-17.png",
    oneTimeCents: 14900,
    monthlyCents: 800,
    yearlyCents: 6900,
    stripeOneTimePriceId: "price_1TQCl225H593hnObmevKBs9x",
    stripeMonthlyPriceId: "price_1TQCl325H593hnObCyJqEMB5",
    stripeYearlyPriceId: "price_1TQCl325H593hnObrHbt5rbh",
    isActive: true,
    sortOrder: 17,
  },
  {
    id: 18,
    slug: "teknoloji-startup",
    name: "Tech & Startup",
    sectorHint: "tech",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-18.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCl425H593hnObjDMOJ69q",
    stripeMonthlyPriceId: "price_1TQCl425H593hnObf504NEXe",
    stripeYearlyPriceId: "price_1TQCl425H593hnObhBvTqugn",
    isActive: true,
    sortOrder: 18,
  },
  {
    id: 19,
    slug: "berber-kuafor",
    name: "Barbier & Friseur",
    sectorHint: "salon",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-19.png",
    oneTimeCents: 7900,
    monthlyCents: 500,
    yearlyCents: 3900,
    stripeOneTimePriceId: "price_1TQCl525H593hnObl2DslNta",
    stripeMonthlyPriceId: "price_1TQCl525H593hnObO56KdLOz",
    stripeYearlyPriceId: "price_1TQCl625H593hnObXBVOMCqm",
    isActive: true,
    sortOrder: 19,
  },
  {
    id: 20,
    slug: "danismanlik-koc",
    name: "Beratung & Coaching",
    sectorHint: "consultant",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-20.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl625H593hnObRa5iYL0r",
    stripeMonthlyPriceId: "price_1TQCl725H593hnOb5UwrmIpa",
    stripeYearlyPriceId: "price_1TQCl725H593hnObpVPgYQCx",
    isActive: true,
    sortOrder: 20,
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
