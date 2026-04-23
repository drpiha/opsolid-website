// =============================================================================
// GET /api/m2m/orders — federated list view for the Kutasia admin.
// Auth: Authorization: Bearer ${M2M_ADMIN_TOKEN}
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { authorizeM2M } from "@/lib/auth/m2m";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set(Object.values(OrderStatus));

export async function GET(req: NextRequest) {
  const auth = authorizeM2M(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized", reason: auth.reason },
      { status: 401 },
    );
  }
  try {

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const callMeBackParam = url.searchParams.get("callMeBack");
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    200,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "25", 10) || 25),
  );

  const where: Prisma.CardOrderWhereInput = {};
  if (statusParam) {
    const requested = statusParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => VALID_STATUSES.has(s as (typeof OrderStatus)[keyof typeof OrderStatus]));
    if (requested.length > 0) {
      where.status = { in: requested };
    }
  }
  if (callMeBackParam === "true") {
    where.callMeBack = true;
    where.contactedAt = null;
  } else if (callMeBackParam === "false") {
    where.callMeBack = false;
  }

  const [items, total, grouped] = await Promise.all([
    prisma.cardOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cardOrder.count({ where }),
    prisma.cardOrder.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  // Counts of each tab bucket (not filtered) so the admin tab badges don't
  // flicker when a filter is active.
  const [callbackCount, designCount, activeCount, pendingCount] =
    await Promise.all([
      prisma.cardOrder.count({
        where: {
          callMeBack: true,
          contactedAt: null,
          status: { in: [OrderStatus.AWAITING_DESIGN, OrderStatus.PUBLISHED] },
        },
      }),
      prisma.cardOrder.count({ where: { status: OrderStatus.AWAITING_DESIGN } }),
      prisma.cardOrder.count({ where: { status: OrderStatus.PUBLISHED } }),
      prisma.cardOrder.count({ where: { status: OrderStatus.PENDING_PAYMENT } }),
    ]);

  const counts: Record<string, number> = {};
  for (const g of grouped) counts[g.status] = g._count._all;

  return NextResponse.json({
    items: items.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      slug: o.slug,
      templateId: o.templateId,
      contactName: o.contactName,
      contactEmail: o.contactEmail,
      contactPhone: o.contactPhone,
      callMeBack: o.callMeBack,
      billingMode: o.billingMode,
      amountCents: o.amountCents,
      currency: o.currency,
      locale: o.locale,
      status: o.status,
      contactedAt: o.contactedAt?.toISOString() ?? null,
      paidAt: o.paidAt?.toISOString() ?? null,
      publishedAt: o.publishedAt?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
    })),
    total,
    page,
    limit,
    counts,
    tabs: {
      callback: callbackCount,
      design: designCount,
      active: activeCount,
      pending: pendingCount,
    },
  });
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "m2m", endpoint: "orders" } });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
