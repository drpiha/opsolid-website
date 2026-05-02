/* eslint-disable no-console */
// =============================================================================
// PII Anonymization CLI — GDPR Art.5(e) + KVKK md.7
//
// Usage:
//   npx tsx scripts/anonymize-pii.ts           # dry-run (default)
//   npx tsx scripts/anonymize-pii.ts --dry-run  # explicit dry-run
//   npx tsx scripts/anonymize-pii.ts --apply    # live anonymization
//
// Override retention window (default 13 months):
//   RETENTION_MONTHS=6 npx tsx scripts/anonymize-pii.ts --dry-run
//
// Exits non-zero if any rows failed to anonymize.
// =============================================================================

import { prisma } from "../src/lib/prisma";
import {
  runAllRetention,
  RETENTION_MONTHS,
  RETENTION_MS,
  type RetentionReport,
} from "../src/lib/retention";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad(s: string | number, width: number): string {
  return String(s).padStart(width);
}

function printReport(report: RetentionReport): void {
  const olderThan = report.olderThan.toISOString().slice(0, 10);
  const mode = report.dryRun ? "DRY-RUN" : "APPLIED";

  console.log("");
  console.log(
    `PII Anonymization Report  [${mode}]  olderThan=${olderThan}  window=${RETENTION_MONTHS} months`
  );
  console.log("─".repeat(62));
  console.log(
    `${"Table".padEnd(22)} ${"Scanned".padStart(8)} ${"Anonymized".padStart(12)} ${"Errors".padStart(8)}`
  );
  console.log("─".repeat(62));

  const rows: Array<[string, RetentionReport[keyof RetentionReport]]> = [
    ["card_leads", report.cardLeads],
    ["card_views", report.cardViews],
    ["scan_events", report.scanEvents],
    ["card_connections", report.cardConnections],
  ];

  for (const [label, result] of rows) {
    const r = result as { scanned: number; anonymized: number; errors: number };
    console.log(
      `${label.padEnd(22)} ${pad(r.scanned, 8)} ${pad(r.anonymized, 12)} ${pad(r.errors, 8)}`
    );
  }

  console.log("─".repeat(62));
  console.log(
    `${"TOTAL".padEnd(22)} ${pad(
      report.cardLeads.scanned +
        report.cardViews.scanned +
        report.scanEvents.scanned +
        report.cardConnections.scanned,
      8
    )} ${pad(report.totalAnonymized, 12)} ${pad(report.totalErrors, 8)}`
  );
  console.log("");

  if (report.dryRun) {
    console.log("No changes written. Re-run with --apply to execute.");
  }
  if (report.totalErrors > 0) {
    console.error(`WARNING: ${report.totalErrors} row(s) failed. Check logs above.`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const applyFlag = args.includes("--apply");
  const dryRunFlag = args.includes("--dry-run");

  // Default is dry-run; only go live when --apply is explicitly passed.
  const dryRun = !applyFlag || dryRunFlag;

  console.log(
    `[anonymize-pii] Starting  dryRun=${dryRun}  retentionMonths=${RETENTION_MONTHS}  retentionMs=${RETENTION_MS}`
  );

  const report = await runAllRetention({ dryRun });
  printReport(report);

  if (report.totalErrors > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error("[anonymize-pii] Fatal error:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
