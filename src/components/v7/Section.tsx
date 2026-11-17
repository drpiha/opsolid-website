import type { CSSProperties, ReactNode } from "react";
import type { Ground, Href } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "./LinkTo";
import { Reveal } from "./Reveal";
import { Etikett } from "./werkstatt/Etikett";
import { h2, linkDeep, wrap } from "./ui";

/**
 * Section frame of design C "Werkstatt": a full-width band on its ground (paper, sheet, bench, slate, ink, char),
 * optionally with the mat texture, and the section head (`.wk-sec-head`): Etikett with the label, the optional note
 * line under it and the H2 on the left, the answer-first lede on the right, aligned to the bottom. No label column, no copper tick
 * and no visible section number any more (`num` is kept for the blocks' props and ignored here). Children run below
 * the head inside the wrap; `cta` closes the section with a text link.
 */
export function Section({
  id,
  label,
  note,
  h,
  lede,
  cta,
  locale,
  children,
  wide,
  airy,
  ground = "paper",
  mat,
  stack,
  className,
}: {
  id: string;
  /** Kept for the block props; the C frame shows no section number. */
  num?: string;
  label: string;
  note?: string;
  h: string;
  lede?: string;
  cta?: Href;
  locale: L3;
  children?: ReactNode;
  /** The H2 may run the full head width (media bands). */
  wide?: boolean;
  /** A dense section after another dense one: more space above. */
  airy?: boolean;
  /** Section ground, resolved by V7Page (explicit block.ground, else alternating paper and sheet). */
  ground?: Ground;
  /** Mat texture: true for the default mask, or a CSS mask image. */
  mat?: boolean | string;
  /** Head in one column (H2 over lede) instead of the two-column split. */
  stack?: boolean;
  className?: string;
}) {
  const style = typeof mat === "string" ? ({ ["--mat-mask" as string]: mat } as CSSProperties) : undefined;
  const one = stack || !lede;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      data-ground={ground}
      data-mat={mat ? "" : undefined}
      style={style}
      className={`wk-sec wk-on-${ground}${mat ? " wk-mat" : ""}${airy ? " is-airy" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className={wrap}>
        <div className={`wk-sec-head${one ? " is-stack" : ""}${wide ? " is-wide" : ""}`}>
          <div className="wk-sec-head-main">
            <Etikett solid>{label}</Etikett>
            {note && <p className="wk-sec-note">{note}</p>}
            <h2 id={`${id}-h`} className={h2}>
              {soft(h)}
            </h2>
          </div>
          {lede && (
            <Reveal>
              <p className="wk-sec-head-lede">{lede}</p>
            </Reveal>
          )}
        </div>
        {children}
        {cta && (
          <div className="wk-sec-cta">
            <LinkTo link={cta} locale={locale} className={`${linkDeep} v7-link`}>
              {cta.label}
              <span aria-hidden="true">→</span>
            </LinkTo>
          </div>
        )}
      </div>
    </section>
  );
}
