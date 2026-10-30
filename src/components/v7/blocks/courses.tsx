import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { Reveal } from "@/components/v7/Reveal";
import { linkDeep } from "@/components/v7/ui";
import type { BlockProps } from "@/content/v7/types";

const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";
const display = "font-[family-name:var(--font-fraunces),Georgia,serif] font-light [font-variation-settings:'SOFT'_50]";

// block.footnote is the price/terms note under the grid; block.note goes to the section's left column.
export function CoursesBlock({ block, locale, num }: BlockProps<"courses">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
        {block.items.map((c, i) => {
          const bookable = c.status === "bookable";
          return (
            <Reveal as="li" key={c.name} delay={(i % 2) * 0.06} className={`v7-card flex flex-col rounded-[24px] border p-6 md:p-8 ${bookable ? "border-[#E3DCD1] bg-white" : "border-[#E3DCD1] bg-transparent"}`}>
              <p
                className={`${mono} self-start rounded-full border px-3 py-1 text-[12px] uppercase ${
                  bookable ? "border-[#8A4524] text-[#8A4524]" : "border-[#CFC6B8] text-[#6B665F]"
                }`}
              >
                {c.statusLabel}
              </p>
              <h3 className={`${display} mt-5 text-balance text-[1.5rem] leading-[1.15] md:text-[1.875rem]`}>{c.name}</h3>
              <p className={`${mono} mt-3 text-[12px] uppercase leading-[1.8] text-[#6B665F]`}>{c.format}</p>
              <p className={`mt-4 text-[16px] ${bookable ? "text-[#16191D]" : "text-[#4F4A44]"}`}>{c.p}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-6">
                {bookable && c.price ? <p className={`${mono} text-[15px] text-[#8A4524]`}>{c.price}</p> : <span />}
                {c.href && (
                  <LinkTo link={c.href} locale={locale} className={linkDeep}>
                    {c.href.label} <span aria-hidden="true">→</span>
                  </LinkTo>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
      {block.footnote && <p className="mt-8 max-w-[64ch] text-[14px] leading-[1.6] text-[#6B665F]">{block.footnote}</p>}
    </Section>
  );
}
