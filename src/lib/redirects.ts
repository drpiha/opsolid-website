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
  "/solutions": "/products",
  "/faq": "/contact",
  "/use-cases": "/blog",

  // Renamed bio page: /about → /ueber-mich (German-first positioning, 2026-05).
  "/about": "/ueber-mich",

  // Legacy aliases (without "-agent" suffix) → current dedicated pages.
  // The "-agent" suffixed paths are real routes now and must NOT be retired.
  "/products/chatbot": "/products/chatbot-agent",
  "/products/lead-qualifier": "/products/lead-qualifier-agent",
  "/products/digital-reception": "/products/voice-agent",
};

/**
 * Keys in RETIRED_REDIRECTS that should only match exactly, not as a
 * path prefix. `/products` redirects to `/` for the bare products index,
 * but `/products/voice-agent` (etc.) must fall through so those routes
 * still resolve — they're listed separately with their own targets.
 */
const EXACT_ONLY = new Set<string>(["/products"]);

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
