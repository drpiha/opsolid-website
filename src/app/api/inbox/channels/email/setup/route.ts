// =============================================================================
// POST /api/inbox/channels/email/setup
//
// Connect an inbound email address to a user's inbox. The user wires their
// mail provider (Zoho / Google / Postmark inbound stream) to forward to
// /api/inbox/webhooks/email/{channelId} — that URL is returned in the
// response.
//
// Body: { inboxEmail: string, label?: string }
//   inboxEmail — the address customers reach the user at. Used both as
//                the channel.externalId (so we can route by "To") and as
//                the From header on outbound replies.
//   label      — human-readable name shown in the inbox channel list.
// =============================================================================

import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import { upsertChannel } from "@/lib/inbox/repository";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  let body: { inboxEmail?: string; label?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const inboxEmail = body.inboxEmail?.trim().toLowerCase();
  if (!inboxEmail || !EMAIL_REGEX.test(inboxEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const webhookSecret = randomBytes(20).toString("hex");

  const channel = await upsertChannel({
    userId: user.id,
    type: "email",
    externalId: inboxEmail,
    label: body.label ?? inboxEmail,
    config: {
      inboxEmail,
      webhookSecret,
      // Future: per-channel SMTP override; until then we use env creds.
      smtp: null,
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://opsolid.de";

  return NextResponse.json({
    ok: true,
    channelId: channel.id,
    inboxEmail,
    webhookUrl: `${baseUrl}/api/inbox/webhooks/email/${channel.id}?secret=${webhookSecret}`,
    instructions:
      "Configure your Postmark inbound stream (or equivalent) to POST to this webhookUrl. Keep the ?secret query intact — it authenticates the call.",
  });
}
