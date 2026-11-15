import type { HubBlock } from "@/content/v7/types-hub";
import { UiWindow } from "../UiWindow";

type Session = Extract<HubBlock, { t: "format" }>["session"];

/**
 * Schema of a live session (hub format section), drawn in HTML: a shared screen with an exercise and a sample
 * instruction, the trainer tile and neutral numbered participant tiles (no initials, no names), a question and the
 * answer in the chat. Not a screenshot; one picture for assistive tech (`role="img"`), the caller adds the Etikett.
 */
export function SessionSchema({ s }: { s: Session }) {
  const tiles = Array.from({ length: s.tiles }, (_, i) => String(i + 1));
  return (
    <UiWindow
      ariaLabel={s.ariaLabel}
      className="wk-session-ui"
      bar={[
        <span key="l" className="truncate">
          <b>{s.bar[0]}</b> <span className="wk-session-rest">{s.bar[1]}</span>
        </span>,
        s.bar[2],
      ]}
    >
      <div className="wk-session">
        <div className="wk-screen">
          <p className="wk-ui-label is-ai">{s.exercise}</p>
          <p className="wk-screen-h">{s.title}</p>
          <ol>
            {s.steps.map((st) => (
              <li key={st.b}>
                <span>
                  <b>{st.b}</b> {st.rest}
                </span>
              </li>
            ))}
          </ol>
          <div className="wk-prompt">
            <span>{s.promptLabel}</span> {s.prompt}
          </div>
        </div>
        <div className="wk-tiles">
          <div className="wk-tile is-lead">
            <span className="wk-ava">T</span>
            <span>{s.trainer}</span>
          </div>
          <div className="wk-tile-grid">
            {tiles.map((n) => (
              <span key={n} className="wk-ava">
                {n}
              </span>
            ))}
          </div>
          <p className="wk-tiles-n">{s.count}</p>
        </div>
        <div className="wk-chat">
          <span className="wk-ava">4</span>
          <span>{s.chat[0]}</span>
        </div>
        <div className="wk-chat is-lead">
          <span className="wk-ava">T</span>
          <span>{s.chat[1]}</span>
        </div>
      </div>
    </UiWindow>
  );
}
