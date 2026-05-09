// =============================================================================
// M5 — billing API wrappers.
//
// /api/v1/billing/checkout   — start Pro Checkout for { interval }
// /api/v1/billing/portal     — open Stripe Customer Portal
// /api/v1/billing/me         — current Pro state for the caller
// /api/v1/billing/domain-request — submit a custom domain (Pro-gated)
// =============================================================================

import { apiFetch } from './client';

export type ProInterval = 'monthly' | 'yearly';

export type BillingMeResponse = {
  isPro: boolean;
  proSince: string | null;
  hasStripeCustomer: boolean;
  subscription: {
    status: string;
    priceId: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  prices: { monthly: string | null; yearly: string | null };
};

export async function getBillingMe(): Promise<BillingMeResponse> {
  return apiFetch<BillingMeResponse>('/api/v1/billing/me');
}

export async function startProCheckout(
  interval: ProInterval,
): Promise<{ url: string; sessionId: string }> {
  return apiFetch<{ url: string; sessionId: string }>(
    '/api/v1/billing/checkout',
    {
      method: 'POST',
      body: JSON.stringify({ interval }),
    },
  );
}

export async function openProPortal(): Promise<{ url: string }> {
  return apiFetch<{ url: string }>('/api/v1/billing/portal', {
    method: 'POST',
  });
}

export async function submitDomainRequest(args: {
  domain: string;
  cardOrderId?: string;
  notes?: string;
}): Promise<{ id: string; domain: string; status: string; createdAt: string }> {
  return apiFetch('/api/v1/billing/domain-request', {
    method: 'POST',
    body: JSON.stringify(args),
  });
}

// ---------------------------------------------------------------------------
// Per-card analytics (Pro-only).
// ---------------------------------------------------------------------------

export type CardAnalytics = {
  cardId: string;
  slug: string | null;
  windowDays: number;
  totals: {
    views: number;
    uniqueVisitors: number;
    leads: number;
    saves: number;
    mutualSaves: number;
    shares: number;
  };
  shareEventsByChannel: Record<string, number>;
};

export async function getCardAnalytics(cardId: string): Promise<CardAnalytics> {
  return apiFetch<CardAnalytics>(
    `/api/v1/cards/${encodeURIComponent(cardId)}/analytics`,
  );
}

/**
 * Build the URL the in-app browser should open to download the HTML export.
 * The auth bearer is included as a query param via the existing client (the
 * server route accepts Authorization header; we use a short-lived token in
 * the URL via apiFetch's response stream — not safe to cross to the browser).
 *
 * Workaround: fetch the HTML body, write it to a temp file via Sharing.
 * Implementation lives at the call site (mobile/app/(app)/analytics.tsx /
 * settings) because we don't want to import expo-file-system here.
 */
export const cardExportPath = (cardId: string) =>
  `/api/v1/cards/${encodeURIComponent(cardId)}/export`;
