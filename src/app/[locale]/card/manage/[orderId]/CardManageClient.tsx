"use client";

// =============================================================================
// CardManageClient — interactive half of /card/manage/[orderId].
//
// Three stacked panels on a light editor surface:
//   1. Stats — 30-day views / leads / saves / shares / link scans
//   2. Share links — per-channel short links (create, toggle, copy, QR)
//   3. Leads — the owner's inbox with a 4-state status workflow
//
// All copy comes from t.card.manage (DE/EN/TR). Mutations call
// /api/card/manage/[orderId]/{links,leads}?t=<editToken> and update local
// state optimistically only after the server confirms.
// =============================================================================

import * as React from "react";
import {
  BarChart3,
  Check,
  Copy,
  Eye,
  Link2,
  Loader2,
  Pencil,
  Plus,
  QrCode,
  Users,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface LinkRow {
  id: string;
  code: string;
  label: string | null;
  source: string | null;
  campaign: string | null;
  medium: string | null;
  eventName: string | null;
  active: boolean;
  scans: number;
  createdAt: string;
}

interface LeadRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  interest: string | null;
  meetingContext: string | null;
  status: string;
  createdAt: string;
}

interface Props {
  orderId: string;
  editToken: string;
  slug: string | null;
  isPublished: boolean;
  publicUrl: string | null;
  shortHost: string;
  editHref: string;
  cardHref: string | null;
  windowDays: number;
  stats: {
    views: number;
    leads: number;
    saves: number;
    shares: number;
    scans: number;
  };
  initialLinks: LinkRow[];
  initialLeads: LeadRow[];
}

const LEAD_STATUSES = ["new", "contacted", "qualified", "archived"] as const;

export function CardManageClient(props: Props) {
  const { t } = useLocale();
  const m = t.card.manage;

  const [links, setLinks] = React.useState<LinkRow[]>(props.initialLinks);
  const [leads, setLeads] = React.useState<LeadRow[]>(props.initialLeads);

  const api = React.useCallback(
    (path: "links" | "leads") =>
      `/api/card/manage/${props.orderId}/${path}?t=${encodeURIComponent(props.editToken)}`,
    [props.orderId, props.editToken],
  );

  return (
    <main className="editor-light min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* ---- header ---------------------------------------------------- */}
        <header>
          <p className="text-eyebrow uppercase tracking-wider text-ink-300">
            OpSolid · Digital Card
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">{m.title}</h1>
          <p className="mt-2 text-body text-ink-200">{m.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {props.cardHref && (
              <a
                href={props.cardHref}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-neutral-400"
              >
                <Eye size={14} /> {m.backToCard}
              </a>
            )}
            <a
              href={props.editHref}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-neutral-400"
            >
              <Pencil size={14} /> {m.editCard}
            </a>
            {props.publicUrl && (
              <CopyChip value={props.publicUrl} copiedLabel={m.copiedLabel} />
            )}
          </div>
        </header>

        {!props.isPublished && (
          <div className="rounded-2xl border border-copper/40 bg-copper/10 p-4 text-sm text-ink">
            {m.notPublished}
          </div>
        )}

        {/* ---- stats ----------------------------------------------------- */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-xl text-ink">
            <BarChart3 size={18} className="text-copper" /> {m.statsHeading}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatTile label={m.statViews} value={props.stats.views} />
            <StatTile label={m.statLeads} value={props.stats.leads} />
            <StatTile label={m.statSaves} value={props.stats.saves} />
            <StatTile label={m.statShares} value={props.stats.shares} />
            <StatTile label={m.statScans} value={props.stats.scans} />
          </div>
        </section>

        {/* ---- share links ----------------------------------------------- */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-xl text-ink">
            <Link2 size={18} className="text-copper" /> {m.linksHeading}
          </h2>
          <p className="mt-2 text-sm text-ink-200">{m.linksHint}</p>

          {props.isPublished && (
            <CreateLinkForm
              api={api("links")}
              labels={m}
              onCreated={(link) => setLinks((prev) => [link, ...prev])}
            />
          )}

          <div className="mt-5 flex flex-col gap-3">
            {links.length === 0 && (
              <p className="rounded-2xl border border-dashed border-neutral-300 p-4 text-sm text-ink-300">
                {m.noLinksYet}
              </p>
            )}
            {links.map((link) => (
              <LinkItem
                key={link.id}
                link={link}
                slug={props.slug}
                shortHost={props.shortHost}
                labels={m}
                onToggle={async (next) => {
                  const res = await fetch(api("links"), {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ linkId: link.id, active: next }),
                  });
                  if (res.ok) {
                    setLinks((prev) =>
                      prev.map((l) =>
                        l.id === link.id ? { ...l, active: next } : l,
                      ),
                    );
                  }
                }}
              />
            ))}
          </div>
        </section>

        {/* ---- leads ------------------------------------------------------ */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-xl text-ink">
            <Users size={18} className="text-copper" /> {m.leadsHeading}
          </h2>
          <p className="mt-2 text-sm text-ink-200">{m.leadsHint}</p>

          <div className="mt-5 flex flex-col gap-3">
            {leads.length === 0 && (
              <p className="rounded-2xl border border-dashed border-neutral-300 p-4 text-sm text-ink-300">
                {m.noLeadsYet}
              </p>
            )}
            {leads.map((lead) => (
              <LeadItem
                key={lead.id}
                lead={lead}
                labels={m}
                onStatus={async (status) => {
                  const res = await fetch(api("leads"), {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ leadId: lead.id, status }),
                  });
                  if (res.ok) {
                    setLeads((prev) =>
                      prev.map((l) => (l.id === lead.id ? { ...l, status } : l)),
                    );
                  }
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Pieces
// -----------------------------------------------------------------------------

type ManageLabels = ReturnType<typeof useLocale>["t"]["card"]["manage"];

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-center">
      <p className="font-display text-2xl text-ink">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-300">
        {label}
      </p>
    </div>
  );
}

function CopyChip({
  value,
  copiedLabel,
}: {
  value: string;
  copiedLabel: string;
}) {
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
          /* clipboard rejection — silent */
        }
      }}
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-ink hover:border-neutral-400"
      title={value}
    >
      {copied ? <Check size={14} className="text-signal-ok" /> : <Copy size={14} />}
      <span className="truncate">{copied ? copiedLabel : value.replace(/^https?:\/\//, "")}</span>
    </button>
  );
}

function CreateLinkForm({
  api,
  labels,
  onCreated,
}: {
  api: string;
  labels: ManageLabels;
  onCreated: (link: LinkRow) => void;
}) {
  const [label, setLabel] = React.useState("");
  const [code, setCode] = React.useState("");
  const [source, setSource] = React.useState("");
  const [campaign, setCampaign] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label.trim() || undefined,
          code: code.trim() || undefined,
          source: source.trim() || undefined,
          campaign: campaign.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { link?: LinkRow; error?: string };
      if (!res.ok || !json.link) {
        setError(
          json.error === "link_limit_reached"
            ? labels.linkLimitReached
            : json.error === "code_unavailable"
              ? labels.codeUnavailable
              : labels.linkCreateFailed,
        );
        return;
      }
      onCreated(json.link);
      setLabel("");
      setCode("");
      setSource("");
      setCampaign("");
    } catch {
      setError(labels.linkCreateFailed);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-400 focus:border-copper focus:outline-none";

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputCls}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={labels.linkLabelPlaceholder}
          maxLength={120}
        />
        <input
          className={inputCls}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={labels.linkCodePlaceholder}
          maxLength={64}
        />
        <input
          className={inputCls}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder={labels.linkSourcePlaceholder}
          maxLength={60}
        />
        <input
          className={inputCls}
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          placeholder={labels.linkCampaignPlaceholder}
          maxLength={60}
        />
      </div>
      {error && <p className="mt-3 text-sm text-signal-err">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        {busy ? labels.creating : labels.createLink}
      </button>
    </div>
  );
}

function LinkItem({
  link,
  slug,
  shortHost,
  labels,
  onToggle,
}: {
  link: LinkRow;
  slug: string | null;
  shortHost: string;
  labels: ManageLabels;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [toggling, setToggling] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const shortUrl = `https://${shortHost}/${link.code}`;
  const qrHref = slug
    ? `/api/qr/${encodeURIComponent(slug)}?code=${encodeURIComponent(link.code)}&format=png`
    : null;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        link.active
          ? "border-neutral-200 bg-white"
          : "border-neutral-200 bg-neutral-100 opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {link.label || link.code}
          </p>
          <p className="mt-0.5 truncate font-mono text-xs text-ink-300">
            {shortHost}/{link.code}
            {link.source ? ` · ${link.source}` : ""}
            {link.campaign ? ` · ${link.campaign}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-ink-200">
            {link.scans} {labels.scansLabel}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs ${
              link.active
                ? "bg-signal-ok/10 text-signal-ok"
                : "bg-neutral-200 text-ink-300"
            }`}
          >
            {link.active ? labels.activeLabel : labels.inactiveLabel}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shortUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {
              /* silent */
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-ink hover:border-neutral-400"
        >
          {copied ? <Check size={12} className="text-signal-ok" /> : <Copy size={12} />}
          {copied ? labels.copiedLabel : labels.copyLabel}
        </button>
        {qrHref && (
          <a
            href={qrHref}
            download={`qr-${link.code}.png`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-ink hover:border-neutral-400"
          >
            <QrCode size={12} /> {labels.qrLabel}
          </a>
        )}
        <button
          type="button"
          disabled={toggling}
          onClick={async () => {
            setToggling(true);
            try {
              await onToggle(!link.active);
            } finally {
              setToggling(false);
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-ink hover:border-neutral-400 disabled:opacity-60"
        >
          {toggling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : null}
          {link.active ? labels.disableLabel : labels.enableLabel}
        </button>
      </div>
    </div>
  );
}

function LeadItem({
  lead,
  labels,
  onStatus,
}: {
  lead: LeadRow;
  labels: ManageLabels;
  onStatus: (status: string) => Promise<void>;
}) {
  const [busy, setBusy] = React.useState(false);
  const statusLabel: Record<string, string> = {
    new: labels.leadStatusNew,
    contacted: labels.leadStatusContacted,
    qualified: labels.leadStatusQualified,
    archived: labels.leadStatusArchived,
  };
  const date = new Date(lead.createdAt);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            {lead.name || lead.email || lead.phone || "—"}
            {lead.company ? (
              <span className="font-normal text-ink-300"> · {lead.company}</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-ink-300">
            {[
              lead.email,
              lead.phone,
              lead.interest,
              lead.meetingContext,
              date.toLocaleDateString(),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {lead.message && (
            <p className="mt-2 text-sm text-ink-200">{lead.message}</p>
          )}
        </div>
        <select
          value={lead.status}
          disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            try {
              await onStatus(e.target.value);
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs text-ink focus:border-copper focus:outline-none disabled:opacity-60"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s] ?? s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
