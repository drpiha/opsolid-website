"use client";

import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/lib/constants";

export function PrivacyPage() {
  const { t } = useLocale();
  const s = t.privacy;

  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container-narrow">
        <div className="mb-12 hairline bg-paper-warm p-5 text-sm text-ink/80 text-pretty">
          <span className="mono-label text-ink/60 block mb-2">NOTICE</span>
          {s.notice}
        </div>

        <span className="mono-label text-ink/60">[ LEGAL · PRIVACY ]</span>
        <h1 className="font-serif text-display-sm text-ink mt-3 mb-2 text-balance">{s.title}</h1>
        <p className="mono-label text-ink/50 mb-12">{s.subtitle}</p>

        <div className="space-y-10 text-ink/75 text-body leading-relaxed break-words">
          {(s.sections as Array<Record<string, unknown>>).map((section, i) => (
            <div key={i} className="hairline-t pt-8 first:hairline-t-0 first:pt-0">
              <h2 className="font-serif text-heading text-ink mb-4 text-balance">
                {section.title as string}
              </h2>

              {section.isResponsible ? (
                <p className="text-pretty">
                  Hasan D&ouml;nmez<br />
                  (Einzelunternehmen i.Gr.)<br />
                  Germany<br />
                  E-Mail:{" "}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              ) : section.subsections ? (
                <div className="space-y-5">
                  {(section.subsections as Array<{ title: string; content: string }>).map(
                    (sub, j) => (
                      <div key={j}>
                        <h3 className="mono-label text-ink mb-2">{sub.title}</h3>
                        <p className="text-pretty">{sub.content}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-pretty">{section.content as string}</p>
              )}
            </div>
          ))}

          <div className="mono-label text-ink/50 pt-8 hairline-t">
            {s.lastUpdated}
          </div>
        </div>
      </div>
    </section>
  );
}
