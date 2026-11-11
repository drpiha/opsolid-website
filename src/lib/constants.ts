// =============================================================================
// BRANDING & SITE CONSTANTS
// Update these values to customize the brand identity
// =============================================================================

/** Date of the last substantive content update; drives the visible "Stand:" line (2026-11-07: OpSo iPhone app in the App Store). */
export const SITE_UPDATED_ISO = "2026-11-07";

/** "Oktober 2026" / "October 2026" / "Ekim 2026". */
export function formatStand(locale: string): string {
  const d = new Date(SITE_UPDATED_ISO + "T00:00:00Z");
  const tag = locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(tag, { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

export const SITE_CONFIG = {
  name: "OpSolid",
  tagline: "KI-Schulungen und KI-Beratung für Unternehmen",
  description:
    "OpSolid organisiert KI-Schulungen für Teams, online und live in Ihrem Microsoft Teams, und berät Unternehmen bei KI-Automatisierung: vom KI-Check mit Schulungsempfehlung über den Pilot zum Festpreis bis zum Betrieb. Dazu OpSo, unser digitales Kartenprodukt.",
  url: "https://opsolid.de",
  email: "info@opsolid.de",
  /**
   * No phone number on the site since 2026-11-11 (owner's decision): contact runs through the form and
   * info@. The Impressum names the form as the second fast channel next to email (§ 5 DDG; ECJ C-298/07).
   */
  address: {
    street: "Stolte Ley 12",
    postalCode: "59759",
    city: "Arnsberg",
    country: "Deutschland",
  },
} as const;
