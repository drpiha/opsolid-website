import type { BlockProps } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "../LinkTo";
import { MediaFigure } from "../MediaFigure";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";

const STATUS: Record<L3, string> = { de: "Status", en: "Status", tr: "Durum" };

/** Teaser for our own product (OpSo): name, honest status, points and a figure. No offers. */
export function ProductBlock({ block: b, locale, num }: BlockProps<"product">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <div className="mt-10 grid gap-x-10 gap-y-14 md:mt-14 lg:grid-cols-9">
        <div className="lg:col-span-4">
          <Reveal>
            <h3 className="f-display text-[1.75rem] leading-[1.15] md:text-[2.25rem]">{b.name}</h3>
            <p className="mt-5 text-[#16191D]">{b.p}</p>
            <ul className="mt-6 space-y-2.5 text-[16px]">
              {b.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-[#B5623A]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {b.price && (
              <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#E3DCD1] pt-5 text-[16px]">
                <span className="f-mono text-[11px] uppercase text-[#6B665F]">{b.price.label}</span>
                <span className="f-mono text-[15px] text-[#8A4524]">{b.price.value}</span>
              </p>
            )}
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 border-l border-[#B5623A] pl-5 text-[16px] leading-[1.6] text-[#16191D]">
              <span className="f-mono mb-1 block text-[11px] uppercase text-[#8A4524]">{STATUS[locale]}</span>
              {b.status}
            </p>
            {b.href && (
              <div className="mt-8">
                <LinkTo link={b.href} locale={locale} className={linkDeep}>
                  {b.href.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              </div>
            )}
          </Reveal>
        </div>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <MediaFigure media={b.media} locale={locale} />
        </Reveal>
      </div>
    </Section>
  );
}
