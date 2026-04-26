import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// Vapi webhook receiver — SKELETON.
//
// Vapi support is not fully wired yet. We still verify the signature so that
// once the provider adapter ships, the public surface stays stable and we
// never accept an unsigned payload. Returns 200 with a note so the provider
// stops retrying and we can observe traffic in logs.
// -----------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-webhook", provider: "vapi", step: "read-body" },
    });
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    Sentry.captureMessage("VAPI_WEBHOOK_SECRET not configured", {
      level: "error",
      tags: { area: "voice-webhook", provider: "vapi" },
    });
    return NextResponse.json(
      { error: "Vapi webhook secret not configured" },
      { status: 500 },
    );
  }

  // Vapi typically signs with X-Vapi-Signature: sha256=<hex>. Be tolerant of
  // both prefixed and bare hex values.
  const sigHeader =
    req.headers.get("x-vapi-signature") ??
    req.headers.get("vapi-signature") ??
    "";
  const provided = sigHeader.startsWith("sha256=")
    ? sigHeader.slice("sha256=".length)
    : sigHeader;

  if (!provided) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  let valid = false;
  try {
    const a = Buffer.from(provided, "hex");
    const b = Buffer.from(expected, "hex");
    valid = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  return NextResponse.json({
    received: true,
    note: "Vapi provider not fully configured",
  });
}
