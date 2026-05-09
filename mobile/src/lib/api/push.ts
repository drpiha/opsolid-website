// -----------------------------------------------------------------------
// M4 — Push registration API client.
//
// One endpoint: POST /api/v1/push/register. The server upserts on
// (userId, deviceId) so re-registers refresh the row in place.
// -----------------------------------------------------------------------

import { apiFetch } from './client';

export type RegisterPushResponse = { ok: true; id: string };

export async function registerPushDevice(
  token: string,
  deviceId: string,
  platform: 'ios' | 'android',
): Promise<RegisterPushResponse> {
  return apiFetch<RegisterPushResponse>('/api/v1/push/register', {
    method: 'POST',
    body: JSON.stringify({ token, deviceId, platform }),
  });
}
