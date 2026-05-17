// =============================================================================
// POST /api/inbox/threads/[id]/read — mark all messages on the thread as read
// (zeroes unreadCount). Idempotent.
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { markThreadRead } from "@/lib/inbox/repository";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { id } = await context.params;
  const result = await markThreadRead(user.id, id);

  if (result.count === 0) {
    return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
