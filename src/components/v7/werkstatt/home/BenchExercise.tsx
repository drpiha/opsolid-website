import type { HomeBench } from "@/content/v7/types-home";
import { UiWindow } from "../UiWindow";

/**
 * The exercise on the home bench (a UiWindow, labelled "Beispiel" by its Etikett): a guest enquiry to a hotel, the
 * instruction to the AI, the draft with the two places the team checks, and the role foot (draft by AI, checking and
 * sending by the team). One named picture (`role="img"`): its sample text stays out of the reading order.
 */
export function BenchExercise({ x }: { x: HomeBench["exercise"] }) {
  const [kind, ...task] = x.bar[0].split(":");
  return (
    <UiWindow
      className="wk-bench-ui"
      ariaLabel={x.ariaLabel}
      bar={[
        <span key="a" className="truncate">
          <b>{kind}</b>
          {task.length > 0 && ` ${task.join(":").trim()}`}
        </span>,
        x.bar[1],
      ]}
      foot={x.foot}
    >
      <div>
        <p className="wk-ui-label">{x.task}</p>
        <div className="wk-mail">
          <div className="wk-mail-from">
            <span className="wk-ava">{x.avatar}</span>
            {x.from}
          </div>
          <div className="wk-mail-sub">{x.subject}</div>
          <p>{x.mail}</p>
        </div>
      </div>
      <div className="wk-bench-ai">
        <p className="wk-ui-label is-ai">{x.aiLabel}</p>
        <div className="wk-prompt">
          <span>{x.promptLabel}</span> {x.prompt}
        </div>
      </div>
      <div className="wk-draft">{x.draft.map((part, i) => (typeof part === "string" ? part : <mark key={i}>{part.mark}</mark>))}</div>
    </UiWindow>
  );
}
