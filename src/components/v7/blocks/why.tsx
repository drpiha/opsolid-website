import type { CSSProperties } from "react";
import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { wrap } from "../ui";

/**
 * The closing section of the Produkte page (prototype C `#warum`): on the bench with the mat fading in from below,
 * the H2 and lede on the left, two door cards on the right (Schulungen on ink, Beratung on slate), each one link
 * with its price chip; the KI-Check card carries the 60-day credit line and the price note follows right under the
 * two cards (rule 1, design review R3). The whole card is the link target; the visible link text is its accessible name's last part.
 */
export function WhyBlock({ block: b, locale }: BlockProps<"why">) {
  const ground = b.ground ?? "bench";
  const style = typeof b.mat === "string" ? ({ ["--mat-mask" as string]: b.mat } as CSSProperties) : undefined;
  return (
    <section
      id={b.id}
      aria-labelledby={`${b.id}-h`}
      data-ground={ground}
      style={style}
      className={`wk-sec wk-on-${ground}${b.mat ? " wk-mat" : ""} wk-why`}
    >
      <div className={`${wrap} wk-why-grid`}>
        <div className="wk-why-copy">
          <h2 id={`${b.id}-h`} className="wk-d2">
            {soft(b.h)}
          </h2>
          {b.lede && <p className="wk-lede wk-why-lede">{b.lede}</p>}
        </div>
        {/* R3: the price note sits directly under the two price cards (rule 1: next to the price group) */}
        <div className="wk-why-side">
          <ul className="wk-why-doors">
            {b.cards.map((c) => (
              <li key={c.h}>
                <LinkTo link={c.link} locale={locale} className={`wk-why-door ${c.tone === "ink" ? "wk-on-ink" : "is-slate"}`}>
                  <Etikett solid={c.tone === "ink"}>{c.etikett}</Etikett>
                  <span className="wk-why-door-h">{c.h}</span>
                  <ChipTag chip={c.chip} wrap />
                  {c.credit && <span className="wk-why-credit">{c.credit}</span>}
                  <span className="wk-why-go">{c.link.label}</span>
                </LinkTo>
              </li>
            ))}
          </ul>
          <p className="wk-why-note">{b.footnote}</p>
        </div>
      </div>
    </section>
  );
}
