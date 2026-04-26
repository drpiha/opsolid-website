// Business-hours engine — decides whether the AI should answer "now" for a tenant.

import { prisma } from "@/lib/prisma";

export type AiDecision =
  | { shouldAnswer: true; reason: "within_hours" | "always_on" }
  | {
      shouldAnswer: false;
      reason:
        | "outside_hours"
        | "holiday"
        | "manual_off"
        | "overflow_not_needed";
    };

export interface LocalDateInfo {
  /** YYYY-MM-DD in tenant timezone. */
  localDate: string;
  /** HH:MM (24h) in tenant timezone. */
  localTime: string;
  /** 0=Sunday .. 6=Saturday (matches JS Date.getDay() and our schema). */
  dayOfWeek: number;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Convert a UTC instant to a tenant-local date/time using only Intl.
 * No external deps (date-fns / luxon) — DST and timezone offsets are handled
 * by Intl.DateTimeFormat.
 */
export function getLocalDateInfo(
  timezone: string,
  nowUtc: Date,
): LocalDateInfo {
  // Use formatToParts so we can read fields without locale-format ambiguity.
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });
  const parts = formatter.formatToParts(nowUtc);

  let year = "1970";
  let month = "01";
  let day = "01";
  let hour = "00";
  let minute = "00";
  let weekday = "Sun";

  for (const p of parts) {
    switch (p.type) {
      case "year":
        year = p.value;
        break;
      case "month":
        month = p.value;
        break;
      case "day":
        day = p.value;
        break;
      case "hour":
        // hourCycle h23 returns 00..23 but Intl sometimes still emits "24" at midnight.
        hour = p.value === "24" ? "00" : p.value;
        break;
      case "minute":
        minute = p.value;
        break;
      case "weekday":
        weekday = p.value;
        break;
    }
  }

  return {
    localDate: `${year}-${month}-${day}`,
    localTime: `${hour}:${minute}`,
    dayOfWeek: WEEKDAY_INDEX[weekday] ?? 0,
  };
}

/**
 * Compare two HH:MM strings. Returns -1, 0, or 1.
 */
function compareTime(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * Is `now` between `open` and `close`? Handles overnight ranges (close < open
 * means the period crosses midnight, e.g. 22:00 → 04:00).
 */
function isWithinRange(now: string, open: string, close: string): boolean {
  if (open === close) return false; // zero-length window
  if (compareTime(open, close) <= 0) {
    // normal same-day range, e.g. 09:00..18:00
    return compareTime(now, open) >= 0 && compareTime(now, close) < 0;
  }
  // overnight, e.g. 22:00..02:00 — match if before close OR at/after open.
  return compareTime(now, open) >= 0 || compareTime(now, close) < 0;
}

/**
 * Decide whether the AI should answer right now for a given tenant.
 *
 * Algorithm:
 *   1. Load tenant timezone.
 *   2. Convert `nowUtc` (or actual now) to tenant local date/time.
 *   3. Holiday overrides first: a row with isOverride=true and overrideDate
 *      matching today wins over weekly schedule.
 *   4. Otherwise fall back to the weekly row keyed by dayOfWeek.
 *   5. Evaluate the row's `aiMode`:
 *        always_on    → always true
 *        manual_off   → always false
 *        overflow     → AI handles only OUTSIDE business hours (overflow not
 *                       needed inside)
 *        outside_hours → AI handles only OUTSIDE hours
 *        default       → AI handles inside hours
 */
export async function shouldAiAnswerNow(
  tenantId: string,
  nowUtc?: Date,
): Promise<AiDecision> {
  const tenant = await prisma.voiceTenant.findUnique({
    where: { id: tenantId },
    select: { timezone: true },
  });
  if (!tenant) {
    // Unknown tenant → don't answer; safer than dialing accidentally.
    return { shouldAnswer: false, reason: "manual_off" };
  }

  const timezone = tenant.timezone || "Europe/Berlin";
  const now = nowUtc ?? new Date();
  const local = getLocalDateInfo(timezone, now);

  // 1. Holiday/override row for today, if any.
  const override = await prisma.voiceBusinessHours.findFirst({
    where: {
      tenantId,
      isOverride: true,
      overrideDate: local.localDate,
    },
  });

  // 2. Weekly row for this dayOfWeek.
  const weekly = await prisma.voiceBusinessHours.findFirst({
    where: {
      tenantId,
      dayOfWeek: local.dayOfWeek,
      isOverride: false,
    },
  });

  const row = override ?? weekly;

  if (!row) {
    return { shouldAnswer: false, reason: "outside_hours" };
  }

  // Holiday rows often mark the day fully closed.
  if (row.isClosed) {
    if (row.aiMode === "always_on") {
      return { shouldAnswer: true, reason: "always_on" };
    }
    return {
      shouldAnswer: false,
      reason: row.isOverride ? "holiday" : "outside_hours",
    };
  }

  const inside = isWithinRange(local.localTime, row.openTime, row.closeTime);

  switch (row.aiMode) {
    case "always_on":
      return { shouldAnswer: true, reason: "always_on" };

    case "manual_off":
      return { shouldAnswer: false, reason: "manual_off" };

    case "overflow":
      // Overflow mode means humans handle inside hours; AI handles outside.
      return inside
        ? { shouldAnswer: false, reason: "overflow_not_needed" }
        : { shouldAnswer: true, reason: "within_hours" };

    case "outside_hours":
      return inside
        ? { shouldAnswer: false, reason: "overflow_not_needed" }
        : { shouldAnswer: true, reason: "within_hours" };

    default:
      // Default: AI handles inside hours.
      return inside
        ? { shouldAnswer: true, reason: "within_hours" }
        : { shouldAnswer: false, reason: "outside_hours" };
  }
}
