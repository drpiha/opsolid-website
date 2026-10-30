import type { BlockProps } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";

const L: Record<L3, { before: string; after: string; human: string }> = {
  de: { before: "Vorher", after: "Nachher", human: "Bleibt beim Menschen" },
  en: { before: "Before", after: "After", human: "Stays with a person" },
  tr: { before: "Önce", after: "Sonra", human: "İnsanda kalır" },
};

/** Example scenarios, always labelled by `tag`: before, after and the step that stays with a person. */
export function ExamplesBlock({ block: b, locale, num }: BlockProps<"examples">) {
  const t = L[locale];
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <p className="f-mono mt-6 inline-block rounded-full border border-[#B5623A]/50 px-3 py-1 text-[12px] uppercase text-[#8A4524]">{b.tag}</p>
      <ul className="mt-10 border-t border-[#16191D] md:mt-14">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className="v7-card grid gap-x-8 gap-y-5 border-b border-[#E3DCD1] py-8 md:grid-cols-9 md:py-10">
            <div className="md:col-span-4">
              <p className="f-mono text-[12px] uppercase text-[#8A4524]">{it.area}</p>
              <h3 className="f-display mt-3 text-[1.625rem] leading-[1.15] md:text-[2rem]">{it.h}</h3>
              {it.href && (
                <LinkTo link={it.href} locale={locale} className={`${linkDeep} mt-3`}>
                  {it.href.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              )}
            </div>
            <dl className="space-y-4 md:col-span-5">
              {(
                [
                  [t.before, it.before],
                  [t.after, it.after],
                  [t.human, it.human],
                ] as const
              ).map(([k, v], j) => (
                <div key={k} className="grid gap-x-5 gap-y-1 sm:grid-cols-[132px_1fr]">
                  <dt className={`f-mono text-[12px] uppercase leading-[1.9] ${j === 1 ? "text-[#8A4524]" : "text-[#6B665F]"}`}>{k}</dt>
                  <dd className="text-[#16191D]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
