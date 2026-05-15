"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

type ServiceIcon = "bot" | "workflow" | "plug" | "shield" | "ship" | "radio" | "spark";

/**
 * /leistungen — services overview hub.
 * Sections: Hero · Service cards (link to sub-pages) · Process recap · FAQ · Final CTA.
 * All copy at `t.v2.leistungen.*`. Each card.slug becomes the route under /{locale}/{slug}.
 */
export function LeistungenPage() {
  const { t } = useLocale();
  const l = t.v2.leistungen;

  return (
    <main>
      {/* ----- Hero ----- */}
      <section className="os-leistungen-hero">
        <div className="wrap">
          <div className="os-hero-with-image">
            <div>
              <div className="os-hero-meta">
                {l.hero.metaChip && (
                  <span className="chip chip-hot">
                    <span className="chip-dot chip-dot-live" /> {l.hero.metaChip}
                  </span>
                )}
                {l.hero.metaLabel && <span className="meta">{l.hero.metaLabel}</span>}
              </div>
              <h1>
                {l.hero.title.pre}
                <span className="editorial">{l.hero.title.italic}</span>
                {l.hero.title.post}
              </h1>
              <p className="lead">{l.hero.lead}</p>
              <div className="os-aac-hero-ctas">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  {l.hero.ctaPrimary} <Icon name="arrow" size={18} />
                </Link>
                <Link href="/ai-automation-check" className="btn btn-ghost btn-lg">
                  {l.hero.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="os-hero-image-frame">
              <Image
                src="/images/sections/leistungen.jpg"
                alt="Macro of a circuit board with warm metallic capacitors and a precision-soldered chip — the technical infrastructure underneath AI, automation and internal tools."
                width={1200}
                height={960}
                priority
                sizes="(max-width: 960px) 100vw, 50vw"
              />
              <span className="os-hero-image-tag">{l.hero.metaLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----- Service cards ----- */}
      <section
        className="os-section os-services-section"
        id="services"
        aria-labelledby="services-headline"
      >
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{l.cards.eyebrow}</span>
            <h2 id="services-headline">{l.cards.headline}</h2>
            <p className="lead">{l.cards.lead}</p>
          </div>

          <div className="os-services-overview-grid">
            {l.cards.items.map((card) => (
              <Link
                key={card.slug}
                href={`/${card.slug}`}
                className="os-service-overview-card panel"
              >
                <div className="os-service-icon" aria-hidden="true">
                  <Icon name={card.icon as ServiceIcon} size={28} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                {card.tag && <span className="os-service-tag meta">{card.tag}</span>}
                <span className="os-service-link">
                  {card.linkLabel} <Icon name="arrow" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----- Process recap ----- */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{l.process.eyebrow}</span>
            <h2>{l.process.headline}</h2>
            <p className="lead">{l.process.lead}</p>
          </div>
          <div className="os-services-grid">
            {l.process.steps.map((step, i) => (
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
        eyebrow={l.faq.eyebrow}
        headline={l.faq.headline}
        items={l.faq.items}
        id="leistungen-faq"
      />

      {/* ----- Final CTA ----- */}
      <section className="os-final-cta">
        <div className="wrap">
          <span
            className="meta meta-hot"
            style={{ marginBottom: 20, display: "inline-block" }}
          >
            {l.finalCta.eyebrow}
          </span>
          <h2>
            {l.finalCta.title.pre}
            <span className="editorial">{l.finalCta.title.italic}</span>
            {l.finalCta.title.post}
          </h2>
          <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            {l.finalCta.lead}
          </p>
          <div className="os-hero-ctas">
            <Link href="/ai-automation-check" className="btn btn-primary btn-lg">
              {l.finalCta.ctaPrimary} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">
              {l.finalCta.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
