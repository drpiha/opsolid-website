/**
 * Test-Anruf — initiate a test call to a phone number using a chosen agent.
 *
 * Server fetches the available agents; the client component wires up the
 * /api/voice/[tenantId]/test-call action and renders status + checklist.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import TestCallClient from "./TestCallClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function TestCallPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true, contactPhone: true },
  });
  if (!tenant) return null;

  const agents = await prisma.voiceAgent.findMany({
    where: { tenantId: tenant.id, status: { in: ["active", "draft"] } },
    select: {
      id: true,
      displayName: true,
      status: true,
      providerAgentId: true,
    },
    orderBy: { status: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Inbetriebnahme"
        title="Test-Anruf"
        description="Lassen Sie sich von Ihrem Voice Agent anrufen und prüfen Sie 20 Punkte vor dem Live-Schalten."
      />
      <TestCallClient
        tenantId={tenant.id}
        token={token}
        agents={agents}
        defaultPhone={tenant.contactPhone ?? ""}
      />
    </>
  );
}
