"use client";

/**
 * AppointmentsForm — booking type selector + configuration fields per type.
 *
 * Booking types:
 *   email_request   — no API needed, email lands in inbox
 *   direct_cal      — full Cal.com integration, real-time slot availability
 *   phone_callback  — agent confirms via callback (operator side)
 *   direct_url      — agent verbally provides booking URL
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  PhoneCall,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookingType =
  | "email_request"
  | "direct_cal"
  | "phone_callback"
  | "direct_url";

interface RuleData {
  id: string;
  name: string;
  isActive: boolean;
  bookingType: string;
  calApiKey: string | null;
  calEventTypeId: number | null;
  bookingUrl: string | null;
  bufferMinutes: number;
  minNoticeMinutes: number;
  maxDaysAhead: number;
  slotDurationMin: number;
  conflictPolicy: string;
  confirmationMsg: string | null;
}

interface AppointmentsFormProps {
  tenantId: string;
  token: string;
  rule: RuleData | null;
  hasCalCom: boolean;
}

const BOOKING_TYPES: {
  value: BookingType;
  title: string;
  description: string;
  icon: typeof Mail;
  badge?: string;
  apiRequired?: boolean;
}[] = [
  {
    value: "email_request",
    title: "Per E-Mail Anfrage",
    description:
      "Der Agent erfasst Wunschtermin + Kontaktdaten und schickt Ihnen eine E-Mail. Keine API nötig — sofort einsatzbereit.",
    icon: Mail,
    badge: "Keine API nötig",
  },
  {
    value: "direct_cal",
    title: "Per Cal.com",
    description:
      "Der Agent prüft Verfügbarkeit live und bucht direkt in Ihren Cal.com-Kalender. Benötigt API-Key.",
    icon: Calendar,
    badge: "Empfohlen",
    apiRequired: true,
  },
  {
    value: "phone_callback",
    title: "Per Rückruf",
    description:
      "Der Agent erfasst Wunsch und kündigt einen Rückruf an. Sie bestätigen telefonisch.",
    icon: PhoneCall,
  },
  {
    value: "direct_url",
    title: "Direkte URL",
    description:
      "Der Agent nennt eine Buchungs-URL (z.B. Calendly) und versendet sie per SMS.",
    icon: Globe,
  },
];

const CONFLICT_POLICIES: { value: string; label: string }[] = [
  { value: "offer_next", label: "Nächsten freien Slot anbieten" },
  { value: "reject", label: "Ablehnen" },
  { value: "waitlist", label: "Warteliste" },
];

export default function AppointmentsForm({
  tenantId,
  token,
  rule,
  hasCalCom,
}: AppointmentsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: rule?.name ?? "Standard-Buchung",
    isActive: rule?.isActive ?? true,
    bookingType: (rule?.bookingType as BookingType) ?? "email_request",
    calApiKey: rule?.calApiKey ?? "",
    calEventTypeId: rule?.calEventTypeId ?? 0,
    bookingUrl: rule?.bookingUrl ?? "",
    bufferMinutes: rule?.bufferMinutes ?? 15,
    minNoticeMinutes: rule?.minNoticeMinutes ?? 60,
    maxDaysAhead: rule?.maxDaysAhead ?? 30,
    slotDurationMin: rule?.slotDurationMin ?? 60,
    conflictPolicy: rule?.conflictPolicy ?? "offer_next",
    confirmationMsg:
      rule?.confirmationMsg ??
      "Vielen Dank! Ihr Termin wurde vorgemerkt. Sie erhalten eine Bestätigung per E-Mail.",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

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
      const res = await fetch(
        rule
          ? `/api/voice/${tenantId}/appointment-rules/${rule.id}${tokenQ}`
          : `/api/voice/${tenantId}/appointment-rules${tokenQ}`,
        {
          method: rule ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
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
      {/* ---------- Booking type selector ---------- */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-[14px] font-medium text-ink">
          Buchungsart
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {BOOKING_TYPES.map((t) => {
            const Icon = t.icon;
            const isSelected = values.bookingType === t.value;
            const isCalAndMissing = t.value === "direct_cal" && !hasCalCom;
            return (
              <label
                key={t.value}
                className={cn(
                  "panel relative flex cursor-pointer flex-col gap-2 px-5 py-4 transition-all",
                  isSelected
                    ? "border-line-hot ring-1 ring-copper-500/40"
                    : "hover:border-line-firm",
                )}
              >
                <input
                  type="radio"
                  name="bookingType"
                  value={t.value}
                  checked={isSelected}
                  onChange={() => update("bookingType", t.value)}
                  className="sr-only"
                />
                {isSelected && (
                  <CheckCircle2
                    className="absolute right-3 top-3 h-4 w-4 text-copper-400"
                    aria-hidden
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    aria-hidden
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-md border text-[14px]",
                      isSelected
                        ? "border-line-hot bg-copper-500/[0.12] text-copper-300"
                        : "border-line bg-bg-2 text-ink-400",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-display text-[14px] font-medium text-ink">
                    {t.title}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-ink-300">
                  {t.description}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-1">
                  {t.badge && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-pill border px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight",
                        t.badge === "Keine API nötig"
                          ? "border-signal-ok/30 bg-signal-ok/[0.08] text-signal-ok"
                          : "border-line-hot bg-copper-500/[0.08] text-copper-300",
                      )}
                    >
                      {t.badge}
                    </span>
                  )}
                  {isCalAndMissing && (
                    <span className="inline-flex items-center rounded-pill border border-signal-warn/30 bg-signal-warn/[0.08] px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight text-signal-warn">
                      Cal.com nicht verbunden
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* ---------- Type-specific configuration ---------- */}
      {values.bookingType === "direct_cal" && (
        <section className="panel flex flex-col gap-4 px-5 py-5">
          <h3 className="font-display text-[14px] font-medium text-ink">
            Cal.com-Konfiguration
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="API-Key">
              <input
                type="password"
                className="field font-mono text-[12px]"
                placeholder="cal_live_…"
                value={values.calApiKey ?? ""}
                onChange={(e) => update("calApiKey", e.target.value)}
              />
            </Field>
            <Field label="Event-Type-ID">
              <input
                type="number"
                className="field font-mono text-[12px] tabular-nums"
                placeholder="123456"
                value={values.calEventTypeId || ""}
                onChange={(e) =>
                  update("calEventTypeId", Number(e.target.value) || 0)
                }
              />
            </Field>
          </div>
        </section>
      )}

      {values.bookingType === "direct_url" && (
        <section className="panel flex flex-col gap-4 px-5 py-5">
          <h3 className="font-display text-[14px] font-medium text-ink">
            Buchungs-URL
          </h3>
          <Field label="Öffentliche URL">
            <input
              type="url"
              className="field font-mono text-[12px]"
              placeholder="https://calendly.com/firma/30min"
              value={values.bookingUrl ?? ""}
              onChange={(e) => update("bookingUrl", e.target.value)}
            />
          </Field>
        </section>
      )}

      {/* ---------- Common settings ---------- */}
      <section className="panel flex flex-col gap-4 px-5 py-5">
        <h3 className="font-display text-[14px] font-medium text-ink">
          Buchungseinstellungen
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Slot-Dauer (Min.)">
            <input
              type="number"
              min={15}
              max={240}
              className="field font-mono text-[12px] tabular-nums"
              value={values.slotDurationMin}
              onChange={(e) =>
                update("slotDurationMin", Number(e.target.value) || 60)
              }
            />
          </Field>
          <Field label="Puffer (Min.)">
            <input
              type="number"
              min={0}
              max={120}
              className="field font-mono text-[12px] tabular-nums"
              value={values.bufferMinutes}
              onChange={(e) =>
                update("bufferMinutes", Number(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Vorlauf (Min.)">
            <input
              type="number"
              min={0}
              className="field font-mono text-[12px] tabular-nums"
              value={values.minNoticeMinutes}
              onChange={(e) =>
                update("minNoticeMinutes", Number(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Max. Tage voraus">
            <input
              type="number"
              min={1}
              max={365}
              className="field font-mono text-[12px] tabular-nums"
              value={values.maxDaysAhead}
              onChange={(e) =>
                update("maxDaysAhead", Number(e.target.value) || 30)
              }
            />
          </Field>
        </div>
        <Field label="Konfliktstrategie">
          <select
            className="field"
            value={values.conflictPolicy}
            onChange={(e) => update("conflictPolicy", e.target.value)}
          >
            {CONFLICT_POLICIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bestätigungstext">
          <textarea
            className="field min-h-[90px] resize-y text-[12px] leading-relaxed"
            value={values.confirmationMsg ?? ""}
            onChange={(e) => update("confirmationMsg", e.target.value)}
          />
        </Field>
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
