// =============================================================================
// Phase 8.5 — Inbox: list action requests received by the authenticated user.
//
// GET /api/account/inbox?status=pending|accepted|declined|archived|all
//   Default status: "pending". Returns up to 50 items, newest first.
//   Only includes actions received by cards the user owns (PUBLISHED).
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

  const items = actions.map((a) => {
    const data = (a.senderCard.cardData ?? {}) as Record<string, unknown>;
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
    };
  });

  return NextResponse.json({ items });
}
