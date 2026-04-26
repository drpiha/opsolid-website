"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Info, Loader2, Save } from "lucide-react";

interface SettingsFormProps {
  tenantId: string;
  token: string;
  initial: {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    timezone: string;
    locale: string;
    businessDescription: string;
    businessAddress: string;
    businessCategory: string;
  };
}

const TIMEZONES = [
  "Europe/Berlin",
  "Europe/Vienna",
  "Europe/Zurich",
  "Europe/Istanbul",
  "Europe/Paris",
  "Europe/Amsterdam",
  "Europe/London",
];

const CATEGORIES = [
  { value: "generic", label: "Allgemein" },
  { value: "appointment", label: "Termingeschäft" },
  { value: "restaurant", label: "Gastronomie" },
  { value: "clinic", label: "Praxis / Klinik" },
  { value: "hotel", label: "Hotel" },
];

const LOCALES = [
  { value: "de", label: "Deutsch" },
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "English" },
];

export default function SettingsForm({
  tenantId,
  token,
  initial,
}: SettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const update = <K extends keyof typeof values>(
    key: K,
    val: (typeof values)[K],
  ) => setValues((p) => ({ ...p, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/voice/${tenantId}/settings${tokenQ}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedAt(new Date());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/voice/webhooks/retell`
      : "/api/voice/webhooks/retell";

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      {/* ---------- Business profile ---------- */}
      <section className="panel flex flex-col gap-4 px-5 py-5">
        <h3 className="font-display text-[14px] font-medium text-ink">
          Firmendaten
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Firmenname" required>
            <input
              required
              type="text"
              className="field"
              value={values.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          </Field>
          <Field label="Branche">
            <select
              className="field"
              value={values.businessCategory}
              onChange={(e) => update("businessCategory", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kontakt-E-Mail" required>
            <input
              required
              type="email"
              className="field font-mono text-[12px]"
              value={values.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Kontakt-Telefon">
            <input
              type="tel"
              className="field font-mono text-[12px]"
              value={values.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
            />
          </Field>
          <Field label="Zeitzone">
            <select
              className="field font-mono text-[12px]"
              value={values.timezone}
              onChange={(e) => update("timezone", e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sprache">
            <select
              className="field"
              value={values.locale}
              onChange={(e) => update("locale", e.target.value)}
            >
              {LOCALES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Adresse" className="md:col-span-2">
            <input
              type="text"
              className="field"
              placeholder="Strasse 1, 10115 Berlin"
              value={values.businessAddress}
              onChange={(e) => update("businessAddress", e.target.value)}
            />
          </Field>
          <Field label="Kurzbeschreibung" className="md:col-span-2">
            <textarea
              className="field min-h-[90px] resize-y text-[12px] leading-relaxed"
              placeholder="Was macht Ihr Unternehmen? Diese Information fließt in den Agent-Prompt ein."
              value={values.businessDescription}
              onChange={(e) => update("businessDescription", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* ---------- Webhook URL info ---------- */}
      <section className="panel flex flex-col gap-3 px-5 py-5">
        <header className="flex items-center gap-2">
          <Info className="h-4 w-4 text-copper-400" aria-hidden />
          <h3 className="font-display text-[14px] font-medium text-ink">
            Webhook-URL für Retell / Vapi
          </h3>
        </header>
        <p className="text-[12px] leading-relaxed text-ink-300">
          Konfigurieren Sie diese URL bei Ihrem Voice-Provider, damit Anrufe und Transkripte automatisch erfasst werden.
        </p>
        <div className="flex items-stretch gap-2">
          <input
            readOnly
            className="field flex-1 font-mono text-[12px]"
            value={webhookUrl}
            aria-label="Webhook-URL"
          />
          <button
            type="button"
            onClick={copyWebhook}
            className="btn btn-ghost btn-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-signal-ok" aria-hidden />
                Kopiert
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Kopieren
              </>
            )}
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
          {error}
        </div>
      )}
      {savedAt && (
        <div className="rounded-md border border-signal-ok/30 bg-signal-ok/[0.08] px-3 py-2 text-[12px] text-signal-ok">
          Gespeichert um {savedAt.toLocaleTimeString("de-DE")}.
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Save className="h-3.5 w-3.5" aria-hidden />
          )}
          Speichern
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="meta flex items-center gap-1 text-[10px] text-ink-400">
        {label}
        {required && (
          <span className="text-copper-400" aria-hidden>
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
