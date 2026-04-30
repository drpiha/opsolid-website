// =============================================================================
// Constant-time string equality — compares two strings byte-for-byte without
// short-circuiting so attackers can't observe matching prefix length via
// timing differences. Used by the public card page to verify ?owner=<editToken>
// against the order's editToken.
//
// Pure utility (no React, no client-only APIs) — safe to import from server
// components, route handlers, and middleware. Previously co-located with
// OwnerToolbar.tsx which was a `"use client"` module, causing the function to
// be replaced by a client-component proxy when imported into the server-side
// /c/[slug]/page.tsx → "TypeError: D is not a function" at render time.
// =============================================================================

export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
