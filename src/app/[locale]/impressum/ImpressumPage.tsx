"use client";

import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/lib/constants";

export function ImpressumPage() {
  const { t } = useLocale();
  const s = t.impressum;
  const sec = s.sections;

  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container-narrow">
        <div className="mb-10 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-sm text-amber-800">
          {s.notice}
        </div>

        <h1 className="text-display-sm font-bold text-slate-900 mb-10">
          {s.title}
        </h1>

        <div className="space-y-8 text-slate-500 text-body leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.according}
            </h2>
            <p>
              Hasan D&ouml;nmez<br />
              (Einzelunternehmen i.Gr.)<br />
              Germany
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {sec.address}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.representedBy}
            </h2>
            <p>Hasan D&ouml;nmez</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.contact}
            </h2>
            <p>
              E-Mail:{" "}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-brand-600 hover:underline">
                {SITE_CONFIG.email}
              </a>
              <br />
              {sec.phone}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.register}
            </h2>
            <p>{sec.registerText}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.vatId}
            </h2>
            <p>{sec.vatIdText}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.responsibleContent}
            </h2>
            <p>Hasan D&ouml;nmez</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.liabilityContent}
            </h2>
            <p>{sec.liabilityContentText}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              {sec.liabilityLinks}
            </h2>
            <p>{sec.liabilityLinksText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
