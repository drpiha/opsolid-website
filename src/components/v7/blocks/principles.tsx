import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Principles / commitments: numbered items with 28 px square numbers, two or three columns on wide screens. */
export function PrinciplesBlock({ block: b, locale, num }: BlockProps<"principles">) {
  const cols = b.items.length % 3 === 0 && b.items.length !== 4 ? "is-3" : "is-2";
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ul className={`wk-principles ${cols}`}>
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={(i % 3) * 0.06} className="wk-principle">
            <span className="wk-sq-no" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3 className="wk-principle-h">{it.h}</h3>
              <p className="wk-muted">{it.p}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
