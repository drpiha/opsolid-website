// Automatic acknowledgement for trainer applications (owner-approved wording, 2026-11-04).
// Abuse rules: the mail repeats nothing the applicant typed (not even the name), contains no links from
// applicant input (our own fixed address may be linkified by clients), goes to one recipient address at
// most once in 24 hours and to at most 20 addresses a day (5 an hour) in all, so the form cannot be used
// to mail strangers in bulk. It is off unless CONTACT_TRAINER_ACK=on. A failed acknowledgement never fails
// the submission: callers get a boolean and nothing is thrown.

export type AckLocale = "de" | "en";

const ADDRESS = "info@opsolid.de";

// The approved texts, split only where a mail client needs line breaks. DE keeps the German salutation
// line; EN keeps "Hello, thank you ..." in one paragraph, exactly as approved.
export const ACK_TEXT: Record<AckLocale, { subject: string; lines: string[] }> = {
  de: {
    subject: "Ihre Bewerbung ist eingegangen",
    lines: [
      "Guten Tag,",
      "vielen Dank für Ihre Bewerbung. Sie ist bei uns eingegangen. Wir antworten innerhalb von sieben Tagen. Einsätze entstehen aus Kundenanfragen; wir melden uns, sobald eine Anfrage zu Ihrem Thema passt. Ihre Angaben verwenden wir nur für die Auswahl von Trainerinnen und Trainern und löschen sie auf Wunsch.",
      "Freundliche Grüße,",
      `OpSolid, Inh. Hasan Dönmez, ${ADDRESS}`,
    ],
  },
  en: {
    subject: "We have received your application",
    lines: [
      "Hello, thank you for your application. We have received it and will reply within seven days. Assignments come from client requests; we will contact you when a request fits your topic. We use your details only to select trainers and delete them on request.",
      "Kind regards,",
      `OpSolid, Inh. Hasan Dönmez, ${ADDRESS}`,
    ],
  },
};

/** The form's `source` ends in the page language ("v7-contact-tr"). Turkish applicants get the English text. */
export function ackLocale(source: string | undefined): AckLocale {
  return /-de$/.test(source ?? "") ? "de" : "en";
}

export const ACK_ENABLED = () => process.env.CONTACT_TRAINER_ACK?.trim().toLowerCase() === "on";

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
  html: string;
  headers: Record<string, string>;
};

export function buildAck(to: string, source: string | undefined, from?: string): AckMail {
  const { subject, lines } = ACK_TEXT[ackLocale(source)];
  return {
    to,
    from,
    // Replies reach our own inbox, whatever the sending account is.
    replyTo: ADDRESS,
    subject,
    text: lines.join("\n\n"),
    html: lines.map((l) => `<p style="margin:0 0 12px 0;">${l}</p>`).join(""),
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
