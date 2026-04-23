// =============================================================================
// REVISION-READY — sent after admin publishes the card. Contains the public
// URL, QR image (inline data-URL), download link, self-edit link, and the
// cancel-subscription anchor (Track D owns the target).
// =============================================================================

import QRCode from "qrcode";
import {
  type Locale,
  button,
  escapeHtml,
  inlineLink,
  paragraph,
  qrImg,
  renderShellHtml,
  renderShellText,
  siteBase,
} from "../shell";

export interface RevisionReadyInput {
  orderId: string;
  orderNumber: number;
  contactName: string;
  slug: string;
  editToken: string;
  isSubscription: boolean;
}

interface Copy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  publicUrlLabel: string;
  qrAlt: string;
  downloadHeading: string;
  downloadBody: string;
  downloadCta: string;
  editHeading: string;
  editBody: string;
  editCta: string;
  cancelHeading: string;
  cancelBody: string;
  cancelCta: string;
  replyLine: string;
  signoff: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: "Your OpSolid card is live",
    preheader: "Share your new digital card URL and QR code.",
    headline: "Your card is live",
    greeting: (n) => `Hello ${n},`,
    lead:
      "Your digital business card is now published. Share the URL below or show the QR code for a quick save to any phone.",
    publicUrlLabel: "Public URL",
    qrAlt: "QR code for your OpSolid digital business card",
    downloadHeading: "Save to phone",
    downloadBody:
      "You can download the vCard or the QR image for prints directly from your card page.",
    downloadCta: "Open my card",
    editHeading: "Keep it current",
    editBody:
      "Change your photo, title or links any time from your personal edit link.",
    editCta: "Edit my details",
    cancelHeading: "Subscription",
    cancelBody:
      "If your card is on a recurring plan, you can pause or cancel from the edit page. Your card stays live until the end of the current period.",
    cancelCta: "Manage subscription",
    replyLine: "You can also reply to this email if anything needs attention.",
    signoff: "— The OpSolid team",
  },
  de: {
    subject: "Ihre OpSolid Karte ist online",
    preheader: "URL und QR-Code Ihrer neuen digitalen Visitenkarte.",
    headline: "Ihre Karte ist online",
    greeting: (n) => `Guten Tag ${n},`,
    lead:
      "Ihre digitale Visitenkarte ist jetzt veröffentlicht. Teilen Sie die URL unten oder zeigen Sie den QR-Code — beides speichert sich auf jedem Telefon in Sekunden.",
    publicUrlLabel: "Öffentliche URL",
    qrAlt: "QR-Code Ihrer OpSolid Visitenkarte",
    downloadHeading: "Auf dem Telefon speichern",
    downloadBody:
      "Sie können die vCard oder das QR-Bild für den Druck direkt von Ihrer Kartenseite herunterladen.",
    downloadCta: "Karte öffnen",
    editHeading: "Immer aktuell",
    editBody:
      "Foto, Titel oder Links jederzeit über Ihren persönlichen Bearbeitungslink ändern.",
    editCta: "Daten bearbeiten",
    cancelHeading: "Abonnement",
    cancelBody:
      "Wenn Ihre Karte auf einem Abo läuft, können Sie es auf der Bearbeitungsseite pausieren oder kündigen. Die Karte bleibt bis zum Ende der laufenden Periode online.",
    cancelCta: "Abo verwalten",
    replyLine:
      "Bei Fragen einfach auf diese E-Mail antworten, wir melden uns.",
    signoff: "— Ihr OpSolid Team",
  },
  tr: {
    subject: "OpSolid kartınız yayında",
    preheader: "Yeni dijital kartvizitinizin URL'si ve QR kodu.",
    headline: "Kartınız yayında",
    greeting: (n) => `Merhaba ${n},`,
    lead:
      "Dijital kartvizitiniz artık yayında. Aşağıdaki URL'yi paylaşın veya QR kodu gösterin — iki yol da saniyeler içinde herhangi bir telefona kaydeder.",
    publicUrlLabel: "Herkese açık URL",
    qrAlt: "OpSolid dijital kartvizitinizin QR kodu",
    downloadHeading: "Telefona kaydedin",
    downloadBody:
      "vCard dosyasını veya baskı için QR görselini doğrudan kart sayfanızdan indirebilirsiniz.",
    downloadCta: "Kartımı aç",
    editHeading: "Her zaman güncel",
    editBody:
      "Fotoğraf, unvan veya bağlantılarınızı kişisel düzenleme bağlantınızdan istediğiniz zaman değiştirin.",
    editCta: "Bilgilerimi düzenle",
    cancelHeading: "Abonelik",
    cancelBody:
      "Kartınız abonelikli bir planda ise düzenleme sayfasından duraklatabilir veya iptal edebilirsiniz. Kartınız mevcut dönemin sonuna kadar yayında kalır.",
    cancelCta: "Aboneliği yönet",
    replyLine:
      "Herhangi bir konuda yardım gerekirse bu e-postayı yanıtlamanız yeterli.",
    signoff: "— OpSolid ekibi",
  },
};

function pick(locale: Locale): Copy {
  return COPY[locale] ?? COPY.en;
}

function urls(input: RevisionReadyInput) {
  const base = siteBase();
  const publicUrl = `${base}/c/${input.slug}`;
  const editUrl = `${base}/card/edit/${input.orderId}?t=${encodeURIComponent(input.editToken)}`;
  const cancelUrl = `${editUrl}#cancel`;
  const downloadVcard = `${publicUrl}/vcard`;
  return { base, publicUrl, editUrl, cancelUrl, downloadVcard };
}

export function revisionReadySubject(
  input: RevisionReadyInput,
  locale: Locale
): string {
  const copy = pick(locale);
  return `${copy.subject} · #${input.orderNumber}`;
}

// Generate a 256x256 PNG data URL. Kept small so the embedded email stays
// well under 50KB — a 256px QR is ~5-8KB base64-encoded.
async function qrDataUrl(publicUrl: string): Promise<string> {
  return QRCode.toDataURL(publicUrl, {
    width: 256,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#15120F", light: "#FFFFFF" },
  });
}

export async function renderRevisionReadyHtml(
  input: RevisionReadyInput,
  locale: Locale
): Promise<string> {
  const copy = pick(locale);
  const { publicUrl, editUrl, cancelUrl, downloadVcard } = urls(input);
  const qr = await qrDataUrl(publicUrl);

  let body =
    paragraph(escapeHtml(copy.greeting(input.contactName))) +
    paragraph(escapeHtml(copy.lead)) +
    `<p style="margin:0 0 8px 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9CA3A0;">${escapeHtml(copy.publicUrlLabel)}</p>` +
    `<p style="margin:0 0 16px 0;font-size:18px;">${inlineLink(publicUrl, publicUrl)}</p>` +
    qrImg(qr, copy.qrAlt) +
    button(publicUrl, copy.downloadCta) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.downloadHeading)}</h2>` +
    paragraph(escapeHtml(copy.downloadBody)) +
    paragraph(inlineLink(downloadVcard, downloadVcard)) +
    `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.editHeading)}</h2>` +
    paragraph(escapeHtml(copy.editBody)) +
    button(editUrl, copy.editCta);

  if (input.isSubscription) {
    body +=
      `<h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:normal;">${escapeHtml(copy.cancelHeading)}</h2>` +
      paragraph(escapeHtml(copy.cancelBody)) +
      paragraph(inlineLink(cancelUrl, copy.cancelCta));
  }

  body +=
    paragraph(`<em>${escapeHtml(copy.replyLine)}</em>`) +
    paragraph(escapeHtml(copy.signoff));

  return renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml: body,
    locale,
  });
}

export function renderRevisionReadyText(
  input: RevisionReadyInput,
  locale: Locale
): string {
  const copy = pick(locale);
  const { publicUrl, editUrl, cancelUrl, downloadVcard } = urls(input);
  const lines = [
    copy.greeting(input.contactName),
    "",
    copy.lead,
    "",
    `${copy.publicUrlLabel}: ${publicUrl}`,
    "",
    copy.downloadHeading.toUpperCase(),
    copy.downloadBody,
    downloadVcard,
    "",
    copy.editHeading.toUpperCase(),
    copy.editBody,
    editUrl,
  ];

  if (input.isSubscription) {
    lines.push(
      "",
      copy.cancelHeading.toUpperCase(),
      copy.cancelBody,
      cancelUrl
    );
  }

  lines.push("", copy.replyLine, "", copy.signoff);

  return renderShellText({
    headline: copy.headline,
    body: lines.join("\n"),
    locale,
  });
}
