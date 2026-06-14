"use client";

// =============================================================================
// Dentist — v2 template (id=22, key="dentist").
//
// Design DNA: kart_11_dis_hekimi.html — premium dental clinic with warm teal
// hero, sage-on-cream surfaces, and clean rounded geometry. Aimed at private
// practice / family dentists who want a calm, trustworthy first impression.
//
// Locked design choices (do not parameterise):
//   - Hero: photographic banner ~220 px, primary-tinted multiply overlay, with
//     clinic name + "appointments available" badge layered on top.
//   - Profile card: floats up over the hero (-mt-14), avatar 76 px circle with
//     soft accent ring, name + speciality + "X yıl deneyim" pill.
//   - Quick actions row: Call / WhatsApp / Email — three chunky pill cards
//     with channel-specific tinted icon tiles (mint, lime, teal).
//   - Hours strip: gradient mini-card with clock icon — "Klinik Saatleri".
//   - Services: 2-column grid of cards with serif-feeling soft gradient fill.
//   - Stats band: 4 stat cells on a primary→primary-dark diagonal.
//   - Testimonial: quote card with serif open-quote watermark.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d9488"; // teal
const LOCKED_ACCENT = "#e0f2f1"; // mint surface
const TEAL_DARK = "#0f766e";
const INK = "#134e4a";
const INK_SOFT = "#64748b";
const SURFACE_PAGE = "#f0f8f5";
const HAIRLINE = "rgba(13,148,136,0.16)";

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return (parts[0][0] ?? "•").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface DnCopy {
  bookAppointment: string;
  call: string;
  whatsapp: string;
  email: string;
  treatments: string;
  credentials: string;
  hours: string;
  appointmentBadge: string;
  patientReview: string;
  contact: string;
  social: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
  servicesLabel: string;
  reviewsLabel: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", DnCopy> = {
  de: {
    bookAppointment: "Termin vereinbaren",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    treatments: "Behandlungen",
    credentials: "Zertifikate & Spezialisierung",
    hours: "Praxisadresse",
    appointmentBadge: "Notfalltermine möglich",
    patientReview: "Patientenstimme",
    contact: "Kontakt",
    social: "Folgen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
    servicesLabel: "Behandlungen",
    reviewsLabel: "Bewertungen",
  },
  en: {
    bookAppointment: "Book appointment",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    treatments: "Treatments",
    credentials: "Credentials & specialisations",
    hours: "Practice address",
    appointmentBadge: "Same-day appointments",
    patientReview: "Patient review",
    contact: "Contact",
    social: "Follow",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
    servicesLabel: "Treatments",
    reviewsLabel: "Reviews",
  },
  tr: {
    bookAppointment: "Hemen Randevu Al",
    call: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    treatments: "Tedavi Hizmetleri",
    credentials: "Sertifika & Uzmanlık",
    hours: "Klinik Adresi",
    appointmentBadge: "Acil Randevu Mevcut",
    patientReview: "Hasta Yorumu",
    contact: "İletişim",
    social: "Sosyal",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
    servicesLabel: "Tedaviler",
    reviewsLabel: "Yorum",
  },
  es: {

    bookAppointment: "Reservar cita",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    treatments: "Tratamientos",
    credentials: "Credenciales y especializaciones",
    hours: "Dirección del despacho",
    appointmentBadge: "Citas el mismo día",
    patientReview: "Reseña de paciente",
    contact: "Contacto",
    social: "Seguir",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    share: "Compartir",
    servicesLabel: "Tratamientos",
    reviewsLabel: "Reseñas",
  
  },
  it: {

    bookAppointment: "Prenota un appuntamento",
    call: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    treatments: "Trattamenti",
    credentials: "Credenziali e specializzazioni",
    hours: "Indirizzo dello studio",
    appointmentBadge: "Appuntamenti in giornata",
    patientReview: "Recensione paziente",
    contact: "Contatto",
    social: "Segui",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    impressum: "Impressum",
    privacy: "Privacy",
    share: "Condividi",
    servicesLabel: "Trattamenti",
    reviewsLabel: "Recensioni",
  
  },
  fr: {

    bookAppointment: "Prendre rendez-vous",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    treatments: "Soins",
    credentials: "Références et spécialisations",
    hours: "Adresse du cabinet",
    appointmentBadge: "Rendez-vous le jour même",
    patientReview: "Avis patient",
    contact: "Contact",
    social: "Suivre",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    share: "Partager",
    servicesLabel: "Soins",
    reviewsLabel: "Avis",
  
  },
  ar: {

    bookAppointment: "حجز موعد",
    call: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    treatments: "العلاجات",
    credentials: "المؤهلات والتخصصات",
    hours: "عنوان المكتب",
    appointmentBadge: "مواعيد في نفس اليوم",
    patientReview: "تقييم المريض",
    contact: "اتصال",
    social: "متابعة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    share: "مشاركة",
    servicesLabel: "العلاجات",
    reviewsLabel: "التقييمات",
  
  },
};

export function Dentist({
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
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);

  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const coverUrl = cardData.coverImage
    ? resolveAssetUrl(cardData.coverImage)
    : "https://images.unsplash.com/photo-1588776814546-1ffb6b463eb8?w=920&q=80&auto=format&fit=crop";

  return (
    <article
      data-template="dentist"
      className="dn-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(13,148,136,0.30),0_8px_20px_-12px_rgba(13,148,136,0.18)] ring-1 ring-[rgba(13,148,136,0.10)]"
      style={
        {
          background: "#ffffff",
          color: INK,
          ["--dn-primary" as string]: primary,
          ["--dn-primary-dark" as string]: TEAL_DARK,
          ["--dn-accent" as string]: accent,
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .dn-card {
          font-family: var(--tpl-font-body, "Nunito", "Inter", system-ui, sans-serif);
          line-height: 1.55;
          color: ${INK};
        }
      `}</style>

      {/* HERO — photographic banner with multiply overlay */}
      <header
        className="relative h-[220px] overflow-hidden"
        style={{ background: primary }}
      >
        {coverUrl && (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="460px"
            unoptimized
            className="object-cover opacity-[0.42] tpl-photo"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${primary}99 0%, ${TEAL_DARK}d9 100%)`,
            mixBlendMode: "multiply",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              {t.appointmentBadge}
            </span>
            {sourceLabel && (
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/70">
                {sourceLabel}
              </span>
            )}
          </div>
          <div>
            {cardData.company && (
              <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.01em]">
                {cardData.company}
              </h2>
            )}
            {cardData.title && (
              <p className="mt-1 text-[13px] text-white/90">{cardData.title}</p>
            )}
          </div>
        </div>
      </header>

      {/* PROFILE — floats over hero */}
      <section className="relative z-10 -mt-14 px-6">
        <div
          className="flex items-center gap-4 rounded-[22px] bg-white p-5"
          style={{
            border: `1px solid ${HAIRLINE}`,
            boxShadow: "0 14px 36px -18px rgba(13,148,136,0.30)",
          }}
        >
          <div
            className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full"
            style={{
              border: `3px solid ${accent}`,
              background: accent,
            }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                fill
                sizes="76px"
                unoptimized
                className="object-cover tpl-photo"
              />
            ) : logoUrl ? (
              <Image
                src={logoUrl}
                alt=""
                fill
                sizes="76px"
                unoptimized
                className="object-contain p-2 tpl-logo"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[24px] font-bold"
                style={{ color: TEAL_DARK }}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[19px] font-extrabold leading-tight" style={{ color: INK }}>
              {cardData.name}
            </h1>
            {cardData.position && (
              <p className="mt-0.5 text-[12.5px] leading-snug" style={{ color: INK_SOFT }}>
                {cardData.position}
              </p>
            )}
            {cardData.title && cardData.title !== cardData.company && (
              <span
                className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em]"
                style={{ background: accent, color: TEAL_DARK }}
              >
                {cardData.title}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2.5 px-6 pb-2 pt-5">
        {phoneDigits && (
          <ActionTile
            href={`tel:${phoneDigits}`}
            label={t.call}
            tintBg="#d1fae5"
            tintFg="#047857"
            Icon={Phone}
          />
        )}
        {waDigits && (
          <ActionTile
            href={`https://wa.me/${waDigits}`}
            label={t.whatsapp}
            external
            tintBg="#dcfce7"
            tintFg="#16a34a"
            Icon={MessageCircle}
          />
        )}
        {cardData.email && (
          <ActionTile
            href={`mailto:${cardData.email}`}
            label={t.email}
            tintBg={accent}
            tintFg={primary}
            Icon={Mail}
          />
        )}
      </section>

      {/* ADDRESS STRIP */}
      {cardData.address && <section className="px-6 pt-4">
        <div
          className="flex items-center gap-3.5 rounded-2xl bg-white p-4"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${TEAL_DARK} 100%)`,
            }}
          >
            <Clock size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p
              className="text-[10.5px] font-bold uppercase tracking-[0.1em]"
              style={{ color: INK_SOFT }}
            >
              {t.hours}
            </p>
            <p className="mt-0.5 text-[14px] font-extrabold" style={{ color: INK }}>
              {cardData.address}
            </p>
          </div>
        </div>
      </section>}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-6 py-7">
          <SectionTitle primary={primary}>{t.treatments}</SectionTitle>
          <div className="grid grid-cols-2 gap-2.5">
            {services.slice(0, 6).map((svc, i) => {
              const fullWidth = services.length % 2 === 1 && i === services.length - 1;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className={`rounded-2xl p-4 transition-all ${fullWidth ? "col-span-2" : ""}`}
                  style={{
                    background: `linear-gradient(180deg, #ffffff 0%, ${accent} 280%)`,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <span
                    className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: accent, color: TEAL_DARK }}
                  >
                    <Sparkles size={16} strokeWidth={2.2} />
                  </span>
                  <h3 className="text-[13.5px] font-extrabold leading-snug" style={{ color: INK }}>
                    {svc.title}
                  </h3>
                  {(svc.description || svc.priceLabel) && (
                    <p className="mt-1 text-[11.5px] leading-snug" style={{ color: INK_SOFT }}>
                      {svc.description}
                      {svc.description && svc.priceLabel ? " · " : ""}
                      {svc.priceLabel && (
                        <span style={{ color: TEAL_DARK, fontWeight: 700 }}>
                          {svc.priceLabel}
                        </span>
                      )}
                    </p>
                  )}
                </ServiceLink>
              );
            })}
          </div>
        </section>
      )}

      {/* STATS BAND — driven by real data */}
      {(() => {
        const statsItems = [
          ...(services.length ? [{ n: String(services.length), l: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ n: String(testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <section className="px-6">
            <div
              className="rounded-[22px] p-5 text-white"
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, ${TEAL_DARK} 100%)`,
                display: "grid",
                gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
                gap: "0.25rem",
              }}
            >
              {statsItems.map((stat) => (
                <div key={stat.l} className="text-center">
                  <div className="text-[20px] font-extrabold leading-none">{stat.n}</div>
                  <div className="mt-1 text-[9.5px] font-semibold opacity-85">{stat.l}</div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* CREDENTIALS — derived from FAQs (Q acts as cert name, A as detail) */}
      {cardData.faqs && cardData.faqs.length > 0 && (
        <section className="px-6 py-7">
          <SectionTitle primary={primary}>{t.credentials}</SectionTitle>
          <div
            className="rounded-[18px] p-5"
            style={{ background: accent, border: `1px solid ${HAIRLINE}` }}
          >
            {cardData.faqs.slice(0, 4).map((cred, i, arr) => (
              <div
                key={`${cred.q}-${i}`}
                className="flex items-start gap-3 py-2.5"
                style={{
                  borderBottom:
                    i === arr.length - 1
                      ? "none"
                      : `1px dashed ${HAIRLINE}`,
                }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: primary }}
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-extrabold" style={{ color: TEAL_DARK }}>
                    {cred.q}
                  </p>
                  <p className="mt-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
                    {cred.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <section className="px-6 pb-2">
          <SectionTitle primary={primary}>{t.patientReview}</SectionTitle>
          <figure
            className="relative rounded-[18px] bg-white p-5"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            <Quote
              size={42}
              strokeWidth={1.4}
              className="absolute right-4 top-3"
              style={{ color: primary, opacity: 0.18 }}
            />
            <div className="mb-2 flex" style={{ color: "#f59e0b" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="text-[13.5px] italic leading-relaxed" style={{ color: INK }}>
              &ldquo;{cardData.testimonials[0].quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[12px] font-extrabold" style={{ color: TEAL_DARK }}>
              — {cardData.testimonials[0].author}
              {cardData.testimonials[0].role && (
                <span className="ml-2 font-normal" style={{ color: INK_SOFT }}>
                  {cardData.testimonials[0].role}
                </span>
              )}
            </figcaption>
          </figure>
        </section>
      )}

      {/* PRIMARY CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="px-6 pt-5">
          <a
            href={
              cardData.bookingUrl ??
              (waDigits ? `https://wa.me/${waDigits}` : "#")
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-2xl px-6 py-[18px] text-[15px] font-extrabold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${TEAL_DARK} 100%)`,
              boxShadow: `0 14px 30px -10px ${primary}59`,
            }}
          >
            <Calendar size={18} strokeWidth={2.2} />
            {t.bookAppointment}
          </a>
        </section>
      )}

      {/* CONTACT ROWS */}
      <section className="px-6 py-7">
        <SectionTitle primary={primary}>{t.contact}</SectionTitle>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </section>

      {/* SAVE / EXCHANGE */}
      <section
        className="mx-6 rounded-3xl bg-white p-5"
        style={{ border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-6 mt-4 rounded-3xl bg-white p-5"
          labelClassName="mb-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section className="px-6 pt-7">
          <SectionTitle primary={primary}>{t.social}</SectionTitle>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
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
// Helpers
// =============================================================================

function ActionTile({
  href,
  label,
  Icon,
  tintBg,
  tintFg,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  tintBg: string;
  tintFg: string;
  external?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white px-2 py-3.5 text-[11.5px] font-extrabold transition-all hover:-translate-y-0.5"
      style={{ border: `1px solid ${HAIRLINE}`, color: INK }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: tintBg, color: tintFg }}
      >
        <Icon size={17} strokeWidth={2.2} />
      </span>
      {label}
    </a>
  );
}

function SectionTitle({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="mb-4 flex items-center gap-2.5 text-[15px] font-extrabold"
      style={{ color: INK }}
    >
      <span
        aria-hidden
        className="block h-[3px] w-6 rounded-full"
        style={{ background: primary }}
      />
      {children}
    </h2>
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
  translations: DnCopy;
}) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <footer
      className="mt-7 px-6 pb-7 pt-6 text-center"
      style={{ borderTop: `1px solid ${HAIRLINE}`, background: SURFACE_PAGE }}
    >
      <div
        className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-white"
        style={{ background: primary }}
      >
        <Stethoscope size={16} strokeWidth={2} />
      </div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: TEAL_DARK }}>
        © {new Date().getFullYear()}
      </p>
      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]"
        style={{ color: INK_SOFT }}
      >
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
        >
          {translations.share}
        </button>
        {impressumUrl && (
          <a href={impressumUrl} target="_blank" rel="noopener noreferrer">
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
            {translations.privacy}
          </a>
        )}
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}>
        <Shield size={11} strokeWidth={1.6} />
        {translations.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="font-extrabold"
          style={{ color: primary }}
        >
          OpSolid
        </a>
      </div>
    </footer>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const dentistEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 22,
  key: "dentist",
  name: "Dentist",
  industry: "Dental clinic / dentist",
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
  sampleSlug: "demo-dentist",
};

// photo: Unsplash — modern dental office. Unsplash License (free, no attribution required).
//        https://unsplash.com/photos/_4iHM8nfaW0
export const dentistSample: SampleData = {
  templateId: 22,
  slug: "demo-dentist",
  cardData: {
    name: "Dr. Burak Yılmaz",
    position: "Diş Hekimi · Implant Uzmanı",
    title: "12 Yıl Klinik Deneyim",
    company: "Estetik Diş Kliniği Berlin",
    email: "burak@estetikdis.de",
    phone: "+49 30 445 6789",
    whatsapp: "+49 175 445 6789",
    website: "https://estetikdis.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "12 yıl klinik deneyim, 3500+ tedavi vakası. Implant ve estetik diş hekimliği uzmanı. ITI sertifikalı implantolog ve Invisalign Provider.",
    bookingUrl: "https://cal.com/estetikdis/intro",
    impressumUrl: "https://estetikdis.de/impressum",
    privacyUrl: "https://estetikdis.de/datenschutz",
    sectorKey: "clinic",
    services: [
      { title: "Implant Tedavisi", description: "800+ başarılı vaka", priceLabel: "€1.200" },
      { title: "Diş Beyazlatma", description: "Tek seansta sonuç", priceLabel: "€350" },
      { title: "Veneer Kaplama", description: "Hollywood smile", priceLabel: "€580" },
      { title: "Invisalign", description: "Şeffaf ortodonti", priceLabel: "€3.900" },
      { title: "Estetik Hekimlik", description: "Kişiye özel planlama", priceLabel: "Konsültasyon" },
    ],
    faqs: [
      { q: "ITI Implant Uzmanlığı", a: "International Team for Implantology — Sertifikalı Uzman, 2018" },
      { q: "Invisalign Certified Provider", a: "Şeffaf plak ortodonti tedavisi sertifikasyonu, 2020" },
      { q: "Estetik Diş Hekimliği", a: "Hollywood smile design ve laminate veneer protokolleri" },
    ],
    testimonials: [
      {
        author: "Hande K.",
        role: "Memnun Hasta · Berlin",
        quote:
          "Dr. Yılmaz sayesinde yıllardır çekimserlik duyduğum implant tedavisini yaptırdım. Ağrısız ve mükemmel sonuç.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/estetikdis.berlin",
      facebook: "https://facebook.com/estetikdis.berlin",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
