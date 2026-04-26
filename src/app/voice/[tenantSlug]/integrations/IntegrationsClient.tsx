"use client";

/**
 * IntegrationsClient — card grid for the four supported integration types.
 * email_only is always shown as available (no setup, no API). Others can be
 * configured + tested.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  Plug,
  Webhook,
  Zap,
} from "lucide-react";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { formatDateTime } from "@/components/voice/dashboard/format";

export interface IntegrationItem {
  id: string | null;
  integrationType: string;
  label: string | null;
  status: string;
  lastTestedAt: string | null;
  lastErrorMsg: string | null;
}

interface IntegrationsClientProps {
  tenantId: string;
  token: string;
  items: IntegrationItem[];
}

const META: Record<
  string,
  {
    title: string;
    description: string;
    icon: typeof Mail;
    badge?: string;
  }
> = {
  email_only: {
    title: "E-Mail",
    description:
      "Termine und Bestellungen werden als formatierte E-Mail an Ihren Posteingang geschickt.",
    icon: Mail,
    badge: "Keine API notwendig",
  },
  cal_com: {
    title: "Cal.com",
    description:
      "Live-Verfügbarkeitsabfrage und automatische Buchung in Ihren Cal.com-Kalender.",
    icon: Calendar,
  },
  google_calendar: {
    title: "Google Calendar",
    description:
      "Liest Verfügbarkeiten aus Google Kalender und legt Termine direkt an.",
    icon: Calendar,
  },
  custom_webhook: {
    title: "Custom Webhook",
    description:
      "Eigener Endpoint für CRM, ERP oder Buchungssoftware. Einfach Webhook-URL hinterlegen.",
    icon: Webhook,
  },
};

export default function IntegrationsClient({
  tenantId,
  token,
  items,
}: IntegrationsClientProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openConfig, setOpenConfig] = useState<string | null>(null);

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const test = async (item: IntegrationItem) => {
    if (!item.id) return;
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/integrations/${item.id}/test${tokenQ}`,
        { method: "POST" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => {
          const meta = META[item.integrationType];
          if (!meta) return null;
          const Icon = meta.icon;
          const effectiveStatus =
            item.integrationType === "email_only" && item.status === "inactive"
              ? "active"
              : item.status;
          return (
            <article
              key={item.integrationType}
              className="panel flex flex-col gap-4 px-5 py-5"
            >
              <header className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-hot/50 bg-copper-500/[0.06] text-copper-300"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-[15px] font-medium text-ink">
                      {meta.title}
                    </h3>
                    {meta.badge && (
                      <span className="meta mt-0.5 inline-flex items-center gap-1 text-[10px] text-signal-ok">
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                        {meta.badge}
                      </span>
                    )}
                  </div>
                </div>
                <VoiceStatusBadge status={effectiveStatus} />
              </header>

              <p className="text-[12px] leading-relaxed text-ink-300">
                {meta.description}
              </p>

              <div className="flex items-center justify-between border-t border-line-soft pt-3">
                <div className="meta text-[10px] text-ink-400">
                  {item.lastTestedAt
                    ? `Zuletzt getestet: ${formatDateTime(item.lastTestedAt)}`
                    : "Noch nicht getestet"}
                </div>
                <div className="flex items-center gap-2">
                  {item.id && (
                    <button
                      type="button"
                      onClick={() => test(item)}
                      disabled={busyId === item.id}
                      className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-ink-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyId === item.id ? (
                        <Loader2
                          className="h-3 w-3 animate-spin"
                          aria-hidden
                        />
                      ) : (
                        <Zap className="h-3 w-3" aria-hidden />
                      )}
                      Testen
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenConfig((cur) =>
                        cur === item.integrationType
                          ? null
                          : item.integrationType,
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-ink-300 hover:text-ink"
                  >
                    <Plug className="h-3 w-3" aria-hidden />
                    {openConfig === item.integrationType
                      ? "Schließen"
                      : "Konfigurieren"}
                  </button>
                </div>
              </div>

              {openConfig === item.integrationType && (
                <ConfigForm
                  tenantId={tenantId}
                  token={token}
                  item={item}
                  onSaved={() => {
                    setOpenConfig(null);
                    router.refresh();
                  }}
                />
              )}

              {item.lastErrorMsg && (
                <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[11px] text-signal-err">
                  {item.lastErrorMsg}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ConfigForm({
  tenantId,
  token,
  item,
  onSaved,
}: {
  tenantId: string;
  token: string;
  item: IntegrationItem;
  onSaved: () => void;
}) {
  const [credentials, setCredentials] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [saving, setSaving] = useState(false);
  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        integrationType: item.integrationType,
      };
      if (item.integrationType === "email_only") {
        body.config = { to: emailTo };
      } else if (item.integrationType === "custom_webhook") {
        body.config = { url: webhookUrl, secret };
      } else {
        body.credentials = { apiKey: credentials };
      }
      const res = await fetch(
        item.id
          ? `/api/voice/${tenantId}/integrations/${item.id}${tokenQ}`
          : `/api/voice/${tenantId}/integrations${tokenQ}`,
        {
          method: item.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-md border border-line bg-bg-2 p-4"
    >
      {item.integrationType === "email_only" && (
        <label className="flex flex-col gap-1.5">
          <span className="meta text-[10px] text-ink-400">
            E-Mail-Empfänger
          </span>
          <input
            type="email"
            required
            className="field font-mono text-[12px]"
            placeholder="team@example.com"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
          />
        </label>
      )}

      {item.integrationType === "custom_webhook" && (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="meta text-[10px] text-ink-400">Webhook-URL</span>
            <input
              type="url"
              required
              className="field font-mono text-[12px]"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="meta text-[10px] text-ink-400">
              Secret (optional)
            </span>
            <input
              type="password"
              className="field font-mono text-[12px]"
              placeholder="Geheimer Schlüssel zur Signaturprüfung"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </label>
        </>
      )}

      {(item.integrationType === "cal_com" ||
        item.integrationType === "google_calendar") && (
        <label className="flex flex-col gap-1.5">
          <span className="meta text-[10px] text-ink-400">API-Schlüssel</span>
          <input
            type="password"
            required
            className="field font-mono text-[12px]"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
          />
        </label>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : null}
          Speichern
        </button>
      </div>
    </form>
  );
}
