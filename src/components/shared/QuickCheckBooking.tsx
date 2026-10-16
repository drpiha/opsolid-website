"use client";

/**
 * Cal.com booking embed for the KI-Quick-Check. Event is configured via
 * NEXT_PUBLIC_CALCOM_USERNAME / NEXT_PUBLIC_CALCOM_QUICKCHECK_EVENT; without
 * them the section degrades to a contact link instead of an empty frame.
 */

import Cal from "@calcom/embed-react";
import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

const COPY = {
  de: { headline: "KI-Quick-Check buchen", lead: "90 Minuten remote, mit schriftlichem Bericht. Ab 490 €, die ersten 3 Piloten kostenlos gegen ehrliches Feedback.", fallback: "Termin per Kontaktformular anfragen" },
  en: { headline: "Book the AI Quick Check", lead: "90 minutes remote with a written report. From €490, the first 3 pilots are free in exchange for honest feedback.", fallback: "Request a slot via the contact form" },
  tr: { headline: "YZ Hızlı Kontrol planlayın", lead: "90 dakika uzaktan, yazılı raporla. 490 €'dan; ilk 3 pilot dürüst geri bildirim karşılığında ücretsiz.", fallback: "İletişim formuyla randevu isteyin" },
} as const;

export function QuickCheckBooking() {
  const { locale } = useLocale();
  const c = COPY[locale === "de" || locale === "tr" ? locale : "en"];
  const user = process.env.NEXT_PUBLIC_CALCOM_USERNAME;
  const event = process.env.NEXT_PUBLIC_CALCOM_QUICKCHECK_EVENT || "ki-quick-check";

  return (
    <section className="os-section" id="booking">
      <div className="wrap">
        <div className="os-section-head">
          <h2>{c.headline}</h2>
          <p className="lead">{c.lead}</p>
        </div>
        {user ? (
          <Cal calLink={`${user}/${event}`} style={{ width: "100%", minHeight: 520 }} config={{ layout: "month_view" }} />
        ) : (
          <Link href="/contact" className="btn btn-primary btn-lg">{c.fallback}</Link>
        )}
      </div>
    </section>
  );
}
