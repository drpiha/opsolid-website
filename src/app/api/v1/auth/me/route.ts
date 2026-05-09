// =============================================================================
// GET / PATCH /api/v1/auth/me — bearer-only "who am I" probe + profile update.
//
// Mirrors /api/auth/me but rejects cookie auth. Mobile / 3rd-party clients use
// this to validate the access token + retrieve the canonical user profile.
// Never cached.
//
// PATCH currently accepts a single field group:
//   - `notificationPrefs`: M4 push category toggles (JSON object).
// More fields can be added additively without bumping the route.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// M4 — push notification category toggles. Schema is intentionally lenient
// (`.partial()`) so the client can PATCH a single field without re-sending the
// whole object. Unknown keys are dropped via `.strict()`.
const NotificationPrefsSchema = z
  .object({
    messages: z.boolean().optional(),
    inboxRequests: z.boolean().optional(),
    mutualSaves: z.boolean().optional(),
    eventReminders: z.boolean().optional(),
  })
  .strict();

const PatchSchema = z
  .object({
    notificationPrefs: NotificationPrefsSchema.optional(),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

function userBody(user: {
  id: string;
  email: string;
  name: string | null;
  // M7 — avatar URL. Set on Google sign-in (OIDC picture claim), via social-
  // profile enrichment, or by direct upload. Optional in the prop type so
  // older callers (legacy code paths) compile without retro-fitting.
  image?: string | null;
  locale: string;
  emailVerifiedAt: Date | null;
  notificationPrefs: unknown;
  proSince?: Date | null;
}) {
  const proSince = user.proSince ?? null;
  const isProNow = proSince !== null && proSince <= new Date();
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      // M7 — null when unset; mobile UI falls back to initials.
      image: user.image ?? null,
      locale: user.locale,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      // Default-on shape so the mobile Settings UI never has to special-case
      // a fresh user with `notificationPrefs === null`.
      notificationPrefs: {
        messages: true,
        inboxRequests: true,
        mutualSaves: true,
        eventReminders: true,
        ...((user.notificationPrefs as Record<string, boolean> | null) ?? {}),
      },
      // M5 — Pro tier flags. Mobile gates feature CTAs on `isPro`.
      isPro: isProNow,
      proSince: proSince ? proSince.toISOString() : null,
    },
  };
}

export async function GET(req: Request) {
  try {
    const user = await requireBearerUser(req);
    return applyCors(
      NextResponse.json(userBody(user), {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
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
    return applyCors(
      errorJson("server_error", "Internal error.", 500),
      req,
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireBearerUser(req);
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

    // Merge incoming partial prefs into the existing JSON column. Reading
    // first lets us keep keys we don't yet expose in the schema (forward-
    // compat with future categories).
    const updateData: { notificationPrefs?: Record<string, boolean> } = {};
    if (parsed.data.notificationPrefs) {
      const existing =
        ((user.notificationPrefs as Record<string, boolean> | null) ?? {});
      updateData.notificationPrefs = {
        ...existing,
        ...parsed.data.notificationPrefs,
      };
    }

    if (Object.keys(updateData).length === 0) {
      // Nothing to change — return the current snapshot for symmetry with GET.
      return applyCors(
        NextResponse.json(userBody(user), { status: 200 }),
        req,
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        // M7 — avatar URL passed through to the response so the mobile
        // Settings screen sees the same shape after PATCH as after GET.
        image: true,
        locale: true,
        emailVerifiedAt: true,
        notificationPrefs: true,
        proSince: true,
      },
    });

    return applyCors(
      NextResponse.json(userBody(updated), {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
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
    console.error("[v1/auth/me PATCH] failed:", err);
    return applyCors(
      errorJson("server_error", "Internal error.", 500),
      req,
    );
  }
}
