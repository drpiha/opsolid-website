"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";

/**
 * Footer — industrial-luxury v2 port of SiteFooter mock, content driven
 * by `t.v2.footer.*`. Four columns (Products / Services / Studio / Legal)
 * + brand block with live FRA · DE chip, base line with copyright +
 * trust signals.
 */
export function Footer() {
  const { t } = useLocale();
  const f = t.v2.footer;
  const n = t.v2.nav;
  const year = new Date().getFullYear();

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
                  <Link href="/products/voice-agent">{n.voiceAgent}</Link>
                </li>
                <li>
                  <Link href="/products/digital-card">{n.digitalCard}</Link>
                </li>
                <li>
                  <Link href="/products/kutasia">{n.kutasia}</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.servicesHeading}</div>
              <ul>
                <li>
                  <Link href="/#capabilities">{f.cols.services.workflow}</Link>
                </li>
                <li>
                  <Link href="/#capabilities">{f.cols.services.integration}</Link>
                </li>
                <li>
                  <Link href="/#capabilities">{f.cols.services.internal}</Link>
                </li>
                <li>
                  <Link href="/#capabilities">{f.cols.services.ai}</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">{f.cols.studioHeading}</div>
              <ul>
                <li>
                  <Link href="/blog">{f.cols.studio.journal}</Link>
                </li>
                <li>
                  <Link href="/contact">{f.cols.studio.contact}</Link>
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
