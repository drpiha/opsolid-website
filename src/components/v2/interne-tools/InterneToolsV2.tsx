"use client";

/**
 * InterneToolsV2 — before/after split panel.
 *
 * Per docs/redesign-prompt.md §2 Interne Tools:
 *   - Left panel: crude Excel-style spreadsheet mock (gray-and-white, low-fi).
 *   - Right panel: polished custom-tool UI showing the same data, cleanly.
 *   - Vertical divider with a small → glyph at center.
 *   - Headline sits above both panels.
 *
 * No external screenshots ship in this round — both panels are inline
 * SVG/CSS mocks so we don't pay an image-load tax on first paint. A future
 * round can swap to real screenshots once the operator-facing product UI
 * exists.
 */

import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

export function InterneToolsV2() {
  const { locale } = useLocale();
  const c = getV2Content(locale);
  const data = c.interneTools;

  const rows = [
    { ord: "PO-1041", vendor: "Acme GmbH",  qty: 12, status: "open" },
    { ord: "PO-1042", vendor: "Delta KG",   qty:  4, status: "closed" },
    { ord: "PO-1043", vendor: "Forge Co.",  qty: 28, status: "open" },
    { ord: "PO-1044", vendor: "Halberd AG", qty:  6, status: "review" },
    { ord: "PO-1045", vendor: "Veritas SE", qty: 18, status: "open" },
  ];

  return (
    <section className="v2-it-hero">
      <div className="wrap v2-it-hero__head">
        <span className="v2-it-hero__eyebrow">{data.eyebrow}</span>
        <h1 className="v2-it-hero__headline">{data.headline}</h1>
        <p className="v2-it-hero__lead">{data.lead}</p>
      </div>

      <div className="wrap v2-it-split">
        {/* Before — Excel mock */}
        <div className="v2-it-panel v2-it-panel--before">
          <span className="v2-it-panel__tag">{data.beforeLabel}</span>
          <div className="v2-it-excel" role="img" aria-label="Spreadsheet mockup">
            <div className="v2-it-excel__head">
              <span>A</span><span>B</span><span>C</span><span>D</span>
            </div>
            {rows.map((r, i) => (
              <div key={r.ord} className="v2-it-excel__row">
                <span>{i + 1}</span>
                <span>{r.ord}</span>
                <span>{r.vendor}</span>
                <span>{r.qty}</span>
              </div>
            ))}
            <div className="v2-it-excel__cell-edit">B7 = ?</div>
          </div>
        </div>

        <span className="v2-it-divider" aria-hidden="true">→</span>

        {/* After — clean tool UI */}
        <div className="v2-it-panel v2-it-panel--after">
          <span className="v2-it-panel__tag">{data.afterLabel}</span>
          <div className="v2-it-tool" role="img" aria-label="Custom tool mockup">
            <div className="v2-it-tool__head">
              <span className="v2-it-tool__title">Purchase orders</span>
              <span className="v2-it-tool__chip">Live</span>
            </div>
            <ul className="v2-it-tool__list">
              {rows.map((r) => (
                <li key={r.ord} className="v2-it-tool__row">
                  <span className="v2-it-tool__ord">{r.ord}</span>
                  <span className="v2-it-tool__vendor">{r.vendor}</span>
                  <span className="v2-it-tool__qty">{r.qty}</span>
                  <span className={`v2-it-tool__status v2-it-tool__status--${r.status}`}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="wrap v2-it-hero__cta-row">
        <Link href="/contact" className="v2-btn-primary" data-cursor="link">
          {data.ctaPrimary}
        </Link>
        <Link href="/leistungen" className="v2-btn-ghost" data-cursor="link">
          {data.ctaSecondary}
        </Link>
      </div>
    </section>
  );
}
