"use client";

/**
 * HandoffRuleList — manages VoiceHandoffRule entries: keyword/sentiment
 * triggers that escalate the call to a human (transfer, SMS, email, callback
 * task).
 */

import { useState } from "react";
import {
  GitBranch,
  Loader2,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HandoffRule {
  id: string;
  name: string;
  isActive: boolean;
  triggerType: string;
  triggerValue: string | null;
  actionType: string;
  actionConfig: Record<string, unknown>;
  sortOrder: number;
}

interface HandoffRuleListProps {
  rules: HandoffRule[];
  tenantId: string;
  token: string;
  onUpdate?: () => void;
}

const TRIGGER_TYPES: { value: string; label: string; hint: string }[] = [
  {
    value: "keyword",
    label: "Stichwort",
    hint: "Anrufer sagt eines dieser Wörter",
  },
  {
    value: "sentiment",
    label: "Stimmung",
    hint: "Negative Stimmung erkannt",
  },
  { value: "duration", label: "Anrufdauer", hint: "Anruf länger als X Sekunden" },
  { value: "dtmf", label: "Tastendruck", hint: "Anrufer drückt eine Taste" },
  { value: "topic", label: "Thema", hint: "Bestimmtes Anliegen erkannt" },
];

const ACTION_TYPES: { value: string; label: string }[] = [
  { value: "transfer_call", label: "Anruf weiterleiten" },
  { value: "send_sms", label: "SMS senden" },
  { value: "send_email", label: "E-Mail senden" },
  { value: "create_callback_task", label: "Rückruf-Aufgabe" },
];

const TRIGGER_LABEL = Object.fromEntries(
  TRIGGER_TYPES.map((t) => [t.value, t.label]),
);
const ACTION_LABEL = Object.fromEntries(
  ACTION_TYPES.map((a) => [a.value, a.label]),
);

interface NewRuleDraft {
  name: string;
  triggerType: string;
  triggerValue: string;
  actionType: string;
  transferNumber: string;
  emailTo: string;
}

const EMPTY_DRAFT: NewRuleDraft = {
  name: "",
  triggerType: "keyword",
  triggerValue: "",
  actionType: "transfer_call",
  transferNumber: "",
  emailTo: "",
};

export default function HandoffRuleList({
  rules,
  tenantId,
  token,
  onUpdate,
}: HandoffRuleListProps) {
  const [draft, setDraft] = useState<NewRuleDraft>(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const actionConfig: Record<string, string> = {};
      if (draft.actionType === "transfer_call" && draft.transferNumber.trim()) {
        actionConfig.transferNumber = draft.transferNumber.trim();
      }
      if (draft.actionType === "send_email" && draft.emailTo.trim()) {
        actionConfig.emailTo = draft.emailTo.trim();
      }
      const res = await fetch(
        `/api/voice/${tenantId}/handoff-rules${tokenQuery}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draft.name.trim(),
            triggerType: draft.triggerType,
            triggerValue: draft.triggerValue.trim() || null,
            actionType: draft.actionType,
            actionConfig,
            isActive: true,
          }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDraft(EMPTY_DRAFT);
      setShowForm(false);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (rule: HandoffRule) => {
    setBusyId(rule.id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/handoff-rules/${rule.id}${tokenQuery}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !rule.isActive }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aktualisierung fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (rule: HandoffRule) => {
    if (!confirm(`Regel "${rule.name}" löschen?`)) return;
    setBusyId(rule.id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/handoff-rules/${rule.id}${tokenQuery}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-[14px] font-medium text-ink">
            Weiterleitungsregeln
          </h3>
          <p className="mt-0.5 text-[12px] text-ink-400">
            Regeln werden in Reihenfolge geprüft — die erste passende greift.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn btn-ghost btn-sm"
        >
          {showForm ? (
            <>
              <X className="h-3.5 w-3.5" aria-hidden />
              Abbrechen
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Regel hinzufügen
            </>
          )}
        </button>
      </div>

      {/* ---------- New rule form ---------- */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="panel flex flex-col gap-4 px-5 py-5"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Name" required>
              <input
                type="text"
                required
                className="field"
                placeholder="z.B. Wütende Anrufer"
                value={draft.name}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>
            <Field label="Auslöser-Typ">
              <select
                className="field"
                value={draft.triggerType}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, triggerType: e.target.value }))
                }
              >
                {TRIGGER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Auslöser-Wert" className="md:col-span-2">
              <input
                type="text"
                className="field font-mono text-[12px]"
                placeholder={
                  draft.triggerType === "keyword"
                    ? "Stichwort (z.B. Beschwerde, Reklamation)"
                    : draft.triggerType === "duration"
                    ? "Sekunden (z.B. 240)"
                    : "Wert"
                }
                value={draft.triggerValue}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, triggerValue: e.target.value }))
                }
              />
            </Field>
            <Field label="Aktion">
              <select
                className="field"
                value={draft.actionType}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, actionType: e.target.value }))
                }
              >
                {ACTION_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
            {draft.actionType === "transfer_call" && (
              <Field label="Weiterleitungsnummer">
                <input
                  type="tel"
                  className="field font-mono text-[12px]"
                  placeholder="+49 30 12345678"
                  value={draft.transferNumber}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      transferNumber: e.target.value,
                    }))
                  }
                />
              </Field>
            )}
            {draft.actionType === "send_email" && (
              <Field label="E-Mail-Empfänger">
                <input
                  type="email"
                  className="field font-mono text-[12px]"
                  placeholder="team@example.com"
                  value={draft.emailTo}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, emailTo: e.target.value }))
                  }
                />
              </Field>
            )}
          </div>
          {error && (
            <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
              {error}
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              type="submit"
              disabled={submitting || !draft.name.trim()}
              className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-3.5 w-3.5" aria-hidden />
              )}
              Regel speichern
            </button>
          </div>
        </form>
      )}

      {/* ---------- Rules list ---------- */}
      {rules.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 px-6 py-12 text-center">
          <GitBranch className="h-6 w-6 text-ink-400" aria-hidden />
          <p className="text-[13px] text-ink-300">
            Noch keine Weiterleitungsregeln definiert.
          </p>
          <p className="max-w-sm text-[11px] text-ink-400">
            Standardmäßig führt die KI alle Anrufe selbst.
          </p>
        </div>
      ) : (
        <ul className="panel divide-y divide-line p-0">
          {rules
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((rule, idx) => {
              const transferNumber = (rule.actionConfig as { transferNumber?: string }).transferNumber;
              const emailTo = (rule.actionConfig as { emailTo?: string }).emailTo;
              return (
                <li
                  key={rule.id}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="meta inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md border border-line bg-bg-2 px-2 text-[10px] tabular-nums text-ink-300">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-[13px] font-medium text-ink">
                        {rule.name}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-400">
                        <span className="inline-flex items-center gap-1 rounded-pill border border-line bg-bg-2 px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight">
                          {TRIGGER_LABEL[rule.triggerType] ?? rule.triggerType}
                          {rule.triggerValue && (
                            <span className="text-ink-300">
                              · {rule.triggerValue}
                            </span>
                          )}
                        </span>
                        <span className="text-ink-400">→</span>
                        <span className="inline-flex items-center gap-1 rounded-pill border border-line-hot bg-copper-500/[0.08] px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight text-copper-300">
                          {ACTION_LABEL[rule.actionType] ?? rule.actionType}
                          {transferNumber && (
                            <span className="normal-case tracking-normal text-copper-200">
                              · {transferNumber}
                            </span>
                          )}
                          {emailTo && (
                            <span className="normal-case tracking-normal text-copper-200">
                              · {emailTo}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(rule)}
                      disabled={busyId === rule.id}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] transition-colors",
                        rule.isActive
                          ? "border-signal-ok/30 bg-signal-ok/[0.08] text-signal-ok hover:bg-signal-ok/[0.14]"
                          : "border-line bg-bg-2 text-ink-400 hover:text-ink-300",
                        busyId === rule.id && "opacity-50",
                      )}
                    >
                      {rule.isActive ? (
                        <ToggleRight className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <ToggleLeft className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {rule.isActive ? "Aktiv" : "Inaktiv"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rule)}
                      disabled={busyId === rule.id}
                      className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-ink-400 transition-colors hover:border-signal-err/50 hover:bg-signal-err/[0.08] hover:text-signal-err disabled:opacity-50"
                      aria-label={`${rule.name} löschen`}
                    >
                      {busyId === rule.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                      ) : (
                        <Trash2 className="h-3 w-3" aria-hidden />
                      )}
                    </button>
                  </div>
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
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
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
