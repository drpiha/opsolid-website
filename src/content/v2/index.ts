/**
 * V2 content barrel — picks the right locale module by `Locale`. Used only
 * by V2 components gated behind `?preview=v2`. Keep separate from the main
 * `src/content/index.ts` so we don't bloat the existing content surface.
 */

import { v2 as v2en, type V2Content } from "./en";
import { v2 as v2de } from "./de";
import { v2 as v2tr } from "./tr";
import type { Locale } from "@/lib/i18n";

/**
 * Returns the V2 content bundle for the locale, typed as the EN shape so
 * consumers get full property typing. EN is the type-defining source of
 * truth; DE/TR are validated structurally at write-time via the V2Mirror
 * helper in each locale file, then re-asserted here for the consumer side.
 *
 * Non-DE/EN/TR locales fall back to English until the redesign promotes
 * out of `?preview=v2` at M9.
 */
export function getV2Content(locale: Locale): V2Content {
  switch (locale) {
    case "de":
      return v2de as unknown as V2Content;
    case "tr":
      return v2tr as unknown as V2Content;
    case "en":
    default:
      return v2en;
  }
}

export type { V2Content } from "./en";
