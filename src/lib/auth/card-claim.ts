import type { PrismaClient } from "@/generated/prisma";

export const CARD_CLAIM_FORBIDDEN = { error: "claim_not_available" } as const;

type CardClaimUser = {
  id: string;
  email: string;
  emailVerifiedAt: Date | null;
};

type LegacyCardIdentity = {
  userId: string | null;
  contactEmail: string;
};

export type LegacyCardClaimDecision =
  | "claimable"
  | "owned"
  | "unverified"
  | "email_mismatch"
  | "owned_by_other";

export function getVerifiedClaimEmail(
  user: Pick<CardClaimUser, "email" | "emailVerifiedAt">,
): string | null {
  if (!user.emailVerifiedAt) return null;
  return user.email.trim().toLowerCase();
}

type ClaimableLegacyCard = {
  id: string;
  slug: string | null;
  contactName: string;
  status: string;
  createdAt: Date;
};

export async function findClaimableLegacyCards(
  store: Pick<PrismaClient, "$queryRaw">,
  user: Pick<CardClaimUser, "email" | "emailVerifiedAt">,
): Promise<ClaimableLegacyCard[]> {
  const email = getVerifiedClaimEmail(user);
  if (!email) return [];
  // Normalize inside the database so historic surrounding spaces do not hide
  // legitimate cards. Prisma binds email as a parameter; never interpolate SQL.
  return store.$queryRaw<ClaimableLegacyCard[]>`
    SELECT id, slug, contact_name AS "contactName", status, created_at AS "createdAt"
    FROM card_orders
    WHERE user_id IS NULL AND lower(btrim(contact_email)) = ${email}
    ORDER BY created_at DESC, id DESC
    LIMIT 100
  `;
}

export function legacyCardClaimDecision(
  user: CardClaimUser,
  card: LegacyCardIdentity,
): LegacyCardClaimDecision {
  const verifiedEmail = getVerifiedClaimEmail(user);
  if (!verifiedEmail) return "unverified";
  if (card.userId === user.id) return "owned";
  if (card.userId !== null) return "owned_by_other";
  if (card.contactEmail.trim().toLowerCase() !== verifiedEmail) {
    return "email_mismatch";
  }
  return "claimable";
}

type LegacyCardClaimStore = {
  cardOrder: {
    updateMany(args: {
      where: { id: string; userId: null; contactEmail: string };
      data: { userId: string };
    }): Promise<{ count: number }>;
    findUnique(args: {
      where: { id: string };
      select: { userId: true };
    }): Promise<{ userId: string | null } | null>;
  };
};

export async function claimUnownedLegacyCard(
  store: LegacyCardClaimStore,
  cardId: string,
  userId: string,
  contactEmail: string,
): Promise<"claimed" | "owned" | "unavailable"> {
  const result = await store.cardOrder.updateMany({
    // Bind the email proof to the row value that was actually checked. A
    // concurrent contact edit must not turn this into a claim for another email.
    where: { id: cardId, userId: null, contactEmail },
    data: { userId },
  });
  if (result.count === 1) return "claimed";

  // Another request may have claimed the row after the initial read. Re-read
  // ownership without overwriting it, preserving idempotency for the winner.
  const current = await store.cardOrder.findUnique({
    where: { id: cardId },
    select: { userId: true },
  });
  return current?.userId === userId ? "owned" : "unavailable";
}
