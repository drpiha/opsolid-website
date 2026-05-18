// =============================================================================
// Inbox v2 — Prisma repository
//
// Channel-agnostic CRUD over InboxChannel / InboxThread / InboxMessage.
// Webhook handlers call `ingestInbound` with the normalized payload returned
// by the channel adapter; the UI calls `listThreads` / `getThread` etc.
//
// Reasons this exists as its own layer:
// 1. Webhooks and outbound senders never touch Prisma directly — easier to
//    swap or mock for tests.
// 2. AI triggers (summary / suggestion regen) live in one place (ingestInbound
//    enqueues them) instead of being duplicated in every adapter.
// 3. The "upsert channel + upsert thread + create message" sequence has
//    de-dupe rules that must be consistent across channels.
// =============================================================================

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  ChannelType,
  ChannelStatus,
  InboundMessage,
  MessageDirection,
  MessageSentBy,
  MessageStatus,
  ThreadStatus,
} from "./types";

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

export async function upsertChannel(params: {
  userId: string;
  type: ChannelType;
  externalId: string;
  label?: string | null;
  config?: Record<string, unknown> | null;
}) {
  const config = (params.config ?? undefined) as
    | Prisma.InputJsonValue
    | undefined;
  return prisma.inboxChannel.upsert({
    where: {
      type_externalId: { type: params.type, externalId: params.externalId },
    },
    create: {
      userId: params.userId,
      type: params.type,
      externalId: params.externalId,
      label: params.label ?? null,
      config,
    },
    update: {
      label: params.label ?? undefined,
      config,
      status: "active",
      lastErrorAt: null,
      lastError: null,
    },
  });
}

export async function findChannelByExternalId(
  type: ChannelType,
  externalId: string,
) {
  return prisma.inboxChannel.findUnique({
    where: { type_externalId: { type, externalId } },
  });
}

export async function listChannelsForUser(userId: string) {
  return prisma.inboxChannel.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function markChannelError(channelId: string, message: string) {
  await prisma.inboxChannel.update({
    where: { id: channelId },
    data: {
      status: "error",
      lastErrorAt: new Date(),
      lastError: message.slice(0, 1000),
    },
  });
}

export async function setChannelStatus(channelId: string, status: ChannelStatus) {
  await prisma.inboxChannel.update({
    where: { id: channelId },
    data: { status },
  });
}

/**
 * Ownership-scoped channel update — used by the Settings UI. Returns the
 * Prisma updateMany count so the API can distinguish 404 vs 200.
 */
export async function updateChannelForUser(
  userId: string,
  channelId: string,
  patch: { status?: ChannelStatus; label?: string | null },
) {
  return prisma.inboxChannel.updateMany({
    where: { id: channelId, userId },
    data: patch,
  });
}

/**
 * Cascade-deletes the channel and every thread / message / suggestion that
 * hangs off it (FKs declare ON DELETE CASCADE). Scoped to user so a stolen
 * channel id can't be used to wipe another tenant's inbox.
 */
export async function deleteChannelForUser(
  userId: string,
  channelId: string,
) {
  return prisma.inboxChannel.deleteMany({
    where: { id: channelId, userId },
  });
}

// ---------------------------------------------------------------------------
// Threads
// ---------------------------------------------------------------------------

export async function listThreads(params: {
  userId: string;
  status?: ThreadStatus | "all";
  channelType?: ChannelType | "all";
  limit?: number;
}) {
  const where: {
    userId: string;
    status?: ThreadStatus;
    channelType?: ChannelType;
  } = { userId: params.userId };
  if (params.status && params.status !== "all") where.status = params.status;
  if (params.channelType && params.channelType !== "all") {
    where.channelType = params.channelType;
  }

  return prisma.inboxThread.findMany({
    where,
    orderBy: [{ priority: "desc" }, { lastMessageAt: "desc" }],
    take: Math.min(params.limit ?? 50, 200),
    include: {
      channel: { select: { id: true, type: true, label: true, status: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          body: true,
          direction: true,
          sentBy: true,
          createdAt: true,
          voiceTranscript: true,
        },
      },
    },
  });
}

export async function getThreadById(userId: string, threadId: string) {
  return prisma.inboxThread.findFirst({
    where: { id: threadId, userId },
    include: {
      channel: true,
      messages: { orderBy: { createdAt: "asc" } },
      suggestions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
}

export async function updateThread(
  userId: string,
  threadId: string,
  patch: Partial<{
    status: ThreadStatus;
    priority: number;
    assignedTo: string | null;
    tags: string[];
    snoozedUntil: Date | null;
    unreadCount: number;
  }>,
) {
  return prisma.inboxThread.updateMany({
    where: { id: threadId, userId },
    data: {
      ...patch,
      ...(patch.status === "closed" ? { closedAt: new Date() } : {}),
    },
  });
}

export async function markThreadRead(userId: string, threadId: string) {
  return prisma.inboxThread.updateMany({
    where: { id: threadId, userId },
    data: { unreadCount: 0 },
  });
}

// ---------------------------------------------------------------------------
// Ingest — inbound (channel webhook calls this)
//
// De-duplicates on (channelId, externalThreadId) for the thread and
// (threadId, externalId) for the message. Returns the thread + message so
// the caller can enqueue AI jobs.
// ---------------------------------------------------------------------------

export async function ingestInbound(
  channelOwnerId: string,
  channel: { id: string; type: ChannelType },
  payload: InboundMessage,
) {
  const thread = await prisma.inboxThread.upsert({
    where: {
      channelId_externalThreadId: {
        channelId: channel.id,
        externalThreadId: payload.externalThreadId,
      },
    },
    create: {
      userId: channelOwnerId,
      channelId: channel.id,
      channelType: channel.type,
      externalThreadId: payload.externalThreadId,
      contactHandle: payload.contactHandle,
      contactName: payload.contactName ?? null,
      contactLocale: payload.contactLocale ?? null,
      lastMessageAt: payload.receivedAt,
      unreadCount: 1,
    },
    update: {
      contactName: payload.contactName ?? undefined,
      contactLocale: payload.contactLocale ?? undefined,
      lastMessageAt: payload.receivedAt,
      unreadCount: { increment: 1 },
      // Re-open if customer wrote on a closed/snoozed thread.
      status: "open",
      snoozedUntil: null,
    },
  });

  let message;
  try {
    message = await prisma.inboxMessage.create({
      data: {
        threadId: thread.id,
        direction: "in" satisfies MessageDirection,
        sentBy: "customer" satisfies MessageSentBy,
        status: "delivered" satisfies MessageStatus,
        body: payload.body ?? null,
        mediaUrls: payload.mediaUrls ?? [],
        voiceUrl: payload.voiceUrl ?? null,
        voiceTranscript: payload.voiceTranscript ?? null,
        language: payload.language ?? null,
        externalId: payload.externalMessageId,
        createdAt: payload.receivedAt,
        deliveredAt: payload.receivedAt,
      },
    });
  } catch (err) {
    // Unique (threadId, externalId) collision — webhook retry. Silently no-op.
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return { thread, message: null as null };
    }
    throw err;
  }

  return { thread, message };
}

// ---------------------------------------------------------------------------
// Outbound — user (or AI) sends a message on a thread
// ---------------------------------------------------------------------------

export async function createOutboundDraft(
  userId: string,
  threadId: string,
  body: string,
  sentBy: MessageSentBy = "user",
) {
  // Ensure thread belongs to user.
  const thread = await prisma.inboxThread.findFirst({
    where: { id: threadId, userId },
    select: { id: true },
  });
  if (!thread) throw new Error("thread_not_found");

  return prisma.inboxMessage.create({
    data: {
      threadId,
      direction: "out",
      sentBy,
      status: "pending",
      body,
    },
  });
}

export async function markOutboundSent(
  messageId: string,
  externalId: string | null,
  status: MessageStatus = "sent",
) {
  await prisma.inboxMessage.update({
    where: { id: messageId },
    data: {
      status,
      externalId: externalId ?? undefined,
      deliveredAt: status === "delivered" ? new Date() : undefined,
    },
  });
}

export async function markOutboundFailed(messageId: string, error: string) {
  await prisma.inboxMessage.update({
    where: { id: messageId },
    data: { status: "failed", errorMessage: error.slice(0, 1000) },
  });
}
