"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

/**
 * Footer — industrial-luxury v2 port of SiteFooter mock, content driven
 * by `t.v2.footer.*`. Four columns (Products / Services / Studio / Legal)
 * + brand block with live FRA · DE chip, base line with copyright +
 * trust signals.
 */
export function Footer() {
  const pathname = usePathname();
  const { t } = useLocale();
  const f = t.v2.footer;
  const year = new Date().getFullYear();

  // Mirror Header — hide on customer self-service surfaces.
  if (pathname && /\/card\/edit\//.test(pathname)) return null;

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
            {(f.chipLive || f.chipLanguages) && (
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {f.chipLive && (
                  <span className="chip">
                    <span className="chip-dot chip-dot-live" /> {f.chipLive}
                  </span>
                )}
                {f.chipLanguages && <span className="chip">{f.chipLanguages}</span>}
              </div>
            )}
          </div>

          <div className="os-footer-cols">
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.productsHeading}</div>
              <ul>
                <li>
                  <Link href="/products/voice-agent">{f.cols.productsList.voiceAgent}</Link>
                </li>
                <li>
                  <Link href="/products/digital-card">{f.cols.productsList.verso}</Link>
                </li>
                <li>
                  <Link href="/products/chatbot-agent">{f.cols.productsList.chatbot}</Link>
                </li>
                <li>
                  <Link href="/products/whatsapp-agent">{f.cols.productsList.whatsapp}</Link>
                </li>
                <li>
                  <Link href="/products/booking-agent">{f.cols.productsList.booking}</Link>
                </li>
                <li>
                  <Link href="/products/email-agent">{f.cols.productsList.email}</Link>
                </li>
                <li>
                  <Link href="/products/lead-qualifier-agent">{f.cols.productsList.leadQualifier}</Link>
                </li>
                <li>
                  <Link href="/products/custom-automation">{f.cols.productsList.customAutomation}</Link>
                </li>
                <li>
                  <Link href="/products/kutasia">{f.cols.productsList.kutasia}</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.studioHeading}</div>
              <ul>
                <li>
                  <Link href="/pricing">{f.cols.studio.pricing}</Link>
                </li>
                <li>
                  <Link href="/about">{f.cols.studio.about}</Link>
                </li>
                <li>
                  <Link href="/blog">{f.cols.studio.journal}</Link>
                </li>
                <li>
                  <Link href="/contact">{f.cols.studio.contact}</Link>
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
                <li>
                  <a href={f.cols.reach.githubHref} target="_blank" rel="noopener noreferrer">
                    {f.cols.reach.githubLabel}
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
