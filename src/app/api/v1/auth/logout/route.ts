// =============================================================================
// POST /api/v1/auth/logout — revoke a refresh token.
//
// Body: { refreshToken }
// Always returns 200 — revoking an unknown / already-revoked token is a no-op.
// The client is expected to drop the access JWT locally; the access JWT is
// stateless and will continue to work until its 15-min TTL expires (acceptable
// trade-off for keeping the verify path stateless).
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { revokeSession } from "@/lib/auth/session";
import { readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LogoutSchema = z.object({
  refreshToken: z.string().trim().min(1).max(200).optional(),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  const body = await readJsonBody(req);
  const parsed = LogoutSchema.safeParse(body ?? {});
  if (parsed.success && parsed.data.refreshToken) {
    await revokeSession(parsed.data.refreshToken);
  }
  return applyCors(NextResponse.json({ ok: true }, { status: 200 }), req);
}
