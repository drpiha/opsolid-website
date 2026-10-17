// =============================================================================
// GET /api/auth/status — site-chrome session probe.
//
// Same resolution as /api/auth/me, but an anonymous visitor gets 200 with
// `{ user: null }` instead of 401. The marketing header calls this on every
// page; a 401 there is an expected state, not an error, and it showed up as a
// console error on every anonymous page view. /api/auth/me keeps its 401
// contract for the mobile app and other callers.
// =============================================================================

import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth/require-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0, must-revalidate" };

export async function GET(req: Request) {
  try {
    const user = await requireUser(req);
    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name, locale: user.locale, role: user.role } },
      { status: 200, headers: NO_STORE },
    );
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ user: null }, { status: 200, headers: NO_STORE });
    return NextResponse.json({ user: null }, { status: 200, headers: NO_STORE });
  }
}
