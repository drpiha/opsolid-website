// =============================================================================
// Anthropic Claude helper for the inbox AI layer.
//
// Same posture as src/app/api/v1/cards/draft-from-url/route.ts — no SDK,
// just a thin fetch wrapper. Two tiers:
//   - "haiku"  (cheap, fast)   for summary / sentiment / intent at high volume
//   - "sonnet" (mid, accurate) for reply drafting and structured extraction
//
// JSON-mode completion uses a strict prompt envelope: we tell Claude to
// answer with exactly one JSON object matching a schema, and parse the first
// {...} block from the response. Robust against trailing prose.
// =============================================================================

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// Model identifiers — keep in sync with CLAUDE.md / global notes.
const MODELS = {
  haiku: "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-6",
} as const;

export type ClaudeTier = keyof typeof MODELS;

export class ClaudeError extends Error {
  readonly status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ClaudeError";
    this.status = status;
  }
}

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>;
  usage?: { input_tokens?: number; output_tokens?: number };
}

export interface CompletionResult {
  text: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

async function complete(
  tier: ClaudeTier,
  systemPrompt: string,
  userPrompt: string,
  opts: { maxTokens?: number; temperature?: number } = {},
): Promise<CompletionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new ClaudeError("ai_not_configured", 503);

  const model = MODELS[tier];
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: opts.maxTokens ?? 600,
      temperature: opts.temperature ?? 0.2,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ClaudeError(
      `anthropic_${res.status}: ${text.slice(0, 200)}`,
      res.status,
    );
  }

  const json = (await res.json()) as AnthropicResponse;
  const text =
    json.content?.map((b) => (b.type === "text" ? b.text ?? "" : "")).join("") ??
    "";

  return {
    text: text.trim(),
    tokensIn: json.usage?.input_tokens ?? 0,
    tokensOut: json.usage?.output_tokens ?? 0,
    model,
  };
}

export async function completeText(
  tier: ClaudeTier,
  systemPrompt: string,
  userPrompt: string,
  opts: { maxTokens?: number; temperature?: number } = {},
): Promise<CompletionResult> {
  return complete(tier, systemPrompt, userPrompt, opts);
}

export async function completeJson<T = unknown>(
  tier: ClaudeTier,
  systemPrompt: string,
  userPrompt: string,
  opts: { maxTokens?: number; temperature?: number } = {},
): Promise<{ data: T; raw: CompletionResult }> {
  const raw = await complete(tier, systemPrompt, userPrompt, opts);
  const match = raw.text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new ClaudeError("ai_no_json_in_response", 502);
  }
  try {
    return { data: JSON.parse(match[0]) as T, raw };
  } catch {
    throw new ClaudeError("ai_invalid_json", 502);
  }
}
