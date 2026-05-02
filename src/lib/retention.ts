// =============================================================================
// PII Retention — GDPR Art.5(e) + KVKK md.7
//
// 13-month anonymization of tracking rows across four tables:
//   card_leads, card_views, scan_events, card_connections
//
// Design:
//   - Idempotent: only processes rows WHERE pii_redacted_at IS NULL.
//   - Dry-run: counts + logs without any UPDATE.
//   - Per-row error isolation: one bad row never aborts the batch.
//   - Sentry breadcrumbs (dynamic import — silently skipped if not present).
// =============================================================================

import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const RETENTION_MONTHS =
  Number(process.env.RETENTION_MONTHS ?? 0) || 13;

export const RETENTION_MS = RETENTION_MONTHS * 30 * 24 * 3600 * 1000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TableResult {
  scanned: number;
  anonymized: number;
  errors: number;
}

export interface RetentionReport {
  dryRun: boolean;
  olderThan: Date;
  cardLeads: TableResult;
  cardViews: TableResult;
  scanEvents: TableResult;
  cardConnections: TableResult;
  totalAnonymized: number;
  totalErrors: number;
}

// ---------------------------------------------------------------------------
// Sentry helper — dynamic import, never throws
// ---------------------------------------------------------------------------

async function addSentryBreadcrumb(
  message: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.addBreadcrumb({
      category: "retention",
      message,
      data,
      level: "info",
    });
  } catch {
    // Sentry not available — ignore
  }
}

async function captureSentryException(
  err: unknown,
  context: Record<string, unknown>
): Promise<void> {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.withScope((scope) => {
      for (const [k, v] of Object.entries(context)) {
        scope.setExtra(k, v);
      }
      Sentry.captureException(err);
    });
  } catch {
    // Sentry not available — ignore
  }
}

// ---------------------------------------------------------------------------
// anonymizeCardLeads
// ---------------------------------------------------------------------------

export async function anonymizeCardLeads({
  olderThan,
  dryRun,
}: {
  olderThan: Date;
  dryRun: boolean;
}): Promise<TableResult> {
  const candidates = await prisma.cardLead.findMany({
    where: {
      createdAt: { lt: olderThan },
      piiRedactedAt: null,
    },
    select: { id: true },
  });

  const scanned = candidates.length;
  let anonymized = 0;
  let errors = 0;
  const now = new Date();

  await addSentryBreadcrumb("retention:card_leads:start", {
    scanned,
    dryRun,
    olderThan: olderThan.toISOString(),
  });

  if (dryRun) {
    console.log(`[retention] DRY-RUN card_leads: ${scanned} rows would be anonymized`);
    return { scanned, anonymized: 0, errors: 0 };
  }

  for (const { id } of candidates) {
    try {
      await prisma.cardLead.update({
        where: { id },
        data: {
          email: null,
          phone: null,
          name: "REDACTED",
          message: null,
          piiRedactedAt: now,
        },
      });
      anonymized++;
    } catch (err) {
      errors++;
      console.error(`[retention] card_leads id=${id} failed:`, err);
      await captureSentryException(err, { table: "card_leads", rowId: id });
    }
  }

  await addSentryBreadcrumb("retention:card_leads:done", {
    scanned,
    anonymized,
    errors,
  });

  console.log(
    `[retention] card_leads: scanned=${scanned} anonymized=${anonymized} errors=${errors}`
  );
  return { scanned, anonymized, errors };
}

// ---------------------------------------------------------------------------
// anonymizeCardViews
// ---------------------------------------------------------------------------

export async function anonymizeCardViews({
  olderThan,
  dryRun,
}: {
  olderThan: Date;
  dryRun: boolean;
}): Promise<TableResult> {
  const candidates = await prisma.cardView.findMany({
    where: {
      createdAt: { lt: olderThan },
      piiRedactedAt: null,
    },
    select: { id: true },
  });

  const scanned = candidates.length;
  let anonymized = 0;
  let errors = 0;
  const now = new Date();

  await addSentryBreadcrumb("retention:card_views:start", {
    scanned,
    dryRun,
    olderThan: olderThan.toISOString(),
  });

  if (dryRun) {
    console.log(`[retention] DRY-RUN card_views: ${scanned} rows would be anonymized`);
    return { scanned, anonymized: 0, errors: 0 };
  }

  for (const { id } of candidates) {
    try {
      await prisma.cardView.update({
        where: { id },
        data: {
          ua: null,
          referer: null,
          piiRedactedAt: now,
        },
      });
      anonymized++;
    } catch (err) {
      errors++;
      console.error(`[retention] card_views id=${id} failed:`, err);
      await captureSentryException(err, { table: "card_views", rowId: id });
    }
  }

  await addSentryBreadcrumb("retention:card_views:done", {
    scanned,
    anonymized,
    errors,
  });

  console.log(
    `[retention] card_views: scanned=${scanned} anonymized=${anonymized} errors=${errors}`
  );
  return { scanned, anonymized, errors };
}

// ---------------------------------------------------------------------------
// anonymizeScanEvents
// ---------------------------------------------------------------------------

export async function anonymizeScanEvents({
  olderThan,
  dryRun,
}: {
  olderThan: Date;
  dryRun: boolean;
}): Promise<TableResult> {
  const candidates = await prisma.scanEvent.findMany({
    where: {
      createdAt: { lt: olderThan },
      piiRedactedAt: null,
    },
    select: { id: true },
  });

  const scanned = candidates.length;
  let anonymized = 0;
  let errors = 0;
  const now = new Date();

  await addSentryBreadcrumb("retention:scan_events:start", {
    scanned,
    dryRun,
    olderThan: olderThan.toISOString(),
  });

  if (dryRun) {
    console.log(`[retention] DRY-RUN scan_events: ${scanned} rows would be anonymized`);
    return { scanned, anonymized: 0, errors: 0 };
  }

  for (const { id } of candidates) {
    try {
      await prisma.scanEvent.update({
        where: { id },
        data: {
          userAgent: null,
          ipHash: null,
          referer: null,
          piiRedactedAt: now,
        },
      });
      anonymized++;
    } catch (err) {
      errors++;
      console.error(`[retention] scan_events id=${id} failed:`, err);
      await captureSentryException(err, { table: "scan_events", rowId: id });
    }
  }

  await addSentryBreadcrumb("retention:scan_events:done", {
    scanned,
    anonymized,
    errors,
  });

  console.log(
    `[retention] scan_events: scanned=${scanned} anonymized=${anonymized} errors=${errors}`
  );
  return { scanned, anonymized, errors };
}

// ---------------------------------------------------------------------------
// anonymizeCardConnections
// ---------------------------------------------------------------------------

export async function anonymizeCardConnections({
  olderThan,
  dryRun,
}: {
  olderThan: Date;
  dryRun: boolean;
}): Promise<TableResult> {
  // CardConnection has no direct PII fields (identities are represented as
  // FK references to CardOrder, not raw strings). The `note` field may hold
  // free-text entered by the visitor — redact it. `source`/`campaign`/
  // `eventName` are analytics labels only; we keep them for aggregated stats.
  const candidates = await prisma.cardConnection.findMany({
    where: {
      createdAt: { lt: olderThan },
      piiRedactedAt: null,
    },
    select: { id: true },
  });

  const scanned = candidates.length;
  let anonymized = 0;
  let errors = 0;
  const now = new Date();

  await addSentryBreadcrumb("retention:card_connections:start", {
    scanned,
    dryRun,
    olderThan: olderThan.toISOString(),
  });

  if (dryRun) {
    console.log(
      `[retention] DRY-RUN card_connections: ${scanned} rows would be anonymized`
    );
    return { scanned, anonymized: 0, errors: 0 };
  }

  for (const { id } of candidates) {
    try {
      await prisma.cardConnection.update({
        where: { id },
        data: {
          note: null,
          piiRedactedAt: now,
        },
      });
      anonymized++;
    } catch (err) {
      errors++;
      console.error(`[retention] card_connections id=${id} failed:`, err);
      await captureSentryException(err, { table: "card_connections", rowId: id });
    }
  }

  await addSentryBreadcrumb("retention:card_connections:done", {
    scanned,
    anonymized,
    errors,
  });

  console.log(
    `[retention] card_connections: scanned=${scanned} anonymized=${anonymized} errors=${errors}`
  );
  return { scanned, anonymized, errors };
}

// ---------------------------------------------------------------------------
// runAllRetention — orchestrator
// ---------------------------------------------------------------------------

export async function runAllRetention({
  dryRun,
}: {
  dryRun: boolean;
}): Promise<RetentionReport> {
  const olderThan = new Date(Date.now() - RETENTION_MS);

  console.log(
    `[retention] START dryRun=${dryRun} retentionMonths=${RETENTION_MONTHS} olderThan=${olderThan.toISOString()}`
  );

  const cardLeads = await anonymizeCardLeads({ olderThan, dryRun });
  const cardViews = await anonymizeCardViews({ olderThan, dryRun });
  const scanEvents = await anonymizeScanEvents({ olderThan, dryRun });
  const cardConnections = await anonymizeCardConnections({ olderThan, dryRun });

  const totalAnonymized =
    cardLeads.anonymized +
    cardViews.anonymized +
    scanEvents.anonymized +
    cardConnections.anonymized;

  const totalErrors =
    cardLeads.errors +
    cardViews.errors +
    scanEvents.errors +
    cardConnections.errors;

  const report: RetentionReport = {
    dryRun,
    olderThan,
    cardLeads,
    cardViews,
    scanEvents,
    cardConnections,
    totalAnonymized,
    totalErrors,
  };

  console.log(
    `[retention] DONE totalAnonymized=${totalAnonymized} totalErrors=${totalErrors}`
  );

  return report;
}
