/**
 * Pure URL checks for the middleware (unit-tested in scripts/tests/url-hygiene.test.mts).
 */

/**
 * One canonical spelling for a request path, or null when it already is one: repeated slashes collapse
 * (/en//about → /en/about) and an upper-case locale prefix is lower-cased (/EN/about → /en/about). Only
 * the locale segment changes case; deeper segments can carry case-sensitive app tokens.
 */
export function canonicalPathname(pathname: string, isLocale: (s: string) => boolean): string | null {
  const collapsed = pathname.replace(/\/{2,}/g, "/");
  const [, first = "", ...rest] = collapsed.split("/");
  const lower = first.toLowerCase();
  const fixed = ["", lower !== first && isLocale(lower) ? lower : first, ...rest].join("/");
  return fixed === pathname ? null : fixed;
}

/**
 * Locale folders that hold app routes but no index page, with the children that exist. The bare folder
 * (/de/card) or an unknown child (/de/c/test) would render the not-found UI with status 200 (a soft 404).
 */
const APP_FOLDERS: Record<string, RegExp> = {
  "/c": /^\/c\/preview$/,
  "/card": /^\/card\/(new|(edit|manage)\/[^/]+)$/,
  "/events": /^\/events\/[^/]+$/,
  "/marketing": /^\/marketing\/(confirm|unsubscribe)$/,
};

/** True for a locale-less path that no page under an app folder serves (see APP_FOLDERS). */
export function isDeadAppPath(pathWithoutLocale: string): boolean {
  const allowed = APP_FOLDERS[`/${pathWithoutLocale.split("/")[1] ?? ""}`];
  return allowed !== undefined && !allowed.test(pathWithoutLocale);
}
