"use client";

/**
 * PhoneNumbersClient — table of numbers + slide-in add form (no Modal lib;
 * we use a slide-down panel above the table). Also renders the four
 * connection modes info card.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Phone,
  PhoneIncoming,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { cn } from "@/lib/utils";

interface PhoneRow {
  id: string;
  e164Number: string;
  friendlyName: string | null;
  status: string;
  country: string;
  providerPhoneId: string | null;
  agent: { id: string; displayName: string } | null;
}

interface PhoneNumbersClientProps {
  tenantId: string;
  token: string;
  numbers: PhoneRow[];
  agents: { id: string; displayName: string; status: string }[];
}

const CONNECTION_MODES = [
  {
    title: "Retell-Nummer",
    description:
      "Wir vergeben Ihnen eine deutsche Rufnummer direkt aus dem Pool. Schnellste Inbetriebnahme.",
    badge: "Empfohlen",
  },
  {
    title: "Weiterleitung",
    description:
      "Sie behalten Ihre bestehende Nummer und leiten unbeantwortete Anrufe an die KI weiter.",
    badge: "Bewährt",
  },
  {
    title: "SIP-Trunk",
    description:
      "Direkte SIP-Verbindung zu Ihrem Anbieter — für mittelgroße Telefonanlagen.",
    badge: "Profi",
  },
  {
    title: "Eigene Nummer (Portierung)",
    description:
      "Wir portieren Ihre Bestandsnummer und übernehmen den vollständigen Empfang.",
    badge: "Premium",
  },
];

export default function PhoneNumbersClient({
  tenantId,
  token,
  numbers,
  agents,
}: PhoneNumbersClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    e164Number: "",
    friendlyName: "",
    agentId: agents[0]?.id ?? "",
    country: "DE",
  });

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/voice/${tenantId}/phone-numbers${tokenQ}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setDraft({
        e164Number: "",
        friendlyName: "",
        agentId: agents[0]?.id ?? "",
        country: "DE",
      });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hinzufügen fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  const release = async (id: string) => {
    if (!confirm("Rufnummer wirklich freigeben?")) return;
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/phone-numbers/${id}${tokenQ}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Freigabe fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {/* ---------- Action bar ---------- */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[12px] text-ink-400">
          Verbinden Sie eine Rufnummer mit einem Agenten, um Anrufe entgegenzunehmen.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn btn-primary btn-sm"
        >
          {showForm ? (
            <>
              <X className="h-3.5 w-3.5" aria-hidden />
              Abbrechen
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Rufnummer hinzufügen
            </>
          )}
        </button>
      </div>

      {/* ---------- Add form ---------- */}
      {showForm && (
        <form
          onSubmit={submit}
          className="panel mb-5 flex flex-col gap-4 px-5 py-5"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Rufnummer (E.164)" required>
              <input
                required
                type="tel"
                pattern="^\+[0-9]{6,20}$"
                className="field font-mono text-[12px]"
                placeholder="+49 30 12345678"
                value={draft.e164Number}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, e164Number: e.target.value }))
                }
              />
            </Field>
            <Field label="Anzeigename">
              <input
                type="text"
                className="field"
                placeholder="z.B. Hauptanschluss"
                value={draft.friendlyName}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, friendlyName: e.target.value }))
                }
              />
            </Field>
            <Field label="Verknüpfter Agent">
              <select
                className="field"
                value={draft.agentId}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, agentId: e.target.value }))
                }
              >
                {agents.length === 0 && (
                  <option value="">Kein Agent vorhanden</option>
                )}
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                    {a.status !== "active" ? ` · ${a.status}` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Land">
              <select
                className="field"
                value={draft.country}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, country: e.target.value }))
                }
              >
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                <option value="TR">Türkei</option>
              </select>
            </Field>
          </div>
          {error && (
            <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
              {error}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !draft.e164Number}
              className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-3.5 w-3.5" aria-hidden />
              )}
              Speichern
            </button>
          </div>
        </form>
      )}

      {/* ---------- Phone numbers table ---------- */}
      {numbers.length === 0 ? (
        <div className="panel mb-6 flex flex-col items-center gap-2 px-6 py-12 text-center">
          <Phone className="h-6 w-6 text-ink-400" aria-hidden />
          <p className="text-[13px] text-ink-300">
            Noch keine Rufnummer hinzugefügt
          </p>
          <p className="max-w-sm text-[11px] text-ink-400">
            Verbinden Sie Ihre erste Nummer, damit der Agent Anrufe entgegennehmen kann.
          </p>
        </div>
      ) : (
        <section className="panel mb-6 overflow-hidden p-0">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-ink-400">
                <Th>Nummer</Th>
                <Th>Anzeige</Th>
                <Th>Agent</Th>
                <Th>Land</Th>
                <Th>Status</Th>
                <Th align="right" />
              </tr>
            </thead>
            <tbody>
              {numbers.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-line-soft last:border-b-0 hover:bg-bg-2"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-mono text-[12px] tabular-nums text-ink">
                      <PhoneIncoming
                        className="h-3.5 w-3.5 text-copper-400"
                        aria-hidden
                      />
                      {n.e164Number}
                    </div>
                    {n.providerPhoneId && (
                      <div className="meta mt-0.5 text-[10px] text-ink-400">
                        ID:{" "}
                        <span className="font-mono normal-case tracking-normal">
                          {n.providerPhoneId.slice(0, 12)}…
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink-300">
                    {n.friendlyName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink-300">
                    {n.agent?.displayName ?? (
                      <span className="text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="meta text-[10px] text-ink-400">
                      {n.country}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <VoiceStatusBadge status={n.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => release(n.id)}
                      disabled={busyId === n.id}
                      className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2 py-1.5 text-[11px] text-ink-400 hover:border-signal-err/50 hover:bg-signal-err/[0.08] hover:text-signal-err disabled:opacity-50"
                    >
                      {busyId === n.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                      ) : (
                        <Trash2 className="h-3 w-3" aria-hidden />
                      )}
                      Freigeben
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ---------- Info: connection modes ---------- */}
      <section className="panel flex flex-col gap-4 px-5 py-5">
        <div>
          <span className="meta text-[10px] text-ink-400">
            Anschluss-Optionen
          </span>
          <h3 className="mt-1 font-display text-[14px] font-medium text-ink">
            So binden Sie Ihre Telefonanlage an
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CONNECTION_MODES.map((mode) => (
            <div
              key={mode.title}
              className="rounded-md border border-line bg-bg-2 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display text-[13px] font-medium text-ink">
                  {mode.title}
                </h4>
                <span className="inline-flex items-center rounded-pill border border-line-hot bg-copper-500/[0.08] px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight text-copper-300">
                  {mode.badge}
                </span>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-300">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Th({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "meta px-4 py-3 text-[10px] font-medium",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {children}
    </th>
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
