// =============================================================================
// Shared stats aggregation — consumed by /api/m2m/stats (JSON) and by the
// /admin/stats server component (cards + table). Kept in a plain module so
// Next.js doesn't reject it for being a non-route export in a route file.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { OrderStatus, BillingMode } from "@/lib/validation";

export type StatsRange = "7d" | "30d" | "all";

export interface StatsResponse {
  range: StatsRange;
  since: string | null;
  revenue: {
    totalCents: number;
    oneTimeCents: number;
    subscriptionCents: number;
    currency: "EUR";
  };
  orders: {
    total: number;
    pending: number;
    paid: number;
    awaitingDesign: number;
    published: number;
    cancelled: number;
    refunded: number;
  };
  conversion: {
    sessionsStarted: number;
    sessionsCompleted: number;
    rate: number;
  };
  avgCycleTimeHours: {
    paidToPublished: number;
  };
  recentActivity: Array<{
    orderId: string;
    orderNumber: number;
    status: string;
    contactName: string;
    createdAt: string;
  }>;
}

export function parseRange(input: string | null | undefined): StatsRange {
  if (input === "7d" || input === "30d" || input === "all") return input;
  return "30d";
}

function sinceFor(range: StatsRange): Date | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : 30;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

export async function computeStats(range: StatsRange): Promise<StatsResponse> {
  const since = sinceFor(range);
  const createdFilter = since ? { createdAt: { gte: since } } : {};

  // Revenue: orders with a paidAt timestamp inside the window. Subscriptions
  // accrue their initial-checkout amount here; recurring cycles are not
  // back-filled (future milestone).
  const revenueFilter = since
    ? { paidAt: { gte: since, not: null } }
    : { paidAt: { not: null } };

  const [grouped, totalOrders, recent, paidOneTime, paidSubs, cycleRows] =
    await Promise.all([
      prisma.cardOrder.groupBy({
        by: ["status"],
        where: createdFilter,
        _count: { _all: true },
      }),
      prisma.cardOrder.count({ where: createdFilter }),
      prisma.cardOrder.findMany({
        where: createdFilter,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          contactName: true,
          createdAt: true,
        },
      }),
      prisma.cardOrder.aggregate({
        where: { ...revenueFilter, billingMode: BillingMode.ONE_TIME },
        _sum: { amountCents: true },
      }),
      prisma.cardOrder.aggregate({
        where: {
          ...revenueFilter,
          billingMode: { in: [BillingMode.MONTHLY, BillingMode.YEARLY] },
        },
        _sum: { amountCents: true },
      }),
      prisma.cardOrder.findMany({
        where: {
          ...(since ? { publishedAt: { gte: since } } : {}),
          status: OrderStatus.PUBLISHED,
          paidAt: { not: null },
          publishedAt: { not: null },
        },
        select: { paidAt: true, publishedAt: true },
        take: 500,
      }),
    ]);

  const counts: Record<string, number> = {};
  for (const g of grouped) counts[g.status] = g._count._all;

  const oneTime = paidOneTime._sum.amountCents ?? 0;
  const subs = paidSubs._sum.amountCents ?? 0;

  const paid = counts[OrderStatus.PAID] ?? 0;
  const awaiting = counts[OrderStatus.AWAITING_DESIGN] ?? 0;
  const published = counts[OrderStatus.PUBLISHED] ?? 0;
  const pending = counts[OrderStatus.PENDING_PAYMENT] ?? 0;
  const cancelled = counts[OrderStatus.CANCELLED] ?? 0;
  const refunded = counts[OrderStatus.REFUNDED] ?? 0;

  // Conversion: order row starts at PENDING_PAYMENT, "completes" at PAID+.
  const completed = paid + awaiting + published + refunded;
  const rate = totalOrders > 0 ? completed / totalOrders : 0;

  // Cycle time: paidAt -> publishedAt in hours, averaged.
  let totalHours = 0;
  let n = 0;
  for (const r of cycleRows) {
    if (!r.paidAt || !r.publishedAt) continue;
    const hrs =
      (r.publishedAt.getTime() - r.paidAt.getTime()) / (1000 * 60 * 60);
    if (hrs >= 0) {
      totalHours += hrs;
      n += 1;
    }
  }
  const avgPaidToPublishedHours =
    n > 0 ? Math.round((totalHours / n) * 10) / 10 : 0;

  return {
    range,
    since: since ? since.toISOString() : null,
    revenue: {
      totalCents: oneTime + subs,
      oneTimeCents: oneTime,
      subscriptionCents: subs,
      currency: "EUR",
    },
    orders: {
      total: totalOrders,
      pending,
      paid,
      awaitingDesign: awaiting,
      published,
      cancelled,
      refunded,
    },
    conversion: {
      sessionsStarted: totalOrders,
      sessionsCompleted: completed,
      rate: Math.round(rate * 10000) / 10000,
    },
    avgCycleTimeHours: {
      paidToPublished: avgPaidToPublishedHours,
    },
    recentActivity: recent.map((o) => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      contactName: o.contactName,
      createdAt: o.createdAt.toISOString(),
    })),
  };
}
