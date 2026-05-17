// =============================================================================
// GET /api/inbox/channels — list the user's connected channels
// (powers the left rail of the unified inbox).
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { listChannelsForUser } from "@/lib/inbox/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const channels = await listChannelsForUser(user.id);

  // Cheap counts per channel — small set, single query per channel is fine
  // at SMB volume. If a user ever has 50+ channels we can groupBy in one
  // query, but at that point the UX has bigger problems than perf.
  const counts = await prisma.inboxThread.groupBy({
    by: ["channelId"],
    where: { userId: user.id, status: "open" },
    _sum: { unreadCount: true },
    _count: { _all: true },
  });
  const countMap = new Map(
    counts.map((c) => [
      c.channelId,
      { open: c._count._all, unread: c._sum.unreadCount ?? 0 },
    ]),
  );

  return NextResponse.json({
    channels: channels.map((c) => ({
      id: c.id,
      type: c.type,
      label: c.label,
      status: c.status,
      lastErrorAt: c.lastErrorAt,
      lastError: c.lastError,
      counts: countMap.get(c.id) ?? { open: 0, unread: 0 },
    })),
  });
}
