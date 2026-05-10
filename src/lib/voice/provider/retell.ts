// RetellProvider — concrete VoiceProvider backed by the official retell-sdk client.

import { createHmac, timingSafeEqual } from "node:crypto";
import Retell from "retell-sdk";
import type {
  CallSummary,
  CallStatus,
  CallDirection,
  CreateAgentInput,
  CreateAgentResult,
  ImportPhoneNumberInput,
  ImportPhoneNumberResult,
  InitiateTestCallInput,
  InitiateTestCallResult,
  ListVoicesResult,
  ParsedWebhookEvent,
  ProviderName,
  TranscriptRole,
  TranscriptSegment,
  UpdateAgentInput,
  VoiceProvider,
} from "./types";

// ---------------------------------------------------------------------------
// Language map: our internal codes → Retell's BCP-47 expectations.
// ---------------------------------------------------------------------------

const LANG_MAP: Record<string, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-US",
  multilingual: "multi",
};

function mapLanguage(code: string): string {
  return LANG_MAP[code] ?? code;
}

// ---------------------------------------------------------------------------
// Retell ambient_sound enum — our boolean toggle picks a sensible default.
// ---------------------------------------------------------------------------

type RetellAmbient =
  | "coffee-shop"
  | "convention-hall"
  | "summer-outdoor"
  | "mountain-outdoor"
  | "static-noise"
  | "call-center"
  | null;

function pickAmbient(enabled: boolean): RetellAmbient {
  return enabled ? "call-center" : null;
}

// ---------------------------------------------------------------------------
// Retell call_status → our normalized CallStatus.
// ---------------------------------------------------------------------------

function mapCallStatus(status: string | undefined): CallStatus {
  switch (status) {
    case "registered":
      return "ringing";
    case "ongoing":
      return "in_progress";
    case "ended":
      return "ended";
    case "error":
      return "failed";
    case "not_connected":
      return "no_answer";
    default:
      return "ended";
  }
}

// Retell disconnection_reason → derived call status (overrides on terminal).
function deriveTerminalStatus(reason: string | undefined): CallStatus | null {
  if (!reason) return null;
  switch (reason) {
    case "dial_busy":
      return "busy";
    case "dial_no_answer":
    case "registered_call_timeout":
      return "no_answer";
    case "dial_failed":
    case "invalid_destination":
    case "telephony_provider_unavailable":
    case "telephony_provider_permission_denied":
    case "sip_routing_error":
    case "marked_as_spam":
      return "failed";
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Hardcoded curated voice catalog. We only call list APIs for diagnostics.
// ---------------------------------------------------------------------------

const CURATED_VOICES: ListVoicesResult[] = [
  // German
  { id: "11labs-Anna", name: "Anna (DE)", language: "de-DE", gender: "female", previewUrl: null, provider: "retell" },
  { id: "11labs-Hans", name: "Hans (DE)", language: "de-DE", gender: "male", previewUrl: null, provider: "retell" },
  { id: "11labs-Klara", name: "Klara (DE)", language: "de-DE", gender: "female", previewUrl: null, provider: "retell" },
  // Turkish
  { id: "11labs-Ayse", name: "Ayse (TR)", language: "tr-TR", gender: "female", previewUrl: null, provider: "retell" },
  { id: "11labs-Mehmet", name: "Mehmet (TR)", language: "tr-TR", gender: "male", previewUrl: null, provider: "retell" },
  // English
  { id: "11labs-Adrian", name: "Adrian (EN)", language: "en-US", gender: "male", previewUrl: null, provider: "retell" },
  { id: "11labs-Cimo", name: "Cimo (EN)", language: "en-US", gender: "neutral", previewUrl: null, provider: "retell" },
  { id: "11labs-Lily", name: "Lily (EN)", language: "en-US", gender: "female", previewUrl: null, provider: "retell" },
];

// ---------------------------------------------------------------------------
// Helper: convert APIPromise / fetch errors into descriptive Error.
// ---------------------------------------------------------------------------

function wrapErr(op: string, err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  return new Error(`RetellProvider.${op} failed: ${msg}`);
}

// ---------------------------------------------------------------------------
// RetellProvider implementation.
// ---------------------------------------------------------------------------

export class RetellProvider implements VoiceProvider {
  readonly name: ProviderName = "retell";
  private readonly apiKey: string;
  private readonly client: Retell;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("RetellProvider: apiKey is required");
    }
    this.apiKey = apiKey;
    this.client = new Retell({ apiKey });
  }

  // -------------------------------------------------------------------------
  // Agent CRUD
  // -------------------------------------------------------------------------

  async createAgent(input: CreateAgentInput): Promise<CreateAgentResult> {
    try {
      // Retell requires a response_engine — for managed prompts, we attach a
      // Retell LLM with the system prompt baked in. Caller can override via
      // providerOverrides.response_engine.
      const llm = await this.client.llm.create({
        general_prompt: input.systemPrompt,
        model: (input.llmModel ?? "gpt-5.4-mini") as never,
      });

      const overrides = input.providerOverrides as Record<string, unknown>;
      const response = await this.client.agent.create({
        response_engine: {
          type: "retell-llm",
          llm_id: llm.llm_id,
        } as never,
        voice_id: input.voiceId,
        agent_name: input.name,
        language: mapLanguage(input.language) as never,
        max_call_duration_ms: Math.max(60_000, input.maxDurationSeconds * 1000),
        interruption_sensitivity: input.interruptionSensitivity,
        responsiveness: clamp01(1 - input.responseDelayMs / 2000),
        ambient_sound: pickAmbient(input.ambientSoundEnabled),
        end_call_after_silence_ms: 30_000,
        ...overrides,
      });

      return {
        providerId: response.agent_id,
        providerName: "retell",
        raw: response as unknown as Record<string, unknown>,
      };
    } catch (err) {
      throw wrapErr("createAgent", err);
    }
  }

  async updateAgent(input: UpdateAgentInput): Promise<void> {
    try {
      // Retell stores the system prompt on the LLM record (response_engine.
      // llm_id), NOT on the agent. agent.update silently drops any
      // general_prompt key, which is why earlier updates appeared to succeed
      // but the prompt in Retell stayed pinned to the version from the
      // original create call. To actually push prompt changes we must:
      //   1. retrieve the agent to learn its llm_id
      //   2. call llm.update with the new general_prompt
      // before issuing the agent.update for everything else.
      if (input.systemPrompt !== undefined || input.llmModel !== undefined) {
        const agent = await this.client.agent.retrieve(input.providerId);
        const engine = (agent as { response_engine?: unknown }).response_engine as
          | { type?: string; llm_id?: string }
          | undefined;
        if (engine?.type === "retell-llm" && engine.llm_id) {
          const llmPatch: Record<string, unknown> = {};
          if (input.systemPrompt !== undefined) {
            llmPatch.general_prompt = input.systemPrompt;
          }
          if (input.llmModel !== undefined) {
            llmPatch.model = input.llmModel;
          }
          if (Object.keys(llmPatch).length > 0) {
            await this.client.llm.update(engine.llm_id, llmPatch as never);
          }
        }
      }

      const params: Record<string, unknown> = {};
      if (input.name !== undefined) params.agent_name = input.name;
      if (input.voiceId !== undefined) params.voice_id = input.voiceId;
      if (input.language !== undefined) {
        params.language = mapLanguage(input.language);
      }
      if (input.maxDurationSeconds !== undefined) {
        params.max_call_duration_ms = Math.max(
          60_000,
          input.maxDurationSeconds * 1000,
        );
      }
      if (input.interruptionSensitivity !== undefined) {
        params.interruption_sensitivity = input.interruptionSensitivity;
      }
      if (input.responseDelayMs !== undefined) {
        params.responsiveness = clamp01(1 - input.responseDelayMs / 2000);
      }
      if (input.ambientSoundEnabled !== undefined) {
        params.ambient_sound = pickAmbient(input.ambientSoundEnabled);
      }
      if (input.providerOverrides) {
        Object.assign(params, input.providerOverrides);
      }

      await this.client.agent.update(input.providerId, params as never);
    } catch (err) {
      throw wrapErr("updateAgent", err);
    }
  }

  async deleteAgent(providerId: string): Promise<void> {
    try {
      await this.client.agent.delete(providerId);
    } catch (err) {
      throw wrapErr("deleteAgent", err);
    }
  }

  async getAgent(providerId: string): Promise<Record<string, unknown>> {
    try {
      const res = await this.client.agent.retrieve(providerId);
      return res as unknown as Record<string, unknown>;
    } catch (err) {
      throw wrapErr("getAgent", err);
    }
  }

  // -------------------------------------------------------------------------
  // Phone-number management
  // -------------------------------------------------------------------------

  async importPhoneNumber(
    input: ImportPhoneNumberInput,
  ): Promise<ImportPhoneNumberResult> {
    try {
      const res = await this.client.phoneNumber.import({
        phone_number: input.e164Number,
        // termination_uri is required by SDK type; for retell-managed numbers
        // (twilio/telnyx import) the field is informational only.
        termination_uri: "sip.example.com",
        inbound_agents: [{ agent_id: input.agentProviderId, weight: 1 }],
        inbound_webhook_url: input.webhookUrl,
        nickname: input.label,
      });

      return {
        providerPhoneId: res.phone_number,
        e164Number: res.phone_number,
        raw: res as unknown as Record<string, unknown>,
      };
    } catch (err) {
      throw wrapErr("importPhoneNumber", err);
    }
  }

  async releasePhoneNumber(providerPhoneId: string): Promise<void> {
    try {
      await this.client.phoneNumber.delete(providerPhoneId);
    } catch (err) {
      throw wrapErr("releasePhoneNumber", err);
    }
  }

  async listPhoneNumbers(): Promise<ImportPhoneNumberResult[]> {
    try {
      const res = await this.client.phoneNumber.list();
      return res.map((n) => ({
        providerPhoneId: n.phone_number,
        e164Number: n.phone_number,
        raw: n as unknown as Record<string, unknown>,
      }));
    } catch (err) {
      throw wrapErr("listPhoneNumbers", err);
    }
  }

  // -------------------------------------------------------------------------
  // Calls
  // -------------------------------------------------------------------------

  async getCall(providerCallId: string): Promise<CallSummary> {
    try {
      const res = await this.client.call.retrieve(providerCallId);
      return mapCallSummary(res as unknown as Record<string, unknown>);
    } catch (err) {
      throw wrapErr("getCall", err);
    }
  }

  async initiateTestCall(
    input: InitiateTestCallInput,
  ): Promise<InitiateTestCallResult> {
    try {
      // Caller must own a from_number tied to the agent. We expose the agent
      // via override_agent_id; from_number must be supplied by the caller in
      // metadata.fromNumber (Retell SDK requires it).
      const fromNumber =
        (input.metadata?.fromNumber as string | undefined) ??
        (input.metadata?.from_number as string | undefined);
      if (!fromNumber) {
        throw new Error(
          "metadata.fromNumber is required for Retell test calls",
        );
      }

      const res = await this.client.call.createPhoneCall({
        from_number: fromNumber,
        to_number: input.toNumber,
        override_agent_id: input.agentProviderId,
        metadata: input.metadata,
      });

      return {
        providerCallId: res.call_id,
        status: res.call_status ?? "registered",
        raw: res as unknown as Record<string, unknown>,
      };
    } catch (err) {
      throw wrapErr("initiateTestCall", err);
    }
  }

  // -------------------------------------------------------------------------
  // Voices
  // -------------------------------------------------------------------------

  async listVoices(language?: string): Promise<ListVoicesResult[]> {
    try {
      // Try the live SDK first; fall back to curated list if it fails.
      const res = await this.client.voice.list().catch(() => null);
      if (res && Array.isArray(res) && res.length > 0) {
        const mapped = res.map<ListVoicesResult>((v) => ({
          id: (v as { voice_id?: string }).voice_id ?? "",
          name: (v as { voice_name?: string }).voice_name ?? "Unnamed",
          language:
            ((v as { language?: string }).language as string | undefined) ??
            "en-US",
          gender: normalizeGender((v as { gender?: string }).gender),
          previewUrl:
            ((v as { preview_audio_url?: string }).preview_audio_url as
              | string
              | undefined) ?? null,
          provider: "retell",
        }));
        return language
          ? mapped.filter((v) => v.language.startsWith(language))
          : mapped;
      }
    } catch {
      // fall through to curated list
    }

    if (!language) return CURATED_VOICES;
    const target = mapLanguage(language);
    return CURATED_VOICES.filter((v) =>
      target === "multi" ? true : v.language.startsWith(target.slice(0, 2)),
    );
  }

  // -------------------------------------------------------------------------
  // Webhooks
  // -------------------------------------------------------------------------

  /**
   * Verify Retell webhook signature.
   *
   * Retell's signature format is `v=<unix_ms>,d=<hex_digest>` where the digest
   * is `HMAC-SHA256(apiKey, rawBody + unix_ms)` hex-encoded. The provider also
   * enforces a 5-minute replay window. This mirrors the official retell-sdk
   * `verify()` helper exactly, but stays synchronous so the route handler does
   * not need to await it.
   */
  verifyWebhookSignature(
    rawBody: string,
    headers: Record<string, string>,
  ): boolean {
    const provided =
      headers["x-retell-signature"] ?? headers["X-Retell-Signature"];
    if (!provided) return false;

    const match = /^v=(\d+),d=(.+)$/.exec(provided.trim());
    if (!match) return false;

    const timestamp = Number(match[1]);
    const digest = match[2];
    if (!Number.isFinite(timestamp) || !digest) return false;

    const FIVE_MINUTES = 5 * 60 * 1000;
    if (Math.abs(Date.now() - timestamp) > FIVE_MINUTES) return false;

    const expected = createHmac("sha256", this.apiKey)
      .update(rawBody + String(timestamp), "utf8")
      .digest("hex");

    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(digest, "utf8");
    if (a.length !== b.length) return false;

    try {
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  parseWebhookEvent(rawBody: string): ParsedWebhookEvent {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawBody) as Record<string, unknown>;
    } catch (err) {
      throw new Error(
        `RetellProvider.parseWebhookEvent: invalid JSON body — ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    const eventName =
      (parsed.event as string | undefined) ??
      (parsed.event_type as string | undefined) ??
      "unknown";
    const callObj = (parsed.call as Record<string, unknown> | undefined) ?? {};
    const callId =
      (callObj.call_id as string | undefined) ??
      (parsed.call_id as string | undefined) ??
      "";

    let type: ParsedWebhookEvent["type"];
    switch (eventName) {
      case "call_started":
        type = "call_started";
        break;
      case "call_ended":
      case "call_analyzed":
        // Retell fires `call_analyzed` after post-call analysis is complete.
        // We treat it as the same logical "call_ended" for our pipeline.
        type = "call_ended";
        break;
      case "transcript":
      case "transcript_updated":
        type = "transcript_updated";
        break;
      case "recording":
      case "recording_ready":
        type = "recording_ready";
        break;
      case "error":
        type = "error";
        break;
      default:
        type = "transcript_updated";
    }

    const partial =
      Object.keys(callObj).length > 0
        ? mapCallSummaryPartial(callObj)
        : undefined;

    return {
      type,
      providerCallId: callId,
      occurredAt: new Date(),
      partial,
      errorMessage:
        type === "error"
          ? (parsed.error_message as string | undefined) ?? "Unknown error"
          : undefined,
      raw: parsed,
    };
  }
}

// ---------------------------------------------------------------------------
// Internal helpers — Retell call object → our CallSummary shape.
// ---------------------------------------------------------------------------

function mapCallSummary(raw: Record<string, unknown>): CallSummary {
  const partial = mapCallSummaryPartial(raw);
  return {
    providerId: partial.providerId ?? "",
    providerName: "retell",
    direction: partial.direction ?? "inbound",
    fromNumber: partial.fromNumber ?? "",
    toNumber: partial.toNumber ?? "",
    startedAt: partial.startedAt ?? null,
    endedAt: partial.endedAt ?? null,
    durationSeconds: partial.durationSeconds ?? null,
    status: partial.status ?? "ended",
    endReason: partial.endReason ?? null,
    recordingUrl: partial.recordingUrl ?? null,
    transcriptSegments: partial.transcriptSegments ?? [],
    transcriptText: partial.transcriptText ?? null,
    sentiment: partial.sentiment ?? null,
    detectedLanguage: partial.detectedLanguage ?? null,
    customAnalysisFields: partial.customAnalysisFields ?? {},
    costUnits: partial.costUnits ?? null,
  };
}

function mapCallSummaryPartial(
  raw: Record<string, unknown>,
): Partial<CallSummary> {
  const out: Partial<CallSummary> = {
    providerId: (raw.call_id as string | undefined) ?? undefined,
    providerName: "retell",
  };

  if (typeof raw.direction === "string") {
    out.direction = raw.direction as CallDirection;
  }
  if (typeof raw.from_number === "string") out.fromNumber = raw.from_number;
  if (typeof raw.to_number === "string") out.toNumber = raw.to_number;

  if (typeof raw.start_timestamp === "number") {
    out.startedAt = new Date(raw.start_timestamp);
  }
  if (typeof raw.end_timestamp === "number") {
    out.endedAt = new Date(raw.end_timestamp);
  }

  if (typeof raw.duration_ms === "number") {
    out.durationSeconds = Math.round(raw.duration_ms / 1000);
  }

  out.status = mapCallStatus(raw.call_status as string | undefined);
  const terminal = deriveTerminalStatus(
    raw.disconnection_reason as string | undefined,
  );
  if (terminal) out.status = terminal;
  out.endReason = (raw.disconnection_reason as string | undefined) ?? null;

  if (typeof raw.recording_url === "string") {
    out.recordingUrl = raw.recording_url;
  } else if (typeof raw.scrubbed_recording_url === "string") {
    out.recordingUrl = raw.scrubbed_recording_url;
  }

  // Transcript
  const transcriptObj = raw.transcript_object as
    | Array<Record<string, unknown>>
    | undefined;
  if (Array.isArray(transcriptObj)) {
    out.transcriptSegments = transcriptObj
      .map((u) => mapUtterance(u))
      .filter((u): u is TranscriptSegment => u !== null);
  }
  if (typeof raw.transcript === "string") {
    out.transcriptText = raw.transcript;
  } else if (out.transcriptSegments && out.transcriptSegments.length > 0) {
    out.transcriptText = out.transcriptSegments
      .map((s) => `${s.role}: ${s.content}`)
      .join("\n");
  }

  // Analysis
  const analysis = raw.call_analysis as Record<string, unknown> | undefined;
  if (analysis) {
    if (typeof analysis.user_sentiment === "string") {
      out.sentiment = (analysis.user_sentiment as string).toLowerCase();
    }
    if (typeof analysis.call_summary === "string") {
      // store summary alongside analysis fields so processing can use it
      out.customAnalysisFields = {
        summary: analysis.call_summary,
        callSuccessful: analysis.call_successful,
        ...(analysis.custom_analysis_data as Record<string, unknown>),
      };
    } else {
      out.customAnalysisFields =
        (analysis.custom_analysis_data as Record<string, unknown>) ?? {};
    }
  }

  // Cost — Retell reports cents in combined_cost.
  const cost = raw.call_cost as Record<string, unknown> | undefined;
  if (cost && typeof cost.combined_cost === "number") {
    out.costUnits = Math.round(cost.combined_cost);
  }

  // Language detection — not always present; check metadata.
  if (typeof raw.language === "string") {
    out.detectedLanguage = raw.language as string;
  }

  return out;
}

function mapUtterance(u: Record<string, unknown>): TranscriptSegment | null {
  const role = u.role as string | undefined;
  const content = u.content as string | undefined;
  if (!role || !content) return null;

  const words = u.words as Array<Record<string, unknown>> | undefined;
  let startMs = 0;
  let endMs = 0;
  if (Array.isArray(words) && words.length > 0) {
    const first = words[0];
    const last = words[words.length - 1];
    if (typeof first.start === "number") startMs = Math.round(first.start * 1000);
    if (typeof last.end === "number") endMs = Math.round(last.end * 1000);
  }

  const normalizedRole: TranscriptRole =
    role === "agent" || role === "assistant"
      ? "agent"
      : role === "user"
        ? "user"
        : "system";

  return { role: normalizedRole, content, startMs, endMs };
}

function normalizeGender(g: string | undefined): "female" | "male" | "neutral" {
  if (!g) return "neutral";
  const lower = g.toLowerCase();
  if (lower.startsWith("f") || lower === "female") return "female";
  if (lower.startsWith("m") || lower === "male") return "male";
  return "neutral";
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 1;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}
