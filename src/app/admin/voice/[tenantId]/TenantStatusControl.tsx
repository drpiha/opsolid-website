"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { cn } from "@/lib/utils";

interface TenantStatusControlProps {
  tenantId: string;
  currentStatus: string;
  adminToken: string;
}

const STATUSES: { value: string; label: string }[] = [
  { value: "trial", label: "Test" },
  { value: "active", label: "Aktiv" },
  { value: "suspended", label: "Gesperrt" },
  { value: "cancelled", label: "Storniert" },
];

export default function TenantStatusControl({
  tenantId,
  currentStatus,
  adminToken,
}: TenantStatusControlProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tokenQ = `?token=${encodeURIComponent(adminToken)}`;

  const update = async (next: string) => {
    if (next === currentStatus) return;
    setBusy(next);
    setError(null);
    try {
      const res = await fetch(`/api/voice/admin/tenants/${tenantId}${tokenQ}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aktualisierung fehlgeschlagen");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="panel flex flex-col gap-3 px-5 py-5">
      <header className="flex items-center justify-between">
        <h3 className="font-display text-[14px] font-medium text-ink">
          Status
        </h3>
        <VoiceStatusBadge status={currentStatus} />
      </header>
      <p className="text-[12px] leading-relaxed text-ink-300">
        Wechseln Sie den Status. &bdquo;Gesperrt&ldquo; deaktiviert sofort jeden Zugriff,
        ohne Daten zu löschen.
      </p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {STATUSES.map((s) => {
          const active = currentStatus === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => update(s.value)}
              disabled={busy !== null || active}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[12px] transition-colors",
                active
                  ? "border-line-hot bg-copper-500/[0.10] text-copper-300"
                  : "border-line bg-bg-2 text-ink-300 hover:border-line-firm hover:text-ink",
                busy === s.value && "opacity-50",
              )}
            >
              {busy === s.value && (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              )}
              {s.label}
            </button>
          );
        })}
      </div>
      {error && (
        <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
          {error}
        </div>
      )}
    </section>
  );
}
