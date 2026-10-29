import type { BlockProps } from "@/content/v7/types";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";

/** Offer ladder or rate cards. A price is shown only when the page data carries a published one. */
export function OffersBlock({ block: b, locale, num }: BlockProps<"offers">) {
  const cols = b.items.length >= 3 && b.items.length !== 4 ? "lg:grid-cols-3" : "";
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <ol className={`mt-12 grid items-stretch gap-4 sm:grid-cols-2 md:mt-16 ${cols}`}>
        {b.items.map((it, i) => (
          <Reveal
            as="li"
            key={it.name}
            delay={(i % 2) * 0.07}
            className={`flex flex-col rounded-[24px] border p-6 md:p-7 ${it.featured ? "border-[#B5623A]/60 bg-white shadow-[0_24px_44px_-30px_rgba(22,25,29,0.3)]" : "border-[#E3DCD1] bg-white/70"}`}
          >
            <p className="f-mono text-[12px] uppercase text-[#8A4524]">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="f-display mt-3 text-[1.5rem] leading-[1.15] md:text-[1.75rem]">{it.name}</h3>
            {it.price && (
              <p className="mt-4 flex min-h-[3.25rem] flex-wrap content-start items-baseline gap-x-3 gap-y-1">
                <span className="f-display text-[1.5rem] leading-[1.2] text-[#8A4524] md:text-[1.625rem]">{it.price}</span>
                {it.unit && <span className="f-mono text-[12px] uppercase leading-[1.4] text-[#6B665F]">{it.unit}</span>}
              </p>
            )}
            <p className="mt-4 text-[16px] text-[#16191D]">{it.p}</p>
            <ul className="mt-5 flex-1 space-y-2.5 border-t border-[#E3DCD1] pt-5 text-[15px]">
              {it.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-[#B5623A]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {it.href && (
              <div className="pt-5">
                <LinkTo link={it.href} locale={locale} className={linkDeep}>
                  {it.href.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              </div>
            )}
          </Reveal>
        ))}
      </ol>
      <p className="mt-6 max-w-[64ch] text-[14px] leading-[1.6] text-[#6B665F]">{b.footnote}</p>
    </Section>
  );
}
