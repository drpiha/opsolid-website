// =============================================================================
// GET /api/m2m/stats?range=7d|30d|all — aggregate stats for the federated
// Kutasia admin AND for opsolid.de's own /admin/stats fallback view.
//
// Auth: Authorization: Bearer ${M2M_ADMIN_TOKEN}   (constant-time compare)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { authorizeM2M } from "@/lib/auth/m2m";
import { computeStats, parseRange } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const range = parseRange(url.searchParams.get("range"));
    const stats = await computeStats(range);
    return NextResponse.json(stats);
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "m2m", endpoint: "stats" } });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
