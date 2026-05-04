"use client";

/**
 * AgentForm — create/edit form for VoiceAgent. Posts to:
 *   POST   /api/voice/[tenantId]/agents          (create)
 *   PATCH  /api/voice/[tenantId]/agents/[id]     (update)
 *
 * On successful save with an existing providerAgentId, the form additionally
 * triggers a sync request via the same endpoint with `?sync=1` query param.
 * The parent decides what to do with the response via `onSaved`.
 */

import { useState } from "react";
import { Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import { LANGUAGE_LABELS, PROMPT_TEMPLATE_LABELS } from "./format";

export interface AgentFormValues {
  name: string;
  displayName: string;
  language: string;
  promptTemplate: string;
  voiceId: string;
  systemPrompt: string;
  maxDurationSeconds: number;
  status: "draft" | "active" | "paused";
  llmModel: string;
}

// Curated catalog of LLM models exposed by Retell. Values match the exact
// enum Retell's API accepts (see error response from /update-llm: request/
// body/model must be equal to one of the allowed values). Anything outside
// this list is rejected with HTTP 400.
const LLM_MODELS: { group: string; options: { value: string; label: string }[] }[] = [
  {
    group: "Versatile & highly intelligent",
    options: [
      { value: "gpt-5.5", label: "GPT 5.5  ($0.16/min)" },
      { value: "gpt-5.4", label: "GPT 5.4  ($0.08/min)" },
      { value: "gpt-5.2", label: "GPT 5.2  ($0.056/min)" },
      { value: "gpt-5.1", label: "GPT 5.1  ($0.05/min)" },
      { value: "gpt-5", label: "GPT 5  ($0.04/min)" },
      { value: "claude-4.6-sonnet", label: "Claude 4.6 Sonnet  ($0.08/min)" },
      { value: "claude-4.5-sonnet", label: "Claude 4.5 Sonnet  ($0.08/min)" },
      { value: "claude-4.0-sonnet", label: "Claude 4.0 Sonnet  ($0.08/min)" },
      { value: "gemini-3.0-flash", label: "Gemini 3.0 Flash  ($0.027/min)" },
      { value: "gpt-4.1", label: "GPT 4.1  ($0.045/min)" },
      { value: "gpt-4o", label: "GPT 4o" },
    ],
  },
  {
    group: "Fast & cost-efficient",
    options: [
      { value: "gpt-5.4-mini", label: "GPT 5.4 mini  ($0.036/min)" },
      { value: "gpt-5.4-nano", label: "GPT 5.4 nano  ($0.010/min)" },
      { value: "gpt-5-mini", label: "GPT 5 mini  ($0.012/min)" },
      { value: "gpt-5-nano", label: "GPT 5 nano  ($0.003/min)" },
      { value: "claude-4.5-haiku", label: "Claude 4.5 Haiku  ($0.025/min)" },
      { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite  ($0.014/min)" },
      { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite  ($0.006/min)" },
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
      { value: "gpt-4.1-mini", label: "GPT 4.1 mini  ($0.016/min)" },
      { value: "gpt-4.1-nano", label: "GPT 4.1 nano  ($0.004/min)" },
      { value: "gpt-4o-mini", label: "GPT 4o mini" },
    ],
  },
];

export interface AgentLike extends AgentFormValues {
  id?: string;
  providerAgentId?: string | null;
}

interface AgentFormProps {
  agent?: AgentLike;
  tenantId: string;
  token: string;
  onSaved?: (agent: AgentLike) => void;
}

const PROMPT_TEMPLATES_DEFAULT: Record<string, string> = {
  generic_receptionist:
    "Sie sind die digitale Empfangsmitarbeiterin von {{businessName}}. Begrüßen Sie Anrufer freundlich und professionell auf Deutsch. Geben Sie zu Beginn an, dass Sie ein KI-Assistent sind. Beantworten Sie häufige Fragen aus der Wissensbasis. Bei komplexen Anliegen leiten Sie an einen Menschen weiter.",
  appointment_business:
    "Sie sind die KI-Empfangsmitarbeiterin von {{businessName}}. Hauptaufgabe: Termine buchen. Fragen Sie nach Name, Telefonnummer, gewünschtem Datum und Uhrzeit sowie Anliegen. Bestätigen Sie den Termin am Ende deutlich.",
  restaurant_reservation:
    "Sie sind die digitale Reservierungsannahme von {{businessName}}. Nehmen Sie Tischreservierungen entgegen: Name, Personenzahl, Datum, Uhrzeit, Sonderwünsche. Bestätigen Sie die Reservierung am Ende.",
  restaurant_order:
    "Sie sind die Bestellannahme von {{businessName}}. Nehmen Sie Bestellungen telefonisch auf, klären Sie Adresse, Zahlungsart und Lieferzeit. Wiederholen Sie die Bestellung zur Bestätigung.",
  clinic:
    "Sie sind die digitale Praxisassistenz. Buchen Sie Termine, beantworten Sie organisatorische Fragen, geben Sie aber keine medizinische Beratung. Bei Notfällen verweisen Sie auf 112.",
  hotel:
    "Sie sind die digitale Rezeption von {{businessName}}. Beantworten Sie Fragen zu Zimmerverfügbarkeit, Anreise, Frühstückszeiten und Lage. Bei Buchungen erfassen Sie Name, Zeitraum, Zimmertyp.",
};

const STATUS_OPTIONS: { value: AgentFormValues["status"]; label: string }[] = [
  { value: "draft", label: "Entwurf" },
  { value: "active", label: "Aktiv" },
  { value: "paused", label: "Pausiert" },
];

export default function AgentForm({
  agent,
  tenantId,
  token,
  onSaved,
}: AgentFormProps) {
  const [values, setValues] = useState<AgentFormValues>({
    name: agent?.name ?? "",
    displayName: agent?.displayName ?? "",
    language: agent?.language ?? "de",
    promptTemplate: agent?.promptTemplate ?? "generic_receptionist",
    voiceId: agent?.voiceId ?? "",
    systemPrompt:
      agent?.systemPrompt ??
      PROMPT_TEMPLATES_DEFAULT["generic_receptionist"] ??
      "",
    maxDurationSeconds: agent?.maxDurationSeconds ?? 600,
    status: (agent?.status as AgentFormValues["status"]) ?? "draft",
    llmModel: agent?.llmModel ?? "gpt-5-mini",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const isEdit = Boolean(agent?.id);
  const hasProvider = Boolean(agent?.providerAgentId);

  const update = <K extends keyof AgentFormValues>(
    key: K,
    value: AgentFormValues[K],
  ) => setValues((p) => ({ ...p, [key]: value }));

  const regeneratePrompt = () => {
    const tmpl = PROMPT_TEMPLATES_DEFAULT[values.promptTemplate];
    if (tmpl) update("systemPrompt", tmpl);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit
        ? `/api/voice/${tenantId}/agents/${agent!.id}?token=${encodeURIComponent(token)}`
        : `/api/voice/${tenantId}/agents?token=${encodeURIComponent(token)}`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const saved = (await res.json()) as AgentLike;
      onSaved?.(saved);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* ---------- Identity row ---------- */}
      <div className="panel flex flex-col gap-5 px-5 py-5">
        <SectionTitle
          title="Identität"
          subtitle="Wie der Agent intern und nach außen heißt"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Interner Name" required>
            <input
              required
              type="text"
              className="field"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="z.B. Rezeption Berlin"
            />
          </Field>
          <Field label="Anzeigename" required>
            <input
              required
              type="text"
              className="field"
              value={values.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              placeholder="z.B. Maya"
            />
          </Field>
          <Field label="Sprache">
            <select
              className="field"
              value={values.language}
              onChange={(e) => update("language", e.target.value)}
            >
              {Object.entries(LANGUAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              className="field"
              value={values.status}
              onChange={(e) =>
                update("status", e.target.value as AgentFormValues["status"])
              }
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* ---------- Behavior row ---------- */}
      <div className="panel flex flex-col gap-5 px-5 py-5">
        <SectionTitle
          title="Verhalten"
          subtitle="Vorlage, Stimme und Anrufgrenzen"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Vorlage">
            <select
              className="field"
              value={values.promptTemplate}
              onChange={(e) => update("promptTemplate", e.target.value)}
            >
              {Object.entries(PROMPT_TEMPLATE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stimme (Retell voice ID)">
            <input
              type="text"
              className="field font-mono text-[12px]"
              value={values.voiceId}
              onChange={(e) => update("voiceId", e.target.value)}
              placeholder="11labs-Adrian-de"
            />
          </Field>
          <Field label="Maximale Dauer (Sekunden)">
            <input
              type="number"
              min={60}
              max={3600}
              className="field font-mono text-[12px] tabular-nums"
              value={values.maxDurationSeconds}
              onChange={(e) =>
                update(
                  "maxDurationSeconds",
                  Math.max(60, Number(e.target.value) || 600),
                )
              }
            />
          </Field>
          <Field label="LLM-Modell">
            <select
              className="field"
              value={values.llmModel}
              onChange={(e) => update("llmModel", e.target.value)}
            >
              {LLM_MODELS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* ---------- System prompt ---------- */}
      <div className="panel flex flex-col gap-3 px-5 py-5">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="System-Prompt"
            subtitle="Diese Anweisung formt die Persönlichkeit des Agenten"
          />
          <button
            type="button"
            onClick={regeneratePrompt}
            className="btn btn-ghost btn-sm"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Regenerieren
          </button>
        </div>
        <textarea
          className="field min-h-[300px] resize-y font-mono text-[12px] leading-relaxed"
          value={values.systemPrompt}
          onChange={(e) => update("systemPrompt", e.target.value)}
          placeholder="Definieren Sie den Charakter, die Sprache und die Gesprächsregeln…"
        />
        <p className="meta text-[10px] text-ink-400">
          Platzhalter wie <span className="font-mono normal-case">{"{{businessName}}"}</span> werden zur Laufzeit ersetzt.
        </p>
      </div>

      {/* ---------- Footer actions ---------- */}
      {error && (
        <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-4 py-3 text-[12px] text-signal-err">
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div className="rounded-md border border-signal-ok/30 bg-signal-ok/[0.08] px-4 py-3 text-[12px] text-signal-ok">
          ✓ Gespeichert.
        </div>
      )}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : hasProvider ? (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Save className="h-3.5 w-3.5" aria-hidden />
          )}
          {hasProvider ? "Speichern" : "Speichern"}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="font-display text-[14px] font-medium text-ink">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[12px] text-ink-400">{subtitle}</p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
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
