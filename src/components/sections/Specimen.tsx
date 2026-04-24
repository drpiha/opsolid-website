"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * Specimen — industry-baseline card. OpSolid is pre-market, so every row is
 * a publicly cited figure (APQC, Forrester, Retell/GPT-4o/Deepgram public
 * specs, OpSolid principle). No invented case-study numbers.
 */
export function Specimen() {
  const { t } = useLocale();
  const s = t.v2.home.specimen;

  return (
    <section className="os-specimen" data-screen-label="Specimen">
      <div className="os-specimen-inner">
        <div className="os-specimen-copy">
          <span className="meta meta-hot">{s.eyebrow}</span>
          <h2>
            {s.title.pre}
            <span className="editorial">{s.title.italic}</span>
            {s.title.post}
          </h2>
          <p>{s.body}</p>
          <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="chip">{s.chipBefore}</span>
            <span className="chip chip-hot">{s.chipAfter}</span>
          </div>
        </div>
        <div className="os-metric-card">
          {s.rows.map((row, i) => (
            <div key={i} className="os-metric-row">
              <div className="os-metric-label">
                {row.label}
                <small>{row.sub}</small>
              </div>
              <div>
                <span
                  className={
                    "os-metric-value" +
                    (row.value.length > 5 ? " os-metric-value-sm" : "")
                  }
                >
                  {row.value}
                </span>
                <span className="os-metric-delta">{row.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
