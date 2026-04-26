import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import {
  getCallStats,
  getBusyHours,
  getRecommendations,
} from "@/lib/voice/analytics";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function parseRange(value: string | null): number {
  switch (value) {
    case "7d":
      return 7;
    case "90d":
      return 90;
    case "30d":
    default:
      return 30;
  }
}

// -----------------------------------------------------------------------------
// GET /api/voice/{tenantId}/analytics?range=7d|30d|90d (default 30d)
// Returns stats, busy hours, and recommendations for the dashboard.
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
  const days = parseRange(url.searchParams.get("range"));

  try {
    const [stats, busyHours] = await Promise.all([
      getCallStats(tenantId, days),
      getBusyHours(tenantId),
    ]);
    const recommendations = await getRecommendations(tenantId, busyHours);

    return NextResponse.json({
      data: { range: `${days}d`, stats, busyHours, recommendations },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "analytics.get" },
      extra: { tenantId, days },
    });
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 },
    );
  }
}
