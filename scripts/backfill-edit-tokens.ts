/* eslint-disable no-console */
// =============================================================================
// One-time editToken backfill for pre-existing orders.
//
// Usage:
//   npx tsx scripts/backfill-edit-tokens.ts
//
// Generates crypto.randomUUID() for every CardOrder whose editToken is NULL
// and prints the result so the operator can mail the edit URLs out by hand:
//
//     orderNumber=42  orderId=clx1abc...  editToken=7a9c1e0f-...
//
// Idempotent — re-runs are a no-op once all rows have a token. Also prints a
// trailing summary line so scripted runs can grep.
// =============================================================================

import crypto from "node:crypto";
import { prisma } from "../src/lib/prisma";

async function main() {
  const missing = await prisma.cardOrder.findMany({
    where: { editToken: null },
    select: { id: true, orderNumber: true, contactEmail: true, status: true },
    orderBy: { orderNumber: "asc" },
  });

  if (missing.length === 0) {
    console.log("No orders missing editToken. Nothing to do.");
    console.log("backfill_summary rows=0");
    return;
  }

  console.log(`Backfilling editToken for ${missing.length} order(s):`);
  let updated = 0;
  for (const row of missing) {
    const token = crypto.randomUUID();
    try {
      await prisma.cardOrder.update({
        where: { id: row.id },
        data: { editToken: token },
      });
      console.log(
        `  orderNumber=${row.orderNumber}  orderId=${row.id}  email=${row.contactEmail}  status=${row.status}  editToken=${token}`
      );
      updated++;
    } catch (err) {
      console.error(
        `  orderNumber=${row.orderNumber}  orderId=${row.id}  FAILED: ${(err as Error).message}`
      );
    }
  }

  console.log(`backfill_summary rows=${updated}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
