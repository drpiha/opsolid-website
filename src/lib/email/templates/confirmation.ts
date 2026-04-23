// =============================================================================
// CONFIRMATION — sent after payment hits AWAITING_DESIGN.
// Tone: calm. Subject can carry a single exclamation (brand rule: only subjects).
// =============================================================================

import {
  type Locale,
  button,
  detailsTable,
  escapeHtml,
  inlineLink,
  paragraph,
  renderShellHtml,
  renderShellText,
  siteBase,
} from "../shell";

export interface ConfirmationInput {
  orderId: string;
  orderNumber: number;
  contactName: string;
  templateName: string;
  billingMode: "ONE_TIME" | "MONTHLY" | "YEARLY" | string;
  amountCents: number;
  currency: string;
  editToken: string;
}

interface Copy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  slaHeading: string;
  slaBody: string;
  tableLabels: { order: string; product: string; billing: string; amount: string };
  billingModes: Record<string, string>;
  editHeading: string;
  editBody: string;
  editCta: string;
  replyLine: string;
  signoff: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: "Payment received — your OpSolid card is in design",
    preheader: "Our designer is drafting your card. You can edit your details any time.",
    headline: "Payment received",
    greeting: (n) => `Hello ${n},`,
    lead:
      "Thank you for your order. Our in-house designer is now drafting your digital business card.",
    slaHeading: "What happens next",
    slaBody:
      "You will receive the live URL, download link and QR code within 48 hours. Every card is reviewed by hand before it goes public.",
    tableLabels: {
      order: "Order",
      product: "Template",
      billing: "Billing",
      amount: "Amount",
    },
    billingModes: {
      ONE_TIME: "One-time",
      MONTHLY: "Monthly subscription",
      YEARLY: "Yearly subscription",
    },
    editHeading: "Need to change something?",
    editBody:
      "You can update your details any time from your personal edit link. Changes made before publication reach the designer directly.",
    editCta: "Edit my details",
    replyLine:
      "You can also simply reply to this email and we will take care of it.",
    signoff: "— The OpSolid team",
  },
  de: {
    subject: "Zahlung erhalten — Ihre OpSolid Karte ist in Gestaltung",
    preheader: "Unser Designer entwirft Ihre Karte. Sie können Ihre Daten jederzeit anpassen.",
    headline: "Zahlung erhalten",
    greeting: (n) => `Guten Tag ${n},`,
    lead:
      "Vielen Dank für Ihre Bestellung. Unser hauseigener Designer entwirft jetzt Ihre digitale Visitenkarte.",
    slaHeading: "Wie es weitergeht",
    slaBody:
      "Innerhalb von 48 Stunden erhalten Sie die Live-URL, den Download-Link und den QR-Code. Jede Karte wird vor der Veröffentlichung von Hand geprüft.",
    tableLabels: {
      order: "Bestellung",
      product: "Vorlage",
      billing: "Abrechnung",
      amount: "Betrag",
    },
    billingModes: {
      ONE_TIME: "Einmalzahlung",
      MONTHLY: "Monatliches Abo",
      YEARLY: "Jahresabo",
    },
    editHeading: "Etwas anpassen?",
    editBody:
      "Sie können Ihre Angaben jederzeit über Ihren persönlichen Bearbeitungslink anpassen. Änderungen vor der Veröffentlichung gehen direkt an den Designer.",
    editCta: "Daten bearbeiten",
    replyLine:
      "Sie können alternativ einfach auf diese E-Mail antworten, wir kümmern uns darum.",
    signoff: "— Ihr OpSolid Team",
  },
  tr: {
    subject: "Ödeme alındı — OpSolid kartınız tasarım aşamasında",
    preheader: "Tasarımcımız kartınızı hazırlıyor. Bilgilerinizi dilediğiniz zaman düzenleyebilirsiniz.",
    headline: "Ödeme alındı",
    greeting: (n) => `Merhaba ${n},`,
    lead:
      "Siparişiniz için teşekkür ederiz. Tasarımcımız şimdi dijital kartvizitinizi hazırlıyor.",
    slaHeading: "Sırada ne var",
    slaBody:
      "48 saat içinde canlı URL'yi, indirme bağlantısını ve QR kodunu e-posta ile alacaksınız. Her kart yayına girmeden önce elle kontrol edilir.",
    tableLabels: {
      order: "Sipariş",
      product: "Şablon",
      billing: "Ödeme",
      amount: "Tutar",
    },
    billingModes: {
      ONE_TIME: "Tek seferlik",
      MONTHLY: "Aylık abonelik",
      YEARLY: "Yıllık abonelik",
    },
    editHeading: "Bir şey değiştirmek mi istiyorsunuz?",
    editBody:
      "Kişisel düzenleme bağlantınızdan bilgilerinizi istediğiniz zaman güncelleyebilirsiniz. Yayın öncesi yapılan değişiklikler doğrudan tasarımcımıza ulaşır.",
    editCta: "Bilgilerimi düzenle",
    replyLine:
      "Dilerseniz bu e-postayı yanıtlayabilirsiniz — gerisi bizde.",
    signoff: "— OpSolid ekibi",
  },
};

function pick(locale: Locale): Copy {
  return COPY[locale] ?? COPY.en;
}

export function confirmationSubject(
  input: ConfirmationInput,
  locale: Locale
): string {
  const copy = pick(locale);
  return `${copy.subject} · #${input.orderNumber}`;
}

function editLink(input: ConfirmationInput): string {
  return `${siteBase()}/card/edit/${input.orderId}?t=${encodeURIComponent(input.editToken)}`;
}

function formatAmount(cents: number, currency: string): string {
  const amount = (cents / 100).toFixed(2);
  if (currency === "EUR") return `€${amount}`;
  if (currency === "USD") return `$${amount}`;
  return `${amount} ${currency}`;
}

export function renderConfirmationHtml(
  input: ConfirmationInput,
  locale: Locale
): string {
  const copy = pick(locale);
  const link = editLink(input);
  const billingLabel = copy.billingModes[input.billingMode] ?? input.billingMode;

  const body =
    paragraph(escapeHtml(copy.greeting(input.contactName))) +
    paragraph(escapeHtml(copy.lead)) +
    detailsTable([
      { label: copy.tableLabels.order, value: `#${input.orderNumber}` },
      { label: copy.tableLabels.product, value: input.templateName },
      { label: copy.tableLabels.billing, value: billingLabel },
      {
        label: copy.tableLabels.amount,
        value: formatAmount(input.amountCents, input.currency),
      },
    ]) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.slaHeading)}</h2>` +
    paragraph(escapeHtml(copy.slaBody)) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.editHeading)}</h2>` +
    paragraph(escapeHtml(copy.editBody)) +
    button(link, copy.editCta) +
    paragraph(
      `<span style="color:#9CA3A0;">${inlineLink(link, link)}</span>`
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

export function renderConfirmationText(
  input: ConfirmationInput,
  locale: Locale
): string {
  const copy = pick(locale);
  const link = editLink(input);
  const billingLabel = copy.billingModes[input.billingMode] ?? input.billingMode;

  const lines = [
    copy.greeting(input.contactName),
    "",
    copy.lead,
    "",
    `${copy.tableLabels.order}: #${input.orderNumber}`,
    `${copy.tableLabels.product}: ${input.templateName}`,
    `${copy.tableLabels.billing}: ${billingLabel}`,
    `${copy.tableLabels.amount}: ${formatAmount(input.amountCents, input.currency)}`,
    "",
    copy.slaHeading.toUpperCase(),
    copy.slaBody,
    "",
    copy.editHeading.toUpperCase(),
    copy.editBody,
    link,
    "",
    copy.replyLine,
    "",
    copy.signoff,
  ];

  return renderShellText({
    headline: copy.headline,
    body: lines.join("\n"),
    locale,
  });
}
