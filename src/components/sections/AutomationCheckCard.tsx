"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

/**
 * Offer card on the homepage — "AI & Automation Check" entry engagement.
 * Single highlighted panel with bullets, price-on-request line and a
 * direct CTA to the standalone /ai-automation-check page. Copy at
 * `t.v2.home.automationCheckCard.*`.
 */
export function AutomationCheckCard() {
  const { t } = useLocale();
  const a = t.v2.home.automationCheckCard;

  return (
    <section className="os-section os-offer-section" id="automation-check" aria-labelledby="offer-headline">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{a.eyebrow}</span>
        </div>

        <article className="os-offer-card panel">
          <div className="os-offer-card-head">
            <span className="chip chip-hot">
              <span className="chip-dot chip-dot-live" /> {a.badge}
            </span>
            <h2 id="offer-headline">
              {a.title.pre}
              <span className="editorial">{a.title.italic}</span>
              {a.title.post}
            </h2>
            <p className="lead">{a.lead}</p>
          </div>

          <ul className="os-offer-bullets" role="list">
            {a.bullets.map((b, i) => (
              <li key={i}>
                <span className="os-offer-check" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="os-offer-foot">
            <div className="os-offer-price meta">{a.priceNote}</div>
            <div className="os-offer-ctas">
              <Link href="/ai-automation-check" className="btn btn-primary btn-lg">
                {a.ctaPrimary} <Icon name="arrow" size={18} />
              </Link>
              <Link href="/ai-automation-check" className="btn btn-ghost btn-lg">
                {a.ctaSecondary}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
