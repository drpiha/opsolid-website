import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { getVoiceProvider } from "@/lib/voice/provider";
import {
  processCallEnded,
  logCallEvent,
  createCallFromWebhook,
} from "@/lib/voice/processing";
import type { ParsedWebhookEvent } from "@/lib/voice/provider/types";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// Retell webhook receiver.
//
// Public endpoint — no bearer auth. We verify the HMAC signature against the
// per-tenant webhook secret resolved from the payload, then ack immediately
// and process the event in the background. Stripe-style "ack first, work
// async" pattern: webhooks must respond < 8s or providers retry.
//
// Events handled:
//   - call_started        → upsert VoiceCall (in_progress)
//   - call_ended          → processCallEnded() — runs transcript→summary pipeline
//   - transcript_updated  → append a transcript_segment event row
//   - recording_ready     → set recordingUrl on the call + log event
//   - error               → mark call as failed, capture to Sentry
//
// All work after the ack happens in fire-and-forget Promises wrapped in
// Sentry.captureException — we never await background work.
// -----------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-webhook", provider: "retell", step: "read-body" },
    });
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const headers = Object.fromEntries(req.headers.entries());

  let provider;
  try {
    provider = getVoiceProvider();
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-webhook", provider: "retell", step: "provider-init" },
    });
    return NextResponse.json(
      { error: "Voice provider not configured" },
      { status: 500 },
    );
  }

  // 1) Signature verification — fail closed on any error.
  let sigValid = false;
  try {
    sigValid = provider.verifyWebhookSignature(rawBody, headers);
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-webhook", provider: "retell", step: "signature" },
    });
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
  }
  if (!sigValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2) Parse the event payload.
  let parsed: ParsedWebhookEvent;
  try {
    parsed = provider.parseWebhookEvent(rawBody);
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-webhook", provider: "retell", step: "parse" },
    });
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  // 3) Ack immediately, process async. Background errors → Sentry only.
  void handleRetellWebhookEvent(parsed, rawBody).catch((err) => {
    Sentry.captureException(err, {
      tags: {
        area: "voice-webhook",
        provider: "retell",
        eventType: parsed.type,
      },
      extra: { providerCallId: parsed.providerCallId },
    });
  });

  return NextResponse.json({ received: true });
}

// -----------------------------------------------------------------------------
// Background event handler — runs after we've acked the provider.
// All logic in here must be idempotent: providers retry aggressively.
// -----------------------------------------------------------------------------
async function handleRetellWebhookEvent(
  parsed: ParsedWebhookEvent,
  rawBody: string,
): Promise<void> {
  const { type: eventType, providerCallId } = parsed;

  switch (eventType) {
    case "call_started": {
      await handleCallStarted(parsed);
      break;
    }
    case "call_ended": {
      // processCallEnded is the canonical pipeline (transcript → summary →
      // extracted fields → notifications → usage record).
      let payload: unknown = {};
      try {
        payload = JSON.parse(rawBody);
      } catch {
        // Provider sent non-JSON or rawBody already consumed — pass empty
        // object and let processor refetch from provider if needed.
      }
      await processCallEnded(providerCallId, payload as Record<string, unknown>);
      break;
    }
    case "transcript_updated": {
      const call = await prisma.voiceCall.findUnique({
        where: { providerCallId },
        select: { id: true },
      });
      if (call) {
        await logCallEvent(call.id, "transcript_segment", {
          segments: parsed.partial?.transcriptSegments ?? [],
        });
      }
      break;
    }
    case "recording_ready": {
      const recordingUrl = parsed.partial?.recordingUrl;
      if (!recordingUrl) break;
      const call = await prisma.voiceCall.findUnique({
        where: { providerCallId },
        select: { id: true },
      });
      if (!call) break;
      await prisma.voiceCall.update({
        where: { id: call.id },
        data: { recordingUrl },
      });
      await logCallEvent(call.id, "recording_ready", { recordingUrl });
      break;
    }
    case "error": {
      const call = await prisma.voiceCall.findUnique({
        where: { providerCallId },
        select: { id: true },
      });
      if (call) {
        await prisma.voiceCall.update({
          where: { id: call.id },
          data: {
            status: "failed",
            processingStatus: "failed",
            processingError:
              parsed.errorMessage ?? "Provider reported error",
          },
        });
        await logCallEvent(call.id, "error", parsed.partial ?? {});
      }
      Sentry.captureMessage("Retell webhook error event", {
        level: "error",
        tags: { area: "voice-webhook", provider: "retell" },
        extra: { providerCallId, partial: parsed.partial },
      });
      break;
    }
    default: {
      // Unknown event types are ignored intentionally — providers add events.
      break;
    }
  }
}

// -----------------------------------------------------------------------------
// call_started: resolve the destination phone number → tenant agent, then
// upsert the VoiceCall row in `in_progress` status. Idempotent on retry.
// -----------------------------------------------------------------------------
async function handleCallStarted(parsed: ParsedWebhookEvent): Promise<void> {
  const toNumber = parsed.partial?.toNumber;
  const fromNumber = parsed.partial?.fromNumber ?? "unknown";
  const startedAt = parsed.partial?.startedAt
    ? new Date(parsed.partial.startedAt)
    : new Date();

  if (!toNumber) {
    Sentry.captureMessage("Retell call_started missing toNumber", {
      level: "warning",
      tags: { area: "voice-webhook", provider: "retell" },
      extra: { providerCallId: parsed.providerCallId },
    });
    return;
  }

  const phoneNumber = await prisma.voicePhoneNumber.findUnique({
    where: { e164Number: toNumber },
    select: { id: true, agentId: true },
  });

  if (!phoneNumber || !phoneNumber.agentId) {
    Sentry.captureMessage("Retell call to unmapped phone number", {
      level: "warning",
      tags: { area: "voice-webhook", provider: "retell" },
      extra: { providerCallId: parsed.providerCallId, toNumber },
    });
    return;
  }

  // Prefer the helper if it exists in lib/voice/processing — otherwise upsert
  // directly. The helper centralizes provider-specific normalization.
  try {
    await createCallFromWebhook(parsed.providerCallId, parsed.raw);
    return;
  } catch (err) {
    // Fall through to direct upsert if the helper fails — never drop a call.
    Sentry.captureException(err, {
      tags: { area: "voice-webhook", provider: "retell", step: "createCallFromWebhook" },
      level: "warning",
    });
  }

  await prisma.voiceCall.upsert({
    where: { providerCallId: parsed.providerCallId },
    create: {
      agentId: phoneNumber.agentId,
      phoneNumberId: phoneNumber.id,
      providerCallId: parsed.providerCallId,
      providerName: "retell",
      direction: "inbound",
      fromNumber,
      toNumber,
      status: "in_progress",
      startedAt,
      processingStatus: "pending",
    },
    update: {
      status: "in_progress",
      startedAt,
    },
  });
}
