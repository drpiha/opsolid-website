// =============================================================================
// BRANDING & SITE CONSTANTS
// Update these values to customize the brand identity
// =============================================================================

export const SITE_CONFIG = {
  name: "OpSolid",
  tagline: "Practical Automation & AI Systems",
  description:
    "OpSolid helps businesses replace manual, repetitive work with reliable automated systems — workflow automation, systems integration, internal tools, and AI-assisted processes.",
  url: "https://opsolid.de",
  email: "info@kutasia.com",
  phone: "",
  address: {
    city: "Germany",
    country: "Germany",
  },
} as const;

/**
 * V2 design-system nav / footer link tables. Trimmed to the six surfaces in
 * the Claude Design mock (Home · Voice Agent · Digital Card · Kutasia ·
 * Journal · Contact) plus legal. The header/footer components read the
 * actual user-visible labels from `t.v2.nav` / `t.v2.footer.*` per locale;
 * the constants below are kept for any legacy import that still references
 * them (e.g. sitemap, meta).
 */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Voice Agent", href: "/products/voice-agent" },
  { label: "Digital Card", href: "/products/digital-card" },
  { label: "Kutasia", href: "/products/kutasia" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  products: [
    { label: "Voice Agent", href: "/products/voice-agent" },
    { label: "Digital Card", href: "/products/digital-card" },
    { label: "Kutasia", href: "/products/kutasia" },
  ],
  studio: [
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Imprint", href: "/impressum" },
  ],
} as const;
