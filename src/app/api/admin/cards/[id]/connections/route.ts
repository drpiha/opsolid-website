// =============================================================================
// GET /api/admin/cards/[id]/connections — list CardConnections received by
// this card owner (i.e. visitors who pressed "Kartımı Gönder" on this card).
//
// Returns up to 50 most recent rows, ordered by createdAt desc. Each row is
// flattened server-side: the visitor's CardData JSON is parsed via Zod and
// only { name, title, company, slug } are exposed to the client, so the admin
// panel doesn't need to duplicate the CardDataSchema or worry about malformed
// rows. Falls back to the visitor's contactName if the JSON parse fails.
//
// Auth: ADMIN_TOKEN via ?token=… (browser fetch) or x-admin-token header,
// matching the /admin/orders panel pattern.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.cardConnection.findMany({
    where: { ownerCardId: params.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      visitorCard: {
        select: { id: true, slug: true, contactName: true, cardData: true },
      },
    },
  });

  const connections = rows.map((row) => {
    const parsed = CardDataSchema.safeParse(row.visitorCard.cardData);
    const visitor = parsed.success
      ? {
          name: parsed.data.name || row.visitorCard.contactName,
          title: parsed.data.title,
          company: parsed.data.company,
          slug: row.visitorCard.slug,
        }
      : {
          // Defensive: corrupted/legacy cardData JSON. Surface contactName so
          // the admin can still identify and act on the connection.
          name: row.visitorCard.contactName,
          title: undefined as string | undefined,
          company: undefined as string | undefined,
          slug: row.visitorCard.slug,
        };

    return {
      id: row.id,
      visitor,
      source: row.source,
      campaign: row.campaign,
      note: row.note,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ connections });
}
