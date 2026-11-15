import type { HomeBench } from "@/content/v7/types-home";
import { Logo } from "../../Logo";
import { Stamp } from "../Stamp";

/**
 * The sample participation record on the home bench, in landscape: logo and stamp on top, the name on the left, the
 * facts on the right, the "kein Zertifikat" line at the foot. Drawn in HTML/CSS; `ariaLabel` names it as a sample.
 */
export function Certificate({ x }: { x: HomeBench["certificate"] }) {
  return (
    <article aria-label={x.ariaLabel} className="wk-blatt wk-cert">
      <div className="wk-blatt-head">
        <span className="wk-blatt-logo">
          <Logo />
        </span>
        <Stamp>{x.stamp}</Stamp>
      </div>
      <div className="wk-cert-cols">
        <div>
          <p className="wk-blatt-sub">{x.title}</p>
          <p className="wk-cert-name">{x.name}</p>
          <p className="wk-cert-line">{x.line}</p>
        </div>
        <dl>
          {x.rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="wk-blatt-foot">{x.foot}</p>
    </article>
  );
}
