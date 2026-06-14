"use client";

import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/lib/constants";

export function PrivacyPage() {
  const { t } = useLocale();
  const s = t.privacy;

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-bg-1">
      <div className="container-narrow">
        <div className="mb-10 pop-card p-5 text-sm text-ink/80 text-pretty">
          <span className="eyebrow uppercase text-brand block mb-2">Notice</span>
          {s.notice}
        </div>

        <span className="eyebrow uppercase text-ink/50">Legal · Privacy</span>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink mt-3 mb-2 text-balance">
          {s.title}
        </h1>
        <p className="text-sm font-medium text-ink/50 mb-12">{s.subtitle}</p>

        <div className="space-y-10 text-ink/75 text-body leading-relaxed break-words">
          {(s.sections as Array<Record<string, unknown>>).map((section, i) => (
            <div
              key={i}
              className="border-t border-neutral-200 pt-8 first:border-t-0 first:pt-0"
            >
              <h2 className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold text-ink mb-4 tracking-[-0.015em] text-balance">
                {section.title as string}
              </h2>

              {section.isResponsible ? (
                <p className="text-pretty">
                  OpSolid<br />
                  Hasan D&ouml;nmez (Inhaber, Einzelunternehmen)<br />
                  {SITE_CONFIG.address.street}<br />
                  {SITE_CONFIG.address.postalCode}{" "}
                  {SITE_CONFIG.address.city}<br />
                  {SITE_CONFIG.address.country}<br />
                  E-Mail:{" "}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              ) : (
                <>
                  {section.content ? (
                    <p className="text-pretty mb-5">{section.content as string}</p>
                  ) : null}
                  {section.subsections ? (
                    <div className="space-y-5">
                      {(section.subsections as Array<{ title: string; content: string }>).map(
                        (sub, j) => (
                          <div key={j}>
                            <h3 className="text-sm font-semibold text-ink mb-2">
                              {sub.title}
                            </h3>
                            <p className="text-pretty">{sub.content}</p>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          ))}

          <div className="eyebrow uppercase text-ink/50 pt-8 border-t border-neutral-200">
            {s.lastUpdated}
          </div>
        </div>
      </div>
    </section>
  );
}
