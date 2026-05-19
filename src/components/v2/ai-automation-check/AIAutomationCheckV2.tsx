"use client";

/**
 * AIAutomationCheckV2 — v2 register port of /ai-automation-check.
 *
 *  - Editorial hero with eyebrow chip + display headline (italic accent)
 *    + lead + two CTAs. Tight composition, no chrome.
 *  - Body sections reuse the .v2-svc-* primitives so it sits cleanly in
 *    the same register as Prozess / KI-Beratung detail pages.
 *  - Source content stays at `t.v2.aiAutomationCheckPage` — no copy
 *    duplication; we only swap the presentation surface.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  V2WhatWeDo,
  V2UseCases,
  V2Process,
  V2FinalCta,
} from "@/components/v2/services/ServiceSections";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export function AIAutomationCheckV2() {
  const { t } = useLocale();
  const p = t.v2.aiAutomationCheckPage;

  return (
    <>
      {/* Hero — editorial register */}
      <section className="v2-aac-hero">
        <div className="wrap v2-aac-hero__inner">
          <div className="v2-aac-hero__meta">
            {p.hero.metaChip && (
              <span className="v2-aac-hero__chip">
                <span className="v2-aac-hero__chip-dot" aria-hidden="true" />
                {p.hero.metaChip}
              </span>
            )}
            {p.hero.metaLabel && (
              <span className="v2-aac-hero__meta-label">{p.hero.metaLabel}</span>
            )}
          </div>

          <h1 className="v2-aac-hero__headline">
            {p.hero.title.pre}
            <em className="v2-aac-hero__headline-em">{p.hero.title.italic}</em>
            {p.hero.title.post}
          </h1>

          <p className="v2-aac-hero__lead">{p.hero.lead}</p>

          <div className="v2-aac-hero__ctas">
            <Link href="/contact" className="v2-btn-primary" data-cursor="link">
              {p.hero.ctaPrimary}
            </Link>
            <Link href="/" className="v2-btn-ghost" data-cursor="link">
              {p.hero.ctaSecondary}
            </Link>
          </div>
        </div>
        {/* Decorative trace lines — pure CSS, theme-aware */}
        <div className="v2-aac-hero__trace" aria-hidden="true" />
      </section>

      {/* Problem — list of why-it-exists tiles */}
      <V2WhatWeDo
        eyebrow={p.problem.eyebrow}
        headline={p.problem.headline}
        bullets={p.problem.items}
      />

      {/* Package — what's included */}
      <V2UseCases
        eyebrow={p.package.eyebrow}
        headline={p.package.headline}
        items={p.package.bullets.map((b) => ({
          title: b.title,
          body: b.body,
        }))}
      />

      {/* Audience — who it's for */}
      <V2WhatWeDo
        eyebrow={p.audience.eyebrow}
        headline={p.audience.headline}
        bullets={p.audience.items}
      />

      {/* Deliverables */}
      <V2WhatWeDo
        eyebrow={p.deliverables.eyebrow}
        headline={p.deliverables.headline}
        bullets={p.deliverables.items}
      />

      {/* Process */}
      <V2Process
        eyebrow={p.process.eyebrow}
        headline={p.process.headline}
        steps={p.process.steps.map((s) => ({
          num: s.num,
          title: s.title,
          body: s.body,
        }))}
      />

      {/* FAQ — reuse existing accordion (its CSS already lives in opsolid-site.css) */}
      <section className="v2-svc-section">
        <div className="wrap">
          <FaqAccordion
            eyebrow={p.faq.eyebrow}
            headline={p.faq.headline}
            items={p.faq.items}
            id="aac-faq"
          />
        </div>
      </section>

      <V2FinalCta
        eyebrow={p.finalCta.eyebrow}
        title={p.finalCta.title}
        lead={p.finalCta.lead}
        ctaPrimary={p.finalCta.ctaPrimary}
        ctaSecondary={p.finalCta.ctaSecondary}
        primaryHref="/contact"
        secondaryHref="/contact"
      />
    </>
  );
}
