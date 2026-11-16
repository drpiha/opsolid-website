import type { MenuCol, MenuGroup, MenuItem } from "@/content/v7/menu";
import { SITE_STR } from "@/content/v7/site";
import { LinkTo, resolveHref } from "@/components/v7/LinkTo";
import { ChipTag } from "@/components/v7/werkstatt/Chip";
import { SITE_CONFIG } from "@/lib/constants";
import type { L3 } from "@/lib/v7-routes";
import { LangLinks } from "./LangLinks";
import { MenuLink } from "./MenuLink";

const full = (item: MenuItem, locale: L3) => (
  <MenuLink key={item.label} to={item.to} locale={locale} className="wk-mnav-item">
    <strong>{item.label}</strong>
    {item.desc && <span className="wk-mega-desc">{item.desc}</span>}
    {item.chip && <ChipTag chip={item.chip} wrap />}
  </MenuLink>
);

/**
 * Phone column: lead columns (and every column of the Produkte group) keep name, line and chip; the others become a
 * one-line list. Mail links stay out (the menu foot carries the address). No pictures in the phone menu.
 */
function Col({ col, group, locale }: { col: MenuCol; group: MenuGroup; locale: L3 }) {
  const items = col.items.filter((i) => "to" in i.to);
  const rich = col.style === "lead" || group.key === "produkte";
  return (
    <>
      <p className="wk-mnav-h">
        <span>{col.h}</span>
        {col.note && <ChipTag chip={col.note} />}
      </p>
      {rich ? (
        items.map((i) => full(i, locale))
      ) : (
        <ul className="wk-mnav-mini">
          {items.map((i) => (
            <li key={i.label}>
              <MenuLink to={i.to} locale={locale}>
                {i.label}
              </MenuLink>
            </li>
          ))}
          {col.after && (
            <li>
              <MenuLink to={col.after.to} locale={locale} className="wk-mnav-plan">
                <span>{col.after.label}</span>
                {col.after.chip && <ChipTag chip={col.after.chip} />}
              </MenuLink>
            </li>
          )}
        </ul>
      )}
    </>
  );
}

/**
 * The phone menu (<= 960 px): four closed groups, one open at a time (<details name="mnav"> plus a toggle fallback in
 * HeaderBehavior). A group with prices shows the price note above its hub link. Fixed CTA at the bottom.
 */
export function MobileMenu({ groups, locale, publicPath, activeGroup }: { groups: MenuGroup[]; locale: L3; publicPath: string; activeGroup?: string }) {
  const t = SITE_STR[locale];
  return (
    <nav id="wk-mnav" className="v7 wk-mnav" aria-label={t.mnavAria}>
      {groups.map((g) => (
        <details key={g.key} name="mnav" data-line={g.line}>
          <summary data-group={g.key} data-active={activeGroup === g.key ? "" : undefined}>
            <span className="wk-mnav-l">
              <b>{g.label}</b>
              <small>{g.mobile.summary}</small>
            </span>
          </summary>
          <div className="wk-mnav-group">
            {g.mobile.flat ? (
              <ul className="wk-mnav-mini">
                {g.cols
                  .flatMap((c) => c.items)
                  .filter((i) => "to" in i.to)
                  .map((i) => (
                    <li key={i.label}>
                      <MenuLink to={i.to} locale={locale}>
                        {i.label}
                      </MenuLink>
                    </li>
                  ))}
              </ul>
            ) : (
              g.cols.map((col) => <Col key={col.h} col={col} group={g} locale={locale} />)
            )}
            {g.mobile.priceNote && <p className="wk-mnav-price wk-mono">{g.mobile.priceNote}</p>}
            <LinkTo link={g.mobile.all} locale={locale} className="wk-tlink wk-mnav-all" />
          </div>
        </details>
      ))}
      <div className="wk-mnav-foot">
        <LangLinks locale={locale} publicPath={publicPath} className="wk-lang-l" />
        <a className="wk-tlink" href={`mailto:${SITE_CONFIG.email}`}>
          {SITE_CONFIG.email}
        </a>
      </div>
      <div className="wk-mnav-cta">
        <a className="wk-btn wk-btn-ink" href={resolveHref({ label: t.cta, to: "kontakt", query: { anliegen: "schulung" } }, locale)}>
          {t.cta}
        </a>
      </div>
    </nav>
  );
}
