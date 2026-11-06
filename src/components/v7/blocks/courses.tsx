import { Fragment } from "react";
import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { Reveal } from "@/components/v7/Reveal";
import { linkDeep } from "@/components/v7/ui";
import type { BlockProps } from "@/content/v7/types";

/** Sets every amount ("179 €", "€179", "1.790 €") of a mono line in copper-deep; the words stay ink. */
function amounts(line: string) {
  return line.split(/(€\s?\d[\d.,]*|\d[\d.,]*\s?€)/).map((part, i) =>
    /\d/.test(part) && /€/.test(part) ? (
      <span key={i} className="text-[#8A4524]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * Training catalogue as a hairline ledger, read like a timetable: one row per course. Left column: the name over
 * the spec line (length and hours in ink, then people, delivery and record in stone, the status last), below it
 * the description and the link. Right column: the team price as the signature of the row (Fraunces 300, 48 px
 * desktop and 40 px phones, copper-deep, tabular figures), its unit and the per-person arithmetic as unwrapped
 * mono lines with the amounts in copper. On phones the price block sits right under the spec line, before the
 * description. block.footnote is the terms line under the ledger; block.note goes to the section's left column.
 */
export function CoursesBlock({ block, locale, num }: BlockProps<"courses">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <ol className="mt-12 border-t border-[#16191D] md:mt-16">
        {block.items.map((c, i) => {
          const bookable = c.status === "bookable";
          const priced = bookable && !!c.price;
          const [lead, ...rest] = c.format.split(" · ");
          const spec = [...rest, c.statusLabel].filter(Boolean);
          const left = priced ? "md:col-span-5" : "md:col-span-9";
          return (
            <Reveal as="li" key={c.name} delay={i * 0.05} className="v7-card grid gap-x-10 gap-y-6 border-b border-[#E3DCD1] py-8 md:grid-cols-9 md:gap-y-5 md:py-10">
              <div className={left}>
                <p className="f-mono text-[12px] uppercase leading-[1.7] text-[#8A4524]">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="f-display mt-3 text-balance text-[1.5rem] leading-[1.15] md:text-[1.75rem]">{c.name}</h3>
                {/* Tokens never break inside and carry their copper separator; a line breaks only at the space between tokens. */}
                <p className="f-mono mt-3 text-[12px] uppercase leading-[1.8] text-[#6B665F]">
                  {[lead, ...spec].map((s, k, all) => (
                    <Fragment key={s}>
                      {k > 0 && " "}
                      <span className={`whitespace-nowrap ${k === 0 ? "text-[#16191D]" : ""}`}>
                        {s}
                        {k < all.length - 1 && (
                          <span aria-hidden="true" className="text-[#B5623A]">
                            {" "}·
                          </span>
                        )}
                      </span>
                    </Fragment>
                  ))}
                </p>
              </div>

              {priced && (
                <div className="md:col-span-4 md:row-span-2 md:pt-8 md:text-right">
                  <p className="f-display text-[2.5rem] leading-none tracking-[-0.02em] text-[#8A4524] [font-variant-numeric:tabular-nums_lining-nums] md:text-[3rem]">{c.price}</p>
                  {c.unit && <p className="f-mono mt-2 text-[12px] uppercase leading-[1.7] text-[#6B665F]">{c.unit}</p>}
                  {c.arith && c.arith.length > 0 && (
                    <p className="f-mono mt-4 text-[12px] uppercase leading-[1.8] text-[#16191D]">
                      {c.arith.map((line) => (
                        <span key={line} className="block whitespace-nowrap">
                          {amounts(line)}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}

              <div className={`${left} md:col-start-1`}>
                <p className={`max-w-[52ch] ${bookable ? "text-[#16191D]" : "text-[#4F4A44]"}`}>{c.p}</p>
                {c.href && (
                  <LinkTo link={c.href} locale={locale} className={`${linkDeep} mt-3`}>
                    {c.href.label}
                    <span aria-hidden="true">→</span>
                  </LinkTo>
                )}
              </div>
            </Reveal>
          );
        })}
      </ol>
      {block.footnote && <p className="mt-8 max-w-[64ch] text-[14px] leading-[1.6] text-[#6B665F]">{block.footnote}</p>}
    </Section>
  );
}
