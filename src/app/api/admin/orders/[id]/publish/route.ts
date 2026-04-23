import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { publishOrderAction } from "@/lib/order-actions";

export const runtime = "nodejs";

function checkToken(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  return token === expected;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await req.json().catch(() => null)) as {
      designNotes?: string;
    } | null;

    const result = await publishOrderAction(id, {
      designNotes: body?.designNotes,
      actor: "admin",
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true, slug: result.slug });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "publish", actor: "admin" },
      extra: { orderId: id },
    });
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}
