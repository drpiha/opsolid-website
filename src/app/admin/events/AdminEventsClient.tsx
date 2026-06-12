"use client";

// =============================================================================
// AdminEventsClient — form + table for /admin/events.
//
// Create an event in one form (slug auto-generated from the name, editable),
// then copy the two distribution links straight from the table. Toggling
// "active" off makes the public directory 404 without deleting anything.
// =============================================================================

import * as React from "react";
import { Check, Copy, Loader2, Plus, Power } from "lucide-react";

interface EventRow {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string | null;
  venue: string | null;
  startAt: string;
  endAt: string;
  description: string | null;
  isActive: boolean;
  attendees: number;
}

interface Props {
  adminToken: string;
  siteUrl: string;
}

export function AdminEventsClient({ adminToken, siteUrl }: Props) {
  const api = `/api/admin/events${adminToken ? `?token=${encodeURIComponent(adminToken)}` : ""}`;

  const [events, setEvents] = React.useState<EventRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [startAt, setStartAt] = React.useState("");
  const [endAt, setEndAt] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(api);
      const json = (await res.json()) as { events?: EventRow[] };
      setEvents(json.events ?? []);
    } catch {
      setError("Could not load events.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim(),
          venue: venue.trim() || undefined,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(`${endAt}T23:59:59`).toISOString(),
        }),
      });
      const json = (await res.json()) as { event?: EventRow; error?: string; detail?: string };
      if (!res.ok || !json.event) {
        setError(json.detail ?? json.error ?? "Create failed.");
        return;
      }
      setEvents((prev) => [json.event!, ...prev]);
      setName("");
      setCity("");
      setVenue("");
      setStartAt("");
      setEndAt("");
    } catch {
      setError("Create failed.");
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (ev: EventRow) => {
    const res = await fetch(api, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: ev.id, isActive: !ev.isActive }),
    });
    if (res.ok) {
      setEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? { ...e, isActive: !ev.isActive } : e)),
      );
    }
  };

  const inputCls =
    "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-copper focus:outline-none";

  return (
    <main className="editor-light min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header>
          <p className="text-eyebrow uppercase tracking-wider text-neutral-400">
            OpSolid · Admin
          </p>
          <h1 className="mt-2 font-display text-3xl text-neutral-900">Events</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Create a fair / event, then share the two links: the{" "}
            <strong>invite link</strong> (people create their card with it) and
            the <strong>directory link</strong> (public participant list).
          </p>
        </header>

        {/* ---- create form ------------------------------------------------ */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="font-display text-xl text-neutral-900">New event</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. Hannover Messe 2026)" maxLength={160} />
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" maxLength={80} />
            <input className={inputCls} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue (optional)" maxLength={160} />
            <div className="flex gap-3">
              <label className="flex-1 text-xs text-neutral-500">
                Start
                <input type="date" className={inputCls} value={startAt} onChange={(e) => setStartAt(e.target.value)} />
              </label>
              <label className="flex-1 text-xs text-neutral-500">
                End
                <input type="date" className={inputCls} value={endAt} onChange={(e) => setEndAt(e.target.value)} />
              </label>
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-signal-err">{error}</p>}
          <button
            type="button"
            onClick={create}
            disabled={busy || !name.trim() || !city.trim() || !startAt || !endAt}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create event
          </button>
          <p className="mt-2 text-xs text-neutral-400">
            The URL slug is generated automatically from the name (e.g.
            &quot;Hannover Messe 2026&quot; → <code>hannover-messe-2026</code>).
          </p>
        </section>

        {/* ---- list ------------------------------------------------------- */}
        <section className="flex flex-col gap-3">
          {loading && <p className="text-sm text-neutral-400">Loading…</p>}
          {!loading && events.length === 0 && (
            <p className="rounded-2xl border border-dashed border-neutral-300 p-5 text-sm text-neutral-400">
              No events yet — create the first one above.
            </p>
          )}
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} siteUrl={siteUrl} onToggle={() => toggle(ev)} />
          ))}
        </section>
      </div>
    </main>
  );
}

function EventCard({
  ev,
  siteUrl,
  onToggle,
}: {
  ev: EventRow;
  siteUrl: string;
  onToggle: () => void;
}) {
  // Quick-create is the invite landing page — five fields, instant publish.
  // The detailed order form stays reachable from a link on that page.
  const inviteUrl = `${siteUrl}/tr/card/new?event=${ev.slug}`;
  const directoryUrl = `${siteUrl}/tr/events/${ev.slug}`;
  const dates = `${ev.startAt.slice(0, 10)} → ${ev.endAt.slice(0, 10)}`;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 ${
        ev.isActive ? "border-neutral-200" : "border-neutral-200 opacity-60"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-neutral-900">
            {ev.name}
            <span className="ml-2 font-mono text-xs text-neutral-400">/{ev.slug}</span>
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {ev.city}
            {ev.venue ? ` · ${ev.venue}` : ""} · {dates} · {ev.attendees}{" "}
            participant{ev.attendees === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
            ev.isActive
              ? "border-neutral-300 text-neutral-700 hover:border-neutral-400"
              : "border-signal-ok/40 text-signal-ok hover:border-signal-ok"
          }`}
        >
          <Power size={12} />
          {ev.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <LinkChip label="Invite link (create card)" value={inviteUrl} />
        <LinkChip label="Directory (participants)" value={directoryUrl} />
      </div>
    </div>
  );
}

function LinkChip({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* silent */
        }
      }}
      className="flex min-w-0 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-left hover:border-neutral-300"
      title={value}
    >
      {copied ? (
        <Check size={13} className="shrink-0 text-signal-ok" />
      ) : (
        <Copy size={13} className="shrink-0 text-neutral-400" />
      )}
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-wide text-neutral-400">
          {label}
        </span>
        <span className="block truncate font-mono text-xs text-neutral-700">
          {value.replace(/^https?:\/\//, "")}
        </span>
      </span>
    </button>
  );
}
