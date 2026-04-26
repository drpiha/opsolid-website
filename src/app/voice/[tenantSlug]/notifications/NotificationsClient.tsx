"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Plus,
  Send,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationConfigRow {
  id: string;
  channelType: string;
  label: string | null;
  isActive: boolean;
  triggerOn: string[];
  config: Record<string, unknown>;
}

interface NotificationsClientProps {
  tenantId: string;
  token: string;
  configs: NotificationConfigRow[];
}

const CHANNEL_META: Record<
  string,
  { title: string; icon: typeof Mail; description: string }
> = {
  email: {
    title: "E-Mail",
    icon: Mail,
    description: "Strukturierte E-Mail an einen Posteingang",
  },
  telegram: {
    title: "Telegram",
    icon: Send,
    description: "Sofortige Bot-Nachricht im gewählten Chat",
  },
  whatsapp: {
    title: "WhatsApp",
    icon: MessageCircle,
    description: "Business-API-Nachricht an Ihr Team",
  },
  webhook: {
    title: "Webhook",
    icon: Webhook,
    description: "POST an Ihren eigenen Endpoint",
  },
};

const TRIGGERS: { value: string; label: string }[] = [
  { value: "call_ended", label: "Anruf beendet" },
  { value: "appointment_booked", label: "Termin erstellt" },
  { value: "order_placed", label: "Bestellung eingegangen" },
  { value: "transferred", label: "Weiterleitung" },
];

export default function NotificationsClient({
  tenantId,
  token,
  configs,
}: NotificationsClientProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    channelType: "email",
    label: "",
    to: "",
    botToken: "",
    chatId: "",
    url: "",
    secret: "",
    triggerOn: ["call_ended"] as string[],
  });

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const toggleTrigger = (val: string) => {
    setDraft((p) => ({
      ...p,
      triggerOn: p.triggerOn.includes(val)
        ? p.triggerOn.filter((t) => t !== val)
        : [...p.triggerOn, val],
    }));
  };

  const buildConfig = (channelType: string) => {
    if (channelType === "email") return { to: draft.to };
    if (channelType === "telegram")
      return { botToken: draft.botToken, chatId: draft.chatId };
    if (channelType === "whatsapp")
      return { to: draft.to, botToken: draft.botToken };
    if (channelType === "webhook")
      return { url: draft.url, secret: draft.secret };
    return {};
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/notifications${tokenQ}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelType: draft.channelType,
            label: draft.label || null,
            triggerOn: draft.triggerOn,
            config: buildConfig(draft.channelType),
            isActive: true,
          }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDraft({
        channelType: "email",
        label: "",
        to: "",
        botToken: "",
        chatId: "",
        url: "",
        secret: "",
        triggerOn: ["call_ended"],
      });
      setShowAdd(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = async (cfg: NotificationConfigRow) => {
    setBusyId(cfg.id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/notifications/${cfg.id}${tokenQ}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !cfg.isActive }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aktualisierung fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (cfg: NotificationConfigRow) => {
    if (!confirm(`Kanal "${CHANNEL_META[cfg.channelType]?.title}" löschen?`)) return;
    setBusyId(cfg.id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/notifications/${cfg.id}${tokenQ}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-ink-400">
          {configs.length === 0
            ? "Noch keine Benachrichtigungs-Kanäle aktiv."
            : `${configs.length} ${configs.length === 1 ? "Kanal" : "Kanäle"} konfiguriert.`}
        </p>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="btn btn-primary btn-sm"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Kanal hinzufügen
        </button>
      </div>

      {/* ---------- Add form ---------- */}
      {showAdd && (
        <form
          onSubmit={submit}
          className="panel flex flex-col gap-4 px-5 py-5"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Kanal-Typ">
              <select
                className="field"
                value={draft.channelType}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, channelType: e.target.value }))
                }
              >
                {Object.entries(CHANNEL_META).map(([k, m]) => (
                  <option key={k} value={k}>
                    {m.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bezeichnung">
              <input
                type="text"
                className="field"
                placeholder="z.B. Inhaberin Mobil"
                value={draft.label}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, label: e.target.value }))
                }
              />
            </Field>

            {draft.channelType === "email" && (
              <Field label="E-Mail-Adresse" className="md:col-span-2">
                <input
                  type="email"
                  required
                  className="field font-mono text-[12px]"
                  placeholder="team@example.com"
                  value={draft.to}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, to: e.target.value }))
                  }
                />
              </Field>
            )}
            {draft.channelType === "telegram" && (
              <>
                <Field label="Bot-Token">
                  <input
                    type="password"
                    required
                    className="field font-mono text-[12px]"
                    value={draft.botToken}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, botToken: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Chat-ID">
                  <input
                    type="text"
                    required
                    className="field font-mono text-[12px]"
                    placeholder="-1001234567890"
                    value={draft.chatId}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, chatId: e.target.value }))
                    }
                  />
                </Field>
              </>
            )}
            {draft.channelType === "whatsapp" && (
              <>
                <Field label="Empfänger-Nummer">
                  <input
                    type="tel"
                    required
                    className="field font-mono text-[12px]"
                    placeholder="+49 30 12345678"
                    value={draft.to}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, to: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Business-API-Token">
                  <input
                    type="password"
                    required
                    className="field font-mono text-[12px]"
                    value={draft.botToken}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, botToken: e.target.value }))
                    }
                  />
                </Field>
              </>
            )}
            {draft.channelType === "webhook" && (
              <>
                <Field label="URL" className="md:col-span-2">
                  <input
                    type="url"
                    required
                    className="field font-mono text-[12px]"
                    placeholder="https://example.com/voice-events"
                    value={draft.url}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, url: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Secret (optional)" className="md:col-span-2">
                  <input
                    type="password"
                    className="field font-mono text-[12px]"
                    value={draft.secret}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, secret: e.target.value }))
                    }
                  />
                </Field>
              </>
            )}
          </div>

          <div>
            <span className="meta mb-2 block text-[10px] text-ink-400">
              Auslöser
            </span>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => {
                const active = draft.triggerOn.includes(t.value);
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => toggleTrigger(t.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] transition-colors",
                      active
                        ? "border-line-hot bg-copper-500/[0.10] text-copper-300"
                        : "border-line bg-bg-2 text-ink-400 hover:text-ink-300",
                    )}
                  >
                    {active && <Check className="h-3 w-3" aria-hidden />}
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
              {error}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-3.5 w-3.5" aria-hidden />
              )}
              Kanal anlegen
            </button>
          </div>
        </form>
      )}

      {/* ---------- Existing configs ---------- */}
      {configs.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 px-6 py-12 text-center">
          <Bell className="h-6 w-6 text-ink-400" aria-hidden />
          <p className="text-[13px] text-ink-300">
            Noch keine Benachrichtigung konfiguriert
          </p>
          <p className="max-w-sm text-[11px] text-ink-400">
            Sie verpassen sonst Anrufe und Termine. Aktivieren Sie zumindest E-Mail.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {configs.map((cfg) => {
            const meta = CHANNEL_META[cfg.channelType];
            const Icon = meta?.icon ?? MessageSquare;
            return (
              <li key={cfg.id}>
                <article className="panel flex flex-col gap-3 px-5 py-4">
                  <header className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-hot/50 bg-copper-500/[0.06] text-copper-300"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="font-display text-[14px] font-medium text-ink">
                          {meta?.title ?? cfg.channelType}
                        </div>
                        <div className="meta text-[10px] text-ink-400">
                          {cfg.label ?? meta?.description ?? ""}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(cfg)}
                      disabled={busyId === cfg.id}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-[11px] transition-colors",
                        cfg.isActive
                          ? "border-signal-ok/30 bg-signal-ok/[0.08] text-signal-ok"
                          : "border-line bg-bg-2 text-ink-400",
                      )}
                    >
                      {cfg.isActive ? (
                        <ToggleRight className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <ToggleLeft className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {cfg.isActive ? "Aktiv" : "Aus"}
                    </button>
                  </header>

                  <div className="flex flex-wrap items-center gap-1.5 border-t border-line-soft pt-3">
                    {cfg.triggerOn.length === 0 ? (
                      <span className="text-[11px] text-ink-400">
                        Keine Auslöser
                      </span>
                    ) : (
                      cfg.triggerOn.map((t) => {
                        const label =
                          TRIGGERS.find((tt) => tt.value === t)?.label ?? t;
                        return (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-pill border border-line bg-bg-2 px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight text-ink-300"
                          >
                            {label}
                          </span>
                        );
                      })
                    )}
                    <button
                      type="button"
                      onClick={() => remove(cfg)}
                      disabled={busyId === cfg.id}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2 py-1 text-[11px] text-ink-400 hover:border-signal-err/50 hover:bg-signal-err/[0.08] hover:text-signal-err disabled:opacity-50"
                    >
                      {busyId === cfg.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                      ) : (
                        <Trash2 className="h-3 w-3" aria-hidden />
                      )}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="meta text-[10px] text-ink-400">{label}</span>
      {children}
    </label>
  );
}
