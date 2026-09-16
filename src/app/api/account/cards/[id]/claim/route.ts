// =============================================================================
// POST /api/cards/[id]/claim — bind a legacy (userId=null) card to the current
// user's account (B0.6 claim-card flow).
//
// Pre-conditions:
//   - account email has been verified by the server
//   - card.userId IS NULL (unclaimed), or already belongs to this user
//   - LOWER(TRIM(card.contactEmail)) === LOWER(user.email)
//
// On success: sets card.userId = user.id.
// editToken is NOT cleared — old links continue to work after claiming.
//
// Returns:
//   200  { ok: true, card: { id, slug, name, status } }
//   401  not authenticated
//   403  claim unavailable (unverified, mismatched, or owned by another user)
//   404  card not found
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import {
  CARD_CLAIM_FORBIDDEN,
  claimUnownedLegacyCard,
  legacyCardClaimDecision,
} from "@/lib/auth/card-claim";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { id } = await params;

  if (!user.emailVerifiedAt) {
    return NextResponse.json(CARD_CLAIM_FORBIDDEN, { status: 403 });
  }

  const card = await prisma.cardOrder.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      contactName: true,
      contactEmail: true,
      userId: true,
      status: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const decision = legacyCardClaimDecision(user, card);
  if (decision !== "claimable" && decision !== "owned") {
    return NextResponse.json(CARD_CLAIM_FORBIDDEN, { status: 403 });
  }

  if (decision === "claimable") {
    const outcome = await claimUnownedLegacyCard(prisma, card.id, user.id, card.contactEmail);
    if (outcome === "unavailable") {
      return NextResponse.json(CARD_CLAIM_FORBIDDEN, { status: 403 });
    }
  }

  return NextResponse.json({
    ok: true,
    card: {
      id: card.id,
      slug: card.slug,
      name: card.contactName,
      status: card.status,
    },
  });
}
