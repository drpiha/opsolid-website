// =============================================================================
// Google Wallet — Save-to-Wallet JWT builder for a "Generic" pass.
//
// Returns a signed RS256 JWT that the frontend redirects to as
// `https://pay.google.com/gp/v/save/${jwt}`. Google Wallet validates the JWT
// against the issuer's service-account public key and renders the embedded
// generic object.
//
// Env-gated: throws `WalletNotConfiguredError` when service-account creds or
// issuer ID are missing. The route returns 503 in that case.
//
// Class strategy:
//   - If `GOOGLE_WALLET_CLASS_ID` is set, we reference it via `classId` and
//     do not embed a class definition (the operator already provisioned the
//     class via the Wallet API).
//   - Otherwise, we embed an inline `genericClasses` object so the pass works
//     without prior provisioning. Google upserts the class on first use.
// =============================================================================

import { SignJWT, importPKCS8 } from "jose";
import { WalletNotConfiguredError, isGoogleWalletConfigured } from "./config";

export interface BuildGoogleWalletJwtArgs {
  slug: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  primaryHex?: string | null;
  /** QR target — the card's canonical public URL. */
  cardUrl: string;
}

const DEFAULT_BG_HEX = "#15120F";

interface ServiceAccountCreds {
  client_email: string;
  private_key: string;
}

/**
 * Decode the base64-encoded service-account JSON. We use base64 (not raw
 * JSON) in env vars so multi-line PEM newlines survive without escaping
 * games — `JSON.parse` after base64 decode preserves the `\n` sequences in
 * the private_key field that the Google service-account JSON ships with.
 */
function loadServiceAccount(): ServiceAccountCreds {
  const b64 = process.env.GOOGLE_WALLET_CREDENTIALS_BASE64;
  if (!b64) throw new WalletNotConfiguredError("google");
  let json: unknown;
  try {
    const decoded = Buffer.from(b64, "base64").toString("utf-8");
    json = JSON.parse(decoded);
  } catch {
    throw new Error(
      "Invalid GOOGLE_WALLET_CREDENTIALS_BASE64 — expected base64-encoded JSON"
    );
  }
  if (
    !json ||
    typeof json !== "object" ||
    typeof (json as Record<string, unknown>).client_email !== "string" ||
    typeof (json as Record<string, unknown>).private_key !== "string"
  ) {
    throw new Error(
      "GOOGLE_WALLET_CREDENTIALS_BASE64 missing client_email or private_key"
    );
  }
  return json as ServiceAccountCreds;
}

/** Defensive: the Google JSON often has literal `\n` in the PEM. Normalize. */
function normalizePrivateKey(key: string): string {
  return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

/** Trim & validate a hex color, falling back to the default. */
function safeHex(hex: string | null | undefined, fallback = DEFAULT_BG_HEX): string {
  const candidate = (hex ?? fallback).trim();
  return /^#[0-9a-fA-F]{6}$/.test(candidate) ? candidate : fallback;
}

/**
 * Build the signed Save-to-Wallet JWT. Caller redirects to
 * `https://pay.google.com/gp/v/save/${jwt}`.
 */
export async function buildGoogleWalletJwt(
  args: BuildGoogleWalletJwtArgs
): Promise<string> {
  if (!isGoogleWalletConfigured()) {
    throw new WalletNotConfiguredError("google");
  }

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const explicitClassId = process.env.GOOGLE_WALLET_CLASS_ID;
  const classId = explicitClassId || `${issuerId}.opsolid_smart_card`;
  const objectId = `${issuerId}.${args.slug}`;
  const hexBackgroundColor = safeHex(args.primaryHex);

  const creds = loadServiceAccount();
  const privateKeyPem = normalizePrivateKey(creds.private_key);

  // -------------------------------------------------------------------------
  // Generic object — what the user actually sees in their wallet.
  // -------------------------------------------------------------------------
  const titleLine = [args.title, args.company].filter(Boolean).join(" · ");
  const subheaderText = titleLine || "Smart Card";

  const textModulesData: Array<{ id: string; header: string; body: string }> = [];
  if (args.phone) textModulesData.push({ id: "phone", header: "Phone", body: args.phone });
  if (args.email) textModulesData.push({ id: "email", header: "Email", body: args.email });
  if (args.website) textModulesData.push({ id: "website", header: "Website", body: args.website });

  const genericObject = {
    id: objectId,
    classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor,
    cardTitle: {
      defaultValue: { language: "en-US", value: "OpSolid · Smart Card" },
    },
    header: {
      defaultValue: { language: "en-US", value: args.name },
    },
    subheader: {
      defaultValue: { language: "en-US", value: subheaderText },
    },
    barcode: {
      type: "QR_CODE",
      value: args.cardUrl,
      alternateText: args.cardUrl,
    },
    textModulesData,
  };

  // -------------------------------------------------------------------------
  // Inline class definition — only when an explicit class wasn't pre-provisioned.
  // Embedding the class makes first-time setup zero-touch; once the operator
  // pre-creates a class via Wallet API, set GOOGLE_WALLET_CLASS_ID to skip this.
  // -------------------------------------------------------------------------
  const genericClasses = explicitClassId
    ? undefined
    : [
        {
          id: classId,
          multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
        },
      ];

  // -------------------------------------------------------------------------
  // JWT claims — Google Wallet's specific format. Note `typ: "savetowallet"`
  // and the custom `payload` claim wrapping the wallet objects.
  // -------------------------------------------------------------------------
  const claims: Record<string, unknown> = {
    typ: "savetowallet",
    payload: {
      genericObjects: [genericObject],
      ...(genericClasses ? { genericClasses } : {}),
    },
  };

  // jose's importPKCS8 handles the standard PEM-encoded RSA private key that
  // Google service-account JSON ships with. RS256 is what Google requires.
  const privateKey = await importPKCS8(privateKeyPem, "RS256");

  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(creds.client_email)
    .setAudience("google")
    .setIssuedAt()
    .sign(privateKey);

  return jwt;
}
