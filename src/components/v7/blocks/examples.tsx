import type { BlockProps } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { linkDeep } from "../ui";
import { Etikett } from "../werkstatt/Etikett";

const L: Record<L3, { before: string; after: string; human: string }> = {
  de: { before: "Vorher", after: "Nachher", human: "Bleibt beim Menschen" },
  en: { before: "Before", after: "After", human: "Stays with a person" },
  tr: { before: "Önce", after: "Sonra", human: "İnsanda kalır" },
};

/**
 * Example scenarios as sheet cards, each carrying the block's Etikett (`tag`, "Beispiel-Szenario"): area, heading,
 * then before, after and the step that stays with a person.
 */
export function ExamplesBlock({ block: b, locale, num }: BlockProps<"examples">) {
  const t = L[locale];
  const cols = b.items.length % 3 === 0 ? "is-3" : "is-2";
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ul className={`wk-cards ${cols}`}>
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={(i % 3) * 0.06} className="wk-card wk-example v7-card">
            <div className="wk-example-head">
              <Etikett>{b.tag}</Etikett>
              <p className="wk-ledger-no">{it.area}</p>
              <h3 className="wk-card-h">{it.h}</h3>
            </div>
            <dl className="wk-example-dl">
              {(
                [
                  [t.before, it.before],
                  [t.after, it.after],
                  [t.human, it.human],
                ] as const
              ).map(([k, v], j) => (
                <div key={k} className={j === 1 ? "is-after" : undefined}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {it.href && (
              <LinkTo link={it.href} locale={locale} className={`${linkDeep} v7-link wk-card-link`}>
                {it.href.label}
                <span aria-hidden="true">→</span>
              </LinkTo>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
