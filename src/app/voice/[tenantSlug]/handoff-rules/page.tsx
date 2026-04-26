/**
 * Weiterleitungsregeln — list/create/edit handoff rules.
 */

import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import HandoffRulesClient from "./HandoffRulesClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function HandoffRulesPage({
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

  const rules = await prisma.voiceHandoffRule.findMany({
    where: { tenantId: tenant.id },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Eskalation an Menschen"
        title="Weiterleitungsregeln"
        description="Wann und wie übergibt die KI an einen Menschen? Reihenfolge entscheidet — die erste passende Regel greift."
      />
      <HandoffRulesClient
        tenantId={tenant.id}
        token={token}
        rules={rules.map((r) => ({
          id: r.id,
          name: r.name,
          isActive: r.isActive,
          triggerType: r.triggerType,
          triggerValue: r.triggerValue,
          actionType: r.actionType,
          actionConfig: r.actionConfig as Record<string, unknown>,
          sortOrder: r.sortOrder,
        }))}
      />

      {/* ---------- Info section ---------- */}
      <section className="panel mt-8 flex flex-col gap-4 px-5 py-5">
        <div>
          <span className="meta text-[10px] text-ink-400">
            Anwendungsfälle
          </span>
          <h3 className="mt-1 font-display text-[14px] font-medium text-ink">
            Wann übernimmt die KI nicht?
          </h3>
        </div>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            {
              title: "Beschwerden & Reklamationen",
              detail:
                "Stichwort-Trigger wie „Beschwerde“, „Anwalt“, „Reklamation“ leiten direkt an Sie weiter.",
            },
            {
              title: "Negative Stimmung",
              detail:
                "Erkennt die KI Wut oder Frust, wird automatisch eskaliert.",
            },
            {
              title: "Zu lange Anrufe",
              detail:
                "Über X Sekunden ohne Lösung → Übergabe an einen Menschen.",
            },
            {
              title: "Anrufer drückt Taste",
              detail: "DTMF-Trigger (z.B. „0“ für sofortige Weiterleitung).",
            },
          ].map((c) => (
            <li
              key={c.title}
              className="rounded-md border border-line bg-bg-2 px-4 py-3"
            >
              <div className="font-display text-[13px] font-medium text-ink">
                {c.title}
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-300">
                {c.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
