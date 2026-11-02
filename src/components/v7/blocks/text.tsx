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
        <div className="mt-10 max-w-[62ch] border-t border-[#E3DCD1] pt-5">
          <p className={mono}>{SOURCES[locale]}</p>
          {b.sources.asOf && <p className={`${mono} mt-1`}>{b.sources.asOf}</p>}
          <ul className="mt-3 text-[15px] leading-[1.45]">
            {b.sources.items.map((s) => (
              <li key={s.href}>
                {/* One 44 px target per source; the arrow marks the link as leaving the site. */}
                <a
                  href={s.href}
                  rel="noopener"
                  className="group inline-flex min-h-[44px] items-center gap-2 py-1 text-[#8A4524] underline decoration-[#B5623A]/60 underline-offset-[3px] transition-colors hover:decoration-[#8A4524]"
                >
                  {s.label}
                  <span aria-hidden="true" className="text-[12px] no-underline transition-transform group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transition-none">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
