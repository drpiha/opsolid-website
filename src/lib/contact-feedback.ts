/**
 * What the contact form tells a visitor when a send fails (src/components/v7/blocks/contact-form.tsx).
 * Pure, so the mapping from the /api/contact answer to the message is unit-tested
 * (scripts/tests/contact-feedback.test.mts).
 */

/** Longest wait the form ever names: the per-client window of /api/contact is ten minutes. */
export const MAX_WAIT_MINUTES = 10;

export type SendFailure =
  /** 429: per-network lock, in-flight cap or global send cap; `minutes` until the form takes messages again. */
  | { kind: "busy"; minutes: number }
  /** 400, 413, 415: the server rejected the content (the form's own checks normally catch this first). */
  | { kind: "invalid" }
  /** 503, any other status, or no answer at all (offline, timeout). */
  | { kind: "down" };

/**
 * @param status HTTP status of the /api/contact answer, or null when the request itself failed.
 * @param retryAfter the Retry-After header of that answer (seconds), if any.
 */
export function sendFailure(status: number | null, retryAfter: string | null): SendFailure {
  if (status === 429) {
    const seconds = /^\d+$/.test(retryAfter?.trim() ?? "") ? Number(retryAfter) : NaN;
    const minutes = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : MAX_WAIT_MINUTES;
    return { kind: "busy", minutes: Math.min(MAX_WAIT_MINUTES, Math.max(1, minutes)) };
  }
  if (status === 400 || status === 413 || status === 415) return { kind: "invalid" };
  return { kind: "down" };
}
