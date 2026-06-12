// =============================================================================
// CARD LIVE — sent immediately after a FREE-tier card is published.
//
// Differs from confirmation.ts: no payment, no designer SLA. The card is
// already at its public URL; this email just hands the customer their public
// link, edit link, and a one-tap edit button so they can come back later.
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

export interface CardLiveInput {
  orderId: string;
  contactName: string;
  cardUrl: string;
  editToken: string;
  locale: Locale;
  /** Fair flow — public participant-directory URL when the card joined an
   *  event at creation time. Omitted/null → section not rendered. */
  eventUrl?: string | null;
}

interface Copy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  cardUrlHeading: string;
  cardUrlBody: string;
  editHeading: string;
  editBody: string;
  editCta: string;
  manageHeading: string;
  manageBody: string;
  eventHeading: string;
  eventBody: string;
  replyLine: string;
  signoff: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: "Your card is live",
    preheader: "Your public link is ready. Edit anytime.",
    headline: "Your card is live",
    greeting: (n) => `Hello ${n},`,
    lead:
      "Your digital business card is published and ready to share. Here is everything you need.",
    cardUrlHeading: "Your public link",
    cardUrlBody: "Share this URL anywhere — chat, email signature, NFC, QR.",
    editHeading: "Edit anytime",
    editBody:
      "Save the link below — it gives you full control over your card, contacts you receive and analytics. Bookmark it, no password needed.",
    editCta: "Edit my card",
    manageHeading: "Stats, share links & leads",
    manageBody:
      "See who viewed your card, create a tracked short link per channel (QR, signature, social bio), and manage the contacts you receive:",
    eventHeading: "Participant directory",
    eventBody:
      "Your card is listed in the event's participant directory — see who else is attending:",
    replyLine:
      "Reply to this email if you need any help — a real person will read it.",
    signoff: "— The OpSolid team",
  },
  de: {
    subject: "Ihre Karte ist online",
    preheader: "Ihre öffentliche Adresse ist bereit. Jederzeit editierbar.",
    headline: "Ihre Karte ist online",
    greeting: (n) => `Guten Tag ${n},`,
    lead:
      "Ihre digitale Visitenkarte ist veröffentlicht und einsatzbereit. Hier ist alles, was Sie brauchen.",
    cardUrlHeading: "Ihre öffentliche Adresse",
    cardUrlBody:
      "Diese URL können Sie überall teilen — Chat, E-Mail-Signatur, NFC, QR.",
    editHeading: "Jederzeit anpassen",
    editBody:
      "Speichern Sie den unten stehenden Link — er gibt Ihnen volle Kontrolle über Ihre Karte, Ihre Kontakte und Statistiken. Lesezeichen genügt, kein Passwort.",
    editCta: "Karte bearbeiten",
    manageHeading: "Statistiken, Teilen-Links & Leads",
    manageBody:
      "Sehen Sie, wer Ihre Karte angesehen hat, erstellen Sie pro Kanal einen messbaren Kurzlink (QR, Signatur, Social-Bio) und verwalten Sie Ihre eingegangenen Kontakte:",
    eventHeading: "Teilnehmerverzeichnis",
    eventBody:
      "Ihre Karte ist im Teilnehmerverzeichnis der Veranstaltung gelistet — sehen Sie, wer noch dabei ist:",
    replyLine:
      "Antworten Sie einfach auf diese E-Mail, falls Sie Hilfe brauchen — ein echter Mensch liest mit.",
    signoff: "— Ihr OpSolid Team",
  },
  tr: {
    subject: "Kartınız yayında",
    preheader: "Halka açık linkiniz hazır. İstediğiniz zaman düzenleyin.",
    headline: "Kartınız yayında",
    greeting: (n) => `Merhaba ${n},`,
    lead:
      "Dijital kartvizitiniz yayında ve paylaşıma hazır. İhtiyacınız olan her şey aşağıda.",
    cardUrlHeading: "Halka açık adresiniz",
    cardUrlBody:
      "Bu adresi her yerde paylaşabilirsiniz — sohbet, e-posta imzası, NFC, QR.",
    editHeading: "Dilediğiniz zaman düzenleyin",
    editBody:
      "Aşağıdaki linki kaydedin — kartınız, gelen bağlantılarınız ve istatistikleriniz üzerinde tam kontrol verir. Yer imine eklemeniz yeterli, şifre yok.",
    editCta: "Kartımı düzenle",
    manageHeading: "İstatistikler, paylaşım linkleri ve lead'ler",
    manageBody:
      "Kartınıza kimlerin baktığını görün, her kanal için ölçülebilir bir kısa link (QR, imza, sosyal medya bio) oluşturun ve gelen kişileri yönetin:",
    eventHeading: "Katılımcı rehberi",
    eventBody:
      "Kartınız etkinliğin katılımcı rehberinde listelendi — başka kimlerin katıldığını görün:",
    replyLine:
      "Yardıma ihtiyacınız olursa bu e-postayı yanıtlamanız yeterli — gerçek bir insan okuyor.",
    signoff: "— OpSolid ekibi",
  },
};

function pick(locale: Locale): Copy {
  return COPY[locale] ?? COPY.en;
}

export function cardLiveSubject(locale: Locale): string {
  return pick(locale).subject;
}

function editLink(input: CardLiveInput): string {
  return `${siteBase()}/${input.locale}/card/edit/${input.orderId}?t=${encodeURIComponent(input.editToken)}`;
}

function manageLink(input: CardLiveInput): string {
  return `${siteBase()}/${input.locale}/card/manage/${input.orderId}?t=${encodeURIComponent(input.editToken)}`;
}

export function renderCardLiveHtml(input: CardLiveInput): string {
  const copy = pick(input.locale);
  const link = editLink(input);

  const body =
    paragraph(escapeHtml(copy.greeting(input.contactName))) +
    paragraph(escapeHtml(copy.lead)) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.cardUrlHeading)}</h2>` +
    paragraph(escapeHtml(copy.cardUrlBody)) +
    paragraph(inlineLink(input.cardUrl, input.cardUrl)) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.editHeading)}</h2>` +
    paragraph(escapeHtml(copy.editBody)) +
    button(link, copy.editCta) +
    paragraph(
      `<span style="color:#9CA3A0;">${inlineLink(link, link)}</span>`
    ) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.manageHeading)}</h2>` +
    paragraph(escapeHtml(copy.manageBody)) +
    paragraph(inlineLink(manageLink(input), manageLink(input))) +
    (input.eventUrl
      ? `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.eventHeading)}</h2>` +
        paragraph(escapeHtml(copy.eventBody)) +
        paragraph(inlineLink(input.eventUrl, input.eventUrl))
      : "") +
    paragraph(`<em>${escapeHtml(copy.replyLine)}</em>`) +
    paragraph(escapeHtml(copy.signoff));

  return renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml: body,
    locale: input.locale,
  });
}

export function renderCardLiveText(input: CardLiveInput): string {
  const copy = pick(input.locale);
  const link = editLink(input);

  const lines = [
    copy.greeting(input.contactName),
    "",
    copy.lead,
    "",
    copy.cardUrlHeading.toUpperCase(),
    copy.cardUrlBody,
    input.cardUrl,
    "",
    copy.editHeading.toUpperCase(),
    copy.editBody,
    link,
    "",
    copy.manageHeading.toUpperCase(),
    copy.manageBody,
    manageLink(input),
    "",
    ...(input.eventUrl
      ? [copy.eventHeading.toUpperCase(), copy.eventBody, input.eventUrl, ""]
      : []),
    copy.replyLine,
    "",
    copy.signoff,
  ];

  return renderShellText({
    headline: copy.headline,
    body: lines.join("\n"),
    locale: input.locale,
  });
}
