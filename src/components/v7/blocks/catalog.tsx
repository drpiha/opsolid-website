import type { BlockProps } from "@/content/v7/types";
import type { CatalogItem, CourseArt } from "@/content/v7/types-hub";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { Section } from "../Section";
import { btnPrimary, linkDeep } from "../ui";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { BloeckeGrid } from "../werkstatt/hub/BloeckeGrid";
import { WorkflowSchema } from "../werkstatt/hub/WorkflowSchema";
import { Zeitplan } from "../werkstatt/hub/Zeitplan";

function Art({ art }: { art: CourseArt }) {
  if (art.kind === "zeitplan") return <Zeitplan art={art} />;
  if (art.kind === "bloecke") return <BloeckeGrid art={art} />;
  return <WorkflowSchema art={art} />;
}

/** "ab 1.790 €" sets "ab" small before the figure; prices without the prefix (TR "1.790 €'dan") stay whole. */
function Price({ price }: { price: string }) {
  const m = price.match(/^(ab|from)\s+(.+)$/);
  return (
    <span className="wk-price-fig wk-num">
      {m ? (
        <>
          <small>{m[1]}</small>
          {m[2]}
        </>
      ) : (
        price
      )}
    </span>
  );
}

function Kurs({ it, locale }: { it: CatalogItem; locale: BlockProps<"catalog">["locale"] }) {
  return (
    <article className="wk-kurs" id={it.id} aria-labelledby={`${it.id}-h`}>
      <div className="wk-kurs-main">
        <Etikett solid>{it.tag}</Etikett>
        <h3 id={`${it.id}-h`}>{soft(it.name)}</h3>
        <p>{it.p}</p>
        <ul className="wk-kurs-facts">
          {it.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <figure className="wk-kurs-pic">
        <Art art={it.art} />
        <Etikett as="figcaption">{it.art.etikett}</Etikett>
      </figure>
      <div className="wk-kurs-foot">
        <ChipTag chip={{ kind: "live", text: it.status }} />
        <span className="wk-kurs-price">
          <Price price={it.price} />
          <span className="wk-mono">
            {it.unit}
            <br />
            {/* the per-person arithmetic where it is published (rule 1), else the surcharge line */}
            {it.arith ?? it.facts[2]}
          </span>
        </span>
        <span className="wk-kurs-go">
          <LinkTo link={it.detail} locale={locale} className={`${linkDeep} v7-link`}>
            {it.detail.label}
            <span className="wk-vh">: {it.name}</span>
          </LinkTo>
          <LinkTo link={it.primary} locale={locale} className={`${btnPrimary} v7-link`}>
            {it.primary.label}
            <span className="wk-vh">: {it.name}</span>
          </LinkTo>
        </span>
      </div>
    </article>
  );
}

/**
 * The hub course catalog (design C): one rate card per bookable course (ink border, hard offset shadow; main column
 * with the track tag, name, live description and the three facts; a drawn piece on sheet with its Etikett; a foot
 * with the status chip, the team price, unit and arithmetic, the detail link and the request button), the price note,
 * then the planned courses as one dashed list (rule 5: names only, "geplant", "Interesse vormerken").
 */
export function CatalogBlock({ block: b, locale, num }: BlockProps<"catalog">) {
  const pl = b.planned;
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <div className="wk-kurse">
        {b.items.map((it) => (
          <Kurs key={it.id} it={it} locale={locale} />
        ))}
      </div>
      <p className="wk-kurse-note wk-mono">{b.footnote}</p>

      <div id={pl.id} className="wk-soon is-page">
        <div className="wk-soon-head">
          <Etikett>{pl.label}</Etikett>
          <ChipTag chip={{ kind: "plan", text: pl.chip }} />
          <LinkTo link={pl.link} locale={locale} className={`${linkDeep} v7-link`}>
            {pl.link.label}
          </LinkTo>
        </div>
        <ul className="wk-soon-list" aria-label={pl.label}>
          {pl.names.map((n) => (
            <li key={n}>
              <b>{n}</b>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
