// =============================================================================
// GET /api/cards/[slug]/album/pending
//
// Owner approval queue. Returns visitor-uploaded photos still in PENDING
// state so the dashboard can render an inbox-style moderation list.
//
// Auth: ?t=<editToken> on the parent CardOrder. Returns 403/404 on any auth
// mismatch via requireEditToken.
//
// Response: { photos: AlbumPhoto[], count: number }
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAssetUrl } from "@/lib/cardAssetUrl";
import { OrderStatus } from "@/lib/validation";
import { requireEditToken, EditTokenError } from "@/lib/auth/edit-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const order = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, editToken: true },
  });
  // Same 404 cover as elsewhere — never confirm slug existence to non-owners.
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 });
  }

  try {
    await requireEditToken(req, order.id);
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    throw err;
  }

  const rows = await prisma.cardAlbumPhoto.findMany({
    where: { cardOrderId: order.id, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      photoPath: true,
      caption: true,
      uploaderName: true,
      uploaderType: true,
      connectionId: true,
      createdAt: true,
      status: true,
    },
  });

  const photos = rows.map((row) => ({
    id: row.id,
    photoPath: resolveAssetUrl(row.photoPath),
    caption: row.caption,
    uploaderName: row.uploaderName,
    uploaderType: row.uploaderType,
    connectionId: row.connectionId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));

  return NextResponse.json({ photos, count: photos.length });
}
