// Automatic acknowledgement for trainer applications (owner-approved wording, 2026-11-04; Turkish text and
// the postal address in the signature, 2026-11-05; designed HTML with the embedded logo and the business
// signature block, 2026-11-06).
// Abuse rules: the mail repeats nothing the applicant typed (not even the name), contains no link and no
// remote image (the logo travels inside the mail; our own address and site are plain text that a client may
// linkify), goes to one recipient address at most once in 24 hours and to at most 20 addresses a day
// (5 an hour) in all, so the form cannot be used to mail strangers in bulk. It is on unless
// CONTACT_TRAINER_ACK=off: the privacy text promises it, and the release tool keeps the live environment as it
// is, so it ships switched on with the code (2026-11-05).
// A failed acknowledgement never fails the submission: callers get a boolean and nothing is thrown.

import { SITE_CONFIG } from "@/lib/constants";
import { ACK_LOGO } from "@/lib/email/ack-logo";

export type AckLocale = "de" | "en" | "tr";

const ADDRESS = "info@opsolid.de";
const SITE = "opsolid.de";

// Signature of automatic mails (owner decision 2026-11-06): the business block of the personal signature
// without the name and title lines. Name and postal address, as in the Impressum, are recommended practice
// for a sole trader who is not in the commercial register (chambers of commerce), not a statutory duty:
// § 15b GewO, which once required them, was repealed in 2009. The owner keeps the address.
const COUNTRY: Record<AckLocale, string> = { de: "", en: " · Germany", tr: " · Almanya" };
const LEGAL: Record<AckLocale, string> = {
  de: `Impressum und Datenschutz: ${SITE}/de/impressum`,
  en: `Legal notice and privacy: ${SITE}/en/impressum`,
  tr: `Künye ve gizlilik: ${SITE}/tr/impressum`,
};
export function ackSignature(locale: AckLocale): string[] {
  const { street, postalCode, city } = SITE_CONFIG.address;
  return ["OpSolid, Inh. Hasan Dönmez", `${street} · ${postalCode} ${city}${COUNTRY[locale]}`, `${ADDRESS} · ${SITE}`, LEGAL[locale]];
}

// The approved texts, word for word; they are only split into paragraphs. DE keeps the German salutation
// line; EN and TR keep the greeting and the thanks in one paragraph, exactly as approved. `headline` is the
// subject in two parts (the second is set in italics), `eyebrow` the small label above it (written in capitals
// here, because a mail client's text-transform gets the Turkish dotted İ wrong).
export const ACK_TEXT: Record<AckLocale, { subject: string; eyebrow: string; headline: [string, string]; lines: string[] }> = {
  de: {
    subject: "Ihre Bewerbung ist eingegangen",
    eyebrow: "EINGANGSBESTÄTIGUNG",
    headline: ["Ihre Bewerbung ist ", "eingegangen"],
    lines: [
      "Guten Tag,",
      "vielen Dank für Ihre Bewerbung. Sie ist bei uns eingegangen. Wir antworten innerhalb von sieben Tagen.",
      "Einsätze entstehen aus Kundenanfragen; wir melden uns, sobald eine Anfrage zu Ihrem Thema passt.",
      "Ihre Angaben verwenden wir nur für die Auswahl von Trainerinnen und Trainern und löschen sie auf Wunsch.",
      "Freundliche Grüße,",
    ],
  },
  en: {
    subject: "We have received your application",
    eyebrow: "CONFIRMATION OF RECEIPT",
    headline: ["We have received ", "your application"],
    lines: [
      "Hello, thank you for your application. We have received it and will reply within seven days.",
      "Assignments come from client requests; we will contact you when a request fits your topic.",
      "We use your details only to select trainers and delete them on request.",
      "Kind regards,",
    ],
  },
  tr: {
    subject: "Başvurunuz bize ulaştı",
    eyebrow: "ALINDI BİLDİRİMİ",
    headline: ["Başvurunuz ", "bize ulaştı"],
    lines: [
      "Merhaba, başvurunuz için teşekkür ederiz. Başvurunuz bize ulaştı; yedi gün içinde yanıt vereceğiz.",
      "Eğitim görevleri müşteri taleplerinden doğar; konunuza uygun bir talep olduğunda size döneriz.",
      "Bilgilerinizi yalnızca eğitmen seçimi için kullanır, talep üzerine sileriz.",
      "Saygılarımızla",
    ],
  },
};

/** The form's `source` ends in the page language ("v7-contact-tr"); anything else gets the English text. */
export function ackLocale(source: string | undefined): AckLocale {
  const lang = /-(de|tr)$/.exec(source ?? "")?.[1];
  return lang === "de" || lang === "tr" ? lang : "en";
}

export const ACK_ENABLED = () => process.env.CONTACT_TRAINER_ACK?.trim().toLowerCase() !== "off";

const HOUR_MS = 60 * 60_000;
const DAY_MS = 24 * HOUR_MS;
const MAX_KEYS = 10_000;
export const ACK_MAX_PER_DAY = 20;
export const ACK_MAX_PER_HOUR = 5;

/**
 * One mailbox, one key: lower case, no "+tag", and for Gmail no dots and one domain, so a+1@x and
 * A.B@googlemail.com cannot each claim their own acknowledgement.
 */
export function ackKey(address: string): string {
  const a = address.trim().toLowerCase();
  const at = a.lastIndexOf("@");
  if (at < 1) return a;
  let local = a.slice(0, at);
  let domain = a.slice(at + 1).replace(/\.+$/, "");
  local = local.split("+")[0];
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return `${local}@${domain}`;
}

/**
 * One acknowledgement per mailbox and 24 hours, at most ACK_MAX_PER_DAY in any 24 hours and ACK_MAX_PER_HOUR
 * in any hour across all recipients. Memory stays bounded (oldest addresses evicted first).
 */
export function createAckLimiter(now: () => number = Date.now) {
  const byKey = new Map<string, number>();
  let recent: number[] = []; // send times of the last 24 hours, at most ACK_MAX_PER_DAY entries
  return {
    /** True and records the send when this mailbox had none in 24 hours and both totals have room. */
    take(address: string): boolean {
      const key = ackKey(address);
      const t = now();
      for (let first = byKey.entries().next(); !first.done; first = byKey.entries().next()) {
        if (t - first.value[1] < DAY_MS && t >= first.value[1]) break;
        byKey.delete(first.value[0]);
      }
      recent = recent.filter((s) => t - s < DAY_MS && t >= s);
      if (byKey.has(key)) return false;
      if (recent.length >= ACK_MAX_PER_DAY) return false;
      if (recent.filter((s) => t - s < HOUR_MS).length >= ACK_MAX_PER_HOUR) return false;
      if (byKey.size >= MAX_KEYS) byKey.delete(byKey.keys().next().value!);
      byKey.set(key, t);
      recent.push(t);
      return true;
    },
    /** Frees the mailbox and its slot again after a send that did not happen, so a retry is possible. */
    release(address: string) {
      const key = ackKey(address);
      const t = byKey.get(key);
      if (t === undefined) return;
      byKey.delete(key);
      const i = recent.lastIndexOf(t);
      if (i >= 0) recent.splice(i, 1);
    },
  };
}

export const ackLimiter = createAckLimiter();

export type AckMail = {
  to: string;
  from?: string;
  replyTo: string;
  subject: string;
  text: string;
  /** The designed mail; its logo is the embedded image in `inlineImages`. */
  html: string;
  /** The same mail with the brand name as text, for a mail provider that cannot embed an image. */
  htmlWithoutInlineImages: string;
  inlineImages: { cid: string; filename: string; contentType: string; contentBase64: string }[];
  headers: Record<string, string>;
};

// The site's direction "Klarheit" within what mail clients render: porcelain ground, ink text, the copper
// tick on a hairline, a serif headline with an italic copper phrase, a mono label. Tables and inline styles
// only, one column, no style sheet, no web font (each stack starts with the site's face and falls back to a
// system face of the same kind), light colour scheme declared.
const C = { porcelain: "#F6F2EC", ink: "#16191D", stone: "#6B665F", line: "#E3DCD1", copper: "#B5623A", copperDeep: "#8A4524" };
const F = {
  serif: "Fraunces,'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif",
  sans: "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
  mono: "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace",
};
const TABLE = 'role="presentation" cellpadding="0" cellspacing="0" border="0"';
const gap = (px: number) => `<div style="height:${px}px;line-height:${px}px;font-size:0;">&nbsp;</div>`;
// The section rule of the site: a hairline that starts with a 56 px copper tick.
const RULE =
  `<table ${TABLE} width="100%" style="width:100%;"><tr>` +
  `<td width="56" style="width:56px;height:2px;line-height:2px;font-size:0;background:${C.copper};">&nbsp;</td>` +
  `<td style="height:2px;line-height:2px;font-size:0;border-top:1px solid ${C.line};">&nbsp;</td>` +
  `</tr></table>`;

export function ackHtml(locale: AckLocale, withLogo: boolean): string {
  const { subject, eyebrow, headline, lines } = ACK_TEXT[locale];
  const [name, ...details] = ackSignature(locale);
  const brand = withLogo
    ? `<img src="cid:${ACK_LOGO.cid}" width="${ACK_LOGO.width}" height="${ACK_LOGO.height}" alt="OpSolid" ` +
      `style="display:block;border:0;outline:none;width:${ACK_LOGO.width}px;height:${ACK_LOGO.height}px;` +
      `font-family:${F.sans};font-size:15px;font-weight:600;letter-spacing:0.24em;color:${C.copperDeep};">`
    : `<div style="font-family:${F.sans};font-size:15px;line-height:30px;font-weight:600;letter-spacing:0.24em;color:${C.copperDeep};">OPSOLID</div>`;
  // A letter close: the closing line leads straight into the signer; the rule then frames the address block.
  const body = lines
    .map((line, i) => `<p style="margin:0 0 ${i === lines.length - 1 ? 12 : i === lines.length - 2 ? 24 : 16}px 0;">${line}</p>`)
    .join("");
  return (
    `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">` +
    `<title>${subject}</title></head>` +
    `<body style="margin:0;padding:0;background:${C.porcelain};-webkit-text-size-adjust:100%;">` +
    `<table ${TABLE} width="100%" bgcolor="${C.porcelain}" style="width:100%;background:${C.porcelain};"><tr><td align="center">` +
    `<table ${TABLE} width="560" style="width:100%;max-width:560px;"><tr>` +
    `<td align="left" style="padding:44px 24px 52px 24px;text-align:left;font-family:${F.sans};color:${C.ink};">` +
    brand +
    gap(20) +
    RULE +
    gap(40) +
    `<p style="margin:0 0 12px 0;font-family:${F.mono};font-size:11px;line-height:16px;letter-spacing:0.1em;color:${C.copperDeep};">${eyebrow}</p>` +
    `<h1 style="margin:0 0 32px 0;font-family:${F.serif};font-weight:400;font-size:32px;line-height:36px;letter-spacing:-0.015em;color:${C.ink};">` +
    `${headline[0]}<em style="font-style:italic;white-space:nowrap;color:${C.copper};">${headline[1]}</em></h1>` +
    `<div style="font-size:17px;line-height:27px;color:${C.ink};">${body}</div>` +
    `<p style="margin:0;font-family:${F.serif};font-weight:400;font-size:19px;line-height:26px;color:${C.ink};">${name}</p>` +
    gap(36) +
    RULE +
    gap(16) +
    `<p style="margin:0;font-size:13px;line-height:21px;color:${C.stone};">${details.join("<br>")}</p>` +
    `</td></tr></table></td></tr></table></body></html>`
  );
}

export function buildAck(to: string, source: string | undefined, from?: string): AckMail {
  const locale = ackLocale(source);
  const { subject, lines } = ACK_TEXT[locale];
  return {
    to,
    from,
    // Replies reach our own inbox, whatever the sending account is.
    replyTo: ADDRESS,
    subject,
    text: `${lines.join("\n\n")}\n\n${ackSignature(locale).join("\n")}`,
    html: ackHtml(locale, true),
    htmlWithoutInlineImages: ackHtml(locale, false),
    inlineImages: [{ cid: ACK_LOGO.cid, filename: ACK_LOGO.filename, contentType: ACK_LOGO.contentType, contentBase64: ACK_LOGO.contentBase64 }],
    // RFC 3834: generated by a form, not a reply to a mail; also asks Exchange not to answer it.
    headers: { "Auto-Submitted": "auto-generated", "X-Auto-Response-Suppress": "All" },
  };
}

/**
 * Sends the acknowledgement when the flag is on, the mailbox had none in 24 hours, the totals have room and
 * the optional `gate` (the route's delivery budget) agrees. `send` is injected (the route passes the mail
 * client; tests pass a sink). Never throws.
 */
export async function sendTrainerAck(
  args: { to: string; source?: string; from?: string },
  send: (mail: AckMail) => Promise<{ ok: boolean }>,
  limiter: ReturnType<typeof createAckLimiter> = ackLimiter,
  gate: () => boolean = () => true,
): Promise<boolean> {
  if (!ACK_ENABLED()) return false;
  if (!limiter.take(args.to)) return false;
  if (!gate()) {
    limiter.release(args.to);
    return false;
  }
  try {
    const result = await send(buildAck(args.to, args.source, args.from));
    if (!result.ok) limiter.release(args.to);
    return result.ok;
  } catch {
    limiter.release(args.to);
    return false;
  }
}
