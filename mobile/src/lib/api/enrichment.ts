// -----------------------------------------------------------------------
// Enrichment API — POST /api/v1/enrichment/from-url
//
// M7 Wave 2 (mobile). The user pastes a public URL (GitHub profile,
// YouTube channel, or any page that exposes oEmbed / OpenGraph) and the
// server returns a structured set of fields the edit-card screen can
// pre-fill — displayName, bio, avatarUrl, followerCount, …
//
// `source: 'linkedin-self'` is a sentinel: LinkedIn doesn't allow
// profile lookup from a third party, so the server returns this code as
// a hint to redirect the user toward a self-OAuth flow instead.
// -----------------------------------------------------------------------

import { apiFetch } from './client';

export type EnrichmentSource =
  | 'github'
  | 'youtube'
  | 'oembed'
  | 'opengraph'
  | 'linkedin-self';

export type EnrichmentLink = { kind: string; url: string };

export type EnrichmentResult = {
  source: EnrichmentSource;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  followerCount?: number;
  role?: string;
  website?: string;
  location?: string;
  links?: EnrichmentLink[];
};

/** POST /api/v1/enrichment/from-url — body { url } → EnrichmentResult. */
export async function enrichFromUrl(url: string): Promise<EnrichmentResult> {
  return apiFetch<EnrichmentResult>('/api/v1/enrichment/from-url', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}
