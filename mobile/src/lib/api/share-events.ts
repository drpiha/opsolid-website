// =============================================================================
// M3 — Share telemetry client.
//
// `logShareEvent` is fire-and-forget — never let a network failure block a
// share gesture. Callers should `void logShareEvent(…).catch(() => {})`.
//
// `getShareSummary` returns a 30-day per-channel aggregate scoped to the
// authenticated user's owned cards. Used by the Settings → "Sharing analytics"
// panel.
// =============================================================================

import { apiFetch } from './client';

export type ShareChannel = 'qr' | 'link' | 'nfc' | 'native_share';

export async function logShareEvent(
  sourceCardId: string,
  channel: ShareChannel,
): Promise<void> {
  await apiFetch<{ ok: true }>('/api/v1/share-events', {
    method: 'POST',
    body: JSON.stringify({ sourceCardId, channel }),
  });
}

export type ShareSummary = {
  totals: Record<ShareChannel, number>;
  total: number;
  days: number;
};

export async function getShareSummary(): Promise<ShareSummary> {
  return apiFetch<ShareSummary>('/api/v1/share-events/summary');
}
