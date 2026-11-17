import type { BlockProps } from "@/content/v7/types";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";

/**
 * Offer ladder or rate cards (.wk-rate: 1.5 px ink border, hard offset shadow). A price is shown only when the page
 * data carries a published one; it sits in the display face with its unit as a mono line. Points are square ticks.
 * The terms line (`footnote`) closes the block.
 */
export function OffersBlock({ block: b, locale, num }: BlockProps<"offers">) {
  const cols = b.items.length === 4 ? "is-4" : b.items.length >= 3 ? "is-3" : "is-2";
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ol className={`wk-rates ${cols}`}>
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.name} delay={(i % 4) * 0.06} className={`wk-rate${it.featured ? " is-featured" : ""}`}>
            <div className="wk-rate-body">
              <p className="wk-ledger-no">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="wk-card-h">{it.name}</h3>
              {it.price && (
                <p className="wk-rate-price">
                  <span className="wk-rate-fig">{it.price}</span>
                  {it.unit && <span className="wk-mono wk-muted">{it.unit}</span>}
                </p>
              )}
              <p className="wk-rate-p">{it.p}</p>
              <ul className="wk-ticks wk-rate-points">
                {it.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            {it.href && (
              <div className="wk-rate-foot">
                <LinkTo link={it.href} locale={locale} className={`${linkDeep} v7-link`}>
                  {it.href.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              </div>
            )}
          </Reveal>
        ))}
      </ol>
      <p className="wk-foot-note">{b.footnote}</p>
    </Section>
  );
}
