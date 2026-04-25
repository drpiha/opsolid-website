// =============================================================================
// Smart Card sector presets — 10 sector-tailored defaults that pre-fill the
// SmartCard surface with sensible content, CTAs, and FAQ blocks.
//
// A sector preset is a lightweight "starter pack" — when applied to a card it
// merges into `cardData` without overwriting fields the owner already filled
// in. The merge happens in `applySectorPreset()`.
//
// All copy is in German (DE is the primary market). Future i18n: per-sector
// translation tables keyed by locale, swapped at apply-time. Out of scope for
// the MVP — the merge is one-shot and the owner can edit the strings after.
// =============================================================================

import type { CardData, CardCustomButton, CardService, CardFaqItem } from "@/lib/validation";

export type SectorKey =
  | "consultant"
  | "real-estate"
  | "salon"
  | "restaurant"
  | "clinic"
  | "lawyer"
  | "creator"
  | "sales-pro"
  | "corporate"
  | "event";

export interface SectorPreset {
  key: SectorKey;
  /** Display name, used in admin dropdown + sector badge on the card. */
  name: string;
  /** One-line marketing description for the admin picker. */
  tagline: string;
  /** Suggested brand primary hex — applied only if the card has no
   *  brandPrimaryHex set yet. */
  primaryHex: string;
  accentHex: string;
  services: CardService[];
  /** Custom CTA buttons rendered above contact rows. */
  customButtons: CardCustomButton[];
  faqs: CardFaqItem[];
}

// -----------------------------------------------------------------------------
// Authoritative preset list. Keep aligned with the Smart Card spec §16
// (Sektör Şablonları) — every sector listed there has an entry here.
// -----------------------------------------------------------------------------

export const SECTOR_PRESETS: Record<SectorKey, SectorPreset> = {
  consultant: {
    key: "consultant",
    name: "Berater · Consultant",
    tagline: "Discovery-Termin + Angebot anfordern.",
    primaryHex: "#1F2530",
    accentHex: "#C27940",
    services: [
      {
        title: "Strategy Sprint",
        description: "Zwei Wochen, klare Roadmap mit Prioritäten und Aufwand.",
        priceLabel: "ab 4.900 €",
      },
      {
        title: "Operations Audit",
        description: "Ein Tag vor Ort, Bericht mit Quick-Wins und Risiken.",
      },
      {
        title: "Begleitung & Sparring",
        description: "Wöchentliche Calls als laufender Sparringspartner.",
      },
    ],
    customButtons: [
      { label: "Angebot anfordern", href: "mailto:?subject=Angebotsanfrage", style: "secondary" },
      { label: "Discovery Call", href: "https://cal.com/", style: "primary" },
    ],
    faqs: [
      {
        q: "Wie läuft ein Erstgespräch ab?",
        a: "30 Minuten Video-Call. Sie schildern Ihre Situation, ich gebe ehrliche Einschätzung und Optionen — ohne Verpflichtung.",
      },
      {
        q: "Arbeiten Sie auch remote?",
        a: "Standardmäßig remote, Vor-Ort-Termine in DACH nach Absprache.",
      },
    ],
  },

  "real-estate": {
    key: "real-estate",
    name: "Immobilien · Real Estate",
    tagline: "Bewertung anfordern + Portfolio teilen.",
    primaryHex: "#7E4A24",
    accentHex: "#C27940",
    services: [
      {
        title: "Kostenlose Immobilienbewertung",
        description: "Marktorientierter Wert in 24 Std., direkt per E-Mail.",
        priceLabel: "kostenlos",
      },
      { title: "Verkaufsbegleitung", description: "Inserat, Besichtigungen, Verhandlung — 360°." },
      { title: "Mietverwaltung", description: "Inserat bis Mietvertrag, transparent abgerechnet." },
    ],
    customButtons: [
      { label: "Immobilie bewerten", href: "mailto:?subject=Immobilienbewertung", style: "primary" },
      { label: "Aktuelle Objekte", href: "https://", style: "secondary" },
    ],
    faqs: [
      { q: "Wie schnell verkaufe ich mit Ihnen?", a: "Im Schnitt 6–10 Wochen, abhängig von Lage und Marktphase." },
      { q: "Welche Provision fällt an?", a: "Marktüblich: jeweils 3,57 % inkl. MwSt., teilbar nach §656c BGB." },
    ],
  },

  salon: {
    key: "salon",
    name: "Salon · Friseur · Studio",
    tagline: "Termin online buchen + Galerie zeigen.",
    primaryHex: "#A46230",
    accentHex: "#EBBE8A",
    services: [
      { title: "Damenhaarschnitt", priceLabel: "ab 45 €" },
      { title: "Herrenhaarschnitt", priceLabel: "ab 28 €" },
      { title: "Coloration", description: "Beratung inklusive." },
      { title: "Styling für Anlässe" },
    ],
    customButtons: [
      { label: "Termin buchen", href: "https://", style: "primary" },
      { label: "Wegbeschreibung", href: "https://www.google.com/maps", style: "secondary" },
    ],
    faqs: [
      { q: "Brauche ich einen Termin?", a: "Ja — wir arbeiten ohne Walk-in, damit niemand wartet." },
      { q: "Welche Marken nutzen Sie?", a: "Wir arbeiten ausschließlich mit professionellen Salonmarken." },
    ],
  },

  restaurant: {
    key: "restaurant",
    name: "Restaurant · Café",
    tagline: "Karte ansehen + Tisch reservieren.",
    primaryHex: "#56321A",
    accentHex: "#DDA266",
    services: [
      { title: "Menü", description: "Aktuelle Karte mit allen Allergenen als PDF." },
      { title: "Reservierung", description: "Direkt online oder telefonisch." },
      { title: "Veranstaltungen", description: "Geburtstage, Firmenfeiern, Hochzeiten." },
    ],
    customButtons: [
      { label: "Menü ansehen", href: "https://", style: "secondary" },
      { label: "Tisch reservieren", href: "https://", style: "primary" },
    ],
    faqs: [
      { q: "Sind Sie an Feiertagen geöffnet?", a: "Bitte rufen Sie kurz an — Feiertagsöffnungen variieren." },
      { q: "Vegetarisch / vegan?", a: "Mehrere Optionen täglich, glutenfreie Varianten auf Anfrage." },
    ],
  },

  clinic: {
    key: "clinic",
    name: "Praxis · Klinik · Doktor",
    tagline: "Termin online + Anfahrt + Sprechzeiten.",
    primaryHex: "#1F2530",
    accentHex: "#7FB286",
    services: [
      { title: "Allgemeinmedizin", description: "Vorsorge, Diagnostik, Beratung." },
      { title: "Privat & Kasse", description: "Alle gesetzlichen und privaten Versicherungen." },
      { title: "Hausbesuche", description: "Nach Absprache im Stadtgebiet." },
    ],
    customButtons: [
      { label: "Termin online", href: "https://", style: "primary" },
      { label: "Anfahrt", href: "https://www.google.com/maps", style: "secondary" },
    ],
    faqs: [
      { q: "Sprechzeiten?", a: "Mo–Fr 8:00–12:00 und 14:00–18:00. Mittwochnachmittag geschlossen." },
      { q: "Akute Beschwerden?", a: "Bitte direkt anrufen — wir halten Notfalltermine täglich frei." },
    ],
  },

  lawyer: {
    key: "lawyer",
    name: "Rechtsanwalt · Kanzlei",
    tagline: "Erstgespräch anfragen + Mandat starten.",
    primaryHex: "#11151C",
    accentHex: "#9CA3A0",
    services: [
      { title: "Arbeitsrecht" },
      { title: "Mietrecht" },
      { title: "Familienrecht" },
      { title: "Vertragsprüfung", description: "Festpreis nach Aufwand." },
    ],
    customButtons: [
      { label: "Erstgespräch anfragen", href: "mailto:?subject=Erstgespraech", style: "primary" },
      { label: "Anrufen", href: "tel:", style: "secondary" },
    ],
    faqs: [
      { q: "Was kostet ein Erstgespräch?", a: "Pauschal 190 € inkl. MwSt., wird bei Mandatierung verrechnet." },
      { q: "Decken Sie meinen Rechtsschutz?", a: "Wir rechnen direkt mit den meisten Versicherern ab." },
    ],
  },

  creator: {
    key: "creator",
    name: "Creator · Künstler",
    tagline: "Portfolio + Kollaboration anfragen.",
    primaryHex: "#331D10",
    accentHex: "#F5D9B8",
    services: [
      { title: "Foto / Video", description: "Editorial, Lifestyle, Brand." },
      { title: "Kollaborationen", description: "Brand Deals, Cross-Posts, Events." },
      { title: "Coaching", description: "1-on-1 Sessions zu Wachstum und Stil." },
    ],
    customButtons: [
      { label: "Portfolio ansehen", href: "https://", style: "primary" },
      { label: "Zusammenarbeit", href: "mailto:?subject=Kollaboration", style: "secondary" },
    ],
    faqs: [
      { q: "Welche Themen?", a: "Lifestyle, Reise, Lokales — siehe Galerie und Sozialprofile." },
      { q: "Werbekooperationen?", a: "Ja — schreiben Sie mir mit Mediadaten und Zeitplan." },
    ],
  },

  "sales-pro": {
    key: "sales-pro",
    name: "Sales · Vertrieb · Demo",
    tagline: "Demo planen + Pitch-Deck teilen.",
    primaryHex: "#0B0E13",
    accentHex: "#C27940",
    services: [
      { title: "Demo (15 Min.)", description: "Schneller Walkthrough mit Ihren Daten." },
      { title: "Pilot (4 Wochen)", description: "Klar definierter Scope, messbares Ziel." },
      { title: "Roll-out", description: "Onboarding und Training für Ihr Team." },
    ],
    customButtons: [
      { label: "Demo planen", href: "https://cal.com/", style: "primary" },
      { label: "Pitch-Deck", href: "https://", style: "secondary" },
    ],
    faqs: [
      { q: "Wie lange bis zum Go-Live?", a: "Pilot startet binnen 7 Tagen, Roll-out je nach Team-Größe 4–8 Wochen." },
      { q: "On-Premise verfügbar?", a: "Ja — DSGVO-konformes Hosting in DE oder Self-Hosted." },
    ],
  },

  corporate: {
    key: "corporate",
    name: "Mitarbeiter · Corporate",
    tagline: "Standardisierte Visitenkarte fürs Team.",
    primaryHex: "#1F2530",
    accentHex: "#9FA2A9",
    services: [],
    customButtons: [
      { label: "LinkedIn", href: "https://www.linkedin.com/", style: "secondary" },
    ],
    faqs: [],
  },

  event: {
    key: "event",
    name: "Messe · Event · Stand",
    tagline: "Standdaten + Demo + Bilder einsammeln.",
    primaryHex: "#7E4A24",
    accentHex: "#E8A252",
    services: [
      { title: "Live-Demo am Stand", description: "Stündlich, jeweils 15 Min." },
      { title: "Termin nach der Messe", description: "Tiefe Beratung, online oder vor Ort." },
    ],
    customButtons: [
      { label: "Standplan ansehen", href: "https://", style: "secondary" },
      { label: "Termin nach der Messe", href: "https://cal.com/", style: "primary" },
    ],
    faqs: [
      { q: "Wo stehen Sie?", a: "Halle und Stand sind im Banner oben angegeben." },
      { q: "Bekomme ich die Unterlagen?", a: "Ja — senden Sie Ihre Daten via 'Meine Daten senden'." },
    ],
  },
};

export function getSectorPreset(key: string | null | undefined): SectorPreset | null {
  if (!key) return null;
  return (SECTOR_PRESETS as Record<string, SectorPreset | undefined>)[key] ?? null;
}

export function listSectorPresets(): SectorPreset[] {
  return Object.values(SECTOR_PRESETS);
}

/**
 * Merge a sector preset into existing cardData. Owner-supplied fields win —
 * presets only fill empty slots. Used by the admin "Apply sector preset"
 * action so applying a preset never overwrites custom content.
 *
 * Returns a new cardData object; does not mutate the input.
 */
export function applySectorPreset(
  cardData: CardData,
  preset: SectorPreset,
): CardData {
  return {
    ...cardData,
    sectorKey: cardData.sectorKey ?? preset.key,
    services:
      cardData.services && cardData.services.length > 0
        ? cardData.services
        : preset.services.length > 0
        ? preset.services
        : undefined,
    customButtons:
      cardData.customButtons && cardData.customButtons.length > 0
        ? cardData.customButtons
        : preset.customButtons.length > 0
        ? preset.customButtons
        : undefined,
    faqs:
      cardData.faqs && cardData.faqs.length > 0
        ? cardData.faqs
        : preset.faqs.length > 0
        ? preset.faqs
        : undefined,
  };
}
