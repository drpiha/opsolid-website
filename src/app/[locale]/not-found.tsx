"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();
  const s = t.notFound;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70svh] pt-32 pb-20 px-6 paper-grain overflow-hidden">
      <div className="text-center max-w-xl mx-auto relative z-10">
        <div className="mono-label text-ink/50 mb-4">
          [ ERROR · 404 ]   NOT FOUND
        </div>

        <span
          className="block font-serif text-ink text-[clamp(7rem,22vw,18rem)] leading-[0.85] tracking-[-0.04em]"
          aria-hidden="true"
        >
          404
        </span>

        <h1 className="mt-6 font-serif text-ink text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-balance">
          {s.title}
        </h1>

        <p className="mt-4 text-ink/70 text-body leading-relaxed text-pretty max-w-md mx-auto">
          {s.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 bg-amber text-ink px-6 py-3.5 font-medium hairline hover:bg-amber-600 hover:text-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>
            <span>{s.backHome}</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-ink underline underline-offset-8 decoration-ink/20 decoration-1 hover:decoration-ink transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <span>{s.contactUs}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
