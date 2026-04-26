// Voice Agent feature flags — env-overridable defaults plus per-tenant overrides.

import { prisma } from "@/lib/prisma";

const VOICE_FLAGS = {
  VOICE_AGENT_ENABLED: false,
  VOICE_RETELL_PROVIDER: false,
  VOICE_VAPI_PROVIDER: false,
  VOICE_RECORDINGS_ENABLED: false,
  VOICE_ANALYTICS_ENABLED: true,
  VOICE_MULTILINGUAL_ENABLED: true,
  VOICE_APPOINTMENT_BOOKING: false,
  VOICE_ORDER_FLOW: false,
  VOICE_GDPR_AUTO_DELETE: true,
  VOICE_TEST_CALL_ENABLED: true,
  VOICE_BUSY_HOUR_DETECTION: false,
  VOICE_KUTASIA_MODULE: false,
} as const;

export type VoiceFlag = keyof typeof VOICE_FLAGS;
export const VOICE_FLAG_KEYS = Object.keys(VOICE_FLAGS) as VoiceFlag[];

function parseEnvBool(raw: string | undefined): boolean | null {
  if (raw === undefined) return null;
  const t = raw.trim().toLowerCase();
  if (t === "1" || t === "true" || t === "yes" || t === "on") return true;
  if (t === "0" || t === "false" || t === "no" || t === "off") return false;
  return null;
}

/**
 * Process-wide flag check. Reads `process.env[FLAG_NAME]` first; falls back
 * to the static default.
 */
export function isEnabled(flag: VoiceFlag): boolean {
  const fromEnv = parseEnvBool(process.env[flag]);
  if (fromEnv !== null) return fromEnv;
  return VOICE_FLAGS[flag];
}

/**
 * Tenant-aware flag check. Order of precedence:
 *   1. process.env[FLAG_NAME] — operator override across all tenants
 *   2. tenant.featureFlags[FLAG_NAME] — per-tenant override
 *   3. static default
 *
 * Async because we hit Prisma. For a synchronous variant when the caller
 * already has the tenant flags object, see {@link isTenantEnabledSync}.
 */
export async function isTenantEnabled(
  flag: VoiceFlag,
  tenantId: string,
): Promise<boolean> {
  const envOverride = parseEnvBool(process.env[flag]);
  if (envOverride !== null) return envOverride;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { id: tenantId },
    select: { featureFlags: true },
  });

  const flags = (tenant?.featureFlags ?? {}) as Record<string, unknown>;
  if (typeof flags[flag] === "boolean") return flags[flag] as boolean;

  return VOICE_FLAGS[flag];
}

/**
 * Synchronous variant — use when the tenant.featureFlags JSON is already
 * loaded (e.g. inside a request handler that already fetched the tenant).
 *
 * Tenant override wins over env override here because the caller has
 * presumably already merged operator policies, and we want sync calls to
 * be deterministic from their inputs.
 */
export function isTenantEnabledSync(
  flag: VoiceFlag,
  tenantFlags: Record<string, boolean>,
): boolean {
  if (typeof tenantFlags[flag] === "boolean") return tenantFlags[flag];
  const fromEnv = parseEnvBool(process.env[flag]);
  if (fromEnv !== null) return fromEnv;
  return VOICE_FLAGS[flag];
}

export function getDefault(flag: VoiceFlag): boolean {
  return VOICE_FLAGS[flag];
}
