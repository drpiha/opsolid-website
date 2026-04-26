"use client";

/**
 * OverviewClient — single-screen instrument panel: KPIs, AI status, recent
 * activity, setup checklist. No data fetching here; everything is wired by
 * the server page.
 */

import Link from "next/link";
import {
  Bot,
  Calendar,
  CheckCircle2,
  Circle,
  Phone,
  PhoneCall,
  PhoneForwarded,
  Timer,
  Volume2,
} from "lucide-react";
import CallLogTable, {
  type CallLogRow,
} from "@/components/voice/dashboard/CallLogTable";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import VoiceStatCard from "@/components/voice/dashboard/VoiceStatCard";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { formatDuration, LANGUAGE_LABELS } from "@/components/voice/dashboard/format";
import { cn } from "@/lib/utils";

interface OverviewClientProps {
  tenantSlug: string;
  token: string;
  tenant: {
    businessName: string;
    status: string;
    mode: string;
  };
  stats: {
    totalCalls: number;
    answeredCalls: number;
    appointmentCalls: number;
    transferredCalls: number;
    avgDurationSec: number;
  };
  agent: {
    id: string;
    displayName: string;
    language: string;
  } | null;
  phone: {
    id: string;
    e164Number: string;
    friendlyName: string | null;
    hasAgent: boolean;
  } | null;
  recentCalls: CallLogRow[];
  checklist: {
    agent: boolean;
    phone: boolean;
    hours: boolean;
    testCall: boolean;
  };
}

export default function OverviewClient({
  tenantSlug,
  token,
  tenant,
  stats,
  agent,
  phone,
  recentCalls,
  checklist,
}: OverviewClientProps) {
  const tokenQuery = `?token=${encodeURIComponent(token)}`;
  const aiActive = Boolean(agent && phone);
  const checklistOpen = !Object.values(checklist).every(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Übersicht · Letzte 30 Tage"
        title={tenant.businessName}
        description="Tageszahlen, KI-Status und schnelle Aktionen für Ihre digitale Rezeption."
        actions={
          <>
            <VoiceStatusBadge status={tenant.status} size="md" />
            <Link
              href={`/voice/${tenantSlug}/test-call${tokenQuery}`}
              className="btn btn-primary btn-sm"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              Test-Anruf
            </Link>
          </>
        }
      />

      {/* ---------- Stat row ---------- */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <VoiceStatCard
          title="Anrufe gesamt"
          value={stats.totalCalls}
          icon={PhoneCall}
          emphasis="hot"
          subtext="letzte 30 Tage"
        />
        <VoiceStatCard
          title="Beantwortet"
          value={stats.answeredCalls}
          icon={Volume2}
          subtext={
            stats.totalCalls > 0
              ? `${Math.round((stats.answeredCalls / stats.totalCalls) * 100)}% Annahmequote`
              : "noch keine Daten"
          }
        />
        <VoiceStatCard
          title="Termine erstellt"
          value={stats.appointmentCalls}
          icon={Calendar}
          subtext="aus dem Anrufprotokoll"
        />
        <VoiceStatCard
          title="Weiterleitungen"
          value={stats.transferredCalls}
          icon={PhoneForwarded}
          subtext="an Menschen übergeben"
        />
        <VoiceStatCard
          title="Ø Dauer"
          value={formatDuration(stats.avgDurationSec)}
          icon={Timer}
          subtext="je beantwortetem Anruf"
        />
      </section>

      {/* ---------- AI status panel ---------- */}
      <section className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="panel relative col-span-1 flex flex-col gap-4 px-5 py-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="meta text-[10px] text-ink-400">
                KI-Status
              </span>
              <h2 className="mt-1 font-display text-[18px] font-medium text-ink">
                {aiActive ? "KI ist aktiv" : "KI noch nicht startklar"}
              </h2>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em]",
                aiActive
                  ? "border-signal-ok/30 bg-signal-ok/[0.10] text-signal-ok"
                  : "border-signal-warn/30 bg-signal-warn/[0.10] text-signal-warn",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-pill",
                  aiActive
                    ? "bg-signal-ok shadow-[0_0_8px_rgba(127,178,134,0.6)]"
                    : "bg-signal-warn",
                )}
              />
              {aiActive ? "Live" : "Pausiert"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-md border border-line bg-bg-2 px-4 py-3">
              <span className="meta text-[10px] text-ink-400">
                Aktive Rufnummer
              </span>
              <div className="mt-1 font-mono text-[14px] tabular-nums text-ink">
                {phone ? phone.e164Number : "Nicht verbunden"}
              </div>
              {phone?.friendlyName && (
                <div className="text-[11px] text-ink-400">
                  {phone.friendlyName}
                </div>
              )}
            </div>
            <div className="rounded-md border border-line bg-bg-2 px-4 py-3">
              <span className="meta text-[10px] text-ink-400">
                Aktiver Agent
              </span>
              <div className="mt-1 flex items-center gap-2 font-display text-[14px] text-ink">
                <Bot className="h-4 w-4 text-copper-400" aria-hidden />
                {agent ? agent.displayName : "Kein aktiver Agent"}
              </div>
              {agent && (
                <div className="text-[11px] text-ink-400">
                  Sprache:{" "}
                  {LANGUAGE_LABELS[agent.language] ?? agent.language.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Setup checklist ---------- */}
        <aside className="panel flex flex-col gap-4 px-5 py-5">
          <div>
            <span className="meta text-[10px] text-ink-400">
              Schnelles Setup
            </span>
            <h2 className="mt-1 font-display text-[16px] font-medium text-ink">
              {checklistOpen ? "Inbetriebnahme" : "Alles bereit"}
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            <ChecklistItem
              done={checklist.agent}
              label="Agent erstellen"
              href={`/voice/${tenantSlug}/agents${tokenQuery}`}
            />
            <ChecklistItem
              done={checklist.phone}
              label="Rufnummer verbinden"
              href={`/voice/${tenantSlug}/phone-numbers${tokenQuery}`}
            />
            <ChecklistItem
              done={checklist.hours}
              label="Öffnungszeiten konfigurieren"
              href={`/voice/${tenantSlug}/business-hours${tokenQuery}`}
            />
            <ChecklistItem
              done={checklist.testCall}
              label="Test-Anruf machen"
              href={`/voice/${tenantSlug}/test-call${tokenQuery}`}
            />
          </ul>
        </aside>
      </section>

      {/* ---------- Recent calls ---------- */}
      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <span className="meta text-[10px] text-ink-400">
              Letzte Anrufe
            </span>
            <h2 className="mt-1 font-display text-[18px] font-medium text-ink">
              Aktuelle Aktivität
            </h2>
          </div>
          <Link
            href={`/voice/${tenantSlug}/calls${tokenQuery}`}
            className="text-[13px] text-copper-300 transition-colors hover:text-copper-200"
          >
            Alle Anrufe anzeigen →
          </Link>
        </div>
        <CallLogTable
          calls={recentCalls}
          tenantSlug={tenantSlug}
          token={token}
          compact
        />
      </section>
    </>
  );
}

function ChecklistItem({
  done,
  label,
  href,
}: {
  done: boolean;
  label: string;
  href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
          done
            ? "border-signal-ok/20 bg-signal-ok/[0.05] text-ink-300"
            : "border-line bg-bg-2 text-ink-200 hover:border-line-firm hover:bg-bg-3",
        )}
      >
        {done ? (
          <CheckCircle2
            className="h-4 w-4 shrink-0 text-signal-ok"
            aria-hidden
          />
        ) : (
          <Circle
            className="h-4 w-4 shrink-0 text-ink-400 group-hover:text-copper-300"
            aria-hidden
          />
        )}
        <span
          className={cn(
            "flex-1 text-[13px]",
            done && "line-through opacity-60",
          )}
        >
          {label}
        </span>
        <span className="text-[11px] text-ink-400 transition-colors group-hover:text-copper-300">
          {done ? "Fertig" : "Öffnen →"}
        </span>
      </Link>
    </li>
  );
}
