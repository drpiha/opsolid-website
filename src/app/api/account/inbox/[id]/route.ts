// =============================================================================
// Phase 8.5 — Inbox action update: accept / decline / archive a received action.
//
// PATCH /api/account/inbox/[id]
//   Body: { status: "accepted" | "declined" | "archived" }
//   Requires authentication. Only the receiver card owner may resolve.
//   Only pending actions can be transitioned (409 already_resolved otherwise).
//
// Security:
//   - Authentication enforced (AuthError → 401).
//   - Ownership verified: action.receiverCard.userId must match authenticated user.
//   - Status transition is one-way: pending → accepted|declined|archived.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import { z } from "zod";

export const runtime = "nodejs";

const PatchSchema = z.object({
  status: z.enum(["accepted", "declined", "archived"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Verify action exists and receiver card belongs to the authenticated user
  const action = await prisma.cardAction.findFirst({
    where: {
      id,
      receiverCard: { userId: user.id },
    },
    select: { id: true, status: true },
  });
  if (!action) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (action.status !== "pending") {
    return NextResponse.json({ error: "already_resolved" }, { status: 409 });
  }

  const updated = await prisma.cardAction.update({
    where: { id },
    data: {
      status: parsed.data.status,
      resolvedAt: new Date(),
    },
    select: { id: true, status: true, resolvedAt: true },
  });

  return NextResponse.json(updated);
}
