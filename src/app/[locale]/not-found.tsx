"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();
  const s = t.notFound;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80svh] pt-32 pb-20 px-6 bg-white">
      <div className="text-center max-w-xl mx-auto">
        <span
          className="block text-brand font-black text-[clamp(8rem,24vw,20rem)] leading-[0.85] tracking-[-0.06em]"
          aria-hidden="true"
        >
          404
        </span>

        <h1 className="mt-6 text-[clamp(1.5rem,4vw,2.75rem)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] text-balance">
          {s.title}
        </h1>

        <p className="mt-4 text-ink/70 text-body leading-relaxed text-pretty max-w-md mx-auto">
          {s.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{s.backHome}</span>
          </Link>
          <Link href="/contact" className="btn-ghost">
            <span>{s.contactUs}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
