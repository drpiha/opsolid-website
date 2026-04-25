// =============================================================================
// /api/admin/cards/[id]/sector — apply a sector preset to a card.
//
// Merges the preset's services / customButtons / FAQs into existing cardData
// only where the owner hasn't supplied their own. The owner's existing fields
// are NEVER overwritten — applying a preset twice produces the same result as
// applying it once.
//
// Auth: same browser ADMIN_TOKEN pattern as the rest of /api/admin/cards.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { applySectorPreset, getSectorPreset } from "@/config/card-sectors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const ApplyInput = z.object({
  sectorKey: z.string().trim().min(1).max(32),
  /** When true, also stamp the preset's primary/accent hex if the order has
   *  no brand colors set yet. Default: true (sane sector defaults). */
  applyColors: z.boolean().default(true),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = ApplyInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const preset = getSectorPreset(parsed.data.sectorKey);
  if (!preset) {
    return NextResponse.json({ error: "Unknown sector." }, { status: 400 });
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const existing = CardDataSchema.safeParse(order.cardData);
  if (!existing.success) {
    return NextResponse.json(
      { error: "Existing card data could not be parsed." },
      { status: 500 },
    );
  }

  const merged = applySectorPreset(existing.data, preset);

  await prisma.cardOrder.update({
    where: { id: order.id },
    data: {
      cardData: merged,
      brandPrimaryHex:
        parsed.data.applyColors && !order.brandPrimaryHex
          ? preset.primaryHex
          : order.brandPrimaryHex,
      brandAccentHex:
        parsed.data.applyColors && !order.brandAccentHex
          ? preset.accentHex
          : order.brandAccentHex,
    },
  });

  return NextResponse.json({
    ok: true,
    sectorKey: preset.key,
    sectorName: preset.name,
  });
}
