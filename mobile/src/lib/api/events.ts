// -----------------------------------------------------------------------
// Sprint F2 — Events / Fairs API client.
//
// `/api/v1/events` is public (no Bearer needed) but apiFetch tolerates the
// missing token gracefully — it just doesn't attach a Authorization header.
// `/api/v1/cards/:id/events` is owner-only and DOES need Bearer.
// -----------------------------------------------------------------------

import { apiFetch } from './client';
import type { ApiCard } from './types';

// Mirrors the server response shape from /api/v1/events.
export type EventListItem = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string | null;
  venue: string | null;
  startAt: string;
  endAt: string;
  description: string | null;
  coverPath: string | null;
  attendeeCount: number;
};

export type EventListResponse = {
  items: EventListItem[];
};

// /api/v1/events/:slug returns the full event + attendee public cards.
// Attendees are shaped via toPublicApiCard, which is a subset of ApiCard
// (no id/feedbackEnabled/visibility/attendingEventIds). We type it as the
// fields the mobile detail screen actually reads to keep callers honest.
export type EventDetailAttendee = Pick<
  ApiCard,
  | 'slug'
  | 'status'
  | 'templateId'
  | 'layoutKey'
  | 'themeKey'
  | 'cardData'
  | 'brandPrimaryHex'
  | 'brandAccentHex'
  | 'photoPath'
  | 'logoPath'
  | 'publishedAt'
>;

export type EventDetail = {
  event: {
    id: string;
    slug: string;
    name: string;
    city: string;
    country: string | null;
    venue: string | null;
    startAt: string;
    endAt: string;
    description: string | null;
    coverPath: string | null;
  };
  attendees: EventDetailAttendee[];
};

export async function listEvents(params?: { limit?: number }): Promise<EventListResponse> {
  // The server caps at 50 and there's no `limit` param at the moment; the
  // optional `limit` here is honored client-side so the Discover rail can
  // keep its slice short without a separate endpoint.
  const res = await apiFetch<EventListResponse>('/api/v1/events');
  if (params?.limit && res.items.length > params.limit) {
    return { items: res.items.slice(0, params.limit) };
  }
  return res;
}

export async function getEvent(slug: string): Promise<EventDetail> {
  return apiFetch<EventDetail>(`/api/v1/events/${encodeURIComponent(slug)}`);
}

/**
 * POST /api/v1/cards/:id/events — replace the card's event-attendance set.
 * Owner-only; pass an empty array to clear all attendance.
 */
export async function updateCardEvents(
  cardId: string,
  eventIds: string[],
): Promise<{ ok: true; attendingEventIds: string[] }> {
  return apiFetch<{ ok: true; attendingEventIds: string[] }>(
    `/api/v1/cards/${encodeURIComponent(cardId)}/events`,
    { method: 'POST', body: JSON.stringify({ eventIds }) },
  );
}
