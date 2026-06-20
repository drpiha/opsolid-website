// =============================================================================
// BRANDING & SITE CONSTANTS
// Update these values to customize the brand identity
// =============================================================================

export const SITE_CONFIG = {
  name: "OpSolid",
  tagline: "KI- & Automatisierungsberatung für mittelständische Unternehmen",
  description:
    "OpSolid unterstützt mittelständische Unternehmen in Deutschland und Europa bei KI-Beratung, Prozessautomatisierung und digitalen Workflows — praxisnah, messbar, datenschutzbewusst.",
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

/**
 * Consulting-positioned nav (Hasan, 2026-05). Old product surfaces (Voice
 * Agent / Verso / Kutasia) stay reachable at /products/* but are removed
 * from the header — the brand is repositioned as "AI & Automation
 * Consulting for SMEs" and product pages will be folded into case studies
 * later. Header/footer pull localized labels from `t.v2.nav` / `t.v2.footer`.
 */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "AI Automation Check", href: "/ai-automation-check" },
  { label: "Wissen", href: "/blog" },
  { label: "Kontakt", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  services: [
    { label: "AI Automation Check", href: "/ai-automation-check" },
    { label: "Leistungen", href: "/leistungen" },
  ],
  studio: [
    { label: "Über mich", href: "/ueber-mich" },
    { label: "Wissen", href: "/blog" },
    { label: "Kontakt", href: "/contact" },
  ],
  legal: [
    { label: "Datenschutz", href: "/privacy" },
    { label: "Impressum", href: "/impressum" },
  ],
} as const;
