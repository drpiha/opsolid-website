"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FoilCard } from "@/components/products/digital-card/FoilCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { OrderFormSection } from "./sections/OrderFormSection";

/**
 * Digital Card page — industrial-luxury v2 port of digital-card.html.
 * Sections: dc-hero (with FoilCard) → dc-templates (4 industry samples) →
 * how-it-works (3 steps) → order form (preserves existing Stripe flow) →
 * FinalCTA.
 *
 * The order form section extends the Claude Design mock so the pre-market
 * Stripe conversion path stays intact. Visually it wraps the existing
 * OrderFormSection so Stripe checkout logic is untouched; the surrounding
 * chrome uses v2 tokens.
 */
export function DigitalCardPage() {
  const { t } = useLocale();
  const d = t.v2.digitalCard;
  const search = useSearchParams();

  const initialTemplateId = (() => {
    const raw = search?.get("template");
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    initialTemplateId,
  );

  return (
    <>
      <section className="dc-hero" data-screen-label="Digital Card Hero">
        <div className="dc-hero-inner">
          <div>
            <div className="os-hero-meta">
              <span className="chip chip-hot">
                <span className="chip-dot chip-dot-live" /> {d.hero.metaChip}
              </span>
              <span className="meta">{d.hero.metaLabel}</span>
            </div>
            <h1 className="os-hero-title">
              {d.hero.title.pre}
              <span className="editorial">{d.hero.title.italic}</span>
              {d.hero.title.post}
            </h1>
            <p className="os-hero-lead">{d.hero.lead}</p>
            <div className="os-hero-ctas">
              <Link href="#order" className="btn btn-primary btn-lg">
                {d.hero.ctaPrimary} <Icon name="arrow" size={18} />
              </Link>
              <Link href="#templates" className="btn btn-ghost btn-lg">
                {d.hero.ctaSecondary}
              </Link>
            </div>
            <div className="va-features" style={{ marginTop: 36 }}>
              {d.hero.features.map((feat, i) => (
                <div key={i} className="va-feat">
                  <div className="va-feat-label">{feat.label}</div>
                  <div className="va-feat-value">{feat.value}</div>
                  <div className="va-feat-sub">{feat.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <FoilCard />
        </div>
      </section>

      <section className="os-section" id="templates" data-screen-label="Templates">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{d.templates.eyebrow}</span>
            <h2>{d.templates.headline}</h2>
            <p className="lead">{d.templates.lead}</p>
          </div>
          <div className="dc-templates">
            {d.templates.items.map((item, i) => (
              <div key={i} className={"dc-template " + item.cls}>
                <div className="dc-template-sector">{item.sector}</div>
                <div>
                  <div className="dc-template-name">{item.name}</div>
                  <div className="dc-template-role">{item.role}</div>
                </div>
                <div className="dc-template-bottom">
                  <span>{item.code}</span>
                  <span className="dc-template-dot" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="How">
        <div className="wrap">
          <div className="os-process">
            <div className="os-process-intro">
              <span className="meta meta-hot">{d.howItWorks.eyebrow}</span>
              <h2>{d.howItWorks.headline}</h2>
              <p className="lead">{d.howItWorks.lead}</p>
            </div>
            <div className="os-process-steps">
              {d.howItWorks.steps.map((step, i) => (
                <div key={i} className="os-process-step">
                  <div className="os-process-step-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="os-section" id="order" data-screen-label="Order">
        <div className="wrap">
          <OrderFormSection
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={setSelectedTemplateId}
          />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
