// =============================================================================
// /api/domain-resolve/[host] — public DNS-style resolver for custom domains.
//
// Called from middleware (edge runtime, no Prisma) on every request whose
// Host header is NOT one of our known hosts. Returns the slug of the
// PUBLISHED card whose verified customDomain matches the host, or 404.
//
// Caching: short s-maxage so admin "Verify now" → public visit propagates
// quickly, but each rewrite doesn't hammer Postgres.
//
// Phase 6 — Custom Domain (Part A).
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
};

// Permissive enough to accept any registrable name (sub.example.co.uk)
// without admitting raw IPs / ports / unicode (those must be handled by
// the admin UI before save anyway).
const HOST_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/;

export async function GET(
  _req: Request,
  { params }: { params: { host: string } },
) {
  const raw = decodeURIComponent(params.host ?? "").toLowerCase().trim();

  if (!raw || !HOST_RE.test(raw)) {
    return NextResponse.json(
      { error: "not_configured" },
      { status: 404, headers: CACHE_HEADERS },
    );
  }

  const order = await prisma.cardOrder.findFirst({
    where: {
      customDomain: raw,
      customDomainVerified: true,
      status: "PUBLISHED",
    },
    select: { slug: true },
  });

  if (!order || !order.slug) {
    return NextResponse.json(
      { error: "not_configured" },
      { status: 404, headers: CACHE_HEADERS },
    );
  }

  return NextResponse.json({ slug: order.slug }, { headers: CACHE_HEADERS });
}
