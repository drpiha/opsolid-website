import type { BlockProps } from "@/content/v7/types";
import { LinkTo } from "../LinkTo";
import { Reveal } from "../Reveal";
import { linkDeep, wrap } from "../ui";

/**
 * The one break from the section template: a full-bleed ink band with the mat, carrying the page's key sentence in
 * display type (.wk-statement-s). Not numbered, not a quote (no marks, no attribution). A final full stop is dropped
 * so it sets like a headline. The optional note follows a copper-lite square; the optional `cta` is a text link on
 * the ink. Takes no ground and does not advance the alternation (V7Page).
 */
export function StatementBlock({ block, locale }: BlockProps<"statement">) {
  const text = block.text.trim().replace(/\.$/, "");
  return (
    <section id={block.id} aria-label={block.label} className="wk-statement wk-on-ink wk-mat" style={{ ["--mat-mask" as string]: "linear-gradient(100deg, transparent 30%, #000 85%)" }}>
      <div className={wrap}>
        <Reveal>
          <p className="wk-statement-s">{text}</p>
          {block.note && <p className="wk-statement-note">{block.note}</p>}
          {block.cta && (
            <LinkTo link={block.cta} locale={locale} className={`${linkDeep} v7-link mt-6`}>
              {block.cta.label}
              <span aria-hidden="true">→</span>
            </LinkTo>
          )}
        </Reveal>
      </div>
    </section>
  );
}
