import type { Href } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "../LinkTo";

/**
 * The fact strip at the hero edge: a ruler, then four (or three) cells of label over value, and the mono price
 * note under it ("Alle Preise netto zzgl. USt., nur für Unternehmen."). With `links` (same length as `items`) every
 * cell is a link with the larger value type. `tone` picks the light or dark colours (.wk-facts / .is-light).
 */
export function FactsStrip({
  items,
  note,
  tone,
  links,
  locale,
  label,
  className,
}: {
  items: [string, string][];
  note?: string;
  tone: "light" | "dark";
  links?: Href[];
  locale?: L3;
  /** Accessible name of the list (optional). */
  label?: string;
  className?: string;
}) {
  const three = items.length === 3;
  return (
    <div className={`wk-facts${tone === "light" ? " is-light" : ""}${className ? ` ${className}` : ""}`}>
      <div className="wk-ruler" aria-hidden="true" />
      <ul className={`wk-facts-row${three ? " is-3" : ""}`} aria-label={label}>
        {items.map(([k, v], i) => {
          const link = links?.[i];
          const cell = (
            <>
              <span className="wk-fact-k">{k}</span>
              <span className="wk-fact-v">{v}</span>
            </>
          );
          return (
            <li key={k} className="wk-fact">
              {link && locale ? (
                <LinkTo link={link} locale={locale}>
                  {cell}
                </LinkTo>
              ) : (
                cell
              )}
            </li>
          );
        })}
      </ul>
      {note && <p className="wk-facts-note">{note}</p>}
    </div>
  );
}
