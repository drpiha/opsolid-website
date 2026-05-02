// =============================================================================
// WELCOME EMAIL TEMPLATE
//
// Sent after the first successful magic-link verification (account activation).
// Props: { name?, locale, dashboardUrl }
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

export interface WelcomeTemplateInput {
  name?: string;
  locale: string;
  dashboardUrl: string;
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

export function renderWelcomeHtml(input: WelcomeTemplateInput): string {
  const locale: Locale = pickLocale(input.locale);
  const copy = COPY[locale].welcome;
  const greeting = copy.greeting(input.name ?? "");

  const bodyInnerHtml = [
    paragraph(escapeHtml(greeting)),
    paragraph(escapeHtml(copy.lead)),
    ctaButton(input.dashboardUrl, copy.cta),
    paragraph(escapeHtml(copy.signoff)),
  ].join("\n");

  return renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml,
    locale,
  });
}

export function renderWelcomeText(input: WelcomeTemplateInput): string {
  const locale: Locale = pickLocale(input.locale);
  const copy = COPY[locale].welcome;
  const greeting = copy.greeting(input.name ?? "");

  const body = [
    greeting,
    "",
    copy.lead,
    "",
    `${copy.cta}: ${input.dashboardUrl}`,
    "",
    copy.signoff,
  ].join("\n");

  return renderShellText({ headline: copy.headline, body, locale });
}

export function welcomeSubject(locale: string): string {
  return COPY[pickLocale(locale)].welcome.subject;
}
