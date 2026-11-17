import type { CSSProperties } from "react";
import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { h2, wrap } from "../ui";
import { Etikett } from "../werkstatt/Etikett";
import { SessionSchema } from "../werkstatt/hub/SessionSchema";

/**
 * The hub format section (design C): ink with the mat, copy and ticks on the left (solid Etikett, H2, lede, the live
 * format facts as square ticks), the drawn schema of a live session on the right with a copper glow and its Etikett.
 * No split section head: the H2 sits in the copy column.
 */
export function FormatBlock({ block: b }: BlockProps<"format">) {
  const ground = b.ground ?? "ink";
  const style = typeof b.mat === "string" ? ({ ["--mat-mask" as string]: b.mat } as CSSProperties) : undefined;
  return (
    <section
      id={b.id}
      aria-labelledby={`${b.id}-h`}
      data-ground={ground}
      style={style}
      className={`wk-sec wk-on-${ground}${b.mat ? " wk-mat" : ""} wk-format`}
    >
      <div className={`${wrap} wk-format-grid`}>
        <div className="wk-format-copy">
          <Etikett solid>{b.etikett}</Etikett>
          <h2 id={`${b.id}-h`} className={h2}>
            {b.h}
          </h2>
          {b.lede && <p className="wk-lede">{b.lede}</p>}
          <ul className="wk-ticks">
            {b.ticks.map((t) => (
              <li key={t.b}>
                <span>
                  <b>{t.b}</b> {t.rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Reveal as="div" className="wk-format-pic">
          <figure>
            <SessionSchema s={b.session} />
            <Etikett as="figcaption">{b.session.etikett}</Etikett>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
