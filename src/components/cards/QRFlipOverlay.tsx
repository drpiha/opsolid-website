"use client";

// =============================================================================
// QRFlipOverlay — Phase 8.
//
// A floating QR action on the public card page. Tapping it opens a Radix
// Dialog with the card's QR code (full size, ECC level H) and three share
// affordances: copy link, native Web Share (mobile), and download PNG.
//
// We render the QR via the existing /api/qr/[slug] endpoint — it respects
// the saved QR preset (rounded/dots/diamond/...) plus optional logo/photo
// center overlay, so the modal QR matches what's baked into the WhatsApp
// preview and Wallet pass.
// =============================================================================

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { QrCode, X, Copy, Check, Share2, Download } from "lucide-react";

export interface QRFlipLabels {
  triggerLabel: string;
  modalTitle: string;
  modalSubtitle: string;
  copyLabel: string;
  copiedLabel: string;
  shareLabel: string;
  downloadLabel: string;
  closeLabel: string;
}

interface Props {
  slug: string;
  /** Public card URL — what the QR encodes and what we copy/share. */
  publicUrl: string;
  /** Display name (for the share sheet title). */
  shareTitle: string;
  labels: QRFlipLabels;
  /** Brand accent — hairline + button accent. */
  accentHex?: string;
}

export function QRFlipOverlay({
  slug,
  publicUrl,
  shareTitle,
  labels,
  accentHex = "#C27940",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const qrUrl = `/api/qr/${encodeURIComponent(slug)}?format=png&size=720`;
  const qrDownloadUrl = `/api/qr/${encodeURIComponent(slug)}?format=png&size=1024`;

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard rejection is silent — copy ribbon would just not flip */
    }
  }, [publicUrl]);

  const onShare = React.useCallback(async () => {
    if (typeof navigator === "undefined" || !("share" in navigator)) {
      // Fallback to clipboard when Web Share isn't available (desktop browsers).
      await onCopy();
      return;
    }
    try {
      await navigator.share({ url: publicUrl, title: shareTitle });
    } catch {
      /* user cancelled — non-error */
    }
  }, [publicUrl, shareTitle, onCopy]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={labels.triggerLabel}
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_36px_-10px_rgba(0,0,0,0.45)] transition active:scale-95"
          style={{ background: accentHex }}
        >
          <QrCode size={26} strokeWidth={2.1} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-[101] mx-auto flex w-full max-w-md flex-col gap-5 rounded-t-3xl bg-bg-1 p-6 ring-1 ring-line outline-none sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Dialog.Title className="text-base font-semibold text-ink">
                {labels.modalTitle}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-ink-300">
                {labels.modalSubtitle}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={labels.closeLabel}
                className="rounded-full p-1.5 text-ink-300 hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </Dialog.Close>
          </header>

          <div
            className="mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center rounded-3xl bg-white p-4 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.4)]"
            style={{ boxShadow: `0 0 0 4px ${accentHex}1f inset` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={shareTitle}
              className="h-full w-full select-none"
              draggable={false}
            />
          </div>

          <p className="break-all rounded-2xl bg-bg-2 px-3 py-2 text-center text-[12px] text-ink-300">
            {publicUrl.replace(/^https?:\/\//, "")}
          </p>

          <div className="grid grid-cols-3 gap-2">
            <ActionPill onClick={onCopy} accent={accentHex}>
              {copied ? (
                <Check size={16} strokeWidth={2.2} />
              ) : (
                <Copy size={16} strokeWidth={2.2} />
              )}
              <span>{copied ? labels.copiedLabel : labels.copyLabel}</span>
            </ActionPill>
            <ActionPill onClick={onShare} accent={accentHex}>
              <Share2 size={16} strokeWidth={2.2} />
              <span>{labels.shareLabel}</span>
            </ActionPill>
            <ActionPill
              as="a"
              href={qrDownloadUrl}
              download={`opsolid-qr-${slug}.png`}
              accent={accentHex}
            >
              <Download size={16} strokeWidth={2.2} />
              <span>{labels.downloadLabel}</span>
            </ActionPill>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ActionPillProps {
  children: React.ReactNode;
  accent: string;
  onClick?: () => void;
  as?: "button" | "a";
  href?: string;
  download?: string;
}

function ActionPill({
  children,
  accent,
  onClick,
  as = "button",
  href,
  download,
}: ActionPillProps) {
  const className =
    "flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink transition active:scale-[0.98]";
  const style: React.CSSProperties = {
    borderColor: `${accent}33`,
    background: `${accent}0d`,
    color: accent,
  };

  if (as === "a") {
    return (
      <a href={href} download={download} className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}
