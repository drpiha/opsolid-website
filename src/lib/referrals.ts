// =============================================================================
// M3 — Referral helpers.
//
// Each user gets a single 6-character alphanumeric referral code, generated
// lazily on first /api/v1/referrals/me read (or on first card publish — the
// signup-completes hook calls into ensureReferralForUser). The code is
// embedded in deep-links: `https://opsolid.de/c/?ref=<CODE>` and shared via
// the Settings → "Refer a friend" row.
//
// Redemption is idempotent on the (referralId, refereeUserId) pair. The
// /redeem route is public; it expects the referee to already be authenticated
// (the ref code rides along with the magic-link signup flow as a query param,
// and the post-auth handler calls /redeem on their behalf).
// =============================================================================

import { prisma } from "@/lib/prisma";

// 6-char alphanumeric — uppercase letters + digits. ~36^6 = 2.2B keyspace,
// collision-free at any plausible MAU. Visually distinct: no I/O/0 to avoid
// confusion when read aloud or copied from a screenshot.
const REFERRAL_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REFERRAL_CODE_LENGTH = 6;
const MAX_GENERATION_RETRIES = 6;

function generateReferralCode(): string {
  let out = "";
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    out += REFERRAL_CODE_ALPHABET[
      Math.floor(Math.random() * REFERRAL_CODE_ALPHABET.length)
    ];
  }
  return out;
}

export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}

/**
 * Resolve the user's referral row, creating it if missing. On creation, we
 * generate a unique code with bounded retry (collisions are vanishingly rare
 * at the keyspace size).
 */
export async function ensureReferralForUser(
  userId: string,
): Promise<{ id: string; code: string; redemptions: number }> {
  const existing = await prisma.referral.findUnique({
    where: { referrerUserId: userId },
    select: { id: true, code: true, redemptions: true },
  });
  if (existing) return existing;

  for (let i = 0; i < MAX_GENERATION_RETRIES; i++) {
    const code = generateReferralCode();
    try {
      const created = await prisma.referral.create({
        data: { referrerUserId: userId, code },
        select: { id: true, code: true, redemptions: true },
      });
      return created;
    } catch (err) {
      // Unique constraint collision on (code) or (referrerUserId). Retry the
      // code; if the second branch hits we lost the race and the row already
      // exists — re-read and return.
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("referrals_referrer_user_id_key")) {
        const existingRow = await prisma.referral.findUnique({
          where: { referrerUserId: userId },
          select: { id: true, code: true, redemptions: true },
        });
        if (existingRow) return existingRow;
      }
      // otherwise: code collision — loop and try a fresh code.
    }
  }
  throw new Error("ensureReferralForUser: exhausted code generation retries");
}

/**
 * Resolve a referrer userId from either a 6-char referral code OR a card
 * slug. Used by the redeem route — the public-viewer "Create yours" CTA
 * embeds the slug as `?ref=<slug>` (referrer is the slug owner). The code
 * path is the explicit user-shared invite link (`?ref=<CODE>`).
 *
 * Returns null when neither a referral row nor a published card slug
 * resolves — caller treats that as "ignore the param silently".
 */
export async function resolveReferrerByRef(
  ref: string,
): Promise<string | null> {
  const trimmed = ref.trim();
  if (!trimmed) return null;

  // Code path: 6-char uppercase alphanumeric.
  if (isValidReferralCode(trimmed.toUpperCase())) {
    const code = trimmed.toUpperCase();
    const row = await prisma.referral.findUnique({
      where: { code },
      select: { referrerUserId: true },
    });
    if (row) return row.referrerUserId;
    // Fall through — the user might have a slug that happens to be 6 chars.
  }

  // Slug path: looks like a card slug, look up the published card's owner.
  // Same regex as src/lib/slug.ts.
  if (/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/.test(trimmed.toLowerCase())) {
    const slug = trimmed.toLowerCase();
    const card = await prisma.cardOrder.findUnique({
      where: { slug },
      select: { userId: true, status: true },
    });
    if (card && card.status === "PUBLISHED" && card.userId) {
      return card.userId;
    }
  }

  return null;
}

/**
 * Idempotently redeem a referral. Self-referral is a silent no-op (returning
 * `{ created: false }`) because the public-viewer CTA can fire when the user
 * has already auth'd as the slug owner.
 *
 * Returns:
 *   - `{ created: true }` on a fresh redemption (Referral.redemptions++).
 *   - `{ created: false }` when the (referrer, referee) pair already exists
 *     OR when self-referral / unknown ref.
 */
export async function redeemReferral(
  ref: string,
  refereeUserId: string,
): Promise<{ created: boolean; referrerUserId: string | null }> {
  const referrerUserId = await resolveReferrerByRef(ref);
  if (!referrerUserId) return { created: false, referrerUserId: null };
  if (referrerUserId === refereeUserId) {
    // Self-referral — nothing to record.
    return { created: false, referrerUserId };
  }

  const referral = await ensureReferralForUser(referrerUserId);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.referralRedemption.create({
        data: {
          referralId: referral.id,
          refereeUserId,
        },
      });
      await tx.referral.update({
        where: { id: referral.id },
        data: { redemptions: { increment: 1 } },
      });
    });
    return { created: true, referrerUserId };
  } catch (err) {
    // Unique constraint on (referralId, refereeUserId) — already redeemed.
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("referral_redemptions_referral_id_referee_user_id_key")) {
      return { created: false, referrerUserId };
    }
    throw err;
  }
}
