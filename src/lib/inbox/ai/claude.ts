// =============================================================================
// LLM helper for the inbox AI layer.
//
// Originally targeted Anthropic Claude (file name preserved to avoid churn
// in callers); now backed by OpenAI Chat Completions because the operator's
// Anthropic billing isn't active. Caller surface (`completeText`,
// `completeJson`, `ClaudeError`, `ClaudeTier`) is unchanged — analyze.ts
// and suggest-reply.ts didn't need touching.
//
// Two tiers, mapped to OpenAI models:
//   - "haiku"  → gpt-4o-mini (cheap, fast — summary / sentiment / intent)
//   - "sonnet" → gpt-4o      (mid, accurate — reply drafting)
//
// JSON mode uses OpenAI's native response_format=json_object, but we still
// extract the first {...} block defensively so the parser tolerates either
// pure-JSON or JSON-wrapped-in-prose outputs.
// =============================================================================

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

const MODELS = {
  haiku: "gpt-4o-mini",
  sonnet: "gpt-4o",
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

interface OpenAIChatResponse {
  choices?: Array<{
    message?: { role?: string; content?: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string; type?: string; code?: string };
}

export interface CompletionResult {
  text: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

interface CompleteOptions {
  maxTokens?: number;
  temperature?: number;
  /** When true, request JSON object mode from OpenAI. */
  jsonMode?: boolean;
}

async function complete(
  tier: ClaudeTier,
  systemPrompt: string,
  userPrompt: string,
  opts: CompleteOptions = {},
): Promise<CompletionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new ClaudeError("ai_not_configured", 503);

  const model = MODELS[tier];
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: opts.maxTokens ?? 600,
    temperature: opts.temperature ?? 0.2,
  };
  if (opts.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ClaudeError(
      `openai_${res.status}: ${text.slice(0, 240)}`,
      res.status,
    );
  }

  const json = (await res.json()) as OpenAIChatResponse;
  if (json.error) {
    throw new ClaudeError(
      `openai_error: ${json.error.message ?? "unknown"}`,
      500,
    );
  }
  const text = json.choices?.[0]?.message?.content ?? "";

  return {
    text: text.trim(),
    tokensIn: json.usage?.prompt_tokens ?? 0,
    tokensOut: json.usage?.completion_tokens ?? 0,
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
  // Strengthen the prompt: even with response_format=json_object, models
  // occasionally wrap output in code fences when the system prompt mentions
  // JSON examples. The defensive {...} extractor below handles both.
  const raw = await complete(tier, systemPrompt, userPrompt, {
    ...opts,
    jsonMode: true,
  });
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
