"use client";

import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/lib/constants";

export function PrivacyPage() {
  const { t } = useLocale();
  const s = t.privacy;

  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container-narrow">
        <div className="mb-10 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-sm text-amber-800">
          {s.notice}
        </div>

        <h1 className="text-display-sm font-bold text-slate-900 mb-1">{s.title}</h1>
        <p className="text-sm text-slate-400 mb-10">{s.subtitle}</p>

        <div className="space-y-8 text-slate-500 text-body leading-relaxed">
          {(s.sections as Array<Record<string, unknown>>).map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-semibold text-slate-900 mb-2">
                {section.title as string}
              </h2>

              {section.isResponsible ? (
                <p>
                  Hasan D&ouml;nmez<br />
                  (Einzelunternehmen i.Gr.)<br />
                  Germany<br />
                  E-Mail:{" "}
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-brand-600 hover:underline">
                    {SITE_CONFIG.email}
                  </a>
                </p>
              ) : section.subsections ? (
                <div className="space-y-4">
                  {(section.subsections as Array<{ title: string; content: string }>).map((sub, j) => (
                    <div key={j}>
                      <h3 className="text-sm font-semibold text-slate-700 mb-1">{sub.title}</h3>
                      <p>{sub.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{section.content as string}</p>
              )}
            </div>
          ))}

          <div className="text-sm text-slate-300 pt-6 border-t border-slate-100">
            {s.lastUpdated}
          </div>
        </div>
      </div>
    </section>
  );
}
