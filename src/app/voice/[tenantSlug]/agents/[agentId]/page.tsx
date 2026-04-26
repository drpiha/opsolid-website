/**
 * Agent detail page: edit form + sync action + linked phones.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PhoneIncoming } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import AgentEditClient from "./AgentEditClient";
import { formatDateTime } from "@/components/voice/dashboard/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string; agentId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function AgentDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug, agentId } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant) return null;

  const agent = await prisma.voiceAgent.findFirst({
    where: { id: agentId, tenantId: tenant.id },
    include: {
      phoneNumbers: {
        select: {
          id: true,
          e164Number: true,
          friendlyName: true,
          status: true,
        },
      },
    },
  });
  if (!agent) notFound();

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  return (
    <>
      <Link
        href={`/voice/${tenantSlug}/agents${tokenQuery}`}
        className="meta mb-2 inline-flex items-center gap-1 text-[10px] text-ink-400 transition-colors hover:text-copper-300"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Zurück zu Agenten
      </Link>
      <PageHeader
        eyebrow={agent.providerAgentId ? "Verknüpft mit Provider" : "Lokal · noch nicht synchronisiert"}
        title={agent.displayName}
        description={`Interner Name: ${agent.name}`}
        actions={<VoiceStatusBadge status={agent.status} size="md" />}
      />

      <AgentEditClient
        tenantId={tenant.id}
        tenantSlug={tenantSlug}
        token={token}
        agent={{
          id: agent.id,
          name: agent.name,
          displayName: agent.displayName,
          language: agent.language,
          promptTemplate: agent.promptTemplate,
          voiceId: agent.voiceId,
          systemPrompt: agent.systemPrompt,
          maxDurationSeconds: agent.maxDurationSeconds,
          status: agent.status as "draft" | "active" | "paused",
          providerAgentId: agent.providerAgentId,
        }}
      />

      {/* ---------- Linked phone numbers ---------- */}
      <section className="panel mt-6 flex flex-col gap-3 px-5 py-5">
        <header className="flex items-center justify-between">
          <h3 className="font-display text-[14px] font-medium text-ink">
            Verknüpfte Rufnummern
          </h3>
          <Link
            href={`/voice/${tenantSlug}/phone-numbers${tokenQuery}`}
            className="text-[12px] text-copper-300 transition-colors hover:text-copper-200"
          >
            Verwalten →
          </Link>
        </header>
        {agent.phoneNumbers.length === 0 ? (
          <p className="text-[12px] text-ink-400">
            Keine Rufnummer ist mit diesem Agenten verknüpft.
          </p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {agent.phoneNumbers.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-3">
                  <PhoneIncoming
                    className="h-3.5 w-3.5 text-ink-400"
                    aria-hidden
                  />
                  <div>
                    <div className="font-mono text-[13px] tabular-nums text-ink">
                      {p.e164Number}
                    </div>
                    {p.friendlyName && (
                      <div className="text-[11px] text-ink-400">
                        {p.friendlyName}
                      </div>
                    )}
                  </div>
                </div>
                <VoiceStatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {agent.lastSyncedAt && (
        <p className="meta mt-4 text-right text-[10px] text-ink-400">
          Letzte Synchronisation:{" "}
          <span className="font-mono normal-case tracking-normal">
            {formatDateTime(agent.lastSyncedAt)}
          </span>
        </p>
      )}
    </>
  );
}
