"use client";

// =============================================================================
// DiscoverClient — public professional directory (Phase 8.1)
//
// Public page — no auth required to browse.
// Fetches from GET /api/discover/cards with cursor-based pagination.
// Filters: free-text search, openToNetworking, acceptingClients.
//
// Sector label: the CardOrder.industry/city/country columns are never written
// by any code path, so they always render blank and filtering on them returns
// nothing. The only reliable sector signal is the card's TEMPLATE — each
// template in card-templates.ts carries a `sectorHint`, which we map to a human
// label via SECTOR_PRESETS.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { SECTOR_PRESETS, type SectorKey } from "@/config/card-sectors";
import { getTemplateById, type CardTemplateDef } from "@/config/card-templates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiscoverCard {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  company: string | null;
  photoPath: string | null;
  templateId: number;
  languages: string[];
  openToNetworking: boolean;
  acceptingClients: boolean;
  publishedAt: string | null;
}

// ---------------------------------------------------------------------------
// Sector label derivation
//
// A template's `sectorHint` is a fine-grained union (realEstate, fitness,
// dentist, …) that does NOT line up 1:1 with the coarser SECTOR_PRESETS keys
// (real-estate, consultant, …). This map bridges the hints we can confidently
// name to a preset key; anything not listed falls back to no label.
// ---------------------------------------------------------------------------

const SECTOR_HINT_TO_PRESET: Partial<Record<CardTemplateDef["sectorHint"], SectorKey>> = {
  realEstate: "real-estate",
  salon: "salon",
  restaurant: "restaurant",
  creator: "creator",
  "content-creator": "creator",
  lawyer: "lawyer",
  clinic: "clinic",
  dentist: "clinic",
  consultant: "consultant",
  freelancer: "consultant",
  corporate: "corporate",
  events: "event",
  eventPlanner: "event",
};

function sectorLabelForTemplate(templateId: number): string | null {
  const tmpl = getTemplateById(templateId);
  if (!tmpl) return null;
  const presetKey = SECTOR_HINT_TO_PRESET[tmpl.sectorHint];
  if (!presetKey) return null;
  return SECTOR_PRESETS[presetKey]?.name ?? null;
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function fetchCards(
  params: Record<string, string>,
  cursor?: string,
): Promise<{ items: DiscoverCard[]; nextCursor: string | null }> {
  const sp = new URLSearchParams({ ...params, limit: "20" });
  if (cursor) sp.set("cursor", cursor);
  const res = await fetch(`/api/discover/cards?${sp.toString()}`);
  if (!res.ok) throw new Error("fetch failed");
  return res.json() as Promise<{ items: DiscoverCard[]; nextCursor: string | null }>;
}

// ---------------------------------------------------------------------------
// Locale helpers
// ---------------------------------------------------------------------------

type Locale = "de" | "en" | "tr";

function t(locale: string, de: string, en: string, tr: string): string {
  if (locale === "en") return en;
  if (locale === "tr") return tr;
  return de;
}

// ---------------------------------------------------------------------------
// Avatar — shows photo or copper-tinted initials fallback
// ---------------------------------------------------------------------------

function Avatar({ name, photoPath }: { name: string; photoPath: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("");

  if (photoPath && !failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={photoPath.startsWith("/") || photoPath.startsWith("http") ? photoPath : `/${photoPath}`}
        alt={name}
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-line"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-copper-500/15 text-base font-semibold text-copper-600 ring-1 ring-copper-500/20"
    >
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------
// DiscoverCardItem — single card in the grid
// ---------------------------------------------------------------------------

function DiscoverCardItem({ card, locale }: { card: DiscoverCard; locale: string }) {
  const sectorLabel = sectorLabelForTemplate(card.templateId);

  return (
    <a
      href={`/c/${card.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-line bg-bg-1 p-4 transition-colors hover:border-copper-500"
      aria-label={[card.name, card.title, card.company].filter(Boolean).join(" · ")}
    >
      {/* Top row: avatar + name block */}
      <div className="flex items-start gap-3">
        <Avatar name={card.name} photoPath={card.photoPath} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink leading-tight">{card.name}</p>
          {(card.title || card.company) && (
            <p className="mt-0.5 truncate text-sm text-ink-300">
              {[card.title, card.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* Chips row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {sectorLabel && (
          <span className="inline-flex items-center rounded-full bg-copper-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-copper-600">
            {sectorLabel}
          </span>
        )}
        {card.openToNetworking && (
          <span className="inline-flex items-center rounded-full border border-line bg-bg-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-300">
            {t(locale, "Networking", "Open to network", "Networking'e açık")}
          </span>
        )}
        {card.acceptingClients && (
          <span className="inline-flex items-center rounded-full border border-line bg-bg-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-300">
            {t(locale, "Nimmt Kunden an", "Accepting clients", "Müşteri kabul ediyor")}
          </span>
        )}
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-bg-1 p-4">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-bg-2" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-bg-2" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-bg-2" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-20 animate-pulse rounded-full bg-bg-2" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-bg-2" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ locale }: { locale: string }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-2 text-ink-400"
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <p className="text-sm font-medium text-ink-300">
        {t(locale, "Keine Treffer gefunden", "No results found", "Sonuç bulunamadı")}
      </p>
      <p className="text-xs text-ink-400">
        {t(
          locale,
          "Versuchen Sie andere Filter oder eine breitere Suche.",
          "Try different filters or a broader search.",
          "Farklı filtreler veya daha geniş bir arama deneyin.",
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DiscoverClient
// ---------------------------------------------------------------------------

export function DiscoverClient() {
  const { locale } = useLocale();
  const safeLocale: Locale = (locale as Locale) ?? "de";

  // Filter state
  const [query, setQuery] = useState("");
  const [openToNetworking, setOpenToNetworking] = useState(false);
  const [acceptingClients, setAcceptingClients] = useState(false);

  // Data state
  const [items, setItems] = useState<DiscoverCard[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce query input
  const queryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (queryDebounceRef.current) clearTimeout(queryDebounceRef.current);
    queryDebounceRef.current = setTimeout(() => setDebouncedQuery(query), 350);
    return () => {
      if (queryDebounceRef.current) clearTimeout(queryDebounceRef.current);
    };
  }, [query]);

  // Build filter params object (memoized by primitive deps)
  const buildParams = useCallback((): Record<string, string> => {
    const p: Record<string, string> = {};
    if (debouncedQuery.trim()) p.q = debouncedQuery.trim();
    if (openToNetworking) p.openToNetworking = "true";
    if (acceptingClients) p.acceptingClients = "true";
    return p;
  }, [debouncedQuery, openToNetworking, acceptingClients]);

  // Initial load + filter change: reset items and cursor
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setItems([]);
    setNextCursor(null);

    fetchCards(buildParams())
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setNextCursor(data.nextCursor);
      })
      .catch(() => {
        if (cancelled) return;
        setError(t(safeLocale, "Laden fehlgeschlagen.", "Failed to load.", "Yükleme başarısız."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [buildParams, safeLocale]);

  // Load more (append next page)
  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchCards(buildParams(), nextCursor);
      setItems((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
    } catch {
      // non-fatal — just hide the button
      setNextCursor(null);
    } finally {
      setLoadingMore(false);
    }
  };

  const pageTitle = t(
    safeLocale,
    "Professionals entdecken",
    "Discover Professionals",
    "Profesyonelleri Keşfet",
  );

  return (
    <main className="min-h-screen bg-bg-0 pb-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 mb-1">
            OpSolid · Directory
          </p>
          <h1 className="font-display text-h2 text-ink">{pageTitle}</h1>
          <p className="mt-2 text-sm text-ink-300">
            {t(
              safeLocale,
              "Finde Fachleute, vernetze dich und starte Kooperationen.",
              "Find professionals, connect, and start collaborations.",
              "Profesyonelleri bulun, bağlantı kurun, iş birliği başlatın.",
            )}
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="mb-6 space-y-3">
          {/* Search input */}
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(safeLocale, "Name, Berufsfeld, Firma …", "Name, profession, company …", "İsim, meslek, şirket …")}
              className="w-full rounded-xl border border-line bg-bg-1 py-2.5 pl-9 pr-4 text-sm text-ink placeholder-ink-400 transition-colors focus:border-copper-500 focus:outline-none sm:max-w-sm"
            />
          </div>

          {/* Filter chips row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Networking toggle chip */}
            <button
              type="button"
              onClick={() => setOpenToNetworking((v) => !v)}
              aria-pressed={openToNetworking}
              className={[
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                openToNetworking
                  ? "border-copper-500 bg-copper-500/10 text-copper-600"
                  : "border-line bg-bg-1 text-ink-300 hover:border-copper-500/50",
              ].join(" ")}
            >
              {t(safeLocale, "Vernetzt sich", "Open to network", "Networking'e açık")}
            </button>

            {/* Accepting clients toggle chip */}
            <button
              type="button"
              onClick={() => setAcceptingClients((v) => !v)}
              aria-pressed={acceptingClients}
              className={[
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                acceptingClients
                  ? "border-copper-500 bg-copper-500/10 text-copper-600"
                  : "border-line bg-bg-1 text-ink-300 hover:border-copper-500/50",
              ].join(" ")}
            >
              {t(safeLocale, "Nimmt Kunden an", "Accepting clients", "Müşteri kabul ediyor")}
            </button>

            {/* Clear all filters — only show when any filter is active */}
            {(query || openToNetworking || acceptingClients) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setOpenToNetworking(false);
                  setAcceptingClients(false);
                }}
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-400 transition-colors hover:border-line-firm hover:text-ink"
              >
                {t(safeLocale, "Filter löschen", "Clear filters", "Filtreleri temizle")}
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-signal-err/30 bg-signal-err/5 px-4 py-3 text-sm text-signal-err">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)
            : items.length === 0
            ? <EmptyState locale={safeLocale} />
            : items.map((card) => (
                <DiscoverCardItem key={card.id} card={card} locale={safeLocale} />
              ))}
        </div>

        {/* Load more */}
        {!loading && nextCursor && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-1 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-copper-500 hover:text-copper-600 disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {t(safeLocale, "Laden …", "Loading …", "Yükleniyor …")}
                </>
              ) : (
                t(safeLocale, "Mehr laden", "Load more", "Daha fazla yükle")
              )}
            </button>
          </div>
        )}

        {/* Result count hint */}
        {!loading && items.length > 0 && (
          <p className="mt-4 text-center text-xs text-ink-400">
            {items.length}
            {" "}
            {t(safeLocale, "Einträge geladen", "entries loaded", "kayıt yüklendi")}
            {nextCursor ? " ·" + t(safeLocale, " mehr verfügbar", " more available", " daha fazla mevcut") : ""}
          </p>
        )}
      </div>
    </main>
  );
}
