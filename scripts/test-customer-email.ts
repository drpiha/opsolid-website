// =============================================================================
// Smoke test for the customer email pipeline.
//
// Usage:
//   npx tsx scripts/test-customer-email.ts you@example.com [locale]
//
// Builds a fake order, renders all three templates (confirmation,
// revision-ready, cancellation) in the chosen locale, and sends them via
// sendCustomerEmail. If SMTP_* env vars are missing, falls back to dumping
// the rendered HTML + text to stdout so you can eyeball it in dev.
// =============================================================================

import { sendCustomerEmail } from "../src/lib/email/send";
import { normalizeLocale } from "../src/lib/email/shell";
import {
  renderConfirmationHtml,
  renderConfirmationText,
  confirmationSubject,
} from "../src/lib/email/templates/confirmation";
import {
  renderRevisionReadyHtml,
  renderRevisionReadyText,
  revisionReadySubject,
} from "../src/lib/email/templates/revision-ready";
import {
  renderCancellationHtml,
  renderCancellationText,
  cancellationSubject,
} from "../src/lib/email/templates/cancellation";

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: npx tsx scripts/test-customer-email.ts <to-email> [locale]");
    process.exit(1);
  }
  const locale = normalizeLocale(process.argv[3]);

  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  if (!smtpConfigured) {
    console.log(
      "[test-customer-email] SMTP not configured, dumping HTML to stdout instead of sending.\n" +
        "  Set SMTP_HOST, SMTP_USER, SMTP_PASS (see .env.example) to actually send.\n"
    );
  }

  const fakeOrder = {
    orderId: "ord_smoketest_abc123",
    orderNumber: 9001,
    contactName: "Ada Lovelace",
    templateName: "Editorial One",
    billingMode: "YEARLY",
    amountCents: 14900,
    currency: "EUR",
    editToken: "00000000-0000-0000-0000-000000000000",
    slug: "ada-lovelace-ord_smoketest",
    isSubscription: true,
    accessThrough: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
  };

  // 1. Confirmation
  {
    const input = {
      orderId: fakeOrder.orderId,
      orderNumber: fakeOrder.orderNumber,
      contactName: fakeOrder.contactName,
      templateName: fakeOrder.templateName,
      billingMode: fakeOrder.billingMode,
      amountCents: fakeOrder.amountCents,
      currency: fakeOrder.currency,
      editToken: fakeOrder.editToken,
    };
    const subject = confirmationSubject(input, locale);
    const html = renderConfirmationHtml(input, locale);
    const text = renderConfirmationText(input, locale);
    await deliver("confirmation", to, subject, html, text, smtpConfigured);
  }

  // 2. Revision-ready
  {
    const input = {
      orderId: fakeOrder.orderId,
      orderNumber: fakeOrder.orderNumber,
      contactName: fakeOrder.contactName,
      slug: fakeOrder.slug,
      editToken: fakeOrder.editToken,
      isSubscription: fakeOrder.isSubscription,
    };
    const subject = revisionReadySubject(input, locale);
    const html = await renderRevisionReadyHtml(input, locale);
    const text = renderRevisionReadyText(input, locale);
    await deliver("revision-ready", to, subject, html, text, smtpConfigured);
  }

  // 3. Cancellation
  {
    const input = {
      orderId: fakeOrder.orderId,
      orderNumber: fakeOrder.orderNumber,
      contactName: fakeOrder.contactName,
      editToken: fakeOrder.editToken,
      accessThrough: fakeOrder.accessThrough,
    };
    const subject = cancellationSubject(input, locale);
    const html = renderCancellationHtml(input, locale);
    const text = renderCancellationText(input, locale);
    await deliver("cancellation", to, subject, html, text, smtpConfigured);
  }
}

async function deliver(
  label: string,
  to: string,
  subject: string,
  html: string,
  text: string,
  smtpConfigured: boolean
) {
  if (!smtpConfigured) {
    console.log(`\n===== [${label}] subject: ${subject} =====`);
    console.log(`--- TEXT (${text.length} chars) ---`);
    console.log(text);
    console.log(`--- HTML (${html.length} chars) ---`);
    console.log(html);
    return;
  }
  const result = await sendCustomerEmail({ to, subject, html, text });
  if (result.skipped) {
    console.warn(`[${label}] skipped: ${result.reason}`);
  } else {
    console.log(
      `[${label}] sent to ${to} — messageId=${result.messageId ?? "(none)"}`
    );
  }
}

main().catch((err) => {
  console.error("[test-customer-email] fatal:", err);
  process.exit(1);
});
