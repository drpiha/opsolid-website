// =============================================================================
// GET  /api/inbox/playbooks            — list user's playbooks + catalog
// POST /api/inbox/playbooks            — create from a template
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { PLAYBOOK_CATALOG, getTemplate } from "@/lib/inbox/playbooks/registry";

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

  const playbooks = await prisma.inboxPlaybook.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    catalog: PLAYBOOK_CATALOG,
    playbooks: playbooks.map((p) => ({
      id: p.id,
      templateSlug: p.templateSlug,
      name: p.name,
      description: p.description,
      triggerType: p.triggerType,
      triggerConfig: p.triggerConfig,
      active: p.active,
      lastRunAt: p.lastRunAt,
      lastRunOk: p.lastRunOk,
      lastRunError: p.lastRunError,
      runCount: p.runCount,
      createdAt: p.createdAt,
    })),
  });
}

const CreateSchema = z.object({
  templateSlug: z.string().min(1),
  name: z.string().trim().min(1).max(120).optional(),
  triggerConfig: z.record(z.string(), z.unknown()).optional(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  const template = getTemplate(parsed.data.templateSlug);
  if (!template) {
    return NextResponse.json({ error: "unknown_template" }, { status: 400 });
  }

  const triggerConfig = {
    ...(template.defaultConfig ?? {}),
    ...(parsed.data.triggerConfig ?? {}),
  };

  const playbook = await prisma.inboxPlaybook.create({
    data: {
      userId: user.id,
      kind: "custom",
      templateSlug: template.slug,
      name: parsed.data.name ?? template.name,
      description: template.description,
      triggerType: template.triggerType,
      triggerConfig: triggerConfig as Prisma.InputJsonValue,
      steps: template.defaultSteps as Prisma.InputJsonValue,
      active: parsed.data.active ?? false,
    },
  });

  return NextResponse.json({
    ok: true,
    playbook: {
      id: playbook.id,
      templateSlug: playbook.templateSlug,
      name: playbook.name,
      triggerType: playbook.triggerType,
      active: playbook.active,
    },
  });
}
