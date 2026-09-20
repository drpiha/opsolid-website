// =============================================================================
// GET /api/cards/claimable — list unclaimed cards matching the current user's
// email (B0.6 claim-card flow).
//
// Returns cards where:
//   userId IS NULL
//   AND LOWER(TRIM(contactEmail)) = LOWER(user.email)
//
// Minimal shape — only what the claim banner needs to render.
// Auth: requireUser.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import {
  CARD_CLAIM_FORBIDDEN,
  getVerifiedClaimEmail,
  findClaimableLegacyCards,
} from "@/lib/auth/card-claim";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const verifiedEmail = getVerifiedClaimEmail(user);
  if (!verifiedEmail) {
    return NextResponse.json(CARD_CLAIM_FORBIDDEN, { status: 403 });
  }

  const claimable = await findClaimableLegacyCards(prisma, user);

  return NextResponse.json(
    claimable.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.contactName,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    })),
  );
}
