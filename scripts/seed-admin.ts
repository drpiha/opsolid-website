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

  // Always set proSince alongside the role so isPro() resolves true even on
  // code paths that don't read role yet (defence-in-depth — the role check is
  // now the primary bypass, but historical data + audit reads still expect a
  // proSince timestamp on Pro accounts).
  const updates: { role?: "ADMIN"; proSince?: Date } = {};
  if (user.role !== "ADMIN") updates.role = "ADMIN";
  if (!user.proSince) updates.proSince = new Date();

  if (Object.keys(updates).length === 0) {
    console.log(`User ${email} is already ADMIN with proSince set. Nothing to do.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: updates,
  });

  const what = [
    updates.role ? "promoted to ADMIN" : null,
    updates.proSince ? "granted Pro access" : null,
  ]
    .filter(Boolean)
    .join(" + ");
  console.log(`${email}: ${what}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
