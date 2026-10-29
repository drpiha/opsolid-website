import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** Key-value list (scope, format, duration, group size). */
export function SpecBlock({ block: b, locale, num }: BlockProps<"spec">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <Reveal>
        <dl className="mt-10 divide-y divide-[#E3DCD1] border-y border-[#16191D] md:mt-14">
          {b.rows.map(([k, v]) => (
            <div key={k} className="grid gap-x-8 gap-y-1 py-5 md:grid-cols-9">
              <dt className="f-mono text-[12px] uppercase leading-[1.8] text-[#6B665F] md:col-span-3">{k}</dt>
              <dd className="text-[#16191D] md:col-span-6">{v}</dd>
            </div>
          ))}
        </dl>
        {b.footnote && <p className="mt-5 max-w-[64ch] text-[14px] leading-[1.6] text-[#6B665F]">{b.footnote}</p>}
      </Reveal>
    </Section>
  );
}
