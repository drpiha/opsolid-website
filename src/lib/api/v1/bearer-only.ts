// =============================================================================
// /api/v1/* — bearer-only authentication.
//
// `requireUser` (src/lib/auth/require-user.ts) accepts both bearer JWT and
// the refresh cookie because the web SPA needs the cookie path. The public
// /api/v1/* surface deliberately accepts ONLY bearer JWT:
//
//  1. Mobile + 3rd-party clients are stateless. They store tokens themselves;
//     accepting a cookie path would leak the cookie into integrations that
//     should never see it.
//
//  2. Cookie auth requires CSRF defenses (origin checks, double-submit,
//     SameSite tweaks). Bearer-only means we can keep `Allow-Credentials`
//     off entirely — the API surface is CSRF-immune by construction.
//
//  3. Stable contract. The mobile app should never accidentally rely on a
//     web session cookie that disappears when we change cookie naming.
//
// `requireBearerUser` is the single entry point all v1 authenticated routes
// should call. It throws AuthError on any miss, which the route's try/catch
// converts to a uniform 401 response.
// =============================================================================

import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { AuthError } from "@/lib/auth/require-user";

const BEARER_PREFIX = /^Bearer\s+/i;

/**
 * Resolve a User from the Authorization header. Throws AuthError on any miss.
 * Cookies are explicitly ignored — the web cookie path lives in the internal
 * /api/* surface, not here.
 */
export async function requireBearerUser(req: Request): Promise<User> {
  const header = req.headers.get("authorization");
  if (!header || !BEARER_PREFIX.test(header)) {
    throw new AuthError("missing_bearer_token");
  }
  const token = header.replace(BEARER_PREFIX, "").trim();
  if (!token) throw new AuthError("missing_bearer_token");

  const claims = await verifyAccessToken(token);
  if (!claims) throw new AuthError("invalid_token");

  const user = await prisma.user.findUnique({ where: { id: claims.userId } });
  if (!user) throw new AuthError("user_not_found");
  return user;
}

/**
 * Best-effort variant: returns the user if a valid bearer token is present,
 * null otherwise. Never throws. For routes that adapt content based on auth
 * state but don't reject anonymous callers.
 */
export async function getBearerUser(req: Request): Promise<User | null> {
  try {
    return await requireBearerUser(req);
  } catch {
    return null;
  }
}
