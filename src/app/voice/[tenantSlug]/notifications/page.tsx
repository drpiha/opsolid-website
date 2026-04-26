/**
 * Benachrichtigungen — channels and triggers for post-call notifications.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import NotificationsClient from "./NotificationsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function NotificationsPage({
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

  const configs = await prisma.voiceNotificationConfig.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Echtzeit-Updates"
        title="Benachrichtigungen"
        description="Wer wird wann informiert? Wählen Sie pro Kanal Auslöser und Empfänger."
      />
      <NotificationsClient
        tenantId={tenant.id}
        token={token}
        configs={configs.map((c) => ({
          id: c.id,
          channelType: c.channelType,
          label: c.label,
          isActive: c.isActive,
          triggerOn: c.triggerOn,
          config: (c.config ?? {}) as Record<string, unknown>,
        }))}
      />
    </>
  );
}
