"use client";

import { useLocale } from "@/context/LocaleContext";
import { PricingTable } from "@/components/sections/PricingTable";
import { FinalCTA } from "@/components/sections/FinalCTA";

export function PricingPage() {
  const { t } = useLocale();
  const p = t.v2.pricing;

  return (
    <>
      <section
        className="os-pricing-hero"
        data-screen-label="Pricing Hero"
      >
        <div className="wrap">
          <span className="meta meta-hot">{p.hero.eyebrow}</span>
          <h1>
            {p.hero.title.pre}
            <span className="editorial">{p.hero.title.italic}</span>
            {p.hero.title.post}
          </h1>
          <p className="lead">{p.hero.lead}</p>
          <p className="os-pricing-vat">{p.hero.vatNotice}</p>
        </div>
      </section>

      <PricingTable showHeading={false} />

      <section className="os-pricing-bundles" data-screen-label="Bundles">
        <div className="wrap">
          <span className="meta meta-hot">{p.bundles.eyebrow}</span>
          <h2>{p.bundles.heading}</h2>
          <p className="lead">{p.bundles.lead}</p>
          <div className="os-pricing-bundle-grid">
            {p.bundles.items.map((item, i) => (
              <div key={i} className="os-pricing-bundle-card">
                <span className="os-pricing-bundle-rule">{item.rule}</span>
                <span className="os-pricing-bundle-benefit">
                  {item.benefit}
                </span>
              </div>
            ))}
          </div>
          <p className="os-pricing-bundle-note">{p.bundles.note}</p>
        </div>
      </section>

      <div className="os-pricing-footnote">
        <div className="wrap">{p.footnote}</div>
      </div>

      <FinalCTA />
    </>
  );
}
