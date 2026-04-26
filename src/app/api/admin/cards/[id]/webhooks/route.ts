// =============================================================================
// /api/admin/cards/[id]/webhooks — manage outbound CRM webhook subscriptions.
//
// GET   — list subscriptions for the order. NEVER returns `secret` (the
//         secret is shown ONCE at creation time and not retrievable again;
//         re-create the subscription to rotate).
// POST  — create a new subscription. Generates a 32-byte hex secret server-side
//         and returns it in the response with a `secretShownOnce: true` flag.
//
// Auth: same browser ADMIN_TOKEN pattern as /api/admin/cards/[id]/sector.
// =============================================================================

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const SUPPORTED_EVENTS = ["lead.created", "connection.created"] as const;

const CreateInput = z.object({
  url: z.string().url().max(500),
  events: z
    .array(z.enum(SUPPORTED_EVENTS))
    .min(1)
    .default([...SUPPORTED_EVENTS]),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const webhooks = await prisma.cardWebhook.findMany({
    where: { orderId: params.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      events: true,
      active: true,
      lastDeliveryAt: true,
      lastDeliveryStatus: true,
      createdAt: true,
      // NOTE: `secret` deliberately omitted — write-once value, see POST.
    },
  });

  return NextResponse.json({
    webhooks: webhooks.map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      active: w.active,
      lastDeliveryAt: w.lastDeliveryAt?.toISOString() ?? null,
      lastDeliveryStatus: w.lastDeliveryStatus,
      createdAt: w.createdAt.toISOString(),
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = CreateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  // 32 random bytes = 64 hex chars. Comfortably above the 256-bit symmetric
  // key threshold; receivers store this verbatim and use it as the HMAC key.
  const secret = crypto.randomBytes(32).toString("hex");

  const webhook = await prisma.cardWebhook.create({
    data: {
      orderId: order.id,
      url: parsed.data.url,
      secret,
      events: parsed.data.events,
    },
    select: {
      id: true,
      url: true,
      events: true,
      active: true,
      lastDeliveryAt: true,
      lastDeliveryStatus: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    webhook: {
      id: webhook.id,
      url: webhook.url,
      events: webhook.events,
      active: webhook.active,
      lastDeliveryAt: null,
      lastDeliveryStatus: null,
      createdAt: webhook.createdAt.toISOString(),
    },
    secret,
    secretShownOnce: true,
    note: "Save this secret now — it cannot be retrieved later. Re-create the webhook to rotate.",
  });
}
