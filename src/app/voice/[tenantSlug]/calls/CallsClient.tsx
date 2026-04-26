"use client";

/**
 * CallsClient — wraps CallLogTable with a filter bar (status/outcome/search)
 * and pagination footer. Filter changes navigate via Next router so URL
 * params stay the source of truth.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import CallLogTable, {
  type CallLogRow,
} from "@/components/voice/dashboard/CallLogTable";
import PageHeader from "@/components/voice/dashboard/PageHeader";

interface CallsClientProps {
  tenantSlug: string;
  token: string;
  calls: CallLogRow[];
  total: number;
  page: number;
  pageSize: number;
  filters: { status: string; outcome: string; q: string };
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Alle" },
  { value: "ended", label: "Beendet" },
  { value: "in_progress", label: "Laufend" },
  { value: "failed", label: "Fehlgeschlagen" },
  { value: "busy", label: "Besetzt" },
  { value: "no_answer", label: "Keine Antwort" },
];

const OUTCOME_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Alle Ergebnisse" },
  { value: "appointment_booked", label: "Termin gebucht" },
  { value: "order_placed", label: "Bestellung" },
  { value: "callback_requested", label: "Rückruf" },
  { value: "info_provided", label: "Info gegeben" },
  { value: "transferred", label: "Weitergeleitet" },
  { value: "no_action", label: "Keine Aktion" },
  { value: "error", label: "Fehler" },
];

export default function CallsClient({
  tenantSlug,
  token,
  calls,
  total,
  page,
  pageSize,
  filters,
}: CallsClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(filters.q);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const tokenQ = `token=${encodeURIComponent(token)}`;

  const buildHref = (overrides: Partial<{
    page: number;
    status: string;
    outcome: string;
    q: string;
  }>) => {
    const next = new URLSearchParams(params?.toString() ?? "");
    next.set("token", token);
    if (overrides.page !== undefined) next.set("page", String(overrides.page));
    if (overrides.status !== undefined) {
      if (overrides.status) next.set("status", overrides.status);
      else next.delete("status");
    }
    if (overrides.outcome !== undefined) {
      if (overrides.outcome) next.set("outcome", overrides.outcome);
      else next.delete("outcome");
    }
    if (overrides.q !== undefined) {
      if (overrides.q) next.set("q", overrides.q);
      else next.delete("q");
    }
    if (overrides.status !== undefined || overrides.outcome !== undefined || overrides.q !== undefined) {
      next.delete("page");
    }
    return `/voice/${tenantSlug}/calls?${next.toString()}`;
  };

  const navigate = (overrides: Partial<{
    page: number;
    status: string;
    outcome: string;
    q: string;
  }>) => router.push(buildHref(overrides));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ q: search.trim() });
  };

  const activeFilterCount = useMemo(
    () =>
      [filters.status, filters.outcome, filters.q].filter((v) => v && v.length)
        .length,
    [filters],
  );

  return (
    <>
      <PageHeader
        eyebrow={`${total.toLocaleString("de-DE")} Anrufe`}
        title="Anrufprotokoll"
        description="Vollständige Historie. Klicken Sie auf eine Zeile für Transkript, Zusammenfassung und Ereignisse."
      />

      {/* ---------- Filter bar ---------- */}
      <section className="panel mb-6 flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
        <form onSubmit={onSubmit} className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field h-10 w-full pl-9 pr-9 text-[13px]"
            placeholder="Nach Nummer oder Name suchen…"
            aria-label="Suchen"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                navigate({ q: "" });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-pill p-1 text-ink-400 transition-colors hover:bg-bg-2 hover:text-ink"
              aria-label="Suche zurücksetzen"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </form>

        <select
          value={filters.status}
          onChange={(e) => navigate({ status: e.target.value })}
          className="field h-10 py-0 text-[12px] md:w-[160px]"
          aria-label="Status filtern"
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.outcome}
          onChange={(e) => navigate({ outcome: e.target.value })}
          className="field h-10 py-0 text-[12px] md:w-[200px]"
          aria-label="Ergebnis filtern"
        >
          {OUTCOME_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              router.push(`/voice/${tenantSlug}/calls?${tokenQ}`);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-ink-400 hover:text-ink"
          >
            <X className="h-3 w-3" aria-hidden />
            Filter zurücksetzen ({activeFilterCount})
          </button>
        )}
      </section>

      <CallLogTable
        calls={calls}
        tenantSlug={tenantSlug}
        token={token}
        emptyTitle={
          activeFilterCount > 0
            ? "Keine Treffer für Ihre Filter"
            : "Noch keine Anrufe"
        }
      />

      {/* ---------- Pagination ---------- */}
      {totalPages > 1 && (
        <nav
          className="mt-5 flex items-center justify-between"
          aria-label="Seitennavigation"
        >
          <span className="meta text-[10px] text-ink-400">
            Seite{" "}
            <span className="font-mono normal-case tracking-normal">
              {page}
            </span>{" "}
            / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-3 py-1.5 text-[12px] text-ink-300 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              Zurück
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: Math.min(totalPages, page + 1) })}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-3 py-1.5 text-[12px] text-ink-300 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Weiter
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
