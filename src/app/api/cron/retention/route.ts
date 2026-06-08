// =============================================================================
// POST|GET /api/cron/retention  — GDPR PII retention runner.
//
// Anonymizes CardLead / CardView / ScanEvent / CardConnection PII older than
// the retention window (see src/lib/retention.ts). Gated by CRON_SECRET so it
// can be triggered by a host cron / external scheduler:
//
//   curl -fsS -H "Authorization: Bearer $CRON_SECRET" \
//        https://opsolid.de/api/cron/retention
//
// Pass ?dry=1 for a dry run (reports counts without writing). Returns the
// retention report as JSON. Set a strong CRON_SECRET in the VPS .env and add a
// daily cron (e.g. crontab) hitting this endpoint — without it the storage-
// limitation promise in the privacy policy is not actually enforced.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runAllRetention } from "@/lib/retention";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
    new URL(req.url).searchParams.get("key") ||
    "";
  if (provided.length !== secret.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(secret));
  } catch {
    return false;
  }
}

async function run(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const dryRun = new URL(req.url).searchParams.get("dry") === "1";
  try {
    const report = await runAllRetention({ dryRun });
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("[cron/retention] failed:", err);
    return NextResponse.json({ error: "retention_failed" }, { status: 500 });
  }
}

export const POST = run;
export const GET = run;
