import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { Etikett } from "../werkstatt/Etikett";

/** One task before and after: two sheets side by side, labelled by the block's Etikett (`tag`, an example). */
export function CompareBlock({ block: b, locale, num }: BlockProps<"compare">) {
  const col = (side: "before" | "after") => {
    const c = b[side];
    const after = side === "after";
    return (
      <Reveal delay={after ? 0.08 : 0} className={`wk-card wk-compare-col${after ? " is-after" : ""}`}>
        <h3 className="wk-compare-h">{c.h}</h3>
        <ul className={after ? "wk-ticks" : "wk-dashes"}>
          {c.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </Reveal>
    );
  };
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      {b.tag && <Etikett as="p">{b.tag}</Etikett>}
      <div className="wk-compare">
        {col("before")}
        {col("after")}
      </div>
    </Section>
  );
}
