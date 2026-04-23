/**
 * One-off Stripe setup for OpSolid Digital Card.
 *
 * - Reads STRIPE_SECRET_KEY from env (or the first line of the path given as
 *   the first CLI arg — the dev machine keeps it in ~/.stripe-token). You can
 *   also pass the key inline via `--live sk_live_...`.
 * - For each template in src/config/card-templates.ts, ensures a Stripe
 *   Product tagged with metadata.opsolidTemplateId exists (creates if not).
 * - Ensures one-time, monthly, and yearly prices exist for each.
 * - Ensures a webhook endpoint exists pointing at the configured site URL
 *   (/api/webhooks/stripe) and prints its signing secret.
 * - Prints an `.env.live` block the operator can paste into
 *   /opt/opsolid-website/.env after running in LIVE mode.
 * - Prints a snippet you can paste into src/config/card-templates.ts
 *   (stripeOneTimePriceId / stripeMonthlyPriceId / stripeYearlyPriceId) — or
 *   pass --write to have the script patch the file in place.
 *
 * Usage:
 *   tsx scripts/setup-stripe.ts                        # TEST-mode dry-ish
 *   tsx scripts/setup-stripe.ts --write                # TEST mode, patch file
 *   tsx scripts/setup-stripe.ts --live sk_live_xxx     # LIVE, dry-run
 *   tsx scripts/setup-stripe.ts --live sk_live_xxx --write  # LIVE + patch
 *   tsx scripts/setup-stripe.ts /path/to/key           # read key from file
 *   tsx scripts/setup-stripe.ts --help                 # print this block
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";
import { cardTemplates } from "../src/config/card-templates";

const CONFIG_PATH = resolve(__dirname, "../src/config/card-templates.ts");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://opsolid.de";
const WEBHOOK_PATH = "/api/webhooks/stripe";

function printHelp() {
  console.log(
    [
      "Usage:",
      "  tsx scripts/setup-stripe.ts                        # TEST mode, dry-ish",
      "  tsx scripts/setup-stripe.ts --write                # TEST mode, patch config",
      "  tsx scripts/setup-stripe.ts --live sk_live_xxx     # LIVE mode, dry-run",
      "  tsx scripts/setup-stripe.ts --live sk_live_xxx --write",
      "  tsx scripts/setup-stripe.ts /path/to/key-file      # read key from path",
      "",
      "Env:",
      "  STRIPE_SECRET_KEY      # sk_test_ or sk_live_ — overridden by --live",
      "  NEXT_PUBLIC_SITE_URL   # webhook target (defaults to https://opsolid.de)",
      "",
      "The script is idempotent: re-running finds existing products + prices by",
      "metadata and does not duplicate them. Webhook endpoint is matched by URL.",
    ].join("\n")
  );
}

function liveFlagValue(): string | null {
  const args = process.argv.slice(2);
  const i = args.indexOf("--live");
  if (i === -1) return null;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) {
    throw new Error("--live requires a secret key value (sk_live_...)");
  }
  return v;
}

function loadSecretKey(): string {
  const live = liveFlagValue();
  if (live) {
    if (!live.startsWith("sk_live_") && !live.startsWith("sk_test_")) {
      throw new Error("--live key must start with sk_live_ or sk_test_");
    }
    return live;
  }

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
    "No Stripe secret key — set STRIPE_SECRET_KEY, pass --live sk_live_..., or pass a key file path."
  );
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printHelp();
    return;
  }

  const secretKey = loadSecretKey();
  const stripe = new Stripe(secretKey, { typescript: true });
  const writeBack = process.argv.includes("--write");
  const isLive = secretKey.startsWith("sk_live_");

  console.log(`→ Stripe mode: ${isLive ? "LIVE" : "TEST"}`);
  console.log(`→ Site URL: ${SITE_URL}`);
  console.log(`→ Templates: ${cardTemplates.length}`);

  // Fetch all existing products once (account is small).
  const existing = await stripe.products.list({ limit: 100 });

  const results: Array<{
    templateId: number;
    productId: string;
    oneTimePriceId: string;
    monthlyPriceId: string;
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

    const findPrice = (
      type: "one_time" | "recurring",
      amount: number,
      interval?: "month" | "year"
    ) =>
      prices.data.find(
        (p) =>
          p.type === type &&
          p.unit_amount === amount &&
          p.currency === "eur" &&
          (type === "one_time" ? true : p.recurring?.interval === interval)
      ) ?? null;

    const ensurePrice = async (
      kind: "monthly" | "yearly" | "one-time",
      amount: number
    ): Promise<string> => {
      const type = kind === "one-time" ? "one_time" : "recurring";
      const interval = kind === "monthly" ? "month" : kind === "yearly" ? "year" : undefined;
      const existing = findPrice(type, amount, interval);
      if (existing) {
        console.log(
          `  = ${kind} €${amount / 100}${interval ? "/" + interval[0] : ""} exists: ${existing.id}`
        );
        return existing.id;
      }
      const created = await stripe.prices.create({
        product: product.id,
        unit_amount: amount,
        currency: "eur",
        ...(interval ? { recurring: { interval } } : {}),
        metadata: { opsolidTemplateId: metaKey, kind },
      });
      console.log(
        `  + ${kind} €${amount / 100}${interval ? "/" + interval[0] : ""} created: ${created.id}`
      );
      return created.id;
    };

    const oneTimePriceId = await ensurePrice("one-time", t.oneTimeCents);
    const monthlyPriceId = t.monthlyCents
      ? await ensurePrice("monthly", t.monthlyCents)
      : "";
    const yearlyPriceId = t.yearlyCents
      ? await ensurePrice("yearly", t.yearlyCents)
      : "";

    results.push({
      templateId: t.id,
      productId: product.id,
      oneTimePriceId,
      monthlyPriceId,
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

  // Print a .env.live block the operator can paste into /opt/opsolid-website/.env
  if (isLive) {
    console.log("\n=== .env.live (paste into /opt/opsolid-website/.env) ===");
    console.log(
      [
        `# --- Stripe LIVE — generated by scripts/setup-stripe.ts ---`,
        `STRIPE_SECRET_KEY=${secretKey}`,
        `STRIPE_WEBHOOK_SECRET=${webhookSecret ?? "whsec_REVEAL_FROM_DASHBOARD"}`,
        `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_REPLACE_WITH_DASHBOARD_VALUE`,
      ].join("\n")
    );
    console.log(
      "# Publishable key lives in Stripe dashboard → Developers → API keys.\n"
    );
  }

  if (writeBack) {
    // Use a line-based approach (safer than one regex-of-doom on a whole file).
    // For each `{ id: N, ... },` object, drop any stale stripe*PriceId lines
    // and insert the fresh three right before the `isActive:` line.
    let src = readFileSync(CONFIG_PATH, "utf8");

    for (const r of results) {
      const blockRe = new RegExp(
        String.raw`(\{\s*id:\s*${r.templateId},[\s\S]*?\n\s*\},)`,
        "m"
      );
      const match = src.match(blockRe);
      if (!match) {
        console.warn(`! could not locate block for template #${r.templateId}`);
        continue;
      }
      const original = match[0];
      // Strip any existing stripe*PriceId lines (handles re-runs cleanly).
      const cleaned = original.replace(
        /\n\s*stripe(?:OneTime|Monthly|Yearly)PriceId:\s*"[^"]*",?/g,
        ""
      );
      const insertBefore = cleaned.match(/(\n\s*)(isActive:)/);
      if (!insertBefore) {
        console.warn(`! no isActive anchor for #${r.templateId}`);
        continue;
      }
      const indent = insertBefore[1];
      const priceLines =
        `${indent}stripeOneTimePriceId: "${r.oneTimePriceId}",` +
        (r.monthlyPriceId
          ? `${indent}stripeMonthlyPriceId: "${r.monthlyPriceId}",`
          : "") +
        (r.yearlyPriceId
          ? `${indent}stripeYearlyPriceId: "${r.yearlyPriceId}",`
          : "");
      const patched = cleaned.replace(
        insertBefore[0],
        `${priceLines}${insertBefore[0]}`
      );
      src = src.replace(original, patched);
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
