// =============================================================================
// Sprint F4 — Inbox messaging thread.
//
// GET  /api/v1/connections/[id]/messages
//   Returns { messages: [{ id, senderUserId, body, sentAt, readAt }] }, ordered
//   `sentAt` ascending. The requester must be one of the two sides of the
//   connection (i.e. owner of either `ownerCardId` or `visitorCardId`).
//   Side-effect: every unread message NOT sent by the requester is marked
//   read (readAt = now()) before returning. This double-duty (read + ack) is
//   intentional — the mobile thread re-fetches on send and on a 15s poll, so
//   "did the other side see it" is consistent without a dedicated ack route.
//
// POST /api/v1/connections/[id]/messages
//   Body: { body: string (1..2000) } — creates a message row from the
//   authenticated user. Same authorization rule as GET.
//
// Auth: bearer-only (mirrors the rest of /api/v1/*).
// Rate limit: 60 / hour read, 30 / hour write per user — generous on reads
// because the thread polls; tight on writes because chat is the highest-abuse
// surface in the app.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { notify } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[a-z0-9_-]{8,40}$/i;
const READ_RATE_MAX = 60;
const WRITE_RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const PostBody = z
  .object({
    body: z.string().trim().min(1).max(2000),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

/**
 * Public shape returned alongside the messages list to power the thread
 * header (avatar, name, latest pending action). Kept tight so the wire
 * doesn't grow into a generic card endpoint.
 */
type OtherParty = {
  cardId: string;
  slug: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
};

type PendingAction = {
  id: string;
  type: string;
  message: string | null;
  createdAt: string;
};

/**
 * Load the connection and verify the requester sits on one side of it.
 * Returns null when the connection doesn't exist or the user has no claim
 * to it (we conflate the two so we never leak the existence of arbitrary
 * connection IDs).
 *
 * Beyond authorization, the returned payload carries the bits the thread
 * header needs (the OTHER side's card public summary + the most recent
 * pending CardAction between the pair, if any).
 */
async function loadConnectionForUser(
  connectionId: string,
  userId: string,
): Promise<{
  id: string;
  ownerCardId: string;
  visitorCardId: string;
  other: OtherParty;
  pendingAction: PendingAction | null;
  /**
   * The OTHER side's user id, when the other card has an owner. Null for
   * orphan cards (no User attached). Used by the POST handler to fire a
   * push notification to the recipient.
   */
  otherUserId: string | null;
} | null> {
  const conn = await prisma.cardConnection.findUnique({
    where: { id: connectionId },
    select: {
      id: true,
      ownerCardId: true,
      visitorCardId: true,
      ownerCard: {
        select: {
          id: true,
          slug: true,
          contactName: true,
          photoPath: true,
          cardData: true,
          userId: true,
        },
      },
      visitorCard: {
        select: {
          id: true,
          slug: true,
          contactName: true,
          photoPath: true,
          cardData: true,
          userId: true,
        },
      },
    },
  });
  if (!conn) return null;
  const isOwner = conn.ownerCard.userId === userId;
  const isVisitor = conn.visitorCard.userId === userId;
  if (!isOwner && !isVisitor) return null;

  const otherCard = isOwner ? conn.visitorCard : conn.ownerCard;
  const data = (otherCard.cardData ?? {}) as Record<string, unknown>;
  const other: OtherParty = {
    cardId: otherCard.id,
    slug: otherCard.slug,
    name: otherCard.contactName ?? null,
    title: typeof data.title === "string" ? (data.title as string) : null,
    company:
      typeof data.company === "string" ? (data.company as string) : null,
    photoPath: otherCard.photoPath ?? null,
  };

  // The thread header surfaces an accept/decline affordance for the most
  // recent pending action between the two cards. We look in BOTH directions
  // so the receiver of any request_* action sees the pill regardless of
  // which side originally sent it. Returns null when nothing is pending.
  const pending = await prisma.cardAction.findFirst({
    where: {
      status: "pending",
      OR: [
        {
          senderCardId: conn.visitorCardId,
          receiverCardId: conn.ownerCardId,
        },
        {
          senderCardId: conn.ownerCardId,
          receiverCardId: conn.visitorCardId,
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      message: true,
      createdAt: true,
      receiverCard: { select: { userId: true } },
    },
  });
  // Only surface the pill when the requester is the action's RECEIVER —
  // the pill resolves the action, which only the receiver may do.
  const pendingAction =
    pending && pending.receiverCard.userId === userId
      ? {
          id: pending.id,
          type: pending.type,
          message: pending.message,
          createdAt: pending.createdAt.toISOString(),
        }
      : null;

  return {
    id: conn.id,
    ownerCardId: conn.ownerCardId,
    visitorCardId: conn.visitorCardId,
    other,
    pendingAction,
    otherUserId: otherCard.userId ?? null,
  };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "messages:read",
      req,
      user,
      READ_RATE_MAX,
      RATE_WINDOW_MS,
    );
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    if (!ID_RE.test(params.id)) {
      return applyCors(
        errorJson("not_found", "Connection not found.", 404),
        req,
      );
    }

    const conn = await loadConnectionForUser(params.id, user.id);
    if (!conn) {
      return applyCors(
        errorJson("not_found", "Connection not found.", 404),
        req,
      );
    }

    // Mark the other side's unread messages as read BEFORE selecting them, so
    // the response carries fresh `readAt` values rather than nulls that would
    // flip on the next poll.
    await prisma.message.updateMany({
      where: {
        connectionId: conn.id,
        senderUserId: { not: user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    const rows = await prisma.message.findMany({
      where: { connectionId: conn.id },
      orderBy: { sentAt: "asc" },
      select: {
        id: true,
        senderUserId: true,
        body: true,
        sentAt: true,
        readAt: true,
      },
    });

    const messages = rows.map((m) => ({
      id: m.id,
      senderUserId: m.senderUserId,
      body: m.body,
      sentAt: m.sentAt.toISOString(),
      readAt: m.readAt ? m.readAt.toISOString() : null,
    }));

    return applyCors(
      NextResponse.json(
        {
          messages,
          other: conn.other,
          pendingAction: conn.pendingAction,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      ),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/connections/:id/messages] list failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "messages:write",
      req,
      user,
      WRITE_RATE_MAX,
      RATE_WINDOW_MS,
    );
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    if (!ID_RE.test(params.id)) {
      return applyCors(
        errorJson("not_found", "Connection not found.", 404),
        req,
      );
    }

    const body = await readJsonBody(req);
    const parsed = PostBody.safeParse(body);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
          undefined,
          parsed.error.issues,
        ),
        req,
      );
    }

    const conn = await loadConnectionForUser(params.id, user.id);
    if (!conn) {
      return applyCors(
        errorJson("not_found", "Connection not found.", 404),
        req,
      );
    }

    const created = await prisma.message.create({
      data: {
        connectionId: conn.id,
        senderUserId: user.id,
        body: parsed.data.body,
      },
      select: {
        id: true,
        senderUserId: true,
        body: true,
        sentAt: true,
        readAt: true,
      },
    });

    // M4 — fire push to the OTHER side. Best-effort (notify never throws);
    // the response below is independent of fan-out outcome. We use the
    // sender's own name when available so the banner reads "Hasan: <body>".
    if (conn.otherUserId && conn.otherUserId !== user.id) {
      const senderName =
        user.name?.trim() ||
        user.email?.split("@")[0] ||
        "OpSo Smart";
      const preview =
        parsed.data.body.length > 140
          ? `${parsed.data.body.slice(0, 137)}…`
          : parsed.data.body;
      void notify({
        userId: conn.otherUserId,
        category: "messages",
        title: senderName,
        body: preview,
        data: { url: `verso://inbox/${conn.id}`, kind: "message" },
      });
    }

    return applyCors(
      NextResponse.json(
        {
          message: {
            id: created.id,
            senderUserId: created.senderUserId,
            body: created.body,
            sentAt: created.sentAt.toISOString(),
            readAt: created.readAt ? created.readAt.toISOString() : null,
          },
        },
        { status: 201 },
      ),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/connections/:id/messages] create failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
