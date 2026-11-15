import Image from "next/image";
import type { BlockProps } from "@/content/v7/types";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";

/** Hairline ledger of rows on a 2 px top rule; the tag is a chip; optionally linked; optionally a real screenshot of our own work. */
export function RowsBlock({ block: b, locale, num }: BlockProps<"rows">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ul className="wk-ledger">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className={`wk-ledger-line wk-row${it.img ? " has-img" : ""}`}>
            <div className="wk-row-head">
              {it.tag && <span className="wk-chip is-note">{it.tag}</span>}
              <h3 className="wk-row-h">{it.h}</h3>
            </div>
            <div className="wk-row-body">
              <p className="wk-muted">{it.p}</p>
              {it.href && (
                <LinkTo link={it.href} locale={locale} className={`${linkDeep} v7-link`}>
                  {it.href.label}
                  <span aria-hidden="true">→</span>
                </LinkTo>
              )}
            </div>
            {it.img && (
              <div className="wk-row-img">
                <Image src={it.img.src} width={it.img.w} height={it.img.h} alt={it.img.alt} sizes="(min-width: 961px) 240px, 100vw" className="h-auto w-full" />
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
