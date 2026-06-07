"use client";

// =============================================================================
// PsychologistPure — v2 template (id=26, key="psychologist-pure").
//
// Sector: psychologist — PURE variant. Mood: editorial cream + minimal,
// hairline rules, DM Sans, two-tone tabular layouts. Inspired by
// kart_12_psikolog_pure.html. Maximum whitespace, no decoration.
//
// Locked design DNA (only colors respond to brand):
//   - Top crest pill (clinic name) + two-line serif name + role line.
//   - Avatar row 60 px with approach label and session-mode pill.
//   - Contact rows in a tight 2-col grid.
//   - 2-col bordered specialty grid (numbered cells).
//   - Pricing rows with sans bold price column.
//   - Credentials list with year column.
//   - 3-stat hairline grid.
//   - Pulled quote testimonial (large body-serif quote).
//   - Two CTAs: solid ink + ghost outline.
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

const LOCKED_PRIMARY = "#3d5a80";
const LOCKED_ACCENT = "#98c1d9";
const INK = "#1a1825";
const INK_SOFT = "#6b6781";
const HAIRLINE = "#e7e3f0";
const HAIRLINE_SOFT = "#f3f1f9";

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

interface PspCopy {
  contact: string;
  specialties: string;
  prices: string;
  education: string;
  approach: string;
  sessionMode: string;
  bookSession: string;
  callMe: string;
  saveContact: string;
  walletLabel: string;
  experience: string;
  sessions: string;
  formats: string;
  share: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", PspCopy> = {
  de: {
    contact: "Kontakt",
    specialties: "Schwerpunkte",
    prices: "Honorare",
    education: "Ausbildung",
    approach: "Ansatz",
    sessionMode: "Online + Praxis",
    bookSession: "Sitzung anfragen",
    callMe: "Telefonisch",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    experience: "Jahre",
    sessions: "Sitzungen",
    formats: "Formate",
    share: "Teilen",
    poweredBy: "Powered by",
  },
  en: {
    contact: "Contact",
    specialties: "Focus areas",
    prices: "Session fees",
    education: "Training",
    approach: "Approach",
    sessionMode: "Online + In-person",
    bookSession: "Request a session",
    callMe: "Call me",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    experience: "Years",
    sessions: "Sessions",
    formats: "Formats",
    share: "Share",
    poweredBy: "Powered by",
  },
  tr: {
    contact: "İletişim",
    specialties: "Çalışma Alanları",
    prices: "Seans Ücretleri",
    education: "Eğitim & Sertifika",
    approach: "Yaklaşım",
    sessionMode: "Online + Yüz Yüze",
    bookSession: "Seans Randevusu Talep Et",
    callMe: "Telefonla Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    experience: "Yıl Deneyim",
    sessions: "Seans",
    formats: "Format",
    share: "Paylaş",
    poweredBy: "Powered by",
  },
  es: {

    contact: "Contacto",
    specialties: "Áreas de enfoque",
    prices: "Tarifas de sesión",
    education: "Entrenamiento",
    approach: "Enfoque",
    sessionMode: "Online y presencial",
    bookSession: "Solicitar una sesión",
    callMe: "Llámame",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    experience: "Años",
    sessions: "Sesiones",
    formats: "Formatos",
    share: "Compartir",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    contact: "Contatto",
    specialties: "Aree di focus",
    prices: "Tariffe sessione",
    education: "Allenamento",
    approach: "Approccio",
    sessionMode: "Online e in presenza",
    bookSession: "Richiedi una sessione",
    callMe: "Chiamami",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    experience: "Anni",
    sessions: "Sessioni",
    formats: "Formati",
    share: "Condividi",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    contact: "Contact",
    specialties: "Domaines de focus",
    prices: "Tarifs des séances",
    education: "Entraînement",
    approach: "Approche",
    sessionMode: "En ligne et en personne",
    bookSession: "Demander une séance",
    callMe: "Appelle-moi",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    experience: "Années",
    sessions: "Séances",
    formats: "Formats",
    share: "Partager",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    contact: "اتصال",
    specialties: "مجالات التركيز",
    prices: "رسوم الجلسة",
    education: "التدريب",
    approach: "النهج",
    sessionMode: "عبر الإنترنت وحضوري",
    bookSession: "اطلب جلسة",
    callMe: "اتصل بي",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    experience: "سنوات",
    sessions: "الجلسات",
    formats: "الصيغ",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function PsychologistPure({
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

  const services = cardData.services ?? [];
  const faqs = cardData.faqs ?? [];
  const testimonials = cardData.testimonials ?? [];

  const specialties = faqs.slice(0, 5);
  const credentials = faqs.slice(5, 8);

  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="psychologist-pure"
      className="psp-card relative mx-auto w-full max-w-[460px]"
      style={{
        background: "#fff",
        color: INK,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .psp-card { line-height: 1.6; }
        .psp-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header className="px-10 pb-8 pt-12" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <span
          className="mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[1.4px]"
          style={{ background: `${primary}1a`, color: primary }}
        >
          <span className="block h-1.5 w-1.5 rounded-full" style={{ background: primary }} />
          {cardData.company}
        </span>
        <h1 className="text-[28px] font-medium leading-[1.15] tracking-[-0.7px]" style={{ color: INK }}>
          {firstName}
          {lastName && (
            <>
              <br />
              <strong className="font-bold">{lastName}</strong>
            </>
          )}
        </h1>
        <div className="mt-2.5 text-[13.5px]" style={{ color: INK_SOFT }}>
          {cardData.position} {cardData.title && `· ${cardData.title}`}
        </div>
      </header>

      {/* AVATAR ROW */}
      <div
        className="flex items-center gap-4 px-10 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ background: HAIRLINE_SOFT, border: `2px solid ${primary}1a` }}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt="" width={120} height={120} unoptimized className="h-full w-full object-cover tpl-photo" />
          ) : (
            <span className="text-[14px] font-bold" style={{ color: primary }}>
              {cardData.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[1.5px]" style={{ color: INK_SOFT }}>
            {t.approach}
          </div>
          <div className="mt-0.5 text-[14px] font-medium" style={{ color: INK }}>
            CBT · EMDR
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1.4px]"
          style={{ color: primary }}
        >
          <span className="block h-1 w-1 rounded-full" style={{ background: primary }} />
          {t.sessionMode}
        </div>
      </div>

      {/* CONTACT */}
      <PspSection title={t.contact}>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </PspSection>

      {/* STATS */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <PspStat n="9" l={t.experience} />
        <PspStat n="800+" l={t.sessions} />
        <PspStat n="2" l={t.formats} last />
      </div>

      {/* SPECIALTIES */}
      {specialties.length > 0 && (
        <PspSection title={t.specialties}>
          <div
            className="grid grid-cols-2"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            {specialties.map((s, i) => {
              const isLastRow = i >= specialties.length - 2;
              const isRightCol = i % 2 === 1;
              const lastOdd = i === specialties.length - 1 && i % 2 === 0;
              return (
                <div
                  key={`${s.q}-${i}`}
                  className="p-5"
                  style={{
                    borderRight: !isRightCol && !lastOdd ? `1px solid ${HAIRLINE}` : "none",
                    borderBottom: !isLastRow ? `1px solid ${HAIRLINE}` : "none",
                    gridColumn: lastOdd ? "1 / -1" : undefined,
                  }}
                >
                  <div className="text-[10px] font-semibold tabular-nums tracking-[1.5px]" style={{ color: primary }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[13.5px] font-semibold leading-[1.3]" style={{ color: INK }}>
                    {s.q}
                  </div>
                  <div className="mt-1 text-[11.5px] leading-[1.5]" style={{ color: INK_SOFT }}>
                    {s.a}
                  </div>
                </div>
              );
            })}
          </div>
        </PspSection>
      )}

      {/* PRICES */}
      {services.length > 0 && (
        <PspSection title={t.prices}>
          <div>
            {services.map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className={`grid grid-cols-[1fr_auto] items-baseline py-3.5 ${i < services.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: INK }}>
                    {s.title}
                  </div>
                  {s.description && (
                    <div className="mt-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
                      {s.description}
                    </div>
                  )}
                </div>
                {s.priceLabel && (
                  <div className="text-[18px] font-semibold tabular-nums tracking-[-0.3px]" style={{ color: primary }}>
                    {s.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </PspSection>
      )}

      {/* CREDENTIALS */}
      {credentials.length > 0 && (
        <PspSection title={t.education}>
          <div>
            {credentials.map((c, i) => (
              <div
                key={`${c.q}-${i}`}
                className={`py-4 ${i < credentials.length - 1 ? "border-b" : ""} ${i === 0 ? "pt-0" : ""} ${i === credentials.length - 1 ? "pb-0" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                    {c.q}
                  </div>
                </div>
                <div className="text-[11.5px]" style={{ color: INK_SOFT }}>
                  {c.a}
                </div>
              </div>
            ))}
          </div>
        </PspSection>
      )}

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <div className="px-10 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <p className="text-[17px] font-normal leading-[1.5] tracking-[-0.2px]" style={{ color: INK }}>
            &ldquo;{testimonials[0].quote}&rdquo;
          </p>
          <div
            className="mt-5 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[1.4px]"
            style={{ color: INK_SOFT }}
          >
            <span>— {testimonials[0].author}</span>
            <span style={{ color: primary }}>â˜…â˜…â˜…â˜…â˜…</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-10 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:opacity-90"
            style={{ background: INK, color: "#fff" }}
          >
            <span>{t.bookSession}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="mt-2.5 flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:bg-[#f9f7ff]"
            style={{ background: "transparent", color: INK, border: `1px solid ${HAIRLINE}` }}
          >
            <span>{t.callMe}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* SOCIAL */}
      {cardData.socials && (
        <div className="px-10 py-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </div>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div className="px-10 py-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}
      <div className="px-10 py-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-10 py-7 text-[10px] font-semibold uppercase tracking-[1.5px]"
        style={{ color: INK_SOFT }}
      >
        <span>© {new Date().getFullYear()}</span>
        <span>{cardData.company || cardData.name}</span>
      </footer>
      <div
        className="flex items-center justify-center gap-1.5 px-10 pb-7 text-[11px]"
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

function PspSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-10 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
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

function PspStat({ n, l, last }: { n: string; l: string; last?: boolean }) {
  return (
    <div
      className="px-1.5 py-6 text-center"
      style={{ borderRight: last ? "none" : `1px solid ${HAIRLINE_SOFT}` }}
    >
      <div className="text-[24px] font-medium tabular-nums tracking-[-0.5px]" style={{ color: INK }}>
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

export const psychologistPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 26,
  key: "psychologist-pure",
  name: "Psychologist — Pure",
  industry: "Psychologist / therapist (editorial pure variant)",
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
  sampleSlug: "demo-psychologist-pure",
};

export const psychologistPureSample: SampleData = {
  templateId: 26,
  slug: "demo-psychologist-pure",
  cardData: {
    name: "Uzm. Psk. Aylin Kara",
    position: "Klinische Psychologin",
    title: "Psikoterapist",
    company: "Sicherer Raum Psychologie",
    phone: "+49 30 211 3456",
    whatsapp: "+49 170 211 3456",
    email: "aylin@psycho-berlin.de",
    website: "psycho-berlin.de",
    address: "Rosenthaler Str. 40, 10178 Berlin",
    bio: "Ein Raum, in dem Sie ohne Bewertung gehört werden — und wir gemeinsam einen Weg finden, der zu Ihrem Leben passt.",
    services: [
      { title: "Einzeltherapie", description: "60 Minuten · Praxis", priceLabel: "â‚¬120" },
      { title: "Paartherapie", description: "90 Minuten · Praxis", priceLabel: "â‚¬160" },
      { title: "Online-Beratung", description: "50 Minuten · Video", priceLabel: "â‚¬90" },
    ],
    faqs: [
      { q: "Depression & Angst", a: "CBT-basierte Kurzzeittherapie" },
      { q: "Beziehungsberatung", a: "Paar und Familie" },
      { q: "Trauma & EMDR", a: "EMDR Level 2" },
      { q: "Persönlichkeit", a: "Langfristige Therapie" },
      { q: "Karriere", a: "Burnout und Übergänge" },
      { q: "Klinische Psychologie M.Sc.", a: "Istanbul Universität · 2014 – 2016" },
      { q: "EMDR Level 2 Training", a: "EMDR Europe Akkreditierung · 2019" },
      { q: "CBT Sertifika Programmı", a: "Kognitive Verhaltenstherapie · 2017" },
    ],
    testimonials: [
      { author: "Anonim Danışan", quote: "Aylin Hanım ile çalışmak hayatımı değiştirdi. Güvenli ve destekleyici bir ortam sunuyor." },
    ],
    socials: { instagram: "https://instagram.com/guvenlialan.psikoloji" },
    sectorKey: "clinic",
  },
  photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

