// =============================================================================
// LOCALE BARREL — M6 expanded to 7 locales
// =============================================================================
// Fully-translated locales: en, de, tr.
// Partially-translated locales: es, it, fr, ar — used by the public card
// surfaces (/c/*). They import the English content tree and deep-merge an
// `overrides` object on top (currently empty), so every key falls back to
// English. See `src/content/es.ts` for the merge code.
//
// To add a translated key for one of the partial locales: edit the
// `overrides` object in that locale's file. The TypeScript type stays
// satisfied because the merge result is asserted as `Content`.
// =============================================================================

import { content as en } from "./en";
import { content as de } from "./de";
import { content as tr } from "./tr";
import { content as es } from "./es";
import { content as it } from "./it";
import { content as fr } from "./fr";
import { content as ar } from "./ar";

export const contents = { en, de, tr, es, it, fr, ar } as const;

// Re-export canonical Locale type from i18n lib to avoid duplicates.
export type { Locale } from "@/lib/i18n";
