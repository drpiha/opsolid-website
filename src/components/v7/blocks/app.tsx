import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { PhoneShot } from "../werkstatt/PhoneShot";
import { wrap } from "../ui";

/**
 * The OpSo section of the Produkte page (prototype C `#opso`): copy on the left (solid Etikett, H2 with the live
 * chip, lede, "Kostenlos für iPhone und Android", the two store links with their visible addresses, the note and
 * the link to the OpSo page), three unedited app screens on the right (the middle one set lower) with their
 * captions and one Etikett for the row. Phones stay three across on phones.
 */
export function AppBlock({ block: b, locale }: BlockProps<"app">) {
  const ground = b.ground ?? "sheet";
  return (
    <section id={b.id} aria-labelledby={`${b.id}-h`} data-ground={ground} className={`wk-sec wk-on-${ground} wk-app`}>
      <div className={`${wrap} wk-app-grid`}>
        <div className="wk-app-copy">
          <Etikett solid>{b.etikett}</Etikett>
          <h2 id={`${b.id}-h`} className="wk-d2 wk-app-h">
            {soft(b.h)} <ChipTag chip={b.chip} />
          </h2>
          {b.lede && <p className="wk-lede wk-app-lede">{b.lede}</p>}
          <p className="wk-app-free">{b.free}</p>
          <ul className="wk-app-stores">
            {b.stores.map((s) => (
              <li key={s.shown}>
                <LinkTo link={s.link} locale={locale} className="wk-tlink" />
                <span className="wk-app-shown">{s.shown}</span>
              </li>
            ))}
          </ul>
          <p className="wk-app-note">{b.note}</p>
          <LinkTo link={b.more} locale={locale} className="wk-tlink wk-app-more">
            {b.more.label}
            <span aria-hidden="true"> →</span>
          </LinkTo>
        </div>
        <div className="wk-app-phones">
          {b.phones.map((p) => (
            <figure key={p.img.src}>
              <PhoneShot img={p.img} sizes="(max-width: 960px) 130px, 200px" />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
          <Etikett as="p" className="wk-app-etikett">
            {b.phonesEtikett}
          </Etikett>
        </div>
      </div>
    </section>
  );
}
