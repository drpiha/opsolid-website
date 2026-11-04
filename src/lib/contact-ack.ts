// Automatic acknowledgement for trainer applications (owner-approved wording, 2026-11-04).
// Abuse rules: the mail repeats nothing the applicant typed (not even the name), contains no links from applicant input (our own fixed address may be linkified by clients) and is
// never sent more than once per recipient address in 24 hours. It is off unless CONTACT_TRAINER_ACK=on.
// A failed acknowledgement never fails the submission: callers get a boolean and nothing is thrown.

export type AckLocale = "de" | "en";

const SIGN = { de: "Freundliche Grüße", en: "Kind regards" } as const;
const ADDRESS = "info@opsolid.de";

export const ACK_TEXT: Record<AckLocale, { subject: string; lines: string[] }> = {
  de: {
    subject: "Ihre Bewerbung ist eingegangen",
    lines: [
      "Guten Tag,",
      "vielen Dank für Ihre Bewerbung. Sie ist bei uns eingegangen. Wir antworten innerhalb von sieben Tagen. Einsätze entstehen aus Kundenanfragen; wir melden uns, sobald eine Anfrage zu Ihrem Thema passt. Ihre Angaben verwenden wir nur für die Auswahl von Trainerinnen und Trainern und löschen sie auf Wunsch.",
      `${SIGN.de},`,
      `OpSolid, Inh. Hasan Dönmez, ${ADDRESS}`,
    ],
  },
  en: {
    subject: "We have received your application",
    lines: [
      "Hello,",
      "thank you for your application. We have received it and will reply within seven days. Assignments come from client requests; we will contact you when a request fits your topic. We use your details only to select trainers and delete them on request.",
      `${SIGN.en},`,
      `OpSolid, Inh. Hasan Dönmez, ${ADDRESS}`,
    ],
  },
};

/** The form's `source` ends in the page language ("v7-contact-tr"). Turkish applicants get the English text. */
export function ackLocale(source: string | undefined): AckLocale {
  return /-de$/.test(source ?? "") ? "de" : "en";
}

export const ACK_ENABLED = () => process.env.CONTACT_TRAINER_ACK?.trim().toLowerCase() === "on";

const DAY_MS = 24 * 60 * 60_000;
const MAX_KEYS = 10_000;

/** One acknowledgement per recipient address and 24 hours; constant-bounded memory (oldest evicted first). */
export function createAckLimiter(now: () => number = Date.now) {
  const sent = new Map<string, number>();
  return {
    /** True and marks the address when no acknowledgement went out in the last 24 hours. */
    take(address: string): boolean {
      const key = address.trim().toLowerCase();
      const t = now();
      for (let first = sent.entries().next(); !first.done; first = sent.entries().next()) {
        if (t - first.value[1] < DAY_MS && t >= first.value[1]) break;
        sent.delete(first.value[0]);
      }
      if (sent.has(key)) return false;
      if (sent.size >= MAX_KEYS) sent.delete(sent.keys().next().value!);
      sent.set(key, t);
      return true;
    },
    /** Frees the address again after a failed send, so a retry is possible. */
    release(address: string) {
      sent.delete(address.trim().toLowerCase());
    },
  };
}

export const ackLimiter = createAckLimiter();

export type AckMail = { to: string; from?: string; subject: string; text: string; html: string; headers: Record<string, string> };

export function buildAck(to: string, source: string | undefined, from?: string): AckMail {
  const { subject, lines } = ACK_TEXT[ackLocale(source)];
  return {
    to,
    from,
    subject,
    text: lines.join("\n\n"),
    html: lines.map((l) => `<p style="margin:0 0 12px 0;">${l}</p>`).join(""),
    headers: { "Auto-Submitted": "auto-replied" },
  };
}

/**
 * Sends the acknowledgement when the flag is on and the address has not had one in 24 hours.
 * `send` is injected (the route passes the mail client; tests pass a sink). Never throws.
 */
export async function sendTrainerAck(
  args: { to: string; source?: string; from?: string },
  send: (mail: AckMail) => Promise<{ ok: boolean }>,
  limiter: ReturnType<typeof createAckLimiter> = ackLimiter,
): Promise<boolean> {
  if (!ACK_ENABLED()) return false;
  if (!limiter.take(args.to)) return false;
  try {
    const result = await send(buildAck(args.to, args.source, args.from));
    if (!result.ok) limiter.release(args.to);
    return result.ok;
  } catch {
    limiter.release(args.to);
    return false;
  }
}
