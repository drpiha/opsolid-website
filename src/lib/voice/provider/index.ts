// Provider singleton selector — picks Retell, Vapi, or Mock based on env.
//
// DESIGN DECISION (2026-05-12): OpSolid commits to **Retell** as the production
// voice provider. The VoiceProvider interface stays for the existing wiring +
// MockProvider dev fallback, but new features should call Retell-specific code
// directly when Vapi parity isn't useful. Vapi remains a skeleton; bringing it
// to parity is a ~3-4 week effort and only justified if Retell pricing/SLA
// changes materially. Migration-cost lock-in mitigation: own the transcript in
// our DB (VoiceCall.transcriptJson + transcriptText), don't depend on Retell's
// transcript retention. See plan: opsolid-voice-agent-customer-self-service.md
// (B5).

import type { VoiceProvider } from "./types";
import { RetellProvider } from "./retell";
import { VapiProvider } from "./vapi";
import { MockProvider } from "./mock";

export type {
  CallDirection,
  CallStatus,
  CallSummary,
  CreateAgentInput,
  CreateAgentResult,
  ImportPhoneNumberInput,
  ImportPhoneNumberResult,
  InitiateTestCallInput,
  InitiateTestCallResult,
  ListVoicesResult,
  ParsedWebhookEvent,
  ParsedWebhookEventType,
  ProviderName,
  TranscriptRole,
  TranscriptSegment,
  UpdateAgentInput,
  VoiceProvider,
} from "./types";
export { RetellProvider } from "./retell";
export { VapiProvider } from "./vapi";
export { MockProvider } from "./mock";

let _provider: VoiceProvider | null = null;

/**
 * Returns the active VoiceProvider. Picks Retell if RETELL_API_KEY is set,
 * else Vapi if VAPI_API_KEY is set, else falls back to MockProvider in dev.
 *
 * In production with neither key set, this throws — we never silently mock
 * production traffic.
 */
export function getVoiceProvider(): VoiceProvider {
  if (_provider) return _provider;

  const retellKey = process.env.RETELL_API_KEY;
  const vapiKey = process.env.VAPI_API_KEY;

  if (retellKey) {
    _provider = new RetellProvider(retellKey);
    return _provider;
  }
  if (vapiKey) {
    _provider = new VapiProvider(vapiKey);
    return _provider;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "RETELL_API_KEY or VAPI_API_KEY must be set in production",
    );
  }

  console.warn("[voice] No provider API key — using MockProvider");
  _provider = new MockProvider();
  return _provider;
}

/** Reset the cached provider — for tests only. */
export function resetVoiceProvider(): void {
  _provider = null;
}
