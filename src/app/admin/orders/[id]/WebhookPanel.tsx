"use client";

// =============================================================================
// WebhookPanel — admin UI for managing outbound CRM webhook subscriptions.
//
// Lists existing subscriptions with last-delivery health, lets admin add new
// ones, toggle active state, and delete. The newly-generated secret is shown
// EXACTLY ONCE in a copy-prompt modal and disappears on dismiss — re-creation
// is the only way to rotate.
// =============================================================================

import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  orderId: string;
  token: string;
}

interface WebhookRow {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastDeliveryAt: string | null;
  lastDeliveryStatus: number | null;
  createdAt: string;
}

const SUPPORTED_EVENTS = ["lead.created", "connection.created"] as const;
type SupportedEvent = (typeof SUPPORTED_EVENTS)[number];

export function WebhookPanel({ orderId, token }: Props) {
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<Record<SupportedEvent, boolean>>({
    "lead.created": true,
    "connection.created": true,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<{
    secret: string;
    url: string;
  } | null>(null);

  const baseUrl = useMemo(
    () => `/api/admin/cards/${orderId}/webhooks`,
    [orderId],
  );
  const tokenQS = useMemo(() => `token=${encodeURIComponent(token)}`, [token]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}?${tokenQS}`, { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { webhooks: WebhookRow[] };
      setWebhooks(data.webhooks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, tokenQS]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);

    const events = SUPPORTED_EVENTS.filter((ev) => newEvents[ev]);
    if (events.length === 0) {
      setCreateError("Select at least one event.");
      return;
    }
    if (!newUrl.trim()) {
      setCreateError("URL is required.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${baseUrl}?${tokenQS}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: newUrl.trim(), events }),
      });
      const body = (await res.json().catch(() => null)) as
        | {
            webhook?: WebhookRow;
            secret?: string;
            error?: string;
          }
        | null;
      if (!res.ok || !body?.webhook || !body?.secret) {
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      setRevealed({ secret: body.secret, url: body.webhook.url });
      setNewUrl("");
      setNewEvents({ "lead.created": true, "connection.created": true });
      await refresh();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Network error");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(row: WebhookRow) {
    try {
      const res = await fetch(`${baseUrl}/${row.id}?${tokenQS}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  async function handleDelete(row: WebhookRow) {
    if (
      !window.confirm(
        `Delete webhook for ${row.url}? The secret cannot be recovered.`,
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/${row.id}?${tokenQS}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:col-span-2">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-heading-sm text-ink">CRM webhooks</h2>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/60">
          {webhooks.length} active
        </span>
      </div>
      <p className="mb-4 text-xs text-ink/60">
        Receive a signed POST every time this card captures a lead or a Smart
        Exchange connection. Each delivery includes an{" "}
        <code className="font-mono text-[11px]">X-OpSolid-Signature</code>{" "}
        header — verify it with the secret shown once at creation.
      </p>

      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4"
      >
        <label className="grid gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
            Endpoint URL
          </span>
          <input
            type="url"
            inputMode="url"
            placeholder="https://example.com/webhooks/opsolid"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-ink"
            required
            maxLength={500}
          />
        </label>

        <fieldset className="grid gap-1">
          <legend className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
            Events
          </legend>
          <div className="flex flex-wrap gap-3">
            {SUPPORTED_EVENTS.map((ev) => (
              <label
                key={ev}
                className="flex items-center gap-2 text-xs text-ink/80"
              >
                <input
                  type="checkbox"
                  checked={newEvents[ev]}
                  onChange={(e) =>
                    setNewEvents((prev) => ({
                      ...prev,
                      [ev]: e.target.checked,
                    }))
                  }
                />
                <code className="font-mono text-[11px]">{ev}</code>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-3">
          {createError ? (
            <p className="text-xs text-signal-err">{createError}</p>
          ) : (
            <span aria-hidden className="text-xs text-transparent">
              .
            </span>
          )}
          <button
            type="submit"
            disabled={creating}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {creating ? "Adding…" : "Add webhook"}
          </button>
        </div>
      </form>

      <div className="mt-5 grid gap-2">
        {loading && (
          <p className="text-xs text-ink/50">Loading subscriptions…</p>
        )}
        {!loading && webhooks.length === 0 && (
          <p className="text-xs text-ink/50">No webhooks registered yet.</p>
        )}
        {!loading &&
          webhooks.map((w) => (
            <article
              key={w.id}
              className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div
                  className="truncate font-mono text-[11px] text-ink"
                  title={w.url}
                >
                  {w.url}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {w.events.map((ev) => (
                    <span
                      key={ev}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/60"
                    >
                      {ev}
                    </span>
                  ))}
                  <DeliveryBadge
                    at={w.lastDeliveryAt}
                    status={w.lastDeliveryStatus}
                  />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(w)}
                  className={
                    w.active
                      ? "rounded-full border border-neutral-300 bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                      : "rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-ink/60"
                  }
                  title={w.active ? "Pause delivery" : "Resume delivery"}
                >
                  {w.active ? "Active" : "Paused"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(w)}
                  className="rounded-full border border-signal-err/30 bg-white px-3 py-1 text-[11px] font-semibold text-signal-err"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
      </div>

      {error && <p className="mt-3 text-xs text-signal-err">{error}</p>}

      {revealed && (
        <SecretReveal
          secret={revealed.secret}
          url={revealed.url}
          onClose={() => setRevealed(null)}
        />
      )}
    </section>
  );
}

function DeliveryBadge({
  at,
  status,
}: {
  at: string | null;
  status: number | null;
}) {
  if (!at) {
    return (
      <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/40">
        no deliveries yet
      </span>
    );
  }
  const ok = status !== null && status >= 200 && status < 300;
  return (
    <span
      className={
        ok
          ? "rounded-full bg-signal-ok/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal-ok"
          : "rounded-full bg-signal-err/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal-err"
      }
      title={new Date(at).toLocaleString()}
    >
      last: {status ?? "—"}
    </span>
  );
}

function SecretReveal({
  secret,
  url,
  onClose,
}: {
  secret: string;
  url: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail on insecure origins; user can still select-and-copy
      setCopied(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl"
      >
        <h3 className="text-heading-sm text-ink">Save this secret</h3>
        <p className="mt-2 text-xs text-ink/70">
          This is the only time the signing secret will be shown for{" "}
          <span className="font-mono text-[11px]">{url}</span>. Store it in
          your CRM and use it to verify the{" "}
          <code className="font-mono text-[11px]">X-OpSolid-Signature</code>{" "}
          header on every delivery. Lost the secret? Delete this webhook and
          create a new one.
        </p>
        <div className="mt-4 break-all rounded-2xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] text-ink">
          {secret}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-ink"
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
          >
            I saved it
          </button>
        </div>
      </div>
    </div>
  );
}
