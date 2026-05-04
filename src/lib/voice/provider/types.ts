// Voice provider abstraction — shared types and interface implemented by Retell, Vapi, and Mock.

export type CallDirection = "inbound" | "outbound";

export type CallStatus =
  | "ringing"
  | "in_progress"
  | "ended"
  | "failed"
  | "busy"
  | "no_answer";

export type TranscriptRole = "agent" | "user" | "system";

export type ProviderName = "retell" | "vapi" | "mock";

export type ParsedWebhookEventType =
  | "call_started"
  | "call_ended"
  | "transcript_updated"
  | "recording_ready"
  | "error";

// ---------------------------------------------------------------------------
// Transcript + call data shapes returned to processing pipeline.
// ---------------------------------------------------------------------------

export interface TranscriptSegment {
  role: TranscriptRole;
  content: string;
  startMs: number;
  endMs: number;
  confidence?: number;
}

export interface CallSummary {
  providerId: string;
  providerName: ProviderName;
  direction: CallDirection;
  fromNumber: string;
  toNumber: string;
  startedAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  status: CallStatus;
  endReason: string | null;
  recordingUrl: string | null;
  transcriptSegments: TranscriptSegment[];
  transcriptText: string | null;
  sentiment: string | null;
  detectedLanguage: string | null;
  customAnalysisFields: Record<string, unknown>;
  costUnits: number | null;
}

// ---------------------------------------------------------------------------
// Agent CRUD types.
// ---------------------------------------------------------------------------

export interface CreateAgentInput {
  name: string;
  displayName?: string;
  systemPrompt: string;
  language: string;
  voiceId: string;
  maxDurationSeconds: number;
  ambientSoundEnabled: boolean;
  endCallPhrases: string[];
  dtmfHandoffDigit: string | null;
  responseDelayMs: number;
  interruptionSensitivity: number;
  llmModel?: string;
  providerOverrides: Record<string, unknown>;
}

export interface CreateAgentResult {
  providerId: string;
  providerName: ProviderName;
  raw: Record<string, unknown>;
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  providerId: string;
}

// ---------------------------------------------------------------------------
// Phone-number management.
// ---------------------------------------------------------------------------

export interface ImportPhoneNumberInput {
  e164Number: string;
  agentProviderId: string;
  webhookUrl?: string;
  label?: string;
  friendlyName?: string;
  country?: string;
}

export interface ImportPhoneNumberResult {
  providerPhoneId: string;
  e164Number: string;
  raw: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Test call flow.
// ---------------------------------------------------------------------------

export interface InitiateTestCallInput {
  agentProviderId: string;
  toNumber: string;
  metadata?: Record<string, unknown>;
}

export interface InitiateTestCallResult {
  providerCallId: string;
  status: string;
  raw: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Voice catalog.
// ---------------------------------------------------------------------------

export interface ListVoicesResult {
  id: string;
  name: string;
  language: string;
  gender: "female" | "male" | "neutral";
  previewUrl: string | null;
  provider: ProviderName;
}

// ---------------------------------------------------------------------------
// Webhook events.
// ---------------------------------------------------------------------------

export interface ParsedWebhookEvent {
  type: ParsedWebhookEventType;
  providerCallId: string;
  occurredAt: Date;
  partial?: Partial<CallSummary>;
  errorMessage?: string;
  raw: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Provider interface — every backend (Retell, Vapi, Mock) implements this.
// ---------------------------------------------------------------------------

export interface VoiceProvider {
  readonly name: ProviderName;

  createAgent(input: CreateAgentInput): Promise<CreateAgentResult>;
  updateAgent(input: UpdateAgentInput): Promise<void>;
  deleteAgent(providerId: string): Promise<void>;
  getAgent(providerId: string): Promise<Record<string, unknown>>;

  importPhoneNumber(
    input: ImportPhoneNumberInput,
  ): Promise<ImportPhoneNumberResult>;
  releasePhoneNumber(providerPhoneId: string): Promise<void>;
  listPhoneNumbers(): Promise<ImportPhoneNumberResult[]>;

  getCall(providerCallId: string): Promise<CallSummary>;
  initiateTestCall(
    input: InitiateTestCallInput,
  ): Promise<InitiateTestCallResult>;

  listVoices(language?: string): Promise<ListVoicesResult[]>;

  verifyWebhookSignature(
    rawBody: string,
    headers: Record<string, string>,
  ): boolean;
  parseWebhookEvent(rawBody: string): ParsedWebhookEvent;
}
