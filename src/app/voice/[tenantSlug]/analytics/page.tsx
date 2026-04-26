/**
 * Analyse — heatmap + 30-day bar chart + recommendations.
 *
 * All aggregation happens server-side via raw Postgres queries (cheap) +
 * Prisma counts. The recommendations engine is a small heuristic over the
 * resulting numbers — see getRecommendations() below.
 */

import {
  AlertTriangle,
  Lightbulb,
  PhoneCall,
  PhoneForwarded,
  Sparkles,
  Timer,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import BusyHourHeatmap, {
  type BusyCell,
} from "@/components/voice/dashboard/BusyHourHeatmap";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import VoiceStatCard from "@/components/voice/dashboard/VoiceStatCard";
import {
  formatDate,
  formatDuration,
} from "@/components/voice/dashboard/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  await searchParams; // token already validated in layout

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant) return null;

  const since = new Date();
  since.setDate(since.getDate() - 30);

  // ---------- Aggregates ----------
  const [total, transferred, appointmentBooked, durationAgg, dailyRows, busyRows] =
    await Promise.all([
      prisma.voiceCall.count({
        where: { agent: { tenantId: tenant.id }, startedAt: { gte: since } },
      }),
      prisma.voiceCall.count({
        where: {
          agent: { tenantId: tenant.id },
          startedAt: { gte: since },
          OR: [{ disposition: "transferred" }, { outcomeType: "transferred" }],
        },
      }),
      prisma.voiceCall.count({
        where: {
          agent: { tenantId: tenant.id },
          startedAt: { gte: since },
          outcomeType: "appointment_booked",
        },
      }),
      prisma.voiceCall.aggregate({
        where: {
          agent: { tenantId: tenant.id },
          startedAt: { gte: since },
          durationSeconds: { gt: 0 },
        },
        _avg: { durationSeconds: true },
      }),
      // Day-by-day call count over last 30 days.
      prisma.$queryRaw<{ day: Date; count: bigint }[]>`
        SELECT date_trunc('day', vc.started_at) AS day, COUNT(*)::bigint AS count
        FROM voice_calls vc
        JOIN voice_agents va ON va.id = vc.agent_id
        WHERE va.tenant_id = ${tenant.id}
          AND vc.started_at >= ${since}
        GROUP BY day
        ORDER BY day ASC
      `,
      // weekday × hour heatmap data.
      prisma.$queryRaw<
        { weekday: number; hour: number; count: bigint }[]
      >`
        SELECT EXTRACT(DOW FROM vc.started_at)::int  AS weekday,
               EXTRACT(HOUR FROM vc.started_at)::int AS hour,
               COUNT(*)::bigint AS count
        FROM voice_calls vc
        JOIN voice_agents va ON va.id = vc.agent_id
        WHERE va.tenant_id = ${tenant.id}
          AND vc.started_at >= ${since}
        GROUP BY weekday, hour
      `,
    ]);

  const busyHours: BusyCell[] = busyRows.map((r) => ({
    weekday: Number(r.weekday),
    hour: Number(r.hour),
    count: Number(r.count),
  }));

  // Build a 30-day-aligned daily series with zero-fill.
  const dayMap = new Map<string, number>();
  for (const row of dailyRows) {
    const key = new Date(row.day).toISOString().slice(0, 10);
    dayMap.set(key, Number(row.count));
  }
  const days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: dayMap.get(key) ?? 0 });
  }
  const maxDaily = Math.max(1, ...days.map((d) => d.count));

  const recommendations = getRecommendations({
    total,
    transferred,
    appointmentBooked,
    avgDurationSec: durationAgg._avg.durationSeconds ?? 0,
    busyHours,
  });

  return (
    <>
      <PageHeader
        eyebrow="Letzte 30 Tage"
        title="Analyse"
        description="Was sagen die Zahlen über Ihre Voice-Agent-Performance? Nutzen Sie die Empfehlungen, um Engpässe zu beseitigen."
      />

      {/* ---------- Stat row ---------- */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <VoiceStatCard
          title="Anrufe gesamt"
          value={total}
          icon={PhoneCall}
          emphasis="hot"
        />
        <VoiceStatCard
          title="Weiterleitungen"
          value={transferred}
          subtext={
            total > 0
              ? `${Math.round((transferred / total) * 100)}% der Anrufe`
              : undefined
          }
          icon={PhoneForwarded}
        />
        <VoiceStatCard
          title="Termine"
          value={appointmentBooked}
          icon={Sparkles}
          subtext={
            total > 0
              ? `${Math.round((appointmentBooked / total) * 100)}% Konversion`
              : undefined
          }
        />
        <VoiceStatCard
          title="Ø Dauer"
          value={formatDuration(durationAgg._avg.durationSeconds ?? 0)}
          icon={Timer}
        />
      </section>

      {/* ---------- Heatmap ---------- */}
      <div className="mt-6">
        <BusyHourHeatmap busyHours={busyHours} />
      </div>

      {/* ---------- 30-day bar chart ---------- */}
      <section className="panel mt-6 flex flex-col gap-4 px-5 py-5">
        <header>
          <h3 className="font-display text-[14px] font-medium text-ink">
            Anrufe pro Tag · letzte 30 Tage
          </h3>
          <p className="meta mt-0.5 text-[10px] text-ink-400">
            Spitze: <span className="font-mono normal-case tracking-normal">{maxDaily}</span> Anrufe
          </p>
        </header>
        <div className="flex h-[180px] items-end gap-[3px]">
          {days.map((d) => {
            const pct = (d.count / maxDaily) * 100;
            return (
              <div
                key={d.date}
                className="group relative flex h-full flex-1 flex-col justify-end"
                title={`${formatDate(d.date)} — ${d.count} Anrufe`}
              >
                <div
                  style={{ height: `${Math.max(2, pct)}%` }}
                  className={
                    "w-full rounded-t-[2px] transition-all " +
                    (d.count > 0
                      ? "bg-copper-500 group-hover:bg-copper-400 group-hover:shadow-bloom-sm"
                      : "bg-bg-3")
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-ink-400">
          <span className="meta">{formatDate(days[0].date)}</span>
          <span className="meta">Heute</span>
        </div>
      </section>

      {/* ---------- Recommendations ---------- */}
      <section className="panel mt-6 flex flex-col gap-3 px-5 py-5">
        <header className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-copper-400" aria-hidden />
          <h3 className="font-display text-[14px] font-medium text-ink">
            Empfehlungen
          </h3>
        </header>
        {recommendations.length === 0 ? (
          <p className="text-[12px] text-ink-400">
            Alles im grünen Bereich. Wir sehen keine offensichtlichen Engpässe.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recommendations.map((r, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-md border border-line bg-bg-2 px-4 py-3"
              >
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    r.severity === "high"
                      ? "text-signal-err"
                      : r.severity === "medium"
                        ? "text-signal-warn"
                        : "text-copper-300"
                  }`}
                  aria-hidden
                />
                <div className="flex-1">
                  <div className="font-display text-[13px] font-medium text-ink">
                    {r.title}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-300">
                    {r.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

interface RecommendationInput {
  total: number;
  transferred: number;
  appointmentBooked: number;
  avgDurationSec: number;
  busyHours: BusyCell[];
}

interface Recommendation {
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
}

function getRecommendations(input: RecommendationInput): Recommendation[] {
  const recs: Recommendation[] = [];

  if (input.total === 0) {
    recs.push({
      severity: "low",
      title: "Noch keine Daten",
      detail:
        "Sobald die ersten Anrufe eingegangen sind, finden Sie hier konkrete Optimierungsvorschläge.",
    });
    return recs;
  }

  const transferRate = input.transferred / input.total;
  if (transferRate > 0.4) {
    recs.push({
      severity: "high",
      title: "Hohe Weiterleitungsquote",
      detail: `Über ${Math.round(transferRate * 100)}% Ihrer Anrufe werden weitergeleitet. Erweitern Sie die Wissensbasis und prüfen Sie die Handoff-Regeln auf zu breite Auslöser.`,
    });
  } else if (transferRate > 0.2) {
    recs.push({
      severity: "medium",
      title: "Spielraum bei Weiterleitungen",
      detail: `Aktuell ${Math.round(transferRate * 100)}% Weiterleitungen — Top-Performer liegen unter 15%. Häufige Themen in die Wissensbasis übernehmen.`,
    });
  }

  if (input.avgDurationSec > 240) {
    recs.push({
      severity: "medium",
      title: "Lange Anrufe",
      detail: `Ihre Anrufe dauern im Schnitt ${formatDuration(input.avgDurationSec)}. Knappe FAQ-Antworten und klar strukturierte Prompts senken die Dauer und Kosten.`,
    });
  }

  // Detect concentrated busy hours (single peak).
  if (input.busyHours.length > 0) {
    const peak = input.busyHours.reduce((a, b) => (b.count > a.count ? b : a));
    const sum = input.busyHours.reduce((a, b) => a + b.count, 0);
    if (sum > 0 && peak.count / sum > 0.25) {
      recs.push({
        severity: "low",
        title: "Konzentrierte Spitzenzeit",
        detail: `Spitze bei ${peak.hour}:00 (${peak.count} Anrufe). Stellen Sie sicher, dass Ihr Agent in dieser Stunde nicht durch Limits gedrosselt wird.`,
      });
    }
  }

  if (input.appointmentBooked === 0 && input.total > 10) {
    recs.push({
      severity: "medium",
      title: "Keine Termine erfasst",
      detail:
        "Bei 10+ Anrufen wurde noch kein Termin erstellt. Prüfen Sie, ob die Buchungsregeln aktiv und der Agent dafür konfiguriert ist.",
    });
  }

  return recs;
}
