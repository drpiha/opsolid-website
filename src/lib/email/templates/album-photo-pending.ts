// =============================================================================
// ALBUM PHOTO PENDING — sent to the card owner whenever a visitor uploads a
// new photo to their card's album. Owner approval is required before the
// photo surfaces publicly, so this email is the primary trigger telling them
// to act. Tone matches lead-notification: factual, three pieces of info, one
// CTA back to the moderation panel.
//
// We embed the photo as a remote `<img>` rather than a CID attachment to keep
// nodemailer code paths simple — modern mail clients render the inline image
// fine, and it gives us a free privacy benefit (uploaded photos go through
// the same storage URL as the public album, which is already public).
// =============================================================================

import {
  type Locale,
  button,
  inlineLink,
  paragraph,
  renderShellHtml,
  renderShellText,
  siteBase,
} from "../shell";

export interface AlbumPhotoPendingInput {
  ownerName: string;
  ownerLocale: string;
  cardSlug: string;
  /** Order id — used to deep-link back to the edit page (admin moderation). */
  orderId: string;
  /** Owner's edit-token; embedded in the CTA so a single click takes them
   *  straight to the dashboard, no separate login. */
  editToken: string;
  /** Public, absolute URL to the uploaded photo. Storage-driver URL works
   *  directly — nothing special needed for visitor-uploaded album photos. */
  photoUrl: string;
  /** Visitor-provided name (optional). */
  uploaderName?: string | null;
  /** Visitor-provided caption (optional). */
  caption?: string | null;
}

interface Copy {
  subject: (uploader: string) => string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  by: string;
  caption: string;
  pending: string;
  cta: string;
  cardLabel: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: (u) => `New album photo from ${u} — approval needed`,
    preheader: "A visitor sent a photo to your card.",
    headline: "New album photo",
    greeting: (n) => `Hi ${n},`,
    lead: "A visitor uploaded a photo to your card's album. It is pending — approve it from your dashboard before it appears publicly.",
    by: "From",
    caption: "Note",
    pending: "Status: pending approval",
    cta: "Approve in dashboard",
    cardLabel: "Card",
  },
  de: {
    subject: (u) => `Neues Album-Foto von ${u} — Freigabe nötig`,
    preheader: "Ein Besucher hat ein Foto zu Ihrer Karte hinzugefügt.",
    headline: "Neues Album-Foto",
    greeting: (n) => `Hallo ${n},`,
    lead: "Ein Besucher hat ein Foto in das Album Ihrer Karte hochgeladen. Es ist ausstehend — bitte freigeben, damit es öffentlich erscheint.",
    by: "Von",
    caption: "Notiz",
    pending: "Status: wartet auf Freigabe",
    cta: "Im Dashboard freigeben",
    cardLabel: "Karte",
  },
  tr: {
    subject: (u) => `${u} adlı kişiden yeni albüm fotoğrafı — onay gerekli`,
    preheader: "Bir ziyaretçi kartına fotoğraf gönderdi.",
    headline: "Yeni albüm fotoğrafı",
    greeting: (n) => `Merhaba ${n},`,
    lead: "Bir ziyaretçi kartının albümüne yeni bir fotoğraf yükledi. Onaylanmadan kartında görünmeyecek — paneli açıp onayla.",
    by: "Gönderen",
    caption: "Not",
    pending: "Durum: onay bekliyor",
    cta: "Panelde onayla",
    cardLabel: "Kart",
  },
};

function normalizeLocale(raw: string): Locale {
  if (raw === "en" || raw === "tr") return raw;
  return "de";
}

export function renderAlbumPhotoPending(
  input: AlbumPhotoPendingInput,
): { subject: string; html: string; text: string } {
  const locale = normalizeLocale(input.ownerLocale);
  const copy = COPY[locale];

  const editUrl = `${siteBase()}/${locale}/card/edit/${input.orderId}?token=${encodeURIComponent(input.editToken)}#album`;
  const cardUrl = `${siteBase()}/c/${input.cardSlug}`;

  const uploader = input.uploaderName?.trim() || "—";

  const photoBlock = `<div style="margin:16px 0;text-align:center;">
    <img src="${escapeAttr(input.photoUrl)}" alt="" style="max-width:100%;height:auto;border-radius:12px;border:1px solid #eadfd2;" />
  </div>`;

  const meta: string[] = [
    `<strong>${copy.by}:</strong> ${escapeHtmlSafe(uploader)}`,
  ];
  if (input.caption) {
    meta.push(`<strong>${copy.caption}:</strong> ${escapeHtmlSafe(input.caption)}`);
  }
  meta.push(`<em>${copy.pending}</em>`);

  const bodyInnerHtml = [
    paragraph(escapeHtmlSafe(copy.greeting(input.ownerName))),
    paragraph(escapeHtmlSafe(copy.lead)),
    photoBlock,
    paragraph(meta.join("<br/>")),
    button(editUrl, copy.cta),
    paragraph(`${copy.cardLabel}: ${inlineLink(cardUrl, cardUrl.replace(/^https?:\/\//, ""))}`),
  ].join("\n");

  const html = renderShellHtml({
    preheader: copy.preheader,
    headline: copy.headline,
    bodyInnerHtml,
    locale,
  });

  const textBody = [
    copy.greeting(input.ownerName),
    "",
    copy.lead,
    "",
    `${copy.by}: ${uploader}`,
    input.caption ? `${copy.caption}: ${input.caption}` : "",
    copy.pending,
    "",
    `${copy.cta}: ${editUrl}`,
    `${copy.cardLabel}: ${cardUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: copy.subject(uploader === "—" ? "anonymous" : uploader),
    html,
    text: renderShellText({ headline: copy.headline, body: textBody, locale }),
  };
}

function escapeHtmlSafe(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}
