// =============================================================================
// POST /api/m2m/orders/[id]/actions
// Body: { action: "mark-contacted" | "cancel" | "publish", note?, designNotes? }
// Delegates to the shared order-actions module so logic doesn't diverge from
// the URL-token admin.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  markContactedAction,
  cancelOrderAction,
  publishOrderAction,
} from "@/lib/order-actions";
import { authorizeM2M } from "@/lib/auth/m2m";

export const runtime = "nodejs";

type Body = {
  action?: "mark-contacted" | "cancel" | "publish";
  note?: string;
  designNotes?: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = authorizeM2M(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized", reason: auth.reason },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  switch (body.action) {
    case "mark-contacted": {
      const r = await markContactedAction(id, {
        note: body.note,
        actor: "admin:m2m",
      });
      return r.ok
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: r.error }, { status: r.status });
    }
    case "cancel": {
      const r = await cancelOrderAction(id, {
        note: body.note,
        actor: "admin:m2m",
      });
      return r.ok
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: r.error }, { status: r.status });
    }
    case "publish": {
      const r = await publishOrderAction(id, {
        designNotes: body.designNotes,
        actor: "admin:m2m",
      });
      return r.ok
        ? NextResponse.json({ ok: true, slug: r.slug })
        : NextResponse.json({ error: r.error }, { status: r.status });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
