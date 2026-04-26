import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// -----------------------------------------------------------------------------
// GET /api/voice/{tenantId}/calls
// Filters: status, outcomeType, agentId, fromNumber, dateFrom, dateTo
// Pagination: page (default 1), limit (default 20, max 100).
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
  const q = url.searchParams;

  const page = Math.max(1, Number(q.get("page") ?? "1") || 1);
  const limit = clamp(Number(q.get("limit") ?? "20") || 20, 1, 100);
  const skip = (page - 1) * limit;

  const status = q.get("status") ?? undefined;
  const outcomeType = q.get("outcomeType") ?? undefined;
  const agentId = q.get("agentId") ?? undefined;
  const fromNumber = q.get("fromNumber") ?? undefined;
  const dateFromStr = q.get("dateFrom");
  const dateToStr = q.get("dateTo");

  const dateFrom = dateFromStr ? new Date(dateFromStr) : null;
  const dateTo = dateToStr ? new Date(dateToStr) : null;
  if ((dateFromStr && Number.isNaN(dateFrom?.getTime())) ||
      (dateToStr && Number.isNaN(dateTo?.getTime()))) {
    return NextResponse.json(
      { error: "dateFrom/dateTo must be ISO 8601", reason: "bad_date" },
      { status: 400 },
    );
  }

  try {
    // Tenant scoping is enforced via agent.tenantId — never trust the URL
    // tenantId alone, always join through the owning agent.
    const where: Record<string, unknown> = {
      agent: { tenantId },
      ...(status && { status }),
      ...(outcomeType && { outcomeType }),
      ...(agentId && { agentId }),
      ...(fromNumber && { fromNumber }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        },
      }),
    };

    const [calls, total] = await Promise.all([
      prisma.voiceCall.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          agent: {
            select: { id: true, name: true, displayName: true },
          },
        },
      }),
      prisma.voiceCall.count({ where }),
    ]);

    return NextResponse.json({
      data: { calls, total, page, limit },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "calls.list" },
      extra: { tenantId },
    });
    return NextResponse.json({ error: "Failed to load calls" }, { status: 500 });
  }
}
