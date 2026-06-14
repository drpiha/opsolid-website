#!/usr/bin/env tsx
// =============================================================================
// scripts/send-test-email.ts — send ONE real email through the configured
// provider chain (Brevo > Resend > SMTP > console) to verify delivery.
//
// After setting BREVO_API_KEY (+ BREVO_FROM_EMAIL) in the environment:
//   TEST_TO_EMAIL=you@example.com npm run test:email
//
// Prints which provider was selected and the send result. Exit 1 on failure
// so it can gate a smoke check. With no provider configured it logs via the
// console transport (so it never silently does nothing).
// =============================================================================

import { sendEmail } from "../src/lib/email/client";

function activeProvider(): string {
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return "smtp";
  }
  return "console (no provider configured)";
}

async function main() {
  const to = process.env.TEST_TO_EMAIL;
  if (!to) {
    console.error("Set TEST_TO_EMAIL=you@example.com (the inbox to send the test to).");
    process.exit(1);
  }

  const provider = activeProvider();
  console.log(`Sending test email to ${to} via ${provider}…`);

  const result = await sendEmail({
    to,
    subject: "OpSolid — transactional email test",
    html:
      "<p>If you can read this, OpSolid transactional email is working.</p>" +
      `<p style="color:#888">Provider: ${provider} · ${new Date().toISOString()}</p>`,
    text:
      "If you can read this, OpSolid transactional email is working.\n" +
      `Provider: ${provider} · ${new Date().toISOString()}`,
    replyTo: process.env.CONTACT_TO_EMAIL,
  });

  console.log("Result:", result);
  if (!result.ok) {
    console.error("Send FAILED — see the error above.");
    process.exit(1);
  }
  console.log("OK — check the inbox (and the spam folder).");
}

void main();
