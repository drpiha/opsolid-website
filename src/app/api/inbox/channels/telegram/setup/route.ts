// =============================================================================
// POST /api/inbox/channels/telegram/setup
//
// Connect a Telegram bot to a user's inbox.
//
// Body: { botToken: string, label?: string, baseUrl?: string }
//   botToken — from @BotFather; the user keeps full ownership of the bot
//   label    — optional human label shown in the inbox channel list
//   baseUrl  — overrides NEXT_PUBLIC_SITE_URL during local tunneling tests
//
// Flow:
// 1. Auth user
// 2. Validate token with getMe — proves the token works, gives us bot id
// 3. Generate random secret_token (Telegram echoes this header on every webhook)
// 4. Upsert InboxChannel (type=telegram, externalId=bot id) with config
// 5. Set Telegram webhook to /api/inbox/webhooks/telegram/{channelId}
// 6. Return the channel
//
// If steps 4–5 fail we don't roll back the InboxChannel — the user can hit
// setup again and we upsert + retry. Token only ever lives in the DB.
// =============================================================================

import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import {
  upsertChannel,
  markChannelError,
  ChannelOwnershipError,
} from "@/lib/inbox/repository";
import {
  getMe,
  setWebhook,
  TelegramApiError,
} from "@/lib/inbox/channels/telegram/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  let body: { botToken?: string; label?: string; baseUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const botToken = body.botToken?.trim();
  if (!botToken || !/^[0-9]+:[A-Za-z0-9_-]{20,}$/.test(botToken)) {
    return NextResponse.json({ error: "invalid_bot_token" }, { status: 400 });
  }

  // Validate the token before we commit anything.
  let bot;
  try {
    bot = await getMe({ botToken });
  } catch (err) {
    if (err instanceof TelegramApiError) {
      return NextResponse.json(
        { error: "telegram_rejected", description: err.description },
        { status: 400 },
      );
    }
    throw err;
  }

  const secretToken = randomBytes(24).toString("hex");

  let channel;
  try {
    channel = await upsertChannel({
      userId: user.id,
      type: "telegram",
      externalId: String(bot.id),
      label: body.label ?? `@${bot.username}`,
      config: {
        botToken,
        secretToken,
        botUsername: bot.username,
        botId: bot.id,
      },
    });
  } catch (err) {
    if (err instanceof ChannelOwnershipError) {
      return NextResponse.json(
        {
          error: "channel_taken",
          description: "This bot is already connected to another account.",
        },
        { status: 409 },
      );
    }
    throw err;
  }

  const baseUrl =
    body.baseUrl?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://opsolid.de";
  const webhookUrl = `${baseUrl}/api/inbox/webhooks/telegram/${channel.id}`;

  try {
    await setWebhook({ botToken }, webhookUrl, secretToken);
  } catch (err) {
    const description =
      err instanceof TelegramApiError ? err.description : String(err);
    await markChannelError(channel.id, `setWebhook failed: ${description}`);
    return NextResponse.json(
      {
        error: "webhook_setup_failed",
        description,
        channelId: channel.id,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    channelId: channel.id,
    botUsername: bot.username,
    webhookUrl,
  });
}
