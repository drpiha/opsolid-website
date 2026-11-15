import type { CourseArt } from "@/content/v7/types-hub";

type Art = Extract<CourseArt, { kind: "workflow" }>;

/**
 * A workflow schema in four boxes joined by arrows (KI-Agenten on the hub catalog card): the AI step has the copper
 * border, the human step the ink fill. One picture for assistive tech (`role="img"` with `ariaLabel`).
 */
export function WorkflowSchema({ art }: { art: Art }) {
  return (
    <div className="wk-wf" role="img" aria-label={art.ariaLabel}>
      {art.steps.map((s) => (
        <div key={s.small} className={s.role ? `is-${s.role}` : undefined}>
          <span>{s.small}</span>
          <b>{s.b}</b>
        </div>
      ))}
    </div>
  );
}
