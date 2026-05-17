// =============================================================================
// POST /api/inbox/demo/seed   — populate demo channels + threads + messages
// POST /api/inbox/demo/clear  — remove every demo row owned by the user
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { seedDemoForUser } from "@/lib/inbox/demo/seed";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const counts = await seedDemoForUser(user.id);
  return NextResponse.json({ ok: true, ...counts });
}
