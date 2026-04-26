// Post-call processing pipeline — claim, enrich, extract, route, notify, account.

import * as Sentry from "@sentry/nextjs";
import { Prisma } from "@/generated/prisma";
import type {
  VoiceAgent,
  VoiceCall,
  VoiceTenant,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getVoiceProvider } from "./provider";
import {
  notifyCallCompleted,
  type ExtractedCallFields,
} from "./notifications";
import { formatBillingMonth } from "./analytics";

type CallWithRelations = VoiceCall & {
  agent: VoiceAgent & { tenant: VoiceTenant };
};

// ---------------------------------------------------------------------------
// Top-level entry point.
// ---------------------------------------------------------------------------

/**
 * Process a finished call. Idempotent: races are resolved by an atomic
 * "claim" updateMany on processingStatus. The first worker to flip
 * pending → processing wins; the rest no-op.
 *
 * On failure: marks the call as failed and stores the error message;
 * captures the exception to Sentry. We never re-throw — the webhook
 * surface should ack the provider regardless of our processing outcome.
 */
export async function processCallEnded(
  providerCallId: string,
  rawPayload: Record<string, unknown>,
): Promise<void> {
  // 1. Locate or create the call row.
  let call = await loadCall(providerCallId);
  if (!call) {
    await createCallFromWebhook(providerCallId, rawPayload);
    call = await loadCall(providerCallId);
    if (!call) {
      // Could not resolve agent/phone mapping — log and bail.
      Sentry.captureMessage(
        `processCallEnded: could not create call row for providerCallId=${providerCallId}`,
        { level: "warning", tags: { surface: "voice.processing" } },
      );
      return;
    }
  }

  // 2. Skip if already done.
  if (call.processingStatus === "done") return;

  // 3. Atomically claim the row.
  const claim = await prisma.voiceCall.updateMany({
    where: { id: call.id, processingStatus: "pending" },
    data: { processingStatus: "processing" },
  });
  if (claim.count === 0) {
    // Another worker holds the claim, or status moved past pending.
    return;
  }

  try {
    await runProcessingPipeline(call, rawPayload);

    await prisma.voiceCall.update({
      where: { id: call.id },
      data: { processingStatus: "done", processingError: null },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.voiceCall
      .update({
        where: { id: call.id },
        data: {
          processingStatus: "failed",
          processingError: message.slice(0, 500),
        },
      })
      .catch(() => {
        /* status bookkeeping is best-effort */
      });
    Sentry.captureException(err, {
      tags: {
        surface: "voice.processing",
        callId: call.id,
        providerCallId,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Internal pipeline.
// ---------------------------------------------------------------------------

async function runProcessingPipeline(
  initialCall: CallWithRelations,
  rawPayload: Record<string, unknown>,
): Promise<void> {
  const provider = getVoiceProvider();

  // 3a. Pull the canonical call object from the provider.
  const summary = await provider.getCall(initialCall.providerCallId);

  // 3b. Persist provider snapshot.
  await prisma.voiceCall.update({
    where: { id: initialCall.id },
    data: {
      status: summary.status,
      durationSeconds: summary.durationSeconds ?? initialCall.durationSeconds,
      recordingUrl: summary.recordingUrl ?? initialCall.recordingUrl,
      transcriptJson:
        summary.transcriptSegments.length > 0
          ? (summary.transcriptSegments as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      transcriptText:
        summary.transcriptText ?? initialCall.transcriptText,
      sentiment: summary.sentiment ?? initialCall.sentiment,
      detectedLanguage:
        summary.detectedLanguage ?? initialCall.detectedLanguage,
      endedAt: summary.endedAt ?? initialCall.endedAt,
      startedAt: summary.startedAt ?? initialCall.startedAt,
      costUnits: summary.costUnits ?? initialCall.costUnits,
    },
  });

  // 3c. Audit event.
  await logCallEvent(initialCall.id, "webhook_received", {
    providerCallId: initialCall.providerCallId,
    status: summary.status,
    payload: rawPayload,
  });

  // 3d. Field extraction.
  const businessCategory = initialCall.agent.tenant.businessCategory;
  const extracted = extractStructuredFields(
    summary.transcriptText,
    businessCategory,
  );

  // Merge any provider-side analysis fields (e.g. Retell custom_analysis_data).
  const merged: ExtractedCallFields = {
    ...extracted,
    ...(summary.customAnalysisFields as ExtractedCallFields),
  };
  if (
    !merged.summary &&
    typeof summary.customAnalysisFields?.summary === "string"
  ) {
    merged.summary = summary.customAnalysisFields.summary as string;
  }

  // Reload the call with fresh data so the rest of the pipeline sees what we
  // just stored (recording, transcript, etc.).
  await prisma.voiceCall.update({
    where: { id: initialCall.id },
    data: {
      extractedFields: merged as unknown as Prisma.InputJsonValue,
      callerName: merged.name ?? null,
      callerEmail: merged.email ?? null,
      callerPhone: merged.phone ?? initialCall.fromNumber,
      outcomeType: merged.outcomeType ?? "info_provided",
      summaryText: merged.summary ?? initialCall.summaryText,
    },
  });

  const refreshed = await prisma.voiceCall.findUnique({
    where: { id: initialCall.id },
    include: { agent: { include: { tenant: true } } },
  });
  if (!refreshed) return;

  // 3e. Outcome routing.
  const outcome = refreshed.outcomeType ?? "info_provided";
  if (outcome === "appointment_booked") {
    await handleAppointmentRequest(refreshed, merged);
  } else if (outcome === "order_placed") {
    await handleOrderPlaced(refreshed, merged);
  } else if (outcome === "callback_requested") {
    await handleCallbackRequest(refreshed, merged);
  }

  // 3f. Notifications (always fire on call_ended; subscribers filter triggers).
  const notifConfigs = await prisma.voiceNotificationConfig.findMany({
    where: { tenantId: refreshed.agent.tenantId, isActive: true },
  });
  await notifyCallCompleted(refreshed, merged, notifConfigs);

  // 3g. Usage record (idempotent upsert).
  await upsertUsageRecord(refreshed);
}

// ---------------------------------------------------------------------------
// Helpers — call hydration, event log, usage rollup.
// ---------------------------------------------------------------------------

async function loadCall(providerCallId: string): Promise<CallWithRelations | null> {
  return prisma.voiceCall.findUnique({
    where: { providerCallId },
    include: { agent: { include: { tenant: true } } },
  });
}

/**
 * Create a minimal VoiceCall row from a webhook payload when none exists.
 * Resolves the agent by mapping the inbound phone number to a VoicePhoneNumber
 * row, then to its agent. If we cannot resolve an agent, we skip — the
 * caller should re-check after creation.
 */
export async function createCallFromWebhook(
  providerCallId: string,
  raw: Record<string, unknown>,
): Promise<void> {
  const callObj =
    (raw.call as Record<string, unknown> | undefined) ??
    (raw.data as Record<string, unknown> | undefined) ??
    raw;

  const fromNumber = (callObj.from_number as string | undefined) ?? "";
  const toNumber = (callObj.to_number as string | undefined) ?? "";
  const direction = (callObj.direction as string | undefined) ?? "inbound";
  const explicitProvider =
    (callObj.provider as string | undefined) ??
    (raw.provider as string | undefined);
  const providerName: string =
    explicitProvider ??
    (process.env.RETELL_API_KEY
      ? "retell"
      : process.env.VAPI_API_KEY
        ? "vapi"
        : "mock");

  // Resolve agent via the dialed number (inbound) or origin (outbound).
  const lookupNumber = direction === "outbound" ? fromNumber : toNumber;
  let phoneRow = lookupNumber
    ? await prisma.voicePhoneNumber.findUnique({
        where: { e164Number: lookupNumber },
        include: { agent: true },
      })
    : null;

  // Fall back: try the agent ID directly if the provider supplied it.
  let agentId = phoneRow?.agentId ?? null;
  const providerAgentId =
    (callObj.agent_id as string | undefined) ?? null;
  if (!agentId && providerAgentId) {
    const agent = await prisma.voiceAgent.findUnique({
      where: { providerAgentId },
    });
    agentId = agent?.id ?? null;
    if (agent && !phoneRow && lookupNumber) {
      // Best-effort phone mapping for the next call.
      phoneRow = null;
    }
  }

  if (!agentId) {
    // No agent we can attribute this call to; nothing to insert.
    Sentry.captureMessage(
      `createCallFromWebhook: cannot resolve agent for providerCallId=${providerCallId}`,
      { level: "warning", tags: { surface: "voice.processing" } },
    );
    return;
  }

  const startedAtRaw = callObj.start_timestamp;
  const endedAtRaw = callObj.end_timestamp;
  const status = (callObj.call_status as string | undefined) ?? "ended";

  await prisma.voiceCall
    .create({
      data: {
        providerCallId,
        providerName,
        agentId,
        phoneNumberId: phoneRow?.id ?? null,
        direction: direction === "outbound" ? "outbound" : "inbound",
        fromNumber,
        toNumber,
        status: mapStatus(status),
        startedAt:
          typeof startedAtRaw === "number"
            ? new Date(startedAtRaw)
            : null,
        endedAt:
          typeof endedAtRaw === "number" ? new Date(endedAtRaw) : null,
        processingStatus: "pending",
      },
    })
    .catch((err: unknown) => {
      // Unique constraint on providerCallId may race; that's fine.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return;
      }
      throw err;
    });
}

function mapStatus(raw: string): string {
  switch (raw) {
    case "registered":
      return "ringing";
    case "ongoing":
      return "in_progress";
    case "ended":
      return "ended";
    case "error":
      return "failed";
    default:
      return raw;
  }
}

/**
 * Append a row to VoiceCallEvent. Fire-and-forget — failures are swallowed
 * (logged to Sentry) so audit-log issues never block the main pipeline.
 */
export async function logCallEvent(
  callId: string,
  eventType: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.voiceCallEvent.create({
      data: {
        callId,
        eventType,
        payload: payload as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { surface: "voice.processing.logCallEvent", eventType, callId },
    });
  }
}

async function upsertUsageRecord(call: CallWithRelations): Promise<void> {
  const duration = call.durationSeconds ?? 0;
  const billable = duration > 0 ? Math.ceil(duration / 60) : 0;
  const month = formatBillingMonth(
    call.startedAt ?? call.endedAt ?? new Date(),
  );

  await prisma.voiceUsageRecord.upsert({
    where: { callId: call.id },
    create: {
      tenantId: call.agent.tenantId,
      callId: call.id,
      billingMonth: month,
      durationSeconds: duration,
      billableMinutes: billable,
      costUnits: call.costUnits ?? 0,
      overageUnits: 0,
      overageCents: 0,
    },
    update: {
      billingMonth: month,
      durationSeconds: duration,
      billableMinutes: billable,
      costUnits: call.costUnits ?? 0,
    },
  });
}

// ---------------------------------------------------------------------------
// Lightweight regex+heuristic field extraction.
// ---------------------------------------------------------------------------

const PHONE_RE =
  /(\+?\d[\s.\-/]?){8,16}\d/g;
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const PARTY_SIZE_RE =
  /(?:für|for|table for|tisch für|reservation for|reservierung für|wir sind|we are)\s+(\d{1,2})\s*(?:personen|people|persons|leute|guests|gäste|pax)?/i;
const TIME_RE =
  /\b(0?\d|1\d|2[0-3])\s*(?::|\.|\s)\s*([0-5]\d)?\s*(uhr|am|pm|h)?\b/i;
const DATE_DE_RE =
  /\b(0?[1-9]|[12]\d|3[01])\.\s*(0?[1-9]|1[0-2])\.\s*(20\d{2})?\b/;
const DATE_ISO_RE = /\b(20\d{2})-([01]\d)-([0-3]\d)\b/;

// Latin letter class incl. German + common European diacritics, no `u` flag
// (kept ES5-compatible). À-ɏ covers Latin-1 + Latin Extended-A/B,
// which captures ä ö ü ß ı ş ğ ç plus most other accented forms we expect.
const LATIN_LETTER = "A-Za-z\\u00c0-\\u024f";
const NAME_INTRO_RE = new RegExp(
  "(?:mein name ist|ich hei\\u00dfe|ich bin|der name ist|name is|i'?m|this is|name lautet)\\s+" +
    `([${LATIN_LETTER}][${LATIN_LETTER}\\-']{1,30}(?:\\s+[${LATIN_LETTER}][${LATIN_LETTER}\\-']{1,30}){0,2})`,
  "i",
);

const ADDRESS_RE =
  /\b(\d{1,4})\s+([A-Za-zÄÖÜäöüß'\.\-]+(?:\s+[A-Za-zÄÖÜäöüß'\.\-]+){0,4})\b/;

/**
 * Extract a best-effort set of structured fields from a transcript using
 * regex + keyword heuristics. No LLM call — fast, deterministic, and good
 * enough for routing + email summaries. The provider's own analysis fields
 * are merged on top of this in the pipeline.
 */
export function extractStructuredFields(
  transcriptText: string | null | undefined,
  businessCategory: string | null | undefined,
): ExtractedCallFields {
  const out: ExtractedCallFields = {
    name: null,
    phone: null,
    email: null,
    intent: null,
    requestedDate: null,
    requestedTime: null,
    service: null,
    partySize: null,
    orderItems: null,
    address: null,
    urgency: null,
    nextAction: null,
    summary: null,
    outcomeType: null,
  };

  if (!transcriptText) {
    out.outcomeType = inferOutcome("", businessCategory);
    return out;
  }

  const text = transcriptText;
  const lower = text.toLowerCase();

  // Email — first match wins.
  const emailMatch = text.match(EMAIL_RE);
  if (emailMatch && emailMatch[0]) out.email = emailMatch[0].toLowerCase();

  // Phone — pick the longest digit-rich match (more likely full number).
  const phoneMatches = text.match(PHONE_RE);
  if (phoneMatches && phoneMatches.length > 0) {
    const best = phoneMatches
      .map((p) => p.replace(/[^\d+]/g, ""))
      .filter((p) => p.replace(/\D/g, "").length >= 7)
      .sort((a, b) => b.length - a.length)[0];
    if (best) out.phone = best;
  }

  // Name (heuristic — "mein Name ist X").
  const nameMatch = text.match(NAME_INTRO_RE);
  if (nameMatch && nameMatch[1]) out.name = nameMatch[1].trim();

  // Date — prefer ISO, fall back to DE format.
  const isoDate = text.match(DATE_ISO_RE);
  if (isoDate) {
    out.requestedDate = `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  } else {
    const deDate = text.match(DATE_DE_RE);
    if (deDate) {
      const day = deDate[1].padStart(2, "0");
      const month = deDate[2].padStart(2, "0");
      const year =
        deDate[3] ?? new Date().getUTCFullYear().toString();
      out.requestedDate = `${year}-${month}-${day}`;
    } else if (/\bmorgen\b|\btomorrow\b/i.test(lower)) {
      out.requestedDate = isoDateOffset(1);
    } else if (/\bübermorgen\b|\bday after tomorrow\b/i.test(lower)) {
      out.requestedDate = isoDateOffset(2);
    }
  }

  // Time.
  const timeMatch = text.match(TIME_RE);
  if (timeMatch) {
    const h = parseInt(timeMatch[1], 10);
    const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      let hour = h;
      const suffix = (timeMatch[3] ?? "").toLowerCase();
      if (suffix === "pm" && hour < 12) hour += 12;
      if (suffix === "am" && hour === 12) hour = 0;
      out.requestedTime = `${hour.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
    }
  }

  // Party size (restaurant + hotel relevant).
  const partyMatch = text.match(PARTY_SIZE_RE);
  if (partyMatch && partyMatch[1]) {
    const n = parseInt(partyMatch[1], 10);
    if (n > 0 && n < 100) out.partySize = n;
  }

  // Address (rough: <number> <words>).
  const addrMatch = text.match(ADDRESS_RE);
  if (addrMatch) out.address = `${addrMatch[1]} ${addrMatch[2]}`;

  // Urgency.
  if (/\bnotfall\b|\bemergency\b|\bdringend\b|\burgent\b|\bsofort\b|\basap\b/i.test(text)) {
    out.urgency = "high";
  } else if (/\bnächste woche\b|\bnext week\b|\birgendwann\b|\bany time\b/i.test(text)) {
    out.urgency = "low";
  }

  // Order items — best-effort: count "X stück" / "X mal" / numeric+noun.
  if (businessCategory === "restaurant") {
    const itemRe = new RegExp(
      `(\\d{1,2})\\s*(?:x|mal|st\\u00fcck)?\\s+([${LATIN_LETTER}][${LATIN_LETTER}\\- ]{2,40})`,
      "gi",
    );
    const items: Array<{ name: string; qty: number }> = [];
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(text)) !== null) {
      const qty = parseInt(m[1], 10);
      const name = m[2].trim().replace(/\s+/g, " ");
      if (qty > 0 && qty < 30 && name.length > 2 && name.length < 60) {
        items.push({ name, qty });
      }
      if (items.length >= 20) break;
    }
    if (items.length > 0) out.orderItems = items;
  }

  // Outcome inference.
  out.outcomeType = inferOutcome(lower, businessCategory);

  // Fallback summary: first 240 chars of agent's last turn or the transcript.
  out.summary = buildHeuristicSummary(text);

  // Intent label: a one-word-ish hint.
  out.intent = out.outcomeType;

  // Service derivation for appointment-style callers.
  if (out.outcomeType === "appointment_booked") {
    out.service = inferService(lower, businessCategory);
  }

  return out;
}

function inferOutcome(
  lowerText: string,
  category: string | null | undefined,
): string {
  if (!lowerText) return "info_provided";

  const transferred =
    /\b(weiterleit|transferiert|transfer|verbinde sie|put you through)\b/i.test(
      lowerText,
    );
  if (transferred) return "transferred";

  const callback =
    /\b(rückruf|rufen sie zurück|call you back|callback|melde mich später|call me back)\b/i.test(
      lowerText,
    );
  if (callback) return "callback_requested";

  const orderHints =
    category === "restaurant" &&
    /\b(bestellung|bestellen|liefer|abholung|pickup|order|delivery)\b/i.test(
      lowerText,
    );
  if (orderHints) return "order_placed";

  const apptHints =
    /\b(termin|reservier|reservation|appointment|book(ing)?|tisch|table|zimmer|room)\b/i.test(
      lowerText,
    );
  if (apptHints) return "appointment_booked";

  return "info_provided";
}

function inferService(
  lowerText: string,
  category: string | null | undefined,
): string | null {
  if (category === "restaurant") {
    if (/\btisch|table\b/.test(lowerText)) return "table_reservation";
    if (/\bbestell|order\b/.test(lowerText)) return "food_order";
  }
  if (category === "hotel") {
    if (/\bzimmer|room\b/.test(lowerText)) return "room_reservation";
  }
  if (category === "clinic") {
    if (/\berstter|first visit|new patient\b/.test(lowerText)) return "first_visit";
    if (/\bnachsorge|follow.?up\b/.test(lowerText)) return "follow_up";
    if (/\bimpf|vaccin\b/.test(lowerText)) return "vaccination";
  }
  return null;
}

function buildHeuristicSummary(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 240) return cleaned;
  return `${cleaned.slice(0, 237)}...`;
}

function isoDateOffset(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ---------------------------------------------------------------------------
// Outcome handlers (no-API fallbacks).
// Real Cal.com booking lives behind a feature flag + integration.
// ---------------------------------------------------------------------------

async function handleAppointmentRequest(
  call: CallWithRelations,
  extracted: ExtractedCallFields,
): Promise<void> {
  const tenantId = call.agent.tenantId;

  const integration = await prisma.voiceIntegration.findFirst({
    where: {
      tenantId,
      status: "active",
      integrationType: { in: ["cal_com", "email_only"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (integration?.integrationType === "cal_com") {
    const ok = await tryCalComBooking(integration, call, extracted);
    if (ok) {
      await logCallEvent(call.id, "appointment_created", {
        provider: "cal_com",
        date: extracted.requestedDate,
        time: extracted.requestedTime,
      });
      return;
    }
    // Fall through to email/Telegram fallback if Cal.com call failed.
  }

  await logCallEvent(call.id, "appointment_created", {
    provider: "email_fallback",
    date: extracted.requestedDate,
    time: extracted.requestedTime,
    name: extracted.name,
    phone: extracted.phone,
  });
}

async function tryCalComBooking(
  integration: { credentialsJson: Prisma.JsonValue; configJson: Prisma.JsonValue },
  call: CallWithRelations,
  extracted: ExtractedCallFields,
): Promise<boolean> {
  const creds = (integration.credentialsJson ?? {}) as Record<string, unknown>;
  const config = (integration.configJson ?? {}) as Record<string, unknown>;
  const apiKey = typeof creds.apiKey === "string" ? creds.apiKey : "";
  const eventTypeId =
    typeof config.eventTypeId === "number" ? config.eventTypeId : null;
  if (!apiKey || !eventTypeId) return false;

  if (!extracted.requestedDate) return false;

  const time = extracted.requestedTime ?? "10:00";
  const startISO = `${extracted.requestedDate}T${time}:00`;
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return false;

  const end = new Date(start.getTime() + 30 * 60 * 1000);

  const body = {
    eventTypeId,
    start: start.toISOString(),
    end: end.toISOString(),
    responses: {
      name: extracted.name ?? "Voice caller",
      email: extracted.email ?? `voice-${call.id}@example.invalid`,
      notes: extracted.summary ?? "",
    },
    timeZone: call.agent.tenant.timezone,
    language: "de",
    metadata: { voiceCallId: call.id },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      `https://api.cal.com/v2/bookings?apiKey=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );
    return res.ok;
  } catch (err) {
    Sentry.captureException(err, {
      tags: { surface: "voice.processing.calcom", callId: call.id },
    });
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function handleOrderPlaced(
  call: CallWithRelations,
  extracted: ExtractedCallFields,
): Promise<void> {
  await logCallEvent(call.id, "order_created", {
    items: extracted.orderItems ?? [],
    name: extracted.name,
    phone: extracted.phone,
    address: extracted.address,
  });
}

async function handleCallbackRequest(
  call: CallWithRelations,
  extracted: ExtractedCallFields,
): Promise<void> {
  await logCallEvent(call.id, "notification_sent", {
    type: "callback_request",
    name: extracted.name,
    phone: extracted.phone ?? call.fromNumber,
    urgency: extracted.urgency ?? "normal",
  });
}
