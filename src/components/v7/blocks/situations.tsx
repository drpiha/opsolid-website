import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Situations / pain points: numbered S.1, S.2 … hairline ledger. */
export function SituationsBlock({ block: b, locale, num }: BlockProps<"situations">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale}>
      <ul className="mt-12 divide-y divide-wk-line border-y border-wk-line md:mt-16">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.06} className="grid gap-x-8 gap-y-2 py-7 md:grid-cols-9 md:py-9">
            <span className="f-mono text-[12px] text-wk-copper-deep md:col-span-1 md:pt-2">S.{i + 1}</span>
            <h3 className="f-display text-[1.375rem] leading-[1.28] md:col-span-4 md:text-[1.75rem]">{it.h}</h3>
            <p className="text-wk-ink md:col-span-4">{it.p}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
