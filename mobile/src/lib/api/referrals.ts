// =============================================================================
// M3 — Referral API client.
//
// Two endpoints:
//   GET  /api/v1/referrals/me     — fetch the user's code + redemption count.
//   POST /api/v1/referrals/redeem — attribute a `?ref=` deep-link param after
//                                    the new user has authenticated.
//
// Both go through apiFetch so the Bearer token is auto-attached and 401 →
// refresh → retry is applied.
// =============================================================================

import { apiFetch } from './client';

export type ReferralMeResponse = {
  code: string;
  redemptions: number;
  /** Pre-built share URL, e.g. https://opsolid.de/c/?ref=AB12CD */
  deepLink: string;
};

export async function getMyReferral(): Promise<ReferralMeResponse> {
  return apiFetch<ReferralMeResponse>('/api/v1/referrals/me');
}

export type ReferralRedeemResponse = {
  /** True when this call created a new redemption; false on idempotent no-op
   *  (already-redeemed or self-referral) or unknown ref. */
  created: boolean;
  /** The userId being credited; null when the ref didn't resolve. */
  referrerUserId: string | null;
};

export async function redeemReferral(
  code: string,
): Promise<ReferralRedeemResponse> {
  return apiFetch<ReferralRedeemResponse>('/api/v1/referrals/redeem', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}
