import type { CourseArt } from "@/content/v7/types-hub";

type Art = Extract<CourseArt, { kind: "zeitplan" }>;

/**
 * A sample timetable drawn in HTML (KI-Kompetenz Basis on the hub catalog card): a plan bar of weighted tiles with a
 * hatched pause, three time marks and the six topics as a numbered list. Bar and marks are decoration; the list
 * carries the accessible name (`ariaLabel`). Times are examples, the caller's Etikett says so.
 */
export function Zeitplan({ art }: { art: Art }) {
  return (
    <div className="wk-plan">
      <div className="wk-plan-bar" aria-hidden="true">
        {art.tiles.map((t, i) => (
          <i key={i} className={t.pause ? "is-break" : undefined} style={{ flex: t.w }}>
            {t.n}
          </i>
        ))}
      </div>
      <div className="wk-plan-ends" aria-hidden="true">
        {art.ends.map((e) => (
          <span key={e}>{e}</span>
        ))}
      </div>
      <ol className="wk-plan-list" aria-label={art.ariaLabel}>
        {art.topics.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
    </div>
  );
}
