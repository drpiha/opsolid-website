// =============================================================================
// NOTIFICATION MODULE — Telegram, WhatsApp (CallMeBot), Email
// Sends booking notifications to all configured channels in parallel.
// Each channel fails silently (logs error) so one failure doesn't block others.
// Silent failures ARE reported to Sentry (tag: area=admin-notification,
// channel={telegram|whatsapp|email}) so operators see them without blocking
// the critical path. Sentry no-ops gracefully when DSN is missing.
// =============================================================================

import * as Sentry from "@sentry/nextjs";

export interface BookingInfo {
  title: string;
  name: string;
  email: string;
  startTime: string;
  endTime: string;
  status: "created" | "cancelled" | "rescheduled";
  location?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Telegram
// ---------------------------------------------------------------------------

async function sendTelegram(booking: BookingInfo): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const emoji =
    booking.status === "created"
      ? "📅"
      : booking.status === "cancelled"
        ? "❌"
        : "🔄";

  const statusText =
    booking.status === "created"
      ? "Neue Buchung"
      : booking.status === "cancelled"
        ? "Stornierung"
        : "Umgebucht";

  const text = [
    `${emoji} *${statusText}*`,
    ``,
    `👤 *Name:* ${escapeMarkdown(booking.name)}`,
    `📧 *E-Mail:* ${escapeMarkdown(booking.email)}`,
    `📋 *Termin:* ${escapeMarkdown(booking.title)}`,
    `🕐 *Zeit:* ${formatDateTime(booking.startTime)} – ${formatTime(booking.endTime)}`,
    booking.location ? `📍 *Ort:* ${escapeMarkdown(booking.location)}` : "",
    booking.notes ? `📝 *Notiz:* ${escapeMarkdown(booking.notes)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// WhatsApp (CallMeBot)
// ---------------------------------------------------------------------------

async function sendWhatsApp(booking: BookingInfo): Promise<void> {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.WHATSAPP_CALLMEBOT_APIKEY;
  if (!phone || !apiKey) return;

  const statusText =
    booking.status === "created"
      ? "Neue Buchung"
      : booking.status === "cancelled"
        ? "Stornierung"
        : "Umgebucht";

  const message = [
    `📅 ${statusText}`,
    `Name: ${booking.name}`,
    `E-Mail: ${booking.email}`,
    `Termin: ${booking.title}`,
    `Zeit: ${formatDateTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
    booking.location ? `Ort: ${booking.location}` : "",
    booking.notes ? `Notiz: ${booking.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`CallMeBot API error ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// Email (via existing SMTP / nodemailer)
// ---------------------------------------------------------------------------

async function sendEmail(booking: BookingInfo): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO_EMAIL || "info@kutasia.com";

  if (!smtpHost || !smtpUser || !smtpPass) return;

  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT || "587") === "465",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const statusText =
    booking.status === "created"
      ? "Neue Buchung"
      : booking.status === "cancelled"
        ? "Stornierung"
        : "Termin umgebucht";

  const subject = `${statusText}: ${booking.name} — ${booking.title}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
      <div style="background: linear-gradient(135deg, #1a5faa, #2563eb); border-radius: 12px; padding: 20px 24px; margin-bottom: 20px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">${statusText}</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; width: 100px;">Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">E-Mail</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${booking.email}" style="color: #2563eb;">${booking.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Termin</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${booking.title}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Zeit</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${formatDateTime(booking.startTime)} – ${formatTime(booking.endTime)}</td>
        </tr>
        ${booking.location ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Ort</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${booking.location}</td></tr>` : ""}
        ${booking.notes ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Notiz</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${booking.notes}</td></tr>` : ""}
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">Gesendet von OpSolid Booking Agent</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"OpSolid Booking Agent" <${smtpUser}>`,
    to: contactTo,
    replyTo: booking.email,
    subject,
    html,
  });
}

// ---------------------------------------------------------------------------
// Main — send to all channels in parallel
// ---------------------------------------------------------------------------

export async function notifyBooking(booking: BookingInfo): Promise<void> {
  const channels = ["telegram", "whatsapp", "email"] as const;
  const results = await Promise.allSettled([
    sendTelegram(booking),
    sendWhatsApp(booking),
    sendEmail(booking),
  ]);

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error("[Notification Error]", result.reason);
      Sentry.captureException(result.reason, {
        tags: { area: "admin-notification", channel: channels[i], kind: "booking" },
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Digital Card Order notifications
// ---------------------------------------------------------------------------

export interface OrderEventInfo {
  orderId: string;
  orderNumber: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  callMeBack: boolean;
  amountCents: number;
  billingMode: string;
  slug: string | null;
  event: "paid" | "awaiting_design" | "published" | "created";
}

function subjectPrefix(event: OrderEventInfo["event"]): string {
  switch (event) {
    case "awaiting_design":
      return "[TASARIM]";
    case "published":
      return "[YAYIN]";
    case "paid":
      return "[PAID]";
    case "created":
    default:
      return "[ORDER]";
  }
}

function headlineLabel(event: OrderEventInfo["event"]): string {
  switch (event) {
    case "awaiting_design":
      return "Ready for design review";
    case "published":
      return "Card published";
    case "paid":
      return "Payment received";
    case "created":
    default:
      return "New order";
  }
}

function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://opsolid.de"
  );
}

function formatEuroCents(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

async function sendOrderTelegram(info: OrderEventInfo): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const flag = info.callMeBack ? "📞 [CALL-ME-BACK]" : "✅";
  const headline =
    info.event === "awaiting_design"
      ? "Ready for design review"
      : info.event === "published"
      ? "Card published"
      : info.event === "paid"
      ? "Payment received"
      : "New DBC order";
  const base = siteBase();
  const adminUrl = `${base}/admin/orders/${info.orderId}`;
  const lines = [
    `${flag} *${escapeMarkdown(headline)} — #${info.orderNumber}*`,
    ``,
    `👤 *Name:* ${escapeMarkdown(info.contactName)}`,
    `📧 *E-Mail:* ${escapeMarkdown(info.contactEmail)}`,
    `📱 *Phone:* ${escapeMarkdown(info.contactPhone)}`,
    `💶 *Amount:* ${formatEuroCents(info.amountCents)} (${info.billingMode})`,
    info.event === "awaiting_design"
      ? `🎨 *Admin:* ${escapeMarkdown(adminUrl)}\n⏱ *SLA:* 48h hand-designed delivery`
      : "",
    info.event === "published" && info.slug
      ? `🔗 *URL:* opsolid.de/c/${escapeMarkdown(info.slug)}`
      : "",
    info.event === "paid" && info.slug
      ? `🔗 *URL:* opsolid.de/c/${escapeMarkdown(info.slug)}`
      : "",
  ].filter(Boolean);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "Markdown",
    }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

async function sendOrderWhatsApp(info: OrderEventInfo): Promise<void> {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.WHATSAPP_CALLMEBOT_APIKEY;
  if (!phone || !apiKey) return;

  const flag = info.callMeBack ? "[ARA] " : "";
  const prefix = subjectPrefix(info.event);
  const message = [
    `${flag}${prefix} DBC #${info.orderNumber} — ${headlineLabel(info.event)}`,
    `Name: ${info.contactName}`,
    `Phone: ${info.contactPhone}`,
    `Email: ${info.contactEmail}`,
    `Amount: ${formatEuroCents(info.amountCents)} (${info.billingMode})`,
    info.event === "awaiting_design"
      ? `Admin: ${siteBase()}/admin/orders/${info.orderId}`
      : "",
    info.event === "awaiting_design" ? "SLA: 48h hand-designed delivery" : "",
    (info.event === "published" || info.event === "paid") && info.slug
      ? `URL: opsolid.de/c/${info.slug}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CallMeBot ${res.status}: ${await res.text()}`);
}

async function sendOrderEmail(info: OrderEventInfo): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO_EMAIL;
  if (!smtpHost || !smtpUser || !smtpPass || !contactTo) return;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT || "587") === "465",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const callFlag = info.callMeBack ? "[ARA] " : "";
  const prefix = subjectPrefix(info.event);
  const base = siteBase();
  const subject = `${callFlag}${prefix} DBC #${info.orderNumber} — ${info.contactName}`;
  const text = [
    `${headlineLabel(info.event)} — Order #${info.orderNumber}`,
    `Name: ${info.contactName}`,
    `Email: ${info.contactEmail}`,
    `Phone: ${info.contactPhone}`,
    `Call me back: ${info.callMeBack ? "YES" : "no"}`,
    `Amount: ${formatEuroCents(info.amountCents)} (${info.billingMode})`,
    "",
    info.event === "awaiting_design"
      ? `Ready for design review. 48h hand-designed SLA.`
      : "",
    info.event === "awaiting_design"
      ? `Admin: ${base}/admin/orders/${info.orderId}`
      : "",
    info.event === "published" && info.slug
      ? `Published URL: ${base}/c/${info.slug}`
      : "",
    info.event !== "awaiting_design" ? `Admin: ${base}/admin/orders` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: `"OpSolid Orders" <${smtpUser}>`,
    to: contactTo,
    replyTo: info.contactEmail,
    subject,
    text,
  });
}

export async function notifyOrderEvent(info: OrderEventInfo): Promise<void> {
  const channels = ["telegram", "whatsapp", "email"] as const;
  const results = await Promise.allSettled([
    sendOrderTelegram(info),
    sendOrderWhatsApp(info),
    sendOrderEmail(info),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error("[Order notification error]", r.reason);
      Sentry.captureException(r.reason, {
        tags: {
          area: "admin-notification",
          channel: channels[i],
          kind: "order",
          event: info.event,
        },
        extra: { orderId: info.orderId, orderNumber: info.orderNumber },
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
}
