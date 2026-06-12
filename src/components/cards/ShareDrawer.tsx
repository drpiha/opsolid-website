"use client";

// =============================================================================
// ShareDrawer — Phase 5.
//
// Bottom sheet on mobile, centered modal on desktop. Uses Radix Dialog for
// accessible focus-trapping. Localized via t.card.share.
//
// `context="owner"` swaps the vCard row label from "Save contact" to
// "My vCard — forward" since on the edit page the owner is the one being
// shared, not the one being saved.
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
  Loader2,
  ImageDown,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export interface ShareDrawerProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  /** "owner" on the edit page, "visitor" on the public card page. */
  context?: "owner" | "visitor";
}

const SITE = "https://opsolid.de";

export function ShareDrawer({ slug, open, onClose, context = "visitor" }: ShareDrawerProps) {
  const { t } = useLocale();
  const s = t.card.share;
  const cardUrl = `${SITE}/c/${slug}`;
  const qrPng = `/api/qr/${encodeURIComponent(slug)}?format=png`;
  const storyPng = `/c/${encodeURIComponent(slug)}/story.png`;
  const emailSignatureHtml = `<a href="${cardUrl}">${cardUrl}</a>`;

  const [linkCopied, setLinkCopied] = React.useState(false);
  const [sigCopied, setSigCopied] = React.useState(false);
  const [waBusy, setWaBusy] = React.useState(false);

  // WhatsApp share — image-first. Instead of handing WhatsApp a bare URL
  // (preview at the platform's mercy), fetch the 9:16 story card and share
  // it as a FILE next to the link via the Web Share API. Recipients see a
  // full-screen business card with photo + company, not a grey link row.
  // Falls back to the classic wa.me text link when file-sharing isn't
  // available (desktop browsers, older WebViews) or anything fails.
  const shareWhatsApp = React.useCallback(async () => {
    const fallback = () =>
      window.open(
        `https://wa.me/?text=${encodeURIComponent(cardUrl)}`,
        "_blank",
        "noopener,noreferrer",
      );
    setWaBusy(true);
    try {
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (typeof nav.share !== "function" || typeof nav.canShare !== "function") {
        fallback();
        return;
      }
      const res = await fetch(storyPng);
      if (!res.ok) {
        fallback();
        return;
      }
      const blob = await res.blob();
      const file = new File([blob], `card-${slug}.png`, { type: "image/png" });
      if (!nav.canShare({ files: [file] })) {
        fallback();
        return;
      }
      await nav.share({ files: [file], text: cardUrl });
    } catch (err) {
      // AbortError = user closed the share sheet — not a failure.
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        fallback();
      }
    } finally {
      setWaBusy(false);
    }
  }, [cardUrl, slug, storyPng]);

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

  const isOwner = context === "owner";

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

        <Dialog.Content
          className={[
            "fixed bottom-0 left-0 right-0 z-50",
            "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
            "w-full md:max-w-sm",
            "max-h-[85vh] overflow-y-auto overscroll-contain",
            "bg-bg-0 rounded-t-3xl md:rounded-2xl",
            "p-5 pb-[max(20px,env(safe-area-inset-bottom))]",
            "outline-none",
            "data-[state=open]:animate-slide-up md:data-[state=open]:animate-modal-in",
            "data-[state=closed]:animate-fade-out",
          ].join(" ")}
          aria-describedby={undefined}
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-ink">
              {s.title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={s.close}
                className="rounded-full p-1.5 text-ink-300 transition-colors hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mb-4 flex justify-center">
            <div className="rounded-xl bg-white p-3 ring-1 ring-line-soft shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrPng}
                alt="QR"
                width={200}
                height={200}
                className="mx-auto rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <a href={qrPng} download={`qr-${slug}.png`} className={rowBase}>
              <Download size={16} className="shrink-0 text-ink-300" />
              <span className="flex-1 text-sm font-medium text-ink">{s.qrDownload}</span>
              <ExternalLink size={14} className="shrink-0 text-ink-400" />
            </a>

            <button type="button" onClick={copyLink} className={rowBase}>
              {linkCopied ? (
                <CheckCheck size={16} className="shrink-0 text-green-600" />
              ) : (
                <Copy size={16} className="shrink-0 text-ink-300" />
              )}
              <span className="flex-1 text-left text-sm font-medium text-ink">
                {linkCopied ? s.copied : s.copyLink}
              </span>
              <span className="truncate text-xs font-mono text-ink-400 max-w-[120px]">
                /c/{slug}
              </span>
            </button>

            <button
              type="button"
              onClick={shareWhatsApp}
              disabled={waBusy}
              className={rowBase + " disabled:opacity-60"}
            >
              {waBusy ? (
                <Loader2 size={16} className="shrink-0 animate-spin text-green-600" />
              ) : (
                <Share2 size={16} className="shrink-0 text-green-600" />
              )}
              <span className="flex-1 min-w-0 text-left">
                <span className="block truncate text-sm font-medium text-ink">
                  {s.whatsapp}
                </span>
                <span className="block truncate text-[11px] text-ink-400">
                  {s.whatsappHint}
                </span>
              </span>
              <ExternalLink size={14} className="shrink-0 text-ink-400" />
            </button>

            <a href={storyPng} download={`card-${slug}.png`} className={rowBase}>
              <ImageDown size={16} className="shrink-0 text-ink-300" />
              <span className="flex-1 min-w-0">
                <span className="block truncate text-sm font-medium text-ink">
                  {s.storyDownload}
                </span>
                <span className="block truncate text-[11px] text-ink-400">
                  {s.storyHint}
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-mono text-ink-400">9:16</span>
            </a>

            <a href={`/api/cards/${slug}/vcard`} download className={rowBase}>
              <Download size={16} className="shrink-0 text-copper-500" />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-ink truncate">
                  {isOwner ? s.vcardOwner : s.vcardVisitor}
                </span>
                {isOwner && (
                  <span className="block text-[11px] text-ink-400 truncate">
                    {s.vcardOwnerHint}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-ink-400 shrink-0">.vcf</span>
            </a>

            <div className="rounded-lg border border-line-soft bg-bg-2 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-ink-300 uppercase tracking-wide">
                  {s.emailSignature}
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
                  {sigCopied ? s.copied : s.copy}
                </button>
              </div>
              <code className="block break-all rounded bg-bg-3 px-2 py-1.5 text-[11px] font-mono text-ink-300 leading-relaxed">
                {emailSignatureHtml}
              </code>
            </div>
          </div>

          <a
            href={cardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-copper-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-copper-600"
          >
            {s.openCard}
            <ExternalLink size={14} strokeWidth={2.2} />
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const rowBase =
  "flex w-full items-center gap-3 rounded-lg border border-line-soft bg-bg-1 px-3 py-2.5 transition-colors hover:bg-bg-2 hover:border-line active:scale-[0.99]";
