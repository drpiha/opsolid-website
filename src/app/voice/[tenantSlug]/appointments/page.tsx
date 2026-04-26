/**
 * Termine — appointment booking rules. Single rule per tenant for now;
 * the form picks a booking type and configures the relevant fields.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import AppointmentsForm from "./AppointmentsForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function AppointmentsPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant) return null;

  const [rule, integrations] = await Promise.all([
    prisma.voiceAppointmentRule.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.voiceIntegration.findMany({
      where: { tenantId: tenant.id },
      select: { id: true, integrationType: true, status: true },
    }),
  ]);

  const hasCalCom = integrations.some(
    (i) => i.integrationType === "cal_com" && i.status === "active",
  );

  return (
    <>
      <PageHeader
        eyebrow="Buchungslogik"
        title="Termine"
        description="Wie wandelt der Agent Anrufe in Termine um? Wählen Sie eine Buchungsart, die zu Ihrem Workflow passt."
      />
      <AppointmentsForm
        tenantId={tenant.id}
        token={token}
        rule={
          rule
            ? {
                id: rule.id,
                name: rule.name,
                isActive: rule.isActive,
                bookingType: rule.bookingType,
                calApiKey: rule.calApiKey,
                calEventTypeId: rule.calEventTypeId,
                bookingUrl: rule.bookingUrl,
                bufferMinutes: rule.bufferMinutes,
                minNoticeMinutes: rule.minNoticeMinutes,
                maxDaysAhead: rule.maxDaysAhead,
                slotDurationMin: rule.slotDurationMin,
                conflictPolicy: rule.conflictPolicy,
                confirmationMsg: rule.confirmationMsg,
              }
            : null
        }
        hasCalCom={hasCalCom}
      />
    </>
  );
}
