import { content as en } from "./en";
import { content as de } from "./de";
import { content as tr } from "./tr";

export const contents = { en, de, tr } as const;

// Re-export canonical Locale type from i18n lib to avoid duplicates.
export type { Locale } from "@/lib/i18n";
