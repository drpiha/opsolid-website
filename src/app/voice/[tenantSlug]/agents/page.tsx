/**
 * Agenten — list of VoiceAgent rows. Each row is a panel card with status,
 * template, linked phone count, and last-sync indicator.
 */

import Link from "next/link";
import { ArrowRight, Bot, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import {
  formatDateTime,
  LANGUAGE_LABELS,
  PROMPT_TEMPLATE_LABELS,
} from "@/components/voice/dashboard/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function AgentsPage({ params, searchParams }: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant) return null;

  const agents = await prisma.voiceAgent.findMany({
    where: { tenantId: tenant.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { phoneNumbers: true, calls: true } },
    },
  });

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  return (
    <>
      <PageHeader
        eyebrow={`${agents.length} ${agents.length === 1 ? "Agent" : "Agenten"}`}
        title="Agenten"
        description="Eine Persönlichkeit pro Anwendungsfall. Aktive Agenten beantworten eingehende Anrufe nach Ihren Regeln."
        actions={
          <Link
            href={`/voice/${tenantSlug}/agents/new${tokenQuery}`}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Neuer Agent
          </Link>
        }
      />

      {agents.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-hot/50 bg-copper-500/[0.06] text-copper-300"
          >
            <Bot className="h-5 w-5" />
          </div>
          <p className="font-display text-[15px] text-ink">
            Noch kein Agent angelegt
          </p>
          <p className="max-w-sm text-[13px] text-ink-400">
            Erstellen Sie Ihren ersten Agenten, um Anrufe zu beantworten.
          </p>
          <Link
            href={`/voice/${tenantSlug}/agents/new${tokenQuery}`}
            className="btn btn-primary btn-sm mt-2"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Agent erstellen
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {agents.map((agent) => (
            <li key={agent.id}>
              <Link
                href={`/voice/${tenantSlug}/agents/${agent.id}${tokenQuery}`}
                className="panel group flex flex-col gap-4 px-5 py-5 transition-colors hover:border-line-firm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-hot/50 bg-copper-500/[0.06] text-copper-300"
                    >
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-display text-[15px] font-medium text-ink">
                        {agent.displayName}
                      </div>
                      <div className="meta text-[10px] text-ink-400">
                        {agent.name}
                      </div>
                    </div>
                  </div>
                  <VoiceStatusBadge status={agent.status} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-pill border border-line bg-bg-2 px-2 py-[3px] font-mono text-[10px] uppercase tracking-tight text-ink-300">
                    {PROMPT_TEMPLATE_LABELS[agent.promptTemplate] ??
                      agent.promptTemplate}
                  </span>
                  <span className="inline-flex items-center rounded-pill border border-line bg-bg-2 px-2 py-[3px] font-mono text-[10px] uppercase tracking-tight text-ink-300">
                    {LANGUAGE_LABELS[agent.language] ??
                      agent.language.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-line-soft pt-4">
                  <div className="flex items-center gap-4 text-[11px] text-ink-400">
                    <span>
                      <span className="font-mono tabular-nums text-ink-200">
                        {agent._count.phoneNumbers}
                      </span>{" "}
                      Nummern
                    </span>
                    <span className="text-ink-500">·</span>
                    <span>
                      <span className="font-mono tabular-nums text-ink-200">
                        {agent._count.calls}
                      </span>{" "}
                      Anrufe
                    </span>
                  </div>
                  <span className="meta inline-flex items-center gap-1 text-[10px] text-ink-400 transition-colors group-hover:text-copper-300">
                    {agent.providerAgentId ? "Verknüpft" : "Nicht synchronisiert"}
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </div>

                {agent.lastSyncedAt && (
                  <div className="meta text-[10px] text-ink-400">
                    Letzte Synchronisation:{" "}
                    <span className="font-mono normal-case tracking-normal">
                      {formatDateTime(agent.lastSyncedAt)}
                    </span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
