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
  email: "drhasanhd@gmail.com",
  phone: "",
  address: {
    city: "Germany",
    country: "Germany",
  },
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Example Solutions", href: "/use-cases" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Services", href: "/solutions" },
    { label: "Example Solutions", href: "/use-cases" },
  ],
  products: [
    { label: "Kutasia", href: "/products/kutasia" },
    { label: "All Products", href: "/products" },
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
