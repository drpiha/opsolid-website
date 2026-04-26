"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, MapPin, Save, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceFormProps {
  tenantId: string;
  token: string;
  initial: {
    aiDisclosure: boolean;
    recordingEnabled: boolean;
    retentionDays: number;
    dpaStatus: "pending" | "signed" | "not_required";
    emergencyDivertEnabled: boolean;
  };
}

const DPA_STATUS_OPTIONS = [
  { value: "pending", label: "Ausstehend" },
  { value: "signed", label: "Unterzeichnet" },
  { value: "not_required", label: "Nicht erforderlich" },
] as const;

export default function ComplianceForm({
  tenantId,
  token,
  initial,
}: ComplianceFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/voice/${tenantId}/compliance${tokenQ}`, {
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

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="panel flex flex-col divide-y divide-line p-0">
        <ToggleRow
          locked
          checked
          title="KI-Offenbarungspflicht"
          description="Der Agent gibt zu Beginn jedes Anrufs an, dass es sich um eine KI handelt. Gesetzlich erforderlich (KI-VO)."
          icon={ShieldCheck}
        />
        <ToggleRow
          checked={values.recordingEnabled}
          onChange={(v) =>
            setValues((p) => ({ ...p, recordingEnabled: v }))
          }
          title="Anrufaufzeichnung"
          description="Audio-Mitschnitt zu Analyse- und Trainingszwecken. Standard: aus. Bei Aktivierung muss die Einwilligung beim Anrufer eingeholt werden."
        />
        <ToggleRow
          checked={values.emergencyDivertEnabled}
          onChange={(v) =>
            setValues((p) => ({ ...p, emergencyDivertEnabled: v }))
          }
          title="Notfallumleitung aktiviert"
          description="Bei Erwähnung von 112, 110 oder einer medizinischen Notlage wird sofort an einen Menschen oder das jeweilige Notrufsystem übergeben."
        />
      </section>

      <section className="panel flex flex-col gap-4 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Automatische Löschung nach (Tagen)">
            <input
              type="number"
              min={1}
              max={3650}
              className="field font-mono text-[12px] tabular-nums"
              value={values.retentionDays}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  retentionDays: Number(e.target.value) || 90,
                }))
              }
            />
            <span className="meta mt-1 text-[10px] text-ink-400">
              Empfehlung: 90 Tage. Maximalwert nach DSGVO-Erforderlichkeit prüfen.
            </span>
          </Field>
          <Field label="DPA / AVV-Status">
            <select
              className="field"
              value={values.dpaStatus}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  dpaStatus: e.target.value as
                    | "pending"
                    | "signed"
                    | "not_required",
                }))
              }
            >
              {DPA_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="panel flex items-start gap-3 px-5 py-5">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper-400" aria-hidden />
        <div>
          <h3 className="font-display text-[14px] font-medium text-ink">
            Speicherort der Daten
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-300">
            EU (Deutschland) &middot; Hostinger VPS Frankfurt. Audio, Transkripte
            und strukturierte Daten verlassen die Europäische Union nicht. Sub-Prozessoren werden im AVV einzeln aufgeführt.
          </p>
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

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  locked,
  icon: Icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
  icon?: typeof ShieldCheck;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon
            className="mt-0.5 h-4 w-4 shrink-0 text-copper-400"
            aria-hidden
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-display text-[13px] font-medium text-ink">
              {title}
            </h4>
            {locked && (
              <span className="inline-flex items-center gap-1 rounded-pill border border-line-hot bg-copper-500/[0.08] px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-tight text-copper-300">
                <Lock className="h-2.5 w-2.5" aria-hidden />
                Pflicht
              </span>
            )}
          </div>
          <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-ink-300">
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={locked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill border transition-colors",
          checked
            ? "border-copper-500/40 bg-copper-500/[0.18]"
            : "border-line bg-bg-2",
          locked && "cursor-not-allowed opacity-70",
        )}
      >
        <span
          className={cn(
            "absolute h-4 w-4 rounded-pill bg-ink-100 shadow-depth-1 transition-transform",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="meta text-[10px] text-ink-400">{label}</span>
      {children}
    </label>
  );
}
