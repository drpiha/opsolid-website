// =============================================================================
// POST /api/card/owner-session — persist owner mode in an httpOnly cookie.
//
// Companion to OwnerSessionKeeper (the client component on /c/[slug] that
// strips `?owner=<editToken>` from the address bar). Stripping the token
// fixed the share-leak vector but made owner mode evaporate on refresh —
// the owner then saw the visitor view, "create your own card" banner
// included, on their own card. This endpoint validates the token once and
// stores it in a per-card httpOnly cookie so the server can keep rendering
// owner mode on later visits while the URL stays clean and shareable.
//
// Body: { orderId } — the token itself travels in `?t=` (same query-param
// gate as every other edit-token endpoint, via requireEditToken).
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";
import { hitWindow } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 days

const Body = z.object({ orderId: z.string().min(8).max(64) }).strict();

export function ownerCookieName(orderId: string): string {
  return `card_owner_${orderId}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = hitWindow(`owner-session:${ip}`, 30, 60 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const order = await requireEditToken(req, parsed.data.orderId);

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: ownerCookieName(order.id),
      value: order.editToken ?? "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/owner-session] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
