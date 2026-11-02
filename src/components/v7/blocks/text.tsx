import type { BlockProps } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { mono } from "../ui";

const SOURCES: Record<L3, string> = { de: "Quellen", en: "Sources", tr: "Kaynaklar" };

/** Plain paragraphs, optionally closed by a line of primary sources (legal sections). */
export function TextBlock({ block: b, locale, num }: BlockProps<"text">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <div className="mt-8 max-w-[62ch] space-y-5 md:mt-10">
        {b.paras.map((p, i) => (
          <Reveal as="p" key={i} delay={i * 0.04} className="text-[#16191D]">
            {p}
          </Reveal>
        ))}
      </div>
      {b.sources && (
        <div className="mt-8 max-w-[62ch] border-t border-[#E3DCD1] pt-4">
          <p className={mono}>
            {SOURCES[locale]}
            {b.sources.asOf && <span className="ml-3">{b.sources.asOf}</span>}
          </p>
          <ul className="mt-2 space-y-1 text-[15px] leading-[1.5]">
            {b.sources.items.map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="noopener" className="text-[#8A4524] underline decoration-[#B5623A]/50 underline-offset-[3px] transition-colors hover:decoration-[#8A4524]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
