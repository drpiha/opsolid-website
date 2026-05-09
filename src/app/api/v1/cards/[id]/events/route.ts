// =============================================================================
// POST /api/v1/cards/[id]/events — replace the card's event-attendance set.
//
// Body: { eventIds: string[] }
//
// Replace-set semantics: the card's existing EventAttendee rows are deleted,
// then re-created from the supplied list, all in a single transaction. This
// matches the chip multi-select UI on the edit form's Gelişmiş tab — what's
// checked is what's persisted.
//
// Auth: bearer-only. Card.userId === user.id; otherwise 404 (not 403) so the
// existence of arbitrary card IDs is not leaked.
//
// Validation: all referenced eventIds must exist + be active. Unknown IDs
// produce 400 unknown_event with the offending list returned in details.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[a-z0-9_-]{8,40}$/i;
const WRITE_RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// 0..50 events. Empty array is valid — clears the card's attendance.
const Body = z
  .object({
    eventIds: z.array(z.string().min(8).max(40)).max(50),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "cards:events:write",
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
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    const body = await readJsonBody(req);
    const parsed = Body.safeParse(body);
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

    const card = await prisma.cardOrder.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });
    if (!card || card.userId !== user.id) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    // De-dup the input — useful even though the unique index would catch
    // duplicates, because we'd rather 200 a user-resubmit than 409 it.
    const eventIds = Array.from(new Set(parsed.data.eventIds));

    if (eventIds.length > 0) {
      const valid = await prisma.event.findMany({
        where: { id: { in: eventIds }, isActive: true },
        select: { id: true },
      });
      const validSet = new Set(valid.map((e) => e.id));
      const unknown = eventIds.filter((id) => !validSet.has(id));
      if (unknown.length > 0) {
        return applyCors(
          errorJson(
            "unknown_event",
            "One or more event IDs are unknown or inactive.",
            400,
            undefined,
            { unknown },
          ),
          req,
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.eventAttendee.deleteMany({ where: { cardId: card.id } });
      if (eventIds.length > 0) {
        await tx.eventAttendee.createMany({
          data: eventIds.map((eventId) => ({ eventId, cardId: card.id })),
          skipDuplicates: true,
        });
      }
    });

    return applyCors(
      NextResponse.json(
        { ok: true, attendingEventIds: eventIds },
        { status: 200 },
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
    console.error("[v1/cards/:id/events] update failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
