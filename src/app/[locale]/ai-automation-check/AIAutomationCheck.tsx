"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

/**
 * /ai-automation-check — entry-engagement landing page.
 * Sections: Hero · Problem · Package · Audience · Deliverables · Process ·
 * FAQ · FinalCTA. All copy is locale-driven via `t.v2.aiAutomationCheckPage`.
 */
export function AIAutomationCheck() {
  const { t } = useLocale();
  const p = t.v2.aiAutomationCheckPage;

  return (
    <main>
      {/* ----- Hero ----- */}
      <section className="os-aac-hero">
        <div className="wrap">
          <div className="os-hero-meta">
            {p.hero.metaChip && (
              <span className="chip chip-hot">
                <span className="chip-dot chip-dot-live" /> {p.hero.metaChip}
              </span>
            )}
            {p.hero.metaLabel && <span className="meta">{p.hero.metaLabel}</span>}
          </div>
          <h1>
            {p.hero.title.pre}
            <span className="editorial">{p.hero.title.italic}</span>
            {p.hero.title.post}
          </h1>
          <p className="lead">{p.hero.lead}</p>
          <div className="os-aac-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              {p.hero.ctaPrimary} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/" className="btn btn-ghost btn-lg">
              {p.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ----- Problem ----- */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{p.problem.eyebrow}</span>
            <h2>{p.problem.headline}</h2>
            <p className="lead">{p.problem.lead}</p>
          </div>
          <ul className="os-aac-list">
            {p.problem.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Package contents ----- */}
      <section className="os-section os-services-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{p.package.eyebrow}</span>
            <h2>{p.package.headline}</h2>
          </div>
          <ul className="os-aac-bullets">
            {p.package.bullets.map((b, i) => (
              <li key={i}>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Audience ----- */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{p.audience.eyebrow}</span>
            <h2>{p.audience.headline}</h2>
          </div>
          <ul className="os-aac-list">
            {p.audience.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Deliverables ----- */}
      <section className="os-section os-target-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{p.deliverables.eyebrow}</span>
            <h2>{p.deliverables.headline}</h2>
          </div>
          <ul className="os-aac-list">
            {p.deliverables.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Process ----- */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{p.process.eyebrow}</span>
            <h2>{p.process.headline}</h2>
          </div>
          <div className="os-services-grid">
            {p.process.steps.map((step, i) => (
              <article key={i} className="os-service-card panel">
                <span className="os-usecase-num meta">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----- FAQ ----- */}
      <FaqAccordion
        eyebrow={p.faq.eyebrow}
        headline={p.faq.headline}
        items={p.faq.items}
        id="aac-faq"
      />

      {/* ----- Final CTA ----- */}
      <section className="os-final-cta">
        <div className="wrap">
          <span
            className="meta meta-hot"
            style={{ marginBottom: 20, display: "inline-block" }}
          >
            {p.finalCta.eyebrow}
          </span>
          <h2>
            {p.finalCta.title.pre}
            <span className="editorial">{p.finalCta.title.italic}</span>
            {p.finalCta.title.post}
          </h2>
          <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            {p.finalCta.lead}
          </p>
          <div className="os-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              {p.finalCta.ctaPrimary} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">
              {p.finalCta.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
