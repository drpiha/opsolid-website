import type { Prisma } from "@/generated/prisma";

/** First email proof must not elevate credentials from an unverified signup. */
export async function verifyEmailOwnership(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const verifiedAt = new Date();
  const changed = await tx.user.updateMany({
    where: { id: userId, emailVerifiedAt: null },
    data: { emailVerifiedAt: verifiedAt, passwordHash: null },
  });
  if (changed.count === 1) {
    await tx.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: verifiedAt },
    });
  }
  return tx.user.findUnique({ where: { id: userId } });
}

/** Strict boundary also rejects old second-resolution JWTs in the same second. */
export function authenticationIsCurrent(
  authenticatedAt: Date | number,
  emailVerifiedAt: Date | null,
): boolean {
  const at = typeof authenticatedAt === "number" ? authenticatedAt : authenticatedAt.getTime();
  return Number.isFinite(at) && (!emailVerifiedAt || at > emailVerifiedAt.getTime());
}

/** A newly proved email may be stamped in this same millisecond. */
export function verifiedAuthenticationTime(emailVerifiedAt: Date | null): Date {
  return new Date(Math.max(Date.now(), (emailVerifiedAt?.getTime() ?? 0) + 1));
}
