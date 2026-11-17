import type { L3 } from "@/lib/v7-routes";

// Explicit language choice. Keep in step with COOKIE_NAME in src/context/LocaleContext.tsx and the middleware.
const COOKIE_NAME = "OPSOLID_LOCALE_V3";
const LEGACY_COOKIES = ["NEXT_LOCALE", "OPSOLID_LOCALE", "OPSOLID_LOCALE_V2"];

/** Stores an explicit language choice (only a click on a language link or the German logo writes it). */
export function rememberLocale(l: L3) {
  try {
    document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    for (const c of LEGACY_COOKIES) document.cookie = `${c}=; path=/; max-age=0; samesite=lax`;
  } catch {
    /* cookies unavailable */
  }
}
