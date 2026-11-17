import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Situations / pain points: a ledger on a 2 px top rule, numbered S.1, S.2 … in copper-deep mono. */
export function SituationsBlock({ block: b, locale, num }: BlockProps<"situations">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ul className="wk-ledger">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.06} className="wk-ledger-line wk-sit">
            <span className="wk-ledger-no">S.{i + 1}</span>
            <h3 className="wk-sit-h">{it.h}</h3>
            <p className="wk-muted">{it.p}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
