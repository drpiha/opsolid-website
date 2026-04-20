"use client";

import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/lib/constants";

export function ImpressumPage() {
  const { t } = useLocale();
  const s = t.impressum;
  const sec = s.sections;

  const items: Array<{ heading: string; body: React.ReactNode }> = [
    {
      heading: sec.according,
      body: (
        <>
          <p>
            Hasan D&ouml;nmez
            <br />
            (Einzelunternehmen i.Gr.)
            <br />
            Germany
          </p>
          <p className="mt-3 text-ink/50 text-sm">{sec.address}</p>
        </>
      ),
    },
    {
      heading: sec.representedBy,
      body: <p>Hasan D&ouml;nmez</p>,
    },
    {
      heading: sec.contact,
      body: (
        <p>
          E-Mail:{" "}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink break-all"
          >
            {SITE_CONFIG.email}
          </a>
          <br />
          {sec.phone}
        </p>
      ),
    },
    {
      heading: sec.register,
      body: <p>{sec.registerText}</p>,
    },
    {
      heading: sec.vatId,
      body: <p>{sec.vatIdText}</p>,
    },
    {
      heading: sec.responsibleContent,
      body: <p>Hasan D&ouml;nmez</p>,
    },
    {
      heading: sec.liabilityContent,
      body: <p>{sec.liabilityContentText}</p>,
    },
    {
      heading: sec.liabilityLinks,
      body: <p>{sec.liabilityLinksText}</p>,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="impressum-title"
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ LEGAL · 10 ]   IMPRESSUM
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-narrow relative z-10 pt-10 md:pt-14">
          <h1
            id="impressum-title"
            className="font-serif text-ink text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          >
            {s.title}
          </h1>
        </div>
      </section>

      {/* Notice + body */}
      <section className="hairline-t py-12 md:py-20">
        <div className="container-narrow">
          <div className="hairline bg-paper-warm rounded-2xl p-5 mb-12 text-sm text-ink/80 flex items-start gap-3">
            <span className="mono-label text-amber-700 shrink-0 pt-0.5">
              NOTICE
            </span>
            <span className="leading-relaxed text-pretty">{s.notice}</span>
          </div>

          <dl className="hairline-t">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-8 hairline-b"
              >
                <dt className="md:col-span-4">
                  <div className="mono-label text-ink/50 mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-serif text-ink text-[1.125rem] md:text-[1.25rem] leading-[1.2] tracking-[-0.01em] text-balance">
                    {item.heading}
                  </div>
                </dt>
                <dd className="md:col-span-8 text-ink/80 text-body leading-relaxed break-words text-pretty">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
