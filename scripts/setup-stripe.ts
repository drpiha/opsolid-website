/**
 * One-off Stripe setup for OpSolid Digital Card.
 *
 * - Reads STRIPE_SECRET_KEY from env (or the first line of the path given as
 *   the first CLI arg — the dev machine keeps it in ~/.stripe-token).
 * - For each template in src/config/card-templates.ts, ensures a Stripe
 *   Product tagged with metadata.opsolidTemplateId exists (creates if not).
 * - Ensures a one-time price and a yearly recurring price exist for each.
 * - Ensures a webhook endpoint exists pointing at the configured site URL
 *   (/api/webhooks/stripe) and prints its signing secret.
 * - Prints a snippet you can paste into src/config/card-templates.ts
 *   (stripeOneTimePriceId / stripeYearlyPriceId) — or pass --write to have
 *   the script patch the file in place.
 *
 * Usage:
 *   tsx scripts/setup-stripe.ts                 # dry-ish: creates, prints IDs
 *   tsx scripts/setup-stripe.ts --write         # patches card-templates.ts
 *   tsx scripts/setup-stripe.ts /path/to/key    # read key from file path
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";
import { cardTemplates } from "../src/config/card-templates";

const CONFIG_PATH = resolve(__dirname, "../src/config/card-templates.ts");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://opsolid.de";
const WEBHOOK_PATH = "/api/webhooks/stripe";

function loadSecretKey(): string {
  const envKey = process.env.STRIPE_SECRET_KEY;
  if (envKey && envKey.startsWith("sk_")) return envKey;

  // Any argv entry that's a readable file path and not a flag.
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--")) continue;
    try {
      const lines = readFileSync(arg, "utf8")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const match = lines.find((l) => l.startsWith("sk_"));
      if (match) return match;
    } catch {
      /* ignore */
    }
  }
  throw new Error(
    "No Stripe secret key — set STRIPE_SECRET_KEY or pass a key file path."
  );
}

async function main() {
  const secretKey = loadSecretKey();
  const stripe = new Stripe(secretKey, { typescript: true });
  const writeBack = process.argv.includes("--write");

  console.log(`→ Stripe mode: ${secretKey.startsWith("sk_live") ? "LIVE" : "TEST"}`);
  console.log(`→ Site URL: ${SITE_URL}`);
  console.log(`→ Templates: ${cardTemplates.length}`);

  // Fetch all existing products once (account is small).
  const existing = await stripe.products.list({ limit: 100 });

  const results: Array<{
    templateId: number;
    productId: string;
    oneTimePriceId: string;
    yearlyPriceId: string;
  }> = [];

  for (const t of cardTemplates) {
    const metaKey = String(t.id);
    let product =
      existing.data.find(
        (p) =>
          p.metadata?.opsolidProduct === "digital-card" &&
          p.metadata?.opsolidTemplateId === metaKey
      ) ?? null;

    if (!product) {
      product = await stripe.products.create({
        name: `OpSolid Digital Card — #${String(t.id).padStart(2, "0")} ${t.name}`,
        description: `Hand-designed digital business card, hosted in Germany (GDPR-native). Template ${t.componentKey}.`,
        metadata: {
          opsolidProduct: "digital-card",
          opsolidTemplateId: metaKey,
          opsolidTemplateSlug: t.slug,
        },
      });
      console.log(`+ product created #${t.id}: ${product.id}`);
    } else {
      console.log(`= product exists   #${t.id}: ${product.id}`);
    }

    // Pull existing prices for this product so we don't dup them on re-run.
    const prices = await stripe.prices.list({ product: product.id, limit: 20 });
    const oneTime =
      prices.data.find(
        (p) =>
          p.type === "one_time" &&
          p.unit_amount === t.oneTimeCents &&
          p.currency === "eur"
      ) ?? null;
    const yearly =
      t.yearlyCents
        ? prices.data.find(
            (p) =>
              p.type === "recurring" &&
              p.recurring?.interval === "year" &&
              p.unit_amount === t.yearlyCents &&
              p.currency === "eur"
          ) ?? null
        : null;

    let oneTimePrice: Stripe.Price;
    if (oneTime) {
      console.log(`  = one-time €${t.oneTimeCents / 100} exists: ${oneTime.id}`);
      oneTimePrice = oneTime;
    } else {
      oneTimePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: t.oneTimeCents,
        currency: "eur",
        metadata: { opsolidTemplateId: metaKey, kind: "one-time" },
      });
      console.log(`  + one-time €${t.oneTimeCents / 100} created: ${oneTimePrice.id}`);
    }

    let yearlyPriceId = "";
    if (t.yearlyCents) {
      if (yearly) {
        console.log(`  = yearly €${t.yearlyCents / 100}/y exists: ${yearly.id}`);
        yearlyPriceId = yearly.id;
      } else {
        const yp = await stripe.prices.create({
          product: product.id,
          unit_amount: t.yearlyCents,
          currency: "eur",
          recurring: { interval: "year" },
          metadata: { opsolidTemplateId: metaKey, kind: "yearly" },
        });
        console.log(`  + yearly €${t.yearlyCents / 100}/y created: ${yp.id}`);
        yearlyPriceId = yp.id;
      }
    }

    results.push({
      templateId: t.id,
      productId: product.id,
      oneTimePriceId: oneTimePrice.id,
      yearlyPriceId,
    });
  }

  // Webhook endpoint — idempotent by URL match.
  const targetUrl = `${SITE_URL}${WEBHOOK_PATH}`;
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  let endpoint = endpoints.data.find((e) => e.url === targetUrl) ?? null;
  if (!endpoint) {
    endpoint = await stripe.webhookEndpoints.create({
      url: targetUrl,
      enabled_events: [
        "checkout.session.completed",
        "customer.subscription.updated",
        "customer.subscription.deleted",
      ],
      description: "OpSolid Digital Card — order + subscription lifecycle",
    });
    console.log(`+ webhook created: ${endpoint.id}`);
  } else {
    console.log(`= webhook exists: ${endpoint.id}`);
  }
  // New webhooks reveal the secret once (via `secret`); existing ones don't.
  const webhookSecret = endpoint.secret ?? null;

  console.log("\n=== RESULTS ===");
  console.table(results);
  console.log("Webhook URL:     ", targetUrl);
  console.log("Webhook ID:      ", endpoint.id);
  console.log(
    "Webhook Secret:  ",
    webhookSecret
      ? webhookSecret
      : "(existing endpoint — reveal it in the Stripe dashboard → Developers → Webhooks → this endpoint → Signing secret)"
  );

  if (writeBack) {
    let src = readFileSync(CONFIG_PATH, "utf8");
    for (const r of results) {
      const reStart = new RegExp(
        String.raw`(\{\s*id:\s*${r.templateId},[\s\S]*?)(,\s*isActive:)`,
        "m"
      );
      const priceBlock =
        `\n    stripeOneTimePriceId: "${r.oneTimePriceId}",` +
        (r.yearlyPriceId
          ? `\n    stripeYearlyPriceId: "${r.yearlyPriceId}",`
          : "");
      // Avoid duplicate injections.
      if (src.includes(`"${r.oneTimePriceId}"`)) continue;

      src = src.replace(reStart, (_m, head, tail) => {
        const cleanHead = head.replace(
          /\n\s*stripe(?:OneTime|Yearly)PriceId:\s*"[^"]*",?/g,
          ""
        );
        return `${cleanHead}${priceBlock}${tail}`;
      });
    }
    writeFileSync(CONFIG_PATH, src);
    console.log(`✓ Patched ${CONFIG_PATH}`);
  } else {
    console.log(
      "\n(Run with --write to patch src/config/card-templates.ts automatically.)"
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
