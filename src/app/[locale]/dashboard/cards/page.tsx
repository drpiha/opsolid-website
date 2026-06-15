// =============================================================================
// /dashboard/cards — user's card list page (B0.5 / B0.6)
//
// Server component: re-validates session, queries owned cards AND claimable
// cards (userId=null, email match), passes both to CardListClient.
// Layout already redirects unauthenticated visitors.
// =============================================================================

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { CardListClient } from "./CardListClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Cards · OpSolid Dashboard",
  robots: { index: false, follow: false },
};

interface Props {
  params: { locale: string };
}

export default async function DashboardCardsPage({ params }: Props) {
  const { locale } = params;

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;

  if (!user) {
    redirect(`/${locale}/login?next=/dashboard/cards`);
  }

  // Owned cards + claimable cards fetched in parallel.
  const [cards, claimableCandidates] = await Promise.all([
    prisma.cardOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        templateId: true,
        contactName: true,
        status: true,
        cardData: true,
        editToken: true,
        createdAt: true,
        _count: { select: { views: true } },
      },
    }),
    // B0.6: unclaimed cards whose contactEmail matches the user (case-insensitive).
    prisma.cardOrder.findMany({
      where: {
        userId: null,
        contactEmail: {
          equals: user.email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        slug: true,
        contactName: true,
        status: true,
        createdAt: true,
        contactEmail: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Secondary trim guard for claimable (old data may have whitespace).
  const normalizedUserEmail = user.email.toLowerCase();
  const claimable = claimableCandidates.filter(
    (c) => c.contactEmail.trim().toLowerCase() === normalizedUserEmail,
  );

  // Serialize dates — cannot pass Date objects across server→client boundary.
  const serializedCards = cards.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  const serializedClaimable = claimable.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.contactName,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <CardListClient
      cards={serializedCards}
      claimable={serializedClaimable}
      locale={locale}
      userEmail={user.email}
    />
  );
}
