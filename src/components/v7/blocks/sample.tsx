import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { Blatt } from "../werkstatt/Blatt";

/**
 * A sample deliverable as a Blatt (a document drawn in HTML/CSS) with the stamp (`mark`: "Muster", "Beispiel,
 * fiktiv"). Rated rows as label plus chip, or a report excerpt of headed groups; the foot line closes the sheet.
 */
export function SampleBlock({ block: b, locale, num }: BlockProps<"sample">) {
  const meta = b.meta.split(" · ");
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <Reveal className="wk-sample">
        <Blatt
          titleAs="h3"
          title={b.title}
          ariaLabel={`${b.mark}: ${b.title}`}
          stamp={b.mark}
          sub={meta.map((part, i) => (
            <span key={part} className="wk-sample-meta">
              {i > 0 && <span aria-hidden="true"> · </span>}
              {part}
            </span>
          ))}
          foot={b.foot}
        >
          {b.rows.length > 0 && (
            <dl className="wk-sample-rows">
              {b.rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    <span className="wk-chip is-note">{v}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {b.sections && (
            <div className="wk-sample-secs">
              {b.sections.map((s, i) => {
                const List = s.ordered ? "ol" : "ul";
                return (
                  <div key={s.h} className="wk-sample-sec">
                    <h4>
                      <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      {s.h}
                    </h4>
                    <List className={s.ordered ? "is-ordered" : "wk-dashes"}>
                      {s.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </List>
                  </div>
                );
              })}
            </div>
          )}
        </Blatt>
      </Reveal>
    </Section>
  );
}
