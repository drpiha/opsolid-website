import Image from "next/image";
import type { BlockProps } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { Etikett } from "../werkstatt/Etikett";

const EURO = /€/;

/**
 * Plain numbered steps as a ledger (.wk-run): 40 px copper-deep squares on a 2 px top rule. `variant: "run"` (hub and
 * course page) adds an art card per step: a decorative crop of a labelled sample (alt ""), the "Sie erhalten" Etikett,
 * a short heading and the result; one Etikett line under the list names all crops. The default variant is unchanged.
 * Rule 1: when a step names a euro amount, the price note follows the steps (as in the process and rows blocks).
 */
export function StepsBlock({ block: b, locale, num }: BlockProps<"steps">) {
  const run = b.variant === "run";
  const priced = b.items.some((it) => [it.h, it.p, it.art?.h, it.art?.p].some((x) => x && EURO.test(x)));
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ol className="wk-run">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className={`wk-run-step${run && it.art ? " has-art" : ""}`}>
            <span className="wk-step-no" aria-hidden="true" />
            <div className="wk-run-text">
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </div>
            {run && it.art && (
              <div className="wk-run-art">
                <Image
                  className="wk-run-crop"
                  src={it.art.crop.src}
                  alt={it.art.crop.alt}
                  width={it.art.crop.w}
                  height={it.art.crop.h}
                  sizes="96px"
                  decoding="async"
                />
                <div>
                  <Etikett className="wk-run-art-k">{it.art.label}</Etikett>
                  <b>{it.art.h}</b>
                  <span>{it.art.p}</span>
                </div>
              </div>
            )}
          </Reveal>
        ))}
      </ol>
      {run && b.etikett && (
        <Etikett as="p" className="wk-steps-note">
          {b.etikett}
        </Etikett>
      )}
      {priced && <p className="wk-foot-note wk-steps-price">{SITE_STR[locale].priceNote}</p>}
    </Section>
  );
}
