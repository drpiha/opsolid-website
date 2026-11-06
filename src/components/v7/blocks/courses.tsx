import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { Reveal } from "@/components/v7/Reveal";
import { linkDeep } from "@/components/v7/ui";
import type { BlockProps } from "@/content/v7/types";

/**
 * Training catalogue as a hairline ledger, read like a timetable: one row per course. Left: index, status,
 * name and the format line (length, hours, group size). Middle: what it covers and the link. Right: the team
 * price in display type, its unit and the per-person arithmetic in mono. On phones the price block sits right
 * under the name, so price, people and hours are read in one sweep before the description.
 * block.footnote is the terms line under the ledger; block.note goes to the section's left column.
 */
export function CoursesBlock({ block, locale, num }: BlockProps<"courses">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <ol className="mt-12 border-t border-[#16191D] md:mt-16">
        {block.items.map((c, i) => {
          const bookable = c.status === "bookable";
          const priced = bookable && !!c.price;
          return (
            <Reveal as="li" key={c.name} delay={i * 0.05} className="v7-card grid gap-x-8 gap-y-6 border-b border-[#E3DCD1] py-8 md:grid-cols-12 md:gap-y-0 md:py-10">
              <div className={priced ? "md:col-span-5" : "md:col-span-6"}>
                <p className="f-mono flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] uppercase leading-[1.7]">
                  <span className="text-[#8A4524]">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`rounded-full border px-3 py-0.5 ${bookable ? "border-[#8A4524] text-[#8A4524]" : "border-[#CFC6B8] text-[#6B665F]"}`}>{c.statusLabel}</span>
                </p>
                <h3 className="f-display mt-4 text-balance text-[1.5rem] leading-[1.15] md:text-[1.875rem]">{c.name}</h3>
                <p className="f-mono mt-3 text-[12px] uppercase leading-[1.8] text-[#6B665F] md:max-w-[36ch]">{c.format}</p>
              </div>

              {priced && (
                <div className="md:order-3 md:col-span-3 md:text-right">
                  <p className="f-display text-[1.75rem] leading-[1.1] text-[#8A4524] md:text-[2rem]">{c.price}</p>
                  {c.unit && <p className="f-mono mt-1.5 text-[12px] uppercase leading-[1.7] text-[#6B665F]">{c.unit}</p>}
                  {c.arith && <p className="f-mono mt-4 text-[12px] uppercase leading-[1.8] text-[#6B665F] md:ml-auto md:max-w-[30ch]">{c.arith}</p>}
                </div>
              )}

              <div className={`md:order-2 ${priced ? "md:col-span-4" : "md:col-span-6"}`}>
                <p className={bookable ? "text-[#16191D]" : "text-[#4F4A44]"}>{c.p}</p>
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
