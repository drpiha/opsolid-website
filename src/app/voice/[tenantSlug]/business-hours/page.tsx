/**
 * Öffnungszeiten — weekly grid + holiday overrides + AI mode info card.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import BusinessHoursClient from "./BusinessHoursClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function BusinessHoursPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true, timezone: true },
  });
  if (!tenant) return null;

  const hours = await prisma.voiceBusinessHours.findMany({
    where: { tenantId: tenant.id },
    orderBy: [{ isOverride: "asc" }, { dayOfWeek: "asc" }],
  });

  const weekly = hours
    .filter((h) => !h.isOverride)
    .map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
      aiMode: h.aiMode as
        | "always_on"
        | "outside_hours"
        | "overflow"
        | "manual_off",
    }));

  const overrides = hours
    .filter((h) => h.isOverride)
    .map((h) => ({
      id: h.id,
      overrideDate: h.overrideDate ?? "",
      overrideLabel: h.overrideLabel ?? "",
      isClosed: h.isClosed,
      openTime: h.openTime,
      closeTime: h.closeTime,
    }));

  return (
    <>
      <PageHeader
        eyebrow={`Zeitzone · ${tenant.timezone}`}
        title="Öffnungszeiten"
        description="Wann übernimmt die KI Anrufe? Wochenplan + Sondertermine wie Feiertage."
      />
      <BusinessHoursClient
        tenantId={tenant.id}
        token={token}
        weekly={weekly}
        overrides={overrides}
      />
    </>
  );
}
