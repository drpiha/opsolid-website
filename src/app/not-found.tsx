// =============================================================================
// Global (root-level) 404 — catches misses OUTSIDE the [locale] segment,
// which previously fell through to Next's bare default page (navy
// "404 | This page could not be found."). Static and provider-free on
// purpose: the root layout has no LocaleProvider, so the copy is short and
// trilingual instead of hook-driven.
// =============================================================================

import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-white px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        OpSolid
      </p>
      <p
        className="mt-4 text-[clamp(5rem,18vw,10rem)] font-black leading-none tracking-tight text-copper-500"
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">
        Sayfa bulunamadı · Seite nicht gefunden · Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. — Die Seite
        wurde verschoben oder existiert nicht. — The page may have moved or
        never existed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-50 transition-transform hover:scale-[1.02]"
        >
          opsolid.de
        </Link>
        <Link
          href="/tr/card/new"
          className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400"
        >
          Kart oluştur · Karte erstellen
        </Link>
      </div>
    </main>
  );
}
