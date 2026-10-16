"use client";

/**
 * Keeps <html data-v4 / data-theme> in step with client-side navigation.
 * The root layout sets both on the first server render; layouts persist
 * across soft navigations, so this effect handles v4 ↔ app-surface changes.
 * v4 marketing pages are dark-only; app surfaces restore the stored theme.
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isV4Path } from "@/lib/v4";
import { THEME_STORAGE_KEY } from "@/context/ThemeContext";

export function V4Sync() {
  const pathname = usePathname();
  useEffect(() => {
    const el = document.documentElement;
    if (isV4Path(pathname)) {
      el.setAttribute("data-v4", "1");
      el.setAttribute("data-theme", "dark");
      el.removeAttribute("data-preview");
      return;
    }
    el.removeAttribute("data-v4");
    el.setAttribute("data-preview", "v2");
    let t: string | null = null;
    try {
      t = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    el.setAttribute("data-theme", t === "dark" ? "dark" : "light");
  }, [pathname]);
  return null;
}
