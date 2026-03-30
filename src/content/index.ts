import { content as en } from "./en";
import { content as de } from "./de";
import { content as tr } from "./tr";

export const contents = { en, de, tr } as const;

export type Locale = keyof typeof contents;
