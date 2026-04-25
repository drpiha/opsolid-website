"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/context/LocaleContext";

/**
 * Three-step engagement process. Copy driven by `t.v2.home.process.*`.
 * Steps optionally carry `chipBHot: true` to mark the second chip as
 * copper-tinted (the "Production-ready" accent on step 02).
 *
 * Layout:
 *   - Desktop (>= 900px): three cards side-by-side along a connected rail,
 *     with dashed connectors + amber arrow tips between them.
 *   - Mobile (< 900px): vertical stack with a left hairline + dot indicators.
 *
 * Each step carries a small inline SVG glyph (magnifier / workflow / pulse)
 * to make the phase readable at a glance.
 */
const STEP_GLYPHS: Array<() => ReactNode> = [
  // 01 — magnifier (analyse)
  () => (
    <svg
      viewBox="0 0 40 40"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="17" cy="17" r="9" />
      <line x1="24" y1="24" x2="32" y2="32" />
      <line x1="13" y1="17" x2="21" y2="17" strokeWidth="1.2" opacity="0.55" />
      <line x1="17" y1="13" x2="17" y2="21" strokeWidth="1.2" opacity="0.55" />
    </svg>
  ),
  // 02 — workflow nodes (design & build)
  () => (
    <svg
      viewBox="0 0 40 40"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="14" width="10" height="12" rx="1.5" />
      <rect x="26" y="6" width="10" height="12" rx="1.5" />
      <rect x="26" y="22" width="10" height="12" rx="1.5" />
      <path d="M14 18 H22 V12 H26" opacity="0.7" />
      <path d="M14 22 H22 V28 H26" opacity="0.7" />
    </svg>
  ),
  // 03 — heartbeat / pulse (operate)
  () => (
    <svg
      viewBox="0 0 40 40"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 22 H10 L14 14 L20 30 L26 18 L30 22 H38" />
      <circle cx="34" cy="22" r="2" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  ),
];

export function Process() {
  const { t } = useLocale();
  const p = t.v2.home.process;

  return (
    <section className="os-section" data-screen-label="Process">
      <div className="wrap">
        <div className="os-process os-process--rail">
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
          <ol className="os-process-rail" aria-label="Process steps">
            {p.steps.map((step, i) => (
              <li key={i} className="os-process-card">
                <span className="os-process-card-num" aria-hidden="true">
                  {step.num}
                </span>
                <span className="os-process-card-glyph" aria-hidden="true">
                  {(STEP_GLYPHS[i] ?? STEP_GLYPHS[2])()}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="os-process-card-meta">
                  <span className="chip">{step.chipA}</span>
                  <span className={"chip" + (step.chipBHot ? " chip-hot" : "")}>
                    {step.chipB}
                  </span>
                </div>
                {i < p.steps.length - 1 && (
                  <span className="os-process-rail-arrow" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 12"
                      width="44"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line
                        x1="0"
                        y1="6"
                        x2="20"
                        y2="6"
                        strokeDasharray="2 3"
                        opacity="0.55"
                      />
                      <path d="M16 2 L22 6 L16 10" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
