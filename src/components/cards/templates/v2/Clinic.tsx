"use client";

// =============================================================================
// Clinic — v2 template (id=5, key="clinic").
//
// Design DNA: Projekt_4k/showcase/kart_05_doktor.html — teal gradient header,
// medical-cross logo seal, soft rounded geometry, Nunito throughout.
// Re-implemented in React + Tailwind. Premium clinical feel — clean, trusting,
// not flat-pastel.
//
// Locked design choices (do not parameterise):
//   - No photo by default. The teal gradient header carries the brand. If
//     `photoPath` is provided, render a 60 × 60 px gold-bordered circular
//     portrait inside the header.
//   - Logo: centered medical-cross icon (40 × 40 px, locked) inside a teal
//     gradient circular pill. If `logoPath` is provided, the cross is replaced
//     by the uploaded logo cropped to the same circle.
//   - Palette: teal (#0d9488), light teal (#ccfbf1), white. Article surface
//     is a pale teal page background; cards are white with teal-tinted
//     hairlines.
//   - Typography: Nunito (display + body, 400/600/700/800), via `next/font`.
//   - Section rhythm:
//       Centred Header (gradient + cross/portrait + name + speciality + clinic)
//       → Quick-actions row (Call / Book / Directions, 3-up grid) → Services
//       (treatment cards) → About (clinic bio + hours) → Testimonials →
//       Contact + Booking CTA → Wallet/Exchange/SendMyInfo → Social → Footer
//   - Distinctive: rounded-2xl geometry; teal-tinted card surfaces (10% teal
//     on white); circular pseudo-element bg accents inside the header.
//
// Variable per card: cardData content, photoPath (header portrait), logoPath
// (replaces the cross), brandPrimaryHex (overrides teal), brandAccentHex
// (overrides light teal).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarCheck,
  Clock,
  Heart,
  HelpCircle,
  MapPin,
  Phone,
  Plus,
  Quote,
  Shield,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d9488";
const LOCKED_ACCENT = "#ccfbf1";
const TEAL_DARK = "#065f56";
const TEAL_LIGHT_2 = "#14b8a6";

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

interface ClCopy {
  bookAppt: string;
  call: string;
  directions: string;
  treatments: string;
  about: string;
  hours: string;
  contact: string;
  testimonials: string;
  faqs: string;
  social: string;
  walletLabel: string;
  appointment: string;
  closed: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", ClCopy> = {
  de: {
    bookAppt: "Termin",
    call: "Anrufen",
    directions: "Anfahrt",
    treatments: "Behandlungen",
    about: "Über die Klinik",
    hours: "Öffnungszeiten",
    contact: "Kontakt",
    testimonials: "Patientenstimmen",
    faqs: "Häufige Fragen",
    social: "Folgen",
    walletLabel: "Auf das Smartphone speichern",
    appointment: "Online Termin buchen",
    closed: "Geschlossen",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
  },
  en: {
    bookAppt: "Book",
    call: "Call",
    directions: "Directions",
    treatments: "Treatments",
    about: "About the clinic",
    hours: "Opening hours",
    contact: "Contact",
    testimonials: "Patient voices",
    faqs: "Common questions",
    social: "Follow",
    walletLabel: "Add to wallet",
    appointment: "Book an appointment",
    closed: "Closed",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
  },
  tr: {
    bookAppt: "Randevu",
    call: "Ara",
    directions: "Yol Tarifi",
    treatments: "Tedaviler",
    about: "Klinik hakkında",
    hours: "Çalışma Saatleri",
    contact: "İletişim",
    testimonials: "Hasta Yorumları",
    faqs: "Sıkça Sorulanlar",
    social: "Takip et",
    walletLabel: "Cüzdana ekle",
    appointment: "Online randevu",
    closed: "Kapalı",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
  },
  es: {

    bookAppt: "Reservar",
    call: "Llamar",
    directions: "Cómo llegar",
    treatments: "Tratamientos",
    about: "Sobre la clínica",
    hours: "Horario de apertura",
    contact: "Contacto",
    testimonials: "Voces de pacientes",
    faqs: "Preguntas frecuentes",
    social: "Seguir",
    walletLabel: "Añadir a la cartera",
    appointment: "Reservar cita",
    closed: "Cerrado",
    poweredBy: "Desarrollado por",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    share: "Compartir",
  
  },
  it: {

    bookAppt: "Prenota",
    call: "Chiama",
    directions: "Indicazioni",
    treatments: "Trattamenti",
    about: "Sulla clinica",
    hours: "Orari di apertura",
    contact: "Contatto",
    testimonials: "Voci dei pazienti",
    faqs: "Domande frequenti",
    social: "Segui",
    walletLabel: "Aggiungi al wallet",
    appointment: "Prenota un appuntamento",
    closed: "Chiuso",
    poweredBy: "Realizzato con",
    impressum: "Impressum",
    privacy: "Privacy",
    share: "Condividi",
  
  },
  fr: {

    bookAppt: "Réserver",
    call: "Appeler",
    directions: "Itinéraire",
    treatments: "Soins",
    about: "À propos de la clinique",
    hours: "Horaires d'ouverture",
    contact: "Contact",
    testimonials: "Témoignages de patients",
    faqs: "Questions fréquentes",
    social: "Suivre",
    walletLabel: "Ajouter au portefeuille",
    appointment: "Prendre rendez-vous",
    closed: "Fermé",
    poweredBy: "Propulsé par",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    share: "Partager",
  
  },
  ar: {

    bookAppt: "احجز",
    call: "اتصال",
    directions: "الاتجاهات",
    treatments: "العلاجات",
    about: "عن العيادة",
    hours: "ساعات الافتتاح",
    contact: "اتصال",
    testimonials: "آراء المرضى",
    faqs: "الأسئلة الشائعة",
    social: "متابعة",
    walletLabel: "إضافة إلى المحفظة",
    appointment: "حجز موعد",
    closed: "مغلق",
    poweredBy: "مشغل بواسطة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    share: "مشاركة",
  
  },
};

export function Clinic({
  slug,
  cardData,
  locale = "de",
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);

  const services =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  return (
    <article
      data-template="clinic"
      className={`cl-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(13,148,136,0.45),0_8px_22px_-12px_rgba(13,148,136,0.20)] ring-1 ring-[#cce6e2]`}
      style={
        {
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--cl-teal" as string]: primary,
          ["--cl-teal-2" as string]: TEAL_LIGHT_2,
          ["--cl-teal-dark" as string]: TEAL_DARK,
          ["--cl-teal-soft" as string]: `${primary}10`,
          ["--cl-bg" as string]: "#f0faf5",
          ["--cl-text" as string]: "#1e293b",
          ["--cl-text-mid" as string]: "#64748b",
          ["--cl-text-dim" as string]: "#94a3b8",
          ["--cl-border" as string]: "#dceeea",
          ["--font-clinic" as string]: "'Nunito', system-ui, sans-serif",
          background: "#f0faf5",
          color: "#1e293b",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .cl-card {
          font-family:var(--tpl-font-body,  var(--font-clinic), Nunito, system-ui, sans-serif);
          line-height: 1.6;
        }
        .cl-card .cl-display,
        .cl-card h1.cl-display,
        .cl-card h2.cl-display,
        .cl-card h3.cl-display {
          font-family:var(--tpl-font-body,  var(--font-clinic), Nunito, system-ui, sans-serif);
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .cl-card a {
          color: inherit;
        }
      `}</style>

      <Header
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        clinicName={cardData.company}
        primary={primary}
        accent={accent}
        sourceLabel={sourceLabel}
      />

      <ProfileBlock
        name={cardData.name}
        speciality={cardData.position ?? cardData.title}
        clinicName={cardData.company}
        primary={primary}
      />

      {cardData.bookingUrl && (
        <PrimaryCTA bookingUrl={cardData.bookingUrl} primary={primary} label={t.appointment} />
      )}

      <QuickActions
        cardData={cardData}
        primary={primary}
        translations={t}
      />

      {services && services.length > 0 && (
        <SectionCard title={t.treatments} icon={<Stethoscope size={16} strokeWidth={2.2} />} primary={primary}>
          <div className="grid gap-3">
            {services.slice(0, 6).map((item, i) => (
              <TreatmentCard
                key={`${item.title}-${i}`}
                item={item}
                primary={primary}
                index={i}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {cardData.bio && (
        <SectionCard title={t.about} icon={<Heart size={16} strokeWidth={2.2} />} primary={primary}>
          <p
            className="text-[14px] leading-[1.7]"
            style={{ color: "var(--cl-text-mid)" }}
          >
            {cardData.bio}
          </p>
          {cardData.address && (
            <div
              className="mt-4 flex items-start gap-3 rounded-2xl p-3.5"
              style={{ background: "var(--cl-teal-soft)" }}
            >
              <MapPin
                size={16}
                strokeWidth={2}
                style={{ color: primary, flexShrink: 0, marginTop: 2 }}
              />
              <span
                className="text-[13px] font-semibold leading-snug"
                style={{ color: primary }}
              >
                {cardData.address}
              </span>
            </div>
          )}
        </SectionCard>
      )}

      <HoursCard primary={primary} accent={accent} translations={t} />

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <SectionCard title={t.testimonials} icon={<Sparkles size={16} strokeWidth={2.2} />} primary={primary}>
          <div className="grid gap-3">
            {cardData.testimonials.slice(0, 3).map((item, i) => (
              <TestimonialCard
                key={`${item.author}-${i}`}
                item={item}
                primary={primary}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {cardData.faqs && cardData.faqs.length > 0 && (
        <SectionCard title={t.faqs} icon={<HelpCircle size={16} strokeWidth={2.2} />} primary={primary}>
          <FaqList items={cardData.faqs} primary={primary} />
        </SectionCard>
      )}

      <SectionCard title={t.contact} icon={<Phone size={16} strokeWidth={2.2} />} primary={primary}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={primary}
          renderRow={(row) => (
            <a
              href={row.href}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" as const }
                : {})}
              className="group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all hover:bg-[var(--cl-teal-soft)]"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${primary} 0%, ${TEAL_LIGHT_2} 100%)`,
                  color: "white",
                  boxShadow: `0 4px 10px -4px ${primary}66`,
                }}
              >
                <row.Icon size={15} strokeWidth={2.2} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: primary }}
                >
                  {row.label}
                </span>
                <span
                  className="truncate text-[14px] font-semibold"
                  style={{ color: "var(--cl-text)" }}
                >
                  {row.value}
                </span>
              </span>
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: primary }}
              />
            </a>
          )}
        />
      </SectionCard>

      <CTASection slug={slug} sourceQs={sourceQs} locale={locale} primary={primary} accent={TEAL_DARK} />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-4 mb-4 rounded-3xl bg-white p-5 shadow-[0_2px_18px_-6px_rgba(13,148,136,0.18)] ring-1 ring-[var(--cl-border)]"
          labelClassName="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <SectionCard title={t.social} icon={<Heart size={16} strokeWidth={2.2} />} primary={primary}>
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
            itemClassName="border-[var(--cl-border)] bg-white text-[var(--cl-text)] hover:border-[color:var(--card-primary)] hover:bg-[var(--cl-teal-soft)]"
          />
        </SectionCard>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// Subcomponents
// =============================================================================

function Header({
  photoUrl,
  logoUrl,
  clinicName,
  primary,
  accent,
  sourceLabel,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  clinicName?: string;
  primary: string;
  accent: string;
  sourceLabel?: string;
}) {
  return (
    <header
      className="relative overflow-hidden px-6 pb-8 pt-9 text-center"
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${TEAL_LIGHT_2} 100%)`,
      }}
    >
      {/* Decorative concentric rings — kart_05 signature. */}
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full"
        style={{ border: "3px solid rgba(255,255,255,0.16)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full"
        style={{ border: "2px solid rgba(255,255,255,0.10)" }}
      />
      <div
        aria-hidden
        className="absolute right-12 top-12 h-16 w-16 rounded-full"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      />

      {/* Logo: medical-cross icon (or uploaded logo) inside a soft white pill. */}
      <div className="relative z-10 inline-flex">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(6px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={clinicName ? `${clinicName} logo` : "Clinic logo"}
              width={64}
              height={64}
              unoptimized
              className="h-7 w-7 rounded-full object-cover tpl-logo"
            />
          ) : (
            <Plus
              size={22}
              strokeWidth={3}
              style={{ color: "#fff" }}
              aria-label="Medical cross"
            />
          )}
        </div>
      </div>

      {/* Optional doctor portrait (60×60) — shown only if `photoPath` provided. */}
      {photoUrl && (
        <div className="relative z-10 mt-4 inline-flex">
          <div
            className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full"
            style={{
              background: "white",
              border: `2px solid ${accent}`,
              boxShadow: "0 6px 18px -8px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src={photoUrl}
              alt=""
              width={120}
              height={120}
              unoptimized
              className="h-full w-full object-cover tpl-photo"
            />
          </div>
        </div>
      )}

      {clinicName && (
        <h2
          className="cl-display relative z-10 mt-4 text-[15px] font-bold tracking-tight"
          style={{ color: "rgba(255,255,255,0.96)", letterSpacing: "0.01em" }}
        >
          {clinicName}
        </h2>
      )}

      {sourceLabel && (
        <span
          className="absolute right-4 top-4 z-10 inline-flex rounded-full bg-white/22 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md"
        >
          {sourceLabel}
        </span>
      )}
    </header>
  );
}

function ProfileBlock({
  name,
  speciality,
  clinicName,
  primary,
}: {
  name: string;
  speciality?: string;
  clinicName?: string;
  primary: string;
}) {
  void clinicName;
  return (
    <section
      className="relative -mt-6 mx-4 rounded-3xl bg-white px-6 pb-7 pt-7 text-center shadow-[0_8px_28px_-14px_rgba(13,148,136,0.30)] ring-1 ring-[var(--cl-border)]"
      style={{ zIndex: 2 }}
    >
      <h1
        className="cl-display text-[24px] font-extrabold leading-tight"
        style={{ color: "var(--cl-text)" }}
      >
        <span style={{ color: primary }}>
          {/^(Dr\.?|Prof\.?)/i.test(name) ? `${name.split(" ")[0]} ` : ""}
        </span>
        {/^(Dr\.?|Prof\.?)/i.test(name)
          ? name.replace(/^(Dr\.?|Prof\.?)\s+/i, "")
          : name}
      </h1>
      {speciality && (
        <p
          className="mt-2 text-[14.5px] font-bold"
          style={{ color: primary }}
        >
          {speciality}
        </p>
      )}
      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em]"
          style={{
            background: "var(--cl-teal-soft)",
            color: primary,
          }}
        >
          <Shield size={10} strokeWidth={2.5} />
          Verified
        </span>
        <span
          aria-hidden
          className="block h-1 w-1 rounded-full"
          style={{ background: "var(--cl-text-dim)" }}
        />
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em]"
          style={{
            background: "var(--cl-teal-soft)",
            color: primary,
          }}
        >
          <Sparkles size={10} strokeWidth={2.5} />
          GDPR
        </span>
      </div>
    </section>
  );
}

function PrimaryCTA({
  bookingUrl,
  primary,
  label,
}: {
  bookingUrl: string;
  primary: string;
  label: string;
}) {
  return (
    <section className="px-4 pt-4">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-3xl px-6 py-[18px] text-[16px] font-extrabold text-white transition-all hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${TEAL_LIGHT_2} 100%)`,
          boxShadow: `0 12px 28px -12px ${primary}99, inset 0 1px 0 rgba(255,255,255,0.22)`,
        }}
      >
        <CalendarCheck size={18} strokeWidth={2.4} />
        <span>{label}</span>
        {/* Shimmer */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-1/3 -skew-x-12 transition-transform duration-700 group-hover:translate-x-[400%]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
          }}
        />
      </a>
    </section>
  );
}

function QuickActions({
  cardData,
  primary,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  primary: string;
  translations: ClCopy;
}) {
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const directionsHref = cardData.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`
    : null;

  type Action = {
    href: string;
    Icon: typeof Phone;
    label: string;
    external?: boolean;
  };

  const actions: Action[] = [];
  if (phoneDigits) {
    actions.push({
      href: `tel:${phoneDigits}`,
      Icon: Phone,
      label: translations.call,
    });
  }
  if (cardData.bookingUrl) {
    actions.push({
      href: cardData.bookingUrl,
      Icon: CalendarCheck,
      label: translations.bookAppt,
      external: true,
    });
  }
  if (directionsHref) {
    actions.push({
      href: directionsHref,
      Icon: MapPin,
      label: translations.directions,
      external: true,
    });
  }

  if (actions.length === 0) return null;

  return (
    <section className="grid grid-cols-3 gap-2.5 px-4 pt-4">
      {actions.map((a) => (
        <a
          key={a.label}
          href={a.href}
          {...(a.external
            ? { target: "_blank", rel: "noopener noreferrer" as const }
            : {})}
          className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white px-2 py-3.5 text-center transition-all hover:-translate-y-0.5 hover:bg-[var(--cl-teal-soft)]"
          style={{
            border: "1px solid var(--cl-border)",
            boxShadow: "0 2px 10px -4px rgba(13,148,136,0.08)",
          }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "var(--cl-teal-soft)", color: primary }}
          >
            <a.Icon size={15} strokeWidth={2.2} />
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{ color: primary }}
          >
            {a.label}
          </span>
        </a>
      ))}
    </section>
  );
}

function SectionCard({
  title,
  icon,
  primary,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mx-4 mt-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_-6px_rgba(13,148,136,0.10)] ring-1 ring-[var(--cl-border)]"
    >
      <h2
        className="cl-display mb-5 flex items-center gap-2.5 text-[16px] font-extrabold"
        style={{ color: "var(--cl-text)" }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-xl"
          style={{ background: "var(--cl-teal-soft)", color: primary }}
        >
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TreatmentCard({
  item,
  primary,
  index,
}: {
  item: { title: string; description?: string; priceLabel?: string; href?: string | null };
  primary: string;
  index: number;
}) {
  void index;
  return (
    <ServiceLink
      href={item.href}
      className="rounded-2xl border bg-white p-4 transition-all hover:-translate-y-px hover:bg-[var(--cl-teal-soft)]"
      style={{ borderColor: "var(--cl-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className="cl-display text-[14.5px] font-bold leading-snug"
          style={{ color: "var(--cl-text)" }}
        >
          {item.title}
        </h3>
        {item.priceLabel && (
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{
              background: `${primary}14`,
              color: primary,
            }}
          >
            {item.priceLabel}
          </span>
        )}
      </div>
      {item.description && (
        <p
          className="mt-1.5 text-[12.5px] leading-snug"
          style={{ color: "var(--cl-text-mid)" }}
        >
          {item.description}
        </p>
      )}
    </ServiceLink>
  );
}

function HoursCard({
  primary,
  accent,
  translations,
}: {
  primary: string;
  accent: string;
  translations: ClCopy;
}) {
  // Default opening hours — Mon-Fri / Sat / Sun pattern. The public schema
  // doesn't carry per-day hours yet, so we render a generic clinical pattern.
  const rows: Array<{ day: string; time: string; closed?: boolean }> = [
    { day: "Mon — Fri", time: "08:30 — 18:00" },
    { day: "Sat", time: "09:00 — 14:00" },
    { day: "Sun", time: translations.closed, closed: true },
  ];

  void accent;

  return (
    <section
      className="mx-4 mt-4 overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_-6px_rgba(13,148,136,0.10)] ring-1 ring-[var(--cl-border)]"
    >
      <h2
        className="cl-display flex items-center gap-2.5 px-6 pb-1 pt-6 text-[16px] font-extrabold"
        style={{ color: "var(--cl-text)" }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-xl"
          style={{ background: "var(--cl-teal-soft)", color: primary }}
        >
          <Clock size={16} strokeWidth={2.2} />
        </span>
        {translations.hours}
      </h2>
      <div className="px-6 pb-5">
        {rows.map((row, i) => (
          <div
            key={row.day}
            className="flex items-center justify-between border-b py-2.5 last:border-b-0"
            style={{
              borderColor: "var(--cl-border)",
              background: i % 2 === 0 ? "transparent" : "var(--cl-teal-soft)",
              borderRadius: 4,
              padding: "10px 12px",
            }}
          >
            <span
              className="text-[13px] font-semibold"
              style={{ color: "var(--cl-text-mid)" }}
            >
              {row.day}
            </span>
            <span
              className="text-[13px] font-bold"
              style={{
                color: row.closed ? "#ef4444" : primary,
              }}
            >
              {row.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({
  item,
  primary,
}: {
  item: { author: string; role?: string; quote: string };
  primary: string;
}) {
  return (
    <figure
      className="relative rounded-2xl border bg-white p-5"
      style={{ borderColor: "var(--cl-border)" }}
    >
      <Quote
        size={26}
        strokeWidth={1.4}
        className="absolute right-4 top-3"
        style={{ color: primary, opacity: 0.18 }}
      />
      <blockquote
        className="text-[14px] leading-snug"
        style={{ color: "var(--cl-text)" }}
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption
        className="cl-display mt-3 text-[12.5px] font-bold"
        style={{ color: primary }}
      >
        {item.author}
        {item.role && (
          <span
            className="ml-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--cl-text-dim)" }}
          >
            · {item.role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function FaqList({
  items,
  primary,
}: {
  items: Array<{ q: string; a: string }>;
  primary: string;
}) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="grid gap-2">
      {items.slice(0, 6).map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={`${f.q}-${i}`}
            className="overflow-hidden rounded-2xl border bg-white"
            style={{ borderColor: "var(--cl-border)" }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="cl-display text-[14px] font-bold leading-snug"
                style={{ color: "var(--cl-text)" }}
              >
                {f.q}
              </span>
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[16px] font-bold transition-transform"
                style={{
                  background: "var(--cl-teal-soft)",
                  color: primary,
                  transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                }}
              >
                <Plus size={13} strokeWidth={2.6} />
              </span>
            </button>
            {isOpen && (
              <div
                className="px-4 pb-4 text-[13px] leading-relaxed"
                style={{ color: "var(--cl-text-mid)" }}
              >
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
}) {
  return (
    <section className="mx-4 mt-4 rounded-3xl bg-white p-5 shadow-[0_2px_16px_-6px_rgba(13,148,136,0.10)] ring-1 ring-[var(--cl-border)]">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  translations: ClCopy;
}) {
  return (
    <footer
      className="px-6 pb-7 pt-6 text-center"
      style={{
        borderTop: "1px solid var(--cl-border)",
        marginTop: 16,
      }}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--cl-teal-soft)" }}>
        <Plus size={16} strokeWidth={2.6} style={{ color: primary }} />
      </div>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: "var(--cl-text-dim)" }}
      >
        © {new Date().getFullYear()} · ALL RIGHTS RESERVED
      </p>
      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px]"
        style={{ color: "var(--cl-text-mid)" }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--cl-text)]"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--cl-text)]"
          >
            {translations.privacy}
          </a>
        )}
      </div>
      <div
        className="mt-3 inline-flex items-center gap-1.5 text-[11px]"
        style={{ color: "var(--cl-text-mid)" }}
      >
        {translations.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="cl-display font-extrabold"
          style={{ color: primary }}
        >
          OpSolid
        </a>
      </div>
    </footer>
  );
}

function FooterShare({
  siteUrl,
  slug,
  label,
}: {
  siteUrl: string;
  slug: string;
  label: string;
}) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <button
      type="button"
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ url, title: "Smart Card" });
            return;
          } catch {
            // ignore
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-[var(--cl-text)]"
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const clinicEntry: TemplateRegistryEntry = {
  id: 5,
  key: "clinic",
  name: "Clinic",
  industry: "Doctor / clinic / dermatology",
  Component: Clinic,
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
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-clinic",
};

// Sample persona — Dr. Mira Lindqvist, dermatologist, Hud Klinik, Stockholm.
// No photo upload required. Sample has photoUrl null so the gradient header
// stays clean.
export const clinicSample: SampleData = {
  templateId: 5,
  slug: "demo-clinic",
  cardData: {
    name: "Dr. Mira Lindqvist",
    title: "Specialist in Dermatology · MD, PhD",
    position: "Dermatologist",
    company: "Hud Klinik Stockholm",
    email: "boka@hudklinik.se",
    phone: "+46 8 411 22 80",
    whatsapp: "+46 70 411 22 80",
    website: "https://hudklinik.se",
    address: "Strandvägen 7B, 114 56 Stockholm, Sverige",
    bio:
      "Hud Klinik är en privat dermatologisk mottagning vid Strandvägen som drivs av Dr. Mira Lindqvist sedan 2018. Vi behandlar alla typer av hudåkommor — från eksem och akne till melanomscreening — och erbjuder utvalda kosmetiska behandlingar i en lugn klinisk miljö. Engelska, svenska, tyska.",
    bookingUrl: "https://cal.com/hudklinik/consultation",
    impressumUrl: "https://hudklinik.se/legal",
    privacyUrl: "https://hudklinik.se/integritetspolicy",
    sectorKey: "clinic",
    services: [
      {
        title: "Hudkonsultation",
        description:
          "30-minuters konsultation med diagnos och behandlingsplan. Recept skickas digitalt.",
        priceLabel: "1 450 SEK",
      },
      {
        title: "Melanomscreening",
        description:
          "Full kropp dermatoskopi med digital dokumentation och årlig uppföljning.",
        priceLabel: "2 250 SEK",
      },
      {
        title: "Aknebehandling",
        description:
          "Klinisk aknebehandling — peeling, laser eller medicinsk plan beroende på diagnos.",
        priceLabel: "From 1 850 SEK",
      },
      {
        title: "Laser & IPL",
        description:
          "Pigment, kärl, hårborttagning. Endast efter dermatologisk bedömning.",
        priceLabel: "From 2 400 SEK",
      },
      {
        title: "Kosmetisk dermatologi",
        description:
          "Botulinum, fillers, biorevitalisering. Naturlig finish, inga \"frusna ansikten\".",
      },
      {
        title: "Online second opinion",
        description:
          "Skicka foton + journal, få ett skriftligt utlåtande inom 48 timmar.",
        priceLabel: "1 100 SEK",
      },
    ],
    faqs: [
      {
        q: "Behöver jag en remiss?",
        a: "Nej. Vi tar emot patienter utan remiss. Du bokar direkt online eller via telefon.",
      },
      {
        q: "Erbjuder ni Klarna eller delbetalning?",
        a: "Ja. Klarna delbetalning upp till 24 månader på behandlingar över 3 000 SEK.",
      },
      {
        q: "Är konsultationen täckt av försäkring?",
        a: "De flesta privata sjukvårdsförsäkringar (Skandia, Trygg-Hansa, If) täcker dermatologiska konsultationer. Bekräfta med din försäkringsgivare först.",
      },
      {
        q: "Hur långt fram kan jag boka?",
        a: "Standardkonsultation: 1–2 veckor. Akut hudbedömning: oftast inom 48 timmar.",
      },
    ],
    testimonials: [
      {
        author: "Annika Westin",
        role: "Patient sedan 2021",
        quote:
          "Mira lyssnar verkligen. Inte en känsla av löpande band — snarare som att ha en hudvän som råkar vara läkare.",
      },
      {
        author: "Erik Ljung",
        role: "Stockholm",
        quote:
          "Försäkringen täckte hela melanomscreeningen. Snabbt, professionellt, ingen onödig försäljning av extraprodukter.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/hudklinik.stockholm",
      facebook: "https://facebook.com/hudklinik.se",
      linkedin: "https://linkedin.com/in/mira-lindqvist",
    },
  },
  photoUrl: null,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
