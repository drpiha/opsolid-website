/**
 * Map of retired route paths → target path they should 301 to.
 * Keys are locale-stripped paths (e.g. "/solutions", "/products/chatbot").
 * Targets are INTERNAL German route paths of the v7 site (the ROUTE column in
 * src/lib/v7-routes.ts), optionally with a "#fragment". middleware.ts converts a
 * target to the visitor locale's public slug with internalToPublic(), so every
 * redirect is one hop (no chains). Never point a target at another retired key.
 * Inbound links and search results from earlier site versions land on the page
 * that answers the same question instead of a 404.
 */
export const RETIRED_REDIRECTS: Record<string, string> = {
  // v4 service pages → the consulting pillar (relaunch 2026-10-29, site-ia.md §4).
  "/leistungen": "/ki-beratung",
  "/ai-automation-check": "/ki-beratung/ki-check",
  "/prozessautomatisierung": "/ki-beratung/prozessautomatisierung",
  "/microsoft-365-automatisierung": "/ki-beratung/microsoft-365",
  "/agents": "/ki-beratung/ki-agenten",
  // Internal tools are a section of the process-automation page. The fragment is client-side only.
  "/interne-tools": "/ki-beratung/prozessautomatisierung#interne-tools",
  // Website subscriptions are no longer offered (owner, 2026-10-27); the work samples live on /projekte.
  "/websites": "/projekte",

  // Top-level info pages
  "/solutions": "/ki-beratung",
  "/faq": "/contact",
  "/use-cases": "/ki-beratung/anwendungsfaelle",

  // Former /about → /ueber-mich → /ueber-uns. NOTE: no "/about" key: the EN public slug of the About
  // page is "/about" and would redirect to itself (the DE/TR "/about" is handled by foreignSlugTarget).
  "/ueber-mich": "/ueber-uns",

  // Legacy product hub ("Neun Produkte") and the Kutasia product page: Kutasia is a project in
  // development, not a product (owner, 2026-10); it is shown on the projects page.
  "/products": "/ki-beratung",
  "/products/kutasia": "/projekte",

  // Former single-agent product pages (removed 2026-10, v4 cleanup) and their older aliases → the
  // agents page; the automation page → process automation. The route folders no longer exist, so
  // sub-paths redirect too.
  "/products/chatbot": "/ki-beratung/ki-agenten",
  "/products/lead-qualifier": "/ki-beratung/ki-agenten",
  "/products/digital-reception": "/ki-beratung/ki-agenten",
  "/products/voice-agent": "/ki-beratung/ki-agenten",
  "/products/whatsapp-agent": "/ki-beratung/ki-agenten",
  "/products/chatbot-agent": "/ki-beratung/ki-agenten",
  "/products/email-agent": "/ki-beratung/ki-agenten",
  "/products/booking-agent": "/ki-beratung/ki-agenten",
  "/products/lead-qualifier-agent": "/ki-beratung/ki-agenten",
  "/products/custom-automation": "/ki-beratung/prozessautomatisierung",

  // v3: legacy web-card entry points → OpSo. Exact only: /card/edit/*,
  // /card/manage/*, /products/digital-card/thanks etc. must keep working.
  "/card/new": "/opso",
  "/signup": "/opso",
  "/products/digital-card": "/opso",
  // Orphaned demo surfaces of the retired web-card flow (2026-10): the template
  // gallery (its CTAs pointed at /card/new) and the live-preview demo.
  "/products/digital-card/gallery": "/opso",
  "/card-preview": "/opso",

  // Pricing removed from IA (2026-05-18 redesign Round 0 — we don't
  // advertise prices on the marketing site). Inbound links 301 to contact.
  "/pricing": "/contact",
};

/**
 * Keys in RETIRED_REDIRECTS that should only match exactly, not as a
 * path prefix: their sub-routes are live (`/products/digital-card/thanks`,
 * `/card/new/...`) or have their own targets (`/products/kutasia`).
 */
export const EXACT_ONLY = new Set<string>([
  "/products",
  "/products/kutasia",
  "/card/new",
  "/signup",
  "/products/digital-card",
  "/products/digital-card/gallery",
  "/card-preview",
]);

/**
 * If the given locale-stripped pathname is a retired route, returns the
 * replacement path (also locale-less). Otherwise null.
 */
export function getRetiredRedirectTarget(path: string): string | null {
  // Strip trailing slash except for root
  const normalized = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (Object.prototype.hasOwnProperty.call(RETIRED_REDIRECTS, normalized)) return RETIRED_REDIRECTS[normalized];
  // Match nested retired routes too (e.g. /about/team → /about rule).
  // Keys in EXACT_ONLY (e.g. /products) don't participate so their
  // sub-routes can resolve to their own handlers.
  for (const key of Object.keys(RETIRED_REDIRECTS)) {
    if (EXACT_ONLY.has(key)) continue;
    if (normalized.startsWith(key + "/")) return RETIRED_REDIRECTS[key];
  }
  return null;
}
