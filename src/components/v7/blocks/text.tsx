import type { BlockProps } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { Etikett } from "../werkstatt/Etikett";

const SOURCES: Record<L3, string> = { de: "Quellen", en: "Sources", tr: "Kaynaklar" };

/** Plain paragraphs at a 44em measure, optionally closed by the primary sources as a mono list (legal sections). */
export function TextBlock({ block: b, locale, num }: BlockProps<"text">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <div className="wk-text">
        {b.paras.map((p, i) => (
          <Reveal as="p" key={i} delay={i * 0.04}>
            {p}
          </Reveal>
        ))}
      </div>
      {b.sources && (
        <div className="wk-sources">
          <Etikett as="p">{SOURCES[locale]}</Etikett>
          {b.sources.asOf && <p className="wk-mono wk-muted mt-1">{b.sources.asOf}</p>}
          <ul>
            {b.sources.items.map((s) => (
              <li key={s.href}>
                {/* One 44 px target per source; the arrow marks the link as leaving the site. */}
                <a href={s.href} rel="noopener" className="wk-tlink">
                  {s.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
