// =============================================================================
// GET /api/health — liveness probe for Docker + Traefik + CI.
// Always returns 200 so Traefik keeps routing and CI deploys don't false-fail.
// DB reachability is reported in the body (informational, not fatal here).
// Shape: { ok: true, commit, dbOk }
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

  // Always 200 — Next.js is alive. DB status is informational.
  // Returning 503 here caused Traefik to drop the router on transient DB hiccups.
  return NextResponse.json({ ok: true, commit, dbOk }, { status: 200 });
}
