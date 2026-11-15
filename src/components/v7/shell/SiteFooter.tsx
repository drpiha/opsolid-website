import Link from "next/link";
import { Logo } from "@/components/v7/Logo";
import { LinkTo } from "@/components/v7/LinkTo";
import { Etikett } from "@/components/v7/werkstatt/Etikett";
import { FOOTER } from "@/content/v7/menu";
import { SITE_STR, standDate } from "@/content/v7/site";
import { SITE_CONFIG } from "@/lib/constants";
import { href, type L3 } from "@/lib/v7-routes";
import { Callbar } from "./Callbar";
import { LangLinks } from "./LangLinks";

/**
 * The Werkstatt footer (PLAN section 4): brand block with the contact address (the one place in the shell that
 * names the town, site rule 3), the four menu groups as columns (#footer-nav is also the no-JS menu target), and
 * the bottom row with the price note, Rechtliches, the language links and the "Stand" date. The call bar follows.
 */
export function SiteFooter({ locale, publicPath }: { locale: L3; publicPath: string }) {
  const t = SITE_STR[locale];
  const f = FOOTER[locale];
  return (
    <>
      <footer className="v7 wk-footer">
        <div className="wk-wrap">
          <div className="wk-foot-top">
            <div className="wk-foot-brand">
              <Link className="wk-logo" href={href("home", locale)} aria-label={t.homeAria} data-remember={locale === "de" ? "de" : undefined}>
                <Logo />
              </Link>
              <p>{t.tagline}</p>
              <address className="wk-foot-contact">
                <Etikett>{t.contactLabel}</Etikett>
                <span>{t.placeLine}</span>
                <a className="wk-tlink" href={`mailto:${SITE_CONFIG.email}`}>
                  {SITE_CONFIG.email}
                </a>
              </address>
            </div>
            <nav id="footer-nav" className="wk-foot-nav" aria-label={t.footerNav}>
              {f.cols.map((col) => (
                <div key={col.id} className="wk-foot-col">
                  <h2>{col.h}</h2>
                  <ul>
                    {col.links.map((l) => (
                      <li key={l.to.label}>
                        <LinkTo link={l.to} locale={locale}>
                          <span>{l.to.label}</span>
                          {l.small && <small>{l.small}</small>}
                        </LinkTo>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="wk-foot-bottom">
            <p className="wk-mono wk-foot-note">{t.priceNote}</p>
            <nav className="wk-foot-legal" aria-labelledby="foot-legal-h">
              <h2 id="foot-legal-h" className="wk-mono">
                {t.footer.legal}
              </h2>
              <ul>
                {f.legal.map((l) => (
                  <li key={l.to.label}>
                    <LinkTo link={l.to} locale={locale} />
                  </li>
                ))}
              </ul>
            </nav>
            <LangLinks locale={locale} publicPath={publicPath} className="wk-lang-l" />
            <p className="wk-mono wk-foot-note">
              {t.stand}: {standDate(locale)}
            </p>
          </div>
        </div>
      </footer>
      <Callbar locale={locale} />
    </>
  );
}
