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

// Only the middleware's loopback call needs this answer: never let a shared
// cache or CDN keep it (and turn the route into a public GeoIP service).
const CACHE_HEADERS = {
  "Cache-Control": "private, no-store",
};

// Cheap shape check (IPv4 / IPv6 characters only); anything else is not looked up.
const IP_SHAPE = /^[0-9A-Fa-f:.]{2,45}$/;

export async function GET(req: Request) {
  const ip = (new URL(req.url).searchParams.get("ip") || "").trim();
  if (!IP_SHAPE.test(ip)) return NextResponse.json({ country: null }, { headers: CACHE_HEADERS });
  try {
    const country = await countryForIp(ip);
    return NextResponse.json({ country }, { headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ country: null }, { headers: CACHE_HEADERS });
  }
}
