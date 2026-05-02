// =============================================================================
// GET /api/auth/me — Faz 7.0a.
//
// Returns the authenticated user's profile. Used by both the web SPA (after
// /api/auth/refresh resolves) and the mobile app (with Bearer JWT) as the
// canonical "who am I" endpoint.
//
// Never cached — auth state changes need to be visible immediately.
// =============================================================================

import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth/require-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await requireUser(req);
    return NextResponse.json(
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
    );
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    return NextResponse.json(
      { error: { code: "server_error", message: "Internal error." } },
      { status: 500 },
    );
  }
}
