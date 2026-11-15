import type { HomeBlock } from "@/content/v7/types-home";
import { Blatt } from "../Blatt";

type Report = Extract<HomeBlock, { t: "check" }>["report"];

/**
 * The excerpt of the sample KI-Check report on the home check section: three ideas by priority (the first sentence
 * bold, the rest hidden on phones), "Bewusst manuell" and the training recommendation. A second blank sheet lies
 * behind it (decorative). Stamped and named as a sample; the caller adds the Etikett.
 */
export function ReportBlatt({ r }: { r: Report }) {
  return (
    <div className="wk-report">
      <div className="wk-report-back" aria-hidden="true">
        <i style={{ width: "40%" }} />
        <i />
        <i style={{ width: "86%" }} />
        <i style={{ width: "64%" }} />
        <i />
        <i style={{ width: "72%" }} />
      </div>
      <Blatt className="wk-report-sheet" ariaLabel={r.ariaLabel} title={r.title} sub={r.meta} stamp={r.stamp}>
        <p className="wk-report-h">{r.h}</p>
        <ol className="wk-report-ol">
          {r.items.map((it) => (
            <li key={it.b}>
              <span>
                <b>{it.b}</b>
                <span className="wk-more">{it.more}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="wk-report-h wk-more">{r.manualH}</p>
        <p className="wk-more wk-report-manual">{r.manual}</p>
        <p className="wk-report-h">{r.recH}</p>
        <p className="wk-report-rec">{r.rec}</p>
      </Blatt>
    </div>
  );
}
