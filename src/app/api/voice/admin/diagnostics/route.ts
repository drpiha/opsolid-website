import { NextRequest, NextResponse } from "next/server";
import { sign as retellSign, verify as retellVerify } from "retell-sdk";
import { prisma } from "@/lib/prisma";
import { requireVoiceAdminToken } from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// /api/voice/admin/diagnostics — operator-facing health snapshot for the Voice
// Agent stack. Reports env wiring (presence only, never values), the active
// provider class name, and a webhook signature self-test that signs a fake
// payload with the SDK and runs it through our verifier — confirms the
// signature bug is fixed without needing a real Retell test fire.
//
// Auth: VOICE_ADMIN_TOKEN. Returns 200 even on partial failures so the
// operator can see exactly which piece is misconfigured.
// -----------------------------------------------------------------------------

function present(name: string): { name: string; set: boolean } {
  return { name, set: Boolean(process.env[name]) };
}

export async function GET(req: NextRequest) {
  try {
    requireVoiceAdminToken(req);
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message ?? "Unauthorized" },
      { status: e.status ?? 401 },
    );
  }

  const env = [
    present("VOICE_AGENT_ENABLED"),
    present("VOICE_ADMIN_TOKEN"),
    present("VOICE_DEFAULT_PROVIDER"),
    present("RETELL_API_KEY"),
    present("VAPI_API_KEY"),
    present("VOICE_PUBLIC_BASE_URL"),
    present("VOICE_INTERNAL_ALERT_EMAIL"),
  ];

  let providerName = "unknown";
  let providerOk = false;
  let providerError: string | null = null;
  try {
    const p = getVoiceProvider();
    providerName = p.name;
    providerOk = true;
  } catch (err) {
    providerError = err instanceof Error ? err.message : String(err);
  }

  // Webhook signature self-test — proves our verify() agrees with the SDK's
  // sign() so a real Retell webhook will validate. Skipped if no API key.
  let webhookSelfTest: {
    ran: boolean;
    matchesSdk: boolean | null;
    rejectsTampered: boolean | null;
    error: string | null;
  } = { ran: false, matchesSdk: null, rejectsTampered: null, error: null };

  if (process.env.RETELL_API_KEY) {
    try {
      const provider = getVoiceProvider();
      const body = JSON.stringify({ event: "diagnostic_ping", call: { call_id: "diag" } });
      const sig = await retellSign(body, process.env.RETELL_API_KEY);
      const matches = provider.verifyWebhookSignature(body, {
        "x-retell-signature": sig,
      });
      // Independent positive control via SDK.verify (proves the format).
      const sdkMatch = await retellVerify(body, process.env.RETELL_API_KEY, sig);
      const tamperedSig = sig.replace(/[a-f0-9]$/, (c) => (c === "0" ? "1" : "0"));
      const rejects = !provider.verifyWebhookSignature(body, {
        "x-retell-signature": tamperedSig,
      });
      webhookSelfTest = {
        ran: true,
        matchesSdk: matches && sdkMatch,
        rejectsTampered: rejects,
        error: null,
      };
    } catch (err) {
      webhookSelfTest = {
        ran: true,
        matchesSdk: null,
        rejectsTampered: null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  let counts: {
    tenants: number;
    activeTenants: number;
    agents: number;
    phoneNumbers: number;
    callsLast24h: number;
  } | null = null;
  let countsError: string | null = null;
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [tenants, activeTenants, agents, phoneNumbers, callsLast24h] =
      await Promise.all([
        prisma.voiceTenant.count(),
        prisma.voiceTenant.count({ where: { status: "active" } }),
        prisma.voiceAgent.count(),
        prisma.voicePhoneNumber.count({ where: { status: "active" } }),
        prisma.voiceCall.count({ where: { createdAt: { gte: since } } }),
      ]);
    counts = { tenants, activeTenants, agents, phoneNumbers, callsLast24h };
  } catch (err) {
    countsError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    data: {
      timestamp: new Date().toISOString(),
      env,
      provider: { name: providerName, ok: providerOk, error: providerError },
      webhookSelfTest,
      counts,
      countsError,
      webhookUrl:
        (process.env.VOICE_PUBLIC_BASE_URL ?? "https://opsolid.de") +
        "/api/voice/webhooks/retell",
    },
  });
}
