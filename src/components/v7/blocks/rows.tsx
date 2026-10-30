import Image from "next/image";
import type { BlockProps } from "@/content/v7/types";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";

/** Hairline ledger of rows, optionally linked, optionally with a real screenshot of our own work. */
export function RowsBlock({ block: b, locale, num }: BlockProps<"rows">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <ul className="mt-12 border-t border-[#16191D] md:mt-16">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className="v7-card grid gap-x-8 gap-y-4 border-b border-[#E3DCD1] py-8 md:grid-cols-9 md:py-10">
            <div className="md:col-span-4">
              {it.tag && <p className="f-mono mb-3 text-[12px] uppercase text-[#8A4524]">{it.tag}</p>}
              <h3 className="f-display text-[1.5rem] leading-[1.15] md:text-[1.875rem]">{it.h}</h3>
            </div>
            <div className={it.img ? "md:col-span-3" : "md:col-span-5"}>
              <p className="text-[#16191D]">{it.p}</p>
              {it.href && (
                <LinkTo link={it.href} locale={locale} className={`${linkDeep} mt-3`}>
                  {it.href.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              )}
            </div>
            {it.img && (
              <div className="overflow-hidden rounded-[14px] border border-[#E3DCD1] bg-white md:col-span-2">
                <Image src={it.img.src} width={it.img.w} height={it.img.h} alt={it.img.alt} sizes="(min-width: 768px) 20vw, 100vw" className="h-auto w-full" />
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
