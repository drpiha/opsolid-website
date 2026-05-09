// =============================================================================
// POST /api/v1/contacts/sample-seed — idempotently save 5 demo cards into the
// authenticated user's saved-contacts list.
//
// Body (optional): { slugs: string[] } — defaults to the 5 DACH/EU SME demo
// personas seeded by `scripts/seed-public-cards.ts`. The defaults are picked
// to be the most relatable/useful for a German-market founder testing the app
// with an empty Contacts tab.
//
// Behaviour:
//   - Auth: bearer-only.
//   - For each slug, looks up the corresponding PUBLISHED CardOrder. Cards
//     that don't exist (or aren't published, or are private and not owned by
//     this user) are silently skipped — they count as `notFound`.
//   - The user's own card is silently skipped (the SavedCard model's
//     "cannot save own card" rule still applies).
//   - Idempotent via the `userId_cardOrderId` compound unique on SavedCard:
//     if the user already saved a slug, that one counts as `alreadyHad`.
//
// Returns: { created, alreadyHad, notFound, slugsCreated, slugsAlreadyHad,
//            slugsNotFound }
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

const WRITE_RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// DACH/EU SME demo personas — most relatable to a German-market founder
// poking around an otherwise-empty Contacts tab. Kept in sync with the slugs
// seeded by `scripts/seed-public-cards.ts`.
const DEFAULT_SLUGS = [
  "christine-mueller",
  "markus-schmidt",
  "aylin-yildiz",
  "mehmet-aydin",
  "tobias-bauer",
] as const;

const Body = z
  .object({
    slugs: z
      .array(z.string().trim().min(1).max(80))
      .min(1)
      .max(20)
      .optional(),
  })
  .strict()
  .optional();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "contacts:sample-seed",
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

    // Body is optional — empty POST means "use defaults".
    const raw = await readJsonBody(req).catch(() => null);
    const parsed = Body.safeParse(raw ?? undefined);
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

    const requested = Array.from(
      new Set(parsed.data?.slugs ?? [...DEFAULT_SLUGS]),
    );

    // Look up all candidate cards in one query; skip non-published / private
    // cards owned by someone else / the user's own card. The mobile UI lists
    // these only as "notFound" so we don't surface implementation details.
    const cards = await prisma.cardOrder.findMany({
      where: {
        slug: { in: requested },
        status: "PUBLISHED",
      },
      select: {
        id: true,
        slug: true,
        userId: true,
        visibility: true,
      },
    });

    const slugsCreated: string[] = [];
    const slugsAlreadyHad: string[] = [];
    const slugsNotFound: string[] = [];

    for (const slug of requested) {
      const card = cards.find((c) => c.slug === slug);
      if (
        !card ||
        card.userId === user.id ||
        (card.visibility === "private" && card.userId !== user.id)
      ) {
        slugsNotFound.push(slug);
        continue;
      }

      // Idempotent upsert. The composite unique index makes the no-op update
      // path a single round trip; we read back createdAt to distinguish a
      // brand-new save from an existing one.
      const before = await prisma.savedCard.findUnique({
        where: {
          userId_cardOrderId: { userId: user.id, cardOrderId: card.id },
        },
        select: { id: true },
      });

      if (before) {
        slugsAlreadyHad.push(slug);
        continue;
      }

      await prisma.savedCard.create({
        data: { userId: user.id, cardOrderId: card.id },
        select: { id: true },
      });
      slugsCreated.push(slug);
    }

    return applyCors(
      NextResponse.json(
        {
          created: slugsCreated.length,
          alreadyHad: slugsAlreadyHad.length,
          notFound: slugsNotFound.length,
          slugsCreated,
          slugsAlreadyHad,
          slugsNotFound,
        },
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
    console.error("[v1/contacts/sample-seed] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
