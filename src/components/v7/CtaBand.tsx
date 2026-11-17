import type { Cta } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "./LinkTo";
import { Reveal } from "./Reveal";
import { btnOnInk, linkDeep, wrap } from "./ui";
import { Etikett } from "./werkstatt/Etikett";
import { WkPicture } from "./werkstatt/WkPicture";

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

/**
 * The closing copper band of a page (design C): copper-deep ground with the mat, paper text only (muted-d and
 * copper-lite fail AA on the band), the Etikett with `cta.label`, H2, one paragraph, the paper button and the
 * secondary text link. With `cta.pic` the labelled render fills the band behind a copper gradient that keeps the
 * copy on copper; its Etikett sits on a dark pill. No last-word emphasis any more.
 */
export function CtaBand({ cta, locale }: { cta: Cta; locale: L3 }) {
  const pic = cta.pic;
  return (
    <section id="cta" aria-labelledby="cta-h" className={`wk-cta-band wk-mat${pic ? " has-pic" : ""}`}>
      {pic && <WkPicture pic={pic} className="wk-cta-pic" sizes="100vw" />}
      <div className={`${wrap} wk-cta-grid`}>
        <Reveal>
          <Etikett solid as="p">
            {cta.label}
          </Etikett>
          <h2 id="cta-h" className="wk-d2 mt-5">
            {cta.h}
          </h2>
          <p>{cta.p}</p>
        </Reveal>
        <div className="wk-cta-actions">
          <LinkTo link={cta.primary} locale={locale} className={`${btnOnInk} v7-link`}>
            {cta.primary.label}
            {arrow}
          </LinkTo>
          {cta.secondary && (
            <LinkTo link={cta.secondary} locale={locale} className={linkDeep}>
              {cta.secondary.label}
            </LinkTo>
          )}
        </div>
      </div>
      {pic && <Etikett className="wk-cta-cap">{pic.etikett}</Etikett>}
    </section>
  );
}
