import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";

export const runtime = "nodejs";

function checkToken(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  return token === expected;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    action?: string;
    note?: string;
  } | null;
  if (!body?.action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  const order = await prisma.cardOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  switch (body.action) {
    case "mark-contacted": {
      const now = new Date();
      await prisma.cardOrder.update({
        where: { id },
        data: { contactedAt: now, contactedByNote: body.note ?? null },
      });
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus: order.status,
          actor: "admin",
          note: `Contacted. ${body.note ?? ""}`.trim(),
        },
      });
      return NextResponse.json({ ok: true });
    }
    case "cancel": {
      if (order.status === OrderStatus.CANCELLED) {
        return NextResponse.json({ ok: true });
      }
      await prisma.cardOrder.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus: OrderStatus.CANCELLED,
          actor: "admin",
          note: body.note ?? "Manually cancelled",
        },
      });
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
