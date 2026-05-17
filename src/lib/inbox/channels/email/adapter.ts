// =============================================================================
// Email → InboundMessage adapter
//
// Accepts the union of common inbound email webhook formats — Postmark is
// the primary target (cleanest), with a manual contact-form path for the
// V1 fallback when no inbound provider is configured.
//
// Thread matching follows email conventions:
//   - If the inbound carries an In-Reply-To or References that matches an
//     existing InboxMessage.externalId, we route into that thread.
//   - Otherwise we open a new thread keyed on the cleaned subject + sender.
//
// We strip quoted history (the "On … wrote:" tail) by clipping at the first
// reply marker the user's mail client added. Cheap heuristic, good enough
// for v1.
// =============================================================================

import { prisma } from "@/lib/prisma";
import type { InboundMessage } from "../../types";

export interface PostmarkInbound {
  MessageID: string;
  From: string;
  FromName?: string;
  FromFull?: { Email: string; Name?: string };
  To: string;
  ToFull?: Array<{ Email: string; Name?: string }>;
  Subject: string;
  TextBody?: string;
  HtmlBody?: string;
  StrippedTextReply?: string;
  Headers?: Array<{ Name: string; Value: string }>;
  Date: string;
}

export interface SimpleInboundEmail {
  fromEmail: string;
  fromName?: string;
  toEmail: string;
  subject: string;
  body: string;
  inReplyToHeader?: string | null;
  receivedAt?: Date;
}

const REPLY_MARKERS = [
  /^On .+ wrote:$/m,
  /^Am .+ schrieb .+:$/m,
  /^Le .+ écrit .+:$/m,
  /^-{2,}\s*Original Message\s*-{2,}/im,
];

function stripQuotedHistory(body: string): string {
  let earliest = body.length;
  for (const marker of REPLY_MARKERS) {
    const match = body.match(marker);
    if (match?.index !== undefined && match.index < earliest) {
      earliest = match.index;
    }
  }
  return body.slice(0, earliest).trim();
}

function normalizeSubject(subject: string): string {
  return subject
    .replace(/^(?:re|fwd|fw|aw|wg|tr|antw):\s*/gi, "")
    .trim()
    .toLowerCase();
}

function findHeader(
  headers: PostmarkInbound["Headers"],
  name: string,
): string | undefined {
  if (!headers) return undefined;
  const found = headers.find(
    (h) => h.Name.toLowerCase() === name.toLowerCase(),
  );
  return found?.Value;
}

/**
 * Try to match an inbound email into an existing thread by walking the
 * In-Reply-To / References chain until we find a message whose externalId
 * we have on file.
 */
export async function findExistingThreadId(
  inReplyTo: string | null | undefined,
  references: string | null | undefined,
): Promise<string | null> {
  const candidates: string[] = [];
  if (inReplyTo) candidates.push(inReplyTo.replace(/[<>]/g, "").trim());
  if (references) {
    references
      .split(/\s+/)
      .map((id) => id.replace(/[<>]/g, "").trim())
      .filter(Boolean)
      .forEach((id) => candidates.push(id));
  }
  if (!candidates.length) return null;

  const existing = await prisma.inboxMessage.findFirst({
    where: { externalId: { in: candidates } },
    orderBy: { createdAt: "desc" },
    select: { threadId: true },
  });
  return existing?.threadId ?? null;
}

export async function fromPostmark(
  externalChannelId: string,
  payload: PostmarkInbound,
): Promise<InboundMessage & { suggestedThreadId: string | null }> {
  const inReplyTo = findHeader(payload.Headers, "In-Reply-To") ?? null;
  const references = findHeader(payload.Headers, "References") ?? null;

  const existingThreadId = await findExistingThreadId(inReplyTo, references);

  const fromEmail = payload.FromFull?.Email ?? payload.From;
  const fromName =
    payload.FromFull?.Name ?? payload.FromName ?? fromEmail.split("@")[0];

  const body =
    payload.StrippedTextReply ??
    (payload.TextBody ? stripQuotedHistory(payload.TextBody) : null) ??
    payload.HtmlBody ??
    null;

  return {
    channelType: "email",
    externalChannelId,
    externalThreadId:
      existingThreadId ?? `subject:${normalizeSubject(payload.Subject)}:${fromEmail}`,
    externalMessageId: payload.MessageID,
    contactHandle: fromEmail,
    contactName: fromName,
    contactLocale: null,
    body,
    mediaUrls: [],
    voiceUrl: null,
    voiceTranscript: null,
    language: null,
    receivedAt: new Date(payload.Date),
    suggestedThreadId: existingThreadId,
  };
}

export function fromContactForm(
  externalChannelId: string,
  msg: SimpleInboundEmail,
): InboundMessage {
  return {
    channelType: "email",
    externalChannelId,
    externalThreadId: `form:${msg.fromEmail}:${normalizeSubject(msg.subject)}`,
    externalMessageId: `form-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    contactHandle: msg.fromEmail,
    contactName: msg.fromName ?? msg.fromEmail.split("@")[0],
    contactLocale: null,
    body: msg.body,
    mediaUrls: [],
    voiceUrl: null,
    voiceTranscript: null,
    language: null,
    receivedAt: msg.receivedAt ?? new Date(),
  };
}
