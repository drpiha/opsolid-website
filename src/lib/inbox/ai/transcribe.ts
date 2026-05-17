// =============================================================================
// Voice → text transcription (OpenAI Whisper API).
//
// Used for WhatsApp / Telegram voice notes. We only POST the audio URL via
// fetch + multipart — no SDK. Returns null when OPENAI_API_KEY is missing
// or the upstream fails so callers can ingest the message without blocking
// on transcription.
// =============================================================================

const OPENAI_WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";

export interface TranscribeResult {
  text: string;
  language: string | null;
  durationMs: number;
}

export async function transcribeAudio(
  audioUrl: string,
  opts: { languageHint?: string | null } = {},
): Promise<TranscribeResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const started = Date.now();
  let audioBuf: ArrayBuffer;
  let contentType: string;
  try {
    const audioRes = await fetch(audioUrl, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!audioRes.ok) {
      console.warn(
        "[inbox/ai/transcribe] audio fetch failed",
        audioRes.status,
      );
      return null;
    }
    audioBuf = await audioRes.arrayBuffer();
    contentType = audioRes.headers.get("content-type") ?? "audio/ogg";
  } catch (err) {
    console.warn("[inbox/ai/transcribe] audio fetch error", err);
    return null;
  }

  // Cap at 25 MB (Whisper API limit) — silently truncate everything above.
  if (audioBuf.byteLength > 25 * 1024 * 1024) {
    console.warn("[inbox/ai/transcribe] audio over 25MB, skipping");
    return null;
  }

  const form = new FormData();
  form.append("file", new Blob([audioBuf], { type: contentType }), "audio.ogg");
  form.append("model", "whisper-1");
  if (opts.languageHint) form.append("language", opts.languageHint);
  form.append("response_format", "verbose_json");

  try {
    const res = await fetch(OPENAI_WHISPER_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        "[inbox/ai/transcribe] whisper failed",
        res.status,
        body.slice(0, 200),
      );
      return null;
    }
    const json = (await res.json()) as {
      text: string;
      language?: string;
    };
    return {
      text: (json.text ?? "").trim(),
      language: json.language ?? null,
      durationMs: Date.now() - started,
    };
  } catch (err) {
    console.warn("[inbox/ai/transcribe] whisper error", err);
    return null;
  }
}
