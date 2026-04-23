// =============================================================================
// GET /api/health — lightweight uptime probe.
// Returns 200 when Next.js is serving AND the DB round-trips a SELECT 1.
// Shape: { ok, commit, dbOk }. 503 if the DB probe fails.
// UptimeRobot / VPS cron can hit this endpoint.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const commit = process.env.GIT_COMMIT || "unknown";

  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    { ok: dbOk, commit, dbOk },
    { status: dbOk ? 200 : 503 },
  );
}
