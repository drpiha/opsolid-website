import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Principles / commitments: numbered, two columns on wide screens. */
export function PrinciplesBlock({ block: b, locale, num }: BlockProps<"principles">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <ul className="mt-12 grid gap-x-10 md:mt-16 md:grid-cols-2">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={(i % 2) * 0.08} className="border-t border-[#E3DCD1] py-8">
            <h3 className="flex items-baseline gap-3">
              <span className="f-mono min-w-[1.75rem] flex-none whitespace-nowrap text-[12px] text-[#8A4524]">{String(i + 1).padStart(2, "0")}</span>
              <span className="f-display min-w-0 text-balance text-[1.5rem] leading-[1.15] md:text-[1.75rem]">{it.h}</span>
            </h3>
            <p className="mt-3 pl-[2.5rem] text-[17px] text-[#16191D]">{it.p}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
