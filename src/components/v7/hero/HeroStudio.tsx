import dynamic from "next/dynamic";
import type { PageDef } from "@/content/v7/types";
import type { StudioText } from "@/content/v7/types-produkte";
import type { L3 } from "@/lib/v7-routes";
import { soft } from "@/lib/soft-hyphen";
import { Breadcrumbs, type Crumb } from "../Breadcrumbs";
import { wrap } from "../ui";
import { Etikett } from "../werkstatt/Etikett";
import { h1Text } from "./h1";

/**
 * The OpSo card studio as a page hero (`hero.studio`, page `opsoKarte`): the live card on its mat is the hero object,
 * the copy and the job ticket share the other column, the mono fact line closes the hero. The interactive part is
 * its own chunk (next/dynamic), requested on this page only. Without JS the mat shows the sample card and the ticket
 * its fields.
 */
const StudioClient = dynamic(() => import("./studio-client").then((m) => m.StudioClient));

export function HeroStudio({ hero, studio, locale, crumbs }: { hero: PageDef["hero"]; studio: StudioText; locale: L3; crumbs?: Crumb[] }) {
  const facts = hero.facts ?? [];
  return (
    <section aria-labelledby="hero-h" className="wk-page-hero wk-studio-hero is-light">
      <div className={wrap}>
        {crumbs && crumbs.length > 1 && <Breadcrumbs crumbs={crumbs} locale={locale} />}
        <StudioClient
          t={studio}
          locale={locale}
          head={
            <>
              <Etikett solid as="p">
                {hero.eyebrow}
              </Etikett>
              <h1 id="hero-h" className="wk-d1">
                {soft(h1Text(hero.h1))}
              </h1>
              <p className="wk-lede">{hero.lede}</p>
            </>
          }
        />
      </div>
      {facts.length > 0 && (
        <div className={wrap}>
          <ul className="wk-hero-facts">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
