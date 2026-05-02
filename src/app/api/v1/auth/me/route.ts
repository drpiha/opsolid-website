// =============================================================================
// GET /api/v1/auth/me — bearer-only "who am I" probe.
//
// Mirrors /api/auth/me but rejects cookie auth. Mobile / 3rd-party clients use
// this to validate the access token + retrieve the canonical user profile.
// Never cached.
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const user = await requireBearerUser(req);
    return applyCors(
      NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            locale: user.locale,
            emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
          },
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        },
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
    return applyCors(
      errorJson("server_error", "Internal error.", 500),
      req,
    );
  }
}
