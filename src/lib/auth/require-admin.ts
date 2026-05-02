// =============================================================================
// requireAdmin — server-side guard for admin-only API routes / pages (B0.6).
//
// Calls requireUser first (401 if unauthenticated), then checks user.role.
// Throws AuthError(403) if the user is authenticated but not an ADMIN.
//
// Usage in an API route:
//   const user = await requireAdmin(req);
// =============================================================================

import type { User } from "@/generated/prisma";
import { requireUser, AuthError } from "./require-user";

export async function requireAdmin(req: Request): Promise<User> {
  const user = await requireUser(req); // throws AuthError(401) if not authenticated
  if (user.role !== "ADMIN") {
    throw new AuthError("forbidden", 403);
  }
  return user;
}
