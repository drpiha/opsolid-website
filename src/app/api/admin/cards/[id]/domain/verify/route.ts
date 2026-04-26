// =============================================================================
// /api/admin/cards/[id]/domain/verify — DNS-verify the saved custom domain.
//
// Checks that the customer's CNAME points at card.opsolid.de (exactly, or
// any subdomain ending in .card.opsolid.de). Sets customDomainVerified +
// customDomainVerifiedAt on success.
//
// Failure modes are non-mutating: if DNS resolution fails or returns a
// non-matching target, we return verified=false with the records we found
// and a hint, but we do NOT clear an already-verified flag — that prevents
// a transient DNS hiccup from disabling a working customer domain. To
// disable, the admin POSTs to /domain with { domain: null }.
//
// Auth: same ?token= / x-admin-token pattern as the rest of /api/admin/cards.
//
// Phase 6 — Custom Domain (Part A).
// =============================================================================

import { NextResponse } from "next/server";
import { promises as dns } from "dns";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const TARGET = "card.opsolid.de";
const TARGET_SUFFIX = ".card.opsolid.de";

function matchesTarget(record: string): boolean {
  // resolveCname returns hostnames without trailing dot; lowercase to be safe.
  const r = record.trim().replace(/\.$/, "").toLowerCase();
  return r === TARGET || r.endsWith(TARGET_SUFFIX);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
    select: { id: true, customDomain: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (!order.customDomain) {
    return NextResponse.json(
      { error: "No custom domain set for this card." },
      { status: 400 },
    );
  }

  const records = await dns
    .resolveCname(order.customDomain)
    .catch(() => [] as string[]);

  const verified = records.some(matchesTarget);

  if (!verified) {
    return NextResponse.json({
      ok: true,
      verified: false,
      records,
      hint: `Add a CNAME pointing ${order.customDomain} → ${TARGET}`,
    });
  }

  const updated = await prisma.cardOrder.update({
    where: { id: order.id },
    data: {
      customDomainVerified: true,
      customDomainVerifiedAt: new Date(),
    },
    select: {
      customDomain: true,
      customDomainVerified: true,
      customDomainVerifiedAt: true,
    },
  });

  return NextResponse.json({
    ok: true,
    verified: true,
    records,
    customDomain: updated.customDomain,
    customDomainVerifiedAt: updated.customDomainVerifiedAt,
  });
}
