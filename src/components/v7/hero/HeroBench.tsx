import type { PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { HeroStandard } from "./HeroStandard";

/**
 * Stub from the foundation: the home hero with the drawn bench pieces (exercise sheet and certificate, data in
 * `hero.bench`) is built by package P1 (PLAN 6.1, home.css). Until then it renders the standard hero on ink.
 */
export function HeroBench({ hero, locale }: { hero: PageDef["hero"]; locale: L3 }) {
  return <HeroStandard hero={{ ...hero, tone: "ink" }} locale={locale} />;
}
