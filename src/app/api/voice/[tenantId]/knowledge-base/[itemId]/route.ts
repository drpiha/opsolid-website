import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const UpdateKnowledgeBaseItemZ = z
  .object({
    itemType: z
      .enum(["faq", "menu", "pricing", "policy", "team", "location", "custom"])
      .optional(),
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).max(20000).optional(),
    tags: z.array(z.string().max(64)).max(50).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).max(10000).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; itemId: string }>;
  },
) {
  const { tenantId, itemId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateKnowledgeBaseItemZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Validation failed",
        reason: "validation_failed",
      },
      { status: 400 },
    );
  }
  const input = parsed.data;

  try {
    const existing = await prisma.voiceKnowledgeBaseItem.findFirst({
      where: { id: itemId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Knowledge base item not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.voiceKnowledgeBaseItem.update({
      where: { id: itemId },
      data: {
        ...(input.itemType !== undefined && { itemType: input.itemType }),
        ...(input.title !== undefined && { title: input.title }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "knowledge-base.update" },
      extra: { tenantId, itemId },
    });
    return NextResponse.json(
      { error: "Failed to update knowledge base item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; itemId: string }>;
  },
) {
  const { tenantId, itemId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const existing = await prisma.voiceKnowledgeBaseItem.findFirst({
      where: { id: itemId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Knowledge base item not found" },
        { status: 404 },
      );
    }

    await prisma.voiceKnowledgeBaseItem.delete({ where: { id: itemId } });
    return NextResponse.json({ data: { id: itemId, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "knowledge-base.delete" },
      extra: { tenantId, itemId },
    });
    return NextResponse.json(
      { error: "Failed to delete knowledge base item" },
      { status: 500 },
    );
  }
}
