// =============================================================================
// One-time backfill: CardAction → InboxThread + InboxMessage (card_action channel)
//
// Surfaces the legacy DBC "Smart Action board" inside the unified inbox v2
// so the "card_action" filter chip actually shows historical requests.
//
// Idempotent: skips actions that already produced an InboxMessage with the
// matching externalId. Safe to re-run after new card actions arrive.
//
// Per receiving user, we maintain a single virtual channel:
//     type='card_action'
//     externalId='card_action:<userId>'
//
// Threads are bucketed by (receiverCard, senderCard) — one thread per
// counterparty pair, mirroring how the user thinks about their inbox.
//
// Run in production:
//   docker exec -i opsolid-app node --experimental-strip-types \
//     /app/scripts/backfill-card-actions-to-inbox.ts
//   (or run via ts-node locally before commit / against dev DB).
// =============================================================================

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const ACTION_LABELS: Record<string, string> = {
  request_contact: "Contact request",
  request_quote: "Quote request",
  request_meeting: "Meeting request",
  send_card: "Card share",
  ask_collaboration: "Collaboration request",
  give_feedback: "Feedback",
};

interface BackfillStats {
  scanned: number;
  channelsCreated: number;
  threadsCreated: number;
  messagesCreated: number;
  skipped: number;
}

async function ensureChannelForUser(
  userId: string,
  channelCache: Map<string, string>,
): Promise<string> {
  if (channelCache.has(userId)) return channelCache.get(userId)!;

  const externalId = `card_action:${userId}`;
  const channel = await prisma.inboxChannel.upsert({
    where: { type_externalId: { type: "card_action", externalId } },
    create: {
      userId,
      type: "card_action",
      externalId,
      label: "Card actions (legacy DBC inbox)",
      status: "active",
    },
    update: { userId },
  });
  channelCache.set(userId, channel.id);
  return channel.id;
}

async function run(): Promise<BackfillStats> {
  const stats: BackfillStats = {
    scanned: 0,
    channelsCreated: 0,
    threadsCreated: 0,
    messagesCreated: 0,
    skipped: 0,
  };
  const channelCache = new Map<string, string>();

  const before = await prisma.inboxChannel.count({
    where: { type: "card_action" },
  });

  // We can't go on .userId on CardAction directly — actions sit on cards.
  // Pull the join in one query so we don't N+1 across the dataset.
  const actions = await prisma.cardAction.findMany({
    include: {
      senderCard: {
        select: {
          id: true,
          slug: true,
          contactName: true,
        },
      },
      receiverCard: {
        select: {
          id: true,
          slug: true,
          userId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  for (const a of actions) {
    stats.scanned++;
    const ownerId = a.receiverCard.userId;
    if (!ownerId) {
      stats.skipped++;
      continue;
    }

    // Idempotency: skip if we already produced a message for this action.
    const existing = await prisma.inboxMessage.findFirst({
      where: { externalId: `card_action:${a.id}` },
      select: { id: true },
    });
    if (existing) {
      stats.skipped++;
      continue;
    }

    const channelId = await ensureChannelForUser(ownerId, channelCache);
    const externalThreadId = `${a.receiverCardId}:${a.senderCardId}`;
    const contactHandle = a.senderCard.slug ?? a.senderCardId;
    const contactName = a.senderCard.contactName ?? contactHandle;
    const subject =
      ACTION_LABELS[a.type] ?? a.type.replace(/_/g, " ");

    const existingThread = await prisma.inboxThread.findUnique({
      where: {
        channelId_externalThreadId: { channelId, externalThreadId },
      },
      select: { id: true, lastMessageAt: true },
    });

    let threadId: string;
    if (!existingThread) {
      const created = await prisma.inboxThread.create({
        data: {
          userId: ownerId,
          channelId,
          channelType: "card_action",
          externalThreadId,
          contactName,
          contactHandle,
          subject,
          status:
            a.status === "accepted"
              ? "closed"
              : a.status === "archived"
                ? "archived"
                : a.status === "declined"
                  ? "closed"
                  : "open",
          priority: a.type === "request_meeting" ? 1 : 0,
          unreadCount: a.status === "pending" ? 1 : 0,
          lastMessageAt: a.createdAt,
        },
      });
      threadId = created.id;
      stats.threadsCreated++;
    } else {
      threadId = existingThread.id;
      // Only push lastMessageAt forward, never backward.
      if (a.createdAt > existingThread.lastMessageAt) {
        await prisma.inboxThread.update({
          where: { id: threadId },
          data: {
            contactName,
            subject,
            lastMessageAt: a.createdAt,
          },
        });
      }
    }

    await prisma.inboxMessage.create({
      data: {
        threadId,
        direction: "in",
        sentBy: "customer",
        status: "delivered",
        body: a.message ?? `${subject}`,
        externalId: `card_action:${a.id}`,
        createdAt: a.createdAt,
        deliveredAt: a.createdAt,
        readAt: a.status === "pending" ? null : a.resolvedAt ?? a.updatedAt,
      },
    });
    stats.messagesCreated++;
  }

  const after = await prisma.inboxChannel.count({
    where: { type: "card_action" },
  });
  stats.channelsCreated = Math.max(0, after - before);

  return stats;
}

run()
  .then((stats) => {
    console.log("CardAction → InboxThread backfill done.");
    console.log(JSON.stringify(stats, null, 2));
  })
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
