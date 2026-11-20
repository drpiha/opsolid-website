import { z } from "zod";
import { OPSO_API } from "./gateway";

/** Shared by the two card studio routes (`src/app/api/opso/card-preview`, `card-reservation`): fields, base URL, rate limit. */
const text = (max: number) => z.string().max(max);
export const CARD_DESIGN = z.enum(["onyx", "linea", "monolith"]);
export const CARD_LOCALE = z.enum(["de", "en", "tr"]);
/** The five card fields as the OpSo API accepts them; the same limits as the fields in the studio. */
export const CARD_FIELDS = {
  design: CARD_DESIGN,
  name: text(40),
  title: text(40).default(""),
  org: text(48).default(""),
  lines: z.array(text(64)).max(2).default([]),
};

/**
 * Version of the "Vormerken" consent wording. The OpSo API stores this id with each registration; the wording per
 * language is archived in `docs/consent/<id>.json` (the proof of what was agreed to). A changed sentence, button label
 * or link text needs a new id, a new archive file and a note to the OpSo session, so that the API stores the new id
 * (`scripts/tests/published-prices.test.mts` compares the live text with the archive). The same id stands for the
 * confirmation mail on the OpSo side (`CARD_RESERVATION_CONSENT_VERSION`), because the proof of consent kept after the
 * launch mail stores only this id: when that mail's text changes, the id changes there and here, with a new archive file.
 */
export const CARD_STUDIO_CONSENT_VERSION = "card-studio-2026-11-19";

/** `OPSO_CARD_PREVIEW_BASE` points a development build at a local stand-in (loopback only); production always uses the OpSo API. */
export function cardStudioBase(): string {
  const dev = process.env.OPSO_CARD_PREVIEW_BASE;
  return process.env.NODE_ENV !== "production" && dev && /^http:\/\/127\.0\.0\.1:\d{2,5}\/api$/.test(dev) ? dev : OPSO_API;
}

/** A small in-memory limit per client address: `max` calls in `windowMs`. Full tables refuse new addresses instead of growing. */
export function limiter(max: number, windowMs: number): (key: string, now: number) => boolean {
  const buckets = new Map<string, { count: number; expires: number }>();
  return (key, now) => {
    buckets.forEach((b, k) => { if (b.expires <= now) buckets.delete(k); });
    let bucket = buckets.get(key);
    if (!bucket) {
      if (buckets.size >= 10_000) return true;
      bucket = { count: 0, expires: now + windowMs };
      buckets.set(key, bucket);
    }
    return ++bucket.count > max;
  };
}

/**
 * Reads a small JSON body; `null` when it is too large or not JSON. The size is checked while reading, never
 * after: a declared length over the limit is refused at once, and a body that grows past the limit is cancelled,
 * so nobody can make these open routes hold a large upload in memory.
 */
export async function smallJson(request: Request, max = 4096): Promise<unknown | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > max) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let at = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, at);
      at += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return null;
  }
}

export const studioJson = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
