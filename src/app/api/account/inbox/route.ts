// =============================================================================
// Phase 8.5 — Inbox: list action requests received by the authenticated user.
//
// GET /api/account/inbox?status=pending|accepted|declined|archived|all
//   Default status: "pending". Returns up to 50 items, newest first.
//   Only includes actions received by cards the user owns (PUBLISHED).
//
// Sprint F4 — Each row is enriched with:
//   - `connectionId`: a CardConnection between the sender and receiver cards.
//     A connection is auto-upserted lazily here when missing so the row's tap
//     target on the mobile thread view is always resolvable. Owner is the
//     receiver (the authenticated user's card); visitor is the sender card.
//   - `lastMessage`: { body, sentAt, senderUserId } — the most recent chat
//     line on that connection's thread, or null if the thread is empty.
//   - `unreadCount`: count of messages on the connection where readAt is null
//     AND senderUserId !== requester. Decrements as the user opens the thread
//     (the GET messages route flips readAt on read).
//
// Security:
//   - Authentication enforced (AuthError → 401).
//   - Only returns actions addressed to the authenticated user's own cards.
//   - Sender identity exposed only through public card fields.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";

  // Collect all published cards owned by the authenticated user
  const userCards = await prisma.cardOrder.findMany({
    where: { userId: user.id, status: "PUBLISHED" },
    select: { id: true },
  });
  const cardIds = userCards.map((c) => c.id);

  if (cardIds.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const actions = await prisma.cardAction.findMany({
    where: {
      receiverCardId: { in: cardIds },
      ...(status !== "all" ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      status: true,
      message: true,
      createdAt: true,
      resolvedAt: true,
      senderCardId: true,
      receiverCardId: true,
      senderCard: {
        select: {
          slug: true,
          contactName: true,
          photoPath: true,
          cardData: true,
        },
      },
      receiverCard: {
        select: { slug: true, contactName: true },
      },
    },
  });

  // ---------------------------------------------------------------------------
  // Sprint F4 — derive a connectionId per row.
  //
  // Bulk-fetch existing connections for all (receiver, sender) pairs from this
  // page in one query, then upsert any that are missing. We treat the receiver
  // (the authenticated user's card) as the connection's owner side because the
  // smart-exchange flow uses the same convention.
  // ---------------------------------------------------------------------------
  const pairKey = (ownerId: string, visitorId: string) =>
    `${ownerId}::${visitorId}`;

  const pairs = actions.map((a) => ({
    ownerCardId: a.receiverCardId,
    visitorCardId: a.senderCardId,
  }));

  const existingConns =
    pairs.length === 0
      ? []
      : await prisma.cardConnection.findMany({
          where: { OR: pairs },
          select: { id: true, ownerCardId: true, visitorCardId: true },
        });

  const connByPair = new Map<string, string>();
  for (const c of existingConns) {
    connByPair.set(pairKey(c.ownerCardId, c.visitorCardId), c.id);
  }

  // Upsert any pair that doesn't yet have a connection. This is intentionally
  // sequential to keep things simple — each missing row is a single round-trip
  // and the page is capped at 50.
  for (const a of actions) {
    const key = pairKey(a.receiverCardId, a.senderCardId);
    if (connByPair.has(key)) continue;
    if (a.receiverCardId === a.senderCardId) continue;
    const created = await prisma.cardConnection.upsert({
      where: {
        ownerCardId_visitorCardId: {
          ownerCardId: a.receiverCardId,
          visitorCardId: a.senderCardId,
        },
      },
      create: {
        ownerCardId: a.receiverCardId,
        visitorCardId: a.senderCardId,
        source: "inbox_action",
        status: "new",
      },
      update: {},
      select: { id: true },
    });
    connByPair.set(key, created.id);
  }

  // ---------------------------------------------------------------------------
  // Bulk-fetch last message + unread count for all connections in one go.
  // ---------------------------------------------------------------------------
  const connIds = Array.from(new Set(connByPair.values()));

  type LastMessageInfo = {
    body: string;
    sentAt: string;
    senderUserId: string;
  };
  const lastByConn = new Map<string, LastMessageInfo>();
  const unreadByConn = new Map<string, number>();

  if (connIds.length > 0) {
    // Last message per connection — we read newest-first per conn and pluck
    // the head. Postgres doesn't ship `DISTINCT ON` through Prisma cleanly,
    // so we paginate with a single ordered fetch and take per-conn first.
    const recent = await prisma.message.findMany({
      where: { connectionId: { in: connIds } },
      orderBy: [{ connectionId: "asc" }, { sentAt: "desc" }],
      select: {
        connectionId: true,
        body: true,
        sentAt: true,
        senderUserId: true,
      },
    });
    for (const m of recent) {
      if (!lastByConn.has(m.connectionId)) {
        lastByConn.set(m.connectionId, {
          body: m.body,
          sentAt: m.sentAt.toISOString(),
          senderUserId: m.senderUserId,
        });
      }
    }

    // Unread count = messages on the connection that the requester didn't
    // send and hasn't fetched (readAt = null).
    const unread = await prisma.message.groupBy({
      by: ["connectionId"],
      where: {
        connectionId: { in: connIds },
        readAt: null,
        senderUserId: { not: user.id },
      },
      _count: { _all: true },
    });
    for (const u of unread) {
      unreadByConn.set(u.connectionId, u._count._all);
    }
  }

  const items = actions.map((a) => {
    const data = (a.senderCard.cardData ?? {}) as Record<string, unknown>;
    const connectionId =
      connByPair.get(pairKey(a.receiverCardId, a.senderCardId)) ?? null;
    const lastMessage =
      connectionId && lastByConn.has(connectionId)
        ? lastByConn.get(connectionId)!
        : null;
    const unreadCount =
      connectionId && unreadByConn.has(connectionId)
        ? unreadByConn.get(connectionId)!
        : 0;
    return {
      id: a.id,
      type: a.type,
      status: a.status,
      message: a.message,
      createdAt: a.createdAt,
      resolvedAt: a.resolvedAt,
      sender: {
        slug: a.senderCard.slug,
        name: a.senderCard.contactName,
        title: (data.title as string) ?? null,
        company: (data.company as string) ?? null,
        photoPath: a.senderCard.photoPath,
      },
      receiverSlug: a.receiverCard.slug,
      connectionId,
      lastMessage,
      unreadCount,
    };
  });

  return NextResponse.json({ items });
}
