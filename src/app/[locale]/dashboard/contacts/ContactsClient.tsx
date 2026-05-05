"use client";

// =============================================================================
// ContactsClient — Phase 8.3
//
// Displays the current user's saved contacts fetched from
// GET /api/account/saved-cards.
//
// Features:
//   - List view: avatar, name/title/company, status badge, star, follow-up date
//   - Filter chips: All / Starred / Active / Archived
//   - Expandable inline detail panel: notes, tags, metWhere, followUpAt, status
//   - Autosave (1 s debounce) for text fields; immediate save for status/starred
//   - PATCH /api/account/saved-cards/[id] for updates
//   - DELETE /api/account/saved-cards/[id] with confirm for removal
//   - Empty state with link to /discover
//
// Design: bg-bg-0/1/2, border-line, copper-500 tokens only. No framer-motion.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ContactCard {
  id: string;
  slug: string;
  name: string;
  title?: string | null;
  company?: string | null;
  photoPath?: string | null;
  industry?: string | null;
  city?: string | null;
  country?: string | null;
}

type ContactStatus = "new" | "contacted" | "customer" | "partner" | "archived";

interface SavedContact {
  id: string;
  notes: string | null;
  tags: string[];
  metWhere: string | null;
  followUpAt: string | null; // ISO date string or null
  status: ContactStatus;
  starred: boolean;
  card: ContactCard;
}

type FilterKey = "all" | "starred" | "active" | "archived";

// ---------------------------------------------------------------------------
// Locale-aware labels
// ---------------------------------------------------------------------------
type Locale = "de" | "en" | "tr";

const COPY: Record<Locale, {
  heading: string;
  filterAll: string;
  filterStarred: string;
  filterActive: string;
  filterArchived: string;
  emptyHeading: string;
  emptyHint: string;
  discoverLink: string;
  viewCard: string;
  notesPlaceholder: string;
  tagsPlaceholder: string;
  metWherePlaceholder: string;
  followUpLabel: string;
  statusLabel: string;
  deleteLabel: string;
  deleteConfirm: string;
  statusOptions: Record<ContactStatus, string>;
  saving: string;
  saved: string;
  loadError: string;
}> = {
  de: {
    heading: "Meine Kontakte",
    filterAll: "Alle",
    filterStarred: "Favoriten",
    filterActive: "Aktiv",
    filterArchived: "Archiviert",
    emptyHeading: "Noch keine gespeicherten Kontakte",
    emptyHint: "Entdecken Sie Karten und speichern Sie interessante Kontakte.",
    discoverLink: "Karten entdecken",
    viewCard: "Karte ansehen",
    notesPlaceholder: "Notizen zu diesem Kontakt…",
    tagsPlaceholder: "Tags, kommagetrennt (z. B. startup, berlin)",
    metWherePlaceholder: "Wo getroffen? (z. B. SaaS-Konferenz Berlin)",
    followUpLabel: "Wiedervorlage",
    statusLabel: "Status",
    deleteLabel: "Entfernen",
    deleteConfirm: "Diesen Kontakt aus Ihrer Liste entfernen?",
    saving: "Speichern…",
    saved: "Gespeichert",
    loadError: "Kontakte konnten nicht geladen werden.",
    statusOptions: {
      new: "Neu",
      contacted: "Kontaktiert",
      customer: "Kunde",
      partner: "Partner",
      archived: "Archiviert",
    },
  },
  en: {
    heading: "My Contacts",
    filterAll: "All",
    filterStarred: "Starred",
    filterActive: "Active",
    filterArchived: "Archived",
    emptyHeading: "No saved contacts yet",
    emptyHint: "Discover cards and save contacts you want to keep.",
    discoverLink: "Discover cards",
    viewCard: "View card",
    notesPlaceholder: "Notes about this contact…",
    tagsPlaceholder: "Tags, comma-separated (e.g. startup, berlin)",
    metWherePlaceholder: "Where did you meet? (e.g. SaaS Conference Berlin)",
    followUpLabel: "Follow-up date",
    statusLabel: "Status",
    deleteLabel: "Remove",
    deleteConfirm: "Remove this contact from your list?",
    saving: "Saving…",
    saved: "Saved",
    loadError: "Could not load contacts.",
    statusOptions: {
      new: "New",
      contacted: "Contacted",
      customer: "Customer",
      partner: "Partner",
      archived: "Archived",
    },
  },
  tr: {
    heading: "Kişilerim",
    filterAll: "Tümü",
    filterStarred: "Yıldızlı",
    filterActive: "Aktif",
    filterArchived: "Arşivlendi",
    emptyHeading: "Henüz kayıtlı kişi yok",
    emptyHint: "Kartları keşfedin ve ilginizi çeken kişileri kaydedin.",
    discoverLink: "Kartları keşfet",
    viewCard: "Kartı görüntüle",
    notesPlaceholder: "Bu kişi hakkında notlar…",
    tagsPlaceholder: "Etiketler, virgülle ayırın (örn. startup, berlin)",
    metWherePlaceholder: "Nerede tanıştınız? (örn. SaaS Konferansı Berlin)",
    followUpLabel: "Takip tarihi",
    statusLabel: "Durum",
    deleteLabel: "Kaldır",
    deleteConfirm: "Bu kişiyi listenizden kaldırmak istiyor musunuz?",
    saving: "Kaydediliyor…",
    saved: "Kaydedildi",
    loadError: "Kişiler yüklenemedi.",
    statusOptions: {
      new: "Yeni",
      contacted: "İletişime geçildi",
      customer: "Müşteri",
      partner: "İş ortağı",
      archived: "Arşivlendi",
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function statusBadgeClass(status: ContactStatus): string {
  switch (status) {
    case "new":
      return "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    case "contacted":
      return "bg-copper-500/15 text-copper-600";
    case "customer":
      return "bg-signal-ok/15 text-signal-ok";
    case "partner":
      return "bg-copper-500/20 text-copper-500";
    case "archived":
      return "bg-bg-3 text-ink-500";
    default:
      return "bg-bg-3 text-ink-400";
  }
}

function avatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

// ---------------------------------------------------------------------------
// StarButton
// ---------------------------------------------------------------------------
function StarButton({
  starred,
  onToggle,
  disabled,
}: {
  starred: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      aria-label={starred ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      aria-pressed={starred}
      className="flex-shrink-0 rounded p-1 transition-colors hover:bg-bg-3 disabled:opacity-50"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill={starred ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={starred ? "text-copper-500" : "text-ink-400"}
        aria-hidden="true"
      >
        <path d="M8 2.5L9.8 6.2L14 6.9L11 9.8L11.6 14L8 12.1L4.4 14L5 9.8L2 6.9L6.2 6.2L8 2.5Z" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// ContactRow
// ---------------------------------------------------------------------------
function ContactRow({
  contact,
  locale,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}: {
  contact: SavedContact;
  locale: Locale;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (id: string, patch: Partial<SavedContact>) => void;
  onDelete: (id: string) => void;
}) {
  const copy = COPY[locale];

  // Local draft state for the expanded panel text fields
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [tags, setTags] = useState((contact.tags ?? []).join(", "));
  const [metWhere, setMetWhere] = useState(contact.metWhere ?? "");
  const [followUpAt, setFollowUpAt] = useState(
    contact.followUpAt ? contact.followUpAt.substring(0, 10) : "",
  );
  const [status, setStatus] = useState<ContactStatus>(contact.status);
  const [starred, setStarred] = useState(contact.starred);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if parent updates (e.g. optimistic updates propagate back)
  useEffect(() => {
    setNotes(contact.notes ?? "");
    setTags((contact.tags ?? []).join(", "));
    setMetWhere(contact.metWhere ?? "");
    setFollowUpAt(contact.followUpAt ? contact.followUpAt.substring(0, 10) : "");
    setStatus(contact.status);
    setStarred(contact.starred);
  }, [contact]);

  const patchContact = useCallback(
    async (patch: Partial<SavedContact>) => {
      setSaveState("saving");
      try {
        const res = await fetch(`/api/account/saved-cards/${contact.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const updated = await res.json();
          onUpdate(contact.id, updated);
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 2000);
        }
      } catch {
        setSaveState("idle");
      }
    },
    [contact.id, onUpdate],
  );

  // Debounced autosave for text fields
  const scheduleTextSave = useCallback(
    (patch: Partial<SavedContact>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void patchContact(patch);
      }, 1000);
    },
    [patchContact],
  );

  const handleStarToggle = () => {
    const next = !starred;
    setStarred(next);
    onUpdate(contact.id, { starred: next });
    void patchContact({ starred: next });
  };

  const handleStatusChange = (next: ContactStatus) => {
    setStatus(next);
    onUpdate(contact.id, { status: next });
    void patchContact({ status: next });
  };

  const handleDelete = () => {
    if (!window.confirm(copy.deleteConfirm)) return;
    onDelete(contact.id);
  };

  const followUpDisplay =
    followUpAt
      ? new Date(followUpAt).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })
      : null;

  return (
    <li className="rounded-xl border border-line bg-bg-1 overflow-hidden">
      {/* --- Summary row --- */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-bg-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-inset"
        aria-expanded={isExpanded}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-copper-500/10 flex items-center justify-center overflow-hidden ring-1 ring-line">
          {contact.card.photoPath ? (
            <Image
              src={contact.card.photoPath}
              alt={contact.card.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-copper-600 select-none">
              {avatarInitials(contact.card.name)}
            </span>
          )}
        </div>

        {/* Name / title / company */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{contact.card.name}</p>
          {(contact.card.title || contact.card.company) && (
            <p className="text-xs text-ink-400 truncate">
              {[contact.card.title, contact.card.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Status badge */}
        <span
          className={[
            "hidden sm:inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-none",
            statusBadgeClass(status),
          ].join(" ")}
        >
          {copy.statusOptions[status]}
        </span>

        {/* Follow-up date */}
        {followUpDisplay && (
          <span className="hidden md:block flex-shrink-0 text-xs text-ink-400 tabular-nums">
            {followUpDisplay}
          </span>
        )}

        {/* Expand chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            "flex-shrink-0 text-ink-400 transition-transform duration-200",
            isExpanded ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* --- Expanded detail panel --- */}
      {isExpanded && (
        <div className="border-t border-line bg-bg-2 px-4 py-4 space-y-4">
          {/* Top action row: star + view card + delete */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StarButton
                starred={starred}
                onToggle={handleStarToggle}
              />
              <a
                href={`/c/${contact.card.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-bg-1 px-3 py-1.5 text-xs font-medium text-ink-400 transition-colors hover:border-copper-500 hover:text-copper-500"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3M10 2h4m0 0v4m0-4L7 9" />
                </svg>
                {copy.viewCard}
              </a>
            </div>

            {/* Save indicator */}
            {saveState !== "idle" && (
              <span className="text-[11px] text-ink-400">
                {saveState === "saving" ? copy.saving : copy.saved}
              </span>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-bg-1 px-3 py-1.5 text-xs font-medium text-ink-400 transition-colors hover:border-signal-err hover:text-signal-err"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8L13 4" />
              </svg>
              {copy.deleteLabel}
            </button>
          </div>

          {/* Status + follow-up row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-400 mb-1">
                {copy.statusLabel}
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as ContactStatus)}
                className="w-full rounded-lg border border-line bg-bg-0 px-3 py-2 text-sm text-ink focus:border-copper-500 focus:outline-none"
              >
                {(["new", "contacted", "customer", "partner", "archived"] as ContactStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {copy.statusOptions[s]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-400 mb-1">
                {copy.followUpLabel}
              </label>
              <input
                type="date"
                value={followUpAt}
                onChange={(e) => {
                  setFollowUpAt(e.target.value);
                  scheduleTextSave({ followUpAt: e.target.value || null });
                }}
                className="w-full rounded-lg border border-line bg-bg-0 px-3 py-2 text-sm text-ink focus:border-copper-500 focus:outline-none"
              />
            </div>
          </div>

          {/* metWhere */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-400 mb-1">
              {locale === "de" ? "Wo getroffen" : locale === "tr" ? "Nerede tanıştınız" : "Where met"}
            </label>
            <input
              type="text"
              value={metWhere}
              placeholder={copy.metWherePlaceholder}
              onChange={(e) => {
                setMetWhere(e.target.value);
                scheduleTextSave({ metWhere: e.target.value || null });
              }}
              className="w-full rounded-lg border border-line bg-bg-0 px-3 py-2 text-sm text-ink placeholder:text-ink-500 focus:border-copper-500 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-400 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              placeholder={copy.tagsPlaceholder}
              onChange={(e) => {
                setTags(e.target.value);
                scheduleTextSave({
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                });
              }}
              className="w-full rounded-lg border border-line bg-bg-0 px-3 py-2 text-sm text-ink placeholder:text-ink-500 focus:border-copper-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-400 mb-1">
              {locale === "de" ? "Notizen" : locale === "tr" ? "Notlar" : "Notes"}
            </label>
            <textarea
              value={notes}
              placeholder={copy.notesPlaceholder}
              rows={3}
              onChange={(e) => {
                setNotes(e.target.value);
                scheduleTextSave({ notes: e.target.value || null });
              }}
              className="w-full resize-y rounded-lg border border-line bg-bg-0 px-3 py-2 text-sm text-ink placeholder:text-ink-500 focus:border-copper-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------
export function ContactsClient() {
  const params = useParams();
  const router = useRouter();
  const locale: Locale = (["de", "en", "tr"].includes(String(params?.locale))
    ? String(params.locale)
    : "de") as Locale;

  const copy = COPY[locale];

  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load saved contacts
  useEffect(() => {
    setLoading(true);
    fetch("/api/account/saved-cards")
      .then((r) => {
        if (r.status === 401) {
          router.push(`/${locale}/login?next=/dashboard/contacts`);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) setContacts(data.items ?? []);
        else if (data !== null) setError(true);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [locale, router]);

  const handleUpdate = useCallback((id: string, patch: Partial<SavedContact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/account/saved-cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch {
      // silent — user can retry
    }
  }, [expandedId]);

  // Filter logic
  const filtered = contacts.filter((c) => {
    if (filter === "starred") return c.starred;
    if (filter === "active") return c.status === "new" || c.status === "contacted";
    if (filter === "archived") return c.status === "archived";
    return true;
  });

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "all", label: copy.filterAll },
    { key: "starred", label: copy.filterStarred },
    { key: "active", label: copy.filterActive },
    { key: "archived", label: copy.filterArchived },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold text-ink">{copy.heading}</h1>
        <p className="mt-0.5 text-sm text-ink-400">
          {contacts.length > 0 && `${contacts.length} ${locale === "de" ? "Kontakt" + (contacts.length !== 1 ? "e" : "") : locale === "tr" ? "kişi" : "contact" + (contacts.length !== 1 ? "s" : "")}`}
        </p>
      </div>

      {/* Filter chips */}
      {contacts.length > 0 && (
        <div
          role="group"
          aria-label={locale === "de" ? "Filter" : "Filter"}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map(({ key, label }) => {
            const count =
              key === "all"
                ? contacts.length
                : key === "starred"
                ? contacts.filter((c) => c.starred).length
                : key === "active"
                ? contacts.filter((c) => c.status === "new" || c.status === "contacted").length
                : contacts.filter((c) => c.status === "archived").length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === key
                    ? "border-copper-500 bg-copper-500/10 text-copper-500"
                    : "border-line bg-bg-1 text-ink-400 hover:border-line-firm hover:text-ink",
                ].join(" ")}
              >
                {label}
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px] leading-none tabular-nums",
                    filter === key ? "bg-copper-500/20" : "bg-bg-3",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <ul className="space-y-2" aria-label="Loading contacts">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="rounded-xl border border-line bg-bg-1 px-4 py-3 flex items-center gap-3 animate-pulse"
              aria-hidden="true"
            >
              <div className="h-10 w-10 rounded-full bg-bg-3 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-bg-3" />
                <div className="h-2.5 w-48 rounded bg-bg-3" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-xl border border-line bg-bg-1 px-6 py-8 text-center">
          <p className="text-sm text-ink-400">{copy.loadError}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && contacts.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-bg-1 px-6 py-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bg-3">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{copy.emptyHeading}</p>
            <p className="mt-1 text-xs text-ink-400">{copy.emptyHint}</p>
          </div>
          <a
            href={`/${locale}/discover`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-copper-500 bg-copper-500/10 px-4 py-2 text-sm font-medium text-copper-500 transition-colors hover:bg-copper-500/20"
          >
            {copy.discoverLink}
          </a>
        </div>
      )}

      {/* Filtered empty state (has contacts, but none match filter) */}
      {!loading && !error && contacts.length > 0 && filtered.length === 0 && (
        <div className="rounded-xl border border-line bg-bg-1 px-6 py-8 text-center">
          <p className="text-sm text-ink-400">
            {locale === "de"
              ? "Keine Kontakte für diesen Filter."
              : locale === "tr"
              ? "Bu filtre için kişi bulunamadı."
              : "No contacts match this filter."}
          </p>
        </div>
      )}

      {/* Contact list */}
      {!loading && !error && filtered.length > 0 && (
        <ul className="space-y-2" role="list">
          {filtered.map((contact) => (
            <ContactRow
              key={contact.id}
              contact={contact}
              locale={locale}
              isExpanded={expandedId === contact.id}
              onToggleExpand={() =>
                setExpandedId((prev) => (prev === contact.id ? null : contact.id))
              }
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
