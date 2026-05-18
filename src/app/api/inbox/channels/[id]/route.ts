// =============================================================================
// PATCH  /api/inbox/channels/[id] — toggle pause/active, rename
// DELETE /api/inbox/channels/[id] — disconnect + wipe threads (cascade)
//
// Both are user-scoped: a channel belonging to another account returns 404.
// Telegram channels also tear down their Telegram-side webhook on delete so
// stale bot instances stop hammering our endpoint after disconnect.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";
import {
  deleteChannelForUser,
  updateChannelForUser,
} from "@/lib/inbox/repository";
import {
  deleteWebhook as deleteTelegramWebhook,
  type TelegramConfig,
} from "@/lib/inbox/channels/telegram/client";

export const runtime = "nodejs";

const PatchSchema = z.object({
  status: z.enum(["active", "paused"]).optional(),
  label: z.string().trim().min(1).max(80).optional(),
});

export async function PATCH(
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
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  const result = await updateChannelForUser(user.id, id, parsed.data);
  if (result.count === 0) {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
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

  // Look up the channel before the delete so we can tear down provider-side
  // resources (Telegram webhook). Best-effort — tearing those down failing
  // must not prevent the DB delete; otherwise broken Telegram tokens trap
  // the row forever.
  const channel = await prisma.inboxChannel.findFirst({
    where: { id, userId: user.id },
  });
  if (!channel) {
    return NextResponse.json({ error: "channel_not_found" }, { status: 404 });
  }

  if (channel.type === "telegram") {
    const config = (channel.config ?? {}) as Partial<TelegramConfig>;
    if (config.botToken) {
      try {
        await deleteTelegramWebhook({ botToken: config.botToken });
      } catch (err) {
        console.warn("[inbox/channels/delete] Telegram deleteWebhook failed", err);
      }
    }
  }

  const result = await deleteChannelForUser(user.id, id);
  return NextResponse.json({
    ok: true,
    removed: result.count,
  });
}
