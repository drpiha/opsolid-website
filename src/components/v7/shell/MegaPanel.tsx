import Image from "next/image";
import type { CSSProperties } from "react";
import type { MenuGroup, MenuItem } from "@/content/v7/menu";
import { LinkTo } from "@/components/v7/LinkTo";
import { ChipTag } from "@/components/v7/werkstatt/Chip";
import type { L3 } from "@/lib/v7-routes";
import { MegaFeature } from "./MegaFeature";
import { MenuLink } from "./MenuLink";

function MegaItem({ item, locale }: { item: MenuItem; locale: L3 }) {
  const text = (
    <>
      <strong>{item.label}</strong>
      {item.desc && <span className="wk-mega-desc">{item.desc}</span>}
      {item.chip && <ChipTag chip={item.chip} />}
    </>
  );
  if (!item.thumb) {
    return (
      <MenuLink to={item.to} locale={locale} className="wk-mega-item">
        {text}
      </MenuLink>
    );
  }
  const { img, cap, kind } = item.thumb;
  return (
    <MenuLink to={item.to} locale={locale} className="wk-mega-item has-thumb">
      {/* The picture is decorative inside the link (the name says where it goes); its Etikett stays visible. */}
      <span className="wk-thumb-wrap" aria-hidden="true">
        <span className={`wk-thumb is-${kind}`}>
          <Image src={img.src} width={img.w} height={img.h} alt="" sizes="128px" decoding="async" />
        </span>
        <span className="wk-thumb-cap">{cap}</span>
      </span>
      <span className="wk-mega-text">{text}</span>
    </MenuLink>
  );
}

/** One desktop mega panel: the columns, the feature card and the foot row (price note where the group has prices). */
export function MegaPanel({ group, locale }: { group: MenuGroup; locale: L3 }) {
  const style = group.colTemplate ? ({ gridTemplateColumns: group.colTemplate } as CSSProperties) : undefined;
  return (
    <div className="wk-wrap wk-mega-inner">
      <div className="wk-mega-cols" style={style}>
        {group.cols.map((col, i) => {
          const hid = `mh-${group.key}-${i}`;
          return (
            <div key={hid} className={`wk-mega-col${col.style ? ` is-${col.style}` : ""}`}>
              <p className="wk-mega-h" id={hid}>
                {col.h}
              </p>
              <ul aria-labelledby={hid} className={col.style === "mini" ? "wk-mega-mini" : "wk-mega-list"}>
                {col.items.map((item) => (
                  <li key={item.label}>
                    {col.style === "mini" ? (
                      <MenuLink to={item.to} locale={locale}>
                        {item.label}
                      </MenuLink>
                    ) : (
                      <MegaItem item={item} locale={locale} />
                    )}
                  </li>
                ))}
              </ul>
              {col.after && (
                <MenuLink to={col.after.to} locale={locale} className="wk-mega-plan">
                  {col.after.chip && <ChipTag chip={col.after.chip} />}
                  <span>{col.after.label}</span>
                </MenuLink>
              )}
              {col.note && (
                <p className="wk-mega-colnote">
                  <ChipTag chip={col.note} />
                </p>
              )}
            </div>
          );
        })}
      </div>
      <MegaFeature feature={group.feature} locale={locale} />
      <div className="wk-mega-foot">
        <LinkTo link={group.foot.link} locale={locale} className="wk-tlink" />
        <span className="wk-mono wk-mega-note">{group.foot.note}</span>
      </div>
    </div>
  );
}
