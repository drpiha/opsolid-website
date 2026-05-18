"use client";

// =============================================================================
// ChannelsClient — connect / pause / disconnect inbox channels.
//
// Three providers in v1: Telegram (BotFather token), WhatsApp (360dialog
// API key + phone-number-id), Email (Postmark inbound — receive address +
// auto-generated webhook secret).
//
// Each provider has its own little form because the credential shape
// genuinely differs. Submit posts to /api/inbox/channels/<type>/setup,
// the server-side route validates the creds with the provider before
// persisting (e.g. Telegram getMe), and on success the list refreshes
// with the new channel and a returned webhookUrl the user pastes back to
// the provider's hub.
// =============================================================================

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Locale = "de" | "en" | "tr";
type ChannelType = "whatsapp" | "telegram" | "email" | "voice" | "web" | "card_action";

interface Channel {
  id: string;
  type: ChannelType;
  label: string | null;
  status: string;
  lastErrorAt: string | null;
  lastError: string | null;
  counts: { open: number; unread: number };
}

interface AIProbe {
  openai: { configured: boolean; status: string; detail?: string };
  anthropic: { configured: boolean; status: string; detail?: string };
  summary: {
    allRequiredReady: boolean;
    summaryReady: boolean;
    voiceTranscriptReady: boolean;
  };
}

const COPY: Record<Locale, {
  title: string;
  subtitle: string;
  connected: string;
  empty: string;
  connect: {
    section: string;
    telegram: { title: string; hint: string; tokenLabel: string; tokenPh: string; labelLabel: string; submit: string };
    whatsapp: { title: string; hint: string; apiKeyLabel: string; apiKeyPh: string; phoneLabel: string; phonePh: string; labelLabel: string; submit: string };
    email: { title: string; hint: string; inboxLabel: string; inboxPh: string; labelLabel: string; submit: string };
  };
  status: Record<string, string>;
  actions: { pause: string; activate: string; delete: string; copy: string; copied: string };
  channelNames: Record<ChannelType, string>;
  webhookHint: string;
  testing: string;
  errorPrefix: string;
}> = {
  de: {
    title: "Kanäle",
    subtitle: "Telegram, WhatsApp und E-Mail mit Ihrem Posteingang verbinden",
    connected: "Verbundene Kanäle",
    empty: "Noch keine Kanäle verbunden.",
    connect: {
      section: "Neuer Kanal",
      telegram: {
        title: "Telegram-Bot",
        hint: "Holen Sie sich einen Bot-Token vom @BotFather, fügen Sie ihn hier ein — wir registrieren den Webhook automatisch.",
        tokenLabel: "Bot-Token",
        tokenPh: "123456:ABC-...",
        labelLabel: "Name (optional)",
        submit: "Verbinden",
      },
      whatsapp: {
        title: "WhatsApp Business (360dialog)",
        hint: "API-Key + Telefonnummer aus dem 360dialog-Hub. Webhook-URL erscheint nach dem Speichern — kopieren und im Hub eintragen.",
        apiKeyLabel: "API-Key",
        apiKeyPh: "D360-...",
        phoneLabel: "Phone Number ID",
        phonePh: "905551234567",
        labelLabel: "Name (optional)",
        submit: "Verbinden",
      },
      email: {
        title: "E-Mail (Postmark Inbound)",
        hint: "Wir vergeben eine Webhook-URL mit Secret — diese in Ihrem Postmark Inbound Stream eintragen.",
        inboxLabel: "Empfangsadresse",
        inboxPh: "support@deinedomain.de",
        labelLabel: "Name (optional)",
        submit: "Verbinden",
      },
    },
    status: { active: "Aktiv", paused: "Pausiert", error: "Fehler" },
    actions: { pause: "Pausieren", activate: "Aktivieren", delete: "Trennen", copy: "Webhook kopieren", copied: "Kopiert" },
    channelNames: { whatsapp: "WhatsApp", telegram: "Telegram", email: "E-Mail", voice: "Voice", web: "Web-Formular", card_action: "Karten-Aktionen" },
    webhookHint: "Diese URL bei Ihrem Anbieter als Webhook eintragen.",
    testing: "Verbinde…",
    errorPrefix: "Fehler",
  },
  en: {
    title: "Channels",
    subtitle: "Connect Telegram, WhatsApp and Email to your inbox",
    connected: "Connected channels",
    empty: "No channels connected yet.",
    connect: {
      section: "New channel",
      telegram: {
        title: "Telegram bot",
        hint: "Get a bot token from @BotFather, paste it here — we'll register the webhook automatically.",
        tokenLabel: "Bot token",
        tokenPh: "123456:ABC-...",
        labelLabel: "Label (optional)",
        submit: "Connect",
      },
      whatsapp: {
        title: "WhatsApp Business (360dialog)",
        hint: "API key + phone-number-id from the 360dialog hub. Webhook URL is shown after save — paste it back into the hub.",
        apiKeyLabel: "API key",
        apiKeyPh: "D360-...",
        phoneLabel: "Phone number id",
        phonePh: "905551234567",
        labelLabel: "Label (optional)",
        submit: "Connect",
      },
      email: {
        title: "Email (Postmark inbound)",
        hint: "We issue a webhook URL with a secret — paste it into your Postmark Inbound Stream config.",
        inboxLabel: "Receive address",
        inboxPh: "support@yourdomain.com",
        labelLabel: "Label (optional)",
        submit: "Connect",
      },
    },
    status: { active: "Active", paused: "Paused", error: "Error" },
    actions: { pause: "Pause", activate: "Activate", delete: "Disconnect", copy: "Copy webhook", copied: "Copied" },
    channelNames: { whatsapp: "WhatsApp", telegram: "Telegram", email: "Email", voice: "Voice", web: "Web form", card_action: "Card actions" },
    webhookHint: "Paste this URL into your provider's webhook configuration.",
    testing: "Connecting…",
    errorPrefix: "Error",
  },
  tr: {
    title: "Kanallar",
    subtitle: "Telegram, WhatsApp ve e-postayı inbox'ınıza bağlayın",
    connected: "Bağlı kanallar",
    empty: "Henüz kanal bağlı değil.",
    connect: {
      section: "Yeni kanal",
      telegram: {
        title: "Telegram botu",
        hint: "@BotFather'dan bot token alın, buraya yapıştırın — webhook'u otomatik kuruyoruz.",
        tokenLabel: "Bot token",
        tokenPh: "123456:ABC-...",
        labelLabel: "İsim (opsiyonel)",
        submit: "Bağla",
      },
      whatsapp: {
        title: "WhatsApp Business (360dialog)",
        hint: "360dialog hub'ından API key + telefon numarası id. Webhook URL'i kaydetme sonrası gelir — hub'a geri yapıştırın.",
        apiKeyLabel: "API key",
        apiKeyPh: "D360-...",
        phoneLabel: "Phone number id",
        phonePh: "905551234567",
        labelLabel: "İsim (opsiyonel)",
        submit: "Bağla",
      },
      email: {
        title: "E-posta (Postmark inbound)",
        hint: "Secret içeren bir webhook URL veriyoruz — Postmark Inbound Stream'inizde kullanın.",
        inboxLabel: "Alıcı adres",
        inboxPh: "destek@alandiniz.com",
        labelLabel: "İsim (opsiyonel)",
        submit: "Bağla",
      },
    },
    status: { active: "Aktif", paused: "Pasif", error: "Hata" },
    actions: { pause: "Duraklat", activate: "Aktive et", delete: "Bağlantıyı kaldır", copy: "Webhook'u kopyala", copied: "Kopyalandı" },
    channelNames: { whatsapp: "WhatsApp", telegram: "Telegram", email: "E-posta", voice: "Voice", web: "Web formu", card_action: "Kart aksiyonları" },
    webhookHint: "Bu URL'i sağlayıcınızın webhook ayarına yapıştırın.",
    testing: "Bağlanıyor…",
    errorPrefix: "Hata",
  },
};

type Provider = "telegram" | "whatsapp" | "email";

export function ChannelsClient() {
  const params = useParams();
  const locale = ((params?.locale as Locale | undefined) ?? "de") as Locale;
  const copy = COPY[locale] ?? COPY.de;

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<Provider>("telegram");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastWebhookUrl, setLastWebhookUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [probe, setProbe] = useState<AIProbe | null>(null);
  const [probing, setProbing] = useState(false);

  const refreshProbe = useCallback(async () => {
    setProbing(true);
    try {
      const res = await fetch("/api/inbox/ai/probe");
      if (!res.ok) {
        setProbe(null);
        return;
      }
      setProbe((await res.json()) as AIProbe);
    } finally {
      setProbing(false);
    }
  }, []);

  useEffect(() => {
    void refreshProbe();
  }, [refreshProbe]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inbox/channels");
      if (!res.ok) return;
      const data = (await res.json()) as { channels: Channel[] };
      setChannels(data.channels);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(payload: Record<string, string>) {
    setError(null);
    setLastWebhookUrl(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/inbox/channels/${provider}/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const desc =
          (data as { description?: string; error?: string }).description ??
          (data as { error?: string }).error ??
          `HTTP ${res.status}`;
        setError(desc);
        return;
      }
      if ("webhookUrl" in data && typeof data.webhookUrl === "string") {
        setLastWebhookUrl(data.webhookUrl);
      }
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      await fetch(`/api/inbox/channels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm(copy.actions.delete + "?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/inbox/channels/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  function copyWebhook(url: string) {
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-2 sm:px-0">
      <header>
        <h1 className="text-2xl font-semibold text-ink">{copy.title}</h1>
        <p className="mt-1 text-sm text-ink-400">{copy.subtitle}</p>
      </header>

      <AIStatusBanner probe={probe} probing={probing} onRefresh={refreshProbe} />


      {/* ---------- Connected list ---------- */}
      <section>
        <h2 className="meta mono-label mb-3 text-ink-400">{copy.connected}</h2>
        {loading ? (
          <p className="text-sm text-ink-400">…</p>
        ) : channels.length === 0 ? (
          <p className="rounded-2xl border border-line-soft bg-bg-2 p-6 text-sm text-ink-400">
            {copy.empty}
          </p>
        ) : (
          <ul className="space-y-2">
            {channels.map((c) => (
              <li key={c.id} className="rounded-2xl border border-line bg-bg-1 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="mono-label rounded bg-bg-3 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-400">
                        {copy.channelNames[c.type] ?? c.type}
                      </span>
                      <span className="truncate text-sm font-medium text-ink">
                        {c.label ?? c.id}
                      </span>
                      <span
                        className={`chip text-[10px] ${
                          c.status === "active"
                            ? "chip-hot"
                            : c.status === "error"
                              ? "bg-signal-err/10 text-signal-err"
                              : ""
                        }`}
                      >
                        {copy.status[c.status] ?? c.status}
                      </span>
                    </div>
                    <p className="mono-label mt-1 text-[10px] text-ink-300">
                      {c.counts.open} open · {c.counts.unread} unread
                    </p>
                    {c.lastError && (
                      <p className="mt-2 text-xs text-signal-err">
                        {copy.errorPrefix}: {c.lastError}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {c.status === "active" ? (
                      <button
                        className="chip text-xs"
                        disabled={busyId === c.id}
                        onClick={() => patch(c.id, { status: "paused" })}
                      >
                        {copy.actions.pause}
                      </button>
                    ) : (
                      <button
                        className="chip text-xs"
                        disabled={busyId === c.id}
                        onClick={() => patch(c.id, { status: "active" })}
                      >
                        {copy.actions.activate}
                      </button>
                    )}
                    <button
                      className="chip text-xs text-signal-err"
                      disabled={busyId === c.id}
                      onClick={() => remove(c.id)}
                    >
                      {copy.actions.delete}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- New channel form ---------- */}
      <section className="rounded-2xl border border-line bg-bg-1 p-5">
        <h2 className="meta mono-label mb-3 text-ink-400">
          {copy.connect.section}
        </h2>

        <div role="tablist" className="mb-4 flex gap-1.5">
          {(["telegram", "whatsapp", "email"] as Provider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setProvider(p);
                setError(null);
                setLastWebhookUrl(null);
              }}
              className={`chip text-xs ${provider === p ? "chip-hot" : ""}`}
            >
              {copy.connect[p].title}
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs text-ink-400">{copy.connect[provider].hint}</p>

        {provider === "telegram" && (
          <TelegramForm
            copy={copy.connect.telegram}
            submitting={submitting}
            onSubmit={(v) => submit(v)}
          />
        )}
        {provider === "whatsapp" && (
          <WhatsAppForm
            copy={copy.connect.whatsapp}
            submitting={submitting}
            onSubmit={(v) => submit(v)}
          />
        )}
        {provider === "email" && (
          <EmailForm
            copy={copy.connect.email}
            submitting={submitting}
            onSubmit={(v) => submit(v)}
          />
        )}

        {error && (
          <p className="mt-3 rounded-lg border border-signal-err/30 bg-signal-err/5 px-3 py-2 text-xs text-signal-err">
            {copy.errorPrefix}: {error}
          </p>
        )}

        {lastWebhookUrl && (
          <div className="mt-3 rounded-lg border border-copper/30 bg-copper/5 p-3 text-xs">
            <p className="mono-label mb-1 text-[10px] text-copper">webhook url</p>
            <code className="block break-all rounded bg-bg-2 px-2 py-1 text-[11px] text-ink">
              {lastWebhookUrl}
            </code>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="chip text-xs"
                onClick={() => copyWebhook(lastWebhookUrl)}
              >
                {copied ? copy.actions.copied : copy.actions.copy}
              </button>
              <span className="text-[10px] text-ink-400">{copy.webhookHint}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-provider forms — kept inline for trivial cases (under ~30 lines each)
// ---------------------------------------------------------------------------

function TelegramForm({
  copy,
  submitting,
  onSubmit,
}: {
  copy: (typeof COPY)["en"]["connect"]["telegram"];
  submitting: boolean;
  onSubmit: (v: Record<string, string>) => void;
}) {
  const [token, setToken] = useState("");
  const [label, setLabel] = useState("");
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!token.trim()) return;
        onSubmit({ botToken: token.trim(), label: label.trim() });
      }}
    >
      <Field label={copy.tokenLabel}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={copy.tokenPh}
          required
          className="field w-full text-sm"
        />
      </Field>
      <Field label={copy.labelLabel}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="field w-full text-sm"
        />
      </Field>
      <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
        {submitting ? "…" : copy.submit}
      </button>
    </form>
  );
}

function WhatsAppForm({
  copy,
  submitting,
  onSubmit,
}: {
  copy: (typeof COPY)["en"]["connect"]["whatsapp"];
  submitting: boolean;
  onSubmit: (v: Record<string, string>) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("");
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!apiKey.trim() || !phone.trim()) return;
        onSubmit({
          apiKey: apiKey.trim(),
          phoneNumberId: phone.trim(),
          label: label.trim(),
        });
      }}
    >
      <Field label={copy.apiKeyLabel}>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={copy.apiKeyPh}
          required
          className="field w-full text-sm"
        />
      </Field>
      <Field label={copy.phoneLabel}>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={copy.phonePh}
          required
          inputMode="numeric"
          className="field w-full text-sm"
        />
      </Field>
      <Field label={copy.labelLabel}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="field w-full text-sm"
        />
      </Field>
      <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
        {submitting ? "…" : copy.submit}
      </button>
    </form>
  );
}

function EmailForm({
  copy,
  submitting,
  onSubmit,
}: {
  copy: (typeof COPY)["en"]["connect"]["email"];
  submitting: boolean;
  onSubmit: (v: Record<string, string>) => void;
}) {
  const [inbox, setInbox] = useState("");
  const [label, setLabel] = useState("");
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!inbox.trim()) return;
        onSubmit({ inboxEmail: inbox.trim(), label: label.trim() });
      }}
    >
      <Field label={copy.inboxLabel}>
        <input
          value={inbox}
          onChange={(e) => setInbox(e.target.value)}
          placeholder={copy.inboxPh}
          required
          type="email"
          className="field w-full text-sm"
        />
      </Field>
      <Field label={copy.labelLabel}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="field w-full text-sm"
        />
      </Field>
      <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
        {submitting ? "…" : copy.submit}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-400">{label}</span>
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// AI status banner — shows whether ANTHROPIC + OPENAI keys are live so the
// user knows AI summaries / voice transcripts will actually populate.
// ---------------------------------------------------------------------------

function statusLabel(s: string): string {
  switch (s) {
    case "ok":          return "ok";
    case "unconfigured":return "not set";
    case "credit_low":  return "credit empty";
    case "auth":        return "auth";
    case "rate_limited":return "rate-limited";
    default:            return s;
  }
}

function statusColor(s: string): string {
  if (s === "ok") return "bg-signal-ok/15 text-signal-ok";
  if (s === "unconfigured") return "bg-bg-3 text-ink-400";
  if (s === "credit_low" || s === "rate_limited") return "bg-signal-warn/15 text-signal-warn";
  return "bg-signal-err/15 text-signal-err";
}

function AIStatusBanner({
  probe,
  probing,
  onRefresh,
}: {
  probe: AIProbe | null;
  probing: boolean;
  onRefresh: () => void;
}) {
  if (!probe) {
    return null;
  }
  return (
    <section className="rounded-2xl border border-line bg-bg-1 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="mono-label uppercase tracking-wider text-ink-400">AI</span>
          <span
            className={`mono-label rounded px-2 py-0.5 text-[10px] ${statusColor(probe.openai.status)}`}
          >
            OpenAI: {statusLabel(probe.openai.status)} <span className="opacity-60">(required)</span>
          </span>
          <span
            className={`mono-label rounded px-2 py-0.5 text-[10px] ${statusColor(probe.anthropic.status)}`}
          >
            Anthropic: {statusLabel(probe.anthropic.status)} <span className="opacity-60">(optional)</span>
          </span>
          {probe.summary.allRequiredReady && (
            <span className="text-[11px] text-signal-ok">
              AI live · summary + draft + voice transcription active
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={probing}
          className="chip text-[11px]"
        >
          {probing ? "…" : "Re-check"}
        </button>
      </div>
      {(probe.openai.detail || probe.anthropic.detail) && (
        <ul className="mt-2 space-y-1 text-[11px] text-ink-400">
          {probe.openai.detail && <li>OpenAI: {probe.openai.detail}</li>}
          {probe.anthropic.detail && (
            <li>Anthropic: {probe.anthropic.detail}</li>
          )}
        </ul>
      )}
    </section>
  );
}
