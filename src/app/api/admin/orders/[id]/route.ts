import { NextRequest, NextResponse } from "next/server";
import {
  markContactedAction,
  cancelOrderAction,
} from "@/lib/order-actions";

export const runtime = "nodejs";

function checkToken(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  return token === expected;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    action?: string;
    note?: string;
  } | null;
  if (!body?.action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  switch (body.action) {
    case "mark-contacted": {
      const result = await markContactedAction(id, {
        note: body.note,
        actor: "admin",
      });
      return result.ok
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: result.error }, { status: result.status });
    }
    case "cancel": {
      const result = await cancelOrderAction(id, {
        note: body.note,
        actor: "admin",
      });
      return result.ok
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: result.error }, { status: result.status });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
