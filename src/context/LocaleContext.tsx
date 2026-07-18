"use client";

import { createContext, useContext, useCallback, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { contents } from "@/content";
import type { Content } from "@/content/en";
import {
  LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
  extractLocaleFromPath,
  stripLocaleFromPath,
  withLocale,
  directionForLocale,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Content;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: contents[DEFAULT_LOCALE],
});

// Keep in sync with src/middleware.ts. The cookie name is versioned whenever
// the locale-detection policy changes so stale AUTO-detected values from the
// old logic stop overriding the new default. Bumped to _V2 in 2026-07 when
// country detection moved in-app (previous `OPSOLID_LOCALE=tr` pins, set from
// Accept-Language on the bare-Traefik prod, would otherwise stick).
const COOKIE_NAME = "OPSOLID_LOCALE_V2";
const LEGACY_COOKIE_NAMES = ["NEXT_LOCALE", "OPSOLID_LOCALE"];
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Pathname is authoritative — middleware guarantees a locale prefix.
  // Fall back to initialLocale (from server) only during hydration.
  const locale: Locale = useMemo(() => {
    const fromPath = extractLocaleFromPath(pathname || "");
    return fromPath ?? (isLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE);
  }, [pathname, initialLocale]);

  // Keep <html lang> + dir in sync on client navigations
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = directionForLocale(locale);
    }
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (!(LOCALES as readonly string[]).includes(next)) return;
      if (typeof document !== "undefined") {
        document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
        // Sweep every legacy cookie at the same time so none can outvote the
        // new one if the user immediately opens a fresh tab.
        for (const legacy of LEGACY_COOKIE_NAMES) {
          document.cookie = `${legacy}=; path=/; max-age=0; samesite=lax`;
        }
      }
      const rest = stripLocaleFromPath(pathname || "/");
      router.push(withLocale(rest, next));
    },
    [pathname, router]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t: contents[locale] }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
