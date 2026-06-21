"use client";

// =============================================================================
// InboxClient — Unified Inbox v2 (Kutasia Workspace pivot, Faz C)
//
// Channel-agnostic 3-pane view backed by the new /api/inbox/* endpoints.
// Left rail: channel filters; center: thread list; right: thread detail
// with reply box + AI draft action.
//
// The previous Smart Action board (CardAction) lives on as the "card_action"
// channel filter — actions will appear there once the CardAction backfill
// ships (planned post-Faz C). Until then that filter shows an empty state.
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Locale = "de" | "en" | "tr";
type ChannelType =
  | "whatsapp"
  | "telegram"
  | "email"
  | "voice"
  | "web"
  | "card_action";

type ThreadStatus = "open" | "snoozed" | "closed" | "archived";
type StatusFilter = ThreadStatus | "all";

interface ChannelSummary {
  id: string;
  type: ChannelType;
  label: string | null;
  status: string;
  counts: { open: number; unread: number };
}

interface ThreadListItem {
  id: string;
  channelType: ChannelType;
  contactName: string | null;
  contactHandle: string;
  contactLocale: string | null;
  subject: string | null;
  status: ThreadStatus;
  priority: number;
  unreadCount: number;
  tags: string[];
  aiSummary: string | null;
  aiSentiment: string | null;
  aiIntent: string | null;
  lastMessageAt: string;
  lastMessage: {
    id: string;
    body: string | null;
    direction: "in" | "out";
    sentBy: string;
    createdAt: string;
  } | null;
}

interface ThreadMessage {
  id: string;
  direction: "in" | "out";
  sentBy: string;
  status: string;
  body: string | null;
  mediaUrls: string[];
  voiceUrl: string | null;
  voiceTranscript: string | null;
  language: string | null;
  createdAt: string;
}

interface ThreadSuggestion {
  id: string;
  type: string;
  status: string;
  content: string;
  modelUsed: string | null;
  createdAt: string;
}

interface ThreadDetail extends ThreadListItem {
  channel: { id: string; type: string; label: string | null; status: string };
  assignedTo: string | null;
  messages: ThreadMessage[];
  suggestions: ThreadSuggestion[];
}

// ---------------------------------------------------------------------------
// i18n copy — kept inline so adding the inbox didn't require sprawling the
// global content/*.ts files. Channel labels stay in English on purpose
// (they're product names).
// ---------------------------------------------------------------------------

const COPY: Record<Locale, {
  title: string;
  subtitle: string;
  rail: {
    sectionChannels: string;
    sectionFilters: string;
    sectionDemo: string;
    seedDemo: string;
    seeding: string;
    clearDemo: string;
    clearing: string;
    demoHint: string;
    all: string;
    open: string;
    snoozed: string;
    closed: string;
    archived: string;
    statusAll: string;
    noChannels: string;
    addChannelHint: string;
  };
  channels: Record<ChannelType | "all", string>;
  list: {
    empty: string;
    emptyHint: string;
    loading: string;
    loadFailed: string;
    youPrefix: string;
    voiceNote: string;
    attachment: string;
  };
  detail: {
    placeholder: string;
    aiSummary: string;
    aiSentiment: string;
    aiIntent: string;
    aiNotYet: string;
    suggestDraft: string;
    regenDraft: string;
    useDraft: string;
    dismissDraft: string;
    reply: string;
    replyPlaceholder: string;
    send: string;
    sending: string;
    sendFailed: string;
    close: string;
    reopen: string;
    snooze: string;
    archive: string;
    priorityLabel: string;
    youSent: string;
    customerSent: string;
    aiSent: string;
  };
  sentiment: { positive: string; neutral: string; negative: string; urgent: string };
}> = {
  de: {
    title: "Posteingang",
    subtitle: "Alle Kanäle in einer Ansicht",
    rail: {
      sectionChannels: "Kanäle",
      sectionFilters: "Filter",
      sectionDemo: "Demo-Daten",
      seedDemo: "Beispieldaten laden",
      seeding: "Lade …",
      clearDemo: "Beispieldaten löschen",
      clearing: "Lösche …",
      demoHint:
        "Vier Kanäle (WhatsApp / Telegram / E-Mail / Voice) mit fairtauglichen Beispielkonversationen.",
      all: "Alle",
      open: "Offen",
      snoozed: "Wartend",
      closed: "Geschlossen",
      archived: "Archiviert",
      statusAll: "Alle Status",
      noChannels: "Noch kein Kanal verbunden",
      addChannelHint:
        "Verbinden Sie WhatsApp, Telegram oder E-Mail unter Einstellungen → Kanäle.",
    },
    channels: {
      all: "Alle Kanäle",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      email: "E-Mail",
      voice: "Voice",
      web: "Web-Formular",
      card_action: "Karten-Aktionen",
    },
    list: {
      empty: "Keine Konversationen",
      emptyHint: "Eingehende Nachrichten erscheinen hier.",
      loading: "Lade …",
      loadFailed: "Konnte nicht geladen werden.",
      youPrefix: "Sie:",
      voiceNote: "Sprachnachricht",
      attachment: "Anhang",
    },
    detail: {
      placeholder:
        "Wählen Sie links eine Konversation aus, um Nachrichten zu sehen.",
      aiSummary: "KI-Zusammenfassung",
      aiSentiment: "Stimmung",
      aiIntent: "Anliegen",
      aiNotYet: "Noch keine Analyse — frische Konversation.",
      suggestDraft: "KI-Entwurf erstellen",
      regenDraft: "Erneut entwerfen",
      useDraft: "Entwurf übernehmen",
      dismissDraft: "Verwerfen",
      reply: "Antwort",
      replyPlaceholder: "Schreiben Sie Ihre Antwort …",
      send: "Senden",
      sending: "Sende …",
      sendFailed: "Senden fehlgeschlagen.",
      close: "Schließen",
      reopen: "Wieder öffnen",
      snooze: "1 Tag verschieben",
      archive: "Archivieren",
      priorityLabel: "Priorität",
      youSent: "Sie",
      customerSent: "Kunde",
      aiSent: "KI",
    },
    sentiment: {
      positive: "Positiv",
      neutral: "Neutral",
      negative: "Negativ",
      urgent: "Dringend",
    },
  },
  en: {
    title: "Inbox",
    subtitle: "Every channel, one view",
    rail: {
      sectionChannels: "Channels",
      sectionFilters: "Filters",
      sectionDemo: "Demo data",
      seedDemo: "Load sample data",
      seeding: "Loading …",
      clearDemo: "Clear sample data",
      clearing: "Clearing …",
      demoHint:
        "Seeds four channels (WhatsApp / Telegram / Email / Voice) with fair-friendly sample conversations.",
      all: "All",
      open: "Open",
      snoozed: "Snoozed",
      closed: "Closed",
      archived: "Archived",
      statusAll: "All statuses",
      noChannels: "No channel connected yet",
      addChannelHint:
        "Connect WhatsApp, Telegram or Email under Settings → Channels.",
    },
    channels: {
      all: "All channels",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      email: "Email",
      voice: "Voice",
      web: "Web form",
      card_action: "Card actions",
    },
    list: {
      empty: "No conversations",
      emptyHint: "Inbound messages will appear here.",
      loading: "Loading …",
      loadFailed: "Could not load conversations.",
      youPrefix: "You:",
      voiceNote: "Voice note",
      attachment: "Attachment",
    },
    detail: {
      placeholder: "Pick a conversation on the left to see messages.",
      aiSummary: "AI summary",
      aiSentiment: "Sentiment",
      aiIntent: "Intent",
      aiNotYet: "No analysis yet — fresh conversation.",
      suggestDraft: "Draft a reply with AI",
      regenDraft: "Regenerate draft",
      useDraft: "Use draft",
      dismissDraft: "Dismiss",
      reply: "Reply",
      replyPlaceholder: "Type your reply …",
      send: "Send",
      sending: "Sending …",
      sendFailed: "Could not send.",
      close: "Close",
      reopen: "Reopen",
      snooze: "Snooze 1 day",
      archive: "Archive",
      priorityLabel: "Priority",
      youSent: "You",
      customerSent: "Customer",
      aiSent: "AI",
    },
    sentiment: {
      positive: "Positive",
      neutral: "Neutral",
      negative: "Negative",
      urgent: "Urgent",
    },
  },
  tr: {
    title: "Gelen Kutusu",
    subtitle: "Her kanal, tek görünüm",
    rail: {
      sectionChannels: "Kanallar",
      sectionFilters: "Filtreler",
      sectionDemo: "Demo verisi",
      seedDemo: "Örnek veri yükle",
      seeding: "Yükleniyor …",
      clearDemo: "Örnek veriyi temizle",
      clearing: "Temizleniyor …",
      demoHint:
        "WhatsApp / Telegram / E-posta / Voice — 4 kanal için fuara hazır örnek konuşmalar.",
      all: "Tümü",
      open: "Açık",
      snoozed: "Ertelendi",
      closed: "Kapandı",
      archived: "Arşiv",
      statusAll: "Tüm durumlar",
      noChannels: "Henüz kanal yok",
      addChannelHint:
        "WhatsApp, Telegram veya E-postayı Ayarlar → Kanallar bölümünden bağlayın.",
    },
    channels: {
      all: "Tüm kanallar",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      email: "E-posta",
      voice: "Voice",
      web: "Web formu",
      card_action: "Kart aksiyonları",
    },
    list: {
      empty: "Konuşma yok",
      emptyHint: "Gelen mesajlar burada görünür.",
      loading: "Yükleniyor …",
      loadFailed: "Yüklenemedi.",
      youPrefix: "Siz:",
      voiceNote: "Sesli not",
      attachment: "Ek",
    },
    detail: {
      placeholder: "Mesajları görmek için soldan bir konuşma seçin.",
      aiSummary: "AI özet",
      aiSentiment: "Sentiment",
      aiIntent: "Niyet",
      aiNotYet: "Henüz analiz yok — yeni konuşma.",
      suggestDraft: "AI ile yanıt taslağı çiz",
      regenDraft: "Yeniden çiz",
      useDraft: "Taslağı kullan",
      dismissDraft: "Vazgeç",
      reply: "Yanıt",
      replyPlaceholder: "Yanıtınızı yazın …",
      send: "Gönder",
      sending: "Gönderiliyor …",
      sendFailed: "Gönderilemedi.",
      close: "Kapat",
      reopen: "Yeniden aç",
      snooze: "1 gün ertele",
      archive: "Arşivle",
      priorityLabel: "Öncelik",
      youSent: "Siz",
      customerSent: "Müşteri",
      aiSent: "AI",
    },
    sentiment: {
      positive: "Pozitif",
      neutral: "Nötr",
      negative: "Negatif",
      urgent: "Acil",
    },
  },
};

const CHANNEL_ORDER: (ChannelType | "all")[] = [
  "all",
  "whatsapp",
  "telegram",
  "email",
  "voice",
  "web",
  "card_action",
];

const CHANNEL_ICON: Record<ChannelType | "all", string> = {
  all: "•",
  whatsapp: "WA",
  telegram: "TG",
  email: "@",
  voice: "♪",
  web: "↻",
  card_action: "▢",
};

const SENTIMENT_TONE: Record<string, string> = {
  positive: "bg-signal-ok/10 text-signal-ok",
  neutral: "bg-bg-3 text-ink-400",
  negative: "bg-signal-err/10 text-signal-err",
  urgent: "bg-signal-err/15 text-signal-err font-semibold",
};

function formatRelative(iso: string, locale: Locale): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return locale === "de" ? "gerade eben" : locale === "tr" ? "az önce" : "just now";
  if (min < 60) return `${min}m`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(
    locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB",
    { day: "2-digit", month: "short" },
  );
}

function preview(text: string | null, max = 80): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function InboxClient() {
  const params = useParams();
  const locale = ((params?.locale as Locale | undefined) ?? "de") as Locale;
  const copy = COPY[locale] ?? COPY.de;

  const [channels, setChannels] = useState<ChannelSummary[]>([]);
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [demoBusy, setDemoBusy] = useState<"seed" | "clear" | null>(null);

  const channelCounts = useMemo(() => {
    const total = channels.reduce(
      (acc, c) => ({
        open: acc.open + c.counts.open,
        unread: acc.unread + c.counts.unread,
      }),
      { open: 0, unread: 0 },
    );
    return { ...Object.fromEntries(channels.map((c) => [c.type, c.counts])), all: total } as Record<string, { open: number; unread: number }>;
  }, [channels]);

  const loadChannels = useCallback(async () => {
    try {
      const res = await fetch("/api/inbox/channels");
      if (!res.ok) return;
      const data = (await res.json()) as { channels: ChannelSummary[] };
      setChannels(data.channels);
    } catch {
      // best-effort — rail still renders with All
    }
  }, []);

  const loadThreads = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const qs = new URLSearchParams({
        status: statusFilter,
        channelType: channelFilter,
      });
      const res = await fetch(`/api/inbox/threads?${qs.toString()}`);
      if (!res.ok) throw new Error("load_failed");
      const data = (await res.json()) as { threads: ThreadListItem[] };
      setThreads(data.threads);
    } catch {
      setThreads([]);
      setListError(copy.list.loadFailed);
    } finally {
      setLoadingList(false);
    }
  }, [statusFilter, channelFilter, copy.list.loadFailed]);

  const loadDetail = useCallback(async (threadId: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/inbox/threads/${threadId}`);
      if (!res.ok) {
        setDetail(null);
        return;
      }
      const data = (await res.json()) as { thread: ThreadDetail };
      setDetail(data.thread);
      // Best-effort read-marker; we don't await UI on this.
      void fetch(`/api/inbox/threads/${threadId}/read`, { method: "POST" });
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    void loadChannels();
  }, [loadChannels]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (activeThreadId) void loadDetail(activeThreadId);
    else setDetail(null);
  }, [activeThreadId, loadDetail]);

  // After a thread is patched (status / etc) or a reply is sent, refresh
  // both list and current detail so the UI stays consistent.
  const refreshAll = useCallback(async () => {
    await loadThreads();
    if (activeThreadId) await loadDetail(activeThreadId);
    await loadChannels();
  }, [loadThreads, loadDetail, loadChannels, activeThreadId]);

  async function handleSeedDemo() {
    setDemoBusy("seed");
    try {
      await fetch("/api/inbox/demo/seed", { method: "POST" });
      await refreshAll();
    } finally {
      setDemoBusy(null);
    }
  }

  async function handleClearDemo() {
    setDemoBusy("clear");
    try {
      await fetch("/api/inbox/demo/clear", { method: "POST" });
      setActiveThreadId(null);
      await refreshAll();
    } finally {
      setDemoBusy(null);
    }
  }

  const hasDemoChannel = channels.some(
    (c) => c.label?.startsWith("[DEMO]") ?? false,
  );

  return (
    <div className="grid h-[calc(100vh-120px)] min-h-[600px] grid-cols-[260px_360px_1fr] gap-4 px-6">
      {/* ------------------- LEFT RAIL: channels + status -------------- */}
      <aside className="flex flex-col gap-4 overflow-y-auto rounded-2xl border border-line bg-bg-1 p-4">
        <div>
          <p className="meta mono-label mb-3 text-ink-400">
            {copy.rail.sectionChannels}
          </p>
          <ul className="space-y-1">
            {CHANNEL_ORDER.map((c) => {
              const isActive = channelFilter === c;
              const counts =
                c === "all"
                  ? channelCounts.all
                  : channelCounts[c] ?? { open: 0, unread: 0 };
              return (
                <li key={c}>
                  <button
                    onClick={() => setChannelFilter(c)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "bg-ink text-bg-0"
                        : "text-ink hover:bg-bg-2"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="mono-label inline-flex h-6 w-7 items-center justify-center rounded bg-bg-3 text-[10px] text-ink-400">
                        {CHANNEL_ICON[c]}
                      </span>
                      {copy.channels[c]}
                    </span>
                    {counts.open > 0 && (
                      <span
                        className={`mono-label text-[11px] ${
                          isActive ? "text-bg-0" : "text-ink-400"
                        }`}
                      >
                        {counts.unread > 0
                          ? `${counts.unread}/${counts.open}`
                          : counts.open}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="meta mono-label mb-3 text-ink-400">
            {copy.rail.sectionFilters}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {(["open", "snoozed", "closed", "archived", "all"] as StatusFilter[]).map(
              (s) => {
                const label =
                  s === "open"
                    ? copy.rail.open
                    : s === "snoozed"
                      ? copy.rail.snoozed
                      : s === "closed"
                        ? copy.rail.closed
                        : s === "archived"
                          ? copy.rail.archived
                          : copy.rail.statusAll;
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`chip text-xs ${
                      active
                        ? "bg-ink text-bg-0 border-ink"
                        : "hover:bg-bg-2"
                    }`}
                  >
                    {label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {channels.length === 0 && (
          <div className="rounded-lg border border-line-soft bg-bg-2 p-3 text-xs text-ink-400">
            <p className="font-medium text-ink">{copy.rail.noChannels}</p>
            <p className="mt-1 leading-snug">{copy.rail.addChannelHint}</p>
          </div>
        )}

        <div className="mt-auto border-t border-line-soft pt-3">
          <p className="meta mono-label mb-2 text-ink-400">
            {copy.rail.sectionDemo}
          </p>
          <div className="space-y-1.5">
            {!hasDemoChannel ? (
              <button
                onClick={handleSeedDemo}
                disabled={demoBusy !== null}
                className="btn btn-ghost btn-sm w-full text-xs"
              >
                {demoBusy === "seed" ? copy.rail.seeding : copy.rail.seedDemo}
              </button>
            ) : (
              <button
                onClick={handleClearDemo}
                disabled={demoBusy !== null}
                className="btn btn-ghost btn-sm w-full text-xs"
              >
                {demoBusy === "clear" ? copy.rail.clearing : copy.rail.clearDemo}
              </button>
            )}
            <p className="text-[10px] leading-snug text-ink-400">
              {copy.rail.demoHint}
            </p>
          </div>
        </div>
      </aside>

      {/* --------------------- CENTER: thread list --------------------- */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-1">
        <header className="border-b border-line-soft px-4 py-3">
          <h1 className="text-base font-semibold text-ink">{copy.title}</h1>
          <p className="text-xs text-ink-400">{copy.subtitle}</p>
        </header>
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <p className="p-6 text-sm text-ink-400">{copy.list.loading}</p>
          ) : listError ? (
            <p className="p-6 text-sm text-signal-err">{listError}</p>
          ) : threads.length === 0 ? (
            <div className="p-6">
              <p className="text-sm font-medium text-ink">{copy.list.empty}</p>
              <p className="mt-1 text-xs text-ink-400">{copy.list.emptyHint}</p>
            </div>
          ) : (
            <ul>
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveThreadId(t.id)}
                    className={`block w-full border-b border-line-soft px-4 py-3 text-left transition ${
                      activeThreadId === t.id
                        ? "bg-bg-2"
                        : "hover:bg-bg-2/60"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="flex items-center gap-2 truncate text-sm font-medium text-ink">
                        {t.unreadCount > 0 && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-copper" />
                        )}
                        <span className="mono-label rounded bg-bg-3 px-1.5 py-0.5 text-[10px] text-ink-400">
                          {CHANNEL_ICON[t.channelType]}
                        </span>
                        <span className="truncate">
                          {t.contactName ?? t.contactHandle}
                        </span>
                      </span>
                      <span className="mono-label shrink-0 text-[10px] text-ink-400">
                        {formatRelative(t.lastMessageAt, locale)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-ink-400">
                      {t.lastMessage?.direction === "out" && (
                        <span className="mr-1 text-ink-300">
                          {copy.list.youPrefix}
                        </span>
                      )}
                      {preview(
                        t.aiSummary ??
                          t.lastMessage?.body ??
                          (t.lastMessage?.body === null
                            ? copy.list.voiceNote
                            : ""),
                      )}
                    </p>
                    {(t.aiSentiment || t.aiIntent) && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {t.aiSentiment && (
                          <span
                            className={`mono-label rounded px-1.5 py-0.5 text-[10px] ${
                              SENTIMENT_TONE[t.aiSentiment] ?? SENTIMENT_TONE.neutral
                            }`}
                          >
                            {copy.sentiment[
                              t.aiSentiment as keyof typeof copy.sentiment
                            ] ?? t.aiSentiment}
                          </span>
                        )}
                        {t.aiIntent && t.aiIntent !== "other" && (
                          <span className="mono-label rounded bg-bg-3 px-1.5 py-0.5 text-[10px] text-ink-400">
                            {t.aiIntent}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ----------------------- RIGHT: detail --------------------------- */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-1">
        {!activeThreadId ? (
          <div className="flex flex-1 items-center justify-center p-10 text-sm text-ink-400">
            {copy.detail.placeholder}
          </div>
        ) : loadingDetail || !detail ? (
          <div className="p-6 text-sm text-ink-400">{copy.list.loading}</div>
        ) : (
          <ThreadDetailPane
            thread={detail}
            copy={copy}
            locale={locale}
            onRefresh={refreshAll}
          />
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail pane (extracted to keep the main render tidy)
// ---------------------------------------------------------------------------

function ThreadDetailPane({
  thread,
  copy,
  locale,
  onRefresh,
}: {
  thread: ThreadDetail;
  copy: (typeof COPY)["en"];
  locale: Locale;
  onRefresh: () => Promise<void>;
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState<ThreadSuggestion | null>(
    thread.suggestions.find((s) => s.type === "reply" && s.status === "pending") ??
      null,
  );
  const [statusBusy, setStatusBusy] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReplyText("");
    setSendError(null);
    setDraft(
      thread.suggestions.find(
        (s) => s.type === "reply" && s.status === "pending",
      ) ?? null,
    );
  }, [thread.id, thread.suggestions]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread.messages.length]);

  async function patch(body: Record<string, unknown>) {
    setStatusBusy("patch");
    try {
      await fetch(`/api/inbox/threads/${thread.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await onRefresh();
    } finally {
      setStatusBusy(null);
    }
  }

  async function handleSend() {
    if (!replyText.trim()) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/inbox/threads/${thread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyText.trim() }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        description?: string;
        status?: string;
      };
      if (!res.ok) {
        setSendError(json.description ?? copy.detail.sendFailed);
        return;
      }
      // The route returns 200 even when channel dispatch failed (the message
      // is persisted with status "failed"). Honor that status instead of
      // reporting a silent success.
      setReplyText("");
      setDraft(null);
      if (json.status === "failed") {
        setSendError(copy.detail.sendFailed);
      }
      await onRefresh();
    } finally {
      setSending(false);
    }
  }

  async function handleDraft() {
    setDrafting(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/inbox/threads/${thread.id}/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        // AI key missing / no suggestion -> 4xx/5xx. Surface it instead of a
        // silent no-op that just stops the spinner.
        const json = (await res.json().catch(() => ({}))) as {
          description?: string;
        };
        setSendError(json.description ?? copy.detail.sendFailed);
        return;
      }
      const json = (await res.json()) as { suggestion: ThreadSuggestion };
      setDraft(json.suggestion);
    } finally {
      setDrafting(false);
    }
  }

  function senderLabel(direction: "in" | "out", sentBy: string): string {
    if (direction === "in") return copy.detail.customerSent;
    if (sentBy.startsWith("ai_")) return copy.detail.aiSent;
    return copy.detail.youSent;
  }

  function timestamp(iso: string): string {
    return new Date(iso).toLocaleString(
      locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB",
      { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" },
    );
  }

  return (
    <>
      <header className="border-b border-line-soft px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-ink">
              {thread.contactName ?? thread.contactHandle}
            </h2>
            <p className="truncate text-xs text-ink-400">
              {thread.contactHandle} · {copy.channels[thread.channelType]}
              {thread.subject ? ` · ${thread.subject}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {thread.status === "open" ? (
              <>
                <button
                  className="chip text-xs"
                  disabled={!!statusBusy}
                  onClick={() => {
                    const snooze = new Date();
                    snooze.setDate(snooze.getDate() + 1);
                    void patch({
                      status: "snoozed",
                      snoozedUntil: snooze.toISOString(),
                    });
                  }}
                >
                  {copy.detail.snooze}
                </button>
                <button
                  className="chip text-xs"
                  disabled={!!statusBusy}
                  onClick={() => patch({ status: "closed" })}
                >
                  {copy.detail.close}
                </button>
              </>
            ) : (
              <button
                className="chip text-xs"
                disabled={!!statusBusy}
                onClick={() => patch({ status: "open", snoozedUntil: null })}
              >
                {copy.detail.reopen}
              </button>
            )}
            <button
              className="chip text-xs"
              disabled={!!statusBusy}
              onClick={() => patch({ status: "archived" })}
            >
              {copy.detail.archive}
            </button>
          </div>
        </div>
        {thread.aiSummary && (
          <div className="mt-3 rounded-lg border border-line-soft bg-bg-2 p-3 text-xs">
            <p className="mono-label mb-1 text-[10px] text-ink-400">
              {copy.detail.aiSummary}
            </p>
            <p className="text-ink">{thread.aiSummary}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {thread.aiSentiment && (
                <span
                  className={`mono-label rounded px-1.5 py-0.5 text-[10px] ${
                    SENTIMENT_TONE[thread.aiSentiment] ?? SENTIMENT_TONE.neutral
                  }`}
                >
                  {copy.detail.aiSentiment}:{" "}
                  {copy.sentiment[
                    thread.aiSentiment as keyof typeof copy.sentiment
                  ] ?? thread.aiSentiment}
                </span>
              )}
              {thread.aiIntent && (
                <span className="mono-label rounded bg-bg-3 px-1.5 py-0.5 text-[10px] text-ink-400">
                  {copy.detail.aiIntent}: {thread.aiIntent}
                </span>
              )}
            </div>
          </div>
        )}
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {thread.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.direction === "out" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug shadow-sm ${
                m.direction === "out"
                  ? "bg-ink text-bg-0"
                  : "bg-bg-2 text-ink"
              }`}
            >
              <p className="mono-label mb-1 text-[10px] opacity-70">
                {senderLabel(m.direction, m.sentBy)} · {timestamp(m.createdAt)}
              </p>
              {m.body && <p className="whitespace-pre-wrap">{m.body}</p>}
              {m.voiceTranscript && (
                <p className="mt-2 border-l-2 border-current/30 pl-2 italic opacity-80">
                  {copy.list.voiceNote}: {m.voiceTranscript}
                </p>
              )}
              {m.mediaUrls.length > 0 && (
                <p className="mt-1 text-[10px] opacity-70">
                  {copy.list.attachment} ({m.mediaUrls.length})
                </p>
              )}
              {m.status === "failed" && (
                <p className="mt-1 text-[10px] text-signal-err">
                  {copy.detail.sendFailed}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="border-t border-line-soft p-3">
        {draft && (
          <div className="mb-2 rounded-lg border border-copper/30 bg-copper/5 p-3 text-xs">
            <p className="mono-label mb-1 text-[10px] text-copper">
              AI · {draft.modelUsed ?? "draft"}
            </p>
            <p className="whitespace-pre-wrap text-ink">{draft.content}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="chip chip-hot text-xs"
                onClick={() => {
                  setReplyText(draft.content);
                  setDraft(null);
                }}
              >
                {copy.detail.useDraft}
              </button>
              <button
                className="chip text-xs"
                onClick={() => setDraft(null)}
              >
                {copy.detail.dismissDraft}
              </button>
              <button
                className="chip text-xs"
                disabled={drafting}
                onClick={handleDraft}
              >
                {drafting ? "…" : copy.detail.regenDraft}
              </button>
            </div>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={copy.detail.replyPlaceholder}
            rows={2}
            className="field flex-1 resize-y text-sm"
          />
          <div className="flex flex-col gap-1.5">
            {!draft && (
              <button
                onClick={handleDraft}
                disabled={drafting}
                className="btn btn-ghost btn-sm whitespace-nowrap"
              >
                {drafting ? "…" : copy.detail.suggestDraft}
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={sending || !replyText.trim()}
              className="btn btn-primary btn-sm"
            >
              {sending ? copy.detail.sending : copy.detail.send}
            </button>
          </div>
        </div>
        {sendError && (
          <p className="mt-2 text-xs text-signal-err">{sendError}</p>
        )}
      </footer>
    </>
  );
}
