"use client";

// =============================================================================
// WellnessTeacherPure — v2 template (id=41, key="wellness-teacher-pure").
//
// Sector: Yoga teacher / wellness — PURE variant. Mood: white/cream zen
// minimalism, hairline rows, breath divider mark, soft sage accents.
// Inspired by kart_17_yoga_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - Header is centered: tiny "Breathe — Move — Be" caplabel between two
//     hairlines, small round avatar, name in DM-Sans medium, credential pill,
//     italic studio name.
//   - Three-up icon action grid divided by hairlines.
//   - Sections are vertical hairline lists: philosophy text · weekly schedule
//     · pricing rows · contact rows.
//   - Single big primary CTA at bottom.
//   - QR section is referenced by the SendMyInfoSlot/Exchange wallet block.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Globe, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#5f7a6e";
const LOCKED_ACCENT = "#a8c5bb";
const PAGE = "#f8fbf8";
const SURFACE = "#ffffff";
const INK = "#14201a";
const INK_SOFT = "#5a6660";
const HAIRLINE = "#e6ece8";
const HAIRLINE_2 = "#d1dad4";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1a1a1a" : "#ffffff";
}

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

interface Copy {
  breathLine: string;
  certified: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  philosophy: string;
  weeklyProgram: string;
  services: string;
  contact: string;
  bookCta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    breathLine: "Breathe — Move — Be",
    certified: "RYT-500 Certified",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    philosophy: "Philosophie",
    weeklyProgram: "Wochenprogramm",
    services: "Services",
    contact: "Kontakt",
    bookCta: "Stunde buchen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    breathLine: "Breathe — Move — Be",
    certified: "RYT-500 Certified",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    philosophy: "Philosophy",
    weeklyProgram: "Weekly schedule",
    services: "Services",
    contact: "Contact",
    bookCta: "Book a session",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    breathLine: "Nefes — Hareket — An",
    certified: "RYT-500 Sertifikalı",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    philosophy: "Felsefem",
    weeklyProgram: "Haftalık Program",
    services: "Hizmetler",
    contact: "İletişim",
    bookCta: "Ders Rezervasyonu",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    breathLine: "Breathe — Move — Be",
    certified: "Certificado RYT-500",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    philosophy: "Filosofía",
    weeklyProgram: "Horario semanal",
    services: "Servicios",
    contact: "Contacto",
    bookCta: "Reservar una sesión",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    breathLine: "Breathe — Move — Be",
    certified: "Certificato RYT-500",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    philosophy: "Filosofia",
    weeklyProgram: "Programma settimanale",
    services: "Servizi",
    contact: "Contatto",
    bookCta: "Prenota una sessione",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    breathLine: "Breathe — Move — Be",
    certified: "Certifié RYT-500",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    philosophy: "Philosophie",
    weeklyProgram: "Programme hebdomadaire",
    services: "Services",
    contact: "Contact",
    bookCta: "Réserver une séance",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    breathLine: "Breathe — Move — Be",
    certified: "معتمد RYT-500",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    philosophy: "الفلسفة",
    weeklyProgram: "البرنامج الأسبوعي",
    services: "الخدمات",
    contact: "اتصال",
    bookCta: "احجز جلسة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

const SCHEDULE = [
  { day: { de: "Montag", en: "Monday", tr: "Pazartesi", es: "Lunes", it: "Lunedì", fr: "Lundi", ar: "الاثنين" }, klass: "Hatha Yoga", time: "19:00" },
  { day: { de: "Mittwoch", en: "Wednesday", tr: "Çarşamba", es: "Miércoles", it: "Mercoledì", fr: "Mercredi", ar: "الأربعاء" }, klass: "Vinyasa Flow", time: "18:30" },
  { day: { de: "Freitag", en: "Friday", tr: "Cuma", es: "Viernes", it: "Venerdì", fr: "Vendredi", ar: "الجمعة" }, klass: "Restorative", time: "20:00" },
  { day: { de: "Samstag", en: "Saturday", tr: "Cumartesi", es: "Sábado", it: "Sabato", fr: "Samedi", ar: "السبت" }, klass: "Morning Practice", time: "08:00" },
];

export function WellnessTeacherPure({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const onPrimary = readableTextOn(primary);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const year = new Date().getFullYear();

  return (
    <article
      data-template="wellness-teacher-pure"
      className="wtp-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .wtp-card {
          font-family: var(--tpl-font-body, 'DM Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.7;
          background: ${PAGE};
        }
        .wtp-card .serif {
          font-family: var(--tpl-font-display, 'Lora', Georgia, serif);
          font-style: italic;
        }
        .wtp-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HEADER */}
        <header
          className="px-8 pb-7 pt-14 text-center"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-7 flex items-center justify-center gap-3 text-[11px] font-medium uppercase"
            style={{ color: primary, letterSpacing: "3px" }}
          >
            <span
              aria-hidden
              className="block h-px w-8"
              style={{ background: HAIRLINE_2 }}
            />
            {t.breathLine}
            <span
              aria-hidden
              className="block h-px w-8"
              style={{ background: HAIRLINE_2 }}
            />
          </div>
          <div
            className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full"
            style={{ border: `1px solid ${HAIRLINE}`, position: "relative" }}
          >
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="96px" unoptimized className="object-cover tpl-photo" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[24px]"
                style={{ background: PAGE, color: primary }}
              >
                {cardData.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div
            className="text-[26px] font-medium tracking-[-0.5px]"
            style={{ color: INK }}
          >
            {cardData.name}
          </div>
          <div
            className="mt-2.5 inline-block rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase"
            style={{
              background: `${accent}33`,
              color: primary,
              letterSpacing: "1.5px",
            }}
          >
            {t.certified}
          </div>
          {cardData.company && (
            <div className="serif mt-3.5 text-[16px]" style={{ color: INK_SOFT }}>
              {cardData.company}
            </div>
          )}
        </header>

        {/* ACTIONS */}
        <div
          className="grid grid-cols-3"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {phoneDigits && (
            <ActionTile
              href={`tel:${phoneDigits}`}
              Icon={Phone}
              label={t.callBtn}
              hairlineRight
              accent={primary}
            />
          )}
          {waDigits && (
            <ActionTile
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              hairlineRight={!!cardData.email}
              accent={primary}
            />
          )}
          {cardData.email && (
            <ActionTile
              href={`mailto:${cardData.email}`}
              Icon={Mail}
              label={t.emailBtn}
              accent={primary}
            />
          )}
        </div>

        {/* PHILOSOPHY */}
        {cardData.bio && (
          <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SectionLabel primary={primary}>{t.philosophy}</SectionLabel>
            <p
              className="serif mt-5 text-[16px] leading-[1.7]"
              style={{ color: INK }}
            >
              “{cardData.bio}”
            </p>
          </section>
        )}

        {/* WEEKLY SCHEDULE */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel primary={primary}>{t.weeklyProgram}</SectionLabel>
          <div className="mt-3">
            {SCHEDULE.map((row, i) => (
              <div
                key={row.klass}
                className="flex items-baseline justify-between py-3.5"
                style={{
                  borderBottom: i < SCHEDULE.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <span
                  className="text-[13px] font-medium"
                  style={{ color: INK, minWidth: 100 }}
                >
                  {row.day[locale]}
                </span>
                <span
                  className="flex-1 text-center text-[13px]"
                  style={{ color: INK_SOFT }}
                >
                  {row.klass}
                </span>
                <span
                  className="text-[12px] font-medium tabular-nums"
                  style={{ color: primary }}
                >
                  {row.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        {services.length > 0 && (
          <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SectionLabel primary={primary}>{t.services}</SectionLabel>
            <div className="mt-3">
              {services.slice(0, 6).map((svc, i, arr) => (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex items-baseline justify-between py-3.5"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="text-[13px] font-medium" style={{ color: INK }}>
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div className="mt-0.5 text-[11px]" style={{ color: INK_SOFT }}>
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="serif whitespace-nowrap text-[16px]"
                      style={{ color: primary }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel primary={primary}>{t.contact}</SectionLabel>
          <div className="mt-3">
            <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
          </div>
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl px-5 py-4 text-center text-[14px] font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: primary, color: onPrimary }}
          >
            {t.bookCta}
          </a>
        </section>

        {cardData.socials && (
          <section className="px-8 py-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-8 my-9 rounded-2xl p-5"
          style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
          <ExchangeSlot slug={slug} primary={primary} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-8 mb-9 rounded-2xl p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: primary, background: PAGE }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="px-8 py-7 text-center text-[11px]"
          style={{ color: INK_SOFT, letterSpacing: "1px" }}
        >
          © {year} {cardData.name} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </footer>
      </div>
    </article>
  );
}

function SectionLabel({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <div
      className="text-[11px] font-medium uppercase"
      style={{ color: primary, letterSpacing: "2px" }}
    >
      {children}
    </div>
  );
}

function ActionTile({
  href,
  Icon,
  label,
  hairlineRight,
  external,
  accent,
}: {
  href: string;
  Icon: typeof Phone | typeof Globe;
  label: string;
  hairlineRight?: boolean;
  external?: boolean;
  accent: string;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center transition-colors hover:bg-[--hover]"
      style={{
        color: INK,
        borderRight: hairlineRight ? `1px solid ${HAIRLINE}` : undefined,
        ["--hover" as string]: `${accent}14`,
      }}
    >
      <Icon size={18} strokeWidth={1.6} style={{ color: accent }} />
      <span
        className="text-[11px] font-medium uppercase"
        style={{ letterSpacing: "1.2px" }}
      >
        {label}
      </span>
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const wellnessTeacherPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 41,
  key: "wellness-teacher-pure",
  name: "Wellness — Pure",
  industry: "Yoga teacher / wellness coach (solo)",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-wellness-teacher-pure",
};

// photo: Unsplash, yoga teacher portrait. Unsplash License — free, no attribution required.
export const wellnessTeacherPureSample: SampleData = {
  templateId: 41,
  slug: "demo-wellness-teacher-pure",
  cardData: {
    name: "Sera Özdoğan",
    position: "Yoga-Lehrerin · Wellness Coach",
    title: "RYT 500",
    company: "Sera Yoga & Wellness",
    email: "sera@serayoga.de",
    phone: "+49 176 223 4567",
    whatsapp: "+49 176 223 4567",
    website: "serayoga.de",
    address: "Prenzlauer Berg, Berlin",
    bio: "Yoga ist die Kunst, dem Atem treu zu bleiben und mit dem Körper im Einklang zu sein. Seit sechs Jahren begleite ich meine Schüler:innen auf dieser Reise.",
    bookingUrl: "https://cal.com/serayoga/intro",
    sectorKey: "fitness",
    services: [
      { title: "Einzelstunde", description: "60 min · 1:1, individuell", priceLabel: "â‚¬80" },
      { title: "Monatskurs", description: "4×/Woche · kleine Gruppe", priceLabel: "â‚¬160" },
      { title: "Retreat", description: "3 Tage · Vollpension", priceLabel: "â‚¬480" },
      { title: "Online-Session", description: "30 min · live", priceLabel: "â‚¬35" },
    ],
    socials: {
      instagram: "https://instagram.com/serayoga",
      youtube: "https://youtube.com/@serayoga",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

