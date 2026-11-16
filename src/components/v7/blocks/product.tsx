import { Img as Image } from "@/components/v7/Img";
import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { MediaFigure } from "../MediaFigure";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { wrap } from "../ui";

/**
 * Our own product in design C (prototype `#nfc-karte`, `#kutasia`). No offers, no prices (decision 78).
 *
 * - Split (default): the picture bleeds to the left viewport edge with its Etikett under it (an image `media`;
 *   other media kinds go through MediaFigure), the copy on the right: Etikett (`label`), H2, lede, `p` (shown when
 *   it is not the lede), points, the status line (chip plus `status`) and the text link. On phones the picture
 *   comes first, full bleed. On the char ground the section runs without block padding (the picture is the edge).
 * - `compact` (Kutasia): no media, no points, no link. One band: Etikett and H2 on the left, the one sentence and
 *   the chip on the right.
 */
export function ProductBlock({ block: b, locale }: BlockProps<"product">) {
  const ground = b.ground ?? "paper";
  const statusLine = (b.chip || b.status) && (
    <p className="wk-prod-status">
      {b.chip && <ChipTag chip={b.chip} />}
      {b.status && <span>{b.status}</span>}
    </p>
  );

  if (b.compact) {
    return (
      <section id={b.id} aria-labelledby={`${b.id}-h`} data-ground={ground} className={`wk-sec wk-on-${ground} wk-prod is-compact`}>
        <div className={`${wrap} wk-prod-compact`}>
          <div className="wk-prod-compact-head">
            <Etikett>{b.label}</Etikett>
            <h2 id={`${b.id}-h`} className="wk-d2">
              {soft(b.h)}
            </h2>
          </div>
          <div className="wk-prod-compact-body">
            <p className="wk-lede">{b.p}</p>
            {statusLine}
          </div>
        </div>
      </section>
    );
  }

  const m = b.media;
  const pic =
    m && m.kind === "image" ? (
      <figure className="wk-prod-pic">
        <Image src={m.img.src} width={m.img.w} height={m.img.h} alt={m.img.alt} sizes="(max-width: 960px) 100vw, 60vw" />
        {m.caption && <Etikett as="figcaption">{m.caption}</Etikett>}
      </figure>
    ) : m ? (
      <div className="wk-prod-media">
        <MediaFigure media={m} locale={locale} />
      </div>
    ) : null;

  return (
    <section
      id={b.id}
      aria-labelledby={`${b.id}-h`}
      data-ground={ground}
      className={`wk-sec wk-on-${ground} wk-prod${pic ? " has-pic" : ""}${ground === "char" ? " is-edge" : ""}`}
    >
      <div className={`${wrap} wk-prod-grid`}>
        {pic}
        <div className="wk-prod-copy">
          <Etikett>{b.label}</Etikett>
          {b.note && <p className="wk-sec-note">{b.note}</p>}
          <h2 id={`${b.id}-h`} className="wk-d2">
            {soft(b.h)}
          </h2>
          {b.lede && <p className="wk-lede">{b.lede}</p>}
          {b.p && b.p !== b.lede && <p className={b.lede ? "wk-prod-p" : "wk-lede"}>{b.p}</p>}
          {b.points.length > 0 && (
            <ul className="wk-prod-points">
              {b.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {statusLine}
          {b.href && (
            <LinkTo link={b.href} locale={locale} className="wk-tlink">
              {b.href.label}
              <span aria-hidden="true"> →</span>
            </LinkTo>
          )}
        </div>
      </div>
    </section>
  );
}
