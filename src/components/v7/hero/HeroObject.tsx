import type { HeroObject as Obj } from "@/content/v7/types";
import { Flow } from "../figures/Flow";
import { Etikett } from "../werkstatt/Etikett";
import { MiniBlatt } from "../werkstatt/MiniBlatt";
import { Stamp } from "../werkstatt/Stamp";
import { UiWindow } from "../werkstatt/UiWindow";
import { WaySchema } from "../werkstatt/WaySchema";
import { Fragebogen } from "../werkstatt/home/Fragebogen";
import { ReportBlatt } from "../werkstatt/home/ReportBlatt";
import { BloeckeGrid } from "../werkstatt/hub/BloeckeGrid";
import { Zeitplan } from "../werkstatt/hub/Zeitplan";

/** A sheet head (title, mono sub line, stamp) for the drawn sheets that have no head of their own. */
function Head({ title, sub, stamp }: { title: string; sub: string; stamp: string }) {
  return (
    <div className="wk-blatt-head">
      <div className="min-w-0">
        <p className="wk-blatt-title">{title}</p>
        <p className="wk-blatt-sub">{sub}</p>
      </div>
      <Stamp>{stamp}</Stamp>
    </div>
  );
}

function Piece({ o }: { o: Obj }) {
  switch (o.kind) {
    case "fragebogen":
      return <Fragebogen title={o.title} sub={o.sub} q={o.q} options={o.options} ariaLabel={o.ariaLabel} />;
    case "report":
      return <ReportBlatt r={{ ...o, ariaLabel: o.ariaLabel }} />;
    case "vergleich":
      return (
        <div role="img" aria-label={o.ariaLabel} className="wk-blatt wk-vgl">
          <div aria-hidden="true">
            <Head title={o.title} sub={o.sub} stamp={o.stamp} />
            <div className="wk-vgl-cols">
              {[o.before, o.after].map((col, c) => (
                <div key={col.h} className={c === 1 ? "is-after" : undefined}>
                  <p className="wk-vgl-h">{col.h}</p>
                  <ol>
                    {col.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "gespraech":
      return (
        <UiWindow className="wk-talk" ariaLabel={o.ariaLabel} bar={[<b key="b">{o.bar[0]}</b>, o.bar[1]]}>
          {o.lines.map((l, i) => (
            <div key={i} className={`wk-talk-line${l.agent ? " is-ai" : ""}`}>
              <span className={`wk-ui-label${l.agent ? " is-ai" : ""}`}>{l.who}</span>
              <p>{l.text}</p>
            </div>
          ))}
          {o.foot && <p className="wk-talk-foot">{o.foot}</p>}
        </UiWindow>
      );
    case "liste":
      return (
        <MiniBlatt
          className={`wk-hero-list${o.check ? " is-check" : ""}`}
          title={o.title}
          sub={o.sub}
          stamp={o.stamp}
          items={o.items.map((it) => ({ time: it.n, text: it.text, note: it.note }))}
          ariaLabel={o.ariaLabel}
        />
      );
    case "zeitplan":
    case "bloecke":
      return (
        <div role="img" aria-label={o.ariaLabel} className={`wk-blatt wk-hero-sheet is-${o.kind}`}>
          <div aria-hidden="true">
            <Head title={o.title} sub={o.sub} stamp={o.stamp} />
            {o.kind === "zeitplan" ? <Zeitplan art={o.art} /> : <BloeckeGrid art={o.art} />}
          </div>
        </div>
      );
    case "flow":
      // The labels are given, so Flow's locale (its default labels) is not used.
      return (
        <div role="img" aria-label={o.ariaLabel} className="wk-blatt wk-hero-flow">
          <div aria-hidden="true">
            <Head title={o.title} sub={o.sub} stamp={o.stamp} />
            <Flow alt="" locale="de" labels={o.labels} />
            <ol className="wk-hero-flow-row">
              {o.row.map((r, i) => (
                <li key={o.labels[i]}>
                  <span className="wk-hero-flow-k">{o.labels[i]}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    case "way":
      return (
        <div className="wk-blatt wk-hero-way">
          <WaySchema labels={o.labels} base={o.base} ariaLabel={o.ariaLabel} />
        </div>
      );
  }
}

/**
 * The inner-page hero object (design review R2): one drawn Werkstatt piece per page on the mat, two register marks in
 * the door colour, the Etikett under it. Server markup only; the lay-in is CSS (none under reduced motion).
 */
export function HeroObject({ o }: { o: Obj }) {
  return (
    <figure className={`wk-hero-obj is-${o.kind}${o.phone === false ? " is-deco" : ""}`}>
      <i className="wk-reg tr" aria-hidden="true" />
      <i className="wk-reg bl" aria-hidden="true" />
      <div className="wk-hero-obj-piece">
        <Piece o={o} />
      </div>
      <Etikett as="figcaption">{o.etikett}</Etikett>
    </figure>
  );
}
