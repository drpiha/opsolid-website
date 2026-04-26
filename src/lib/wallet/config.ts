// =============================================================================
// Wallet configuration helpers.
//
// Apple/Google Wallet integration is opt-in: the app ships without certs,
// routes return 503 when env is missing, and `<WalletButtons>` renders nothing
// (no broken click target). These helpers are the single source of truth for
// "is the integration configured?" — used by both the API routes and the UI
// gate, so the two can never disagree.
// =============================================================================

/**
 * True only when every Apple Wallet env var required to sign a `.pkpass` is
 * set. We do not validate the cert content here — wrong cert content surfaces
 * as a `WalletNotConfiguredError` thrown from the builder, which the route
 * translates into 503.
 */
export function isAppleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_WALLET_CERT_PEM &&
      process.env.APPLE_WALLET_KEY_PEM &&
      process.env.APPLE_WALLET_WWDR_PEM &&
      process.env.APPLE_WALLET_PASS_TYPE_ID &&
      process.env.APPLE_WALLET_TEAM_ID
  );
}

/**
 * True only when the Google Wallet service-account credentials and issuer are
 * configured. `GOOGLE_WALLET_CLASS_ID` is optional — if missing, the JWT
 * builder embeds an inline `genericClasses` definition.
 */
export function isGoogleWalletConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_WALLET_CREDENTIALS_BASE64 &&
      process.env.GOOGLE_WALLET_ISSUER_ID
  );
}

/**
 * Thrown by the wallet builders when env vars are missing. API routes catch
 * this specifically and return `503 wallet_not_configured`, distinct from
 * generic 5xx errors (which indicate a real bug or signing failure).
 */
export class WalletNotConfiguredError extends Error {
  public readonly provider: "apple" | "google";

  constructor(provider: "apple" | "google") {
    super(`${provider} wallet not configured`);
    this.name = "WalletNotConfiguredError";
    this.provider = provider;
  }
}
