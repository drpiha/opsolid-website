/**
 * Integrationen — third-party connections (cal_com, google_calendar,
 * custom_webhook, email_only). email_only is always available, no API key.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import IntegrationsClient, {
  type IntegrationItem,
} from "./IntegrationsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function IntegrationsPage({
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

  const integrations = await prisma.voiceIntegration.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
  });

  const knownTypes = ["email_only", "cal_com", "google_calendar", "custom_webhook"];
  const itemsByType = new Map(
    integrations.map((i) => [i.integrationType, i] as const),
  );

  const items: IntegrationItem[] = knownTypes.map((type) => {
    const existing = itemsByType.get(type);
    return {
      id: existing?.id ?? null,
      integrationType: type,
      label: existing?.label ?? null,
      status: existing?.status ?? "inactive",
      lastTestedAt: existing?.lastTestedAt
        ? existing.lastTestedAt.toISOString()
        : null,
      lastErrorMsg: existing?.lastErrorMsg ?? null,
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Anbindungen"
        title="Integrationen"
        description="Verbinden Sie Kalender, Webhooks oder E-Mail-Workflows mit Ihrem Voice Agent."
      />
      <IntegrationsClient
        tenantId={tenant.id}
        token={token}
        items={items}
      />
    </>
  );
}
