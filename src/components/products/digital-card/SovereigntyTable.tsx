"use client";

// =============================================================================
// SovereigntyTable — data-residency comparison for the OpSo Smart product page.
// Renders t.products.digitalCard.compliance: a 5-column provider×criteria
// matrix (host region, sub-processors, GDPR DPA, one-click delete) with the
// OpSo Smart row highlighted. EU data residency is a primary B2B differentiator
// for the German market, so this sits in the trust cluster near the page foot.
//
// The competitor facts live in the content file (factual, team-maintained).
// Responsive: the matrix scrolls horizontally on narrow screens rather than
// collapsing the comparison — every column stays comparable side by side.
// =============================================================================

import { useLocale } from "@/context/LocaleContext";

export function SovereigntyTable() {
  const { t } = useLocale();
  const c = t.products.digitalCard.compliance;

  return (
    <section
      className="os-section"
      id="sovereignty"
      data-screen-label="Data sovereignty"
    >
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{c.label}</span>
          <h2>{c.heading}</h2>
          <p className="lead">{c.intro}</p>
        </div>

        {/* role=region + tabIndex make the horizontal-scroll area reachable
            for keyboard-only users on narrow viewports. */}
        <div
          className="panel overflow-x-auto"
          style={{ padding: 0 }}
          role="region"
          aria-label={c.heading}
          tabIndex={0}
        >
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">{c.heading}</caption>
            <thead>
              <tr className="border-b border-line">
                {c.cols.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={
                      "whitespace-nowrap px-4 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300" +
                      (i === 0 ? "" : " text-center")
                    }
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, i) => {
                const hot = row.highlight === "true";
                return (
                  <tr
                    key={i}
                    className={
                      "border-b border-line last:border-0 transition-colors" +
                      (hot ? " bg-copper/10" : "")
                    }
                  >
                    <th
                      scope="row"
                      className={
                        "whitespace-nowrap px-4 py-4 text-left text-[15px] " +
                        (hot
                          ? "font-semibold text-copper"
                          : "font-medium text-ink-100")
                      }
                    >
                      {row.provider}
                    </th>
                    <td className="px-4 py-4 text-center text-sm text-ink-200">
                      {row.host}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-ink-200">
                      {row.sub}
                    </td>
                    <td
                      className={
                        "px-4 py-4 text-center text-sm " +
                        (hot ? "font-medium text-signal-ok" : "text-ink-200")
                      }
                    >
                      {row.dpa}
                    </td>
                    <td
                      className={
                        "px-4 py-4 text-center text-sm " +
                        (hot ? "font-medium text-signal-ok" : "text-ink-200")
                      }
                    >
                      {row.del}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
