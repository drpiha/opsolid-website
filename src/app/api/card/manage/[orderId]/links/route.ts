// =============================================================================
// /api/card/manage/[orderId]/links — owner self-service short-link management.
//
// The admin-token twin lives at /api/admin/cards/[id]/links; this surface is
// gated by the per-order edit token (`?t=…`, same as the card editor) so card
// owners — including the account-less trade-fair case — can manage their own
// links without an operator.
//
// GET   — list links + scan counts
// POST  — create a link (optional desired code / label / UTM fields)
// PATCH — toggle a link on/off (soft, preserves scan history)
//
// Hard cap: MAX_LINKS_PER_CARD active+inactive links per order. Links are a
// per-card analytics tool, not a general URL shortener — the cap keeps a
// stolen edit token from minting unlimited redirect entries on our domain.
// Owner links may NOT set destinationUrl (admin-only): an open redirect from
// go.opsolid.de to arbitrary URLs is exactly what phishers hunt for.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";
import { hitWindow } from "@/lib/auth/rate-limit";
import { reserveShortCode } from "@/lib/short-code";
import { OrderStatus } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LINKS_PER_CARD = 20;

const CreateInput = z
  .object({
    label: z.string().trim().min(1).max(120).optional(),
    code: z.string().trim().min(3).max(64).optional(),
    source: z.string().trim().max(60).optional(),
    campaign: z.string().trim().max(60).optional(),
    medium: z.string().trim().max(60).optional(),
    eventName: z.string().trim().max(120).optional(),
  })
  .strict();

const ToggleInput = z
  .object({
    linkId: z.string().min(1).max(64),
    active: z.boolean(),
  })
  .strict();

function serialize(l: {
  id: string;
  code: string;
  label: string | null;
  source: string | null;
  campaign: string | null;
  medium: string | null;
  eventName: string | null;
  active: boolean;
  createdAt: Date;
}, scans: number) {
  return {
    id: l.id,
    code: l.code,
    label: l.label,
    source: l.source,
    campaign: l.campaign,
    medium: l.medium,
    eventName: l.eventName,
    active: l.active,
    scans,
    createdAt: l.createdAt.toISOString(),
  };
}

function clientKey(req: NextRequest, orderId: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `card-links:${orderId}:${ip}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const links = await prisma.cardLink.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { scanEvents: true } } },
    });

    return NextResponse.json({
      links: links.map((l) => serialize(l, l._count.scanEvents)),
      maxLinks: MAX_LINKS_PER_CARD,
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/manage links GET] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const limit = hitWindow(clientKey(req, order.id), 30, 60 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "rate_limited" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
        },
      );
    }

    if (order.status !== OrderStatus.PUBLISHED) {
      return NextResponse.json({ error: "not_published" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const parsed = CreateInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "invalid_input",
          detail: parsed.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const existing = await prisma.cardLink.count({
      where: { orderId: order.id },
    });
    if (existing >= MAX_LINKS_PER_CARD) {
      return NextResponse.json({ error: "link_limit_reached" }, { status: 400 });
    }

    let code: string;
    try {
      code = await reserveShortCode(parsed.data.code);
    } catch (err) {
      return NextResponse.json(
        {
          error: "code_unavailable",
          detail: err instanceof Error ? err.message : undefined,
        },
        { status: 400 },
      );
    }

    const link = await prisma.cardLink.create({
      data: {
        orderId: order.id,
        code,
        label: parsed.data.label,
        source: parsed.data.source,
        campaign: parsed.data.campaign,
        medium: parsed.data.medium,
        eventName: parsed.data.eventName,
      },
    });

    return NextResponse.json({ link: serialize(link, 0) });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/manage links POST] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const parsed = ToggleInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    // updateMany so the orderId scope is part of the WHERE — an owner can
    // never flip another card's link by guessing its id.
    const result = await prisma.cardLink.updateMany({
      where: { id: parsed.data.linkId, orderId: order.id },
      data: { active: parsed.data.active },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "link_not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/manage links PATCH] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
