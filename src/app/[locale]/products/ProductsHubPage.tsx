"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FinalCTA } from "@/components/sections/FinalCTA";

export function ProductsHubPage() {
  const { t } = useLocale();
  const h = t.v2.productsHub;

  return (
    <>
      <section className="os-pricing-hero" data-screen-label="Products hero">
        <div className="wrap">
          <span className="meta meta-hot">{h.hero.eyebrow}</span>
          <h1>
            {h.hero.title.pre}
            <span className="editorial">{h.hero.title.italic}</span>
            {h.hero.title.post}
          </h1>
          <p className="lead">{h.hero.lead}</p>
          <div className="os-hero-ctas" style={{ marginTop: 28 }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              {h.hero.primaryCta} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">
              {h.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Featured products">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{h.featured.eyebrow}</span>
            <h2>{h.featured.heading}</h2>
          </div>
          <div className="os-products-featured">
            {h.featured.items.map((item) => (
              <article key={item.id} className="os-product-feature">
                <header className="os-product-feature-head">
                  <h3>{item.name}</h3>
                  <span className="chip chip-hot">
                    <span className="chip-dot chip-dot-live" /> {item.badge}
                  </span>
                </header>
                <p className="os-product-feature-tagline">{item.tagline}</p>
                <p className="os-product-feature-body">{item.body}</p>
                <div className="os-product-feature-foot">
                  <Link
                    href={item.href}
                    className="btn btn-primary btn-sm"
                  >
                    {item.name} <Icon name="arrow" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Products grid">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{h.grid.eyebrow}</span>
            <h2>{h.grid.heading}</h2>
          </div>
          <div className="os-products-grid">
            {h.grid.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="os-product-card"
              >
                <div className="os-product-card-head">
                  <span className="meta">{item.category}</span>
                  <Icon name="arrow" size={16} />
                </div>
                <h3>{item.name}</h3>
                <p className="os-product-card-tagline">{item.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Bottom CTA">
        <div className="wrap os-faq-wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{h.bottomCta.eyebrow}</span>
            <h2>{h.bottomCta.heading}</h2>
            <p className="lead">{h.bottomCta.lead}</p>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              {h.bottomCta.cta} <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
