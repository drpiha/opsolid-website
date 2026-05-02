/* eslint-disable no-console */
// =============================================================================
// seed-admin.ts — Promote an existing user to role=ADMIN (B0.6).
//
// Usage:
//   npx tsx scripts/seed-admin.ts drhasanhd@gmail.com
//
// The user must already exist (have registered via the auth flow).
// Safe to re-run — idempotent if the user is already ADMIN.
// Never auto-promotes; this script must be run manually after deploying.
// =============================================================================

import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.argv[2]?.trim();
  if (!email) {
    console.error("Usage: npx tsx scripts/seed-admin.ts <email>");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    console.error("The user must register first via the auth flow.");
    process.exitCode = 1;
    return;
  }

  if (user.role === "ADMIN") {
    console.log(`User ${email} is already ADMIN. Nothing to do.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`Promoted ${email} to ADMIN.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
