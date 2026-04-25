"use client";

// =============================================================================
// LinksPanel — admin UI for short links + QR codes per CardOrder.
//
// Lists existing CardLink rows with their scan counts and offers a form to
// create new ones. Each link shows quick-copy URL + QR PNG/SVG download
// (rendered server-side by /api/qr — Phase 3 wires the existing QR endpoint
// to accept a `code` param so the QR target is the short URL, not /c/[slug]).
// =============================================================================

import { useEffect, useState } from "react";

interface Link {
  id: string;
  code: string;
  label: string | null;
  source: string | null;
  campaign: string | null;
  medium: string | null;
  eventName: string | null;
  destinationUrl: string | null;
  active: boolean;
  scans: number;
  createdAt: string;
}

interface Props {
  orderId: string;
  slug: string;
  token: string;
  shortLinkHost?: string;
}

export function LinksPanel({
  orderId,
  slug,
  token,
  shortLinkHost = "go.opsolid.de",
}: Props) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "submitting" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/cards/${orderId}/links?token=${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as { links: Link[] };
        if (!cancel) setLinks(data.links);
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

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      label: trimOrUndef(formData.get("label")),
      code: trimOrUndef(formData.get("code")),
      source: trimOrUndef(formData.get("source")),
      campaign: trimOrUndef(formData.get("campaign")),
      medium: trimOrUndef(formData.get("medium")),
      eventName: trimOrUndef(formData.get("eventName")),
    };
    try {
      const res = await fetch(
        `/api/admin/cards/${orderId}/links?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { link?: Link; error?: string };
      if (!res.ok || !data.link) {
        setFormState("error");
        setFormError(data.error ?? "Failed to create link");
        return;
      }
      setLinks((prev) => [data.link!, ...prev]);
      setFormOpen(false);
      setFormState("idle");
      e.currentTarget.reset();
    } catch (err) {
      setFormState("error");
      setFormError(err instanceof Error ? err.message : "Network error");
    }
  }

  async function handleDelete(linkId: string) {
    if (!confirm("Disable this link? Scan history is kept.")) return;
    const res = await fetch(
      `/api/admin/cards/${orderId}/links?token=${encodeURIComponent(token)}&linkId=${linkId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, active: false } : l)),
      );
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:col-span-2">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-heading-sm text-ink">Short links &amp; QR ({links.length})</h2>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full border border-ink/20 bg-ink px-3 py-1.5 text-xs font-semibold text-white"
        >
          {formOpen ? "Cancel" : "+ New link"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleCreate}
          className="mb-5 grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm sm:grid-cols-2"
        >
          <Field name="label" label="Label" placeholder="Hannover Messe 2026 — Stand B12" />
          <Field name="code" label="Code (optional)" placeholder="hsn-messe2026" mono />
          <Field name="source" label="Source" placeholder="qr-main · nfc-card · instagram-bio" />
          <Field name="campaign" label="Campaign" placeholder="Personal Profile" />
          <Field name="medium" label="Medium" placeholder="qr · nfc · email · print" />
          <Field name="eventName" label="Event" placeholder="Hannover Messe 2026" />
          {formError && (
            <p className="sm:col-span-2 text-xs text-signal-err">{formError}</p>
          )}
          <button
            type="submit"
            disabled={formState === "submitting"}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            {formState === "submitting" ? "Creating…" : "Create link"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-ink/50">Loading links…</p>}
      {error && <p className="text-sm text-signal-err">Error: {error}</p>}

      {!loading && !error && links.length === 0 && (
        <p className="text-sm text-ink/50">
          No short links yet. Create one to track scans by source.
        </p>
      )}

      {links.length > 0 && (
        <ul className="grid gap-2">
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              shortLinkHost={shortLinkHost}
              slug={slug}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function LinkRow({
  link,
  shortLinkHost,
  slug,
  onDelete,
}: {
  link: Link;
  shortLinkHost: string;
  slug: string;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const url = `https://${shortLinkHost}/${link.code}`;
  // QR endpoint accepts ?code=… so the QR encodes the short URL instead of
  // the canonical /c/<slug> URL. /api/qr/[slug] is a public route — no admin
  // token required (the QR is what visitors scan in the wild).
  const qrPng = `/api/qr/${encodeURIComponent(slug)}?code=${encodeURIComponent(link.code)}&format=png`;
  const qrSvg = `/api/qr/${encodeURIComponent(slug)}?code=${encodeURIComponent(link.code)}&format=svg`;

  return (
    <li
      className={`rounded-2xl border p-3 ${
        link.active ? "border-neutral-200 bg-neutral-50" : "border-neutral-200 bg-neutral-100/60 opacity-60"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span>{link.label || link.code}</span>
            {!link.active && (
              <span className="rounded-full bg-neutral-300 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ink/70">
                disabled
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-wider text-ink/50">
            {link.source && <Tag>src: {link.source}</Tag>}
            {link.campaign && <Tag>camp: {link.campaign}</Tag>}
            {link.eventName && <Tag>event: {link.eventName}</Tag>}
            {link.medium && <Tag>med: {link.medium}</Tag>}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-semibold text-ink">{link.scans}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink/50">scans</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <code className="break-all rounded bg-white px-2 py-1 font-mono text-[11px] text-ink">
          {url}
        </code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-ink/5"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          href={qrPng}
          download={`${link.code}.png`}
          className="rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-ink/5"
        >
          QR PNG
        </a>
        <a
          href={qrSvg}
          download={`${link.code}.svg`}
          className="rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-ink/5"
        >
          QR SVG
        </a>
        {link.active && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto rounded-full border border-signal-err/40 bg-white px-2.5 py-1 text-[11px] font-medium text-signal-err hover:bg-signal-err/5"
          >
            Disable
          </button>
        )}
      </div>
    </li>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink/60">
      {children}
    </span>
  );
}

function Field({
  name,
  label,
  placeholder,
  mono = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
        {label}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        className={`rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-ink ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}

function trimOrUndef(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
