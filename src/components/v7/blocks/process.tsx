import type { BlockProps } from "@/content/v7/types";
import { ProcessLine } from "../ProcessLine";
import { Section } from "../Section";

/** The signature process line: four steps, each with its tangible result. */
export function ProcessBlock({ block: b, locale, num }: BlockProps<"process">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <div className="mt-14 md:mt-20">
        <ProcessLine steps={b.steps} locale={locale} />
      </div>
    </Section>
  );
}
