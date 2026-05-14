"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * Problem section — "Kommen Ihnen diese Probleme bekannt vor?".
 * Lists 5 concrete pain points an SME prospect will recognize in the
 * first scroll, before any solution copy. Copy at `t.v2.home.problem.*`.
 */
export function ProblemBlock() {
  const { t } = useLocale();
  const p = t.v2.home.problem;

  return (
    <section className="os-section" id="problem" aria-labelledby="problem-headline">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{p.eyebrow}</span>
          <h2 id="problem-headline">{p.headline}</h2>
          <p className="lead">{p.lead}</p>
        </div>

        <ul className="os-problem-grid" role="list">
          {p.items.map((item, i) => (
            <li key={i} className="os-problem-card panel">
              <div className="os-problem-card-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
