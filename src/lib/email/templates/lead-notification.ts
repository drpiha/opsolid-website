// =============================================================================
// LEAD NOTIFICATION — sent to the card owner the moment someone submits the
// "Bilgilerimi Gönder" form on their public Smart Card. Tone: matter-of-fact,
// just the facts so the owner can respond without re-reading marketing copy.
//
// Reply-To is set to the visitor's email address (when provided) so the
// owner can hit reply and answer them directly.
// =============================================================================

import {
  type Locale,
  button,
  detailsTable,
  inlineLink,
  paragraph,
  renderShellHtml,
  renderShellText,
  siteBase,
} from "../shell";

export interface LeadNotificationInput {
  ownerName: string;
  cardSlug: string;
  visitor: {
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    message?: string | null;
    interest?: string | null;
    meetingContext?: string | null;
  };
  source?: {
    src?: string;
    campaign?: string;
    event?: string;
    location?: string;
  };
  orderId: string;
}

interface Copy {
  subject: (visitorName: string) => string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  cta: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    company: string;
    interest: string;
    context: string;
    source: string;
    campaign: string;
    event: string;
    location: string;
    message: string;
  };
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: (n) => `New lead from ${n} via your Smart Card`,
    preheader: "Someone sent their details from your card.",
    headline: "New lead",
    greeting: (n) => `Hi ${n},`,
    lead: "A visitor sent their details from your Smart Card. Their info is below — reply to this email to reach them directly.",
    cta: "Open in admin",
    labels: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      interest: "Interest",
      context: "Met at",
      source: "Source",
      campaign: "Campaign",
      event: "Event",
      location: "Location",
      message: "Message",
    },
  },
  de: {
    subject: (n) => `Neue Anfrage von ${n} über Ihre Smart Card`,
    preheader: "Jemand hat Ihnen seine Daten gesendet.",
    headline: "Neue Anfrage",
    greeting: (n) => `Hallo ${n},`,
    lead: "Ein Besucher hat seine Daten über Ihre Smart Card gesendet. Antworten Sie auf diese E-Mail, um direkt zu antworten.",
    cta: "Im Admin öffnen",
    labels: {
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      company: "Unternehmen",
      interest: "Interesse",
      context: "Kennengelernt",
      source: "Quelle",
      campaign: "Kampagne",
      event: "Veranstaltung",
      location: "Ort",
      message: "Nachricht",
    },
  },
  tr: {
    subject: (n) => `${n} adlı kişi Smart Card üzerinden ulaştı`,
    preheader: "Birisi kartınız üzerinden bilgilerini gönderdi.",
    headline: "Yeni iletişim",
    greeting: (n) => `Merhaba ${n},`,
    lead: "Bir ziyaretçi Smart Card üzerinden bilgilerini gönderdi. Doğrudan yanıtlamak için bu e-postayı yanıtlamanız yeterli.",
    cta: "Admin'de aç",
    labels: {
      name: "Ad Soyad",
      email: "E-posta",
      phone: "Telefon",
      company: "Şirket",
      interest: "İlgi alanı",
      context: "Tanışma",
      source: "Kaynak",
      campaign: "Kampanya",
      event: "Etkinlik",
      location: "Konum",
      message: "Mesaj",
    },
  },
};

export function renderLeadNotification(
  input: LeadNotificationInput,
  locale: Locale = "de",
): { subject: string; html: string; text: string } {
  const copy = COPY[locale];
  const adminUrl = `${siteBase()}/admin/orders/${input.orderId}`;

  const rows: Array<{ label: string; value: string }> = [
    { label: copy.labels.name, value: input.visitor.name },
  ];
  if (input.visitor.email) rows.push({ label: copy.labels.email, value: input.visitor.email });
  if (input.visitor.phone) rows.push({ label: copy.labels.phone, value: input.visitor.phone });
  if (input.visitor.company) rows.push({ label: copy.labels.company, value: input.visitor.company });
  if (input.visitor.interest) rows.push({ label: copy.labels.interest, value: input.visitor.interest });
  if (input.visitor.meetingContext) rows.push({ label: copy.labels.context, value: input.visitor.meetingContext });
  if (input.source?.src) rows.push({ label: copy.labels.source, value: input.source.src });
  if (input.source?.campaign) rows.push({ label: copy.labels.campaign, value: input.source.campaign });
  if (input.source?.event) rows.push({ label: copy.labels.event, value: input.source.event });
  if (input.source?.location) rows.push({ label: copy.labels.location, value: input.source.location });

  const messageBlock = input.visitor.message
    ? paragraph(`<strong>${copy.labels.message}:</strong><br/>${escapeHtmlSafe(input.visitor.message).replace(/\n/g, "<br/>")}`)
    : "";

  const bodyInnerHtml = [
    paragraph(escapeHtmlSafe(copy.greeting(input.ownerName))),
    paragraph(escapeHtmlSafe(copy.lead)),
    detailsTable(rows),
    messageBlock,
    button(adminUrl, copy.cta),
    paragraph(`Card: ${inlineLink(`${siteBase()}/c/${input.cardSlug}`, `card.opsolid.de/${input.cardSlug}`)}`),
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
    ...rows.map((r) => `${r.label}: ${r.value}`),
    input.visitor.message ? `\n${copy.labels.message}:\n${input.visitor.message}` : "",
    "",
    `${copy.cta}: ${adminUrl}`,
    `Card: ${siteBase()}/c/${input.cardSlug}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: copy.subject(input.visitor.name),
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
