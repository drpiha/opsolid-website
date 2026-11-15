import { Fragment, type ReactNode } from "react";
import type { PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { btnOnInk, linkDeep, wrap } from "../ui";
import { Etikett } from "../werkstatt/Etikett";
import { FactsStrip } from "../werkstatt/FactsStrip";
import { BenchExercise } from "../werkstatt/home/BenchExercise";
import { Certificate } from "../werkstatt/home/Certificate";
import { h1Parts } from "./h1";

/** Sets the given parts of the lede in the light text colour (the three ways); the rest stays muted. */
function strong(text: string, parts: string[] = []): ReactNode {
  if (!parts.length) return text;
  const esc = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text.split(new RegExp(`(${esc.join("|")})`)).map((s, i) => (parts.includes(s) ? <b key={i}>{s}</b> : <Fragment key={i}>{s}</Fragment>));
}

/**
 * The home hero (design C, PLAN 6.1): ink with the mat and a copper glow. Copy column: the kicker, the H1 (the middle
 * part in copper-lite, upright), the lede with the three ways in light text, the primary button and the text link.
 * Right: the bench, two drawn workpieces lying on the mat (the sample exercise and the sample participation record),
 * each with its Etikett, framed by register marks. They lay in once (80 / 220 / 700 ms) under no-preference only;
 * the end keyframes read their resting rotation from --rest-a / --rest-b, so every breakpoint keeps its own angle.
 * Under the grid: the ruler fact strip and the price note (`stripNote`; the automatic note runs only in HeroStandard).
 */
export function HeroBench({ hero, locale }: { hero: PageDef["hero"]; locale: L3 }) {
  const [pre, em, post] = h1Parts(hero.h1);
  const bench = hero.bench;
  const strip = hero.strip && hero.strip.length > 0 ? hero.strip : null;
  return (
    <section aria-labelledby="hero-h" className="wk-hero wk-on-ink wk-mat">
      <div className={`${wrap} wk-hero-grid`}>
        <div className="wk-hero-copy">
          <p className="wk-hero-kicker">{hero.eyebrow}</p>
          <h1 id="hero-h" className="wk-d1">
            {soft(pre)}
            {em && <span className="wk-hero-em">{em}</span>}
            {soft(post)}
          </h1>
          <p className="wk-lede wk-hero-lede">{strong(hero.lede, bench?.ledeStrong)}</p>
          {(hero.primary || hero.secondary) && (
            <div className="wk-hero-cta">
              {hero.primary && (
                <LinkTo link={hero.primary} locale={locale} className={`${btnOnInk} v7-link`}>
                  {hero.primary.label}
                </LinkTo>
              )}
              {hero.secondary && (
                <LinkTo link={hero.secondary} locale={locale} className={`${linkDeep} v7-link`}>
                  {hero.secondary.label}
                </LinkTo>
              )}
            </div>
          )}
        </div>

        {bench && (
          <div className="wk-bench" role="group" aria-label={bench.ariaLabel}>
            <i className="wk-reg tr" aria-hidden="true" />
            <i className="wk-reg bl" aria-hidden="true" />
            <i className="wk-reg br" aria-hidden="true" />
            <Etikett className="wk-bench-tag-a">{bench.exercise.etikett}</Etikett>
            <BenchExercise x={bench.exercise} />
            <Certificate x={bench.certificate} />
            <Etikett className="wk-bench-tag-b">{bench.certificate.etikett}</Etikett>
          </div>
        )}
      </div>

      {strip && (
        <div className={wrap}>
          <FactsStrip items={strip} note={hero.stripNote} tone="dark" />
        </div>
      )}
    </section>
  );
}
