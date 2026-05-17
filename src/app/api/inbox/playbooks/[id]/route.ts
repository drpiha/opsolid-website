// =============================================================================
// PATCH  /api/inbox/playbooks/[id]  — toggle active / rename / update config
// DELETE /api/inbox/playbooks/[id]  — remove
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import type { Prisma } from "@/generated/prisma";

export const runtime = "nodejs";

const Schema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  active: z.boolean().optional(),
  triggerConfig: z.record(z.string(), z.unknown()).optional(),
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

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  const data: Prisma.InboxPlaybookUpdateInput = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.active !== undefined) data.active = parsed.data.active;
  if (parsed.data.triggerConfig !== undefined) {
    data.triggerConfig = parsed.data.triggerConfig as Prisma.InputJsonValue;
  }

  const result = await prisma.inboxPlaybook.updateMany({
    where: { id, userId: user.id },
    data,
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "playbook_not_found" }, { status: 404 });
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
  const result = await prisma.inboxPlaybook.deleteMany({
    where: { id, userId: user.id },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "playbook_not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
