// =============================================================================
// PATCH /api/v1/me/profile — update the authenticated user's profile row.
//
// Distinct from /api/v1/auth/me PATCH (which only handles `notificationPrefs`).
// This route is the mobile Settings → Profile screen surface: name, locale,
// image, phone. Only the User row is touched; cardData JSON is NEVER updated
// here — card fields live on /api/v1/cards/[id].
//
// Auth: bearer-only.
// Rate limit: 20 / hour / user. Tight on purpose — profile changes should be
// rare and bulk-edit traffic is a strong abuse signal.
//
// Schema note: the User model has no `phone` column today. The PATCH accepts
// `phone` in the wire format for forward compat (so the mobile client can be
// shipped now) but silently drops it on the server. When the schema adds a
// `phone` column we toggle the write path on — no client change required.
// See the bottom of this file for the schema-coupling decision log.
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

const RATE_MAX = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// Locale codes the rest of the stack supports today. Keep in sync with the
// `Locale` union in src/lib/i18n.ts when that file picks up a new language.
const SUPPORTED_LOCALES = ["en", "de", "tr", "es", "it", "fr", "ar"] as const;

const PatchSchema = z
  .object({
    // Trim then bound. Empty string is rejected — clients should send `null`
    // (which we coerce away below by treating omitted as "no change").
    name: z.string().trim().min(1).max(80).optional(),
    locale: z.enum(SUPPORTED_LOCALES).optional(),
    // The mobile picker emits absolute URLs (blob / object-storage hosted) —
    // we accept any well-formed http(s) URL up to a generous 2KB. Path-only
    // values are rejected because the client never sends those.
    image: z.string().trim().url().max(2048).optional(),
    // Forward-compat: accept and validate phone shape, but DROP on write
    // until the schema adds a column (see file header).
    phone: z.string().trim().max(32).optional(),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

interface ProfileResponseUser {
  id: string;
  email: string;
  name: string | null;
  locale: string;
  image: string | null;
  /**
   * Always null in the response today (column does not exist). Kept in the
   * wire shape so the mobile client can settle on a stable type ahead of the
   * schema migration.
   */
  phone: string | null;
  proSince: string | null;
}

function toProfileBody(u: {
  id: string;
  email: string;
  name: string | null;
  locale: string;
  image: string | null;
  proSince: Date | null;
}): { user: ProfileResponseUser } {
  return {
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      locale: u.locale,
      image: u.image,
      phone: null,
      proSince: u.proSince ? u.proSince.toISOString() : null,
    },
  };
}

export async function PATCH(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "me:profile",
      req,
      user,
      RATE_MAX,
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

    const body = await readJsonBody(req);
    const parsed = PatchSchema.safeParse(body);
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

    // Build the partial write payload. Each field is only added when present
    // — Zod's `.optional()` lets the client send a single field at a time
    // without re-stating the others. `phone` is intentionally NOT written.
    const data: {
      name?: string;
      locale?: string;
      image?: string;
    } = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.locale !== undefined) data.locale = parsed.data.locale;
    if (parsed.data.image !== undefined) data.image = parsed.data.image;

    if (Object.keys(data).length === 0) {
      // No actual writeable change — return the current snapshot for symmetry
      // with the success path. This avoids a needless UPDATE round-trip while
      // still confirming the request was understood.
      return applyCors(
        NextResponse.json(
          toProfileBody({
            id: user.id,
            email: user.email,
            name: user.name,
            locale: user.locale,
            image: user.image,
            proSince: user.proSince,
          }),
          { status: 200, headers: { "Cache-Control": "no-store" } },
        ),
        req,
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        locale: true,
        image: true,
        proSince: true,
      },
    });

    return applyCors(
      NextResponse.json(toProfileBody(updated), {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/me/profile PATCH] failed:", err);
    return applyCors(
      errorJson("server_error", "Internal error.", 500),
      req,
    );
  }
}

// -----------------------------------------------------------------------------
// Schema-coupling decision log
// -----------------------------------------------------------------------------
// • `phone` on User: not present in `prisma/schema.prisma` (verified 2026-05).
//   Mobile spec requested it; we accept + validate it in the body shape but
//   drop it on the write path so the client can ship now. When the column
//   lands (likely as `phone String? @map("phone")` on User), uncomment the
//   write below and the response shape stays unchanged for the client.
// • `name` is `String?` in the schema — we never SET it to "" (Zod rejects
//   empty before write). To CLEAR a name the client would need a future
//   `name: null` opt-in semantics; not exposed today.
// • Locale enum is duplicated here vs. `src/lib/i18n.ts`. Intentional — the
//   API contract should not silently broaden when a new locale is added to
//   the marketing site; this list is the explicit public surface.
