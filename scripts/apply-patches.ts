/**
 * apply-patches.ts — run SQL patch files against the configured DATABASE_URL.
 * Uses Prisma client so it picks up .env automatically.
 *
 * Usage:
 *   npx tsx scripts/apply-patches.ts [patch_file1.sql] [patch_file2.sql] ...
 *
 * If no files are given, applies patches 015–018 (Phase 8.1–8.5) by default.
 *
 * Example:
 *   npx tsx scripts/apply-patches.ts prisma/patch_017_card_feedback.sql prisma/patch_018_card_actions.sql
 */

import { PrismaClient } from "../src/generated/prisma";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const DEFAULT_PATCHES = [
  "prisma/patch_015_card_visibility.sql",
  "prisma/patch_016_saved_cards.sql",
  "prisma/patch_017_card_feedback.sql",
  "prisma/patch_018_card_actions.sql",
];

function splitStatements(sql: string): string[] {
  return sql
    .replace(/--[^\n]*/g, "") // strip line comments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  const files = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_PATCHES;

  for (const relPath of files) {
    const absPath = join(process.cwd(), relPath);
    console.log(`\n▶ Applying ${relPath}`);

    let sql: string;
    try {
      sql = readFileSync(absPath, "utf-8");
    } catch {
      console.error(`  ✗ File not found: ${absPath}`);
      continue;
    }

    const statements = splitStatements(sql);
    for (const stmt of statements) {
      const preview = stmt.replace(/\s+/g, " ").slice(0, 90);
      try {
        await prisma.$executeRawUnsafe(stmt);
        console.log(`  ✓ ${preview}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // "already exists" errors from IF NOT EXISTS should not happen, but ignore gracefully
        if (msg.includes("already exists")) {
          console.log(`  ~ (already exists) ${preview}`);
        } else {
          console.error(`  ✗ ${preview}`);
          console.error(`    ${msg}`);
          process.exitCode = 1;
        }
      }
    }
  }

  await prisma.$disconnect();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
