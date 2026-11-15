import type { PageDef } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import type { L3 } from "@/lib/v7-routes";
import { soft } from "@/lib/soft-hyphen";
import { Breadcrumbs, type Crumb } from "../Breadcrumbs";
import { LinkTo } from "../LinkTo";
import { MediaFigure } from "../MediaFigure";
import { btnOnInk, btnPrimary, linkDeep, wrap } from "../ui";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { FactsStrip } from "../werkstatt/FactsStrip";
import { WkPicture } from "../werkstatt/WkPicture";
import { h1Text } from "./h1";

/** Rule 1: every price group carries the price note. A hero fact line or strip that names a euro amount gets
 * SITE_STR.priceNote unless the page set its own `stripNote` (it serves the fact line too) or the facts already say it. */
const hasPrice = (xs: string[]) => xs.some((x) => x.includes("€"));
const saysNote = (xs: string[]) => xs.some((x) => /USt\.|of VAT|KDV/.test(x));

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

/**
 * The C page hero: paper with the mat (or ink with `tone: "ink"`). Copy column: breadcrumbs, the eyebrow as a solid
 * Etikett, H1 (.wk-d1, no italic emphasis), lede, the primary button and the secondary text link, optional jump
 * pills. Right column: a labelled picture that bleeds to the viewport edge (`picture`), else the restyled figure
 * (`media`). Under the grid: the index rows (Produkte), then the ruler fact strip with its price note (`strip`,
 * `stripNote`) or the mono fact line (`facts`).
 */
export function HeroStandard({ hero, locale, crumbs }: { hero: PageDef["hero"]; locale: L3; crumbs?: Crumb[] }) {
  const ink = hero.tone === "ink";
  const strip = hero.strip && hero.strip.length > 0 ? hero.strip : null;
  const priceNote = SITE_STR[locale].priceNote;
  const stripVals = strip ? strip.map(([, v]) => v) : [];
  const stripNote = hero.stripNote ?? (hasPrice(stripVals) && !saysNote(stripVals) ? priceNote : undefined);
  const facts = hero.facts ?? [];
  const factsNote = hero.stripNote ?? (hasPrice(facts) && !saysNote(facts) ? priceNote : null);
  const pic = hero.picture;
  const side = pic ? "pic" : hero.media ? "media" : "none";
  return (
    <section
      aria-labelledby="hero-h"
      className={`wk-page-hero wk-mat ${ink ? "wk-on-ink" : "is-light"}${side === "pic" ? " has-pic" : ""}${side === "none" ? " is-text" : ""}${strip ? " has-strip" : ""}`}
    >
      <div className={`${wrap} wk-page-hero-grid`}>
        <div className="wk-page-hero-copy">
          {crumbs && crumbs.length > 1 && <Breadcrumbs crumbs={crumbs} locale={locale} />}
          <Etikett solid as="p">
            {hero.eyebrow}
          </Etikett>
          <h1 id="hero-h" className="wk-d1">
            {soft(h1Text(hero.h1))}
          </h1>
          <p className="wk-lede">{hero.lede}</p>
          {(hero.primary || hero.secondary) && (
            <div className="wk-page-hero-cta">
              {hero.primary && (
                <LinkTo link={hero.primary} locale={locale} className={`${ink ? btnOnInk : btnPrimary} v7-link`}>
                  {hero.primary.label}
                  {arrow}
                </LinkTo>
              )}
              {hero.secondary && (
                <LinkTo link={hero.secondary} locale={locale} className={`${linkDeep} v7-link`}>
                  {hero.secondary.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              )}
            </div>
          )}
          {hero.jump && hero.jump.links.length > 0 && (
            // The jump pills stand alone as in the prototype; the nav keeps its accessible name.
            <nav className="wk-jump" aria-label={hero.jump.label}>
              {hero.jump.links.map((l) => (
                <LinkTo key={l.label} link={l} locale={locale}>
                  {l.label}
                </LinkTo>
              ))}
            </nav>
          )}
        </div>

        {pic && (
          <figure className="wk-hero-pic">
            <WkPicture pic={{ ...pic, priority: pic.priority ?? true }} />
            <Etikett as="figcaption">{pic.etikett}</Etikett>
          </figure>
        )}
        {!pic && hero.media && (
          <div className="wk-hero-media v7-rise" style={{ ["--d" as string]: "200ms" }}>
            <MediaFigure media={hero.media} locale={locale} priority />
          </div>
        )}
      </div>

      {hero.index && hero.index.length > 0 && (
        <div className={wrap}>
          <ul className="wk-hero-index">
            {hero.index.map((row) => (
              <li key={row.name}>
                <LinkTo link={row.to} locale={locale} className="wk-hero-index-row">
                  <span className="wk-hero-index-k">{row.k}</span>
                  <span className="wk-hero-index-name">{row.name}</span>
                  <ChipTag chip={row.chip} />
                  <span className="wk-hero-index-go" aria-hidden="true">
                    →
                  </span>
                </LinkTo>
              </li>
            ))}
          </ul>
        </div>
      )}

      {strip ? (
        <div className={wrap}>
          <FactsStrip items={strip} note={stripNote} tone={ink ? "dark" : "light"} />
        </div>
      ) : (
        facts.length > 0 && (
          <div className={wrap}>
            <ul className={`wk-hero-facts${factsNote ? " has-note" : ""}`}>
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {factsNote && <p className="wk-hero-facts-note">{factsNote}</p>}
          </div>
        )
      )}
    </section>
  );
}
