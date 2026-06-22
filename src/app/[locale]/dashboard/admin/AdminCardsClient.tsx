"use client";

// =============================================================================
// AdminCardsClient — READ-ONLY operator table of ALL cards.
//
// Shows, per card: name, contact email, company, status, view count, lead
// count, createdAt, a link to the public card (/c/{slug}), an expandable detail
// panel that renders the FULL cardData the creator saved, and a link to the
// per-card leads detail route (dashboard/admin/{id}).
//
// Free-text search filters over name / email / company. Status filter narrows
// by order status. Admin-only — strings are inline English on purpose (the
// lead is editing src/content/* concurrently; this component must not import
// from there).
//
// Token gotcha: slash-opacity on ink/bg/line is a NO-OP — use explicit token
// steps (text-ink-300, bg-bg-2, border-line). Only copper/NN + signal-* take
// opacity.
// =============================================================================

import { Fragment, useMemo, useState } from "react";
import { LocaleLink } from "@/components/shared/LocaleLink";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AdminCardRow {
  id: string;
  slug: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  templateId: number;
  userId: string | null;
  createdAt: string; // ISO
  viewCount: number;
  leadCount: number;
  cardData: unknown; // raw JSON as stored
}

interface Props {
  rows: AdminCardRow[];
  locale: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Narrow `unknown` cardData to a plain record without throwing. */
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** Status pill colours — semantic signal tokens, sparingly. */
function statusClasses(status: string): string {
  const s = status.toUpperCase();
  if (s === "PUBLISHED") return "bg-signal-ok/15 text-signal-ok";
  if (s === "AWAITING_DESIGN") return "bg-signal-warn/15 text-signal-warn";
  if (s === "PENDING_PAYMENT" || s === "CANCELLED" || s === "REFUNDED")
    return "bg-signal-err/15 text-signal-err";
  return "bg-bg-3 text-ink-300";
}

function companyOf(row: AdminCardRow): string | null {
  return str(asRecord(row.cardData).company);
}

// ---------------------------------------------------------------------------
// Detail panel — renders the full cardData the creator saved
// ---------------------------------------------------------------------------
function CardDetail({ row }: { row: AdminCardRow }) {
  const cd = asRecord(row.cardData);

  // Scalar fields rendered as a labelled key/value grid.
  const scalarFields: Array<[string, string | null]> = [
    ["Name", str(cd.name)],
    ["Title", str(cd.title)],
    ["Position", str(cd.position)],
    ["Company", str(cd.company)],
    ["Email", str(cd.email)],
    ["Phone", str(cd.phone)],
    ["WhatsApp", str(cd.whatsapp)],
    ["Website", str(cd.website)],
    ["Address", str(cd.address)],
    ["Location", str(cd.location)],
    ["Tagline", str(cd.tagline)],
    ["Booking URL", str(cd.bookingUrl)],
    ["Brochure URL", str(cd.brochureUrl)],
    ["Video URL", str(cd.videoUrl)],
    ["Sector", str(cd.sectorKey)],
  ].filter((entry): entry is [string, string] => entry[1] !== null);

  const bio = str(cd.bio);

  // Socials map → list of [network, url].
  const socials = asRecord(cd.socials);
  const socialEntries = Object.entries(socials)
    .map(([k, v]) => [k, str(v)] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] !== null);

  // Services array (label/title + description).
  const services = Array.isArray(cd.services) ? cd.services : [];

  return (
    <div className="space-y-5 border-t border-line bg-bg-1 px-4 py-4 text-sm">
      {/* Scalar fields */}
      {scalarFields.length > 0 && (
        <div>
          <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-400">
            Profile fields
          </h4>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {scalarFields.map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <dt className="text-[11px] font-medium text-ink-400">{label}</dt>
                <dd className="break-words text-ink-100">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Bio (long text) */}
      {bio && (
        <div>
          <h4 className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-400">
            Bio
          </h4>
          <p className="whitespace-pre-wrap break-words text-ink-100">{bio}</p>
        </div>
      )}

      {/* Socials */}
      {socialEntries.length > 0 && (
        <div>
          <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-400">
            Socials
          </h4>
          <ul className="space-y-1">
            {socialEntries.map(([network, url]) => (
              <li key={network} className="flex flex-wrap gap-2">
                <span className="min-w-[80px] text-[11px] font-medium text-ink-400">
                  {network}
                </span>
                <a
                  href={url ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all text-copper-600 underline underline-offset-2 hover:text-copper-700"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Services */}
      {services.length > 0 && (
        <div>
          <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-400">
            Services ({services.length})
          </h4>
          <ul className="space-y-1.5">
            {services.map((svc, i) => {
              const s = asRecord(svc);
              const label = str(s.title) ?? str(s.label) ?? str(s.name) ?? "—";
              const desc = str(s.description) ?? str(s.body);
              return (
                <li key={i} className="rounded-lg border border-line-soft bg-bg-2 px-3 py-2">
                  <p className="font-medium text-ink-100">{label}</p>
                  {desc && <p className="mt-0.5 text-ink-300">{desc}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Raw JSON — the operator can see EVERYTHING the creator saved. */}
      <details className="rounded-lg border border-line-soft bg-bg-0">
        <summary className="cursor-pointer select-none px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-400">
          Raw cardData JSON
        </summary>
        <pre className="overflow-x-auto px-3 pb-3 text-[11px] leading-relaxed text-ink-200">
          {JSON.stringify(row.cardData, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function AdminCardsClient({ rows, locale }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Distinct statuses present in the data, for the filter dropdown.
  const statuses = useMemo(() => {
    const set = new Set(rows.map((r) => r.status));
    return ["ALL", ...Array.from(set).sort()];
  }, [rows]);

  // Free-text search over name / email / company + status filter.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        r.contactName,
        r.contactEmail,
        companyOf(r) ?? "",
        str(asRecord(r.cardData).name) ?? "",
        r.slug ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, query, statusFilter]);

  const toggle = (id: string) =>
    setExpandedId((cur) => (cur === id ? null : id));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-medium text-ink">All Cards</h1>
        <p className="mt-1 text-sm text-ink-400">
          Operator view · {rows.length} card{rows.length === 1 ? "" : "s"} (newest
          200). Read-only.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, company, slug…"
          aria-label="Search cards"
          className="field w-full sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="field w-full sm:w-auto"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <span className="text-xs text-ink-400 sm:ml-auto">
          {filtered.length} shown
        </span>
      </div>

      {/* Table (scrolls horizontally on small screens) */}
      <div
        role="region"
        aria-label="All cards table"
        tabIndex={0}
        className="overflow-x-auto rounded-2xl border border-line bg-bg-1"
      >
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                Name
              </th>
              <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                Email
              </th>
              <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                Company
              </th>
              <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-ink-400" scope="col">
                Views
              </th>
              <th className="px-4 py-3 text-right font-medium text-ink-400" scope="col">
                Leads
              </th>
              <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                Created
              </th>
              <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-ink-400">
                  No cards match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const expanded = expandedId === row.id;
                const company = companyOf(row);
                return (
                  <Fragment key={row.id}>
                    <tr className="border-b border-line-soft align-top">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggle(row.id)}
                          aria-expanded={expanded}
                          className="text-left font-medium text-ink hover:text-copper-700"
                        >
                          {row.contactName || "—"}
                        </button>
                        {row.slug && (
                          <span className="block font-mono text-[11px] text-ink-400">
                            /c/{row.slug}
                          </span>
                        )}
                      </td>
                      <td className="break-all px-4 py-3 text-ink-200">
                        {row.contactEmail || "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-200">{company ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClasses(
                            row.status,
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-200">
                        {row.viewCount}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-200">
                        {row.leadCount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-300">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggle(row.id)}
                            className="text-copper-600 hover:text-copper-700"
                          >
                            {expanded ? "Hide" : "Details"}
                          </button>
                          <LocaleLink
                            href={`/dashboard/admin/${row.id}`}
                            className="text-copper-600 hover:text-copper-700"
                          >
                            Leads ({row.leadCount})
                          </LocaleLink>
                          {row.slug && (
                            <a
                              href={`/c/${row.slug}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-copper-600 hover:text-copper-700"
                            >
                              View
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <CardDetail row={row} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[11px] text-ink-400">
        Locale: {locale} · Read-only operator tool · Card data is shown exactly as
        the creator saved it.
      </p>
    </div>
  );
}
