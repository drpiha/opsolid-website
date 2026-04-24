"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * Three-step engagement process. Copy driven by `t.v2.home.process.*`.
 * Steps optionally carry `chipBHot: true` to mark the second chip as
 * copper-tinted (the "Production-ready" accent on step 02).
 */
export function Process() {
  const { t } = useLocale();
  const p = t.v2.home.process;

  return (
    <section className="os-section" data-screen-label="Process">
      <div className="wrap">
        <div className="os-process">
          <div className="os-process-intro">
            <span
              className="meta meta-hot"
              style={{ marginBottom: 16, display: "inline-block" }}
            >
              {p.eyebrow}
            </span>
            <h2>{p.headline}</h2>
            <p className="lead">{p.lead}</p>
          </div>
          <div className="os-process-steps">
            {p.steps.map((step, i) => (
              <div key={i} className="os-process-step">
                <div className="os-process-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="os-process-step-meta">
                  <span className="chip">{step.chipA}</span>
                  <span className={"chip" + (step.chipBHot ? " chip-hot" : "")}>
                    {step.chipB}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
