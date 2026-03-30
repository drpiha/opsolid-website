"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { contents, type Locale } from "@/content";
import type { Content } from "@/content/en";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Content;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: contents.en,
});

const STORAGE_KEY = "solidra-locale";
const VALID_LOCALES: Locale[] = ["en", "de", "tr"];

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale;
      if (saved && VALID_LOCALES.includes(saved)) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage not available (SSR, privacy mode)
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
    document.documentElement.lang = l === "tr" ? "tr" : l === "de" ? "de" : "en";
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: contents[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
