"use client";

// =============================================================================
// InboxClient — Phase 8.5 Smart Action Inbox
//
// Displays action requests received by the authenticated user's cards.
// Fetches from GET /api/account/inbox?status=<filter>.
// Receiver can accept / decline / archive pending actions via
// PATCH /api/account/inbox/[id].
//
// Features:
//   - Filter tabs: Ausstehend / Angenommen / Abgelehnt / Alle
//   - Action type chips (color-coded)
//   - Sender avatar with initials fallback
//   - Optional message (truncated at 100 chars, expandable)
//   - Accept / Decline / Archive buttons for pending items
//   - Resolved items: status badge + resolved date
//   - Empty state with link to /discover
//
// Design: bg-bg-0/1/2, border-line, copper-500 tokens. No framer-motion.
// =============================================================================

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ActionType =
  | "request_contact"
  | "request_quote"
  | "request_meeting"
  | "ask_collaboration"
  | "send_card";

type ActionStatus = "pending" | "accepted" | "declined" | "archived";

interface ActionSender {
  slug: string;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
}

interface InboxAction {
  id: string;
  type: ActionType;
  status: ActionStatus;
  message: string | null;
  createdAt: string;
  resolvedAt: string | null;
  sender: ActionSender;
  receiverSlug: string;
}

type FilterKey = "pending" | "accepted" | "declined" | "all";

// ---------------------------------------------------------------------------
// Locale copy
// ---------------------------------------------------------------------------
type Locale = "de" | "en" | "tr";

const COPY: Record<
  Locale,
  {
    heading: string;
    tabPending: string;
    tabAccepted: string;
    tabDeclined: string;
    tabAll: string;
    emptyHeading: string;
    emptyHint: string;
    discoverLink: string;
    viewCard: string;
    accept: string;
    decline: string;
    archive: string;
    loadError: string;
    resolvedOn: string;
    messageExpandLabel: string;
    actionTypes: Record<ActionType, string>;
    statusLabels: Record<ActionStatus, string>;
  }
> = {
  de: {
    heading: "Posteingang",
    tabPending: "Ausstehend",
    tabAccepted: "Angenommen",
    tabDeclined: "Abgelehnt",
    tabAll: "Alle",
    emptyHeading: "Keine Anfragen",
    emptyHint: "Sie haben noch keine Aktionsanfragen erhalten.",
    discoverLink: "Karten entdecken",
    viewCard: "Karte ansehen",
    accept: "Annehmen",
    decline: "Ablehnen",
    archive: "Archivieren",
    loadError: "Posteingang konnte nicht geladen werden.",
    resolvedOn: "Bearbeitet am",
    messageExpandLabel: "Mehr lesen",
    actionTypes: {
      request_contact: "Kontaktanfrage",
      request_quote: "Angebotsanfrage",
      request_meeting: "Terminanfrage",
      ask_collaboration: "Kooperationsanfrage",
      send_card: "Karte gesendet",
    },
    statusLabels: {
      pending: "Ausstehend",
      accepted: "Angenommen",
      declined: "Abgelehnt",
      archived: "Archiviert",
    },
  },
  en: {
    heading: "Inbox",
    tabPending: "Pending",
    tabAccepted: "Accepted",
    tabDeclined: "Declined",
    tabAll: "All",
    emptyHeading: "No requests",
    emptyHint: "You have not received any action requests yet.",
    discoverLink: "Discover cards",
    viewCard: "View card",
    accept: "Accept",
    decline: "Decline",
    archive: "Archive",
    loadError: "Could not load inbox.",
    resolvedOn: "Resolved on",
    messageExpandLabel: "Read more",
    actionTypes: {
      request_contact: "Contact Request",
      request_quote: "Quote Request",
      request_meeting: "Meeting Request",
      ask_collaboration: "Collaboration Request",
      send_card: "Card Sent",
    },
    statusLabels: {
      pending: "Pending",
      accepted: "Accepted",
      declined: "Declined",
      archived: "Archived",
    },
  },
  tr: {
    heading: "Gelen Kutusu",
    tabPending: "Bekleyen",
    tabAccepted: "Kabul Edilen",
    tabDeclined: "Reddedilen",
    tabAll: "Tümü",
    emptyHeading: "Talep yok",
    emptyHint: "Henüz hiçbir aksiyon talebi almadınız.",
    discoverLink: "Kartları keşfet",
    viewCard: "Kartı görüntüle",
    accept: "Kabul Et",
    decline: "Reddet",
    archive: "Arşivle",
    loadError: "Gelen kutusu yüklenemedi.",
    resolvedOn: "İşlem tarihi",
    messageExpandLabel: "Devamını oku",
    actionTypes: {
      request_contact: "İletişim Talebi",
      request_quote: "Teklif Talebi",
      request_meeting: "Toplantı Talebi",
      ask_collaboration: "İş Birliği Talebi",
      send_card: "Kart Gönderildi",
    },
    statusLabels: {
      pending: "Bekliyor",
      accepted: "Kabul Edildi",
      declined: "Reddedildi",
      archived: "Arşivlendi",
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function avatarInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

function actionTypeChipClass(type: ActionType): string {
  switch (type) {
    case "request_contact":
    case "send_card":
      return "bg-copper-500/15 text-copper-600 border border-copper-500/20";
    default:
      return "bg-bg-3 text-ink-400 border border-line";
  }
}

function statusBadgeClass(status: ActionStatus): string {
  switch (status) {
    case "pending":
      return "bg-copper-500/10 text-copper-600";
    case "accepted":
      return "bg-signal-ok/15 text-signal-ok";
    case "declined":
      return "bg-signal-err/10 text-signal-err";
    case "archived":
      return "bg-bg-3 text-ink-500";
    default:
      return "bg-bg-3 text-ink-400";
  }
}

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(
      locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB",
      { day: "2-digit", month: "short", year: "numeric" },
    );
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// ActionItem — a single inbox card
// ---------------------------------------------------------------------------
function ActionItem({
  action,
  copy,
  locale,
  onResolve,
}: {
  action: InboxAction;
  copy: (typeof COPY)[Locale];
  locale: string;
  onResolve: (id: string, status: "accepted" | "declined" | "archived") => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const msg = action.message ?? "";
  const isLong = msg.length > 100;
  const displayMsg = !isLong || expanded ? msg : msg.slice(0, 100) + "…";

  const resolve = async (status: "accepted" | "declined" | "archived") => {
    setBusy(status);
    try {
      await onResolve(action.id, status);
    } finally {
      setBusy(null);
    }
  };

  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-bg-1 p-4 transition-colors hover:border-line-firm">
      {/* Sender avatar */}
      <div className="flex-shrink-0">
        {action.sender.photoPath ? (
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-line">
            <Image
              src={action.sender.photoPath}
              alt={action.sender.name ?? ""}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-copper-500/15 text-sm font-semibold text-copper-600">
            {avatarInitials(action.sender.name)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Top row: name + type chip */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/card/${action.sender.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-semibold text-ink transition-colors hover:text-copper-500"
          >
            {action.sender.name ?? action.sender.slug}
          </a>
          {(action.sender.title || action.sender.company) && (
            <span className="truncate text-xs text-ink-400">
              {[action.sender.title, action.sender.company]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
          <span
            className={[
              "ml-auto flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              actionTypeChipClass(action.type),
            ].join(" ")}
          >
            {copy.actionTypes[action.type]}
          </span>
        </div>

        {/* Message */}
        {msg && (
          <p className="text-sm text-ink-400 leading-relaxed">
            {displayMsg}
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="ml-1.5 text-xs text-copper-500 underline-offset-2 hover:underline"
              >
                {expanded ? "Weniger" : copy.messageExpandLabel}
              </button>
            )}
          </p>
        )}

        {/* Footer row */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {/* Date */}
          <span className="text-xs text-ink-500">
            {formatDate(action.createdAt, locale)}
          </span>

          {/* View card link */}
          <a
            href={`/card/${action.sender.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-400 underline-offset-2 transition-colors hover:text-copper-500 hover:underline"
          >
            {copy.viewCard}
          </a>

          {action.status === "pending" ? (
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => resolve("accepted")}
                className="rounded-full border border-signal-ok/30 bg-signal-ok/10 px-3 py-1 text-xs font-medium text-signal-ok transition-colors hover:bg-signal-ok/20 disabled:opacity-50"
              >
                {busy === "accepted" ? "…" : copy.accept}
              </button>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => resolve("declined")}
                className="rounded-full border border-signal-err/20 bg-signal-err/10 px-3 py-1 text-xs font-medium text-signal-err transition-colors hover:bg-signal-err/20 disabled:opacity-50"
              >
                {busy === "declined" ? "…" : copy.decline}
              </button>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => resolve("archived")}
                className="rounded-full border border-line bg-bg-2 px-3 py-1 text-xs font-medium text-ink-400 transition-colors hover:border-line-firm hover:text-ink disabled:opacity-50"
              >
                {busy === "archived" ? "…" : copy.archive}
              </button>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <span
                className={[
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  statusBadgeClass(action.status),
                ].join(" ")}
              >
                {copy.statusLabels[action.status]}
              </span>
              {action.resolvedAt && (
                <span className="text-xs text-ink-500">
                  {copy.resolvedOn} {formatDate(action.resolvedAt, locale)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// InboxClient — main component
// ---------------------------------------------------------------------------
export function InboxClient() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? "de";
  const copy = COPY[locale] ?? COPY.de;

  const [filter, setFilter] = useState<FilterKey>("pending");
  const [items, setItems] = useState<InboxAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (status: FilterKey) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/account/inbox?status=${status}`, {
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        setItems(json.items ?? []);
      } catch {
        setError(copy.loadError);
      } finally {
        setLoading(false);
      }
    },
    [copy.loadError],
  );

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  const handleResolve = async (
    id: string,
    status: "accepted" | "declined" | "archived",
  ) => {
    const res = await fetch(`/api/account/inbox/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    // Optimistic update: remove from list if filter is "pending", else update status
    setItems((prev) =>
      filter === "pending"
        ? prev.filter((a) => a.id !== id)
        : prev.map((a) =>
            a.id === id
              ? { ...a, status, resolvedAt: new Date().toISOString() }
              : a,
          ),
    );
  };

  const TABS: { key: FilterKey; label: string }[] = [
    { key: "pending", label: copy.tabPending },
    { key: "accepted", label: copy.tabAccepted },
    { key: "declined", label: copy.tabDeclined },
    { key: "all", label: copy.tabAll },
  ];

  return (
    <main className="mx-auto w-full max-w-[780px] px-4 py-8 sm:px-6 lg:px-10">
      {/* Page heading */}
      <h1 className="mb-6 text-2xl font-semibold text-ink">{copy.heading}</h1>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label={copy.heading}
        className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-line bg-bg-1 p-1"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={[
              "flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              filter === key
                ? "bg-ink text-bg-0 shadow-sm"
                : "text-ink-400 hover:bg-bg-2 hover:text-ink",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-line bg-bg-1"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-signal-err/20 bg-signal-err/5 px-5 py-4 text-sm text-signal-err">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-bg-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink-400"
              aria-hidden="true"
            >
              <path d="M4 4h16v12H4z" />
              <path d="M4 8l8 5 8-5" />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-ink">{copy.emptyHeading}</p>
            <p className="mt-1 text-sm text-ink-400">{copy.emptyHint}</p>
          </div>
          <a
            href={`/${locale}/discover`}
            className="rounded-full border border-copper-500/30 bg-copper-500/10 px-4 py-2 text-sm font-medium text-copper-600 transition-colors hover:bg-copper-500/20"
          >
            {copy.discoverLink}
          </a>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              copy={copy}
              locale={locale}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}
    </main>
  );
}
