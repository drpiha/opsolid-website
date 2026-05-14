"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * "Warum OpSolid?" — six trust factors in a 3x2 grid. Carries the
 * "no employer reference, only general experience" boundary by keeping
 * copy at the principle/practice level rather than naming clients.
 * Copy at `t.v2.home.trust.*`.
 */
export function TrustBlock() {
  const { t } = useLocale();
  const tr = t.v2.home.trust;

  return (
    <section className="os-section os-trust-section" id="trust" aria-labelledby="trust-headline">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{tr.eyebrow}</span>
          <h2 id="trust-headline">{tr.headline}</h2>
          <p className="lead">{tr.lead}</p>
        </div>

        <div className="os-trust-grid">
          {tr.items.map((item, i) => (
            <article key={i} className="os-trust-card">
              <div className="os-trust-card-num meta" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
