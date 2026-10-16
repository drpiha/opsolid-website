"use client";

import { createContext, useContext, useCallback, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Content } from "@/content/en";
import { ContentContext } from "@/context/ContentContext";
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

interface LocaleBaseValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleBaseValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

// Keep in sync with src/middleware.ts. The cookie name is versioned whenever
// the locale-detection policy changes so stale AUTO-detected values from the
// old logic stop overriding the new default. At _V3 (2026-07): the switcher is
// now the ONLY writer of this cookie — middleware persists it just on a
// confident geo redirect — so earlier auto-saved pins (=tr from Accept-Language,
// then =en from the failed lookup) are swept and re-detected once.
const COOKIE_NAME = "OPSOLID_LOCALE_V3";
const LEGACY_COOKIE_NAMES = ["NEXT_LOCALE", "OPSOLID_LOCALE", "OPSOLID_LOCALE_V2"];
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

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Locale + setter only. Safe everywhere; does not require (or pull in) the content bundle. */
export function useLocaleBase(): LocaleBaseValue {
  return useContext(LocaleContext);
}

const MISSING_CONTENT = new Proxy({} as Content, {
  get(_target, prop) {
    if (prop === "then" || typeof prop === "symbol") return undefined;
    throw new Error(
      `useLocale().t.${String(prop)} was read outside a <ContentProvider>. v4 marketing routes carry their own copy; app surfaces get content through ContentGate.`,
    );
  },
});

/** Locale + setter + the full localized content bundle (`t`). `t` needs <ContentProvider> above it. */
export function useLocale(): LocaleBaseValue & { t: Content } {
  const base = useContext(LocaleContext);
  const t = useContext(ContentContext);
  return { ...base, t: t ?? MISSING_CONTENT };
}
