import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Key-value list (scope, format, duration, group size): mono keys, dashed rules, on a 2 px top rule. */
export function SpecBlock({ block: b, locale, num }: BlockProps<"spec">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <Reveal className="wk-measure">
        <dl className="wk-spec">
          {b.rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {b.footnote && <p className="wk-foot-note">{b.footnote}</p>}
      </Reveal>
    </Section>
  );
}
