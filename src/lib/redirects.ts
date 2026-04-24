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
  "/solutions": "/",
  "/about": "/",
  "/faq": "/contact",
  "/use-cases": "/blog",

  // Products index → home
  "/products": "/",

  // Retired agent-family products → Voice Agent (closest flagship)
  "/products/chatbot": "/products/voice-agent",
  "/products/whatsapp-agent": "/products/voice-agent",
  "/products/booking-agent": "/products/voice-agent",
  "/products/email-agent": "/products/voice-agent",
  "/products/lead-qualifier": "/products/voice-agent",
  "/products/digital-reception": "/products/voice-agent",
};

/**
 * If the given locale-stripped pathname is a retired route, returns the
 * replacement path (also locale-less). Otherwise null.
 */
export function getRetiredRedirectTarget(path: string): string | null {
  // Strip trailing slash except for root
  const normalized = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (normalized in RETIRED_REDIRECTS) return RETIRED_REDIRECTS[normalized];
  // Match nested retired routes too (e.g. /about/team → /about rule)
  for (const key of Object.keys(RETIRED_REDIRECTS)) {
    if (normalized.startsWith(key + "/")) return RETIRED_REDIRECTS[key];
  }
  return null;
}
