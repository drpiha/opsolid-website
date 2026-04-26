"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Phone,
  PhoneOutgoing,
} from "lucide-react";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { cn } from "@/lib/utils";

interface AgentLite {
  id: string;
  displayName: string;
  status: string;
  providerAgentId: string | null;
}

interface TestCallClientProps {
  tenantId: string;
  token: string;
  agents: AgentLite[];
  defaultPhone: string;
}

interface TestRunState {
  id: string;
  providerCallId: string | null;
  status: string;
}

const CHECKLIST_ITEMS: { id: string; label: string }[] = [
  { id: "ai-de", label: "KI antwortet auf Deutsch" },
  { id: "company", label: "KI nennt den Firmennamen" },
  { id: "disclosure", label: "KI nennt KI-Offenbarung" },
  { id: "hours", label: "Öffnungszeiten werden korrekt mitgeteilt" },
  { id: "kb-faq", label: "Fragen aus der Wissensbasis werden beantwortet" },
  { id: "appointment-detection", label: "Termin-Erkennung funktioniert" },
  { id: "appointment-booking", label: "Termin wird gebucht / weitergegeben" },
  { id: "order-detection", label: "Bestell-Intent wird erkannt" },
  { id: "transfer", label: "Weiterleitung funktioniert" },
  { id: "transfer-keyword", label: "Stichwort-Weiterleitung greift" },
  { id: "sentiment", label: "Negative Stimmung führt zur Eskalation" },
  { id: "language", label: "Mehrsprachigkeit / Sprachwechsel sauber" },
  { id: "interrupt", label: "Anrufer kann unterbrechen" },
  { id: "noise", label: "Lärm / Hintergrund stört nicht zu sehr" },
  { id: "voicemail", label: "Mailbox-Erkennung beendet Anruf sauber" },
  { id: "summary", label: "Zusammenfassung am Ende sinnvoll" },
  { id: "extracted", label: "Extrahierte Felder sind vollständig" },
  { id: "notification", label: "Benachrichtigung kommt an" },
  { id: "end-call", label: "Anruf wird korrekt beendet" },
  { id: "logging", label: "Anruf erscheint sofort im Protokoll" },
];

export default function TestCallClient({
  tenantId,
  token,
  agents,
  defaultPhone,
}: TestCallClientProps) {
  const [agentId, setAgentId] = useState(agents[0]?.id ?? "");
  const [phone, setPhone] = useState(defaultPhone);
  const [running, setRunning] = useState<TestRunState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Persist checklist progress per tenant in localStorage.
  const storageKey = `voice-checklist-${tenantId}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, storageKey]);

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/voice/${tenantId}/test-call${tokenQ}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, toNumber: phone }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const json = (await res.json()) as TestRunState;
      setRunning(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anruf konnte nicht gestartet werden");
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = (id: string) =>
    setChecked((p) => ({ ...p, [id]: !p[id] }));

  const reset = () => {
    setChecked({});
    setRunning(null);
  };

  const completed = Object.values(checked).filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* ---------- Trigger form ---------- */}
      <section className="panel flex flex-col gap-5 px-5 py-5">
        <h3 className="font-display text-[14px] font-medium text-ink">
          Test-Anruf auslösen
        </h3>

        <form onSubmit={start} className="flex flex-col gap-4">
          <Field label="Agent">
            <select
              required
              className="field"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              {agents.length === 0 && (
                <option value="">Kein Agent vorhanden</option>
              )}
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.displayName} · {a.status}
                  {a.providerAgentId ? "" : " (nicht synchronisiert)"}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Telefonnummer (E.164)" required>
            <input
              required
              type="tel"
              pattern="^\+[0-9]{6,20}$"
              className="field font-mono text-[12px]"
              placeholder="+49 30 12345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>

          {error && (
            <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !agentId || !phone}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <PhoneOutgoing className="h-4 w-4" aria-hidden />
            )}
            Test-Anruf starten
          </button>
        </form>

        {running && (
          <aside className="mt-2 flex flex-col gap-2 rounded-md border border-line-hot bg-copper-500/[0.06] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="meta text-[10px] text-copper-300">
                Aktiver Test
              </span>
              <VoiceStatusBadge status={running.status} />
            </div>
            <div className="font-mono text-[12px] tabular-nums text-ink">
              {running.providerCallId ?? running.id}
            </div>
            <p className="text-[12px] leading-relaxed text-ink-300">
              Sie sollten in wenigen Sekunden auf <span className="font-mono normal-case tracking-normal">{phone}</span> angerufen werden.
              Halten Sie Ihre Checkliste daneben offen.
            </p>
          </aside>
        )}
      </section>

      {/* ---------- 20-point checklist ---------- */}
      <section className="panel flex flex-col gap-3 px-5 py-5">
        <header className="flex items-center justify-between">
          <div>
            <span className="meta text-[10px] text-ink-400">Checkliste</span>
            <h3 className="mt-1 font-display text-[14px] font-medium text-ink">
              {completed} / {total} Punkte erledigt
            </h3>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-[11px] text-ink-400 transition-colors hover:text-ink-200"
          >
            Zurücksetzen
          </button>
        </header>

        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-bg-2">
          <div
            className="h-full rounded-pill bg-copper-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="grid grid-cols-1 gap-1 pt-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isDone = !!checked[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-[12px] transition-colors",
                    isDone
                      ? "border-signal-ok/20 bg-signal-ok/[0.06] text-ink-300"
                      : "border-line bg-bg-2 text-ink-200 hover:border-line-firm hover:bg-bg-3",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-signal-ok"
                      aria-hidden
                    />
                  ) : (
                    <Circle
                      className="h-4 w-4 shrink-0 text-ink-400 group-hover:text-copper-300"
                      aria-hidden
                    />
                  )}
                  <span className={cn(isDone && "line-through opacity-70")}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {agents.length === 0 && (
          <div className="mt-3 flex items-start gap-3 rounded-md border border-signal-warn/30 bg-signal-warn/[0.08] px-3 py-2 text-[12px] text-signal-warn">
            <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Es ist noch kein Agent angelegt. Erstellen Sie zuerst einen Agenten, um Test-Anrufe auszulösen.
            </span>
          </div>
        )}
      </section>
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
