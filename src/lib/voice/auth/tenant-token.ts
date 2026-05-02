// Tenant-token gate for VoiceTenant API surfaces — mirrors lib/auth/edit-token.ts.

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { VoiceTenant } from "@/generated/prisma";

export type TenantTokenErrorCode =
  | "missing_token"
  | "not_found"
  | "bad_token"
  | "suspended";

export class TenantTokenError extends Error {
  readonly code: TenantTokenErrorCode;
  readonly status: number;

  constructor(code: TenantTokenErrorCode) {
    super(code);
    this.code = code;
    this.name = "TenantTokenError";
    switch (code) {
      case "missing_token":
        this.status = 401;
        break;
      case "not_found":
        this.status = 404;
        break;
      case "suspended":
        this.status = 423;
        break;
      case "bad_token":
      default:
        this.status = 403;
        break;
    }
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  try {
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

function extractToken(reqOrToken: NextRequest | string | null | undefined): string | null {
  if (typeof reqOrToken === "string") {
    return reqOrToken;
  }
  if (!reqOrToken || !("url" in reqOrToken)) return null;

  // Query param first (?token=...).
  try {
    const fromQuery = new URL(reqOrToken.url).searchParams.get("token");
    if (fromQuery) return fromQuery;
  } catch {
    // Malformed URL — fall through to header.
  }

  // Authorization: Bearer <token>
  const authHeader = reqOrToken.headers.get("authorization");
  if (authHeader) {
    const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
    if (match) return match[1].trim();
  }

  // voice_token cookie — set by middleware after lifting `?token=…` off the
  // dashboard URL. Read it as a third source so client-side form submits
  // (which no longer have the token in the URL) still authenticate.
  const cookieToken = reqOrToken.cookies.get("voice_token")?.value;
  if (cookieToken) return cookieToken;

  return null;
}

/**
 * Resolve and authenticate a VoiceTenant from an incoming request.
 *
 * Token sources (in order):
 *   1. ?token=... query param
 *   2. Authorization: Bearer <token> header
 *
 * On any failure (missing, malformed, mismatched, or wrong tenant) we throw
 * a TenantTokenError. The status property maps to the HTTP code the caller
 * should return.
 *
 * If `tenantId` is provided, the loaded tenant must match — this prevents
 * cross-tenant access where a valid token for tenant A is used against
 * tenant B's resource URLs.
 */
export async function requireTenantToken(
  reqOrToken: NextRequest | string | null | undefined,
  tenantId?: string,
): Promise<VoiceTenant> {
  const token = extractToken(reqOrToken);
  if (!token || token.length < 8) {
    throw new TenantTokenError("missing_token");
  }

  const tenant = await prisma.voiceTenant.findUnique({
    where: { tenantToken: token },
  });
  if (!tenant) throw new TenantTokenError("not_found");

  // Constant-time compare even though findUnique already matched — defense
  // in depth in case Prisma's query semantics change in the future.
  if (!safeEqual(token, tenant.tenantToken)) {
    throw new TenantTokenError("bad_token");
  }

  if (tenantId && !safeEqual(tenant.id, tenantId)) {
    // Token is valid for some tenant, but not the one being requested.
    // Return bad_token (not not_found) so attackers can't probe IDs.
    throw new TenantTokenError("bad_token");
  }

  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    throw new TenantTokenError("suspended");
  }

  return tenant;
}

/**
 * Compare the request's admin token against process.env.VOICE_ADMIN_TOKEN.
 *
 * Token sources (in order):
 *   1. ?token=... query param
 *   2. x-voice-admin-token header
 *
 * Throws an Error with status:401 if the token is missing or wrong, or with
 * status:500 if VOICE_ADMIN_TOKEN is not configured (refusing to admit any
 * caller is the safe default).
 */
export function requireVoiceAdminToken(req: NextRequest): void {
  const expected = process.env.VOICE_ADMIN_TOKEN;
  if (!expected) {
    const err = new Error(
      "VOICE_ADMIN_TOKEN env var is not configured — refusing all admin access",
    );
    (err as Error & { status: number }).status = 500;
    throw err;
  }

  const fromQuery = req.nextUrl?.searchParams.get("token") ?? null;
  const fromHeader = req.headers.get("x-voice-admin-token");
  const provided = fromQuery ?? fromHeader ?? "";

  if (!provided || !safeEqual(provided, expected)) {
    const err = new Error("Unauthorized");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
}
