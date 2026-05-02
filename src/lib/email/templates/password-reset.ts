// =============================================================================
// PASSWORD RESET EMAIL TEMPLATE
//
// Sent when a user requests a password reset link.
// Props: { link, locale, expiresInMinutes }
//
// TODO: Convert to .tsx React Email template once
//       @react-email/components + @react-email/render are installed.
// =============================================================================

import {
  escapeHtml,
  paragraph,
  renderShellHtml,
  renderShellText,
  escapeAttr,
} from "../shell";
import { pickLocale, COPY, type Locale } from "./copy";

const COPPER = "#C27940";
const INK = "#15120F";

export interface PasswordResetTemplateInput {
  link: string;
  locale: string;
  expiresInMinutes: number;
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

function fallbackLinkBlock(href: string): string {
  return `<p style="margin:12px 0 0 0;font-family:'Courier New',monospace;font-size:11px;color:#9CA3A0;word-break:break-all;">
    ${escapeHtml(href)}
  </p>`;
}

export function renderPasswordResetHtml(
  input: PasswordResetTemplateInput
): string {
  const locale: Locale = pickLocale(input.locale);
  const copy = COPY[locale].passwordReset;

  const bodyInnerHtml = [
    paragraph(escapeHtml(copy.greeting)),
    paragraph(escapeHtml(copy.lead)),
    ctaButton(input.link, copy.cta),
    fallbackLinkBlock(input.link),
    `<p style="margin:24px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#9CA3A0;">${escapeHtml(copy.expiry(input.expiresInMinutes))}</p>`,
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

export function renderPasswordResetText(
  input: PasswordResetTemplateInput
): string {
  const locale: Locale = pickLocale(input.locale);
  const copy = COPY[locale].passwordReset;

  const body = [
    copy.greeting,
    "",
    copy.lead,
    "",
    `${copy.cta}: ${input.link}`,
    "",
    copy.expiry(input.expiresInMinutes),
    "",
    copy.ignore,
    "",
    copy.signoff,
  ].join("\n");

  return renderShellText({ headline: copy.headline, body, locale });
}

export function passwordResetSubject(locale: string): string {
  return COPY[pickLocale(locale)].passwordReset.subject;
}
