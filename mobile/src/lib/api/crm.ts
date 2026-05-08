// -----------------------------------------------------------------------
// CRM API wrappers — public lead form, smart-exchange, feedback rate/aggregate.
// Mirrors the patterns in cards.ts: every call goes through apiFetch so the
// Bearer token (when present) is auto-attached and 401 → refresh → retry is
// applied. The public endpoints (lead, exchange, feedback aggregate) work
// without a token because the server route doesn't gate them; apiFetch is
// still safe to use (it just sends Authorization when a token exists).
// -----------------------------------------------------------------------

import { apiFetch } from './client';

// ---------- Lead form ----------
// POST /api/cards/[slug]/lead — public endpoint, rate-limited 5/10min per
// (slug, ip). Server zod schema in src/app/api/cards/[slug]/lead/route.ts.
export type LeadInput = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  interest?: string;
  meetingContext?: string;
  consent: true;
};

export async function submitLead(
  slug: string,
  payload: LeadInput,
): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>(
    `/api/cards/${encodeURIComponent(slug)}/lead`,
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

// ---------- Smart exchange ----------
// POST /api/cards/[slug]/exchange — caller passes their own (PUBLISHED) card's
// slug as `visitorSlug`. Rate-limited 3/hour per (owner, visitor) pair.
export type ExchangeInput = {
  visitorSlug: string;
  source?: string;
  campaign?: string;
  note?: string;
};

export async function sendCardExchange(
  slug: string,
  body: ExchangeInput,
): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>(
    `/api/cards/${encodeURIComponent(slug)}/exchange`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

// ---------- Feedback ----------
// POST /api/cards/[slug]/feedback — REQUIRES Bearer token. Server returns
// 201 { created: true } on first submit, 200 { updated: true } on re-submit.
// We normalize both shapes so callers can show a generic success state.
export type FeedbackCategory =
  | 'design'
  | 'readability'
  | 'photo'
  | 'cta'
  | 'mobile'
  | 'trust'
  | 'content';

export type FeedbackRatings = Record<FeedbackCategory, number>;

export type FeedbackInput = {
  ratings: FeedbackRatings;
  comment?: string;
};

export async function submitFeedback(
  slug: string,
  body: FeedbackInput,
): Promise<{ created: boolean; updated: boolean }> {
  const res = await apiFetch<{ created?: boolean; updated?: boolean }>(
    `/api/cards/${encodeURIComponent(slug)}/feedback`,
    { method: 'POST', body: JSON.stringify(body) },
  );
  return {
    created: res.created === true,
    updated: res.updated === true,
  };
}

// GET /api/cards/[slug]/feedback — public aggregate. `enabled: false` when
// the card has feedbackEnabled off (or when the slug doesn't resolve to a
// PUBLISHED card). Always returns 200 — never throws on 404 / disabled state.
export type FeedbackAggregate = {
  enabled: boolean;
  count: number;
  averages: Record<string, number>;
};

export async function getFeedbackAggregate(
  slug: string,
): Promise<FeedbackAggregate> {
  return apiFetch<FeedbackAggregate>(
    `/api/cards/${encodeURIComponent(slug)}/feedback`,
  );
}
