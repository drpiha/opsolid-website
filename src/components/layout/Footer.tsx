"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";

/**
 * Footer — consulting-positioning rewrite (2026-05). Old product columns
 * (Voice Agent / Verso / Chatbot / WhatsApp / …) retired in favor of the
 * four-column consulting shape: Services · Studio · Reach · Legal.
 * Localized copy lives at `t.v2.footer.*`.
 */
export function Footer() {
  const pathname = usePathname();
  const { t } = useLocale();
  const auth = useAuth();
  const f = t.v2.footer;
  const account = t.v2.nav.account;
  const year = new Date().getFullYear();

  // Mirror Header — hide on customer self-service surfaces (card editor +
  // the OpSo Smart dashboard, which has its own chrome).
  if (pathname && /\/(card\/edit|dashboard)(\/|$)/.test(pathname)) return null;

  return (
    <footer className="os-footer">
      <div className="wrap">
        <div className="os-footer-inner">
          <div className="os-footer-brand">
            <Link href="/" className="os-brand">
              <span className="os-brand-mark" aria-hidden="true" />
              OpSolid
            </Link>
            <p>{f.tagline}</p>
            {f.chipLanguages && (
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <span className="chip">{f.chipLanguages}</span>
              </div>
            )}
          </div>

          <div className="os-footer-cols">
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.servicesHeading}</div>
              <ul>
                <li>
                  <Link href="/ai-automation-check">{f.cols.services.automationCheck}</Link>
                </li>
                <li>
                  <Link href="/ki-beratung">{f.cols.services.consulting}</Link>
                </li>
                <li>
                  <Link href="/prozessautomatisierung">{f.cols.services.automation}</Link>
                </li>
                <li>
                  <Link href="/interne-tools">{f.cols.services.internalTools}</Link>
                </li>
                <li>
                  <Link href="/ki-schulungen">{f.cols.services.training}</Link>
                </li>
                <li>
                  <Link href="/products/digital-card">OpSo Smart</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.studioHeading}</div>
              <ul>
                <li>
                  <Link href="/ueber-mich">{f.cols.studio.about}</Link>
                </li>
                <li>
                  <Link href="/blog">{f.cols.studio.journal}</Link>
                </li>
                <li>
                  <Link href="/contact">{f.cols.studio.contact}</Link>
                </li>
                <li>
                  {auth.status === "authed" ? (
                    <Link href="/dashboard/cards">{account.myCards}</Link>
                  ) : (
                    <Link href="/login">{account.login}</Link>
                  )}
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.reachHeading}</div>
              <ul>
                <li>
                  <a href={`mailto:${f.cols.reach.email}`}>{f.cols.reach.email}</a>
                </li>
                <li>
                  <a href={f.cols.reach.linkedinHref} target="_blank" rel="noopener noreferrer">
                    {f.cols.reach.linkedinLabel}
                  </a>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.legalHeading}</div>
              <ul>
                <li>
                  <Link href="/privacy">{f.cols.legal.privacy}</Link>
                </li>
                <li>
                  <Link href="/impressum">{f.cols.legal.imprint}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="os-footer-base">
          <div>© {year} {f.base.copyrightSuffix}</div>
          {f.base.trustLine && <div>{f.base.trustLine}</div>}
        </div>
      </div>
    </footer>
  );
}
