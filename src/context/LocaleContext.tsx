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

const COOKIE_NAME = "NEXT_LOCALE";
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

  // Keep <html lang> in sync on client navigations
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (!(LOCALES as readonly string[]).includes(next)) return;
      if (typeof document !== "undefined") {
        document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
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
