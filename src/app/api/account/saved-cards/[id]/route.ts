// =============================================================================
// Phase 8.3 — Saved card detail: update CRM fields or delete bookmark.
//
// PATCH  /api/account/saved-cards/[id] — update CRM fields (partial)
// DELETE /api/account/saved-cards/[id] — remove bookmark
//
// Only the owning user can modify or delete their own SavedCard row.
// All CRM fields are optional in PATCH — only provided fields are updated.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import { z } from "zod";

export const runtime = "nodejs";

const PatchSchema = z.object({
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  metWhere: z.string().max(200).optional().nullable(),
  followUpAt: z.string().datetime().optional().nullable(),
  status: z
    .enum(["new", "contacted", "customer", "partner", "archived"])
    .optional(),
  starred: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
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

  // Ownership check — find row belonging to this user only.
  const row = await prisma.savedCard.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const updated = await prisma.savedCard.update({
    where: { id },
    data: {
      ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
      ...(parsed.data.tags !== undefined ? { tags: parsed.data.tags } : {}),
      ...(parsed.data.metWhere !== undefined
        ? { metWhere: parsed.data.metWhere }
        : {}),
      ...(parsed.data.followUpAt !== undefined
        ? {
            followUpAt: parsed.data.followUpAt
              ? new Date(parsed.data.followUpAt)
              : null,
          }
        : {}),
      ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
      ...(parsed.data.starred !== undefined
        ? { starred: parsed.data.starred }
        : {}),
    },
    select: {
      id: true,
      notes: true,
      tags: true,
      metWhere: true,
      followUpAt: true,
      status: true,
      starred: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
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

  // Ownership check before delete.
  const row = await prisma.savedCard.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.savedCard.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
