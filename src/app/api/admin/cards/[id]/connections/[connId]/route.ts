// =============================================================================
// PATCH /api/admin/cards/[id]/connections/[connId]
//
// Updates the status of a single CardConnection (new → accepted | archived,
// or back to new for un-archive). This is the workflow the card owner drives
// from the admin order detail page.
//
// Auth: ADMIN_TOKEN via ?token=… or x-admin-token header.
//
// Tenant isolation: we re-read the row and verify ownerCardId === params.id
// before updating. Without this check, an admin token holder could mutate any
// connection by guessing IDs across orders. We return 404 (not 403) on
// mismatch to avoid leaking that a given connId exists under a different
// owner.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const PatchInput = z.object({
  status: z.enum(["accepted", "archived", "new"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; connId: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = PatchInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const conn = await prisma.cardConnection.findUnique({
    where: { id: params.connId },
    select: { ownerCardId: true },
  });
  if (!conn || conn.ownerCardId !== params.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.cardConnection.update({
    where: { id: params.connId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true });
}
