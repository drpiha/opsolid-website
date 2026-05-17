// =============================================================================
// POST /api/inbox/webhooks/email/[channelId]?secret=...
//
// Receives inbound email from Postmark's inbound stream (or any provider
// posting the same JSON shape). Authenticates via per-channel ?secret in
// the URL — Postmark doesn't sign payloads, so the secret is what proves
// "this came from the provider we set up".
//
// Returns 200 even on parse errors so the provider doesn't retry into a
// poison loop; the error gets logged to the channel.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ingestInbound,
  markChannelError,
} from "@/lib/inbox/repository";
import {
  fromPostmark,
  type PostmarkInbound,
} from "@/lib/inbox/channels/email/adapter";
import { regenerateThreadAI } from "@/lib/inbox/ai/regenerate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if (!channel || channel.type !== "email") {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }

  const config = (channel.config ?? {}) as {
    webhookSecret?: string;
    inboxEmail?: string;
  };
  if (!config.webhookSecret || secret !== config.webhookSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const payload = await fromPostmark(
      channel.externalId ?? channel.id,
      raw as PostmarkInbound,
    );

    const { thread, message } = await ingestInbound(
      channel.userId,
      { id: channel.id, type: "email" },
      payload,
    );

    try {
      await regenerateThreadAI(thread.id);
    } catch (err) {
      console.warn("[inbox/email/webhook] AI regen failed", err);
    }

    return NextResponse.json({
      ok: true,
      threadId: thread.id,
      messageId: message?.id ?? null,
    });
  } catch (err) {
    const description = err instanceof Error ? err.message : String(err);
    await markChannelError(channel.id, description);
    return NextResponse.json({ ok: false, error: description });
  }
}
