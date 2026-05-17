// =============================================================================
// POST /api/inbox/webhooks/telegram/[channelId]
//
// Per-bot webhook endpoint. The channel's botToken + secretToken live in
// InboxChannel.config (encrypted in the DB layer via the upsertChannel
// caller). Telegram sends `X-Telegram-Bot-Api-Secret-Token` on every call —
// we reject anything that doesn't match the stored secret.
//
// Webhook stays under Telegram's 60s response limit by deferring heavy work
// (Whisper transcription, AI summary regen) to background queues. For now
// those happen synchronously in development; production should move them to
// a worker.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  findChannelByExternalId,
  ingestInbound,
  markChannelError,
} from "@/lib/inbox/repository";
import { toInboundMessage } from "@/lib/inbox/channels/telegram/adapter";
import type { TelegramConfig } from "@/lib/inbox/channels/telegram/client";
import { regenerateThreadAI } from "@/lib/inbox/ai/regenerate";
import { runPlaybooksForTrigger } from "@/lib/inbox/playbooks/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET_HEADER = "x-telegram-bot-api-secret-token";

export async function POST(
  req: Request,
  context: { params: Promise<{ channelId: string }> },
) {
  const { channelId } = await context.params;

  const channel = await prisma.inboxChannel.findUnique({
    where: { id: channelId },
  });
  if (!channel || channel.type !== "telegram") {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }

  const config = (channel.config ?? {}) as Partial<TelegramConfig>;
  if (!config.botToken || !config.secretToken) {
    return NextResponse.json(
      { error: "channel_not_configured" },
      { status: 400 },
    );
  }

  const providedSecret = req.headers.get(SECRET_HEADER);
  if (providedSecret !== config.secretToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const payload = await toInboundMessage(
      config as TelegramConfig,
      channel.externalId ?? channel.id,
      body as Parameters<typeof toInboundMessage>[2],
    );
    if (!payload) {
      // Bot echo, unsupported update — Telegram needs a 200 either way so it
      // doesn't retry.
      return NextResponse.json({ ok: true });
    }

    // Re-find by (type, externalId) so the unique-channel rule is enforced
    // exactly the same way for both this route and the WhatsApp one.
    const resolved =
      (await findChannelByExternalId(
        "telegram",
        channel.externalId ?? channel.id,
      )) ?? channel;

    const { thread, message } = await ingestInbound(
      resolved.userId,
      { id: resolved.id, type: "telegram" },
      payload,
    );

    // Refresh AI fields (summary / sentiment / intent + Whisper transcript
    // if the message carried a voice note). Best-effort: a Claude/Whisper
    // failure must NOT make the webhook 5xx — Telegram retries hard on that.
    try {
      await regenerateThreadAI(thread.id);
    } catch (err) {
      console.warn("[inbox/telegram/webhook] AI regen failed", err);
    }

    // Trigger any active playbooks bound to message.in.
    if (message?.id) {
      try {
        await runPlaybooksForTrigger({
          userId: resolved.userId,
          trigger: "message.in",
          threadId: thread.id,
          messageId: message.id,
        });
      } catch (err) {
        console.warn("[inbox/telegram/webhook] playbook run failed", err);
      }
    }

    return NextResponse.json({
      ok: true,
      threadId: thread.id,
      messageId: message?.id ?? null,
    });
  } catch (err) {
    const description = err instanceof Error ? err.message : String(err);
    await markChannelError(channel.id, description);
    // Always 200 to Telegram — they retry aggressively on non-2xx and there
    // is no recovery path beyond what we've already logged.
    return NextResponse.json({ ok: false, error: description });
  }
}
