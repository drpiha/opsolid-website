// =============================================================================
// Phase 8.5 — Send a structured action request to a card owner.
//
// POST /api/cards/[slug]/actions
//   Body: { type, senderSlug, message? }
//   Requires authentication. Sender must own a PUBLISHED card.
//   Receiver card ([slug]) must be PUBLISHED.
//   One pending action per (senderCard, receiverCard, type) — 409 on duplicate.
//
// Security:
//   - Authentication enforced (AuthError → 401).
//   - Sender card ownership verified against authenticated user.
//   - Cannot send action to own card (400 cannot_action_own_card).
//   - Message capped at 1000 chars by schema.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import { notify } from "@/lib/push";
import { z } from "zod";

export const runtime = "nodejs";

const ACTION_TYPES = [
  "request_contact",
  "request_quote",
  "request_meeting",
  "ask_collaboration",
  "send_card",
] as const;

const SendActionSchema = z.object({
  type: z.enum(ACTION_TYPES),
  // senderSlug: the sender's own published card slug
  senderSlug: z.string().min(1).max(100),
  message: z.string().max(1000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = SendActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Verify receiver card exists and is published
  const receiverCard = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, userId: true, contactName: true },
  });
  if (!receiverCard || receiverCard.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Verify sender card belongs to authenticated user and is published
  const senderCard = await prisma.cardOrder.findUnique({
    where: { slug: parsed.data.senderSlug },
    select: { id: true, status: true, userId: true, contactName: true },
  });
  if (
    !senderCard ||
    senderCard.status !== "PUBLISHED" ||
    senderCard.userId !== user.id
  ) {
    return NextResponse.json({ error: "sender_card_invalid" }, { status: 400 });
  }

  if (senderCard.id === receiverCard.id) {
    return NextResponse.json(
      { error: "cannot_action_own_card" },
      { status: 400 },
    );
  }

  // Prevent duplicate pending action of same type from same sender to same receiver
  const existing = await prisma.cardAction.findFirst({
    where: {
      senderCardId: senderCard.id,
      receiverCardId: receiverCard.id,
      type: parsed.data.type,
      status: "pending",
    },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "duplicate_pending" }, { status: 409 });
  }

  const action = await prisma.cardAction.create({
    data: {
      senderCardId: senderCard.id,
      receiverCardId: receiverCard.id,
      type: parsed.data.type,
      message: parsed.data.message ?? null,
    },
    select: { id: true, type: true, status: true, createdAt: true },
  });

  // M4 — push to the receiver. Only fire when the receiver card is owned by
  // a User account (orphan cards from pre-account orders have no inbox to
  // push into). Best-effort; notify() never throws.
  if (receiverCard.userId && receiverCard.userId !== user.id) {
    const senderName =
      senderCard.contactName?.trim() ||
      user.name?.trim() ||
      user.email?.split("@")[0] ||
      "Verso";
    const typeLabel: Record<string, string> = {
      request_contact: "wants to connect",
      request_quote: "requested a quote",
      request_meeting: "requested a meeting",
      ask_collaboration: "proposed a collaboration",
      send_card: "shared their card",
    };
    const verb = typeLabel[parsed.data.type] ?? "sent you a request";
    void notify({
      userId: receiverCard.userId,
      category: "inboxRequests",
      title: senderName,
      body: parsed.data.message?.trim() || verb,
      data: { url: "verso://inbox", kind: "inbox_action", actionId: action.id },
    });
  }

  return NextResponse.json(action, { status: 201 });
}
