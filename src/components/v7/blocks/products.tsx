import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { btnOnInk, h2, linkDeep, wrap } from "../ui";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { PhoneShot } from "../werkstatt/PhoneShot";
import { WkPicture } from "../werkstatt/WkPicture";
import { HomeSection } from "../werkstatt/home/HomeSection";

/**
 * "Was wir selbst bauen" (home, charcoal, PLAN 6.1): OpSo with its live chip, the store links and "Alle Produkte" on
 * the left; on the right the one full-bleed picture moment, the NFC-card render with the unedited share screen over
 * it, each with its Etikett. Below, one line for the NFC card ("in Vorbereitung", no price) and Kutasia ("in
 * Entwicklung", one sentence, no picture or link out), both linking to their anchors on the Produkte page.
 */
export function ProductsBlock({ block: b, locale }: BlockProps<"products">) {
  const { app, stage } = b;
  return (
    <HomeSection id={b.id} ground={b.ground ?? "char"} mat={b.mat} className="wk-products">
      <div className={`${wrap} wk-products-grid`}>
        <div className="wk-products-copy">
          <Etikett solid>{b.etikett}</Etikett>
          <h2 id={`${b.id}-h`} className={h2}>
            {soft(b.h)}
          </h2>
          <h3 className="wk-products-app">
            {app.name} <ChipTag chip={app.chip} />
          </h3>
          <p className="wk-products-lede">{app.p}</p>
          <div className="wk-stores">
            {app.stores.map((s) => (
              <LinkTo key={s.label} link={s} locale={locale} className={linkDeep} />
            ))}
          </div>
          <LinkTo link={app.all} locale={locale} className={`${btnOnInk} v7-link`}>
            {app.all.label}
          </LinkTo>
        </div>
        <div className="wk-products-stage">
          <figure className="wk-products-render">
            <WkPicture pic={stage.render} />
            <Etikett as="figcaption" className="wk-tag-render">
              {stage.render.etikett}
            </Etikett>
          </figure>
          <figure className="wk-products-phone">
            <PhoneShot img={stage.phone.img} sizes="(max-width: 960px) 110px, 212px" />
            <Etikett as="figcaption" className="wk-tag-screen">
              {stage.phone.etikett}
            </Etikett>
          </figure>
        </div>
      </div>
      <div className={wrap}>
        <ul className="wk-products-line">
          {b.line.map((it) => (
            <li key={it.name}>
              <LinkTo link={it.to} locale={locale}>
                <b>{it.name}</b>
                <ChipTag chip={it.chip} />
                <span className="wk-products-line-p">{it.p}</span>
              </LinkTo>
            </li>
          ))}
        </ul>
      </div>
    </HomeSection>
  );
}
