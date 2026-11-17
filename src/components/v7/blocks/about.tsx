import { Section } from "@/components/v7/Section";
import { LinkTo } from "@/components/v7/LinkTo";
import { h2, linkDeep, wrap } from "@/components/v7/ui";
import { Etikett } from "@/components/v7/werkstatt/Etikett";
import { WkPicture } from "@/components/v7/werkstatt/WkPicture";
import { HomeSection } from "@/components/v7/werkstatt/home/HomeSection";
import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";

const mono = "f-mono";

/**
 * About with a picture (home, PLAN 6.1): the labelled desk render bleeds out to the left edge (13:8, right radius),
 * the copy sits in the right column (Etikett, H2, lede, paragraphs, the fact list, the links). Phones: copy first,
 * the picture full bleed after it (4:3).
 */
function AboutPicture({ block: b, locale }: BlockProps<"about">) {
  const pic = b.picture!;
  return (
    <HomeSection id={b.id} ground={b.ground} mat={b.mat} className="wk-about">
      <div className={`${wrap} wk-about-grid`}>
        <div className="wk-about-copy">
          <Etikett solid>{b.label}</Etikett>
          <h2 id={`${b.id}-h`} className={h2}>
            {soft(b.h)}
          </h2>
          {b.lede && <p className="wk-about-lede">{b.lede}</p>}
          {b.paras.map((p) => (
            <p key={p} className="wk-about-p">
              {p}
            </p>
          ))}
          <dl className="wk-facts-dl">
            {b.facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {(b.links ?? (b.link ? [b.link] : [])).length > 0 && (
            <div className="wk-about-links">
              {(b.links ?? [b.link!]).map((l) => (
                <LinkTo key={l.label} link={l} locale={locale} className={`${linkDeep} v7-link`} />
              ))}
            </div>
          )}
        </div>
        <figure className="wk-about-pic">
          <WkPicture pic={pic} />
          <Etikett as="figcaption">{pic.etikett}</Etikett>
        </figure>
      </div>
    </HomeSection>
  );
}

export function AboutBlock({ block, locale, num }: BlockProps<"about">) {
  if (block.picture) return <AboutPicture block={block} locale={locale} num={num} />;
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
