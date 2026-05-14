"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * About / Über mich page — Hasan Dönmez's consulting-positioned bio.
 * Copy at `t.v2.about.*`. No employer reference (works as IT PM
 * day-job alongside OpSolid). Photo placeholder uses a "HD" monogram
 * until a real headshot is supplied.
 */
export function AboutPage() {
  const { t } = useLocale();
  const a = t.v2.about;

  return (
    <>
      <section className="os-pricing-hero" data-screen-label="About hero">
        <div className="wrap">
          <span className="meta meta-hot">{a.hero.eyebrow}</span>
          <h1>
            {a.hero.title.pre}
            <span className="editorial">{a.hero.title.italic}</span>
            {a.hero.title.post}
          </h1>
          <p className="lead">{a.hero.lead}</p>
          <div className="os-hero-ctas" style={{ marginTop: 28 }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              {a.hero.primaryCta} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/leistungen" className="btn btn-ghost btn-lg">
              {a.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Principles">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{a.principles.eyebrow}</span>
            <h2>{a.principles.heading}</h2>
          </div>
          <div className="os-services-grid">
            {a.principles.items.map((item, i) => (
              <article key={i} className="os-service-card panel">
                <span className="os-usecase-num meta">{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Founder">
        <div className="wrap os-faq-wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{a.founder.eyebrow}</span>
            <h2>{a.founder.heading}</h2>
          </div>
          <div className="os-founder-body">
            <span className="os-about-founder-monogram" aria-hidden="true">
              HD
            </span>
            {a.founder.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p style={{ marginTop: 18 }}>
              <a
                href={a.founder.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="os-pricing-product-link"
              >
                {a.founder.linkedinLabel} <Icon name="arrow" size={14} />
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="About contact">
        <div className="wrap os-faq-wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{a.contact.eyebrow}</span>
            <h2>{a.contact.heading}</h2>
            <p className="lead">{a.contact.lead}</p>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              {a.contact.cta} <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
