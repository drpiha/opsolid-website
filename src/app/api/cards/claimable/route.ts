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

export const runtime = "nodejs";

export async function GET(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  // Postgres LOWER() via raw filter — Prisma string mode is case-sensitive by
  // default on Postgres. We use findMany with a raw `where` expression via the
  // `equals` + `mode: 'insensitive'` Prisma feature for case-insensitive match.
  // We also trim the stored email in app code after fetching (DB may have
  // whitespace from old imports).
  const normalizedUserEmail = user.email.toLowerCase();

  // Fetch candidates with userId = null (unclaimed) using case-insensitive mode.
  const candidates = await prisma.cardOrder.findMany({
    where: {
      userId: null,
      contactEmail: {
        equals: normalizedUserEmail,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      slug: true,
      contactName: true,
      contactEmail: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Secondary trim guard: Prisma insensitive mode doesn't trim whitespace.
  // Old imports may have stored "user@example.com " (trailing space). We apply
  // a local trim-and-compare so those rows are also excluded when they don't
  // match after trimming.
  const claimable = candidates.filter(
    (c) => c.contactEmail.trim().toLowerCase() === normalizedUserEmail,
  );

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
