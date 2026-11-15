import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A table (rate card, comparison). On phones every row stacks with its column names. */
function PlainTable({ block: b }: { block: BlockProps<"table">["block"] }) {
  return (
    <Reveal className="mt-10 md:mt-14">
      <table className="w-full border-collapse text-left text-[16px]">
        <caption className="f-mono mb-4 text-left text-[12px] text-wk-muted">{b.caption}</caption>
        <thead className="max-md:sr-only">
          <tr className="border-b border-wk-ink">
            {b.cols.map((c) => (
              <th key={c} scope="col" className="f-mono py-3 pr-6 text-[12px] font-normal text-wk-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {b.rows.map((r) => (
            <tr key={r[0]} className="border-b border-wk-line max-md:block max-md:py-4">
              {r.map((cell, j) => (
                <td
                  key={j}
                  data-label={b.cols[j]}
                  className={`py-4 pr-6 align-top max-md:block max-md:py-1 max-md:before:font-[family-name:var(--font-plex-mono)] max-md:before:block max-md:before:text-[12px] max-md:before:text-wk-muted max-md:before:content-[attr(data-label)] ${
                    j === 0 ? "f-display text-[1.25rem] leading-[1.25] md:text-[1.375rem]" : "text-wk-ink"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {b.footnote && <p className="mt-5 max-w-[64ch] text-[14px] leading-[1.6] text-wk-muted">{b.footnote}</p>}
    </Reveal>
  );
}

/**
 * The price table (design C, `variant: "prices"`): mono column heads on a 2 px rule, the course as a row header,
 * the last two columns right-aligned with the team price large. Phones get `list` instead (name, mono spec, price,
 * mono unit); the price note closes both. The caption is visually hidden (the H2 says it).
 */
function PriceTable({ block: b }: { block: BlockProps<"table">["block"] }) {
  const last = b.cols.length - 1;
  return (
    <Reveal className="wk-prices">
      <div className="wk-table-wrap wk-ptable-wrap">
        <table className="wk-table wk-ptable">
          <caption className="wk-vh">{b.caption}</caption>
          <thead>
            <tr>
              {b.cols.map((c, j) => (
                <th key={c} scope="col" className={j >= last - 1 ? "r" : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className={j >= last - 1 ? "r wk-num" : undefined}>
                      {j === last ? <span className="wk-big wk-num">{cell}</span> : cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.list && b.list.length > 0 && (
        <ul className="wk-plist" aria-label={b.caption}>
          {b.list.map((it) => (
            <li key={it.what}>
              <div className="wk-pl-what">
                <b>{it.what}</b>
                <span className="wk-mono">{it.meta}</span>
              </div>
              <div className="wk-pl-price">
                <span className="wk-big wk-num">{it.price}</span>
                <span className="wk-mono">{it.unit}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {b.footnote && <p className="wk-prices-note wk-mono">{b.footnote}</p>}
    </Reveal>
  );
}

export function TableBlock({ block: b, locale, num }: BlockProps<"table">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale}>
      {b.variant === "prices" ? <PriceTable block={b} /> : <PlainTable block={b} />}
    </Section>
  );
}
