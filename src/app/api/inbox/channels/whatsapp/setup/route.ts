// =============================================================================
// POST /api/inbox/channels/whatsapp/setup
//
// Register a 360dialog (or Cloud-API-compatible) WhatsApp Business number
// for the authenticated user.
//
// Body: {
//   apiKey:        string     // D360-API-KEY from the 360dialog hub
//   phoneNumberId: string     // your business number, E.164 without +
//   label?:        string
//   baseUrl?:      string     // override for Twilio / staging tunnels
// }
//
// Returns the webhook URL the user (or our automated setup script) wires
// into the 360dialog hub. 360dialog does not require a secret on inbound;
// to compensate we expose a per-channel ?secret in the webhook URL.
// =============================================================================

import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { upsertChannel } from "@/lib/inbox/repository";

export const runtime = "nodejs";

const Schema = z.object({
  apiKey: z.string().trim().min(16).max(200),
  phoneNumberId: z
    .string()
    .trim()
    .regex(/^[0-9]{8,18}$/, "phone number must be digits only (no +)"),
  label: z.string().trim().max(80).optional(),
  baseUrl: z.string().url().optional(),
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

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  const webhookSecret = randomBytes(24).toString("hex");

  const channel = await upsertChannel({
    userId: user.id,
    type: "whatsapp",
    externalId: parsed.data.phoneNumberId,
    label: parsed.data.label ?? `WhatsApp +${parsed.data.phoneNumberId}`,
    config: {
      apiKey: parsed.data.apiKey,
      phoneNumberId: parsed.data.phoneNumberId,
      baseUrl: parsed.data.baseUrl ?? null,
      webhookSecret,
    },
  });

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://opsolid.de";
  const webhookUrl = `${base}/api/inbox/webhooks/whatsapp/${channel.id}?secret=${webhookSecret}`;

  return NextResponse.json({
    ok: true,
    channelId: channel.id,
    phoneNumberId: parsed.data.phoneNumberId,
    webhookUrl,
    instructions:
      "Open the 360dialog hub → Webhook configuration → paste webhookUrl. The ?secret query param authenticates inbound calls; keep it intact.",
  });
}
