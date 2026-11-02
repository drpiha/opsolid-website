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
import { page as projekte } from "./projekte";
import { page as prozess } from "./prozess";
import { page as schulungen } from "./schulungen";
import { page as trainer } from "./trainer";
import { page as ueber } from "./ueber";

/** Every v7 page with a PageDef, in nav order (consulting, trainings, product, company). For llms.txt and share cards. */
export const PAGE_SETS: PageSet[] = [home, beratung, check, prozess, m365, agenten, anwendungen, schulungen, kompetenz, copilot, trainer, opso, projekte, ueber, kontakt];

export function pageSet(key: PageKey): PageSet | undefined {
  return PAGE_SETS.find((set) => set.de.key === key);
}
