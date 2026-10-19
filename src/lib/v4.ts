/**
 * v4 (2026-10) marketing surface detection. The v4 art direction (dark
 * graphite + copper, 3D stage) applies only to the public marketing routes.
 * App surfaces (dashboard, onboarding, card-preview, discover, products/*)
 * keep the existing theme system.
 */
import { LOCALES, PUBLIC_LOCALES } from "@/lib/i18n";

const V4_FIRST_SEGMENTS = new Set([
  "",
  "agents",
  "websites",
  "leistungen",
  "ki-beratung",
  "prozessautomatisierung",
  "microsoft-365-automatisierung",
  "interne-tools",
  "ki-schulungen",
  "ai-automation-check",
  "opso",
  "ueber-uns",
  "contact",
  "blog",
  "impressum",
  "privacy",
]);

/**
 * App-surface folders under src/app/[locale] (legacy theme, content bundle).
 * Any other first segment under /de, /en or /tr matches no route and is
 * answered by [locale]/[...rest] with the v4 404, so it counts as marketing.
 * Keep in step with src/app/[locale]: an app route missing here renders
 * without its content bundle.
 */
const APP_FIRST_SEGMENTS = new Set([
  "login",
  "signup",
  "magic-link",
  "c",
  "card",
  "card-preview",
  "dashboard",
  "discover",
  "events",
  "marketing",
  "onboarding",
  "products",
]);

export function stripLocalePrefix(pathname: string): string {
  const clean = pathname.split("?")[0].split("#")[0];
  const parts = clean.split("/").filter(Boolean);
  if (parts.length && (LOCALES as readonly string[]).includes(parts[0])) parts.shift();
  return "/" + parts.join("/");
}

export function isV4Path(pathname: string | null | undefined): boolean {
  if (pathname == null) return false;
  const rest = stripLocalePrefix(pathname);
  const first = rest.split("/").filter(Boolean)[0] ?? "";
  if (V4_FIRST_SEGMENTS.has(first)) return true;
  const prefix = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean)[0] ?? "";
  return (PUBLIC_LOCALES as readonly string[]).includes(prefix) && !APP_FIRST_SEGMENTS.has(first);
}

/** Every v4 route (legal pages and the 404 included) renders from server data or its own copy. */
export function needsContentBundle(pathname: string | null | undefined): boolean {
  return !isV4Path(pathname);
}
