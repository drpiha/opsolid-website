"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * "Typische Anwendungsfälle" — 8 use-case cards in a 4-column grid that
 * collapses to 2 on tablet and 1 on mobile. Copy at
 * `t.v2.home.useCases.*`.
 */
export function UseCasesGrid() {
  const { t } = useLocale();
  const u = t.v2.home.useCases;

  return (
    <section className="os-section" id="use-cases" aria-labelledby="use-cases-headline">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{u.eyebrow}</span>
          <h2 id="use-cases-headline">{u.headline}</h2>
          <p className="lead">{u.lead}</p>
        </div>

        <div className="os-usecase-grid">
          {u.cards.map((card, i) => (
            <article key={i} className="os-usecase-card panel">
              <div className="os-usecase-num meta" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
