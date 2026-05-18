// =============================================================================
// GET /api/inbox/ai/probe
//
// Reports the live status of the AI providers behind the inbox without
// leaking key material. Useful after a user tops up Anthropic credits — one
// call tells you whether all green or which provider is still blocked.
//
// Response shape:
//   {
//     anthropic: { configured: bool, status: "ok"|"credit_low"|"auth"|"error"|"unconfigured", detail?: string },
//     openai:    { configured: bool, status: "ok"|"auth"|"error"|"unconfigured", detail?: string }
//   }
//
// Auth: requires a signed-in user. Reasonable: probing live AI providers
// from an anon endpoint would burn the user's quota on bots.
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/require-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProviderStatus {
  configured: boolean;
  status:
    | "ok"
    | "credit_low"
    | "auth"
    | "error"
    | "unconfigured"
    | "rate_limited";
  detail?: string;
}

async function probeAnthropic(): Promise<ProviderStatus> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { configured: false, status: "unconfigured" };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Smallest possible call — Haiku, 1 token, fixed prompt.
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1,
        messages: [{ role: "user", content: "1" }],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { configured: true, status: "ok" };

    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string; type?: string };
    };
    const msg = body.error?.message ?? "";
    if (res.status === 401 || res.status === 403) {
      return { configured: true, status: "auth", detail: msg.slice(0, 200) };
    }
    if (res.status === 429) {
      return {
        configured: true,
        status: "rate_limited",
        detail: msg.slice(0, 200),
      };
    }
    if (/credit balance/i.test(msg)) {
      return { configured: true, status: "credit_low", detail: msg.slice(0, 200) };
    }
    return {
      configured: true,
      status: "error",
      detail: `HTTP ${res.status}: ${msg.slice(0, 180)}`,
    };
  } catch (err) {
    return {
      configured: true,
      status: "error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

async function probeOpenAI(): Promise<ProviderStatus> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { configured: false, status: "unconfigured" };

  try {
    const res = await fetch("https://api.openai.com/v1/models/whisper-1", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { configured: true, status: "ok" };
    if (res.status === 401 || res.status === 403) {
      return { configured: true, status: "auth", detail: "Key rejected." };
    }
    return {
      configured: true,
      status: "error",
      detail: `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      configured: true,
      status: "error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function GET(req: Request) {
  try {
    await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const [anthropic, openai] = await Promise.all([
    probeAnthropic(),
    probeOpenAI(),
  ]);

  return NextResponse.json({
    anthropic,
    openai,
    summary: {
      summaryReady: anthropic.status === "ok",
      voiceTranscriptReady: openai.status === "ok",
      allGreen: anthropic.status === "ok" && openai.status === "ok",
    },
  });
}
