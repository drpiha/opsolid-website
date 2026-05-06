import { apiFetch } from './client';
import type { ApiCard } from './types';

export type DiscoverCard = {
  id: string;
  slug: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
  industry: string | null;
  city: string | null;
  country: string | null;
  languages: string[];
  openToNetworking: boolean;
  acceptingClients: boolean;
  publishedAt: string | null;
};

export type DiscoverResponse = {
  items: DiscoverCard[];
  nextCursor: string | null;
};

export async function discoverCards(params?: {
  q?: string;
  industry?: string;
  city?: string;
  country?: string;
  language?: string;
  openToNetworking?: boolean;
  acceptingClients?: boolean;
  cursor?: string;
  limit?: number;
}): Promise<DiscoverResponse> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.industry) qs.set('industry', params.industry);
  if (params?.city) qs.set('city', params.city);
  if (params?.country) qs.set('country', params.country);
  if (params?.language) qs.set('language', params.language);
  if (params?.openToNetworking) qs.set('openToNetworking', 'true');
  if (params?.acceptingClients) qs.set('acceptingClients', 'true');
  if (params?.cursor) qs.set('cursor', params.cursor);
  if (params?.limit) qs.set('limit', String(params.limit));
  const q = qs.toString();
  return apiFetch<DiscoverResponse>(`/api/discover/cards${q ? '?' + q : ''}`);
}

export async function getPublicCard(slug: string): Promise<{ card: ApiCard }> {
  return apiFetch<{ card: ApiCard }>(
    `/api/v1/public/cards/${encodeURIComponent(slug)}`,
  );
}
