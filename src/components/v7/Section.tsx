import type { ReactNode } from "react";
import type { Href } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "./LinkTo";
import { Reveal } from "./Reveal";
import { h2, linkDeep, wrap } from "./ui";

/**
 * Section frame: top hairline with a 56 px copper tick, a left mono column ("01 Label" + one-line note)
 * and the content on the right (H2, answer-first lede, children, optional link).
 */
export function Section({
  id,
  num,
  label,
  note,
  h,
  lede,
  cta,
  locale,
  children,
  wide,
}: {
  id: string;
  num?: string;
  label: string;
  note?: string;
  h: string;
  lede?: string;
  cta?: Href;
  locale: L3;
  children?: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-24 scroll-mt-20 md:mt-40">
      <div className={wrap}>
        <div className="relative grid gap-x-8 gap-y-8 border-t border-[#E3DCD1] pt-6 md:grid-cols-12">
          <span aria-hidden="true" className="absolute -top-px left-0 h-px w-14 bg-[#B5623A]" />
          <div className="md:col-span-3">
            <p className="f-mono text-[12px] uppercase leading-[1.7] text-[#6B665F]">
              {num && <span className="mr-3 text-[#8A4524]">{num}</span>}
              {label}
            </p>
            {note && <p className="mt-3 hidden max-w-[24ch] text-[14px] leading-[1.5] text-[#6B665F] md:block">{note}</p>}
          </div>
          <div className="min-w-0 md:col-span-9">
            <Reveal>
              <h2 id={`${id}-h`} className={`${h2} ${wide ? "" : "max-w-[20ch]"}`}>
                {h}
              </h2>
            </Reveal>
            {lede && (
              <Reveal delay={0.06}>
                <p className="mt-6 max-w-[58ch] text-[#16191D]">{lede}</p>
              </Reveal>
            )}
            {children}
            {cta && (
              <div className="mt-10">
                <LinkTo link={cta} locale={locale} className={linkDeep}>
                  {cta.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
