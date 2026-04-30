#!/usr/bin/env tsx
// scripts/test-lead-email.ts
// Sends a test lead notification (email + Telegram) to verify SMTP/Telegram config.
// Run: DATABASE_URL=... npx tsx scripts/test-lead-email.ts
// Set TEST_CARD_SLUG env var to target a specific card slug, or it uses "test-card".

import { sendLeadTelegram } from "../src/lib/notifications";
import { renderLeadNotification } from "../src/lib/email/templates/lead-notification";
import { sendCustomerEmail } from "../src/lib/email/send";
import { normalizeLocale } from "../src/lib/email/shell";

const TEST_SLUG = process.env.TEST_CARD_SLUG ?? "test-card";
const TO_EMAIL = process.env.TEST_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? "";

async function main() {
  console.log(`Testing lead notification for slug: ${TEST_SLUG}`);

  const testInfo = {
    ownerName: "Test Owner",
    cardSlug: TEST_SLUG,
    orderId: "test-order-id",
    editToken: null,
    visitor: {
      name: "Max Mustermann",
      email: "max@example.com",
      phone: "+49 170 123 4567",
      company: "Test GmbH",
      meetingContext: "Hannover Messe 2026",
      message: "Ich interessiere mich für Ihr Produkt.",
    },
  };

  // Test Telegram
  console.log("\n--- Testing Telegram ---");
  try {
    await sendLeadTelegram(testInfo);
    console.log("Telegram: OK");
  } catch (e) {
    console.error("Telegram:", e);
  }

  // Test Email
  if (TO_EMAIL) {
    console.log(`\n--- Testing Email (to: ${TO_EMAIL}) ---`);
    try {
      const { subject, html, text } = renderLeadNotification(
        {
          ownerName: testInfo.ownerName,
          cardSlug: testInfo.cardSlug,
          orderId: testInfo.orderId,
          visitor: {
            name: testInfo.visitor.name,
            email: testInfo.visitor.email,
            phone: testInfo.visitor.phone,
            company: testInfo.visitor.company,
            message: testInfo.visitor.message,
            interest: null,
            meetingContext: testInfo.visitor.meetingContext,
          },
          source: { src: "test", campaign: null, event: null, location: null },
        },
        normalizeLocale("de"),
      );
      await sendCustomerEmail({ to: TO_EMAIL, subject, html, text });
      console.log("Email: OK");
    } catch (e) {
      console.error("Email:", e);
    }
  } else {
    console.log("Email: skipped (TEST_TO_EMAIL or CONTACT_TO_EMAIL not set)");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
