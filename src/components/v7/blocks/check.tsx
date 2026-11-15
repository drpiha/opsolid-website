import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { btnPrimary, h2, linkDeep, wrap } from "../ui";
import { Etikett } from "../werkstatt/Etikett";
import { HomeSection } from "../werkstatt/home/HomeSection";
import { ReportBlatt } from "../werkstatt/home/ReportBlatt";

/**
 * The KI-Check on the home page (slate, PLAN 6.1): copy left (Etikett, H2, lede, the price row with "netto,
 * Festpreis" and the 60-day credit, three tick points, the request button and the page link, the price note), the
 * sample report right (rotated sheet over a blank one). Phones: one column, no rotation, the report shortened.
 */
export function CheckBlock({ block: b, locale }: BlockProps<"check">) {
  return (
    <HomeSection id={b.id} ground={b.ground ?? "slate"} mat={b.mat} className="wk-check-sec">
      <div className={`${wrap} wk-check-grid`}>
        <div className="wk-check-copy">
          <Etikett>{b.etikett}</Etikett>
          <h2 id={`${b.id}-h`} className={h2}>
            {soft(b.h)}
          </h2>
          {b.lede && <p className="wk-check-lede">{b.lede}</p>}
          <div className="wk-check-price">
            <span className="wk-price-fig">{b.price}</span>
            <span className="wk-check-terms">
              <b>{b.terms[0]}</b>
              <span>{b.terms[1]}</span>
            </span>
          </div>
          <ul className="wk-ticks">
            {b.points.map((pt) => (
              <li key={pt.b}>
                <span>
                  <b>{pt.b}</b>
                  {pt.rest}
                </span>
              </li>
            ))}
          </ul>
          <div className="wk-check-go">
            <LinkTo link={b.primary} locale={locale} className={`${btnPrimary} v7-link`}>
              {b.primary.label}
            </LinkTo>
            {b.secondary && (
              <LinkTo link={b.secondary} locale={locale} className={`${linkDeep} v7-link`}>
                {b.secondary.label}
              </LinkTo>
            )}
          </div>
          <p className="wk-check-note">{b.priceNote}</p>
        </div>
        <div className="wk-check-pic">
          <ReportBlatt r={b.report} />
          <Etikett className="wk-check-tag">{b.report.etikett}</Etikett>
        </div>
      </div>
    </HomeSection>
  );
}
