// MockProvider — deterministic in-memory provider for development without API keys.

import { randomBytes } from "node:crypto";
import type {
  CallSummary,
  CreateAgentInput,
  CreateAgentResult,
  ImportPhoneNumberInput,
  ImportPhoneNumberResult,
  InitiateTestCallInput,
  InitiateTestCallResult,
  ListVoicesResult,
  ParsedWebhookEvent,
  ProviderName,
  UpdateAgentInput,
  VoiceProvider,
} from "./types";

function rid(prefix: string): string {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

const MOCK_VOICES: ListVoicesResult[] = [
  { id: "mock-anna-de", name: "Anna (DE)", language: "de-DE", gender: "female", previewUrl: null, provider: "mock" },
  { id: "mock-hans-de", name: "Hans (DE)", language: "de-DE", gender: "male", previewUrl: null, provider: "mock" },
  { id: "mock-ayse-tr", name: "Ayse (TR)", language: "tr-TR", gender: "female", previewUrl: null, provider: "mock" },
  { id: "mock-mehmet-tr", name: "Mehmet (TR)", language: "tr-TR", gender: "male", previewUrl: null, provider: "mock" },
  { id: "mock-lily-en", name: "Lily (EN)", language: "en-US", gender: "female", previewUrl: null, provider: "mock" },
  { id: "mock-adrian-en", name: "Adrian (EN)", language: "en-US", gender: "male", previewUrl: null, provider: "mock" },
];

export class MockProvider implements VoiceProvider {
  readonly name: ProviderName = "mock";

  async createAgent(input: CreateAgentInput): Promise<CreateAgentResult> {
    const providerId = rid("mock-agent");
    console.warn(
      `[mock-provider] createAgent name="${input.name}" voiceId="${input.voiceId}" → ${providerId}`,
    );
    return {
      providerId,
      providerName: "mock",
      raw: { agent_id: providerId, name: input.name, voiceId: input.voiceId },
    };
  }

  async updateAgent(input: UpdateAgentInput): Promise<void> {
    console.warn(`[mock-provider] updateAgent ${input.providerId}`);
  }

  async deleteAgent(providerId: string): Promise<void> {
    console.warn(`[mock-provider] deleteAgent ${providerId}`);
  }

  async getAgent(providerId: string): Promise<Record<string, unknown>> {
    return {
      agent_id: providerId,
      voice_id: "mock-anna-de",
      language: "de-DE",
      max_call_duration_ms: 600_000,
    };
  }

  async importPhoneNumber(
    input: ImportPhoneNumberInput,
  ): Promise<ImportPhoneNumberResult> {
    return {
      providerPhoneId: rid("mock-phone"),
      e164Number: input.e164Number,
      raw: {
        phone_number: input.e164Number,
        nickname: input.label ?? null,
        agent_id: input.agentProviderId,
      },
    };
  }

  async releasePhoneNumber(providerPhoneId: string): Promise<void> {
    console.warn(`[mock-provider] releasePhoneNumber ${providerPhoneId}`);
  }

  async listPhoneNumbers(): Promise<ImportPhoneNumberResult[]> {
    return [
      {
        providerPhoneId: "mock-phone-001",
        e164Number: "+493012345678",
        raw: { phone_number: "+493012345678", nickname: "Demo Berlin" },
      },
    ];
  }

  async getCall(providerCallId: string): Promise<CallSummary> {
    const start = new Date(Date.now() - 4 * 60_000);
    const end = new Date(Date.now() - 30_000);
    const segments = [
      { role: "agent" as const, content: "Guten Tag, hier ist die digitale Assistenz von Bistro Demo. Wie kann ich helfen?", startMs: 0, endMs: 4500 },
      { role: "user" as const, content: "Hallo, I would like to book a table for two for tomorrow at 7 pm.", startMs: 4800, endMs: 9000 },
      { role: "agent" as const, content: "Sehr gerne — ich switche ins Englische. A table for two, tomorrow at 7 pm. May I have your name and phone number please?", startMs: 9300, endMs: 14000 },
      { role: "user" as const, content: "Sure, the name is Müller, and the phone is plus four-nine one-five-one-two-three-four-five-six-seven-eight.", startMs: 14300, endMs: 21000 },
      { role: "agent" as const, content: "Perfect. So that is a reservation for two, tomorrow 7 pm, under the name Müller. We will confirm by email shortly. Have a great day!", startMs: 21300, endMs: 28000 },
    ];

    return {
      providerId: providerCallId,
      providerName: "mock",
      direction: "inbound",
      fromNumber: "+491511234567",
      toNumber: "+493012345678",
      startedAt: start,
      endedAt: end,
      durationSeconds: Math.round((end.getTime() - start.getTime()) / 1000),
      status: "ended",
      endReason: "user_hangup",
      recordingUrl: null,
      transcriptSegments: segments,
      transcriptText: segments.map((s) => `${s.role}: ${s.content}`).join("\n"),
      sentiment: "positive",
      detectedLanguage: "de-DE",
      customAnalysisFields: {
        summary: "Caller switched from German to English; reserved table for 2 tomorrow 19:00 under Müller.",
        callSuccessful: true,
      },
      costUnits: 18,
    };
  }

  async initiateTestCall(
    input: InitiateTestCallInput,
  ): Promise<InitiateTestCallResult> {
    const providerCallId = rid("mock-call");
    console.warn(
      `[mock-provider] initiateTestCall agent=${input.agentProviderId} to=${input.toNumber} → ${providerCallId}`,
    );
    return {
      providerCallId,
      status: "registered",
      raw: { call_id: providerCallId, status: "registered" },
    };
  }

  async listVoices(language?: string): Promise<ListVoicesResult[]> {
    if (!language) return MOCK_VOICES;
    return MOCK_VOICES.filter((v) =>
      v.language.toLowerCase().startsWith(language.toLowerCase()),
    );
  }

  verifyWebhookSignature(
    _rawBody: string,
    _headers: Record<string, string>,
  ): boolean {
    return true;
  }

  parseWebhookEvent(rawBody: string): ParsedWebhookEvent {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      parsed = {};
    }
    const callId =
      (parsed.providerCallId as string | undefined) ??
      (parsed.call_id as string | undefined) ??
      ((parsed.call as Record<string, unknown> | undefined)?.call_id as
        | string
        | undefined) ??
      rid("mock-call");

    const eventName =
      (parsed.event as string | undefined) ??
      (parsed.type as string | undefined) ??
      "call_ended";

    type EventType = ParsedWebhookEvent["type"];
    const allowed: EventType[] = [
      "call_started",
      "call_ended",
      "transcript_updated",
      "recording_ready",
      "error",
    ];
    const type: EventType = (allowed as string[]).includes(eventName)
      ? (eventName as EventType)
      : "call_ended";

    return {
      type,
      providerCallId: callId,
      occurredAt: new Date(),
      raw: parsed,
    };
  }
}
