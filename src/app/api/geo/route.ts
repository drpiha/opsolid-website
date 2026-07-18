// =============================================================================
// /api/geo?ip=<addr> — resolve a client IP to an ISO country code.
//
// Called from the edge middleware (which cannot read the on-disk GeoIP DB
// itself) via an internal fetch, exactly like /api/domain-resolve. Returns
// { country: "DE" } / { country: null }. Country resolution is the signal the
// middleware turns into a locale (TR → tr, DACH → de, else → en).
//
// Runs on the Node runtime because the lookup touches the filesystem + the
// `maxmind` reader. Fail-safe: any error resolves to { country: null } so a
// geo miss never blocks navigation — the middleware just falls back to English.
// =============================================================================

import { NextResponse } from "next/server";
import { countryForIp } from "@/lib/geo/country-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cache per-IP result at the edge/CDN for a day; the country of an IP is
// extremely stable, and the middleware already short-circuits repeat visits
// via the OPSOLID_LOCALE cookie, so this is mostly belt-and-suspenders.
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
};

export async function GET(req: Request) {
  const ip = (new URL(req.url).searchParams.get("ip") || "").trim();
  try {
    const country = await countryForIp(ip);
    return NextResponse.json({ country }, { headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ country: null }, { headers: CACHE_HEADERS });
  }
}
