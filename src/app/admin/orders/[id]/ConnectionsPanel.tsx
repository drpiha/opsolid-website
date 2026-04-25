"use client";

// =============================================================================
// ConnectionsPanel — admin UI for card-to-card connections (CardConnection).
//
// Mirrors LinksPanel in shape: client-side fetch on mount, list of rows with
// inline mutations (PATCH status). Each connection links the card owner to
// another OpSolid cardholder (the "visitor") who pressed "Send my card" on
// the public /c/<slug> page.
// =============================================================================

import { useEffect, useState } from "react";
import { CheckCircle2, Archive, RotateCcw, ExternalLink } from "lucide-react";

type ConnectionStatus = "new" | "accepted" | "archived";

interface Connection {
  id: string;
  visitor: {
    name: string;
    title?: string | null;
    company?: string | null;
    slug: string;
  };
  source: string | null;
  campaign: string | null;
  note: string | null;
  status: ConnectionStatus;
  createdAt: string;
}

interface Props {
  orderId: string;
  token: string;
}

export function ConnectionsPanel({ orderId, token }: Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/cards/${orderId}/connections?token=${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as { connections: Connection[] };
        if (!cancel) setConnections(data.connections ?? []);
      } catch (e) {
        if (!cancel) setError(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [orderId, token]);

  async function patchStatus(connId: string, nextStatus: ConnectionStatus) {
    setPendingId(connId);
    try {
      const res = await fetch(
        `/api/admin/cards/${orderId}/connections/${connId}?token=${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      if (res.ok) {
        setConnections((prev) =>
          prev.map((c) => (c.id === connId ? { ...c, status: nextStatus } : c)),
        );
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:col-span-2">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-heading-sm text-ink">
          Connections ({connections.length})
        </h2>
      </div>

      {loading && <p className="text-sm text-ink/50">Loading connections…</p>}
      {error && <p className="text-sm text-signal-err">Error: {error}</p>}

      {!loading && !error && connections.length === 0 && (
        <p className="text-sm text-ink/50">No connections yet.</p>
      )}

      {connections.length > 0 && (
        <ul className="grid gap-2">
          {connections.map((conn) => (
            <ConnectionRow
              key={conn.id}
              conn={conn}
              pending={pendingId === conn.id}
              onMarkAccepted={() => patchStatus(conn.id, "accepted")}
              onArchive={() => patchStatus(conn.id, "archived")}
              onReopen={() => patchStatus(conn.id, "new")}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function ConnectionRow({
  conn,
  pending,
  onMarkAccepted,
  onArchive,
  onReopen,
}: {
  conn: Connection;
  pending: boolean;
  onMarkAccepted: () => void;
  onArchive: () => void;
  onReopen: () => void;
}) {
  const subtitleParts = [conn.visitor.title, conn.visitor.company]
    .filter((s): s is string => !!s && s.length > 0);

  const cardUrl = `https://card.opsolid.de/${conn.visitor.slug}`;

  return (
    <li className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span>{conn.visitor.name || "(no name)"}</span>
          </div>
          {subtitleParts.length > 0 && (
            <p className="mt-0.5 text-xs text-ink/50">
              {subtitleParts.join(" · ")}
            </p>
          )}
        </div>
        <StatusBadge status={conn.status} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <a
          href={cardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 break-all rounded bg-white px-2 py-1 font-mono text-[11px] text-ink hover:underline"
        >
          {cardUrl}
          <ExternalLink size={11} strokeWidth={2.2} />
        </a>
        <span className="text-[10px] text-ink/50">
          {new Date(conn.createdAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      {(conn.source || conn.campaign || conn.note) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {conn.source && <Tag>src: {conn.source}</Tag>}
          {conn.campaign && <Tag>camp: {conn.campaign}</Tag>}
          {conn.note && <Tag>note: {conn.note}</Tag>}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {conn.status === "new" && (
          <>
            <button
              type="button"
              onClick={onMarkAccepted}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand hover:bg-brand/20 disabled:opacity-50"
            >
              <CheckCircle2 size={11} strokeWidth={2.2} />
              Mark accepted
            </button>
            <button
              type="button"
              onClick={onArchive}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-ink/5 disabled:opacity-50"
            >
              <Archive size={11} strokeWidth={2.2} />
              Archive
            </button>
          </>
        )}
        {conn.status === "accepted" && (
          <button
            type="button"
            onClick={onArchive}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-ink/5 disabled:opacity-50"
          >
            <Archive size={11} strokeWidth={2.2} />
            Archive
          </button>
        )}
        {conn.status === "archived" && (
          <button
            type="button"
            onClick={onReopen}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-ink/5 disabled:opacity-50"
          >
            <RotateCcw size={11} strokeWidth={2.2} />
            Reopen
          </button>
        )}
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const className =
    status === "new"
      ? "bg-amber/30 text-ink"
      : status === "accepted"
        ? "bg-brand/15 text-brand"
        : "bg-neutral-200 text-ink/60";
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${className}`}
    >
      {status}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink/60">
      {children}
    </span>
  );
}
