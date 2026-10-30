import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A table (rate card, comparison). On phones every row stacks with its column names. */
export function TableBlock({ block: b, locale, num }: BlockProps<"table">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <Reveal className="mt-10 md:mt-14">
        <table className="w-full border-collapse text-left text-[16px]">
          <caption className="f-mono mb-4 text-left text-[12px] uppercase text-[#6B665F]">{b.caption}</caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-[#16191D]">
              {b.cols.map((c) => (
                <th key={c} scope="col" className="f-mono py-3 pr-6 text-[12px] font-normal uppercase text-[#6B665F]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r[0]} className="border-b border-[#E3DCD1] max-md:block max-md:py-4">
                {r.map((cell, j) => (
                  <td
                    key={j}
                    data-label={b.cols[j]}
                    className={`py-4 pr-6 align-top max-md:block max-md:py-1 max-md:before:font-[family-name:var(--font-geist-mono)] max-md:before:block max-md:before:text-[12px] max-md:before:uppercase max-md:before:text-[#6B665F] max-md:before:content-[attr(data-label)] ${
                      j === 0 ? "f-display text-[1.25rem] leading-[1.25] md:text-[1.375rem]" : "text-[#16191D]"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {b.footnote && <p className="mt-5 max-w-[64ch] text-[14px] leading-[1.6] text-[#6B665F]">{b.footnote}</p>}
      </Reveal>
    </Section>
  );
}
