import type { PageKey } from "@/lib/v7-routes";
import type { PageSet } from "../types";
import { page as agenten } from "./agenten";
import { page as anwendungen } from "./anwendungen";
import { page as beratung } from "./beratung";
import { page as check } from "./check";
import { page as copilot } from "./copilot";
import { page as home } from "./home";
import { page as kompetenz } from "./kompetenz";
import { page as kontakt } from "./kontakt";
import { page as m365 } from "./m365";
import { page as opso } from "./opso";
import { page as produkte } from "./produkte";
import { page as prozess } from "./prozess";
import { page as schulungen } from "./schulungen";
import { page as trainer } from "./trainer";
import { page as ueber } from "./ueber";
import { page as workflows } from "./workflows";

/** Every v7 page with a PageDef, in nav order (Schulungen, Beratung, Produkte, Unternehmen). For llms.txt and share cards. */
export const PAGE_SETS: PageSet[] = [
  home,
  schulungen,
  kompetenz,
  copilot,
  workflows,
  trainer,
  beratung,
  check,
  prozess,
  m365,
  agenten,
  anwendungen,
  produkte,
  opso,
  ueber,
  kontakt,
];

export function pageSet(key: PageKey): PageSet | undefined {
  return PAGE_SETS.find((set) => set.de.key === key);
}
