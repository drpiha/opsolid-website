/**
 * v4 (2026-10) marketing surface detection. The v4 art direction (dark
 * graphite + copper, 3D stage) applies only to the public marketing routes.
 * App surfaces (dashboard, onboarding, card-preview, discover, products/*)
 * keep the existing theme system.
 */
import { LOCALES } from "@/lib/i18n";

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
  "ueber-mich",
  "contact",
  "blog",
  "impressum",
  "privacy",
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
  return V4_FIRST_SEGMENTS.has(first);
}

/** v4 routes whose (legacy) components still read the full content bundle via useLocale().t. */
const NEEDS_CONTENT = new Set(["impressum", "privacy"]);

export function needsContentBundle(pathname: string | null | undefined): boolean {
  if (!isV4Path(pathname)) return true;
  const first = stripLocalePrefix(pathname ?? "").split("/").filter(Boolean)[0] ?? "";
  return NEEDS_CONTENT.has(first);
}
