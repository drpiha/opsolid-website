"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import AgentForm, {
  type AgentLike,
} from "@/components/voice/dashboard/AgentForm";

interface AgentEditClientProps {
  tenantId: string;
  tenantSlug: string;
  token: string;
  agent: Required<Pick<AgentLike, "id" | "name" | "displayName" | "language" | "promptTemplate" | "voiceId" | "systemPrompt" | "maxDurationSeconds" | "status">> & { providerAgentId: string | null };
}

export default function AgentEditClient({
  tenantId,
  token,
  agent,
}: AgentEditClientProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncOk, setSyncOk] = useState(false);

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const onSaved = () => {
    router.refresh();
  };

  const sync = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncOk(false);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/agents/${agent.id}/sync${tokenQ}`,
        { method: "POST" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setSyncOk(true);
      router.refresh();
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : "Synchronisation fehlgeschlagen",
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <AgentForm
        agent={agent}
        tenantId={tenantId}
        token={token}
        onSaved={onSaved}
      />

      <section className="panel flex flex-col gap-3 px-5 py-5">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-[14px] font-medium text-ink">
              Provider-Synchronisation
            </h3>
            <p className="mt-0.5 text-[12px] text-ink-400">
              Übernimmt Stimme, Prompt und Limits zum Anbieter (Retell / Vapi).
            </p>
          </div>
          <button
            type="button"
            onClick={sync}
            disabled={syncing}
            className="btn btn-ghost btn-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            )}
            Mit Anbieter synchronisieren
          </button>
        </header>
        {syncError && (
          <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
            {syncError}
          </div>
        )}
        {syncOk && (
          <div className="rounded-md border border-signal-ok/30 bg-signal-ok/[0.08] px-3 py-2 text-[12px] text-signal-ok">
            Synchronisation erfolgreich.
          </div>
        )}
      </section>
    </div>
  );
}
