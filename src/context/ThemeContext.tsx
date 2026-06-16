"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark";
export const THEMES: readonly Theme[] = ["light", "dark"] as const;
export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "opsolid-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

function isTheme(value: unknown): value is Theme {
  return (
    typeof value === "string" &&
    (THEMES as readonly string[]).includes(value)
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initial value must match the inline no-flash script in layout.tsx to
  // avoid SSR/CSR hydration drift. The DOM is the source of truth — on
  // mount we read whatever the no-flash script wrote.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (isTheme(fromDom)) {
      setThemeState(fromDom);
      return;
    }
    // Safety net: if for some reason the attribute is missing or invalid,
    // write the default so CSS has a palette to resolve against.
    document.documentElement.setAttribute("data-theme", DEFAULT_THEME);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    if (!isTheme(next)) return;
    setThemeState(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode, quota) — silently continue.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
