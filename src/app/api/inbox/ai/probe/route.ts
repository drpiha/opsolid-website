// =============================================================================
// GET /api/inbox/ai/probe
//
// Reports the live status of every provider behind the inbox AI layer. Since
// the active backend (claude.ts despite the name) now calls OpenAI Chat
// Completions, OpenAI is the *primary* signal — if it's red, summaries /
// sentiment / intent / draft replies / Whisper transcripts all fail.
//
// Anthropic is reported as optional/secondary: when the operator funds the
// Anthropic account later we can switch tiers without removing this probe.
//
// Response:
//   {
//     openai:    { ... },   // primary — must be green for AI to work
//     anthropic: { ... },   // optional / informational
//     summary: { allRequiredReady: bool, summaryReady: bool, voiceTranscriptReady: bool }
//   }
//
// Auth required — anon probes would burn quota on bots.
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

async function probeOpenAIChat(): Promise<ProviderStatus> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { configured: false, status: "unconfigured" };

  try {
    // Smallest possible chat completion — proves both auth and billing.
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "1" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { configured: true, status: "ok" };

    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string; type?: string; code?: string };
    };
    const msg = body.error?.message ?? "";
    if (res.status === 401 || res.status === 403) {
      return { configured: true, status: "auth", detail: msg.slice(0, 200) };
    }
    if (res.status === 429) {
      // OpenAI returns 429 for both rate-limit and insufficient_quota — distinguish.
      if (/quota/i.test(msg) || body.error?.code === "insufficient_quota") {
        return {
          configured: true,
          status: "credit_low",
          detail: msg.slice(0, 200),
        };
      }
      return {
        configured: true,
        status: "rate_limited",
        detail: msg.slice(0, 200),
      };
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

export async function GET(req: Request) {
  try {
    await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const [openai, anthropic] = await Promise.all([
    probeOpenAIChat(),
    probeAnthropic(),
  ]);

  // OpenAI is the *required* provider for the current AI backend (Chat
  // Completions + Whisper). Anthropic ok/credit_low is just informational
  // until we add a switch in the LLM helper.
  return NextResponse.json({
    openai,
    anthropic,
    summary: {
      allRequiredReady: openai.status === "ok",
      summaryReady: openai.status === "ok",
      voiceTranscriptReady: openai.status === "ok",
    },
  });
}
