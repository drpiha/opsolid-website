import { Img as Image } from "@/components/v7/Img";
import { Section } from "@/components/v7/Section";
import { BrowserFrame } from "@/components/v7/frames/Browser";
import { LinkTo } from "@/components/v7/LinkTo";
import type { BlockProps } from "@/content/v7/types";
import { Etikett } from "../werkstatt/Etikett";
import { PhoneShot } from "../werkstatt/PhoneShot";

/**
 * A scroll-snap row of real screens in design C: phones in the .wk-ph frame (or a browser frame), a short caption
 * under each, and one Etikett under the row that says what the pictures are (`tag`, rule 6: "App-Screens ·
 * unbearbeitet, Demodaten", "Beispiel · Musterkarten, ..."). No "Abb." numbering. The scroller is focusable (arrow
 * keys scroll) and labelled; no autoplay, no library. An item with `link` is one anchor around the whole figure (the
 * picture is the tap target) with a visible cue line under the caption; its name comes from the alt, caption and cue.
 * The cue sits in its own grid row, so all cues share one baseline however the captions wrap. `is-fit` (four phones
 * or fewer): on desktop the row spans the full wrap instead of scrolling.
 */
export function GalleryBlock({ block, locale, num }: BlockProps<"gallery">) {
  const phone = block.frame === "phone";
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} ground={block.ground} mat={block.mat} locale={locale} className="has-gallery">
      <div className={`wk-gallery${phone ? " is-phone" : " is-wide"}${phone && block.items.length <= 4 ? " is-fit" : ""}`}>
        <div role="region" aria-label={block.h} tabIndex={0} className="wk-gallery-scroll">
          <ul className="wk-gallery-row">
            {block.items.map((it, i) => {
              const fig = (
                <figure>
                  {phone && <PhoneShot img={it.img} sizes="(max-width: 960px) 150px, 200px" />}
                  {block.frame === "browser" && <BrowserFrame img={it.img} sizes="(min-width: 768px) 620px, 82vw" />}
                  {block.frame === "none" && (
                    <Image src={it.img.src} alt={it.img.alt} width={it.img.w} height={it.img.h} sizes="(min-width: 768px) 620px, 82vw" className="wk-gallery-img" />
                  )}
                  <figcaption>
                    {it.caption}
                    {it.sub && <span className="wk-gallery-sub">{it.sub}</span>}
                  </figcaption>
                  {it.link && (
                    <span className="wk-gallery-go">
                      {it.link.label}
                      <span aria-hidden="true"> ↗</span>
                    </span>
                  )}
                </figure>
              );
              return (
                <li key={`${it.img.src}-${i}`}>
                  {it.link ? (
                    <LinkTo link={it.link} locale={locale} className="wk-gallery-card">
                      {fig}
                    </LinkTo>
                  ) : (
                    fig
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {block.tag && (
          <Etikett as="p" className="wk-gallery-etikett">
            {block.tag}
          </Etikett>
        )}
      </div>
    </Section>
  );
}
