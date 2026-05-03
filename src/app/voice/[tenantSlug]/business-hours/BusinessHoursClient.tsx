"use client";

/**
 * BusinessHoursClient — wraps BusinessHoursGrid + a Holiday-overrides
 * editor + the AI-mode info card.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarOff, Loader2, Plus, Trash2 } from "lucide-react";
import BusinessHoursGrid, {
  type BusinessHourRow,
} from "@/components/voice/dashboard/BusinessHoursGrid";

interface OverrideRow {
  id: string;
  overrideDate: string;
  overrideLabel: string;
  isClosed: boolean;
  openTime: string;
  closeTime: string;
}

interface BusinessHoursClientProps {
  tenantId: string;
  token: string;
  weekly: BusinessHourRow[];
  overrides: OverrideRow[];
}

const AI_MODE_DESCRIPTIONS = [
  {
    key: "always_on",
    label: "Immer aktiv",
    description:
      "Die KI nimmt jeden eingehenden Anruf entgegen — auch während Ihrer Öffnungszeiten.",
  },
  {
    key: "outside_hours",
    label: "Nur außerhalb der Öffnungszeiten",
    description:
      "Während der Öffnungszeiten beantworten Sie selbst; außerhalb springt die KI ein.",
  },
  {
    key: "overflow",
    label: "Überlauf",
    description:
      "Die KI übernimmt nur, wenn Ihr Hauptanschluss besetzt oder unbeantwortet ist.",
  },
  {
    key: "manual_off",
    label: "Manuell aus",
    description:
      "Die KI ist deaktiviert. Sinnvoll für Wartung oder Schließtage.",
  },
];

export default function BusinessHoursClient({
  tenantId,
  token,
  weekly,
  overrides,
}: BusinessHoursClientProps) {
  const router = useRouter();
  const [savingHours, setSavingHours] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);

  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [submittingOverride, setSubmittingOverride] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [overrideDraft, setOverrideDraft] = useState({
    overrideDate: "",
    overrideLabel: "",
    isClosed: true,
    openTime: "09:00",
    closeTime: "18:00",
  });

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const saveHours = async (rows: BusinessHourRow[]) => {
    setSavingHours(true);
    setHoursError(null);
    try {
      // The API expects a bare array of weekly rows (PutBodyZ = z.array(...)),
      // not a wrapper object. Sending { weekly: rows } produced a 400.
      const payload = rows.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        openTime: r.openTime,
        closeTime: r.closeTime,
        isClosed: r.isClosed,
        aiMode: r.aiMode,
      }));
      const res = await fetch(
        `/api/voice/${tenantId}/business-hours${tokenQ}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setHoursError(
        err instanceof Error ? err.message : "Speichern fehlgeschlagen",
      );
    } finally {
      setSavingHours(false);
    }
  };

  const submitOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDraft.overrideDate) return;
    setSubmittingOverride(true);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/business-hours/overrides${tokenQ}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(overrideDraft),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOverrideDraft({
        overrideDate: "",
        overrideLabel: "",
        isClosed: true,
        openTime: "09:00",
        closeTime: "18:00",
      });
      setShowOverrideForm(false);
      router.refresh();
    } catch (err) {
      setHoursError(
        err instanceof Error ? err.message : "Speichern fehlgeschlagen",
      );
    } finally {
      setSubmittingOverride(false);
    }
  };

  const removeOverride = async (id: string) => {
    if (!confirm("Sondertermin wirklich löschen?")) return;
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/business-hours/overrides/${id}${tokenQ}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setHoursError(
        err instanceof Error ? err.message : "Löschen fehlgeschlagen",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BusinessHoursGrid
        hours={weekly}
        onSave={saveHours}
        loading={savingHours}
      />
      {hoursError && (
        <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
          {hoursError}
        </div>
      )}

      {/* ---------- Holiday overrides ---------- */}
      <section className="panel overflow-hidden p-0">
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <div>
            <h3 className="font-display text-[14px] font-medium text-ink">
              Sondertermine
            </h3>
            <p className="meta mt-0.5 text-[10px] text-ink-400">
              Feiertage, Schließtage, einmalige Sonderöffnungszeiten
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowOverrideForm((v) => !v)}
            className="btn btn-ghost btn-sm"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Sondertermin
          </button>
        </header>

        {showOverrideForm && (
          <form
            onSubmit={submitOverride}
            className="grid grid-cols-1 gap-3 border-b border-line bg-bg-2 px-5 py-4 md:grid-cols-[160px_1fr_120px_auto]"
          >
            <input
              required
              type="date"
              value={overrideDraft.overrideDate}
              onChange={(e) =>
                setOverrideDraft((p) => ({
                  ...p,
                  overrideDate: e.target.value,
                }))
              }
              className="field h-10 py-0 text-[12px]"
              aria-label="Datum"
            />
            <input
              type="text"
              placeholder="Label (z.B. Tag der Deutschen Einheit)"
              value={overrideDraft.overrideLabel}
              onChange={(e) =>
                setOverrideDraft((p) => ({
                  ...p,
                  overrideLabel: e.target.value,
                }))
              }
              className="field h-10 py-0 text-[12px]"
              aria-label="Label"
            />
            <select
              value={overrideDraft.isClosed ? "closed" : "open"}
              onChange={(e) =>
                setOverrideDraft((p) => ({
                  ...p,
                  isClosed: e.target.value === "closed",
                }))
              }
              className="field h-10 py-0 text-[12px]"
              aria-label="Geschlossen / Geöffnet"
            >
              <option value="closed">Geschlossen</option>
              <option value="open">Geöffnet</option>
            </select>
            <button
              type="submit"
              disabled={submittingOverride || !overrideDraft.overrideDate}
              className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submittingOverride ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-3.5 w-3.5" aria-hidden />
              )}
              Speichern
            </button>
          </form>
        )}

        {overrides.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <CalendarOff className="h-5 w-5 text-ink-400" aria-hidden />
            <p className="text-[13px] text-ink-300">
              Keine Sondertermine hinterlegt
            </p>
            <p className="max-w-sm text-[11px] text-ink-400">
              Hinterlegen Sie Feiertage und Schließtage, damit die KI angemessen reagiert.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {overrides.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[12px] tabular-nums text-ink">
                    {o.overrideDate}
                  </span>
                  <span className="text-[12px] text-ink-300">
                    {o.overrideLabel || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-pill border px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight",
                      o.isClosed
                        ? "border-signal-err/30 bg-signal-err/[0.08] text-signal-err"
                        : "border-signal-ok/30 bg-signal-ok/[0.08] text-signal-ok",
                    ].join(" ")}
                  >
                    {o.isClosed ? "Geschlossen" : "Geöffnet"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOverride(o.id)}
                    disabled={busyId === o.id}
                    className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2 py-1 text-[11px] text-ink-400 hover:border-signal-err/50 hover:bg-signal-err/[0.08] hover:text-signal-err disabled:opacity-50"
                  >
                    {busyId === o.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                    ) : (
                      <Trash2 className="h-3 w-3" aria-hidden />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- AI mode info card ---------- */}
      <section className="panel flex flex-col gap-4 px-5 py-5">
        <div>
          <span className="meta text-[10px] text-ink-400">
            KI-Modi erklärt
          </span>
          <h3 className="mt-1 font-display text-[14px] font-medium text-ink">
            Wann übernimmt die KI Ihre Anrufe?
          </h3>
        </div>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {AI_MODE_DESCRIPTIONS.map((mode) => (
            <li
              key={mode.key}
              className="rounded-md border border-line bg-bg-2 px-4 py-3"
            >
              <div className="font-display text-[13px] font-medium text-ink">
                {mode.label}
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-300">
                {mode.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
