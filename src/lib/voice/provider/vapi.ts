// VapiProvider — placeholder skeleton; only webhook signature verification is wired up.

import { timingSafeEqual } from "node:crypto";
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

const NOT_IMPLEMENTED =
  "VapiProvider: not implemented in this release. Enable when VAPI_API_KEY and @vapi-ai/server-sdk are configured.";

export class VapiProvider implements VoiceProvider {
  readonly name: ProviderName = "vapi";
  // apiKey retained for future SDK construction; intentionally unused for now.
  // Keeping it on the instance documents the contract: provider is constructed
  // with an API key even though no methods consume it yet.
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("VapiProvider: apiKey is required");
    }
    this.apiKey = apiKey;
  }

  // Read-only accessor so `apiKey` is not flagged as unused by strict tooling.
  protected getApiKey(): string {
    return this.apiKey;
  }

  // -------------------------------------------------------------------------
  // Agent CRUD — all stubbed.
  // -------------------------------------------------------------------------

  async createAgent(_input: CreateAgentInput): Promise<CreateAgentResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async updateAgent(_input: UpdateAgentInput): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async deleteAgent(_providerId: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getAgent(_providerId: string): Promise<Record<string, unknown>> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // -------------------------------------------------------------------------
  // Phone numbers
  // -------------------------------------------------------------------------

  async importPhoneNumber(
    _input: ImportPhoneNumberInput,
  ): Promise<ImportPhoneNumberResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async releasePhoneNumber(_providerPhoneId: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async listPhoneNumbers(): Promise<ImportPhoneNumberResult[]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // -------------------------------------------------------------------------
  // Calls
  // -------------------------------------------------------------------------

  async getCall(_providerCallId: string): Promise<CallSummary> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async initiateTestCall(
    _input: InitiateTestCallInput,
  ): Promise<InitiateTestCallResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // -------------------------------------------------------------------------
  // Voices
  // -------------------------------------------------------------------------

  async listVoices(_language?: string): Promise<ListVoicesResult[]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // -------------------------------------------------------------------------
  // Webhooks — partially implemented so the inbound webhook surface can run
  // even before the full provider is online.
  // -------------------------------------------------------------------------

  /**
   * Vapi sends a shared secret in `x-vapi-secret`. We compare it against
   * the VAPI_WEBHOOK_SECRET env var with timingSafeEqual so length/byte
   * timing leaks aren't useful to an attacker.
   *
   * The rawBody parameter is intentionally unused — Vapi does not (yet)
   * sign the body; if/when they do, swap to HMAC verification here.
   */
  verifyWebhookSignature(
    _rawBody: string,
    headers: Record<string, string>,
  ): boolean {
    const secret = process.env.VAPI_WEBHOOK_SECRET;
    if (!secret) return false;

    const provided =
      headers["x-vapi-secret"] ?? headers["X-Vapi-Secret"] ?? "";
    if (!provided) return false;

    const a = Buffer.from(secret, "utf8");
    const b = Buffer.from(provided, "utf8");
    if (a.length !== b.length) return false;

    try {
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  parseWebhookEvent(_rawBody: string): ParsedWebhookEvent {
    throw new Error("VapiProvider: parseWebhookEvent not implemented");
  }
}
