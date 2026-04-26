// =============================================================================
// POST /api/cards/[slug]/exchange
//
// Smart Exchange — a visitor who *also* owns a published OpSolid card hits
// someone else's /c/<slug> and presses "Kartımı Gönder". This creates a
// card-to-card CardConnection row (owner = the slug being viewed, visitor =
// the visitor's own slug) so the owner can see who scanned/visited their card
// and reciprocate offline.
//
// The flow is opt-in (visitor must already own a PUBLISHED card), idempotent
// (upsert on (ownerCardId, visitorCardId) compound unique), and rate-limited
// (3 requests / hour per slug-pair). Both cards must be PUBLISHED — we 404
// otherwise so we don't leak the existence of pending/cancelled orders.
//
// Companion to /api/cards/[slug]/lead which writes a free-form CardLead row
// for visitors WITHOUT their own card. This route writes a structured
// CardConnection that links two existing cards.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { dispatchWebhook } from "@/lib/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ExchangeInputSchema = z.object({
  visitorSlug: z.string().trim().min(1).max(120),
  source: z.string().trim().max(60).optional(),
  campaign: z.string().trim().max(60).optional(),
  note: z.string().trim().max(500).optional(),
});

// Per-pair rate limit. The exchange surface is naturally low-abuse (both ends
// require a PUBLISHED card), but we still cap retries at 3/hour per
// (owner, visitor) pair to absorb accidental double-clicks and bot scripting.
// Stored in a process-local Map — fine for single-container deploys; revisit
// if we move to multi-instance.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateBucket = new Map<string, number[]>();

function rateLimitKey(ownerSlug: string, visitorSlug: string): string {
  return `${ownerSlug}::${visitorSlug}`;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBucket.get(key) ?? [];
  const fresh = bucket.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_MAX) {
    rateBucket.set(key, fresh);
    return false;
  }
  fresh.push(now);
  rateBucket.set(key, fresh);
  return true;
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const ownerSlug = params.slug;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = ExchangeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Eingabe ungültig." },
      { status: 400 },
    );
  }

  const visitorSlug = parsed.data.visitorSlug;

  const owner = await prisma.cardOrder.findUnique({
    where: { slug: ownerSlug },
    select: { id: true, status: true },
  });
  if (!owner || owner.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 });
  }

  const visitor = await prisma.cardOrder.findUnique({
    where: { slug: visitorSlug },
    select: { id: true, status: true },
  });
  if (!visitor || visitor.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 });
  }

  if (owner.id === visitor.id) {
    return NextResponse.json(
      { error: "Cannot exchange with yourself." },
      { status: 400 },
    );
  }

  // Rate limit AFTER lookups so 429 doesn't leak slug existence; both cards
  // are confirmed PUBLISHED at this point so the limit is purely abuse control.
  if (!checkRateLimit(rateLimitKey(ownerSlug, visitorSlug))) {
    return NextResponse.json({ error: "Zu viele Anfragen." }, { status: 429 });
  }

  const result = await prisma.cardConnection.upsert({
    where: {
      ownerCardId_visitorCardId: {
        ownerCardId: owner.id,
        visitorCardId: visitor.id,
      },
    },
    create: {
      ownerCardId: owner.id,
      visitorCardId: visitor.id,
      source: parsed.data.source,
      campaign: parsed.data.campaign,
      note: parsed.data.note,
      status: "new",
    },
    update: { updatedAt: new Date() },
  });

  // Distinguish a freshly-created row from a touched-existing one. On INSERT,
  // Prisma sets createdAt and updatedAt to the same instant; on UPDATE, the
  // row's createdAt is older than its just-bumped updatedAt. A 1ms tolerance
  // covers clock drift / DB precision quirks.
  const existing =
    result.updatedAt.getTime() - result.createdAt.getTime() > 1;

  // Only fire the outbound webhook on the first-time creation path. Repeat
  // exchanges of the same (owner, visitor) pair re-touch the existing row
  // and would otherwise duplicate-notify the customer's CRM.
  if (!existing) {
    dispatchWebhook(owner.id, "connection.created", {
      id: result.id,
      ownerCardId: result.ownerCardId,
      visitorCardId: result.visitorCardId,
      source: result.source,
      campaign: result.campaign,
      eventName: result.eventName,
      note: result.note,
      status: result.status,
      createdAt: result.createdAt.toISOString(),
    });
  }

  return NextResponse.json(
    existing ? { ok: true, existing: true } : { ok: true },
  );
}
