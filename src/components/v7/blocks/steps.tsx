import Image from "next/image";
import type { BlockProps } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { Etikett } from "../werkstatt/Etikett";

const EURO = /€/;

/** The drawn four-node flow (input, AI agent, your team, filing) at crop size: decoration, the Etikett line names it. */
const flowThumb = (
  <svg className="wk-run-crop wk-run-draw" viewBox="0 0 96 75" aria-hidden="true">
    <path d="M14 34h68" stroke="var(--wk-copper-deep)" strokeWidth="1.5" fill="none" />
    {[14, 37, 60, 82].map((x, i) => (
      <rect key={x} x={x - 7} y={27} width={14} height={14} rx={4} fill={i === 1 ? "var(--wk-copper)" : i === 2 ? "var(--wk-ink)" : "var(--wk-sheet)"} stroke={i === 1 ? "var(--wk-copper)" : "var(--wk-ink)"} strokeWidth="1.5" />
    ))}
    <path d="M8 56h80" stroke="var(--wk-line-2)" strokeWidth="1" strokeDasharray="2 3" fill="none" />
  </svg>
);

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
                {it.art.crop ? (
                  <Image
                    className="wk-run-crop"
                    src={it.art.crop.src}
                    alt={it.art.crop.alt}
                    width={it.art.crop.w}
                    height={it.art.crop.h}
                    sizes="96px"
                    decoding="async"
                  />
                ) : (
                  it.art.draw === "flow" && flowThumb
                )}
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
