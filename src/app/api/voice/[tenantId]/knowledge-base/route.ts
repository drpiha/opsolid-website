import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { CreateKnowledgeBaseItemZ } from "@/lib/voice/validation";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// GET — list knowledge base items, grouped by itemType in the response so
// the dashboard can render sections without an extra pass.
//   ?includeInactive=1 — include archived items (otherwise only isActive=true).
// POST — create a new knowledge base item.
// -----------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  const url = new URL(req.url);
  const includeInactive = url.searchParams.get("includeInactive") === "1";

  try {
    const items = await prisma.voiceKnowledgeBaseItem.findMany({
      where: { tenantId, ...(includeInactive ? {} : { isActive: true }) },
      orderBy: [{ itemType: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const groupedByType: Record<string, typeof items> = {};
    for (const item of items) {
      if (!groupedByType[item.itemType]) groupedByType[item.itemType] = [];
      groupedByType[item.itemType].push(item);
    }

    return NextResponse.json({
      data: { items, groupedByType, total: items.length },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "knowledge-base.list" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load knowledge base" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
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

  const parsed = CreateKnowledgeBaseItemZ.safeParse(body);
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
    const created = await prisma.voiceKnowledgeBaseItem.create({
      data: {
        tenantId,
        itemType: input.itemType,
        title: input.title,
        content: input.content,
        tags: input.tags ?? [],
        isActive: input.isActive ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "knowledge-base.create" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to create knowledge base item" },
      { status: 500 },
    );
  }
}
