import type { L3, PageDef } from "./types";
import type { PageKey } from "./keys";
import { de } from "./pages-de";
import { en } from "./pages-en";
import { tr } from "./pages-tr";

const SETS: Record<L3, Record<PageKey, PageDef>> = { de, en, tr };

export function getPage(locale: L3, key: PageKey): PageDef {
  return SETS[locale][key];
}

export type { PageKey } from "./keys";
export type { L3, PageDef } from "./types";
