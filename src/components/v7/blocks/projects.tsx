import Image from "next/image";
import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { Reveal } from "@/components/v7/Reveal";
import { BrowserFrame } from "@/components/v7/frames/Browser";
import { PhoneFrame } from "@/components/v7/frames/Phone";
import { linkDeep } from "@/components/v7/ui";
import type { BlockProps } from "@/content/v7/types";


export function ProjectsBlock({ block, locale, num }: BlockProps<"projects">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} ground={block.ground} mat={block.mat} locale={locale}>
      <ul className="space-y-6 md:space-y-8">
        {block.items.map((p, i) => {
          const phone = p.frame === "phone";
          return (
            <Reveal as="li" key={p.name} className="wk-card v7-card grid items-center gap-x-10 gap-y-8 p-5 md:grid-cols-12 md:p-8">
              <div className={`${i % 2 === 1 ? "md:order-2" : ""} md:col-span-5`}>
                <span className="wk-chip is-live">{p.status}</span>
                <h3 className="wk-card-h mt-4">{p.name}</h3>
                <p className="mt-3 max-w-[44ch] text-[16px] md:text-[17px]">{p.p}</p>
                {p.points && p.points.length > 0 && (
                  <ul className="wk-ticks mt-5 text-[16px]">
                    {p.points.map((pt) => (
                      <li key={pt}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
                {p.href && (
                  <LinkTo link={p.href} locale={locale} className={`${linkDeep} v7-link mt-4`}>
                    {p.href.label} <span aria-hidden="true">→</span>
                  </LinkTo>
                )}
              </div>
              <div className={`${i % 2 === 1 ? "md:order-1" : ""} md:col-span-7`}>
                {p.frame === "browser" && <BrowserFrame img={p.img} url={p.name} sizes="(min-width: 768px) 560px, 100vw" />}
                {phone && (
                  <div className="mx-auto w-[56%] max-w-[240px]">
                    <PhoneFrame img={p.img} />
                  </div>
                )}
                {p.frame === "none" && (
                  <Image src={p.img.src} alt={p.img.alt} width={p.img.w} height={p.img.h} sizes="(min-width: 768px) 560px, 100vw" className="h-auto w-full rounded-[10px] border border-wk-line" />
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
