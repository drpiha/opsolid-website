// =============================================================================
// CANCELLATION — sent when customer.subscription.deleted fires and we flip
// the order to CANCELLED. Includes optional access-through date + re-activate
// link back to the self-service page.
// =============================================================================

import {
  type TransactionalLocale as Locale,
  button,
  escapeHtml,
  inlineLink,
  paragraph,
  renderShellHtml,
  renderShellText,
  siteBase,
} from "../shell";

export interface CancellationInput {
  orderId: string;
  orderNumber: number;
  contactName: string;
  editToken: string;
  /** ISO string or null — when the paid period ends (card stays live until then). */
  accessThrough: string | null;
}

interface Copy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  accessThroughLine: (date: string) => string;
  reactivateHeading: string;
  reactivateBody: string;
  reactivateCta: string;
  replyLine: string;
  signoff: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: "Your OpSolid subscription is canceled",
    preheader: "Your card will stay online until the end of the current period.",
    headline: "Subscription canceled",
    greeting: (n) => `Hello ${n},`,
    lead:
      "We have canceled your OpSolid card subscription. No further charges will be made.",
    accessThroughLine: (d) =>
      `Your card remains online until ${d}. After that the public URL will no longer resolve.`,
    reactivateHeading: "Changed your mind?",
    reactivateBody:
      "You can re-activate any time from your personal edit link — the card and all the content you entered are kept on file.",
    reactivateCta: "Re-activate my card",
    replyLine: "If this was a mistake, reply to this email and we will restore it.",
    signoff: "— The OpSolid team",
  },
  de: {
    subject: "Ihr OpSolid Abo wurde gekündigt",
    preheader: "Ihre Karte bleibt bis zum Ende der laufenden Periode online.",
    headline: "Abo gekündigt",
    greeting: (n) => `Guten Tag ${n},`,
    lead:
      "Wir haben Ihr OpSolid-Abonnement gekündigt. Es werden keine weiteren Beträge eingezogen.",
    accessThroughLine: (d) =>
      `Ihre Karte bleibt bis zum ${d} online. Danach ist die öffentliche URL nicht mehr erreichbar.`,
    reactivateHeading: "Umentschieden?",
    reactivateBody:
      "Sie können jederzeit über Ihren persönlichen Bearbeitungslink reaktivieren — die Karte und alle Inhalte bleiben gespeichert.",
    reactivateCta: "Karte reaktivieren",
    replyLine:
      "Falls das ein Versehen war, antworten Sie einfach auf diese E-Mail, wir stellen sie wieder her.",
    signoff: "— Ihr OpSolid Team",
  },
  tr: {
    subject: "OpSolid aboneliğiniz iptal edildi",
    preheader: "Kartınız mevcut dönemin sonuna kadar çevrimiçi kalacak.",
    headline: "Abonelik iptal edildi",
    greeting: (n) => `Merhaba ${n},`,
    lead:
      "OpSolid kartvizit aboneliğinizi iptal ettik. Sizden başka bir ödeme alınmayacaktır.",
    accessThroughLine: (d) =>
      `Kartınız ${d} tarihine kadar çevrimiçi kalır. Sonrasında herkese açık URL çalışmayacaktır.`,
    reactivateHeading: "Fikrinizi mi değiştirdiniz?",
    reactivateBody:
      "Kişisel düzenleme bağlantınızdan dilediğiniz zaman yeniden etkinleştirebilirsiniz — kartınız ve tüm içerikler dosyamızda saklıdır.",
    reactivateCta: "Kartımı yeniden etkinleştir",
    replyLine:
      "Yanlışlıkla olduysa bu e-postayı yanıtlamanız yeterli, geri yükleriz.",
    signoff: "— OpSolid ekibi",
  },
};

function pick(locale: Locale): Copy {
  return COPY[locale] ?? COPY.en;
}

function reactivateUrl(input: CancellationInput): string {
  return `${siteBase()}/card/edit/${input.orderId}?t=${encodeURIComponent(input.editToken)}`;
}

function formatDate(iso: string, locale: Locale): string {
  try {
    const d = new Date(iso);
    const lang =
      locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB";
    return d.toLocaleDateString(lang, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function cancellationSubject(
  input: CancellationInput,
  locale: Locale
): string {
  const copy = pick(locale);
  return `${copy.subject} · #${input.orderNumber}`;
}

export function renderCancellationHtml(
  input: CancellationInput,
  locale: Locale
): string {
  const copy = pick(locale);
  const url = reactivateUrl(input);

  let body =
    paragraph(escapeHtml(copy.greeting(input.contactName))) +
    paragraph(escapeHtml(copy.lead));

  if (input.accessThrough) {
    body += paragraph(
      escapeHtml(copy.accessThroughLine(formatDate(input.accessThrough, locale)))
    );
  }

  body +=
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.reactivateHeading)}</h2>` +
    paragraph(escapeHtml(copy.reactivateBody)) +
    button(url, copy.reactivateCta) +
    paragraph(
      `<span style="color:#9CA3A0;">${inlineLink(url, url)}</span>`
    ) +
    paragraph(`<em>${escapeHtml(copy.replyLine)}</em>`) +
    paragraph(escapeHtml(copy.signoff));

  return renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml: body,
    locale,
  });
}

export function renderCancellationText(
  input: CancellationInput,
  locale: Locale
): string {
  const copy = pick(locale);
  const url = reactivateUrl(input);

  const lines = [copy.greeting(input.contactName), "", copy.lead];

  if (input.accessThrough) {
    lines.push("", copy.accessThroughLine(formatDate(input.accessThrough, locale)));
  }

  lines.push(
    "",
    copy.reactivateHeading.toUpperCase(),
    copy.reactivateBody,
    url,
    "",
    copy.replyLine,
    "",
    copy.signoff
  );

  return renderShellText({
    headline: copy.headline,
    body: lines.join("\n"),
    locale,
  });
}
