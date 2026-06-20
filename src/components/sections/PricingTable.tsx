"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  productIds?: string[];
  showHeading?: boolean;
  showProductHeading?: boolean;
  showProductLink?: boolean;
  /**
   * Overrides the primary (non-contact) tier CTA target. Defaults to the
   * product's own href. Pass e.g. "/card/new" to send plan CTAs straight into
   * a flow instead of back to the product page.
   */
  ctaHref?: string;
  /**
   * CTA target for "contact-style" tiers — the Enterprise tier plus any tier
   * named in `contactTiers`. Defaults to /contact. Use to route quote-based or
   * not-yet-purchasable tiers to a contact/request surface (e.g. an on-page
   * "#custom" section) instead of a checkout that can't take payment.
   */
  contactHref?: string;
  /**
   * Tier names (besides Enterprise) that should render as a "Talk to us"
   * contact CTA → `contactHref` instead of the primary CTA. Lets a page mark
   * paid tiers as request-only while payments aren't live.
   */
  contactTiers?: string[];
};

export function PricingTable({
  productIds,
  showHeading = false,
  showProductHeading = true,
  showProductLink = true,
  ctaHref,
  contactHref,
  contactTiers,
}: Props) {
  const { t } = useLocale();
  const p = t.v2.pricing;

  const products = productIds
    ? p.products.filter((prod) => productIds.includes(prod.id))
    : p.products;

  if (products.length === 0) return null;

  return (
    <section className="os-pricing-table" data-screen-label="Pricing Table">
      <div className="wrap">
        {showHeading && (
          <div className="os-section-head">
            <span className="meta meta-hot">{p.hero.eyebrow}</span>
            <h2>
              {p.hero.title.pre}
              <span className="editorial">{p.hero.title.italic}</span>
              {p.hero.title.post}
            </h2>
            <p className="lead">{p.hero.lead}</p>
            <p className="os-pricing-vat">{p.hero.vatNotice}</p>
          </div>
        )}

        {products.map((product) => (
          <div key={product.id} className="os-pricing-product">
            {showProductHeading && (
              <header className="os-pricing-product-head">
                <div>
                  <h3 className="os-pricing-product-name">{product.name}</h3>
                  <p className="os-pricing-product-tagline">
                    {product.tagline}
                  </p>
                </div>
                {showProductLink && (
                  <Link
                    href={product.href}
                    className="os-pricing-product-link"
                  >
                    {p.labels.viewProduct} <Icon name="arrow" size={14} />
                  </Link>
                )}
              </header>
            )}

            <div className="os-pricing-tiers">
              {product.tiers.map((tier) => (
                <article
                  key={tier.name}
                  className={
                    "os-pricing-tier" +
                    (tier.isHighlighted ? " os-pricing-tier-hot" : "")
                  }
                  aria-label={`${product.name} ${tier.name}`}
                >
                  {tier.isHighlighted && (
                    <span className="os-pricing-tier-badge">
                      {p.tierNames.professional}
                    </span>
                  )}

                  <div className="os-pricing-tier-head">
                    <span className="meta">{tier.name.toUpperCase()}</span>
                    <p className="os-pricing-tier-for">
                      {p.labels.forWhom}: <em>{tier.forWhom}</em>
                    </p>
                  </div>

                  <dl className="os-pricing-tier-numbers">
                    {tier.setup && tier.setup !== "—" && (
                      <div>
                        <dt>{p.labels.setup}</dt>
                        <dd className="os-pricing-tier-setup">{tier.setup}</dd>
                      </div>
                    )}
                    {tier.monthly && tier.monthly !== "—" && (
                      <div>
                        <dt>{p.labels.monthly}</dt>
                        <dd className="os-pricing-tier-monthly">
                          {tier.monthly}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="os-pricing-tier-body">
                    <span className="meta meta-hot">{p.labels.included}</span>
                    <ul className="os-pricing-tier-list">
                      {tier.included.map((item, i) => (
                        <li key={i}>
                          <Icon name="check" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {tier.overage && (
                      <p className="os-pricing-tier-overage">
                        <span className="meta">{p.labels.overage}:</span>{" "}
                        {tier.overage}
                      </p>
                    )}
                  </div>

                  <div className="os-pricing-tier-cta">
                    {tier.name === p.tierNames.enterprise ||
                    contactTiers?.includes(tier.name) ? (
                      <Link
                        href={contactHref ?? "/contact"}
                        className="btn btn-ghost btn-sm os-pricing-tier-button"
                      >
                        {p.labels.enterpriseCta}
                      </Link>
                    ) : (
                      <Link
                        href={ctaHref ?? product.href}
                        className={
                          "btn btn-sm os-pricing-tier-button " +
                          (tier.isHighlighted ? "btn-primary" : "btn-ghost")
                        }
                      >
                        {p.labels.primaryCta}
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
