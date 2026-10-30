import Image from "next/image";
import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { Reveal } from "@/components/v7/Reveal";
import { BrowserFrame } from "@/components/v7/frames/Browser";
import { PhoneFrame } from "@/components/v7/frames/Phone";
import { linkDeep } from "@/components/v7/ui";
import type { BlockProps } from "@/content/v7/types";

const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";
const display = "font-[family-name:var(--font-fraunces),Georgia,serif] font-light [font-variation-settings:'SOFT'_50]";

export function ProjectsBlock({ block, locale, num }: BlockProps<"projects">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <ul className="mt-10 space-y-6 md:mt-14 md:space-y-8">
        {block.items.map((p, i) => {
          const phone = p.frame === "phone";
          return (
            <Reveal as="li" key={p.name} className="v7-card grid items-center gap-x-10 gap-y-8 rounded-[24px] border border-[#E3DCD1] bg-white p-5 md:grid-cols-9 md:p-8">
              <div className={`${i % 2 === 1 ? "md:order-2" : ""} md:col-span-4`}>
                <p className={`${mono} inline-block rounded-full border border-[#B5623A]/50 px-3 py-1 text-[12px] uppercase text-[#8A4524]`}>{p.status}</p>
                <h3 className={`${display} mt-4 text-[1.75rem] leading-[1.1] md:text-[2.25rem]`}>{p.name}</h3>
                <p className="mt-3 max-w-[44ch] text-[16px] md:text-[17px]">{p.p}</p>
                {p.points && p.points.length > 0 && (
                  <ul className="mt-5 divide-y divide-[#E3DCD1] border-y border-[#E3DCD1] text-[16px]">
                    {p.points.map((pt) => (
                      <li key={pt} className="py-2.5">
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
                {p.href && (
                  <LinkTo link={p.href} locale={locale} className={`${linkDeep} mt-4`}>
                    {p.href.label} <span aria-hidden="true">→</span>
                  </LinkTo>
                )}
              </div>
              <div className={`${i % 2 === 1 ? "md:order-1" : ""} md:col-span-5`}>
                {p.frame === "browser" && <BrowserFrame img={p.img} url={p.name} sizes="(min-width: 768px) 560px, 100vw" />}
                {phone && (
                  <div className="mx-auto w-[56%] max-w-[240px]">
                    <PhoneFrame img={p.img} />
                  </div>
                )}
                {p.frame === "none" && (
                  <Image src={p.img.src} alt={p.img.alt} width={p.img.w} height={p.img.h} sizes="(min-width: 768px) 560px, 100vw" className="h-auto w-full rounded-[16px] border border-[#E3DCD1]" />
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
