// =============================================================================
// MAGIC LINK EMAIL TEMPLATE
//
// Sent when a user requests a passwordless sign-in link.
// Props: { link, appLink?, locale, brandName? }
//
// Two-CTA layout when `appLink` is present (Hat C task A):
//   Primary (filled copper): "Open in app"   → opsolid://magic-link/verify
//   Secondary (outlined):    "Open in browser" → https web link
//
// Single-CTA fallback when `appLink` is undefined: just the filled web button.
// The plain-text fallback URL block ALWAYS shows the https link, never the
// opsolid:// scheme — copy/paste of a custom-scheme URL into a desktop browser
// is useless and confusing.
//
// TODO: When @react-email/components + @react-email/render are installed,
//       convert this to a .tsx React Email template for richer previewing
//       (npx email preview). The shell.ts approach is identical in output
//       and keeps zero new dependencies until then.
// =============================================================================

import {
  escapeHtml,
  paragraph,
  renderShellHtml,
  renderShellText,
  escapeAttr,
} from "../shell";
import { pickLocale, COPY, type Locale } from "./copy";

// Brand color: copper #C27940 (mirrors tailwind.config.ts + CLAUDE.md)
const COPPER = "#C27940";
const INK = "#15120F";

export interface MagicLinkTemplateInput {
  link: string;
  /**
   * Optional deep-link for the mobile app
   * (`opsolid://magic-link/verify?token=…`). When provided, an "Open in
   * app" CTA is rendered as the PRIMARY filled button and the web link
   * drops to a SECONDARY outlined button labelled "Open in browser". Omit
   * for callers that predate the mobile app — backward-compat single-CTA
   * layout.
   */
  appLink?: string;
  locale: string;
  brandName?: string;
}

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
    <tr>
      <td style="background:${COPPER};border-radius:6px;">
        <a href="${escapeAttr(href)}" style="display:inline-block;padding:14px 24px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:bold;color:${INK};text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

/**
 * Secondary outline button for the alternate / "fallback" path.
 * Smaller font, white background with a copper border so it reads clearly
 * as "optional / alternative" versus the filled primary CTA.
 */
function secondaryButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0 0;">
    <tr>
      <td style="background:#FFFFFF;border:1.5px solid ${COPPER};border-radius:6px;">
        <a href="${escapeAttr(href)}" style="display:inline-block;padding:10px 20px;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${COPPER};text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

function fallbackLinkBlock(href: string): string {
  return `<p style="margin:12px 0 0 0;font-family:'Courier New',monospace;font-size:11px;color:#9CA3A0;word-break:break-all;">
    ${escapeHtml(href)}
  </p>`;
}

export function renderMagicLinkHtml(input: MagicLinkTemplateInput): string {
  const locale: Locale = pickLocale(input.locale);
  const copy = COPY[locale].magicLink;

  // CTA layout:
  //   With appLink:    [Primary "Open in app" → opsolid://] then
  //                    [Secondary "Open in browser" → https://] then
  //                    plain fallback URL (https only — opsolid:// is not
  //                    pasteable into a browser).
  //   Without appLink: single primary [Sign in → https].
  const ctaSection = input.appLink
    ? [
        ctaButton(input.appLink, copy.appCta),
        secondaryButton(input.link, copy.webCta),
        fallbackLinkBlock(input.link),
      ].join("\n")
    : [ctaButton(input.link, copy.cta), fallbackLinkBlock(input.link)].join(
        "\n",
      );

  const bodyInnerHtml = [
    paragraph(escapeHtml(copy.greeting)),
    paragraph(escapeHtml(copy.lead)),
    ctaSection,
    `<p style="margin:24px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#9CA3A0;">${escapeHtml(copy.expiry)}</p>`,
    `<p style="margin:8px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#9CA3A0;">${escapeHtml(copy.ignore)}</p>`,
    paragraph(escapeHtml(copy.signoff)),
  ].join("\n");

  return renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml,
    locale,
  });
}

export function renderMagicLinkText(input: MagicLinkTemplateInput): string {
  const locale: Locale = pickLocale(input.locale);
  const copy = COPY[locale].magicLink;

  // Mirror the HTML CTA order: app link first when present, then web.
  const ctaLines: string[] = [];
  if (input.appLink) {
    ctaLines.push(`${copy.appCta}: ${input.appLink}`);
    ctaLines.push("");
    ctaLines.push(`${copy.webCta}: ${input.link}`);
  } else {
    ctaLines.push(`${copy.cta}: ${input.link}`);
  }

  const body = [
    copy.greeting,
    "",
    copy.lead,
    "",
    ...ctaLines,
    "",
    copy.expiry,
    "",
    copy.ignore,
    "",
    copy.signoff,
  ].join("\n");

  return renderShellText({ headline: copy.headline, body, locale });
}

export function magicLinkSubject(locale: string): string {
  return COPY[pickLocale(locale)].magicLink.subject;
}
