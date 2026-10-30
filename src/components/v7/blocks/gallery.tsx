import Image from "next/image";
import { Section } from "@/components/v7/Section";
import { BrowserFrame } from "@/components/v7/frames/Browser";
import { PhoneFrame } from "@/components/v7/frames/Phone";
import type { BlockProps } from "@/content/v7/types";

const FIG = { de: "Abb.", en: "Fig.", tr: "Şek." } as const;
const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";

/** Scroll-snap row of frames. The scroller is focusable (arrow keys scroll) and labelled; no autoplay, no library. */
export function GalleryBlock({ block, locale, num }: BlockProps<"gallery">) {
  const phone = block.frame === "phone";
  const itemW = phone ? "w-[58vw] max-w-[230px]" : "w-[82vw] max-w-[620px]";
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      {block.tag && <p className={`${mono} mt-8 inline-block rounded-full border border-[#B5623A]/50 px-3 py-1 text-[12px] uppercase text-[#8A4524]`}>{block.tag}</p>}
      <div
        role="region"
        aria-label={block.h}
        tabIndex={0}
        className="-mx-4 mt-8 overflow-x-auto scroll-smooth px-4 pb-6 [scroll-padding-inline:1rem] [scrollbar-color:#B5623A_#E3DCD1] [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8A4524] md:mx-0 md:px-0 motion-reduce:scroll-auto"
      >
        <ul className="flex w-max snap-x snap-mandatory gap-5 md:gap-8">
          {block.items.map((it, i) => (
            <li key={`${it.img.src}-${i}`} className={`${itemW} shrink-0 snap-start`}>
              <figure>
                {block.frame === "browser" && <BrowserFrame img={it.img} sizes="(min-width: 768px) 620px, 82vw" />}
                {phone && <PhoneFrame img={it.img} sizes="230px" />}
                {block.frame === "none" && (
                  <Image src={it.img.src} alt={it.img.alt} width={it.img.w} height={it.img.h} sizes="(min-width: 768px) 620px, 82vw" className="h-auto w-full rounded-[16px] border border-[#E3DCD1]" />
                )}
                <figcaption className={`${mono} mt-4 border-t border-[#E3DCD1] pt-3 text-[12px] uppercase leading-[1.6] text-[#6B665F]`}>
                  <span className="mr-2 text-[#8A4524]">{FIG[locale]} {Number(num) || num}.{i + 1}</span>
                  {it.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
