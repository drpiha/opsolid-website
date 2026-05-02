// =============================================================================
// /api/v1/* — CORS policy.
//
// Strict allowlist of origins permitted to call the public API. Mobile Expo
// clients in development originate from many ephemeral hosts (192.168.x.y:port,
// exp://, etc.), so we expose an env-driven extension knob (`API_V1_ALLOWED_ORIGINS`,
// comma-separated) for ops to widen the list per-environment.
//
// Production allowlist is small and deliberate: the marketing host, the card
// host, and an explicit dev-only wildcard tier that ONLY engages when
// NODE_ENV !== "production". Never echo `*` to credentialed origins.
//
// Notes:
//  - `Access-Control-Allow-Credentials` is *never* set. This API is bearer-only
//    (see bearer-only.ts); cookies are not part of the contract. Skipping
//    credentials lets us keep the wildcard fallback safe in dev.
//  - We mirror the request origin only when it appears in the allowlist —
//    never just echo back what the client sent.
// =============================================================================

const PROD_DEFAULT_ORIGINS = [
  "https://opsolid.de",
  "https://www.opsolid.de",
  "https://card.opsolid.de",
];

const ALLOWED_METHODS = "GET,POST,PATCH,DELETE,OPTIONS";
const ALLOWED_HEADERS = "Authorization,Content-Type,Accept,X-Requested-With";
const PREFLIGHT_MAX_AGE = "600"; // 10 min — fine for prod, dev refreshes anyway.

let cachedAllowlist: string[] | null = null;

function getAllowlist(): string[] {
  if (cachedAllowlist) return cachedAllowlist;
  const fromEnv = (process.env.API_V1_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  cachedAllowlist = [...PROD_DEFAULT_ORIGINS, ...fromEnv];
  return cachedAllowlist;
}

/**
 * Decide whether a given origin is allowed. In non-production we accept any
 * origin (mobile Expo dev) but still don't permit credentials, so this stays
 * safe.
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const list = getAllowlist();
  if (list.includes(origin)) return true;
  if (process.env.NODE_ENV !== "production") return true;
  return false;
}

/**
 * Build the CORS headers for a given request. Returns undefined when the
 * origin is not allowed, which callers can treat as "no CORS headers" — the
 * browser will then refuse the response on a cross-origin call but same-origin
 * still works. We deliberately do NOT 403 on disallowed origins; this avoids
 * leaking the allowlist contents.
 */
export function corsHeadersFor(req: Request): Record<string, string> | undefined {
  const origin = req.headers.get("origin");
  if (!isAllowedOrigin(origin)) return undefined;
  return {
    "Access-Control-Allow-Origin": origin as string,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": PREFLIGHT_MAX_AGE,
  };
}

/**
 * Standard preflight response factory. Always returns 204 with the CORS
 * headers (when the origin is allowed). Use as the OPTIONS handler in any
 * v1 route file.
 */
export function corsPreflight(req: Request): Response {
  const headers = corsHeadersFor(req) ?? {};
  return new Response(null, { status: 204, headers });
}

/**
 * Apply CORS headers in-place to an existing Response. Used by route handlers
 * that build their response with NextResponse.json(...) and need to layer in
 * the per-request CORS headers.
 */
export function applyCors(res: Response, req: Request): Response {
  const headers = corsHeadersFor(req);
  if (!headers) return res;
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}
