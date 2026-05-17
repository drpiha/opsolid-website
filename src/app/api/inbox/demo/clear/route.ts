// =============================================================================
// POST /api/inbox/demo/clear — remove demo data for the authenticated user
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { clearDemoForUser } from "@/lib/inbox/demo/seed";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const removed = await clearDemoForUser(user.id);
  return NextResponse.json({ ok: true, removedChannels: removed });
}
