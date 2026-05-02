"use client";

// =============================================================================
// CardListClient — client shell for /dashboard/cards (B0.5)
//
// Renders:
//  - Top bar: title + "Create new card" CTA
//  - Responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
//  - Empty state with illustration + CTA
// =============================================================================

import { useLocale } from "@/context/LocaleContext";
import { CardListItem } from "@/components/dashboard/CardListItem";
import Link from "next/link";

export interface CardRow {
  id: string;
  slug: string | null;
  templateId: number;
  contactName: string;
  status: string;
  cardData: unknown;
  createdAt: string;
  _count: { views: number };
}

interface Props {
  cards: CardRow[];
  locale: string;
  userEmail: string;
}

export function CardListClient({ cards, locale }: Props) {
  const { t } = useLocale();
  const d = t.dashboard;

  const createHref = `/${locale}/onboarding`;

  return (
    <div>
      {/* Top bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {d.cards.title}
          </h1>
          {cards.length > 0 && (
            <p className="mt-1 text-sm text-ink-400">{d.cards.subtitle}</p>
          )}
        </div>

        <Link
          href={createHref}
          className="btn-primary inline-flex shrink-0 items-center gap-2 self-start sm:self-auto"
          aria-label={d.cards.createNewCta}
        >
          <PlusIcon />
          {d.cards.createNewCta}
        </Link>
      </div>

      {/* Card grid */}
      {cards.length > 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card) => (
            <li key={card.id}>
              <CardListItem card={card} locale={locale} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState locale={locale} t={d.cards} createHref={createHref} />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Empty state
// -----------------------------------------------------------------------------
function EmptyState({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: _locale,
  t,
  createHref,
}: {
  locale: string;
  t: { emptyTitle: string; emptyHint: string; emptyCta: string };
  createHref: string;
}) {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Copper card illustration */}
      <div
        aria-hidden
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-copper-500/30 bg-copper-500/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-8 w-8 text-copper-500"
          aria-hidden="true"
        >
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M2 10h20" />
          <path d="M6 15h4" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-ink">{t.emptyTitle}</h2>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-ink-400">{t.emptyHint}</p>

      <Link
        href={createHref}
        className="btn-primary inline-flex items-center gap-2"
        aria-label={t.emptyCta}
      >
        <PlusIcon />
        {t.emptyCta}
      </Link>
    </div>
  );
}

// Inline micro-icon — avoids a heroicons dependency just for this symbol.
function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
}
