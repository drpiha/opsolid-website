// =============================================================================
// /admin/stats?token=... — operator's local fallback stats view.
// Reuses the same computeStats() helper that backs /api/m2m/stats so Kutasia
// admin and this page can never diverge in math.
//
// Pure server component. Plain numbers in big type (no charts — out of scope).
// =============================================================================

import Link from "next/link";
import { computeStats, parseRange, type StatsRange } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Stats",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string; range?: string }>;
}

function formatEuroCents(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export default async function AdminStatsPage({ searchParams }: PageProps) {
  const { token = "", range: rangeParam } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">Not configured</h1>
        <p className="mt-4 text-ink/60">
          Set <code>ADMIN_TOKEN</code> in <code>.env</code> to enable this page.
        </p>
      </main>
    );
  }
  if (token !== expected) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">401</h1>
        <p className="mt-4 text-ink/60">
          Append <code>?token=…</code> to the URL.
        </p>
      </main>
    );
  }

  const range = parseRange(rangeParam);
  const stats = await computeStats(range);

  const ranges: StatsRange[] = ["7d", "30d", "all"];
  const rangeLabel = (r: StatsRange) =>
    r === "7d" ? "Last 7 days" : r === "30d" ? "Last 30 days" : "All time";

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-display-sm text-ink">Stats</h1>
            <p className="mt-2 text-body text-ink/60">
              {rangeLabel(range)} · EUR
            </p>
          </div>
          <Link
            href={`/admin/orders?token=${encodeURIComponent(token)}`}
            className="text-sm text-ink/70 underline-offset-4 hover:underline"
          >
            → Orders
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {ranges.map((r) => (
            <a
              key={r}
              href={`/admin/stats?token=${encodeURIComponent(token)}&range=${r}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                r === range
                  ? "bg-ink text-white"
                  : "border border-neutral-200 bg-white text-ink hover:bg-neutral-100"
              }`}
            >
              {rangeLabel(r)}
            </a>
          ))}
        </div>

        {/* Revenue row */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card label="Total revenue" big={formatEuroCents(stats.revenue.totalCents)} />
          <Card
            label="One-time"
            big={formatEuroCents(stats.revenue.oneTimeCents)}
          />
          <Card
            label="Subscriptions (initial)"
            big={formatEuroCents(stats.revenue.subscriptionCents)}
          />
        </section>

        {/* Orders row */}
        <h2 className="mt-12 font-display text-xl text-ink">Orders</h2>
        <section className="mt-4 grid gap-4 sm:grid-cols-3 md:grid-cols-6">
          <Card label="Total" big={String(stats.orders.total)} />
          <Card label="Pending" big={String(stats.orders.pending)} />
          <Card label="Paid" big={String(stats.orders.paid)} />
          <Card label="In design" big={String(stats.orders.awaitingDesign)} />
          <Card label="Published" big={String(stats.orders.published)} />
          <Card
            label="Cancelled / refunded"
            big={String(stats.orders.cancelled + stats.orders.refunded)}
          />
        </section>

        {/* Conversion + cycle time */}
        <h2 className="mt-12 font-display text-xl text-ink">Funnel</h2>
        <section className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card
            label="Sessions started"
            big={String(stats.conversion.sessionsStarted)}
          />
          <Card
            label="Completed (paid+)"
            big={String(stats.conversion.sessionsCompleted)}
          />
          <Card label="Conversion" big={formatPct(stats.conversion.rate)} />
        </section>

        <h2 className="mt-12 font-display text-xl text-ink">Cycle time</h2>
        <section className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          <Card
            label="Avg paid → published"
            big={`${stats.avgCycleTimeHours.paidToPublished}h`}
            hint="Rolling window inside the selected range."
          />
        </section>

        {/* Recent activity */}
        <h2 className="mt-12 font-display text-xl text-ink">Recent activity</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                    No orders yet in this range.
                  </td>
                </tr>
              )}
              {stats.recentActivity.map((o) => (
                <tr key={o.orderId} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-ink/70">
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-ink">{o.contactName}</td>
                  <td className="px-4 py-3 text-ink/80">{o.status}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {new Date(o.createdAt).toLocaleString("de-DE")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.orderId}?token=${encodeURIComponent(token)}`}
                      className="text-xs text-ink/70 underline-offset-4 hover:underline"
                    >
                      open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Card({
  label,
  big,
  hint,
}: {
  label: string;
  big: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="text-xs uppercase tracking-wide text-ink/50">{label}</div>
      <div className="mt-2 font-display text-3xl text-ink">{big}</div>
      {hint && <div className="mt-2 text-xs text-ink/50">{hint}</div>}
    </div>
  );
}
