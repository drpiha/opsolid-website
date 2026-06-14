"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { VoiceVisualizer } from "@/components/products/voice-agent/VoiceVisualizer";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Voice Agent page — industrial-luxury v2 port of voice-agent.html.
 * Sections: va-hero (with VoiceVisualizer centerpiece) → va-flow →
 * va-spec → FinalCTA.
 *
 * All copy driven by `t.v2.voiceAgent.*` so EN / DE / TR stay in sync.
 */
export function VoiceAgentPage() {
  const { t } = useLocale();
  const v = t.v2.voiceAgent;

  return (
    <>
      <section className="va-hero" data-screen-label="Voice Hero">
        <div className="va-hero-inner">
          <div>
            <div className="os-hero-meta">
              <span className="chip chip-hot">
                <span className="chip-dot chip-dot-live" /> {v.hero.metaChip}
              </span>
              <span className="meta">{v.hero.metaLabel}</span>
            </div>
            <h1 className="os-hero-title">
              {v.hero.title.pre}
              <span className="editorial">{v.hero.title.italic}</span>
              {v.hero.title.post}
            </h1>
            <p className="os-hero-lead">{v.hero.lead}</p>
            <div className="os-hero-ctas">
              <Link href="/contact" className="btn btn-primary btn-lg">
                {v.hero.ctaPrimary} <Icon name="arrow" size={18} />
              </Link>
              <Link href="#flow" className="btn btn-ghost btn-lg">
                {v.hero.ctaSecondary}
              </Link>
            </div>
            <div className="va-features">
              {v.hero.features.map((feat, i) => (
                <div key={i} className="va-feat">
                  <div className="va-feat-label">{feat.label}</div>
                  <div className="va-feat-value">
                    {feat.value}
                    {feat.unit && (
                      <small
                        style={{
                          fontSize: 12,
                          color: "var(--ink-400)",
                          fontWeight: 400,
                        }}
                      >
                        {" "}
                        {feat.unit}
                      </small>
                    )}
                  </div>
                  <div className="va-feat-sub">{feat.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <VoiceVisualizer />
        </div>
      </section>

      <section className="os-section" id="flow" data-screen-label="Flow">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{v.flow.eyebrow}</span>
            <h2>{v.flow.headline}</h2>
            <p className="lead">{v.flow.lead}</p>
          </div>
          <div className="va-flow">
            {v.flow.steps.map((step, i) => (
              <div key={i} className="va-step">
                <div className="va-step-num">{step.num}</div>
                <div className="va-step-title">{step.title}</div>
                <div className="va-step-body">{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Spec">
        <div className="wrap">
          <div className="os-process">
            <div className="os-process-intro">
              <span className="meta meta-hot">{v.spec.eyebrow}</span>
              <h2>{v.spec.headline}</h2>
              <p className="lead">{v.spec.lead}</p>
            </div>
            <div className="va-spec">
              {v.spec.rows.map((row, i) => (
                <div key={i} className="va-spec-row">
                  <div className="va-spec-label">{row.label}</div>
                  <div className="va-spec-value">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
