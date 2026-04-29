"use client";

// =============================================================================
// DentistPure — v2 template (id=23, key="dentist-pure").
//
// Sector: dental clinic — PURE variant. Mood: editorial whitespace, near-zero
// surface decoration, hairline rules. Inspired by kart_11_dis_hekimi_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - No hero photo. Editorial header — meta line (TR / IST · EST. 2014),
//     two-line serif name (light + bold), supporting title in muted text.
//   - Avatar row (60 px circle) with role label + open-status dot.
//   - Numbered services list with right-aligned discipline tag (no icons).
//   - Stats grid (4 cells) framed by hairlines only.
//   - Testimonial: large pulled quote, 17 px serif, star row inline.
//   - CTA pair: solid ink button → ghost outline button.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d6e8a";
const LOCKED_ACCENT = "#7ecfd4";
const INK = "#111111";
const INK_SOFT = "#6b7280";
const HAIRLINE = "#e5e7eb";
const HAIRLINE_SOFT = "#f3f4f6";

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function digitsOnly(value: string): string {
  return value.replace(/[^+0-9]/g, "");
}

interface DnpCopy {
  contact: string;
  services: string;
  certifications: string;
  testimonial: string;
  bookAppointment: string;
  callClinic: string;
  saveContact: string;
  walletLabel: string;
  servicesLabel: string;
  reviewsLabel: string;
  open: string;
  practitioner: string;
  practitionerValue: string;
  share: string;
  poweredBy: string;
  scanShareSave: string;
}

const COPY: Record<"de" | "en" | "tr", DnpCopy> = {
  de: {
    contact: "Kontakt",
    services: "Behandlungen",
    certifications: "Qualifikation",
    testimonial: "Stimmen",
    bookAppointment: "Termin anfragen",
    callClinic: "Praxis anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    servicesLabel: "Behandlungen",
    reviewsLabel: "Bewertungen",
    open: "Offen",
    practitioner: "Praxis",
    practitionerValue: "Klinikleiter",
    share: "Teilen",
    poweredBy: "Powered by",
    scanShareSave: "Scan · Speichern · Teilen",
  },
  en: {
    contact: "Contact",
    services: "Treatments",
    certifications: "Credentials",
    testimonial: "Voices",
    bookAppointment: "Request appointment",
    callClinic: "Call the clinic",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    servicesLabel: "Treatments",
    reviewsLabel: "Reviews",
    open: "Open",
    practitioner: "Practice",
    practitionerValue: "Clinical lead",
    share: "Share",
    poweredBy: "Powered by",
    scanShareSave: "Scan · Save · Share",
  },
  tr: {
    contact: "İletişim",
    services: "Tedavi Hizmetleri",
    certifications: "Sertifika",
    testimonial: "Hasta Yorumu",
    bookAppointment: "Randevu Talep Et",
    callClinic: "Kliniği Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    servicesLabel: "Tedaviler",
    reviewsLabel: "Yorum",
    open: "Açık",
    practitioner: "Hekim",
    practitionerValue: "Klinik direktörü",
    share: "Paylaş",
    poweredBy: "Powered by",
    scanShareSave: "Scan · Save · Share",
  },
};

export function DentistPure({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Split name into first / last (last word becomes the bold weight).
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const services = cardData.services ?? [];
  const credentials = cardData.faqs ?? [];
  const testimonials = cardData.testimonials ?? [];

  const year = new Date().getFullYear();

  return (
    <article
      data-template="dentist-pure"
      className="dnp-card relative mx-auto w-full max-w-[460px]"
      style={{
        background: "#fff",
        color: INK,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .dnp-card { line-height: 1.55; }
        .dnp-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header className="px-9 pb-7 pt-12" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div
          className="mb-7 flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[1.6px]"
          style={{ color: INK_SOFT }}
        >
          <span>{cardData.address?.split(",").slice(-1)[0]?.trim() || "DE / BERLIN"}</span>
          <span aria-hidden className="block h-px flex-1" style={{ background: HAIRLINE }} />
          <span>EST. {year - 12}</span>
        </div>
        <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-1px]" style={{ color: INK }}>
          {firstName}
          {lastName && (
            <>
              <br />
              <strong className="font-bold">{lastName}</strong>
            </>
          )}
        </h1>
        <div className="mt-2 text-[13px]" style={{ color: INK_SOFT }}>
          {cardData.position}
          {cardData.title && (
            <>
              {" · "}
              <span>{cardData.title}</span>
            </>
          )}
        </div>
        {cardData.company && (
          <div
            className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: primary }}
          >
            <span aria-hidden className="block h-px w-3.5" style={{ background: primary }} />
            {cardData.company}
          </div>
        )}
      </header>

      {/* AVATAR ROW */}
      <div
        className="flex items-center gap-4 px-9 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ background: HAIRLINE_SOFT }}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt="" width={120} height={120} unoptimized className="h-full w-full object-cover" />
          ) : (
            <span className="text-[14px] font-bold" style={{ color: primary }}>
              {cardData.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[1.5px]" style={{ color: INK_SOFT }}>
            {t.practitioner}
          </div>
          <div className="mt-0.5 text-[14px] font-medium" style={{ color: INK }}>
            {t.practitionerValue}
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1.4px]"
          style={{ color: primary }}
        >
          <span className="block h-1.5 w-1.5 rounded-full" style={{ background: primary }} />
          {t.open}
        </div>
      </div>

      {/* CONTACT */}
      <Section title={t.contact} primary={primary}>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </Section>

      {/* STATS — driven by real data */}
      {(() => {
        const statsItems = [
          ...(services.length ? [{ n: String(services.length), l: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ n: String(testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <div
            style={{
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
              display: "grid",
              gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
            }}
          >
            {statsItems.map((stat, i) => (
              <PureStat key={stat.l} n={stat.n} l={stat.l} last={i === statsItems.length - 1} />
            ))}
          </div>
        );
      })()}

      {/* SERVICES */}
      {services.length > 0 && (
        <Section title={t.services} primary={primary}>
          <div>
            {services.map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className={`grid grid-cols-[32px_1fr_auto] items-center gap-4 py-3.5 ${i < services.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <span className="text-[11px] font-semibold tabular-nums" style={{ color: primary }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-medium" style={{ color: INK }}>
                  {s.title}
                </span>
                {s.priceLabel && (
                  <span className="text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: INK_SOFT }}>
                    {s.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CREDENTIALS */}
      {credentials.length > 0 && (
        <Section title={t.certifications} primary={primary}>
          <div>
            {credentials.slice(0, 4).map((c, i) => (
              <div
                key={`${c.q}-${i}`}
                className={`py-4 ${i < credentials.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                    {c.q}
                  </div>
                </div>
                <div className="text-[12px]" style={{ color: INK_SOFT }}>
                  {c.a}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <div className="px-9 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <p
            className="text-[16px] font-normal leading-[1.55] tracking-[-0.2px]"
            style={{ color: INK }}
          >
            &ldquo;{testimonials[0].quote}&rdquo;
          </p>
          <div
            className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[1.3px]"
            style={{ color: INK_SOFT }}
          >
            <span>— {testimonials[0].author}</span>
            <span style={{ color: primary, letterSpacing: "1px" }}>★★★★★</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-9 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:opacity-90"
            style={{ background: INK, color: "#fff" }}
          >
            <span>{t.bookAppointment}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="mt-2.5 flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:bg-[#f3f4f6]"
            style={{ background: "transparent", color: INK, border: `1px solid ${HAIRLINE}` }}
          >
            <span>{t.callClinic}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* SOCIAL */}
      {cardData.socials && (
        <div className="px-9 py-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </div>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div className="px-9 py-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div className="px-9 py-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-9 py-7 text-[10px] font-semibold uppercase tracking-[1.5px]"
        style={{ color: INK_SOFT }}
      >
        <span>© {year}</span>
        <span>{cardData.company || cardData.name}</span>
      </footer>
      <div
        className="flex items-center justify-center gap-1.5 px-9 pb-7 text-[10px]"
        style={{ color: INK_SOFT }}
      >
        <Shield size={11} strokeWidth={1.6} />
        {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
          style={{ color: primary }}
        >
          OpSolid
        </a>
      </div>
    </article>
  );
}

function Section({ title, primary, children }: { title: string; primary: string; children: React.ReactNode }) {
  void primary;
  return (
    <section className="px-9 py-8" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
      <h3
        className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[1.8px]"
        style={{ color: INK }}
      >
        <span>{title}</span>
        <span aria-hidden className="block h-px flex-1" style={{ background: HAIRLINE }} />
      </h3>
      {children}
    </section>
  );
}

function PureStat({ n, l, last }: { n: string; l: string; last?: boolean }) {
  return (
    <div
      className="px-1.5 py-6 text-center"
      style={{ borderRight: last ? "none" : `1px solid ${HAIRLINE_SOFT}` }}
    >
      <div className="text-[24px] font-medium tabular-nums tracking-[-0.6px]" style={{ color: INK }}>
        {n}
      </div>
      <div className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[1.4px]" style={{ color: INK_SOFT }}>
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const dentistPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 23,
  key: "dentist-pure",
  name: "Dentist — Pure",
  industry: "Dental clinic / dentist (editorial pure variant)",
  supports: {
    services: true,
    faqs: true,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: { brandPrimaryHex: LOCKED_PRIMARY, brandAccentHex: LOCKED_ACCENT },
  sampleSlug: "demo-dentist-pure",
};

// photo: Unsplash, Caroline LM. Unsplash License — free, no attribution required.
export const dentistPureSample: SampleData = {
  templateId: 23,
  slug: "demo-dentist-pure",
  cardData: {
    name: "Dr. Burak Yılmaz",
    position: "Diş Hekimi",
    title: "Implant & Estetik",
    company: "Estetik Diş Kliniği",
    phone: "+49 30 445 6789",
    whatsapp: "+49 170 445 6789",
    email: "burak@estetikdis.de",
    website: "estetikdis.de",
    address: "Kurfürstendamm 45, 10707 Berlin",
    bio: "Spezialist für ästhetische Zahnmedizin und Implantologie. Über 12 Jahre Erfahrung — vereinbaren Sie Ihr kostenloses Erstgespräch.",
    services: [
      { title: "Implantologie", priceLabel: "Chirurgie" },
      { title: "Bleaching", priceLabel: "Ästhetik" },
      { title: "Veneers", priceLabel: "Ästhetik" },
      { title: "Invisalign", priceLabel: "Schiene" },
      { title: "Smile Design", priceLabel: "Konsult." },
    ],
    faqs: [
      { q: "ITI Implantologie", a: "International Team for Implantology — zertifizierter Spezialist." },
      { q: "Invisalign Provider", a: "Zertifizierung für unsichtbare Aligner-Therapie." },
      { q: "Smile Design Training", a: "Hollywood Smile Protokolle und Veneer-Spezialisierung." },
    ],
    testimonials: [
      {
        author: "Cem Y.",
        quote: "Endlich wieder lachen ohne mich zu schämen. Top Arbeit, schmerzfrei und transparente Beratung.",
      },
    ],
    socials: { instagram: "https://instagram.com/estetikdis.berlin" },
    sectorKey: "clinic",
  },
  photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
