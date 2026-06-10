"use client";

// Phase 7.9 — interactive photo position + zoom editor.
//
// The customer drags the image (pan) and uses a slider (zoom) to dial in the
// crop within the template's photo frame. We store the result as percentages
// so it renders identically across whichever template they pick later.
//
// The underlying CSS we drive is:
//   img.tpl-photo {
//     object-fit: cover;
//     object-position: var(--photo-x, 50%) var(--photo-y, 50%);
//     transform: scale(var(--photo-scale, 1));
//   }
// Templates only need to add the className for the live preview to react.

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn, ZoomOut, RotateCcw, Check } from "lucide-react";
import type { ImagePosition } from "@/lib/validation";

const DEFAULT_POSITION: ImagePosition = { x: 50, y: 50, scale: 1 };

export type PhotoEditorKind = "photo" | "logo";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: PhotoEditorKind;
  imageUrl: string;
  initialPosition?: ImagePosition;
  onSave: (position: ImagePosition) => void;
  // Used to localise headings and CTAs in any locale the page is in.
  labels: {
    title: string;
    subtitle: string;
    zoom: string;
    reset: string;
    save: string;
    cancel: string;
    hint: string;
    fitCover?: string;
    fitContain?: string;
  };
}

export function PhotoEditor({
  open,
  onOpenChange,
  kind,
  imageUrl,
  initialPosition,
  onSave,
  labels,
}: Props) {
  const [position, setPosition] = useState<ImagePosition>(
    initialPosition ?? DEFAULT_POSITION
  );
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null
  );
  const pointerDownTimeRef = useRef<number>(0);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Re-seed when the modal opens so it always reflects the current saved value.
  useEffect(() => {
    if (open) {
      setPosition(initialPosition ?? DEFAULT_POSITION);
    }
  }, [open, initialPosition]);

  // Mouse-wheel zoom — natural on desktop, ignored on touch (pinch-to-zoom
  // would conflict with the pan gesture).
  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setPosition((p) => ({
      ...p,
      scale: Math.min(4, Math.max(0.5, p.scale + delta)),
    }));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      pointerDownTimeRef.current = Date.now();
      draggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        px: position.x,
        py: position.y,
      };
      // Capture so move/up fire even if pointer leaves the element (drag over edges).
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    },
    [position]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !dragStartRef.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // Convert pixel drag to a percentage shift, scaled inversely to the zoom
    // factor — at scale 2× a 100px drag should move the focal point half as
    // far in source-image space, otherwise pans feel jumpy and the user can
    // never settle on the area they want. Sign inverted so dragging right
    // pushes the image right (object-position % moves the focal point left).
    setPosition((p) => {
      const dxPct = (-dx / (rect.width * p.scale)) * 100;
      const dyPct = (-dy / (rect.height * p.scale)) * 100;
      return {
        ...p,
        x: Math.min(100, Math.max(0, dragStartRef.current!.px + dxPct)),
        y: Math.min(100, Math.max(0, dragStartRef.current!.py + dyPct)),
      };
    });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // H1 — release capture so subsequent events aren't routed here.
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);

      const start = dragStartRef.current;
      const tapDuration = Date.now() - pointerDownTimeRef.current;
      // H2 — timestamp + distance threshold to distinguish tap vs drag.
      const distance = start
        ? Math.sqrt(
            Math.pow(e.clientX - start.x, 2) + Math.pow(e.clientY - start.y, 2)
          )
        : Infinity;
      const wasDrag = distance > 4;

      // H3 — open-state guard: frameRef is non-null only while the dialog is mounted.
      const isTap = !wasDrag && frameRef.current != null && start != null;

      const breadcrumbData = {
        pointerType: e.pointerType,           // "touch" | "mouse" | "pen"
        tapDuration,
        distance: Math.round(distance),
        wasDrag,
        hypothesis: "H1+H2+H3",               // all three guards are active
        kind,
      };

      if (isTap) {
        const rect = frameRef.current!.getBoundingClientRect();
        const tapX = ((e.clientX - rect.left) / rect.width) * 100;
        const tapY = ((e.clientY - rect.top) / rect.height) * 100;
        setPosition((p) => ({
          ...p,
          x: Math.min(100, Math.max(0, tapX)),
          y: Math.min(100, Math.max(0, tapY)),
        }));

        Sentry.addBreadcrumb({
          category: "ui.tap-to-focus",
          message: "applied",
          level: "info",
          data: breadcrumbData,
        });

        if (process.env.NODE_ENV !== "production") {
          console.debug("[tap-to-focus] applied", breadcrumbData);
        }
      } else {
        Sentry.addBreadcrumb({
          category: "ui.tap-to-focus",
          message: "aborted",
          level: "info",
          data: breadcrumbData,
        });

        if (process.env.NODE_ENV !== "production") {
          console.debug("[tap-to-focus] aborted", breadcrumbData);
        }
      }

      draggingRef.current = false;
      dragStartRef.current = null;
    },
    [kind]
  );

  const handleScale = (next: number) => {
    setPosition((p) => ({ ...p, scale: Math.min(4, Math.max(0.5, next)) }));
  };

  const reset = () => setPosition(DEFAULT_POSITION);

  const save = () => {
    onSave(position);
    onOpenChange(false);
  };

  const isLogo = kind === "logo";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-neutral-950/70 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        {/* max-h + scroll: on short phone viewports (landscape, small devices)
            the editor body must scroll — otherwise the action buttons fall
            below the fold and the modal can't be confirmed. */}
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] max-h-[92dvh] w-[min(94vw,540px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border border-ink/10 bg-bg-0 shadow-[0_30px_80px_-20px_rgba(20,18,15,0.5)]">
          <div className="flex items-start justify-between border-b border-ink/10 px-6 py-5">
            <div>
              <Dialog.Title className="font-serif text-heading-sm text-ink">
                {labels.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-ink/55">
                {labels.subtitle}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full border border-ink/15 bg-white p-2 text-ink/60 transition-colors hover:border-ink/40 hover:text-ink"
                aria-label={labels.cancel}
              >
                <X size={14} />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-6 py-5">
            {/* Image frame — drag to pan */}
            <div
              ref={frameRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
              className={[
                "relative mx-auto cursor-grab touch-none select-none overflow-hidden border border-ink/15 bg-neutral-100 active:cursor-grabbing",
                isLogo
                  ? "aspect-square w-44 rounded-2xl"
                  : "aspect-[4/5] w-full max-w-[260px] rounded-3xl",
              ].join(" ")}
            >
              {imageUrl ? (
                // We use a plain <img> here (not next/image) because the source
                // is a transient data:/blob: URL or a server upload path that
                // next/image would not be able to optimise anyway.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt=""
                  draggable={false}
                  className="pointer-events-none h-full w-full"
                  style={{
                    objectFit: position.fit ?? "cover",
                    objectPosition: `${position.x}% ${position.y}%`,
                    transform: `scale(${position.scale})`,
                    transformOrigin: "center",
                  }}
                />
              ) : null}
              {/* Centre crosshair so customers see the focal point */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border border-white/70 ring-1 ring-black/15" />
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] italic text-ink/50">
              {labels.hint}
            </p>

            {/* Fit mode — only meaningful for photos (logos always contain). */}
            {!isLogo && (
              <div className="mt-4 flex items-center justify-center gap-1 rounded-full border border-ink/10 bg-bg-1/60 p-1">
                {(["cover", "contain"] as const).map((mode) => {
                  const active = (position.fit ?? "cover") === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPosition((p) => ({ ...p, fit: mode }))}
                      className={[
                        "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                        active
                          ? "bg-neutral-900 text-neutral-50"
                          : "text-ink/60 hover:text-ink",
                      ].join(" ")}
                    >
                      {mode === "cover"
                        ? labels.fitCover ?? "Kırp-doldur"
                        : labels.fitContain ?? "Tümünü sığdır"}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Zoom controls */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleScale(position.scale - 0.1)}
                className="rounded-full border border-ink/15 bg-white p-2 text-ink/70 transition-colors hover:border-copper/50 hover:text-ink"
                aria-label="Zoom out"
              >
                <ZoomOut size={14} />
              </button>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.05}
                value={position.scale}
                onChange={(e) => handleScale(Number(e.target.value))}
                className="flex-1 accent-copper"
                aria-label={labels.zoom}
              />
              <button
                type="button"
                onClick={() => handleScale(position.scale + 0.1)}
                className="rounded-full border border-ink/15 bg-white p-2 text-ink/70 transition-colors hover:border-copper/50 hover:text-ink"
                aria-label="Zoom in"
              >
                <ZoomIn size={14} />
              </button>
              <span className="w-12 text-right font-mono text-xs tabular-nums text-ink/55">
                {position.scale.toFixed(2)}×
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-ink/10 bg-bg-1/50 px-6 py-4">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
            >
              <RotateCcw size={12} />
              {labels.reset}
            </button>
            <div className="flex items-center gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                >
                  {labels.cancel}
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={save}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-50 shadow-[0_4px_12px_-4px_rgba(20,18,15,0.4)] transition-transform hover:scale-[1.02]"
              >
                <Check size={12} />
                {labels.save}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
