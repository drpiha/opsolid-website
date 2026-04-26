import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import {
  getMonthlyUsageSummary,
  formatBillingMonth,
} from "@/lib/voice/analytics";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

// -----------------------------------------------------------------------------
// GET /api/voice/{tenantId}/usage?month=YYYY-MM
// Returns monthly summary, individual usage records, and the tenant's plan.
// -----------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  const url = new URL(req.url);
  const monthParam = url.searchParams.get("month");
  let month: string;
  if (monthParam) {
    if (!MONTH_RE.test(monthParam)) {
      return NextResponse.json(
        { error: "month must be YYYY-MM", reason: "bad_month" },
        { status: 400 },
      );
    }
    month = monthParam;
  } else {
    month = formatBillingMonth(new Date());
  }

  try {
    const [summary, records, tenant] = await Promise.all([
      getMonthlyUsageSummary(tenantId, month),
      prisma.voiceUsageRecord.findMany({
        where: { tenantId, billingMonth: month },
        orderBy: { createdAt: "desc" },
        include: {
          call: {
            select: {
              id: true,
              providerCallId: true,
              fromNumber: true,
              durationSeconds: true,
              outcomeType: true,
              startedAt: true,
              endedAt: true,
            },
          },
        },
      }),
      prisma.voiceTenant.findUnique({
        where: { id: tenantId },
        select: {
          id: true,
          planId: true,
          plan: {
            select: {
              id: true,
              planKey: true,
              displayName: true,
              monthlyMinutes: true,
              overageRateCents: true,
              monthlyCents: true,
              yearlyCents: true,
              features: true,
            },
          },
        },
      }),
    ]);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        month,
        summary,
        records,
        plan: tenant.plan,
      },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "usage.get" },
      extra: { tenantId, month },
    });
    return NextResponse.json(
      { error: "Failed to load usage" },
      { status: 500 },
    );
  }
}
