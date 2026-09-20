import { z } from "zod";

export const CONTACT_BODY_MAX_BYTES = 64 * 1024;
const BODY_TIMEOUT_MS = 10_000;
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS = 30;
const MAX_IN_FLIGHT = 4;

// These fields enter mail headers or single-line labels. Message content may
// contain line breaks and is escaped separately when rendering the HTML body.
const shortText = (max: number) => z.string().trim().max(max).regex(/^[^\u0000-\u001f\u007f]*$/);
export const contactSchema = z.object({
  name: shortText(120).min(1),
  email: shortText(254).email(),
  company: shortText(160).optional(),
  message: z.string().trim().min(1).max(10_000),
  source: shortText(64).optional(),
  teamSize: shortText(64).optional(),
  phone: shortText(64).optional(),
  topics: z.array(shortText(64).min(1)).max(10).optional(),
  website: z.string().max(2_048).optional(),
});

export class ContactRequestError extends Error {
  constructor(public readonly status: 400 | 408 | 413 | 415) {
    super("Invalid contact request");
  }
}

/** Limit actual streamed bytes, including when Content-Length is absent/false. */
export async function readContactBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") throw new ContactRequestError(415);
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > CONTACT_BODY_MAX_BYTES)) {
    throw new ContactRequestError(413);
  }
  if (!request.body) throw new ContactRequestError(400);

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  let complete = false;
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ContactRequestError(408)), BODY_TIMEOUT_MS);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) break;
      bytes += value.byteLength;
      if (bytes > CONTACT_BODY_MAX_BYTES) throw new ContactRequestError(413);
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    complete = true;
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof ContactRequestError) throw error;
    throw new ContactRequestError(400);
  } finally {
    clearTimeout(timer!);
    if (!complete) void reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

/**
 * Single-process protection: constant memory, no IP map or trusted client
 * headers. Forwarded-header provenance has not been verified for this host.
 * All callers share 30 attempts / 10 minutes and four active requests. This
 * quota resets on process restart; a verified proxy/distributed limiter is
 * required before scaling to multiple processes or adding per-client quotas.
 */
export function createContactLimiter(now: () => number = Date.now) {
  let windowStart = now();
  let attempts = 0;
  let inFlight = 0;
  return {
    acquire(): { allowed: false; retryAfter: number } | { allowed: true; release: () => void } {
      const current = now();
      if (current - windowStart >= WINDOW_MS || current < windowStart) {
        windowStart = current;
        attempts = 0;
      }
      if (attempts >= MAX_REQUESTS) {
        return { allowed: false, retryAfter: Math.max(1, Math.ceil((windowStart + WINDOW_MS - current) / 1_000)) };
      }
      if (inFlight >= MAX_IN_FLIGHT) return { allowed: false, retryAfter: 10 };
      attempts += 1;
      inFlight += 1;
      let released = false;
      return { allowed: true, release() {
        if (!released) { released = true; inFlight -= 1; }
      } };
    },
  };
}

export const contactLimiter = createContactLimiter();
