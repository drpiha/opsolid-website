export const LOCALES = ["en", "de", "tr", "es", "it", "fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  tr: "Türkçe",
  es: "Español",
  it: "Italiano",
  fr: "Français",
  ar: "العربية",
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  tr: "TR",
  es: "ES",
  it: "IT",
  fr: "FR",
  ar: "AR",
};

/** Locales that render right-to-left. */
export const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

export function directionForLocale(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function extractLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

export function stripLocaleFromPath(pathname: string): string {
  const locale = extractLocaleFromPath(pathname);
  if (!locale) return pathname;
  const stripped = pathname.slice(`/${locale}`.length);
  return stripped.length === 0 ? "/" : stripped;
}

export function withLocale(pathname: string, locale: Locale): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}
