// =============================================================================
// Internal helpers shared by every /api/auth/* route (Faz 7.0a).
//
// Centralises:
//   - response shape: { error: { code, message } } for 4xx
//   - JSON parsing with safe fallback
//   - Sentry capture (dynamic import — no hard dep)
// =============================================================================

import { NextResponse } from "next/server";

export interface ErrorBody {
  error: { code: string; message: string };
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  extraHeaders?: Record<string, string>,
): NextResponse {
  const res = NextResponse.json<ErrorBody>(
    { error: { code, message } },
    { status },
  );
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      res.headers.set(k, v);
    }
  }
  return res;
}

export async function readJson<T = unknown>(
  req: Request,
): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Best-effort Sentry capture. Never throws — auth flows should never break
 * because telemetry is unavailable.
 */
export async function captureAuthEvent(
  message: string,
  context: Record<string, unknown>,
): Promise<void> {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.withScope((scope) => {
      scope.setTags({ surface: "auth" });
      scope.setExtras(context);
      Sentry.captureMessage(message, "warning");
    });
  } catch {
    /* ignore */
  }
}
