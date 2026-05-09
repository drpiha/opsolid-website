import { apiFetch } from './client';

export type SavedContactCard = {
  id: string;
  slug: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
  industry: string | null;
  city: string | null;
  country: string | null;
};

export type SavedContact = {
  id: string;
  notes: string | null;
  tags: string[];
  metWhere: string | null;
  followUpAt: string | null;
  status: string;
  starred: boolean;
  createdAt: string;
  card: SavedContactCard;
};

export type SavedContactsResponse = { items: SavedContact[] };

export async function listContacts(params?: {
  starred?: boolean;
  status?: string;
}): Promise<SavedContactsResponse> {
  const qs = new URLSearchParams();
  if (params?.starred) qs.set('starred', 'true');
  if (params?.status) qs.set('status', params.status);
  const q = qs.toString();
  return apiFetch<SavedContactsResponse>(
    `/api/account/saved-cards${q ? '?' + q : ''}`,
  );
}

export async function saveCard(slug: string): Promise<{ saved: boolean; id?: string }> {
  return apiFetch<{ saved: boolean; id?: string }>(
    `/api/cards/${encodeURIComponent(slug)}/save`,
    { method: 'POST' },
  );
}

export async function unsaveCard(slug: string): Promise<{ saved: boolean }> {
  return apiFetch<{ saved: boolean }>(
    `/api/cards/${encodeURIComponent(slug)}/save`,
    { method: 'DELETE' },
  );
}

export async function checkSaved(slug: string): Promise<{ saved: boolean }> {
  return apiFetch<{ saved: boolean }>(
    `/api/cards/${encodeURIComponent(slug)}/save`,
  );
}

export type SampleSeedResponse = {
  created: number;
  alreadyHad: number;
  notFound: number;
  slugsCreated: string[];
  slugsAlreadyHad: string[];
  slugsNotFound: string[];
};

/**
 * One-shot seed of demo contacts for users with an empty Contacts tab. Posts
 * to the bearer-gated v1 endpoint; defaults to 5 DACH/EU SME personas if no
 * slugs are passed.
 */
export async function seedSampleContacts(
  slugs?: string[],
): Promise<SampleSeedResponse> {
  return apiFetch<SampleSeedResponse>('/api/v1/contacts/sample-seed', {
    method: 'POST',
    body: JSON.stringify(slugs ? { slugs } : {}),
  });
}
