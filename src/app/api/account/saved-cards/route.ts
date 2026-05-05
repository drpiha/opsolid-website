// =============================================================================
// Phase 8.3 — Saved cards list.
//
// GET /api/account/saved-cards
//   Returns the authenticated user's saved card bookmarks, newest first,
//   starred items sorted to top. Supports optional query filters:
//     ?starred=true  — only starred entries
//     ?status=<s>   — filter by CRM status
//
// CRM fields (notes, tags, metWhere, followUpAt, status, starred) are
// owner-private and never visible to the card owner being saved.
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
  const starred = searchParams.get("starred") === "true" ? true : undefined;
  const status = searchParams.get("status") ?? undefined;

  const rows = await prisma.savedCard.findMany({
    where: {
      userId: user.id,
      ...(starred !== undefined ? { starred } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: [{ starred: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      notes: true,
      tags: true,
      metWhere: true,
      followUpAt: true,
      status: true,
      starred: true,
      createdAt: true,
      cardOrder: {
        select: {
          id: true,
          slug: true,
          contactName: true,
          photoPath: true,
          industry: true,
          city: true,
          country: true,
          cardData: true,
        },
      },
    },
  });

  const items = rows.map((r) => {
    const data = (r.cardOrder.cardData ?? {}) as Record<string, unknown>;
    return {
      id: r.id,
      notes: r.notes,
      tags: r.tags,
      metWhere: r.metWhere,
      followUpAt: r.followUpAt,
      status: r.status,
      starred: r.starred,
      createdAt: r.createdAt,
      card: {
        id: r.cardOrder.id,
        slug: r.cardOrder.slug,
        name: r.cardOrder.contactName,
        title: (data.title as string) ?? null,
        company: (data.company as string) ?? null,
        photoPath: r.cardOrder.photoPath,
        industry: r.cardOrder.industry,
        city: r.cardOrder.city,
        country: r.cardOrder.country,
      },
    };
  });

  return NextResponse.json({ items });
}
