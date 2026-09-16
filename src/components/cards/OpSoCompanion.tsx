import { ArrowUpRight, Smartphone } from "lucide-react";
import { opsoCompanionContent } from "@/content/opso-companion";

/** Honest handoff while the canonical account integration and public app release are prepared. */
export function OpSoCompanion({ locale, compact = false }: { locale: string; compact?: boolean }) {
  const language = locale === "de" || locale === "tr" ? locale : "en";
  const c = opsoCompanionContent[language];

  return (
    <aside className={`rounded-2xl border border-neutral-200 bg-neutral-50 ${compact ? "mt-4 p-3" : "mt-6 p-5"}`}>
      <div className="flex items-start gap-3">
        <Smartphone aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-copper-600" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{c.title}</p>
          <p className="mt-0.5 text-xs font-medium text-neutral-600">{c.status}</p>
          <p className={`mt-2 leading-relaxed text-neutral-600 ${compact ? "text-xs" : "text-sm"}`}>{c.body}</p>
          <a
            href={`/${language}/opso#availability`}
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-copper-700 underline decoration-copper-300 underline-offset-4 hover:text-copper-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper-500"
          >
            {c.action}<ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
      </div>
    </aside>
  );
}
