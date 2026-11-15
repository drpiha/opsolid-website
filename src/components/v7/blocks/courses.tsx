import { Fragment } from "react";
import { Section } from "@/components/v7/Section";
import Link from "next/link";
import { LinkTo, resolveHref } from "@/components/v7/LinkTo";
import { Reveal } from "@/components/v7/Reveal";
import { btnPrimary, linkDeep } from "@/components/v7/ui";
import { ChipTag } from "@/components/v7/werkstatt/Chip";
import { Etikett } from "@/components/v7/werkstatt/Etikett";
import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";

/** Sets every amount ("179 €", "€179", "1.790 €") of a mono line in copper-deep; the words stay ink. */
function amounts(line: string) {
  return line.split(/(€\s?\d[\d.,]*|\d[\d.,]*\s?€)/).map((part, i) =>
    /\d/.test(part) && /€/.test(part) ? (
      <span key={i} className="text-wk-copper-deep">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * Training catalogue as a hairline ledger, read like a timetable: one row per course. Left column: the name over
 * the spec line (length and hours in ink, then people, delivery and record in stone, the status last), below it
 * the description and the link. Right column: the team price as the signature of the row (Fraunces 300, 48 px
 * desktop and 40 px phones, copper-deep, tabular figures), its unit and the per-person arithmetic as unwrapped
 * mono lines with the amounts in copper. On phones the price block sits right under the spec line, before the
 * description. block.footnote is the terms line under the ledger; block.note goes to the section's left column.
 */
/** "ab 1.790 €" / "from €1,790": the leading word is set small and raised; TR ("1.790 €'dan") has none. */
function priceParts(price: string): [string | null, string] {
  const m = /^(ab|from)\s+(.+)$/i.exec(price);
  return m ? [m[1], m[2]] : [null, price];
}

/**
 * The C ledger (`variant: "ledger"`, home): one linked row per bookable course on a 2 px rule (track tag with the
 * duration bars, name and one line, the spec lines, the team price with unit and arithmetic), then the one quiet
 * dashed row of planned courses (names only, "geplant", "Interesse vormerken"; rule 5), then the terms line with
 * the price note beside the button to the hub.
 */
function Ledger({ block, locale, num }: BlockProps<"courses">) {
  const rows = block.items.filter((c) => c.status === "bookable" && c.price);
  const planned = block.items.filter((c) => c.status === "planned");
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} ground={block.ground} mat={block.mat} locale={locale}>
      <div className="wk-ledger">
        {rows.map((c) => {
          const [ab, fig] = priceParts(c.price ?? "");
          const [first, ...rest] = c.spec ?? [];
          const body = (
            <>
              <div className="wk-ledger-track">
                {c.tag && <Etikett solid>{c.tag}</Etikett>}
                {c.bars && (
                  <span className="wk-dur" aria-hidden="true">
                    {Array.from({ length: c.bars }, (_, i) => (
                      <i key={i} />
                    ))}
                  </span>
                )}
              </div>
              <div className="wk-ledger-what">
                <h3>{soft(c.name)}</h3>
                {c.p && <p>{c.p}</p>}
              </div>
              <div className="wk-ledger-spec">
                {first && <b>{first}</b>}
                {rest.map((s) => (
                  <span key={s} className="wk-mono">
                    {s}
                  </span>
                ))}
              </div>
              <div className="wk-ledger-price">
                <span className="wk-price-fig">
                  {ab && <small>{ab}</small>}
                  {fig}
                </span>
                {c.unit && <span className="wk-mono">{c.unit}</span>}
                {c.arith?.map((a) => (
                  <span key={a} className="wk-mono wk-arith">
                    {a}
                  </span>
                ))}
              </div>
            </>
          );
          return c.href ? (
            <Link key={c.name} id={c.id} className="wk-ledger-row" href={resolveHref(c.href, locale)}>
              {body}
            </Link>
          ) : (
            <div key={c.name} id={c.id} className="wk-ledger-row">
              {body}
            </div>
          );
        })}
      </div>
      {block.soon && planned.length > 0 && (
        <div className="wk-soon" id={block.soon.id}>
          <div className="wk-soon-head">
            <Etikett>{block.soon.label}</Etikett>
            <ChipTag chip={{ kind: "plan", text: block.soon.chip }} />
            <LinkTo link={block.soon.link} locale={locale} className={`${linkDeep} v7-link`}>
              {block.soon.link.label}
            </LinkTo>
          </div>
          <ul className="wk-soon-list">
            {planned.map((c) => (
              <li key={c.name}>
                <b>{c.name}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="wk-ledger-note">
        {block.footnote && <p className="wk-mono">{block.footnote}</p>}
        {block.cta && (
          <LinkTo link={block.cta} locale={locale} className={`${btnPrimary} v7-link`}>
            {block.cta.label}
          </LinkTo>
        )}
      </div>
    </Section>
  );
}

export function CoursesBlock({ block, locale, num }: BlockProps<"courses">) {
  if (block.variant === "ledger") return <Ledger block={block} locale={locale} num={num} />;
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} ground={block.ground} mat={block.mat} locale={locale}>
      <ol className="mt-12 border-t border-wk-ink md:mt-16">
        {block.items.map((c, i) => {
          const bookable = c.status === "bookable";
          const priced = bookable && !!c.price;
          const [lead, ...rest] = (c.format ?? "").split(" · ");
          const spec = [...rest, c.statusLabel].filter(Boolean);
          const left = priced ? "md:col-span-5" : "md:col-span-9";
          return (
            <Reveal as="li" key={c.name} delay={i * 0.05} className="v7-card grid gap-x-10 gap-y-6 border-b border-wk-line py-8 md:grid-cols-9 md:gap-y-5 md:py-10">
              <div className={left}>
                <p className="f-mono text-[12px] leading-[1.7] text-wk-copper-deep">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="f-display mt-3 text-balance text-[1.5rem] leading-[1.15] md:text-[1.75rem]">{c.name}</h3>
                {/* Tokens never break inside and carry their copper separator; a line breaks only at the space between tokens. */}
                <p className="f-mono mt-3 text-[12px] leading-[1.8] text-wk-muted">
                  {[lead, ...spec].map((s, k, all) => (
                    <Fragment key={s}>
                      {k > 0 && " "}
                      <span className={`whitespace-nowrap ${k === 0 ? "text-wk-ink" : ""}`}>
                        {s}
                        {k < all.length - 1 && (
                          <span aria-hidden="true" className="text-wk-copper">
                            {" "}·
                          </span>
                        )}
                      </span>
                    </Fragment>
                  ))}
                </p>
              </div>

              {priced && (
                <div className="md:col-span-4 md:row-span-2 md:pt-8 md:text-right">
                  <p className="f-display text-[2.5rem] leading-none tracking-[-0.02em] text-wk-copper-deep [font-variant-numeric:tabular-nums_lining-nums] md:text-[3rem]">{c.price}</p>
                  {c.unit && <p className="f-mono mt-2 text-[12px] leading-[1.7] text-wk-muted">{c.unit}</p>}
                  {c.arith && c.arith.length > 0 && (
                    <p className="f-mono mt-4 text-[12px] leading-[1.8] text-wk-ink">
                      {c.arith.map((line) => (
                        <span key={line} className="block whitespace-nowrap">
                          {amounts(line)}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}

              <div className={`${left} md:col-start-1`}>
                <p className={`max-w-[52ch] ${bookable ? "text-wk-ink" : "text-wk-muted"}`}>{c.p}</p>
                {c.href && (
                  <LinkTo link={c.href} locale={locale} className={`${linkDeep} mt-3`}>
                    {c.href.label}
                    <span aria-hidden="true">→</span>
                  </LinkTo>
                )}
              </div>
            </Reveal>
          );
        })}
      </ol>
      {block.footnote && <p className="mt-8 max-w-[64ch] text-[14px] leading-[1.6] text-wk-muted">{block.footnote}</p>}
    </Section>
  );
}
