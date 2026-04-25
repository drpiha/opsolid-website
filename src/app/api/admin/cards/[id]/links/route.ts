// =============================================================================
// /api/admin/cards/[id]/links — manage short links for a published card.
//
// GET    — list links + scan counts for the order
// POST   — create a new link (optionally with a desired code)
// DELETE — disable (soft-delete by setting active=false; preserves analytics)
//
// Auth: same browser ADMIN_TOKEN pattern as /admin/orders. We accept the
// token in either ?token=… (browser fetch) or x-admin-token header.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { reserveShortCode } from "@/lib/short-code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const CreateInput = z.object({
  label: z.string().trim().min(1).max(120).optional(),
  code: z.string().trim().min(3).max(64).optional(),
  source: z.string().trim().max(60).optional(),
  campaign: z.string().trim().max(60).optional(),
  medium: z.string().trim().max(60).optional(),
  eventName: z.string().trim().max(120).optional(),
  destinationUrl: z.string().url().max(500).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.cardLink.findMany({
    where: { orderId: params.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { scanEvents: true } },
    },
  });

  return NextResponse.json({
    links: links.map((l) => ({
      id: l.id,
      code: l.code,
      label: l.label,
      source: l.source,
      campaign: l.campaign,
      medium: l.medium,
      eventName: l.eventName,
      destinationUrl: l.destinationUrl,
      active: l.active,
      scans: l._count.scanEvents,
      createdAt: l.createdAt.toISOString(),
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
    select: { id: true, status: true },
  });
  if (!order || order.status !== "PUBLISHED") {
    return NextResponse.json(
      { error: "Order must be PUBLISHED to add short links." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = CreateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  let code: string;
  try {
    code = await reserveShortCode(parsed.data.code);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Code reservation failed." },
      { status: 400 },
    );
  }

  const link = await prisma.cardLink.create({
    data: {
      orderId: order.id,
      code,
      label: parsed.data.label,
      source: parsed.data.source,
      campaign: parsed.data.campaign,
      medium: parsed.data.medium,
      eventName: parsed.data.eventName,
      destinationUrl: parsed.data.destinationUrl,
    },
  });

  return NextResponse.json({
    link: {
      id: link.id,
      code: link.code,
      label: link.label,
      source: link.source,
      campaign: link.campaign,
      medium: link.medium,
      eventName: link.eventName,
      destinationUrl: link.destinationUrl,
      active: link.active,
      scans: 0,
      createdAt: link.createdAt.toISOString(),
    },
  });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const linkId = url.searchParams.get("linkId");
  if (!linkId) {
    return NextResponse.json({ error: "linkId required" }, { status: 400 });
  }

  // Soft-delete: keep the row + scan history, just disable redirects.
  await prisma.cardLink.update({
    where: { id: linkId },
    data: { active: false },
  });

  return NextResponse.json({ ok: true });
}
