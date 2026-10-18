// =============================================================================
// BRANDING & SITE CONSTANTS
// Update these values to customize the brand identity
// =============================================================================

/** Date of the last substantive content update; drives the visible "Stand:" line. */
export const SITE_UPDATED_ISO = "2026-10-16";

/** "Oktober 2026" / "October 2026" / "Ekim 2026". */
export function formatStand(locale: string): string {
  const d = new Date(SITE_UPDATED_ISO + "T00:00:00Z");
  const tag = locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(tag, { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

export const SITE_CONFIG = {
  name: "OpSolid",
  tagline: "KI-Agenten, Websites und Automatisierung",
  description:
    "OpSolid entwickelt KI-Agenten, Websites und Prozessautomatisierung für kleine und mittlere Unternehmen: praxisnah, dokumentiert, datenschutzbewusst.",
  url: "https://opsolid.de",
  email: "info@opsolid.de",
  phone: "+49 176 31020654",
  /**
   * WhatsApp Business reach for product inquiries (esp. OpSo Smart custom-card
   * requests). Two numbers so customers reach us on their local channel:
   * a Turkish line and the German mobile. Stored in E.164; render via
   * `waLink()` in src/lib/contact-channels.ts.
   */
  whatsapp: {
    tr: "+90 533 571 78 85",
    de: "+49 176 31020654",
  },
  address: {
    street: "Stolte Ley 12",
    postalCode: "59759",
    city: "Arnsberg",
    country: "Deutschland",
  },
} as const;
