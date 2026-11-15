import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/**
 * Plain numbered steps as a ledger (.wk-run): 40 px copper-deep squares on a 2 px top rule. `variant: "run"` with
 * the per-step art card ("Sie erhalten" plus a crop) is added by package P2.
 */
export function StepsBlock({ block: b, locale, num }: BlockProps<"steps">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ol className="wk-run">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className="wk-run-step">
            <span className="wk-step-no" aria-hidden="true" />
            <div className="wk-run-text">
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
