// =============================================================================
// GET /api/inbox/threads
//
// List the authenticated user's threads. Powers the inbox center pane.
//
// Query params:
//   status      — open | snoozed | closed | archived | all  (default: open)
//   channelType — whatsapp | telegram | email | voice | web | card_action | all
//   limit       — max 200 (default: 50)
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { listThreads } from "@/lib/inbox/repository";
import type { ChannelType, ThreadStatus } from "@/lib/inbox/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = new Set([
  "open",
  "snoozed",
  "closed",
  "archived",
  "all",
]);

const VALID_CHANNEL = new Set([
  "whatsapp",
  "telegram",
  "email",
  "voice",
  "web",
  "card_action",
  "all",
]);

export async function GET(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "open";
  const channelType = url.searchParams.get("channelType") ?? "all";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);

  if (!VALID_STATUS.has(status)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }
  if (!VALID_CHANNEL.has(channelType)) {
    return NextResponse.json({ error: "invalid_channel_type" }, { status: 400 });
  }

  const threads = await listThreads({
    userId: user.id,
    status: status as ThreadStatus | "all",
    channelType: channelType as ChannelType | "all",
    limit,
  });

  return NextResponse.json({
    threads: threads.map((t) => ({
      id: t.id,
      channel: t.channel,
      channelType: t.channelType,
      contactName: t.contactName,
      contactHandle: t.contactHandle,
      contactLocale: t.contactLocale,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      unreadCount: t.unreadCount,
      tags: t.tags,
      aiSummary: t.aiSummary,
      aiSentiment: t.aiSentiment,
      aiIntent: t.aiIntent,
      aiUpdatedAt: t.aiUpdatedAt,
      lastMessageAt: t.lastMessageAt,
      lastMessage: t.messages[0]
        ? {
            id: t.messages[0].id,
            body:
              t.messages[0].body ??
              t.messages[0].voiceTranscript ??
              null,
            direction: t.messages[0].direction,
            sentBy: t.messages[0].sentBy,
            createdAt: t.messages[0].createdAt,
          }
        : null,
    })),
  });
}
