/**
 * DSGVO / Recht — compliance toggles. Currently driven by tenant.featureFlags
 * JSON. The form maps each toggle to a slot inside that JSON object.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import ComplianceForm from "./ComplianceForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function CompliancePage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true, featureFlags: true, businessName: true },
  });
  if (!tenant) return null;

  const flags =
    typeof tenant.featureFlags === "object" && tenant.featureFlags !== null
      ? (tenant.featureFlags as Record<string, unknown>)
      : {};

  return (
    <>
      <PageHeader
        eyebrow="DSGVO · Telekommunikationsrecht"
        title="Compliance"
        description="Datenschutz-Einstellungen, Aufzeichnungs-Richtlinie und Auftragsverarbeitung. Wir hosten in Deutschland — Ihre Daten verlassen die EU nicht."
      />
      <ComplianceForm
        tenantId={tenant.id}
        token={token}
        initial={{
          aiDisclosure: flags.aiDisclosure !== false,
          recordingEnabled: flags.recordingEnabled === true,
          retentionDays:
            typeof flags.retentionDays === "number"
              ? (flags.retentionDays as number)
              : 90,
          dpaStatus:
            typeof flags.dpaStatus === "string"
              ? (flags.dpaStatus as "pending" | "signed" | "not_required")
              : "pending",
          emergencyDivertEnabled: flags.emergencyDivertEnabled === true,
        }}
      />
    </>
  );
}
