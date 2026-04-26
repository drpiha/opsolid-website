// Voice analytics — call stats, busy-hour detection, and monthly usage rollups.

import { prisma } from "@/lib/prisma";
import { getLocalDateInfo } from "./business-hours";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface CallStats {
  total: number;
  answered: number;
  missed: number;
  failed: number;
  appointmentsCreated: number;
  ordersCreated: number;
  handoffs: number;
  avgDurationSeconds: number;
  estimatedCostCents: number;
  callsByDay: Record<string, number>;
  callsByHour: number[]; // index 0..23
  callsByLanguage: Record<string, number>;
  callsByOutcome: Record<string, number>;
}

export interface BusyHourData {
  weekday: number;
  hour: number;
  count: number;
}

export interface BusyHourRecommendation {
  message: string;
  weekday: number;
  peakHours: string;
  callVolume: number;
}

const WEEKDAY_LABELS_DE = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

// ---------------------------------------------------------------------------
// Aggregate call statistics for the last `rangedays` days.
// ---------------------------------------------------------------------------

export async function getCallStats(
  tenantId: string,
  rangedays: number,
): Promise<CallStats> {
  const days = Math.max(1, Math.min(365, Math.floor(rangedays)));
  const since = new Date(Date.now() - days * DAY_MS);

  const tenant = await prisma.voiceTenant.findUnique({
    where: { id: tenantId },
    select: { timezone: true },
  });
  const timezone = tenant?.timezone || "Europe/Berlin";

  const calls = await prisma.voiceCall.findMany({
    where: {
      agent: { tenantId },
      startedAt: { gt: since },
    },
    select: {
      status: true,
      outcomeType: true,
      durationSeconds: true,
      detectedLanguage: true,
      costUnits: true,
      startedAt: true,
    },
  });

  const stats: CallStats = {
    total: calls.length,
    answered: 0,
    missed: 0,
    failed: 0,
    appointmentsCreated: 0,
    ordersCreated: 0,
    handoffs: 0,
    avgDurationSeconds: 0,
    estimatedCostCents: 0,
    callsByDay: {},
    callsByHour: Array.from({ length: 24 }, () => 0),
    callsByLanguage: {},
    callsByOutcome: {},
  };

  let durationSum = 0;
  let durationCount = 0;

  for (const c of calls) {
    // status buckets
    if (c.status === "ended" || c.status === "in_progress") {
      stats.answered++;
    } else if (c.status === "no_answer" || c.status === "busy") {
      stats.missed++;
    } else if (c.status === "failed") {
      stats.failed++;
    }

    if (c.outcomeType === "appointment_booked") stats.appointmentsCreated++;
    if (c.outcomeType === "order_placed") stats.ordersCreated++;
    if (c.outcomeType === "transferred") stats.handoffs++;

    if (typeof c.durationSeconds === "number" && c.durationSeconds > 0) {
      durationSum += c.durationSeconds;
      durationCount++;
    }

    if (typeof c.costUnits === "number") {
      // 1 cost unit == 1 cent (Retell cost is already in cents).
      stats.estimatedCostCents += c.costUnits;
    }

    if (c.startedAt) {
      const local = getLocalDateInfo(timezone, c.startedAt);
      stats.callsByDay[local.localDate] =
        (stats.callsByDay[local.localDate] ?? 0) + 1;
      const hour = parseInt(local.localTime.slice(0, 2), 10);
      if (Number.isFinite(hour) && hour >= 0 && hour < 24) {
        stats.callsByHour[hour]++;
      }
    }

    const lang = c.detectedLanguage ?? "unknown";
    stats.callsByLanguage[lang] = (stats.callsByLanguage[lang] ?? 0) + 1;

    const outcome = c.outcomeType ?? "no_action";
    stats.callsByOutcome[outcome] = (stats.callsByOutcome[outcome] ?? 0) + 1;
  }

  stats.avgDurationSeconds =
    durationCount === 0 ? 0 : Math.round(durationSum / durationCount);

  return stats;
}

// ---------------------------------------------------------------------------
// Busy-hour grouping — counts per (weekday, hour) over the last 90 days.
// ---------------------------------------------------------------------------

export async function getBusyHours(
  tenantId: string,
): Promise<BusyHourData[]> {
  const since = new Date(Date.now() - 90 * DAY_MS);
  const tenant = await prisma.voiceTenant.findUnique({
    where: { id: tenantId },
    select: { timezone: true },
  });
  const timezone = tenant?.timezone || "Europe/Berlin";

  const calls = await prisma.voiceCall.findMany({
    where: {
      agent: { tenantId },
      startedAt: { gt: since },
    },
    select: { startedAt: true },
  });

  const grid = new Map<string, number>();
  for (const c of calls) {
    if (!c.startedAt) continue;
    const local = getLocalDateInfo(timezone, c.startedAt);
    const hour = parseInt(local.localTime.slice(0, 2), 10);
    if (!Number.isFinite(hour)) continue;
    const key = `${local.dayOfWeek}-${hour}`;
    grid.set(key, (grid.get(key) ?? 0) + 1);
  }

  const out: BusyHourData[] = [];
  for (const entry of Array.from(grid.entries())) {
    const [key, count] = entry;
    const parts = key.split("-").map((n: string) => parseInt(n, 10));
    out.push({ weekday: parts[0], hour: parts[1], count });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Recommendations — find weekday+hour combos with significantly above-average
// volume for that weekday and surface them in German.
// ---------------------------------------------------------------------------

export async function getRecommendations(
  _tenantId: string,
  busyHours: BusyHourData[],
): Promise<BusyHourRecommendation[]> {
  if (busyHours.length === 0) return [];

  // Group by weekday and compute mean+stddev for that weekday's hour buckets.
  const byWeekday = new Map<number, BusyHourData[]>();
  for (const row of busyHours) {
    const arr = byWeekday.get(row.weekday) ?? [];
    arr.push(row);
    byWeekday.set(row.weekday, arr);
  }

  const recs: BusyHourRecommendation[] = [];

  for (const entry of Array.from(byWeekday.entries())) {
    const weekday: number = entry[0];
    const rows: BusyHourData[] = entry[1];
    if (rows.length === 0) continue;
    const mean =
      rows.reduce((acc: number, r: BusyHourData) => acc + r.count, 0) /
      rows.length;
    if (mean < 0.5) continue; // not enough data on this weekday

    const peaks = rows
      .filter((r: BusyHourData) => r.count > 2 * mean)
      .sort((a: BusyHourData, b: BusyHourData) => b.count - a.count);
    if (peaks.length === 0) continue;

    // Cluster contiguous peak hours so "10:00, 11:00" becomes "10:00–12:00".
    const sortedHours = [...peaks].sort((a, b) => a.hour - b.hour);
    const ranges: Array<{ start: number; end: number; count: number }> = [];
    for (const p of sortedHours) {
      const last = ranges[ranges.length - 1];
      if (last && p.hour === last.end) {
        last.end = p.hour + 1;
        last.count += p.count;
      } else {
        ranges.push({ start: p.hour, end: p.hour + 1, count: p.count });
      }
    }

    const top = ranges.sort((a, b) => b.count - a.count)[0];
    const dayLabel = WEEKDAY_LABELS_DE[weekday] ?? "Tag";
    const peakHours = `${pad2(top.start)}:00–${pad2(top.end)}:00`;
    const message = `${dayLabel} ${peakHours} hat hohes Anrufvolumen (${top.count} Anrufe). AI-Overflow-Modus empfohlen.`;
    recs.push({
      message,
      weekday,
      peakHours,
      callVolume: top.count,
    });
  }

  return recs.sort((a, b) => b.callVolume - a.callVolume).slice(0, 5);
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Billing-month helpers.
// ---------------------------------------------------------------------------

export function formatBillingMonth(date: Date): string {
  const y = date.getUTCFullYear();
  const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}`;
}

export async function getMonthlyUsageSummary(
  tenantId: string,
  month: string,
): Promise<{ billableMinutes: number; costUnits: number; callCount: number }> {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`Invalid billing month "${month}", expected YYYY-MM`);
  }

  const records = await prisma.voiceUsageRecord.findMany({
    where: { tenantId, billingMonth: month },
    select: { billableMinutes: true, costUnits: true },
  });

  let billableMinutes = 0;
  let costUnits = 0;
  for (const r of records) {
    billableMinutes += r.billableMinutes;
    costUnits += r.costUnits;
  }

  return {
    billableMinutes,
    costUnits,
    callCount: records.length,
  };
}
