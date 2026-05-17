// =============================================================================
// POST /api/inbox/threads/[id]/messages — send an outbound reply
//
// Body: { body: string, sentBy?: "user" | "ai_auto" }
//   sentBy defaults to "user". "ai_auto" is reserved for the playbook runner.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { dispatchOutbound } from "@/lib/inbox/dispatch";

export const runtime = "nodejs";

const Schema = z.object({
  body: z.string().trim().min(1).max(8000),
  sentBy: z.enum(["user", "ai_auto"]).optional(),
});

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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  try {
    const result = await dispatchOutbound({
      userId: user.id,
      threadId: id,
      body: parsed.data.body,
      sentBy: parsed.data.sentBy ?? "user",
    });
    return NextResponse.json({
      ok: true,
      messageId: result.messageId,
      status: result.status,
    });
  } catch (err) {
    const description = err instanceof Error ? err.message : "dispatch_failed";
    if (description === "thread_not_found") {
      return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "dispatch_failed", description },
      { status: 500 },
    );
  }
}
