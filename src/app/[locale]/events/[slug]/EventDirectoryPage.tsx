"use client";

// =============================================================================
// EventDirectoryPage — client half of /events/[slug].
//
// Event header → "create your card" CTA (deep-links the order page with
// ?event=<slug>) → alphabetical attendee grid linking to each public card.
// Copy lives in t.card.eventDirectory (DE/EN/TR).
// =============================================================================

import * as React from "react";
import { CalendarDays, MapPin, Search, UserPlus } from "lucide-react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";

export interface DirectoryAttendee {
  slug: string;
  name: string;
  title: string | null;
  company: string | null;
  photoPath: string | null;
}

interface Props {
  event: {
    slug: string;
    name: string;
    city: string;
    country: string | null;
    venue: string | null;
    startAt: string;
    endAt: string;
    description: string | null;
  };
  attendees: DirectoryAttendee[];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveAsset(path: string): string {
  return path.startsWith("/") || path.startsWith("http") ? path : `/${path}`;
}

export function EventDirectoryPage({ event, attendees }: Props) {
  const { t, locale } = useLocale();
  const d = t.card.eventDirectory;

  // Client-side participant search — name, title or company, accent-relaxed
  // via locale-aware lowercasing. Only shown once the list is long enough
  // for scanning to hurt.
  const [query, setQuery] = React.useState("");
  const normalized = query.trim().toLocaleLowerCase(locale);
  const filtered = normalized
    ? attendees.filter((a) =>
        [a.name, a.title ?? "", a.company ?? ""]
          .join(" ")
          .toLocaleLowerCase(locale)
          .includes(normalized),
      )
    : attendees;

  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  const fmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dateLabel =
    start.toDateString() === end.toDateString()
      ? fmt.format(start)
      : `${fmt.format(start)} – ${fmt.format(end)}`;

  return (
    <main className="min-h-screen bg-bg-0 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* ---- header ---------------------------------------------------- */}
        <p className="text-eyebrow uppercase tracking-wider text-ink-300">
          {d.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">{event.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-200">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-copper" />
            {event.city}
            {event.venue ? ` · ${event.venue}` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} className="text-copper" />
            {dateLabel}
          </span>
        </div>
        {event.description && (
          <p className="mt-4 max-w-2xl text-body text-ink-200">
            {event.description}
          </p>
        )}

        {/* ---- create-your-card CTA --------------------------------------- */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-copper/30 bg-copper/8 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl text-ink">{d.ctaTitle}</p>
            <p className="mt-1 text-sm text-ink-200">{d.ctaBody}</p>
          </div>
          <Link
            href={`/card/new?event=${encodeURIComponent(event.slug)}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus size={15} />
            {d.ctaButton}
          </Link>
        </div>

        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg-2 px-4 py-2 text-sm text-ink-200">
          <span aria-hidden>📱</span>
          {t.card.mobileAppSoon}
        </p>

        {/* ---- attendee grid ---------------------------------------------- */}
        <h2 className="mt-10 font-display text-2xl text-ink">
          {d.participantsHeading}
          <span className="ml-2 text-base font-normal text-ink-300">
            {attendees.length}
          </span>
        </h2>
        <p className="mt-1 text-sm text-ink-300">{d.participantsHint}</p>

        {attendees.length > 5 && (
          <div className="relative mt-5">
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.searchPlaceholder}
              className="w-full rounded-full border border-line bg-bg-1 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-400 focus:border-copper focus:outline-none"
            />
          </div>
        )}

        {attendees.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-sm text-ink-300">
            {d.emptyState}
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-sm text-ink-300">
            {d.noResults}
          </p>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {filtered.map((a) => (
              <a
                key={a.slug}
                href={`/c/${a.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-line bg-bg-1 p-4 transition-colors hover:border-copper/50"
              >
                {a.photoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveAsset(a.photoPath)}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-copper/15 font-display text-sm text-copper-700">
                    {initials(a.name)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">
                    {a.name}
                  </span>
                  <span className="block truncate text-sm text-ink-300">
                    {[a.title, a.company].filter(Boolean).join(" · ") || "—"}
                  </span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
