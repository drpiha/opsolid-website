"use client";

// =============================================================================
// InboxClient — Phase 8.5 Smart Action Inbox
//
// Fetches received actions from GET /api/account/inbox.
// Supports accept / decline / archive via PATCH /api/account/inbox/[id].
// =============================================================================

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Locale = "de" | "en" | "tr";

type ActionType =
  | "request_contact"
  | "request_quote"
  | "request_meeting"
  | "send_card"
  | "ask_collaboration"
  | "give_feedback";

type ActionStatus = "pending" | "accepted" | "declined" | "archived";

interface Sender {
  slug: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
}

interface InboxItem {
  id: string;
  type: ActionType;
  status: ActionStatus;
  message: string | null;
  createdAt: string;
  resolvedAt: string | null;
  sender: Sender;
  receiverSlug: string | null;
}

type FilterKey = "pending" | "accepted" | "all";

const COPY: Record<
  Locale,
  {
    title: string;
    empty: string;
    emptyHint: string;
    filterPending: string;
    filterAccepted: string;
    filterAll: string;
    accept: string;
    decline: string;
    archive: string;
    viewCard: string;
    typeLabel: Record<ActionType, string>;
    statusLabel: Record<ActionStatus, string>;
  }
> = {
  de: {
    title: "Posteingang",
    empty: "Keine Anfragen",
    emptyHint: "Eingehende Kontaktanfragen erscheinen hier.",
    filterPending: "Offen",
    filterAccepted: "Angenommen",
    filterAll: "Alle",
    accept: "Annehmen",
    decline: "Ablehnen",
    archive: "Archivieren",
    viewCard: "Karte öffnen",
    typeLabel: {
      request_contact: "Kontaktanfrage",
      request_quote: "Angebotsanfrage",
      request_meeting: "Meeting-Anfrage",
      send_card: "Kartenübermittlung",
      ask_collaboration: "Kooperationsanfrage",
      give_feedback: "Feedback",
    },
    statusLabel: {
      pending: "Offen",
      accepted: "Angenommen",
      declined: "Abgelehnt",
      archived: "Archiviert",
    },
  },
  en: {
    title: "Inbox",
    empty: "No requests",
    emptyHint: "Incoming contact requests will appear here.",
    filterPending: "Pending",
    filterAccepted: "Accepted",
    filterAll: "All",
    accept: "Accept",
    decline: "Decline",
    archive: "Archive",
    viewCard: "View card",
    typeLabel: {
      request_contact: "Contact request",
      request_quote: "Quote request",
      request_meeting: "Meeting request",
      send_card: "Card share",
      ask_collaboration: "Collaboration request",
      give_feedback: "Feedback",
    },
    statusLabel: {
      pending: "Pending",
      accepted: "Accepted",
      declined: "Declined",
      archived: "Archived",
    },
  },
  tr: {
    title: "Gelen Kutusu",
    empty: "Talep yok",
    emptyHint: "Gelen iletişim talepleri burada görünür.",
    filterPending: "Bekleyen",
    filterAccepted: "Kabul Edildi",
    filterAll: "Tümü",
    accept: "Kabul et",
    decline: "Reddet",
    archive: "Arşivle",
    viewCard: "Kartı aç",
    typeLabel: {
      request_contact: "İletişim talebi",
      request_quote: "Teklif talebi",
      request_meeting: "Toplantı talebi",
      send_card: "Kart paylaşımı",
      ask_collaboration: "İşbirliği talebi",
      give_feedback: "Geri bildirim",
    },
    statusLabel: {
      pending: "Bekliyor",
      accepted: "Kabul edildi",
      declined: "Reddedildi",
      archived: "Arşivlendi",
    },
  },
};

const STATUS_COLOR: Record<ActionStatus, string> = {
  pending: "bg-signal-warn/10 text-signal-warn",
  accepted: "bg-signal-ok/10 text-signal-ok",
  declined: "bg-signal-err/10 text-signal-err",
  archived: "bg-bg-3 text-ink-400",
};

export function InboxClient() {
  const params = useParams();
  const locale = (params?.locale as Locale | undefined) ?? "de";
  const copy = COPY[locale] ?? COPY.de;

  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("pending");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async (status: FilterKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/account/inbox?status=${status}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as { items: InboxItem[] };
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  async function handleAction(
    id: string,
    action: "accepted" | "declined" | "archived",
  ) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/account/inbox/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error("update failed");
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: action, resolvedAt: new Date().toISOString() }
            : item,
        ),
      );
    } finally {
      setUpdating(null);
    }
  }

  const filters: { key: FilterKey; label: string }[] = [
    { key: "pending", label: copy.filterPending },
    { key: "accepted", label: copy.filterAccepted },
    { key: "all", label: copy.filterAll },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink tracking-tight">
        {copy.title}
      </h1>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              filter === key
                ? "bg-copper-500 text-white border-copper-500"
                : "bg-bg-1 text-ink-300 border-line hover:border-copper-500/40",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-bg-2 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink font-medium">{copy.empty}</p>
          <p className="text-sm text-ink-400 mt-1">{copy.emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-line bg-bg-1 p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-bg-3 overflow-hidden">
                  {item.sender.photoPath ? (
                    <Image
                      src={item.sender.photoPath}
                      alt=""
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-ink-300">
                      {(item.sender.name ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-ink">
                      {item.sender.name ?? item.sender.slug ?? "Unknown"}
                    </span>
                    {item.sender.title && (
                      <span className="text-xs text-ink-400">
                        {item.sender.title}
                        {item.sender.company
                          ? ` · ${item.sender.company}`
                          : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-ink-500">
                      {copy.typeLabel[item.type]}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[item.status]}`}
                    >
                      {copy.statusLabel[item.status]}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 text-xs text-ink-500">
                  {new Date(item.createdAt).toLocaleDateString(
                    locale === "tr"
                      ? "tr-TR"
                      : locale === "de"
                        ? "de-DE"
                        : "en-US",
                    { day: "numeric", month: "short" },
                  )}
                </span>
              </div>

              {item.message && (
                <p className="text-sm text-ink-300 bg-bg-2 rounded-lg px-3 py-2 leading-relaxed">
                  {item.message}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                {item.sender.slug && (
                  <a
                    href={`/c/${item.sender.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-copper-500 hover:text-copper-400 transition-colors font-medium"
                  >
                    {copy.viewCard} →
                  </a>
                )}
                <div className="flex-1" />
                {item.status === "pending" && (
                  <>
                    <button
                      onClick={() => void handleAction(item.id, "accepted")}
                      disabled={updating === item.id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-signal-ok/10 text-signal-ok hover:bg-signal-ok/20 transition-colors disabled:opacity-50"
                    >
                      {copy.accept}
                    </button>
                    <button
                      onClick={() => void handleAction(item.id, "declined")}
                      disabled={updating === item.id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-signal-err/10 text-signal-err hover:bg-signal-err/20 transition-colors disabled:opacity-50"
                    >
                      {copy.decline}
                    </button>
                  </>
                )}
                {item.status !== "archived" && item.status !== "pending" && (
                  <button
                    onClick={() => void handleAction(item.id, "archived")}
                    disabled={updating === item.id}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-bg-3 text-ink-400 hover:text-ink-300 transition-colors disabled:opacity-50"
                  >
                    {copy.archive}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
