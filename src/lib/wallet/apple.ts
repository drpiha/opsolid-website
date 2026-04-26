// =============================================================================
// Apple Wallet — `.pkpass` builder.
//
// Builds a signed Apple Wallet pass for a Smart Card visitor to save the
// contact directly on iOS. Pass type: `generic`. The QR barcode points at the
// card's public URL so re-tapping the pass re-opens the latest version.
//
// Env-gated: throws `WalletNotConfiguredError` when any of the required cert
// env vars are missing. The route translates this into a 503 response so the
// app ships cleanly without certs (default state for Phase 6).
//
// Image handling note:
//   pass-js's PassImages.validate() requires icon.png + icon@2x.png. We embed
//   a minimal 1×1 transparent PNG buffer for both so signing passes locally.
//   Once real branding assets land, swap the constant for an Image fetched
//   from the order's logoPath / a brand SVG rasterized server-side.
// =============================================================================

// We dynamically import @walletpass/pass-js inside `buildApplePass` because
// the package reads `process.env.APPLE_WWDR_CERT_PEM` at *module load time*
// (it parses the cert into a top-level constant). We expose our cert under
// the env var name `APPLE_WALLET_WWDR_PEM` for clarity, so we bridge to the
// name pass-js expects before requiring the module.
import { WalletNotConfiguredError, isAppleWalletConfigured } from "./config";

export interface BuildApplePassArgs {
  slug: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  primaryHex?: string | null;
  accentHex?: string | null;
  /** QR target — the card's canonical public URL. */
  cardUrl: string;
}

// 1×1 transparent PNG. pass-js refuses to sign without icon.png + icon@2x.png,
// so we embed the smallest valid PNG to satisfy the validator. End users won't
// see this rendered — Apple Wallet only shows the icon if the strip image is
// missing AND the device is older. Real branding artwork is a follow-up.
const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=";
const TINY_PNG = Buffer.from(TINY_PNG_BASE64, "base64");

const DEFAULT_BG_HEX = "#15120F";

/**
 * Convert `#rrggbb` to the `rgb(r, g, b)` string Apple Wallet expects.
 * Falls back to the default warm-graphite background if the hex is malformed
 * (paranoid: malformed hex would otherwise produce `rgb(NaN,NaN,NaN)` and
 * break the pass signing).
 */
function hexToRgbString(hex: string | null | undefined, fallback = DEFAULT_BG_HEX): string {
  const candidate = (hex ?? fallback).trim();
  const m = /^#?([0-9a-fA-F]{6})$/.exec(candidate);
  const safe = m ? m[1] : fallback.replace(/^#/, "");
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return `rgb(21, 18, 15)`; // ink fallback
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Build a signed `.pkpass` zip buffer. Throws `WalletNotConfiguredError` when
 * the cert env vars are unset. Other failures (signing, malformed cert, etc.)
 * surface as the original error so the route can log and 500.
 */
export async function buildApplePass(args: BuildApplePassArgs): Promise<Buffer> {
  if (!isAppleWalletConfigured()) {
    throw new WalletNotConfiguredError("apple");
  }

  const certPem = process.env.APPLE_WALLET_CERT_PEM!;
  const keyPem = process.env.APPLE_WALLET_KEY_PEM!;
  const keyPassphrase = process.env.APPLE_WALLET_KEY_PASSPHRASE; // optional
  const wwdrPem = process.env.APPLE_WALLET_WWDR_PEM!;
  const passTypeIdentifier = process.env.APPLE_WALLET_PASS_TYPE_ID!;
  const teamIdentifier = process.env.APPLE_WALLET_TEAM_ID!;

  // Bridge our env var name to the one pass-js reads at module load. Done
  // BEFORE the dynamic import so pass-js parses the cert we provided. If
  // operators upload a current WWDR cert via APPLE_WALLET_WWDR_PEM, this
  // overrides the (potentially expired) hardcoded default in pass-js.
  if (!process.env.APPLE_WWDR_CERT_PEM) {
    process.env.APPLE_WWDR_CERT_PEM = wwdrPem;
  }

  // Dynamic import — see file header for rationale (env var ordering).
  const { Template } = await import("@walletpass/pass-js");

  // -------------------------------------------------------------------------
  // Template (cert + WWDR) — signs every pass produced from it.
  // -------------------------------------------------------------------------
  const template = new Template("generic", {
    passTypeIdentifier,
    teamIdentifier,
    organizationName: "OpSolid",
  });

  // setCertificate accepts either the bare signer cert PEM or a combined
  // PEM with the private key embedded. We split: cert first, then private key.
  template.setCertificate(certPem);
  template.setPrivateKey(keyPem, keyPassphrase);

  // -------------------------------------------------------------------------
  // Pass body — fields, colors, barcode.
  // -------------------------------------------------------------------------
  const pass = template.createPass({
    serialNumber: args.slug,
    description: `${args.name} – Smart Card`,
    backgroundColor: hexToRgbString(args.primaryHex),
    foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(255, 255, 255)",
  });

  // primary: name (always present — required by CardData schema)
  pass.primaryFields.add({ key: "name", label: "Name", value: args.name });

  // secondary: title + phone (only when present)
  const titleValue = [args.title, args.company].filter(Boolean).join(" · ");
  if (titleValue) {
    pass.secondaryFields.add({ key: "title", label: "Title", value: titleValue });
  }
  if (args.phone) {
    pass.secondaryFields.add({ key: "phone", label: "Phone", value: args.phone });
  }

  // auxiliary: email
  if (args.email) {
    pass.auxiliaryFields.add({ key: "email", label: "Email", value: args.email });
  }

  // back: website + branding line. Multiple lines = multiple back fields.
  if (args.website) {
    pass.backFields.add({ key: "website", label: "Website", value: args.website });
  }
  pass.backFields.add({
    key: "powered_by",
    label: "Powered by",
    value: "OpSolid · opsolid.de",
  });

  // Barcode: legacy `barcode` (iOS < 9) + new `barcodes` array (iOS 9+).
  // iso-8859-1 is what Apple's docs recommend for QR text payloads.
  pass.barcodes = [
    {
      format: "PKBarcodeFormatQR",
      message: args.cardUrl,
      messageEncoding: "iso-8859-1",
    },
  ];

  // Required icon images (placeholder — see file header for context).
  await pass.images.add("icon", TINY_PNG, "1x");
  await pass.images.add("icon", TINY_PNG, "2x");

  // -------------------------------------------------------------------------
  // Serialize. asBuffer() validates the pass internally (throws on missing
  // required fields or invalid cert chain) before producing the zip.
  // -------------------------------------------------------------------------
  return pass.asBuffer();
}
