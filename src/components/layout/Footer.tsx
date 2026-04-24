"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";

/**
 * Verbatim port of the Claude Design SiteFooter mock
 * (opsolid-design-system/project/ui_kits/website/components/Site.jsx).
 * Hrefs mapped to the real Next.js routes; copy and layout preserved.
 */
export function Footer() {
  return (
    <footer className="os-footer">
      <div className="wrap">
        <div className="os-footer-inner">
          <div className="os-footer-brand">
            <Link href="/" className="os-brand">
              <span className="os-brand-mark" aria-hidden="true" />
              OpSolid
            </Link>
            <p>
              Independent automation studio. Hamburg · Frankfurt. GDPR-native
              infrastructure, no vendor lock-in.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <span className="chip">
                <span className="chip-dot chip-dot-live" /> FRA · DE
              </span>
              <span className="chip">EN · DE · TR</span>
            </div>
          </div>
          <div className="os-footer-cols">
            <div className="os-footer-col">
              <div className="os-footer-col-h">Products</div>
              <ul>
                <li>
                  <Link href="/products/voice-agent">Voice Agent</Link>
                </li>
                <li>
                  <Link href="/products/digital-card">Digital Card</Link>
                </li>
                <li>
                  <Link href="/products/kutasia">Kutasia</Link>
                </li>
                <li>
                  <Link href="/products/booking-agent">Booking Agent</Link>
                </li>
                <li>
                  <Link href="/products/digital-reception">Reception</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">Services</div>
              <ul>
                <li>
                  <Link href="/solutions">Workflow automation</Link>
                </li>
                <li>
                  <Link href="/solutions">Systems integration</Link>
                </li>
                <li>
                  <Link href="/solutions">Internal tools</Link>
                </li>
                <li>
                  <Link href="/solutions">AI-assisted processes</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">Studio</div>
              <ul>
                <li>
                  <Link href="/about">Process</Link>
                </li>
                <li>
                  <Link href="/about">Principles</Link>
                </li>
                <li>
                  <Link href="/blog">Journal</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="os-footer-col">
              <div className="os-footer-col-h">Legal</div>
              <ul>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/impressum">Imprint</Link>
                </li>
                <li>
                  <Link href="/privacy">DPA</Link>
                </li>
                <li>
                  <Link href="/privacy">GDPR</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="os-footer-base">
          <div>© {new Date().getFullYear()} OpSolid UG · Hamburg, DE</div>
          <div>
            GDPR-native · Hosted in Frankfurt · No US subprocessors
          </div>
        </div>
      </div>
    </footer>
  );
}
