import { Logo } from "@/components/v7/Logo";
import { LangHint } from "@/components/v7/LangHint";
import { resolveHref } from "@/components/v7/LinkTo";
import { MENU, PILLAR } from "@/content/v7/menu";
import { SITE_STR } from "@/content/v7/site";
import { href, keyForPublicPath, type L3 } from "@/lib/v7-routes";
import { HeaderBehavior } from "./HeaderBehavior";
import { LangLinks } from "./LangLinks";
import { MobileMenu } from "./MobileMenu";
import { NavItem } from "./NavItem";

/**
 * The Werkstatt header (server markup; PLAN section 3): ink bar with the logo, four top items with mega menus,
 * language links, the CTA and the phone menu button; then the backdrop, the phone menu, the language hint on the
 * German home and the behaviour island. The menu data never ships as JS props: HeaderBehavior only reads the DOM
 * (the page-to-group map sits in data-pillar). Active state is rendered here for the first request and kept up to
 * date by HeaderBehavior on client navigation.
 */
export function SiteHeader({ locale, publicPath, suggest }: { locale: L3; publicPath: string; suggest: "" | "en" | "tr" }) {
  const t = SITE_STR[locale];
  const groups = MENU[locale];
  const here = keyForPublicPath(publicPath);
  const active = here ? PILLAR[here.key] : undefined;
  const cta = resolveHref({ label: t.cta, to: "kontakt", query: { anliegen: "schulung" } }, locale);
  const showHint = !!suggest && here?.key === "home" && here.locale === "de" && locale === "de" && !here.sub;

  return (
    <>
      <header className="v7 wk-header" data-header data-pillar={JSON.stringify(PILLAR)}>
        <div className="wk-wrap wk-header-row">
          {/* A click on the German logo stores "de", so an earlier en/tr choice does not send "/" elsewhere. */}
          <a className="wk-logo" href={href("home", locale)} aria-label={t.homeAria} data-remember={locale === "de" ? "de" : undefined}>
            <Logo />
          </a>
          <nav className="wk-nav" aria-label={t.mainNav}>
            <ul className="wk-nav-list">
              {groups.map((g) => (
                <NavItem key={g.key} group={g} locale={locale} active={active === g.key} current={!!here && here.key === g.hub && !here.sub} />
              ))}
            </ul>
          </nav>
          <div className="wk-header-side">
            <LangLinks locale={locale} publicPath={publicPath} className="wk-lang" />
            <a className="wk-btn wk-btn-light wk-btn-sm wk-header-cta" href={cta}>
              {t.cta}
            </a>
            <button type="button" className="wk-menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="wk-mnav">
              <span className="t-open">{t.menuOpen}</span>
              <span className="t-close">{t.menuClose}</span>
              <i aria-hidden="true" />
            </button>
            <a className="wk-nojs-menu" href="#footer-nav">
              {t.noJsMenu}
            </a>
          </div>
        </div>
      </header>
      <div className="wk-backdrop" aria-hidden="true" />
      <MobileMenu groups={groups} locale={locale} publicPath={publicPath} activeGroup={active} />
      {showHint && suggest ? <LangHint suggest={suggest} /> : null}
      <HeaderBehavior />
    </>
  );
}
