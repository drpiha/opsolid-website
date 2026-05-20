"use client";

/**
 * HomeV2 — M1 Foundation composition (replaces the rejected galaxy-backdrop
 * variant). Source: docs/redesign-prompt.md §2 Home + docs/research/decisions.md.
 *
 * Composition:
 *   - Full-width split. Left column: 3-line plain-language headline stack +
 *     lead + two CTAs + service chips.
 *   - Right column: a workflow card mock (rounded panel, three numbered
 *     flow rows) standing in for a real Power Automate / Make screenshot.
 *     M2 swaps the mock for the real screenshot once curated.
 *   - Behind everything: quiet 12-node graph canvas with packets traveling
 *     along edges in the v2 motion-trace teal. 0.55 opacity ambient.
 *   - Below the hero: 4-pillar grid linking into the existing service pages.
 *
 * Mobile (<960px): split collapses to single column; the workflow card slides
 *   below the headline.
 * Reduced-motion: NodeGraphBackdrop returns null; CSS animations disabled.
 */

import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { NodeGraphBackdrop } from "./NodeGraphBackdrop";
import { GalaxyBackdrop } from "./GalaxyBackdrop";
import { PillarGrid } from "./PillarGrid";
import { HomeOutcomes } from "./HomeOutcomes";
import { SplineHero } from "./SplineHero";

export function HomeV2() {
  const { locale } = useLocale();
  const c = getV2Content(locale);
  const hero = c.home.hero;
  const headline = hero.headline as readonly string[];
  const chips = hero.chips as readonly string[];

  return (
    <>
      <section className="v2-home-hero">
        <GalaxyBackdrop />
        <NodeGraphBackdrop />

        <div className="wrap v2-home-hero__inner">
          <div className="v2-home-hero__copy">
            <span className="v2-home-hero__eyebrow">{hero.eyebrow}</span>

            <h1 className="v2-home-hero__headline">
              {headline.map((line, i) => (
                <span key={i}>
                  {i === headline.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>

            <p className="v2-home-hero__lead">{hero.lead}</p>

            <div className="v2-home-hero__ctas">
              <Link href="/contact" className="v2-btn-primary" data-cursor="link">
                {hero.ctaPrimary}
              </Link>
              <Link href="/leistungen" className="v2-btn-ghost" data-cursor="link">
                {hero.ctaSecondary}
              </Link>
            </div>

            <ul className="v2-home-hero__chips" aria-label={hero.eyebrow}>
              {chips.map((chip) => (
                <li key={chip} className="v2-home-hero__chip">{chip}</li>
              ))}
            </ul>
          </div>

          <SplineHero />
        </div>
      </section>

      <PillarGrid />
      <HomeOutcomes />
    </>
  );
}

/**
 * WorkflowMock — legacy inline UI mock. Kept for one milestone as
 * emergency fallback in case the Spline scene fails to load; not
 * rendered on the live page (SplineHero owns the right column now).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WorkflowMock() {
  const rows: Array<{ index: string; label: string; detail: string; meta: string }> = [
    { index: "01", label: "Trigger", detail: "New invoice email arrives", meta: "outlook" },
    { index: "02", label: "Decision", detail: "Vendor in approved list?", meta: "branch" },
    { index: "03", label: "Action", detail: "Post to accounting + notify", meta: "queue" },
  ];

  return (
    <div className="v2-home-hero__panel" aria-hidden="true">
      <div className="v2-home-hero__panel-bar">
        <span />
        <span />
        <span />
        <span className="v2-home-hero__panel-title">flow · invoice-intake</span>
      </div>

      <div className="v2-home-hero__flow">
        {rows.map((row) => (
          <div key={row.index} className="v2-home-hero__flow-row">
            <span className="v2-home-hero__flow-index">{row.index}</span>
            <span>
              <strong>{row.label}</strong> — {row.detail}
            </span>
            <span className="v2-home-hero__flow-meta">{row.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
