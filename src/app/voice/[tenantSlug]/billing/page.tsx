/**
 * Abrechnung — current month usage + monthly history.
 *
 * Read-only. Aggregates VoiceUsageRecord by billing month. Optional ?month=
 * query lets the user inspect a specific month.
 */

import { ChevronLeft, ChevronRight, CreditCard, Receipt, Timer } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import VoiceStatCard from "@/components/voice/dashboard/VoiceStatCard";
import {
  formatDate,
  formatEuroCents,
} from "@/components/voice/dashboard/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string; month?: string }>;
}

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

export default async function BillingPage({ params, searchParams }: PageProps) {
  const { tenantSlug } = await params;
  const sp = await searchParams;
  const token = sp.token ?? "";
  const month = sp.month ?? currentMonth();

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    include: { plan: true },
  });
  if (!tenant) return null;

  const [aggregate, byDay] = await Promise.all([
    prisma.voiceUsageRecord.aggregate({
      where: { tenantId: tenant.id, billingMonth: month },
      _sum: {
        billableMinutes: true,
        costUnits: true,
        overageCents: true,
      },
      _count: true,
    }),
    prisma.$queryRaw<
      { day: Date; calls: bigint; minutes: bigint; cost: bigint }[]
    >`
      SELECT date_trunc('day', vu.created_at) AS day,
             COUNT(*)::bigint                  AS calls,
             SUM(vu.billable_minutes)::bigint  AS minutes,
             SUM(vu.cost_units)::bigint        AS cost
      FROM voice_usage_records vu
      WHERE vu.tenant_id = ${tenant.id}
        AND vu.billing_month = ${month}
      GROUP BY day
      ORDER BY day DESC
    `,
  ]);

  const tokenQ = (m: string) =>
    `?token=${encodeURIComponent(token)}&month=${encodeURIComponent(m)}`;

  const totalCalls = aggregate._count;
  const totalMinutes = Number(aggregate._sum.billableMinutes ?? 0);
  const totalCost = Number(aggregate._sum.costUnits ?? 0);
  const totalOverage = Number(aggregate._sum.overageCents ?? 0);

  return (
    <>
      <PageHeader
        eyebrow="Abrechnung"
        title="Verbrauch & Plan"
        description="Aktueller Monat im Detail. Sie können historische Monate über die Pfeile ansehen."
        actions={
          <div className="flex items-center gap-1 rounded-md border border-line bg-bg-2 p-1">
            <Link
              href={`/voice/${tenantSlug}/billing${tokenQ(shiftMonth(month, -1))}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:bg-bg-3 hover:text-ink"
              aria-label="Vorheriger Monat"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <span className="font-mono text-[12px] uppercase tabular-nums tracking-tight text-ink">
              {formatMonthLabel(month)}
            </span>
            <Link
              href={`/voice/${tenantSlug}/billing${tokenQ(shiftMonth(month, +1))}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:bg-bg-3 hover:text-ink"
              aria-label="Nächster Monat"
            >
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <VoiceStatCard
          title="Anrufe abgerechnet"
          value={totalCalls}
          icon={Receipt}
          emphasis="hot"
        />
        <VoiceStatCard
          title="Minuten"
          value={totalMinutes}
          icon={Timer}
          subtext="abrechenbar (aufgerundet)"
        />
        <VoiceStatCard
          title="Kosten"
          value={formatEuroCents(totalCost)}
          icon={CreditCard}
          subtext="laut Plan"
        />
        <VoiceStatCard
          title="Überschreitung"
          value={formatEuroCents(totalOverage)}
          icon={CreditCard}
          subtext={
            totalOverage > 0 ? "Achtung: Limit überschritten" : "im Plan"
          }
        />
      </section>

      {/* ---------- Daily usage table ---------- */}
      <section className="panel mt-6 overflow-hidden p-0">
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <h3 className="font-display text-[14px] font-medium text-ink">
            Verbrauch je Tag
          </h3>
          <span className="meta text-[10px] text-ink-400">
            {byDay.length} {byDay.length === 1 ? "Tag" : "Tage"} mit Aktivität
          </span>
        </header>
        {byDay.length === 0 ? (
          <div className="px-6 py-12 text-center text-[12px] text-ink-400">
            Noch keine abgerechneten Anrufe in diesem Monat.
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-ink-400">
                <Th>Datum</Th>
                <Th align="right">Anrufe</Th>
                <Th align="right">Minuten</Th>
                <Th align="right">Kosten</Th>
              </tr>
            </thead>
            <tbody>
              {byDay.map((row) => (
                <tr
                  key={row.day.toISOString()}
                  className="border-b border-line-soft last:border-b-0 hover:bg-bg-2"
                >
                  <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-ink-200">
                    {formatDate(row.day)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink-300">
                    {Number(row.calls)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink-300">
                    {Number(row.minutes)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-copper-300">
                    {formatEuroCents(Number(row.cost))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ---------- Plan info ---------- */}
      <section className="panel mt-6 flex flex-col gap-3 px-5 py-5">
        <header>
          <span className="meta text-[10px] text-ink-400">Aktueller Plan</span>
          <h3 className="mt-1 font-display text-[15px] font-medium text-ink">
            {tenant.plan?.displayName ?? tenant.plan?.planKey ?? "Standard"}
          </h3>
        </header>
        <p className="text-[12px] leading-relaxed text-ink-300">
          Pläne, Aufstockungen und Rechnungsadressen verwalten Sie über den Support. Schreiben Sie uns
          mit Stichwort &bdquo;Voice Plan&ldquo; — wir antworten am gleichen Werktag.
        </p>
      </section>
    </>
  );
}

function Th({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`meta px-4 py-3 text-[10px] font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}
