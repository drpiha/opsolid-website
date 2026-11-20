import type { PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import type { Crumb } from "./Breadcrumbs";
import { HeroBench } from "./hero/HeroBench";
import { HeroStandard } from "./hero/HeroStandard";
import { HeroStudio } from "./hero/HeroStudio";

export { h1Parts } from "./hero/h1";

/**
 * Hero dispatcher (design C). `hero.art === "bench"` is the home hero with the drawn bench pieces (hero/HeroBench,
 * package P1); `hero.studio` is the OpSo card studio (hero/HeroStudio); every other page gets the standard page hero (hero/HeroStandard) with the breadcrumbs inside.
 */
export function Hero({ hero, locale, home, crumbs }: { hero: PageDef["hero"]; locale: L3; home?: boolean; crumbs?: Crumb[] }) {
  if (hero.art === "bench") return <HeroBench hero={hero} locale={locale} />;
  if (hero.studio) return <HeroStudio hero={hero} studio={hero.studio} locale={locale} crumbs={crumbs} />;
  return <HeroStandard hero={hero} locale={locale} crumbs={home ? undefined : crumbs} />;
}
