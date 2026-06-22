// =============================================================================
// /dashboard/admin — READ-ONLY operator view of ALL cards + their leads.
//
// SECURITY: the dashboard layout authenticates (refresh cookie + getSessionUser)
// but does NOT check role. This page therefore RE-resolves the user and calls
// notFound() (HTTP 404) for anyone who is not role=ADMIN, so a non-admin can
// neither see this page nor learn that it exists. Every admin route/endpoint
// MUST repeat this gate — never trust the layout alone.
//
// Admin-only — strings are inline English (the lead is editing the locale
// content files concurrently; this page must not touch them).
// =============================================================================

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { AdminCardsClient, type AdminCardRow } from "./AdminCardsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · All Cards · OpSolid",
  robots: { index: false, follow: false },
};

interface Props {
  params: { locale: string };
}

export default async function DashboardAdminPage({ params }: Props) {
  const { locale } = params;

  // --- Role gate (defence-in-depth; layout only proves "logged in") ----------
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;

  // 404 (not 403) for non-admins so the route's existence is never leaked.
  if (!user || user.role !== "ADMIN") {
    notFound();
  }

  // --- Data: ALL cards, newest first, capped --------------------------------
  const cards = await prisma.cardOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      slug: true,
      contactName: true,
      contactEmail: true,
      contactPhone: true,
      // NOTE: there is no `company` column on CardOrder — the company name
      // lives inside `cardData.company`. The client derives it from there.
      status: true,
      templateId: true,
      createdAt: true,
      cardData: true,
      userId: true,
      _count: { select: { views: true, leads: true } },
    },
  });

  // Dates can't cross the server→client boundary — serialise to ISO.
  const rows: AdminCardRow[] = cards.map((c) => ({
    id: c.id,
    slug: c.slug,
    contactName: c.contactName,
    contactEmail: c.contactEmail,
    contactPhone: c.contactPhone,
    status: c.status,
    templateId: c.templateId,
    userId: c.userId,
    createdAt: c.createdAt.toISOString(),
    viewCount: c._count.views,
    leadCount: c._count.leads,
    cardData: c.cardData,
  }));

  return <AdminCardsClient rows={rows} locale={locale} />;
}
