import type { MenuGroup } from "@/content/v7/menu";
import { SITE_STR } from "@/content/v7/site";
import { href, type L3 } from "@/lib/v7-routes";
import { MegaPanel } from "./MegaPanel";

/**
 * One top item (disclosure navigation, not role="menu"): the label is a link to the hub (decision 71); the chevron
 * is a separate button that opens the panel (aria-expanded, aria-controls). Opening, pinning and closing live in
 * HeaderBehavior; without JavaScript the panel opens on :hover and :focus-within (shell.css).
 */
export function NavItem({ group, locale, active, current }: { group: MenuGroup; locale: L3; active: boolean; current: boolean }) {
  const id = `mega-${group.key}`;
  return (
    <li className="wk-nav-item" data-line={group.line}>
      <a
        className="wk-nav-link"
        href={href(group.hub, locale)}
        data-group={group.key}
        data-hub={group.hub}
        data-active={active ? "" : undefined}
        aria-current={current ? "page" : undefined}
      >
        {group.label}
      </a>
      <button type="button" className="wk-nav-chev" aria-expanded="false" aria-controls={id} aria-label={SITE_STR[locale].chev.replace("{label}", group.label)}>
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M1.5 3.5 5 7l3.5-3.5" />
        </svg>
      </button>
      <div className="wk-mega" id={id}>
        <MegaPanel group={group} locale={locale} />
      </div>
    </li>
  );
}
