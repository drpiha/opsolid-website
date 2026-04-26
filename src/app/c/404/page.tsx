// =============================================================================
// /c/404 — branded "this domain isn't configured" landing page.
//
// Reached when middleware sees an unknown Host header and the
// /api/domain-resolve lookup misses. Pure server component, no Prisma calls,
// no locale logic — copy is bilingual (DE + EN) so it works regardless of
// where the visitor came from.
//
// Phase 6 — Custom Domain (Part A).
// =============================================================================

export const runtime = "nodejs";
export const dynamic = "force-static";

export const metadata = {
  title: "OpSolid — Card not configured",
  robots: { index: false, follow: false },
};

export default function CustomDomainMissPage() {
  return (
    <main className="min-h-screen bg-bg-0 px-4 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <p className="mono-label text-ink/50">OpSolid · Smart Card</p>
        <h1 className="mt-4 font-display text-display-sm text-ink">
          Diese Domain ist (noch) nicht konfiguriert.
        </h1>
        <p className="mt-3 text-base text-ink/70">
          This domain is not yet configured for an OpSolid Smart Card.
        </p>

        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 text-left">
          <p className="text-sm text-ink/80">
            <strong className="text-ink">DE:</strong> Wenn Sie der Inhaber dieser Domain
            sind, prüfen Sie bitte Ihren CNAME-Eintrag und die DNS-Verifizierung
            in Ihrem OpSolid-Adminbereich.
          </p>
          <p className="mt-3 text-sm text-ink/80">
            <strong className="text-ink">EN:</strong> If you own this domain,
            please check your CNAME record and DNS verification status in your
            OpSolid admin panel.
          </p>
        </div>

        <a
          href="https://opsolid.de"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
        >
          opsolid.de →
        </a>
      </div>
    </main>
  );
}
