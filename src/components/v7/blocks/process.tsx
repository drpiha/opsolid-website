import Image from "next/image";
import type { BlockProps } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import { soft } from "@/lib/soft-hyphen";
import { Section } from "../Section";
import { Etikett } from "../werkstatt/Etikett";
import { SeenObserver } from "../werkstatt/home/SeenObserver";

const EURO = /€/;

/**
 * The process block (design C step line, every page that uses it): four steps in columns on one line, each with a
 * numbered square, the step name, its heading, the text, the result and the meta Etikett. With step `crop`s (home)
 * a small cut-out of a labelled sample sits above each number and one Etikett line under the row names them; without
 * crops the line runs through the numbers (`is-plain`). The line draws itself on first view and the numbers follow
 * (CSS from 961 px under no-preference; SeenObserver sets `.is-seen`). Phones: one column with a vertical line.
 * Rule 1: when a step names a euro amount, the price note follows the steps.
 */
export function ProcessBlock({ block: b, locale, num }: BlockProps<"process">) {
  const crops = b.steps.some((s) => s.crop);
  const priced = b.steps.some((s) => [s.meta, s.p, s.result, s.h].some((x) => x && EURO.test(x)));
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale}>
      <ol className={`wk-steps${crops ? " has-crops" : " is-plain"}`} data-seen="">
        {b.steps.map((s) => (
          <li key={s.name} className="wk-step">
            {crops && (
              <div className="wk-step-pic">
                {s.crop && <Image className="wk-crop" src={s.crop.src} width={s.crop.w} height={s.crop.h} alt="" sizes="96px" decoding="async" />}
              </div>
            )}
            <span className="wk-step-no" aria-hidden="true" />
            <p className="wk-step-name">{s.name}</p>
            <h3>{soft(s.h)}</h3>
            <p className="wk-step-p">{s.p}</p>
            <p className="wk-step-result">{s.result}</p>
            {s.meta && <Etikett className="wk-step-meta">{s.meta}</Etikett>}
          </li>
        ))}
      </ol>
      <SeenObserver />
      {b.etikett && (
        <Etikett as="p" className="wk-steps-note">
          {b.etikett}
        </Etikett>
      )}
      {priced && <p className="wk-foot-note wk-steps-price">{SITE_STR[locale].priceNote}</p>}
    </Section>
  );
}
