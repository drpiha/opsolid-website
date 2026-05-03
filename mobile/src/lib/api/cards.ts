// -----------------------------------------------------------------------
// Cards API wrappers — all calls use apiFetch for Bearer + refresh rotation.
// -----------------------------------------------------------------------

import { apiFetch } from './client';
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
