"use client";

// =============================================================================
// CardListItem — card tile in the /dashboard/cards grid (B0.5)
//
// Shows: thumbnail, name, status badge, view count, action menu
// (Edit / Share / Delete).
//
// Delete: POST /api/cards/[id]/delete
//   TODO (B0.6): endpoint does not exist yet — call is gated with a TODO note.
// =============================================================================

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/context/LocaleContext";
import type { CardRow } from "@/app/[locale]/dashboard/cards/CardListClient";

interface Props {
  card: CardRow;
  locale: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveCardName(card: CardRow): string {
  // cardData is JSON — parse the `name` field defensively.
  if (card.cardData && typeof card.cardData === "object") {
    const data = card.cardData as Record<string, unknown>;
    if (typeof data.name === "string" && data.name.trim()) {
      return data.name.trim();
    }
  }
  return card.contactName;
}

function statusVariant(
  status: string
): "success" | "default" | "accent" {
  if (status === "PUBLISHED") return "success";
  if (status === "CANCELLED" || status === "REFUNDED") return "accent";
  return "default";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CardListItem({ card, locale }: Props) {
  const { t } = useLocale();
  const d = t.dashboard;
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const displayName = resolveCardName(card);
  const publicUrl = card.slug ? `${window?.location?.origin ?? ""}/c/${card.slug}` : null;
  const editHref = `/${locale}/card/edit/${card.id}`;
  const isDeleted =
    card.status === "CANCELLED" || card.status === "REFUNDED";

  // Close action menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Trap focus inside delete modal
  useEffect(() => {
    if (!deleteConfirmOpen) return;
    const el = deleteModalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteConfirmOpen(false);
    };
    document.addEventListener("keydown", trap);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", trap);
      document.removeEventListener("keydown", escape);
    };
  }, [deleteConfirmOpen]);

  const handleShare = async () => {
    setMenuOpen(false);
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      // Simple inline toast — project has no global toast provider yet
      const toast = document.createElement("div");
      toast.textContent = "URL copied";
      toast.style.cssText =
        "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:8px 18px;border-radius:9999px;font-size:13px;z-index:9999;pointer-events:none";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2200);
    } catch {
      /* clipboard unavailable — fail silently */
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/account/cards/${card.id}/delete`, {
        method: "POST",
        credentials: "same-origin",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        alert(body.error ?? `Delete failed (HTTP ${res.status})`);
        return;
      }
      setDeleteConfirmOpen(false);
      router.refresh();
    } catch {
      alert("Delete failed — endpoint not yet available.");
    } finally {
      setDeleting(false);
    }
  };

  const statusLabel =
    card.status === "PUBLISHED"
      ? d.cardItem.statusPublished
      : card.status === "CANCELLED" || card.status === "REFUNDED"
      ? d.cardItem.statusDeleted
      : d.cardItem.statusDraft;

  return (
    <>
      {/* Card tile */}
      <div
        className={[
          "panel group relative flex flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-lifted",
          isDeleted ? "opacity-60" : "",
        ].join(" ")}
      >
        {/* Thumbnail */}
        <div className="relative h-36 w-full overflow-hidden bg-bg-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/templates/card-${card.templateId}.png`}
            alt={`Template ${card.templateId} preview`}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fall back to copper placeholder on 404
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Copper placeholder shown behind — visible when image fails */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="h-10 w-10 text-copper-500/40"
            >
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20" />
              <path d="M6 15h4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <p
              className={[
                "line-clamp-1 flex-1 text-sm font-semibold text-ink",
                isDeleted ? "line-through text-ink-400" : "",
              ].join(" ")}
            >
              {displayName}
            </p>

            {/* Action menu trigger */}
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Card actions"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="rounded-lg p-1 text-ink-400 transition-colors hover:bg-bg-3 hover:text-ink"
              >
                <DotsIcon />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-8 z-10 w-44 rounded-xl border border-line bg-bg-1 py-1 shadow-lifted"
                >
                  {/* Edit */}
                  <Link
                    href={editHref}
                    role="menuitem"
                    className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink transition-colors hover:bg-bg-2"
                    onClick={() => setMenuOpen(false)}
                    aria-label={`${d.cardItem.editCta} ${displayName}`}
                  >
                    <PencilIcon />
                    {d.cardItem.editCta}
                  </Link>

                  {/* Share */}
                  {publicUrl && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleShare}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-ink transition-colors hover:bg-bg-2"
                      aria-label={`${d.cardItem.shareCta} ${displayName}`}
                    >
                      <ShareIcon />
                      {d.cardItem.shareCta}
                    </button>
                  )}

                  {/* Delete */}
                  {!isDeleted && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        setDeleteConfirmOpen(true);
                      }}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-signal-err transition-colors hover:bg-bg-2"
                      aria-label={`${d.cardItem.deleteCta} ${displayName}`}
                    >
                      <TrashIcon />
                      {d.cardItem.deleteCta}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer row: status + views */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant={statusVariant(card.status)}>{statusLabel}</Badge>
            <span className="text-xs text-ink-500">
              {d.cardItem.viewCountLabel}: {card._count.views}
            </span>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmOpen(false);
          }}
        >
          <div
            ref={deleteModalRef}
            className="panel w-full max-w-sm p-6"
          >
            <h2
              id="delete-modal-title"
              className="text-base font-semibold text-ink"
            >
              {d.cardItem.deleteConfirm}
            </h2>
            <p className="mt-2 text-sm text-ink-400">
              &ldquo;{displayName}&rdquo;
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-full bg-signal-err px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : d.cardItem.deleteCta}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Micro-icons (inline, no extra dep)
// ---------------------------------------------------------------------------

function DotsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-ink-400"
      aria-hidden="true"
    >
      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-ink-400"
      aria-hidden="true"
    >
      <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .793l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
