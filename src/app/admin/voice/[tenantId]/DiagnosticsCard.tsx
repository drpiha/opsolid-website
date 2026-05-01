"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticsCardProps {
  adminToken: string;
}

interface EnvFlag {
  name: string;
  set: boolean;
}

interface DiagnosticsData {
  timestamp: string;
  env: EnvFlag[];
  provider: { name: string; ok: boolean; error: string | null };
  webhookSelfTest: {
    ran: boolean;
    matchesSdk: boolean | null;
    rejectsTampered: boolean | null;
    error: string | null;
  };
  counts: {
    tenants: number;
    activeTenants: number;
    agents: number;
    phoneNumbers: number;
    callsLast24h: number;
  } | null;
  countsError: string | null;
  webhookUrl: string;
}

export default function DiagnosticsCard({ adminToken }: DiagnosticsCardProps) {
  const [data, setData] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tokenQ = `?token=${encodeURIComponent(adminToken)}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/voice/admin/diagnostics${tokenQ}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as { data: DiagnosticsData };
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Diagnose fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, [tokenQ]);

  useEffect(() => {
    void load();
  }, [load]);

  const webhookOk =
    data?.webhookSelfTest.ran === true &&
    data.webhookSelfTest.matchesSdk === true &&
    data.webhookSelfTest.rejectsTampered === true;

  return (
    <section className="panel flex flex-col gap-3 px-5 py-5 lg:col-span-2">
      <header className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[14px] font-medium text-ink">
          System-Diagnose
        </h3>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2 py-1 text-[11px] text-ink-300 transition-colors hover:border-line-firm hover:text-ink disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-3 w-3" aria-hidden />
          )}
          Aktualisieren
        </button>
      </header>

      {error && (
        <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
          {error}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DiagBlock title="Provider">
            <Indicator
              ok={data.provider.ok}
              label={data.provider.name}
              detail={data.provider.error ?? undefined}
            />
          </DiagBlock>

          <DiagBlock title="Webhook-Signatur">
            {data.webhookSelfTest.ran ? (
              <>
                <Indicator
                  ok={data.webhookSelfTest.matchesSdk === true}
                  label="SDK-konform"
                  detail={data.webhookSelfTest.error ?? undefined}
                />
                <Indicator
                  ok={data.webhookSelfTest.rejectsTampered === true}
                  label="Lehnt manipulierte Sig. ab"
                />
              </>
            ) : (
              <span className="text-[11px] text-ink-400">
                Selbsttest übersprungen (RETELL_API_KEY fehlt)
              </span>
            )}
          </DiagBlock>

          <DiagBlock title="Zähler (gesamt)">
            {data.counts ? (
              <ul className="flex flex-col gap-0.5 text-[12px] text-ink-200">
                <CountRow label="Tenants" value={data.counts.tenants} />
                <CountRow
                  label="Aktiv"
                  value={data.counts.activeTenants}
                  highlight
                />
                <CountRow label="Agenten" value={data.counts.agents} />
                <CountRow label="Nummern" value={data.counts.phoneNumbers} />
                <CountRow
                  label="Anrufe 24 h"
                  value={data.counts.callsLast24h}
                />
              </ul>
            ) : (
              <span className="text-[11px] text-signal-err">
                {data.countsError ?? "Zähler nicht verfügbar"}
              </span>
            )}
          </DiagBlock>

          <DiagBlock title="Env (gesetzt)" wide>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3">
              {data.env.map((flag) => (
                <li
                  key={flag.name}
                  className="flex items-center gap-1 text-[11px]"
                >
                  {flag.set ? (
                    <CheckCircle2
                      className="h-3 w-3 text-signal-ok"
                      aria-hidden
                    />
                  ) : (
                    <XCircle
                      className="h-3 w-3 text-ink-400"
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "font-mono normal-case tracking-normal",
                      flag.set ? "text-ink-200" : "text-ink-400 line-through",
                    )}
                  >
                    {flag.name}
                  </span>
                </li>
              ))}
            </ul>
          </DiagBlock>

          <DiagBlock title="Webhook-URL" wide>
            <code className="block break-all rounded-md bg-bg-2 px-2 py-1.5 font-mono text-[11px] text-ink-200">
              {data.webhookUrl}
            </code>
          </DiagBlock>
        </div>
      )}

      {data && (
        <footer
          className={cn(
            "mt-1 flex items-center justify-between border-t border-line-soft pt-2 text-[10px]",
            webhookOk ? "text-signal-ok" : "text-ink-400",
          )}
        >
          <span className="meta">
            Stand: {new Date(data.timestamp).toLocaleString("de-DE")}
          </span>
          <span className="meta">
            {webhookOk ? "Pipeline OK" : "Prüfen"}
          </span>
        </footer>
      )}
    </section>
  );
}

function DiagBlock({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-md border border-line bg-bg-2 px-3 py-3",
        wide && "md:col-span-3",
      )}
    >
      <span className="meta text-[10px] text-ink-400">{title}</span>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Indicator({
  ok,
  label,
  detail,
}: {
  ok: boolean;
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex items-start gap-1.5 text-[12px]">
      {ok ? (
        <CheckCircle2
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-ok"
          aria-hidden
        />
      ) : (
        <XCircle
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-err"
          aria-hidden
        />
      )}
      <div className="flex flex-col">
        <span className={cn(ok ? "text-ink-200" : "text-signal-err")}>
          {label}
        </span>
        {detail && (
          <span className="text-[10px] text-ink-400">{detail}</span>
        )}
      </div>
    </div>
  );
}

function CountRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-baseline justify-between">
      <span className="meta text-[10px] text-ink-400">{label}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          highlight ? "text-copper-300" : "text-ink-200",
        )}
      >
        {value}
      </span>
    </li>
  );
}
