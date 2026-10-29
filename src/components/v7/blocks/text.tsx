import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Plain paragraphs. */
export function TextBlock({ block: b, locale, num }: BlockProps<"text">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <div className="mt-8 max-w-[62ch] space-y-5 md:mt-10">
        {b.paras.map((p, i) => (
          <Reveal as="p" key={i} delay={i * 0.04} className="text-[#16191D]">
            {p}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
