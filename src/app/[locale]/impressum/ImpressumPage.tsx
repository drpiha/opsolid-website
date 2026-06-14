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
            OpSolid
            <br />
            Hasan D&ouml;nmez (Inhaber, Einzelunternehmen)
            <br />
            {SITE_CONFIG.address.street}
            <br />
            {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
            <br />
            {SITE_CONFIG.address.country}
          </p>
        </>
      ),
    },
    {
      heading: sec.contact,
      body: (
        <p>
          E-Mail:{" "}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand break-all"
          >
            {SITE_CONFIG.email}
          </a>
          <br />
          Tel.:{" "}
          <a
            href="tel:+4917631020654"
            className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
          >
            +49 176 31020654
          </a>
          <br />
          Tel. (TR):{" "}
          <a
            href="tel:+905335717885"
            className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
          >
            +90 533 571 78 85
          </a>
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
      body: (
        <p>
          Hasan D&ouml;nmez
          <br />
          {SITE_CONFIG.address.street}, {SITE_CONFIG.address.postalCode}{" "}
          {SITE_CONFIG.address.city}
        </p>
      ),
    },
    {
      heading: sec.disputeResolution,
      body: <p>{sec.disputeResolutionText}</p>,
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
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 bg-bg-1"
      >
        <div className="container-narrow">
          <span className="eyebrow uppercase text-brand mb-4 block">Legal</span>
          <h1
            id="impressum-title"
            className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink text-balance"
          >
            {s.title}
          </h1>
        </div>
      </section>

      {/* Notice + body */}
      <section className="py-12 md:py-20 bg-bg-1">
        <div className="container-narrow">
          <div className="pop-card p-5 mb-12 text-sm text-ink/80 flex items-start gap-3">
            <span className="eyebrow uppercase text-brand shrink-0 pt-0.5">
              Notice
            </span>
            <span className="leading-relaxed text-pretty">{s.notice}</span>
          </div>

          <dl className="border-t border-neutral-200">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-8 border-b border-neutral-200"
              >
                <dt className="md:col-span-4">
                  <div className="eyebrow uppercase text-ink/50 mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-base md:text-lg font-bold text-ink tracking-[-0.015em] leading-snug text-balance">
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
