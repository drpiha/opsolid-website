// =============================================================================
// /api/v1/* — uniform error envelope.
//
// The public API contract is `{ error: { code, message } }` with HTTP status
// reflecting the error class. Codes are stable identifiers mobile / 3rd-party
// clients can branch on; messages are English (i18n is a client concern in
// the public API surface).
// =============================================================================

import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown };
}

export function errorJson(
  code: string,
  message: string,
  status: number,
  extraHeaders?: Record<string, string>,
  details?: unknown,
): NextResponse {
  const body: ApiErrorBody = { error: { code, message } };
  if (details !== undefined) body.error.details = details;
  const res = NextResponse.json(body, { status });
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) res.headers.set(k, v);
  }
  return res;
}

/** Read JSON body without throwing — returns null on parse failure. */
export async function readJsonBody<T = unknown>(
  req: Request,
): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
