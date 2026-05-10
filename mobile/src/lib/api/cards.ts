// -----------------------------------------------------------------------
// Cards API wrappers — all calls use apiFetch for Bearer + refresh rotation.
// -----------------------------------------------------------------------

import { apiFetch, API_BASE, getAccessToken } from './client';
import type {
  ApiCard,
  CardListResponse,
  CardDetailResponse,
  CardDeleteResponse,
} from './types';

/**
 * GET /api/v1/cards — cursor-paginated list (limit default 20).
 */
export async function listCards(params?: {
  limit?: number;
  cursor?: string;
}): Promise<CardListResponse> {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.cursor) qs.set('cursor', params.cursor);
  const path = `/api/v1/cards${qs.toString() ? '?' + qs.toString() : ''}`;
  return apiFetch<CardListResponse>(path);
}

/**
 * GET /api/v1/cards/:id — full ApiCard detail.
 */
export async function getCard(id: string): Promise<ApiCard> {
  const res = await apiFetch<CardDetailResponse>(
    `/api/v1/cards/${encodeURIComponent(id)}`,
  );
  return res.card;
}

/**
 * DELETE /api/v1/cards/:id — soft delete (status → CANCELLED).
 */
export async function deleteCard(id: string): Promise<void> {
  await apiFetch<CardDeleteResponse>(
    `/api/v1/cards/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
}

/**
 * POST /api/v1/cards — create a FREE-tier card.
 */
export async function createCard(input: import('./types').CardCreateInput): Promise<ApiCard> {
  const res = await apiFetch<{ card: ApiCard }>('/api/v1/cards', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.card;
}

/**
 * PATCH /api/v1/cards/:id — update card fields.
 *
 * Heavy writes: cardData carries buttons/services/faqs/embeds/etc. and the
 * server merges with the previous JSON, runs the Pro check, and updates the
 * row in one transaction. The 8s default timeout in apiFetch is for cheap
 * hydrate calls — give this 30s headroom so a slow 4G round-trip with a
 * 30 KB payload doesn't AbortError into a generic "save failed" alert.
 */
export async function updateCard(
  id: string,
  patch: import('./types').CardPatchInput,
): Promise<ApiCard> {
  const res = await apiFetch<{ card: ApiCard }>(
    `/api/v1/cards/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(patch),
      timeoutMs: 30_000,
    },
  );
  return res.card;
}

/**
 * M1 — POST /api/v1/cards/draft-from-image. Mobile sends a base64-encoded
 * (already resized + compressed) image of a paper business card. Server
 * forwards to Google Cloud Vision and parses the OCR output into structured
 * fields. Returns 503 when GOOGLE_CLOUD_VISION_API_KEY is unset on the VPS;
 * the wizard renders a "Coming soon" state in that case.
 */
export async function draftFromImage(
  imageBase64: string,
): Promise<import('./types').DraftFromImageResponse> {
  return apiFetch<import('./types').DraftFromImageResponse>(
    '/api/v1/cards/draft-from-image',
    { method: 'POST', body: JSON.stringify({ imageBase64 }) },
  );
}

/**
 * M1 — POST /api/v1/cards/draft-from-url. Mobile sends a LinkedIn / personal
 * site / company URL; server fetches (5s + 1MB cap) and pipes through Claude
 * Haiku for structured extraction. Returns 503 when ANTHROPIC_API_KEY is
 * unset on the VPS.
 */
export async function draftFromUrl(
  url: string,
): Promise<import('./types').DraftFromUrlResponse> {
  return apiFetch<import('./types').DraftFromUrlResponse>(
    '/api/v1/cards/draft-from-url',
    { method: 'POST', body: JSON.stringify({ url }) },
  );
}

/**
 * Upload a local image to /api/uploads and return the server path.
 *
 * Uses raw fetch so FormData sets the multipart boundary correctly — apiFetch
 * hardcodes Content-Type: application/json which would corrupt the boundary.
 * The Bearer header is attached manually because /api/uploads/route.ts calls
 * requireUser() and 401s without it. Single-shot, no refresh-on-401 retry —
 * if a fresh login is needed the user will see the alert and re-tap.
 *
 * 30s timeout: a 3 MB JPEG over 4G is ~8-15s round-trip; 8s default is too
 * tight and was the original "Upload failed" cause on real installed APKs.
 */
export async function uploadPhoto(
  uri: string,
  mimeType: string = 'image/jpeg',
): Promise<string> {
  const form = new FormData();
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  // React Native FormData accepts { uri, name, type } for file blobs
  form.append('file', { uri, name: `photo.${ext}`, type: mimeType } as unknown as Blob);
  form.append('kind', 'photo');

  const token = await getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(`${API_BASE}/api/uploads`, {
      method: 'POST',
      body: form,
      headers,
      signal: controller.signal,
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Upload failed: ${res.status} ${body}`);
    }
    const data = (await res.json()) as { path: string };
    return data.path;
  } finally {
    clearTimeout(timer);
  }
}
