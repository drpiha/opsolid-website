/**
 * Einstellungen — tenant-level config (business profile + webhook URL).
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import SettingsForm from "./SettingsForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function SettingsPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
  });
  if (!tenant) return null;

  return (
    <>
      <PageHeader
        eyebrow="Konfiguration"
        title="Einstellungen"
        description="Firmendaten, Zeitzone und technische Endpoints für Ihren Voice-Provider."
      />
      <SettingsForm
        tenantId={tenant.id}
        token={token}
        initial={{
          businessName: tenant.businessName,
          contactEmail: tenant.contactEmail,
          contactPhone: tenant.contactPhone ?? "",
          timezone: tenant.timezone,
          locale: tenant.locale,
          businessDescription: tenant.businessDescription ?? "",
          businessAddress: tenant.businessAddress ?? "",
          businessCategory: tenant.businessCategory ?? "generic",
        }}
      />
    </>
  );
}
