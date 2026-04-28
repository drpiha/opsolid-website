// =============================================================================
// /api/orders/slug-available?s=<slug>
//
// Public, read-only endpoint the order form polls (debounced) to tell the
// customer whether their typed slug is free. We rate-limit per IP because the
// endpoint is unauthenticated and an attacker could otherwise enumerate the
// entire allocated namespace cheaply.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { validateManualSlug, isSlugAvailable } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 30;
const buckets = new Map<string, number[]>();

function visitorIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const first = xff.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "opsolid";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex").slice(0, 24);
}

function checkRate(key: string): boolean {
  const now = Date.now();
  const fresh = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (fresh.length >= MAX_PER_WINDOW) {
    buckets.set(key, fresh);
    return false;
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return true;
}

export async function GET(req: NextRequest) {
  if (!checkRate(hashIp(visitorIp(req)))) {
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      { status: 429 },
    );
  }

  const slug = (req.nextUrl.searchParams.get("s") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ ok: false, reason: "empty" }, { status: 400 });
  }

  const v = validateManualSlug(slug);
  if (!v.ok) {
    return NextResponse.json({ ok: false, reason: v.reason }, { status: 200 });
  }

  const available = await isSlugAvailable(v.slug);
  return NextResponse.json(
    { ok: true, slug: v.slug, available },
    { status: 200 },
  );
}
