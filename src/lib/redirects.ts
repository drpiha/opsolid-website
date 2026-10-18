/**
 * Map of retired route paths → target path they should 301 to.
 * Keys are locale-stripped paths (e.g. "/solutions", "/products/chatbot").
 * Used by middleware.ts to redirect old URLs so existing inbound links
 * and SEO don't 404 after the Claude Design v2 scope reduction.
 *
 * Rules: we keep only the six marketing surfaces in the design bundle
 * (Home, Voice Agent, Digital Card, Kutasia, Journal, Contact) plus
 * legal pages. Everything else either retires to home or to the
 * closest flagship product.
 */
export const RETIRED_REDIRECTS: Record<string, string> = {
  // Top-level info pages → home
  "/solutions": "/leistungen",
  "/faq": "/contact",
  "/use-cases": "/blog",

  // About page: /about → /ueber-mich (2026-05) → /ueber-uns (2026-10, company voice).
  "/about": "/ueber-uns",
  "/ueber-mich": "/ueber-uns",

  // Legacy product hub ("Neun Produkte") and the Kutasia product page: Kutasia is a project in
  // development, not a product (owner, 2026-10). The hub goes to the services overview, Kutasia
  // to the work samples on the Websites page.
  "/products": "/leistungen",
  "/products/kutasia": "/websites",

  // Legacy aliases (without "-agent" suffix) → the consulting offer.
  "/products/chatbot": "/ki-beratung",
  "/products/lead-qualifier": "/ki-beratung",
  "/products/digital-reception": "/ki-beratung",

  // v3: unsold product pages fold into the consulting offer. EXACT match
  // only (see EXACT_ONLY) so no sibling route is ever caught by a prefix.
  "/products/voice-agent": "/ki-beratung",
  "/products/whatsapp-agent": "/ki-beratung",
  "/products/chatbot-agent": "/ki-beratung",
  "/products/email-agent": "/ki-beratung",
  "/products/booking-agent": "/ki-beratung",
  "/products/lead-qualifier-agent": "/ki-beratung",
  "/products/custom-automation": "/ki-beratung",

  // v3: legacy web-card entry points → OpSo. Exact only: /card/edit/*,
  // /card/manage/*, /products/digital-card/thanks etc. must keep working.
  "/card/new": "/opso",
  "/signup": "/opso",
  "/products/digital-card": "/opso",

  // Pricing removed from IA (2026-05-18 redesign Round 0 — we don't
  // advertise prices on the marketing site). Inbound links 308 to contact.
  "/pricing": "/contact",
};

/**
 * Keys in RETIRED_REDIRECTS that should only match exactly, not as a
 * path prefix. `/products` redirects to `/leistungen` for the bare products index,
 * but `/products/voice-agent` (etc.) must fall through so those routes
 * still resolve — they're listed separately with their own targets.
 */
export const EXACT_ONLY = new Set<string>([
  "/products",
  "/products/kutasia",
  "/products/voice-agent",
  "/products/whatsapp-agent",
  "/products/chatbot-agent",
  "/products/email-agent",
  "/products/booking-agent",
  "/products/lead-qualifier-agent",
  "/products/custom-automation",
  "/card/new",
  "/signup",
  "/products/digital-card",
]);

/**
 * If the given locale-stripped pathname is a retired route, returns the
 * replacement path (also locale-less). Otherwise null.
 */
export function getRetiredRedirectTarget(path: string): string | null {
  // Strip trailing slash except for root
  const normalized = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (normalized in RETIRED_REDIRECTS) return RETIRED_REDIRECTS[normalized];
  // Match nested retired routes too (e.g. /about/team → /about rule).
  // Keys in EXACT_ONLY (e.g. /products) don't participate so their
  // sub-routes can resolve to their own handlers.
  for (const key of Object.keys(RETIRED_REDIRECTS)) {
    if (EXACT_ONLY.has(key)) continue;
    if (normalized.startsWith(key + "/")) return RETIRED_REDIRECTS[key];
  }
  return null;
}
