"use client";

/**
 * BusinessHoursGrid — 7-row grid (Mo–So) for editing weekly business hours +
 * AI mode per day. Stateful component; emits a normalized array via onSave.
 *
 * Schema mapping:
 *   dayOfWeek: 0=Sunday .. 6=Saturday (JS Date.getDay() convention).
 *   The visual order is Mon..Sun; we map [1,2,3,4,5,6,0] → display rows.
 */

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { WEEKDAYS_DE_LONG, WEEKDAYS_DE_SHORT } from "./format";
import { cn } from "@/lib/utils";

export type AiMode = "always_on" | "outside_hours" | "overflow" | "manual_off";

export interface BusinessHourRow {
  /** 0=Sun..6=Sat per JS Date convention. */
  dayOfWeek: number;
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
  isClosed: boolean;
  aiMode: AiMode;
}

interface BusinessHoursGridProps {
  hours: BusinessHourRow[];
  onSave: (rows: BusinessHourRow[]) => void | Promise<void>;
  loading?: boolean;
}

const AI_MODE_OPTIONS: { value: AiMode; label: string; hint: string }[] = [
  { value: "always_on", label: "Immer aktiv", hint: "KI nimmt alle Anrufe an" },
  {
    value: "outside_hours",
    label: "Nur außerhalb",
    hint: "KI antwortet nur außerhalb der Öffnungszeiten",
  },
  {
    value: "overflow",
    label: "Überlauf",
    hint: "KI übernimmt nur, wenn besetzt oder unbeantwortet",
  },
  { value: "manual_off", label: "Manuell aus", hint: "KI ist deaktiviert" },
];

// Display order: Mon..Sun. Convert from JS Date convention (0=Sun..6=Sat).
const DISPLAY_ORDER: number[] = [1, 2, 3, 4, 5, 6, 0];

function emptyRowFor(dayOfWeek: number): BusinessHourRow {
  return {
    dayOfWeek,
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: dayOfWeek === 0, // default Sun closed
    aiMode: "always_on",
  };
}

export default function BusinessHoursGrid({
  hours,
  onSave,
  loading = false,
}: BusinessHoursGridProps) {
  const [rows, setRows] = useState<BusinessHourRow[]>(() =>
    DISPLAY_ORDER.map(
      (dow) => hours.find((h) => h.dayOfWeek === dow) ?? emptyRowFor(dow),
    ),
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setRows(
      DISPLAY_ORDER.map(
        (dow) => hours.find((h) => h.dayOfWeek === dow) ?? emptyRowFor(dow),
      ),
    );
    setDirty(false);
  }, [hours]);

  const update = (idx: number, patch: Partial<BusinessHourRow>) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
    setDirty(true);
  };

  const handleSave = async () => {
    await onSave(rows);
    setDirty(false);
  };

  return (
    <section className="panel overflow-hidden p-0">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <h3 className="font-display text-[14px] font-medium text-ink">
            Wochenplan
          </h3>
          <p className="meta mt-0.5 text-[10px] text-ink-400">
            Zeiten in 24-Stunden-Format · Lokale Zeitzone
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !dirty}
          className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Speichert…
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" aria-hidden />
              Speichern
            </>
          )}
        </button>
      </header>

      <ul className="divide-y divide-line">
        {rows.map((row, idx) => {
          const longLabel =
            WEEKDAYS_DE_LONG[(idx + 0) % 7]; // idx 0..6 = Mon..Sun visually
          // Convert displayed index back to short label (display is Mon..Sun)
          const shortLabel = WEEKDAYS_DE_SHORT[idx];
          return (
            <li
              key={row.dayOfWeek}
              className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[80px_120px_1fr_240px] md:items-center"
            >
              {/* Day label */}
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[14px] font-medium text-ink">
                  {shortLabel}
                </span>
                <span className="text-[11px] text-ink-400">{longLabel}</span>
              </div>

              {/* Open / Closed toggle */}
              <Toggle
                value={!row.isClosed}
                onChange={(v) => update(idx, { isClosed: !v })}
                onLabel="Geöffnet"
                offLabel="Geschlossen"
              />

              {/* Time pickers */}
              <div className="flex items-center gap-2">
                <TimeField
                  value={row.openTime}
                  disabled={row.isClosed}
                  onChange={(v: string) => update(idx, { openTime: v })}
                  aria-label={`${longLabel} Öffnung`}
                />
                <span className="text-ink-400">–</span>
                <TimeField
                  value={row.closeTime}
                  disabled={row.isClosed}
                  onChange={(v: string) => update(idx, { closeTime: v })}
                  aria-label={`${longLabel} Schließung`}
                />
              </div>

              {/* AI mode select */}
              <select
                value={row.aiMode}
                onChange={(e) =>
                  update(idx, { aiMode: e.target.value as AiMode })
                }
                className="field h-10 py-0 text-[12px]"
                aria-label={`${longLabel} KI-Modus`}
              >
                {AI_MODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TimeField({
  value,
  disabled,
  onChange,
  ...rest
}: {
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "field h-10 w-[110px] py-0 font-mono text-[12px] tabular-nums",
        disabled && "opacity-40",
      )}
      {...rest}
    />
  );
}

function Toggle({
  value,
  onChange,
  onLabel,
  offLabel,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] transition-colors",
        value
          ? "border-signal-ok/30 bg-signal-ok/[0.10] text-signal-ok"
          : "border-line bg-bg-2 text-ink-400 hover:text-ink-300",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-pill",
          value ? "bg-signal-ok" : "bg-ink-400",
        )}
      />
      {value ? onLabel : offLabel}
    </button>
  );
}
