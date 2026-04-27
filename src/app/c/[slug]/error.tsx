"use client";

// Phase 8 — render-time error boundary for /c/[slug].
//
// Server-component render errors bubble to this client boundary instead
// of becoming a raw HTTP 500. We log to the browser console so prod
// debug captures the digest, then show a friendly placeholder.
//
// This file does NOT mask 404s — Next renders not-found.tsx separately.

import { useEffect } from "react";
import Link from "next/link";

export default function CardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[card render]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-bg-0 px-6 py-16 text-ink">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-1">
          <span aria-hidden className="text-xl">·</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Bu kart şu an açılamıyor
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-300">
          Geçici bir aksaklık. Birkaç saniye sonra tekrar deneyin ya da kart
          sahibiyle iletişime geçin. Sorun devam ederse kart sahibi bizimle
          iletişime geçebilir.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-[11px] text-ink-400">
            Referans: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line bg-bg-1 px-5 py-2 transition hover:border-line-firm"
          >
            Yeniden dene
          </button>
          <Link
            href="/"
            className="text-ink-400 underline-offset-2 hover:underline"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}
