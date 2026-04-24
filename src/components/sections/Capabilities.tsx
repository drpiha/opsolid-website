"use client";

import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

type IconName = "workflow" | "plug" | "bot" | "radio" | "ship" | "shield";

/**
 * Six capability cards. Copy driven by `t.v2.home.capabilities.*`. Icon names
 * in the content tree map directly to `shared/Icon` glyphs.
 */
export function Capabilities() {
  const { t } = useLocale();
  const c = t.v2.home.capabilities;

  return (
    <section className="os-section" id="capabilities" data-screen-label="Capabilities">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{c.eyebrow}</span>
          <h2>{c.headline}</h2>
          <p className="lead">{c.lead}</p>
        </div>
        <div className="os-cap-grid">
          {c.cards.map((card, i) => (
            <article key={i} className="os-cap">
              <div className="os-cap-icon">
                <Icon name={card.icon as IconName} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              {card.tag && <span className="os-cap-tag">{card.tag}</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
