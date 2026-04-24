// =============================================================================
// POST /api/qr/ai-generate
//
// Generates an AI Art QR for a given order, persists it to storage, and
// updates `qrStyle.ai` on the CardOrder. Bundled into yearly + lifetime plans;
// monthly customers get a 402 with an upsell pointer.
//
// Body: { orderId: string, prompt: string, style: AiArtStyle }
// Auth: same edit-token pattern used elsewhere — the caller must include
//       `?token={editToken}` matching the order's edit token.
//
// Rate limiting: 5-minute per-order debounce held in-process. Vercel functions
// are short-lived but each replica processes a handful of generations a day,
// so this is a "best effort" guard rather than a hard quota — the real cost
// ceiling is enforced by the plan check (only paying yearly/lifetime users
// can call this at all).
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderStatus, BillingMode } from "@/lib/validation";
import { generateAiArtQr, type AiArtStyle } from "@/lib/qr/ai-art";
import { putAsset } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Replicate calls take ~25-40s; bump the function timeout proportionally.
// Vercel Pro+ allows up to 300s on Node runtime — set conservatively.
export const maxDuration = 90;

const BodySchema = z.object({
  orderId: z.string().min(1).max(64),
  prompt: z.string().trim().min(3).max(300),
  style: z.enum([
    "geometric",
    "liquid",
    "forest",
    "cyberpunk",
    "watercolor",
    "mosaic",
  ]),
});

// In-process debounce ledger. Best effort — see file header.
const lastRunAt = new Map<string, number>();
const DEBOUNCE_MS = 5 * 60 * 1000;

function isPlanEntitled(billingMode: string): boolean {
  // Yearly + lifetime plans get unlimited (within rate limit) AI Art QR.
  // Monthly explicitly does not — we surface a 402 with an upgrade message.
  return (
    billingMode === BillingMode.YEARLY || billingMode === BillingMode.ONE_TIME
  );
}

export async function POST(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing edit token" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 }
    );
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: parsed.data.orderId },
  });
  if (!order || order.editToken !== token) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    order.status !== OrderStatus.PUBLISHED &&
    order.status !== OrderStatus.PAID &&
    order.status !== OrderStatus.AWAITING_DESIGN
  ) {
    return NextResponse.json(
      { error: "Order not eligible (must be paid or published)" },
      { status: 409 }
    );
  }

  if (!isPlanEntitled(order.billingMode)) {
    return NextResponse.json(
      {
        error: "AI Art QR is included on yearly and lifetime plans only.",
        upgrade: "yearly",
      },
      { status: 402 }
    );
  }

  const debounceKey = order.id;
  const last = lastRunAt.get(debounceKey);
  if (last && Date.now() - last < DEBOUNCE_MS) {
    const retryAfter = Math.ceil((DEBOUNCE_MS - (Date.now() - last)) / 1000);
    return NextResponse.json(
      { error: "Too many requests — please wait before regenerating." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  // Stamp before the heavy call so a slow generation doesn't let two requests
  // sneak through during the await window.
  lastRunAt.set(debounceKey, Date.now());

  const data = `${
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://opsolid.de"
  }/c/${order.slug ?? order.id}`;

  let result;
  try {
    result = await generateAiArtQr({
      data,
      userPrompt: parsed.data.prompt,
      style: parsed.data.style as AiArtStyle,
      size: 768,
    });
  } catch (err) {
    console.error("[qr-ai] generation failed:", err);
    return NextResponse.json(
      { error: "AI generation failed — please try again later." },
      { status: 502 }
    );
  }

  // Persist the bytes to our storage adapter. Stored under a stable per-order
  // bucket so subsequent regenerations replace the previous one (we let the
  // adapter add entropy via dirHex, the old asset can be GC'd later).
  let url: string;
  try {
    const stored = await putAsset({
      kind: "qr-ai",
      ext: "png",
      body: result.bytes,
      contentType: "image/png",
    });
    url = stored.url;
  } catch (err) {
    console.error("[qr-ai] storage failed:", err);
    return NextResponse.json(
      { error: "Generated but failed to save — please retry." },
      { status: 500 }
    );
  }

  // Merge into qrStyle JSON without dropping any existing settings.
  const prevQrStyle = (order.qrStyle ?? {}) as Record<string, unknown>;
  const merged = {
    ...prevQrStyle,
    ai: {
      prompt: parsed.data.prompt,
      style: parsed.data.style,
      generatedUrl: url,
      generatedAt: new Date().toISOString(),
      fellBackToBaseline: result.fellBackToBaseline,
      attempts: result.attempts,
    },
  };

  await prisma.cardOrder.update({
    where: { id: order.id },
    data: { qrStyle: merged as unknown as object },
  });

  return NextResponse.json({
    url,
    decoded: result.decoded,
    fellBackToBaseline: result.fellBackToBaseline,
    attempts: result.attempts,
  });
}
