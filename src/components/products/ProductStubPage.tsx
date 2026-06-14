"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FinalCTA } from "@/components/sections/FinalCTA";

type ProductPageId =
  | "chatbotAgent"
  | "whatsappAgent"
  | "bookingAgent"
  | "emailAgent"
  | "leadQualifierAgent"
  | "customAutomation";

type Props = {
  pageId: ProductPageId;
  pricingProductId: string;
};

export function ProductStubPage({ pageId }: Props) {
  const { t } = useLocale();
  const labels = t.v2.productPages.labels;
  const page = t.v2.productPages.pages[pageId];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section className="va-hero" data-screen-label={`${pageId} hero`}>
        <div className="va-hero-inner">
          <div>
            <div className="os-hero-meta">
              <span className="chip chip-hot">
                <span className="chip-dot chip-dot-live" /> {page.hero.metaChip}
              </span>
              <span className="meta">{page.hero.metaLabel}</span>
            </div>
            <h1 className="os-hero-title">
              {page.hero.title.pre}
              <span className="editorial">{page.hero.title.italic}</span>
              {page.hero.title.post}
            </h1>
            <p className="os-hero-lead">{page.hero.lead}</p>
            <div className="os-hero-ctas">
              <Link href="/contact" className="btn btn-primary btn-lg">
                {page.hero.ctaPrimary} <Icon name="arrow" size={18} />
              </Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">
                {page.hero.ctaSecondary}
              </Link>
            </div>
            <div className="va-features">
              {page.hero.features.map((feat, i) => (
                <div key={i} className="va-feat">
                  <div className="va-feat-label">{feat.label}</div>
                  <div className="va-feat-value">{feat.value}</div>
                  <div className="va-feat-sub">{feat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="os-section" data-screen-label="Use cases">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{labels.useCasesEyebrow}</span>
            <h2>{labels.useCasesHeading}</h2>
          </div>
          <div className="os-usecase-grid">
            {page.useCases.map((u, i) => (
              <article key={i} className="os-usecase">
                <span className="meta">{u.industry.toUpperCase()}</span>
                <p className="os-usecase-problem">{u.problem}</p>
                <div className="os-usecase-arrow" aria-hidden="true">
                  <Icon name="arrow" size={16} />
                </div>
                <p className="os-usecase-outcome">{u.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="os-section os-integrations-section" data-screen-label="Integrations">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{labels.integrationsEyebrow}</span>
            <h2>{labels.integrationsHeading}</h2>
          </div>
          <ul className="os-integration-strip">
            {page.integrations.map((it, i) => (
              <li key={i} className="os-integration-chip">
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="os-section" data-screen-label="FAQ">
        <div className="wrap os-faq-wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{labels.faqEyebrow}</span>
            <h2>{labels.faqHeading}</h2>
          </div>
          <ul className="os-faq-list">
            {page.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <li
                  key={i}
                  className={
                    "os-faq-item" + (open ? " os-faq-item-open" : "")
                  }
                >
                  <button
                    type="button"
                    className="os-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="os-faq-toggle" aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && <p className="os-faq-a">{f.a}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
