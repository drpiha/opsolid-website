"use client";

import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

type ServiceIcon = "bot" | "workflow" | "plug" | "shield" | "ship" | "radio" | "spark";

/**
 * "Was OpSolid für Sie übernimmt" — the four consulting service pillars.
 * Replaces the older 6-card Capabilities grid for the consulting-positioned
 * homepage. Copy at `t.v2.home.services.*`. Anchored at `#services` so the
 * header `/leistungen` shortcut lands here until a full page is built.
 */
export function ServicesGrid() {
  const { t } = useLocale();
  const s = t.v2.home.services;

  return (
    <section className="os-section os-services-section" id="services" aria-labelledby="services-headline">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{s.eyebrow}</span>
          <h2 id="services-headline">{s.headline}</h2>
          <p className="lead">{s.lead}</p>
        </div>

        <div className="os-services-grid">
          {s.cards.map((card, i) => (
            <article key={i} className="os-service-card panel">
              <div className="os-service-icon" aria-hidden="true">
                <Icon name={card.icon as ServiceIcon} size={28} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              {card.tag && <span className="os-service-tag meta">{card.tag}</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
