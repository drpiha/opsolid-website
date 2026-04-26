// =============================================================================
// /api/admin/cards/[id]/webhooks/[wid] — modify or delete a single subscription.
//
// DELETE — hard-delete the subscription row. We don't soft-delete here because,
//          unlike short links (`CardLink`), webhook subscriptions carry no
//          downstream analytics worth preserving once the customer detaches.
// PATCH  — toggle `active`. Use this to pause delivery without losing the URL
//          or the secret (which can't be retrieved if the row is recreated).
//
// Both routes scope the WHERE clause by both (id=wid AND orderId=id) so a
// leaked admin token for one order can never delete another order's webhooks.
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
  active: z.boolean(),
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; wid: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // deleteMany lets us scope by orderId too — `delete` (singular) only takes
  // a unique-key WHERE, which would force a separate ownership check.
  const result = await prisma.cardWebhook.deleteMany({
    where: { id: params.wid, orderId: params.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Webhook not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; wid: string } },
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

  // Same scoping rationale as DELETE: prove order-ownership in the WHERE
  // clause itself rather than via a separate findUnique + check.
  const result = await prisma.cardWebhook.updateMany({
    where: { id: params.wid, orderId: params.id },
    data: { active: parsed.data.active },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Webhook not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, active: parsed.data.active });
}
