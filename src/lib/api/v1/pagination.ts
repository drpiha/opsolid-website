// =============================================================================
// /api/v1/* — opaque cursor pagination utilities.
//
// We expose a base64url-encoded opaque cursor instead of leaking row IDs or
// timestamps directly in the wire format. This keeps the contract stable even
// if we change the underlying ordering (e.g. add tie-breakers, switch from
// createdAt to updatedAt) — clients pass back whatever cursor we issued and
// we decode it server-side.
//
// Cursor encodes a single (createdAt, id) pair, which together form a strict
// total order. `id` is the cuid tie-breaker for rows sharing a millisecond.
// =============================================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export interface CursorPayload {
  /** Epoch ms of the boundary row's createdAt. */
  ts: number;
  /** Boundary row's primary key (cuid). */
  id: string;
}

/**
 * Parse a `?cursor=` query string into a payload, or return null if absent /
 * malformed. We tolerate malformed cursors (returning the first page) instead
 * of 400-ing because it's friendlier for resumed-after-deploy clients.
 */
export function decodeCursor(raw: string | null | undefined): CursorPayload | null {
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.ts === "number" &&
      typeof parsed.id === "string" &&
      Number.isFinite(parsed.ts) &&
      parsed.id.length > 0 &&
      parsed.id.length < 64
    ) {
      return { ts: parsed.ts, id: parsed.id };
    }
    return null;
  } catch {
    return null;
  }
}

export function encodeCursor(payload: CursorPayload): string {
  const json = JSON.stringify({ ts: payload.ts, id: payload.id });
  return Buffer.from(json, "utf8").toString("base64url");
}

/**
 * Read & sanitise the `?limit=` query parameter. Falls back to
 * DEFAULT_LIMIT and caps at MAX_LIMIT to prevent unbounded scans.
 */
export function parseLimit(raw: string | null | undefined): number {
  if (!raw) return DEFAULT_LIMIT;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(n), MAX_LIMIT);
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

/**
 * Slice an over-fetched page (limit+1) into a `Paginated` envelope. The caller
 * fetches `limit + 1` rows; if the extra row is present we drop it and emit
 * a cursor pointing past the LAST returned row.
 */
export function buildPage<T extends { id: string; createdAt: Date }>(
  rows: T[],
  limit: number,
): Paginated<T> {
  if (rows.length <= limit) return { items: rows, nextCursor: null };
  const items = rows.slice(0, limit);
  const last = items[items.length - 1];
  return {
    items,
    nextCursor: encodeCursor({ ts: last.createdAt.getTime(), id: last.id }),
  };
}
