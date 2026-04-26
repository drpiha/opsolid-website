/**
 * Rufnummern — list of VoicePhoneNumber rows + add modal.
 *
 * Connection mode info panel explains the four ways customers route a
 * number to the agent (Retell-Nummer, Weiterleitung, SIP, Eigene Nummer).
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import PhoneNumbersClient from "./PhoneNumbersClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PhoneNumbersPage({
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

  const [numbers, agents] = await Promise.all([
    prisma.voicePhoneNumber.findMany({
      where: { tenantId: tenant.id },
      orderBy: { importedAt: "desc" },
      include: { agent: { select: { id: true, displayName: true } } },
    }),
    prisma.voiceAgent.findMany({
      where: { tenantId: tenant.id },
      select: { id: true, displayName: true, status: true },
      orderBy: { displayName: "asc" },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={`${numbers.length} ${numbers.length === 1 ? "Rufnummer" : "Rufnummern"}`}
        title="Rufnummern"
        description="Welche Telefonnummern werden vom KI-Empfang beantwortet."
      />
      <PhoneNumbersClient
        tenantId={tenant.id}
        token={token}
        numbers={numbers.map((n) => ({
          id: n.id,
          e164Number: n.e164Number,
          friendlyName: n.friendlyName,
          status: n.status,
          country: n.country,
          providerPhoneId: n.providerPhoneId,
          agent: n.agent
            ? { id: n.agent.id, displayName: n.agent.displayName }
            : null,
        }))}
        agents={agents}
      />
    </>
  );
}
