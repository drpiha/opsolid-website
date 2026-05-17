// =============================================================================
// POST /api/inbox/webhooks/whatsapp/[channelId]?secret=...
// GET  /api/inbox/webhooks/whatsapp/[channelId]?hub.challenge=...
//
// Inbound WhatsApp (360dialog / Meta Cloud API compatible). GET handles the
// hub.challenge verification handshake; POST handles message + status
// events. Authenticates with the per-channel ?secret stored in
// InboxChannel.config.webhookSecret.
//
// Always 200 to the BSP — non-200 triggers aggressive retries that fill
// our error log without buying anything.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ingestInbound,
  markChannelError,
  markOutboundFailed,
  markOutboundSent,
} from "@/lib/inbox/repository";
import {
  toInboundMessages,
  type WhatsAppWebhookPayload,
} from "@/lib/inbox/channels/whatsapp/adapter";
import type { WhatsAppConfig } from "@/lib/inbox/channels/whatsapp/client";
import { regenerateThreadAI } from "@/lib/inbox/ai/regenerate";
import type { MessageStatus } from "@/lib/inbox/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET — Meta's webhook verification dance. 360dialog forwards this; we have
// to echo the hub.challenge if the verify token matches our channel secret.
// ---------------------------------------------------------------------------
export async function GET(
  req: Request,
  context: { params: Promise<{ channelId: string }> },
) {
  const { channelId } = await context.params;
  const url = new URL(req.url);

  const challenge = url.searchParams.get("hub.challenge");
  const verifyToken = url.searchParams.get("hub.verify_token");
  const secret = url.searchParams.get("secret") ?? verifyToken;

  const channel = await prisma.inboxChannel.findUnique({
    where: { id: channelId },
  });
  if (!channel || channel.type !== "whatsapp") {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }

  const config = (channel.config ?? {}) as { webhookSecret?: string };
  if (!config.webhookSecret || secret !== config.webhookSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return new Response(challenge ?? "ok", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// ---------------------------------------------------------------------------
// POST — actual events
// ---------------------------------------------------------------------------
export async function POST(
  req: Request,
  context: { params: Promise<{ channelId: string }> },
) {
  const { channelId } = await context.params;
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  const channel = await prisma.inboxChannel.findUnique({
    where: { id: channelId },
  });
  if (!channel || channel.type !== "whatsapp") {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }

  const config = (channel.config ?? {}) as Partial<WhatsAppConfig> & {
    webhookSecret?: string;
  };
  if (!config.webhookSecret || secret !== config.webhookSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!config.apiKey || !config.phoneNumberId) {
    return NextResponse.json(
      { error: "channel_not_configured" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" });
  }

  try {
    const { messages, statuses } = await toInboundMessages(
      config as WhatsAppConfig,
      channel.externalId ?? channel.id,
      body as WhatsAppWebhookPayload,
    );

    // Inbound messages → ingest + AI refresh.
    const touchedThreadIds = new Set<string>();
    for (const payload of messages) {
      const { thread } = await ingestInbound(
        channel.userId,
        { id: channel.id, type: "whatsapp" },
        payload,
      );
      touchedThreadIds.add(thread.id);
    }

    // Status callbacks (sent/delivered/read/failed) → update outbound rows.
    for (const status of statuses) {
      const target = await prisma.inboxMessage.findFirst({
        where: { externalId: status.id },
        select: { id: true },
      });
      if (!target) continue;
      if (status.status === "failed") {
        await markOutboundFailed(
          target.id,
          status.errors?.[0]?.title ?? "delivery_failed",
        );
      } else {
        await markOutboundSent(
          target.id,
          status.id,
          status.status as MessageStatus,
        );
      }
    }

    // Refresh AI for every thread we touched. Best-effort.
    const threadIds = Array.from(touchedThreadIds);
    for (const threadId of threadIds) {
      try {
        await regenerateThreadAI(threadId);
      } catch (err) {
        console.warn("[inbox/whatsapp/webhook] AI regen failed", err);
      }
    }

    return NextResponse.json({
      ok: true,
      ingested: messages.length,
      statusesProcessed: statuses.length,
    });
  } catch (err) {
    const description = err instanceof Error ? err.message : String(err);
    await markChannelError(channel.id, description);
    return NextResponse.json({ ok: false, error: description });
  }
}
