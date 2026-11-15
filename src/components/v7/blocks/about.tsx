import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { linkDeep } from "@/components/v7/ui";
import type { BlockProps } from "@/content/v7/types";

const mono = "f-mono";

export function AboutBlock({ block, locale, num }: BlockProps<"about">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} ground={block.ground} mat={block.mat} locale={locale}>
      <div className="mt-10 grid gap-x-10 gap-y-10 md:mt-14 lg:grid-cols-9">
        <div className="space-y-5 lg:col-span-5">
          {block.paras.map((p) => (
            <p key={p} className="max-w-[56ch]">
              {p}
            </p>
          ))}
          {block.link && (
            <LinkTo link={block.link} locale={locale} className={`${linkDeep} mt-2`}>
              {block.link.label} <span aria-hidden="true">→</span>
            </LinkTo>
          )}
        </div>
        <dl className="border-t border-wk-ink lg:col-span-4">
          {block.facts.map(([k, v]) => (
            <div key={k} className="grid gap-x-6 gap-y-1 border-b border-wk-line py-4 sm:grid-cols-3">
              <dt className={`${mono} text-[12px] leading-[1.8] text-wk-muted`}>{k}</dt>
              <dd className="text-[16px] sm:col-span-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
