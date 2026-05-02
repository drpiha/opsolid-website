"use client";

// =============================================================================
// CardListClient — interactive cards grid with delete + claim banner (B0.5/B0.6)
//
// Props:
//   cards        — user's owned cards (userId = user.id)
//   claimable    — unclaimed cards matching user email (userId = null)
//   locale       — current locale string
//   userEmail    — passed for contextual display
//
// CardRow is exported so CardListItem (src/components/dashboard/CardListItem.tsx)
// can import it for its prop type.
// =============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardListItem } from "@/components/dashboard/CardListItem";

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------
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

export interface ClaimableCard {
  id: string;
  slug: string | null;
  name: string;
  status: string;
  createdAt: string;
}

interface Props {
  cards: CardRow[];
  claimable: ClaimableCard[];
  locale: string;
  userEmail: string;
}

// ---------------------------------------------------------------------------
// Claim banner
// ---------------------------------------------------------------------------
function ClaimBanner({
  claimable,
  locale,
  onClaimed,
}: {
  claimable: ClaimableCard[];
  locale: string;
  onClaimed: (id: string) => void;
}) {
  const [claiming, setClaiming] = useState<Record<string, "idle" | "loading" | "done" | "error">>(
    Object.fromEntries(claimable.map((c) => [c.id, "idle"])),
  );

  const copy = {
    de: {
      bannerTitle: "Wir haben Karten unter Ihrer E-Mail-Adresse gefunden.",
      bannerHint: "Verbinden Sie diese mit Ihrem Konto, um sie hier zu verwalten.",
      claimCta: "Karte verbinden",
      claimingState: "Verbinden…",
      claimedState: "Verbunden",
      errorState: "Fehler — erneut versuchen",
    },
    en: {
      bannerTitle: "We found cards under your email address.",
      bannerHint: "Connect them to your account to manage them here.",
      claimCta: "Claim this card",
      claimingState: "Connecting…",
      claimedState: "Connected",
      errorState: "Error — try again",
    },
    tr: {
      bannerTitle: "E-posta adresiniz altında kartlar bulduk.",
      bannerHint: "Burada yönetmek için bunları hesabınıza bağlayın.",
      claimCta: "Bu kartı sahiplen",
      claimingState: "Bağlanıyor…",
      claimedState: "Bağlandı",
      errorState: "Hata — tekrar deneyin",
    },
  };

  const t = copy[locale as keyof typeof copy] ?? copy.en;

  const handleClaim = async (cardId: string) => {
    setClaiming((prev) => ({ ...prev, [cardId]: "loading" }));
    try {
      const res = await fetch(`/api/account/cards/${cardId}/claim`, {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        setClaiming((prev) => ({ ...prev, [cardId]: "done" }));
        onClaimed(cardId);
      } else {
        setClaiming((prev) => ({ ...prev, [cardId]: "error" }));
      }
    } catch {
      setClaiming((prev) => ({ ...prev, [cardId]: "error" }));
    }
  };

  // Only show banner if at least one card hasn't been claimed yet.
  const pendingCards = claimable.filter((c) => claiming[c.id] !== "done");
  if (pendingCards.length === 0) return null;

  return (
    <section
      role="region"
      aria-label={t.bannerTitle}
      className="mb-8 rounded-2xl border border-copper-500/30 bg-copper-50/60 p-5"
    >
      <div className="mb-3">
        <p className="text-sm font-semibold text-copper-700">{t.bannerTitle}</p>
        <p className="mt-0.5 text-xs text-copper-600/80">{t.bannerHint}</p>
      </div>

      <ul className="space-y-2">
        {pendingCards.map((card) => {
          const state = claiming[card.id];
          return (
            <li
              key={card.id}
              className="flex items-center justify-between rounded-xl border border-copper-500/20 bg-white/70 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{card.name}</p>
                {card.slug && (
                  <p className="font-mono text-[11px] text-ink-400">/c/{card.slug}</p>
                )}
              </div>
              <button
                type="button"
                disabled={state === "loading" || state === "done"}
                onClick={() => handleClaim(card.id)}
                className={[
                  "min-w-[110px] rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                  state === "done"
                    ? "bg-signal-ok/20 text-signal-ok cursor-default"
                    : state === "error"
                    ? "bg-signal-err/10 text-signal-err hover:bg-signal-err/20"
                    : state === "loading"
                    ? "bg-copper-100 text-copper-500 cursor-wait"
                    : "bg-copper-500 text-white hover:bg-copper-600",
                ].join(" ")}
              >
                {state === "done"
                  ? t.claimedState
                  : state === "loading"
                  ? t.claimingState
                  : state === "error"
                  ? t.errorState
                  : t.claimCta}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function CardListClient({ cards, claimable, locale, userEmail: _ }: Props) {
  const router = useRouter();
  // visibleCards is kept in sync with server state via router.refresh() after
  // delete actions. The CardListItem component calls router.refresh() itself.
  const [visibleClaimable, setVisibleClaimable] = useState(claimable);

  const handleClaimed = (id: string) => {
    // Remove from claimable list; router.refresh() triggers server re-fetch
    // so the newly claimed card appears in the owned grid.
    setVisibleClaimable((prev) => prev.filter((c) => c.id !== id));
    setTimeout(() => router.refresh(), 800);
  };

  const copy = {
    de: {
      title: "Meine Karten",
      subtitle: "Verwalten und teilen Sie Ihre digitalen Visitenkarten.",
      empty: "Noch keine Karten.",
    },
    en: {
      title: "My Cards",
      subtitle: "Manage and share your digital business cards.",
      empty: "No cards yet.",
    },
    tr: {
      title: "Kartlarım",
      subtitle: "Dijital kartvizitlerinizi yönetin ve paylaşın.",
      empty: "Henüz kart yok.",
    },
  };
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-ink">{t.title}</h1>
        <p className="mt-1 text-sm text-ink-400">{t.subtitle}</p>
      </div>

      {/* B0.6 Claim banner — rendered above the grid */}
      {visibleClaimable.length > 0 && (
        <ClaimBanner
          claimable={visibleClaimable}
          locale={locale}
          onClaimed={handleClaimed}
        />
      )}

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-line-soft bg-bg-1 px-6 py-16 text-center">
          <p className="text-sm text-ink-400">{t.empty}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardListItem
              key={card.id}
              card={card}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
