"use client";

import { useLocale } from "@/context/LocaleContext";

type FaqItem = { q: string; a: string };

/**
 * FAQ accordion driven by native <details>/<summary> for zero JS overhead
 * and keyboard accessibility out of the box. Used on both the homepage and
 * the /ai-automation-check page — pass the `items` prop directly so the
 * page-specific FAQ can be rendered with its own headline.
 */
export function FaqAccordion({
  eyebrow,
  headline,
  items,
  id = "faq",
}: {
  eyebrow: string;
  headline: string;
  items: ReadonlyArray<FaqItem>;
  id?: string;
}) {
  return (
    <section className="os-section os-faq-section" id={id} aria-labelledby={`${id}-headline`}>
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{eyebrow}</span>
          <h2 id={`${id}-headline`}>{headline}</h2>
        </div>

        <div className="os-faq-list">
          {items.map((item, i) => (
            <details key={i} className="os-faq-item">
              <summary>
                <span className="os-faq-q">{item.q}</span>
                <span className="os-faq-icon" aria-hidden="true">+</span>
              </summary>
              <div className="os-faq-a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Homepage-scoped helper that pulls copy from `t.v2.home.faq`. */
export function HomepageFaq() {
  const { t } = useLocale();
  const f = t.v2.home.faq;
  return (
    <FaqAccordion
      eyebrow={f.eyebrow}
      headline={f.headline}
      items={f.items}
      id="faq"
    />
  );
}
