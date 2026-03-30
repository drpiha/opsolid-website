// =============================================================================
// BRANDING & SITE CONSTANTS
// Update these values to customize the brand identity
// =============================================================================

export const SITE_CONFIG = {
  name: "OpSolid",
  tagline: "Operational Infrastructure for Modern Businesses",
  description:
    "OpSolid helps companies reduce repetitive work, connect fragmented processes, and build reliable operational systems using automation, internal tools, integrations, and AI-assisted workflows.",
  url: "https://opsolid.de",
  email: "hello@opsolid.de",
  phone: "",
  address: {
    city: "Germany",
    country: "Germany",
  },
} as const;

export const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Solutions", href: "/solutions" },
    { label: "Use Cases", href: "/use-cases" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;
