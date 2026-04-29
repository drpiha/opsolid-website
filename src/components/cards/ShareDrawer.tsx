"use client";

// =============================================================================
// ShareDrawer — Phase 5.
//
// Bottom sheet on mobile, centered modal on desktop. Opens with a CSS
// slide-up transition (no framer-motion). Uses Radix Dialog for accessible
// focus-trapping and overlay management (already a project dependency via
// QRFlipOverlay).
//
// Slots (in render order):
//   1. QR code image (from /api/qr/{slug}?format=png)
//   2. QR download link
//   3. Copy link with 2s ✓ feedback
//   4. WhatsApp share
//   5. vCard download
//   6. E-mail signature snippet
// =============================================================================

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Copy,
  CheckCheck,
  Download,
  Share2,
  ExternalLink,
} from "lucide-react";

export interface ShareDrawerProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}

const SITE = "https://opsolid.de";

export function ShareDrawer({ slug, open, onClose }: ShareDrawerProps) {
  const cardUrl = `${SITE}/c/${slug}`;
  const qrPng = `/api/qr/${encodeURIComponent(slug)}?format=png`;
  const emailSignatureHtml = `<a href="${cardUrl}">Digital Kartvizit</a>`;

  const [linkCopied, setLinkCopied] = React.useState(false);
  const [sigCopied, setSigCopied] = React.useState(false);

  const copyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard rejection — silent */
    }
  }, [cardUrl]);

  const copySig = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(emailSignatureHtml);
      setSigCopied(true);
      setTimeout(() => setSigCopied(false), 2000);
    } catch {
      /* clipboard rejection — silent */
    }
  }, [emailSignatureHtml]);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

        {/* Sheet — bottom sheet on mobile, centered card on md+ */}
        <Dialog.Content
          className={[
            // Positioning
            "fixed bottom-0 left-0 right-0 z-50",
            "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
            // Size
            "w-full md:max-w-sm",
            // Surface
            "bg-bg-0 rounded-t-3xl md:rounded-2xl",
            // Spacing
            "p-6",
            // Outline suppression
            "outline-none",
            // Entry animation
            "data-[state=open]:animate-slide-up md:data-[state=open]:animate-modal-in",
            "data-[state=closed]:animate-fade-out",
          ].join(" ")}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-ink">
              Kartı Paylaş
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Kapat"
                className="rounded-full p-1.5 text-ink-300 transition-colors hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </Dialog.Close>
          </div>

          {/* 1. QR Code */}
          <div className="mb-4 flex justify-center">
            <div className="rounded-xl bg-white p-3 ring-1 ring-line-soft shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrPng}
                alt="QR"
                width={240}
                height={240}
                className="mx-auto rounded-xl"
              />
            </div>
          </div>

          {/* Actions grid */}
          <div className="space-y-2">
            {/* 2. QR download */}
            <a
              href={qrPng}
              download={`qr-${slug}.png`}
              className={rowBase}
            >
              <Download size={16} className="shrink-0 text-ink-300" />
              <span className="flex-1 text-sm font-medium text-ink">QR İndir</span>
              <ExternalLink size={14} className="shrink-0 text-ink-400" />
            </a>

            {/* 3. Copy link */}
            <button
              type="button"
              onClick={copyLink}
              className={rowBase}
            >
              {linkCopied ? (
                <CheckCheck size={16} className="shrink-0 text-green-600" />
              ) : (
                <Copy size={16} className="shrink-0 text-ink-300" />
              )}
              <span className="flex-1 text-left text-sm font-medium text-ink">
                {linkCopied ? "Kopyalandı!" : "Linki Kopyala"}
              </span>
              <span className="truncate text-xs font-mono text-ink-400 max-w-[120px]">
                opsolid.de/c/{slug}
              </span>
            </button>

            {/* 4. WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(cardUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={rowBase}
            >
              <Share2 size={16} className="shrink-0 text-green-600" />
              <span className="flex-1 text-sm font-medium text-ink">
                WhatsApp&apos;ta Paylaş
              </span>
              <ExternalLink size={14} className="shrink-0 text-ink-400" />
            </a>

            {/* 5. vCard download */}
            <a
              href={`/api/cards/${slug}/vcard`}
              download
              className={rowBase}
            >
              <Download size={16} className="shrink-0 text-copper-500" />
              <span className="flex-1 text-sm font-medium text-ink">
                Kontağı Kaydet
              </span>
              <span className="text-[11px] font-mono text-ink-400">.vcf</span>
            </a>

            {/* 6. E-mail signature */}
            <div className="rounded-lg border border-line-soft bg-bg-2 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-ink-300 uppercase tracking-wide">
                  E-posta İmzası
                </span>
                <button
                  type="button"
                  onClick={copySig}
                  className="inline-flex items-center gap-1 rounded-md border border-line-soft bg-bg-1 px-2.5 py-1 text-xs font-medium text-ink-300 transition-colors hover:border-copper-500/40 hover:text-copper-500"
                >
                  {sigCopied ? (
                    <CheckCheck size={11} className="text-green-600" />
                  ) : (
                    <Copy size={11} />
                  )}
                  {sigCopied ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
              <code className="block break-all rounded bg-bg-3 px-2 py-1.5 text-[11px] font-mono text-ink-300 leading-relaxed">
                {emailSignatureHtml}
              </code>
            </div>
          </div>

          {/* Primary CTA — open card in new tab */}
          <a
            href={cardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-copper-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-copper-600"
          >
            Kartı Aç
            <ExternalLink size={14} strokeWidth={2.2} />
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Shared row style for action items
const rowBase =
  "flex w-full items-center gap-3 rounded-lg border border-line-soft bg-bg-1 px-3 py-2.5 transition-colors hover:bg-bg-2 hover:border-line active:scale-[0.99]";
