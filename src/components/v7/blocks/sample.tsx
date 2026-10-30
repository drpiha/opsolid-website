import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A sample deliverable, visibly stamped as a sample. */
export function SampleBlock({ block: b, locale, num }: BlockProps<"sample">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <Reveal className="mt-10 md:mt-14">
        <div className="relative max-w-[720px] rounded-[18px] border border-[#E3DCD1] bg-white p-5 shadow-[0_1px_0_rgba(22,25,29,0.04),0_24px_44px_-28px_rgba(22,25,29,0.28)] md:p-8">
          <span className="f-mono absolute right-5 top-5 rotate-[4deg] rounded-md border border-[#8A4524] px-2 py-0.5 text-[12px] uppercase text-[#8A4524] md:right-8 md:top-7">
            {b.mark}
          </span>
          <div className="border-b border-[#E3DCD1] pb-4 pr-24">
            <h3 className="f-display text-[1.5rem] leading-[1.15] md:text-[1.875rem]">{b.title}</h3>
            <p className="f-mono mt-2 text-[12px] uppercase leading-[1.7] text-[#6B665F]">{b.meta}</p>
          </div>
          <dl className="divide-y divide-[#E3DCD1] text-[15px]">
            {b.rows.map(([k, v]) => (
              <div key={k} className="grid gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <dt className="text-[#16191D]">{k}</dt>
                <dd className="text-[#6B665F] sm:text-right">
                  <span className="rounded-full border border-[#E3DCD1] px-2.5 py-0.5 text-[13px]">{v}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-[#E3DCD1] pt-4 text-[14px] leading-[1.6] text-[#6B665F]">{b.foot}</p>
        </div>
      </Reveal>
    </Section>
  );
}
