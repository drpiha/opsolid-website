"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { CapabilityShowcase } from "./CapabilityShowcase";

type IconName = "workflow" | "plug" | "bot" | "radio" | "ship" | "shield";

/**
 * Six capability cards. Copy driven by `t.v2.home.capabilities.*`. Icon names
 * in the content tree map directly to `shared/Icon` glyphs.
 *
 * Click behaviour: tapping any card opens a stage panel below the grid that
 * runs a per-capability animation — workflow pipeline, integration hub, AI
 * router, internal-tools dashboard, voice waveform, GDPR shield. Click the
 * same card to close it. Reduced-motion users see a static label fallback.
 */
export function Capabilities() {
  const { t } = useLocale();
  const c = t.v2.home.capabilities;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? c.cards[activeIndex] : null;

  return (
    <section
      className="os-section os-cap-section"
      id="capabilities"
      data-screen-label="Capabilities"
    >
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{c.eyebrow}</span>
          <h2>{c.headline}</h2>
          <p className="lead">{c.lead}</p>
        </div>

        <div className="os-cap-grid" role="tablist" aria-label={c.headline}>
          {c.cards.map((card, i) => {
            const selected = activeIndex === i;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-expanded={selected}
                aria-controls="capability-showcase"
                onClick={() => setActiveIndex(selected ? null : i)}
                className={`os-cap${selected ? " os-cap-active" : ""}`}
              >
                <div className="os-cap-icon">
                  <Icon name={card.icon as IconName} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                {card.tag && <span className="os-cap-tag">{card.tag}</span>}
                <span className="os-cap-affordance" aria-hidden="true">
                  {selected ? c.closeAffordance : c.seeAffordance}
                </span>
              </button>
            );
          })}
        </div>

        <div id="capability-showcase">
          <CapabilityShowcase
            iconType={(active?.icon as IconName) ?? null}
            title={active?.title ?? ""}
            body={active?.body ?? ""}
            tag={active?.tag}
          />
        </div>
      </div>
    </section>
  );
}
