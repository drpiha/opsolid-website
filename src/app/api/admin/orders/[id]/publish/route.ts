import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { buildSlug } from "@/lib/slug";
import { notifyOrderEvent } from "@/lib/notifications";

export const runtime = "nodejs";

function checkToken(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  return token === expected;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    designNotes?: string;
  } | null;

  const order = await prisma.cardOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (order.status !== OrderStatus.AWAITING_DESIGN) {
    return NextResponse.json(
      { error: `Order is ${order.status}, cannot publish` },
      { status: 409 }
    );
  }

  // Generate a unique slug (retry on collision — very rare with random suffix).
  let slug = order.slug;
  if (!slug) {
    for (let i = 0; i < 5; i++) {
      const candidate = buildSlug(order.contactName, order.id);
      const conflict = await prisma.cardOrder.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!conflict) {
        slug = candidate;
        break;
      }
    }
  }
  if (!slug) {
    return NextResponse.json(
      { error: "Could not generate a unique slug" },
      { status: 500 }
    );
  }

  const trimmedNotes = body?.designNotes?.trim();
  const now = new Date();

  await prisma.cardOrder.update({
    where: { id },
    data: {
      status: OrderStatus.PUBLISHED,
      slug,
      publishedAt: now,
      designNotes: trimmedNotes && trimmedNotes.length > 0 ? trimmedNotes : order.designNotes,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: id,
      fromStatus: OrderStatus.AWAITING_DESIGN,
      toStatus: OrderStatus.PUBLISHED,
      actor: "admin",
      note:
        trimmedNotes && trimmedNotes.length > 0
          ? `Published. Design notes: ${trimmedNotes}`
          : "Published after design review.",
    },
  });

  notifyOrderEvent({
    orderId: order.id,
    orderNumber: order.orderNumber,
    contactName: order.contactName,
    contactEmail: order.contactEmail,
    contactPhone: order.contactPhone,
    callMeBack: order.callMeBack,
    amountCents: order.amountCents,
    billingMode: order.billingMode,
    slug,
    event: "published",
  }).catch((e) => console.error("[admin publish] notification error:", e));

  // TODO(track-B): send "your card is live" email to the customer here.

  return NextResponse.json({ ok: true, slug });
}
