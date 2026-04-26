"use client";

/**
 * CallActions — small action group rendered inside the call detail page's
 * summary card. Exposes "Zusammenfassung neu generieren" and an optional
 * "Termin erstellen" button when the outcome warrants it.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2, Sparkles } from "lucide-react";

interface CallActionsProps {
  callId: string;
  tenantId: string;
  token: string;
  hasAppointmentOpportunity: boolean;
}

export default function CallActions({
  callId,
  tenantId,
  token,
  hasAppointmentOpportunity,
}: CallActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<"summary" | "appointment" | null>(null);
  const [, startTransition] = useTransition();
  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const regenerate = async () => {
    setBusy("summary");
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/calls/${callId}/summarize${tokenQ}`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      startTransition(() => router.refresh());
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Zusammenfassung konnte nicht erstellt werden.",
      );
    } finally {
      setBusy(null);
    }
  };

  const createAppointment = async () => {
    setBusy("appointment");
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/calls/${callId}/create-appointment${tokenQ}`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      startTransition(() => router.refresh());
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Termin konnte nicht erstellt werden.",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={regenerate}
        disabled={busy !== null}
        className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-ink-300 transition-colors hover:border-line-firm hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy === "summary" ? (
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="h-3 w-3" aria-hidden />
        )}
        Neu generieren
      </button>
      {hasAppointmentOpportunity && (
        <button
          type="button"
          onClick={createAppointment}
          disabled={busy !== null}
          className="inline-flex items-center gap-1 rounded-md border border-line-hot bg-copper-500/[0.10] px-2.5 py-1.5 text-[11px] text-copper-300 transition-colors hover:bg-copper-500/[0.16] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "appointment" ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          ) : (
            <CalendarPlus className="h-3 w-3" aria-hidden />
          )}
          Termin erstellen
        </button>
      )}
    </div>
  );
}
