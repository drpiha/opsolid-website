import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Plain numbered steps as a hairline ledger. */
export function StepsBlock({ block: b, locale, num }: BlockProps<"steps">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <ol className="mt-12 border-t border-[#16191D] md:mt-16">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className="grid gap-x-8 gap-y-2 border-b border-[#E3DCD1] py-7 md:grid-cols-9 md:py-9">
            <span className="f-mono text-[12px] text-[#8A4524] md:col-span-1 md:pt-2">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="f-display text-[1.375rem] leading-[1.2] md:col-span-4 md:text-[1.75rem]">{it.h}</h3>
            <p className="text-[#16191D] md:col-span-4">{it.p}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
