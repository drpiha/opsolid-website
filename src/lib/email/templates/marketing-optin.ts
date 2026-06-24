// =============================================================================
// MARKETING OPT-IN (DOI) EMAIL TEMPLATE — GDPR / §7 UWG double-opt-in.
//
// Sent after a user ticks the (unticked-by-default) marketing checkbox at
// signup. It asks them to CONFIRM the subscription by clicking the button /
// link. Until that click, no marketing email is sent (status stays "pending").
//
// Self-contained DE/EN/TR copy (TransactionalLocale set) — this template is
// not in the shared auth copy registry because its wording is consent-specific
// and reviewed by the legal agent. Uses the same shell/escape style as the
// other templates (subject(locale), renderHtml(...), renderText(...)).
// =============================================================================

import {
  escapeHtml,
  paragraph,
  button,
  renderShellHtml,
  renderShellText,
  normalizeLocale,
  type TransactionalLocale,
} from "../shell";

export interface MarketingOptInTemplateInput {
  confirmUrl: string;
  locale: string;
}

interface OptInCopy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: string;
  /** What we want to send + the request to confirm. */
  lead: string;
  cta: string;
  /** "If this wasn't you, ignore this email." */
  ignore: string;
  /** Note that they can unsubscribe from every email at any time. */
  unsubscribeNote: string;
  /** Label shown before the raw fallback URL. */
  fallbackLabel: string;
  signoff: string;
}

const COPY: Record<TransactionalLocale, OptInCopy> = {
  de: {
    subject: "Bitte bestätigen Sie Ihre Anmeldung",
    preheader:
      "Bestätigen Sie Ihre Einwilligung, um Produktneuigkeiten zu OpSo Smart zu erhalten.",
    headline: "Bitte bestätigen Sie Ihre Anmeldung",
    greeting: "Guten Tag,",
    lead: "Sie haben sich entschieden, gelegentlich Produktneuigkeiten und Angebote zu OpSo Smart von OpSolid per E-Mail zu erhalten. Bitte bestätigen Sie diese Einwilligung mit einem Klick auf den folgenden Button.",
    cta: "Anmeldung bestätigen",
    ignore:
      "Wenn Sie das nicht waren, ignorieren Sie diese E-Mail. Ohne Ihre Bestätigung senden wir Ihnen keine Marketing-E-Mails.",
    unsubscribeNote:
      "Sie können diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen — über den Abmeldelink in jeder E-Mail.",
    fallbackLabel:
      "Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:",
    signoff: "OpSolid",
  },
  en: {
    subject: "Please confirm your subscription",
    preheader:
      "Confirm your consent to receive OpSo Smart product news from OpSolid.",
    headline: "Please confirm your subscription",
    greeting: "Hello,",
    lead: "You chose to occasionally receive product news and offers about OpSo Smart from OpSolid by email. Please confirm this consent by clicking the button below.",
    cta: "Confirm subscription",
    ignore:
      "If this wasn't you, ignore this email. Without your confirmation we will not send you any marketing email.",
    unsubscribeNote:
      "You can withdraw this consent at any time with effect for the future — via the unsubscribe link in every email.",
    fallbackLabel:
      "If the button doesn't work, copy this link into your browser:",
    signoff: "OpSolid",
  },
  tr: {
    subject: "Lütfen aboneliğinizi onaylayın",
    preheader:
      "OpSolid'den OpSo Smart ürün haberleri almak için onayınızı doğrulayın.",
    headline: "Lütfen aboneliğinizi onaylayın",
    greeting: "Merhaba,",
    lead: "OpSolid'den OpSo Smart hakkında ara sıra ürün haberleri ve teklifler e-posta ile almayı tercih ettiniz. Lütfen aşağıdaki butona tıklayarak bu izni onaylayın.",
    cta: "Aboneliği onayla",
    ignore:
      "Bu siz değilseniz bu e-postayı yok sayın. Onayınız olmadan size hiçbir pazarlama e-postası göndermeyiz.",
    unsubscribeNote:
      "Bu izni istediğiniz zaman ileriye dönük olarak geri çekebilirsiniz — her e-postadaki abonelikten çıkma bağlantısı ile.",
    fallbackLabel:
      "Buton çalışmazsa bu bağlantıyı tarayıcınıza kopyalayın:",
    signoff: "OpSolid",
  },
};

function fallbackLinkBlock(label: string, href: string): string {
  return `<p style="margin:20px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;color:#9CA3A0;">${escapeHtml(label)}</p>
    <p style="margin:6px 0 0 0;font-family:'Courier New',monospace;font-size:11px;color:#9CA3A0;word-break:break-all;">${escapeHtml(href)}</p>`;
}

export function subject(locale: string): string {
  return COPY[normalizeLocale(locale)].subject;
}

export function renderHtml(input: MarketingOptInTemplateInput): string {
  const locale = normalizeLocale(input.locale);
  const copy = COPY[locale];

  const bodyInnerHtml = [
    paragraph(escapeHtml(copy.greeting)),
    paragraph(escapeHtml(copy.lead)),
    button(input.confirmUrl, copy.cta),
    fallbackLinkBlock(copy.fallbackLabel, input.confirmUrl),
    `<p style="margin:24px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#9CA3A0;">${escapeHtml(copy.ignore)}</p>`,
    `<p style="margin:8px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#9CA3A0;">${escapeHtml(copy.unsubscribeNote)}</p>`,
    paragraph(escapeHtml(copy.signoff)),
  ].join("\n");

  return renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml,
    locale,
  });
}

export function renderText(input: MarketingOptInTemplateInput): string {
  const locale = normalizeLocale(input.locale);
  const copy = COPY[locale];

  const body = [
    copy.greeting,
    "",
    copy.lead,
    "",
    `${copy.cta}: ${input.confirmUrl}`,
    "",
    copy.ignore,
    "",
    copy.unsubscribeNote,
    "",
    copy.signoff,
  ].join("\n");

  return renderShellText({ headline: copy.headline, body, locale });
}
