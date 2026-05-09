// =============================================================================
// POST /api/cards/[slug]/unlock — visitor enters password to unlock a
// password-protected public card.
//
// On success: sets a 24h `verso_unlock_<slug>` cookie. The public viewer
// reads this cookie SSR-side and renders the actual card content. On
// failure: returns 401 `wrong_password`.
//
// Rate limit: 30 / hour / IP — generous enough for forgetful visitors,
// tight enough that brute-force is impractical (24-char password space at
// 30 tries/hour is multi-decade).
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/auth/password";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import {
  unlockCookieName,
  UNLOCK_COOKIE_MAX_AGE_S,
} from "@/lib/cards/unlock-cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const BodySchema = z
  .object({
    password: z.string().min(1).max(200),
  })
  .strict();

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const ip = clientIp(req);
    const rl = hitWindow(`unlock::${ip}::${slug}`, RATE_MAX, RATE_WINDOW_MS);
    if (!rl.ok) {
      return NextResponse.json(
        { error: { code: "rate_limited", message: "Too many attempts." } },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) },
        },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "invalid_payload", message: "Invalid payload." } },
        { status: 400 },
      );
    }

    const order = await prisma.cardOrder.findUnique({
      where: { slug },
      select: { cardData: true, status: true },
    });
    if (!order || order.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: { code: "not_found", message: "Card not found." } },
        { status: 404 },
      );
    }

    const cd = CardDataSchema.safeParse(order.cardData);
    const stored =
      cd.success && typeof (cd.data as Record<string, unknown>).password === "string"
        ? ((cd.data as Record<string, unknown>).password as string)
        : null;

    if (!stored) {
      return NextResponse.json(
        { error: { code: "no_password", message: "Card has no password." } },
        { status: 400 },
      );
    }

    const matches = await verifyPassword(parsed.data.password, stored);
    if (!matches) {
      return NextResponse.json(
        { error: { code: "wrong_password", message: "Wrong password." } },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set({
      name: unlockCookieName(slug),
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: UNLOCK_COOKIE_MAX_AGE_S,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (err) {
    console.error("[cards/:slug/unlock] failed:", err);
    return NextResponse.json(
      { error: { code: "server_error", message: "Internal error." } },
      { status: 500 },
    );
  }
}
