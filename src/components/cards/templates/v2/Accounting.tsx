"use client";

// =============================================================================
// Accounting — v2 template (id=31, key="accounting").
//
// Sector: Steuerberater / CPA / tax advisor — DEFAULT variant. Mood: dark navy
// corporate, gold pinstripe accent, IBM-Plex serif. Inspired by
// kart_14_muhasebe.html. Aimed at clients booking a kostenloses Erstgespräch
// for tax / GmbH founding / monthly bookkeeping.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: photographic banner ~200 px on navy with deep navy gradient
//     overlay; gold-uppercase firm marker + serif title + subtle tagline.
//   - Profile: 72 px circle with double gold ring, name in serif navy.
//   - Credential row: 3 hairline pill badges with gold dots.
//   - 3-up actions row (Call · WhatsApp · Email).
//   - Bio paragraph.
//   - Numbered services list with gold serif numerals.
//   - Stats band: 3-up on navy with gold serif numerals + gold top hairline.
//   - Contact table with uppercase tracked labels.
//   - Wide CTA button, gold underline accent.
// =============================================================================

import * as React from "react";
import { linkify } from "@/lib/linkify";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Mail,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Star,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a2b4a";
const LOCKED_ACCENT = "#c8a951";
const PRIMARY_DEEP = "#142142";
const INK = "#0f172a";
const INK_SOFT = "#5b6b7d";
const SURFACE_PAGE = "#f5f5f3";
const HAIRLINE = "#e3e3e0";
const HAIRLINE_FIRM = "#cfcfca";

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return (parts[0][0] ?? "•").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface AcCopy {
  bookConsult: string;
  consultTagline: string;
  call: string;
  whatsapp: string;
  email: string;
  about: string;
  services: string;
  contact: string;
  social: string;
  testimonial: string;
  reliable: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
  servicesLabel: string;
  reviewsLabel: string;
  free: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", AcCopy> = {
  de: {
    bookConsult: "Kostenloses Erstgespräch",
    consultTagline: "Verlässlich · Digital · Persönlich",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    about: "Über uns",
    services: "Leistungen",
    contact: "Kontakt",
    social: "Folgen",
    testimonial: "Mandantenstimme",
    reliable: "Steuerberater · IHK-zertifiziert",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
    servicesLabel: "Leistungen",
    reviewsLabel: "Bewertungen",
    free: "Erstgespräch · gratis",
  },
  en: {
    bookConsult: "Book a free consultation",
    consultTagline: "Reliable · Digital · Personal",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    about: "About",
    services: "Services",
    contact: "Contact",
    social: "Follow",
    testimonial: "Client review",
    reliable: "Tax advisor · IHK-certified",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
    servicesLabel: "Services",
    reviewsLabel: "Reviews",
    free: "First chat · free",
  },
  tr: {
    bookConsult: "Ücretsiz İlk Danışmanlık Talep Et",
    consultTagline: "Güvenilir · Dijital · Kişisel",
    call: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    about: "Hakkımda",
    services: "Hizmetlerim",
    contact: "İletişim",
    social: "Sosyal",
    testimonial: "Müvekkil Yorumu",
    reliable: "Mali Müşavir · IHK Sertifikalı",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
    servicesLabel: "Hizmetler",
    reviewsLabel: "Yorum",
    free: "İlk Görüşme · Ücretsiz",
  },
  es: {

    bookConsult: "Reservar una consulta gratuita",
    consultTagline: "Confiable · Digital · Personal",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    about: "Acerca de",
    services: "Servicios",
    contact: "Contacto",
    social: "Seguir",
    testimonial: "Reseña de cliente",
    reliable: "Asesor fiscal · certificado IHK",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    share: "Compartir",
    servicesLabel: "Servicios",
    reviewsLabel: "Reseñas",
    free: "Primera charla · gratis",
  
  },
  it: {

    bookConsult: "Prenota una consulenza gratuita",
    consultTagline: "Affidabile · Digitale · Personale",
    call: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    about: "Chi siamo",
    services: "Servizi",
    contact: "Contatto",
    social: "Segui",
    testimonial: "Recensione cliente",
    reliable: "Consulente fiscale · certificato IHK",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    impressum: "Impressum",
    privacy: "Privacy",
    share: "Condividi",
    servicesLabel: "Servizi",
    reviewsLabel: "Recensioni",
    free: "Primo colloquio · gratuito",
  
  },
  fr: {

    bookConsult: "Réserver une consultation gratuite",
    consultTagline: "Fiable · Numérique · Personnel",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    about: "À propos",
    services: "Services",
    contact: "Contact",
    social: "Suivre",
    testimonial: "Avis client",
    reliable: "Conseiller fiscal · certifié IHK",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    share: "Partager",
    servicesLabel: "Services",
    reviewsLabel: "Avis",
    free: "Premier échange · gratuit",
  
  },
  ar: {

    bookConsult: "احجز استشارة مجانية",
    consultTagline: "موثوق · رقمي · شخصي",
    call: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    about: "حول",
    services: "الخدمات",
    contact: "اتصال",
    social: "متابعة",
    testimonial: "تقييم العميل",
    reliable: "مستشار ضريبي · معتمد IHK",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    share: "مشاركة",
    servicesLabel: "الخدمات",
    reviewsLabel: "التقييمات",
    free: "أول محادثة · مجانية",
  
  },
};

export function Accounting({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);

  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const onPrimary = readableTextOn(primary);

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];

  const coverUrl = cardData.coverImage
    ? resolveAssetUrl(cardData.coverImage)
    : "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=920&q=80&auto=format&fit=crop";

  const year = new Date().getFullYear();

  return (
    <article
      data-template="accounting"
      className="ac-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: "#ffffff",
        color: INK,
        borderLeft: `1px solid ${HAIRLINE}`,
        borderRight: `1px solid ${HAIRLINE}`,
      }}
    >
      <style jsx global>{`
        .ac-card {
          font-family: var(--tpl-font-body, "IBM Plex Sans", system-ui, sans-serif);
          line-height: 1.6;
        }
        .ac-card .serif {
          font-family: var(--tpl-font-display, "IBM Plex Serif", Georgia, serif);
        }
        .ac-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden"
        style={{ height: 200, background: primary }}
      >
        {coverUrl && (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="460px"
            unoptimized
            className="object-cover opacity-[0.35]"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${primary}80 0%, ${PRIMARY_DEEP}eb 100%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-7" style={{ color: onPrimary }}>
          <div
            className="serif mb-1.5 text-[11px] font-semibold uppercase"
            style={{ color: accent, letterSpacing: "4px" }}
          >
            {cardData.company || cardData.name}
          </div>
          <div className="serif text-[22px] font-semibold leading-tight" style={{ color: onPrimary }}>
            {t.reliable}
          </div>
          <p className="mt-1 text-[12px]" style={{ color: `${onPrimary}c4`, letterSpacing: "0.3px" }}>
            {t.consultTagline}
          </p>
        </div>
      </header>

      {/* PROFILE */}
      <section
        className="flex items-center gap-4 px-7 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="relative flex-shrink-0">
          <div
            className="relative h-[72px] w-[72px] overflow-hidden rounded-full"
            style={{
              border: "2px solid #fff",
              boxShadow: `0 0 0 2px ${accent}, 0 4px 14px rgba(15,23,42,0.14)`,
              background: SURFACE_PAGE,
            }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                fill
                sizes="72px"
                unoptimized
                className="object-cover tpl-photo"
              />
            ) : (
              <div
                className="serif flex h-full w-full items-center justify-center text-[22px] font-semibold"
                style={{ color: primary }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="serif text-[20px] font-semibold leading-tight" style={{ color: primary }}>
            {cardData.name}
          </div>
          {cardData.position && (
            <div className="mt-1 text-[12.5px]" style={{ color: INK_SOFT, letterSpacing: "0.2px" }}>
              {cardData.position}
            </div>
          )}
          {cardData.title && (
            <div
              className="mt-1.5 text-[10.5px] font-semibold uppercase"
              style={{ color: accent, letterSpacing: "1.5px" }}
            >
              {cardData.title}
            </div>
          )}
        </div>
      </section>

      {/* CREDENTIAL BADGES — driven by cardData.services */}
      {(cardData.services?.length ?? 0) > 0 && (
        <section
          className="flex flex-wrap gap-2 px-7 py-5"
          style={{ background: SURFACE_PAGE }}
        >
          {(cardData.services ?? []).slice(0, 6).map((service) => (
            <span
              key={service.title}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-[7px] text-[11.5px] font-semibold"
              style={{
                color: primary,
                border: `1px solid ${HAIRLINE_FIRM}`,
                letterSpacing: "0.3px",
              }}
            >
              <span
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
              />
              {service.title}
            </span>
          ))}
        </section>
      )}

      {/* QUICK ACTIONS */}
      <section
        className="grid grid-cols-3 gap-2.5 px-7 py-5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {phoneDigits && (
          <ActionPill
            href={`tel:${phoneDigits}`}
            label={t.call}
            variant="primary"
            primary={primary}
            primaryDeep={PRIMARY_DEEP}
            accent={accent}
            Icon={Phone}
            onPrimary={onPrimary}
          />
        )}
        {cardData.email && (
          <ActionPill
            href={`mailto:${cardData.email}`}
            label={t.email}
            variant="ghost"
            primary={primary}
            primaryDeep={PRIMARY_DEEP}
            accent={accent}
            Icon={Mail}
            onPrimary={onPrimary}
          />
        )}
        {waDigits && (
          <ActionPill
            href={`https://wa.me/${waDigits}`}
            external
            label={t.whatsapp}
            variant="gold"
            primary={primary}
            primaryDeep={PRIMARY_DEEP}
            accent={accent}
            Icon={MessageCircle}
            onPrimary={onPrimary}
          />
        )}
      </section>

      {/* BIO */}
      {cardData.bio && (
        <section className="px-7 pt-7">
          <SectionTitle accent={accent} primary={primary}>
            {t.about}
          </SectionTitle>
          <p
            className="text-[14px] leading-[1.8]"
            style={{ color: INK_SOFT }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-7 pt-7">
          <SectionTitle accent={accent} primary={primary}>
            {t.services}
          </SectionTitle>
          <div
            className="overflow-hidden rounded-lg"
            style={{ background: SURFACE_PAGE, border: `1px solid ${HAIRLINE}` }}
          >
            {services.slice(0, 6).map((svc, i, arr) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex items-center gap-3.5 px-4 py-3.5"
                style={{
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <span
                  className="serif w-6 flex-shrink-0 text-[16px] font-semibold"
                  style={{ color: accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                    {svc.title}
                  </div>
                  {(svc.description || svc.priceLabel) && (
                    <div
                      className="mt-0.5 text-[11.5px]"
                      style={{ color: INK_SOFT, letterSpacing: "0.2px" }}
                    >
                      {linkify(svc.description)}
                      {svc.description && svc.priceLabel ? " · " : ""}
                      {svc.priceLabel && (
                        <span style={{ color: primary, fontWeight: 700 }}>
                          {svc.priceLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* STATS BAND — driven by real data */}
      {(() => {
        const statsItems = [
          ...(cardData.services?.length ? [{ n: String(cardData.services.length), l: t.servicesLabel }] : []),
          ...(cardData.testimonials?.length ? [{ n: String(cardData.testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <section className="px-7 pt-7">
            <div
              className="relative overflow-hidden rounded-[10px] px-4 py-7"
              style={{
                background: primary,
                display: "grid",
                gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
                gap: "0.75rem",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ background: accent }}
              />
              {statsItems.map((stat) => (
                <div key={stat.l} className="text-center">
                  <div
                    className="serif text-[28px] font-semibold leading-none"
                    style={{ color: accent }}
                  >
                    {stat.n}
                  </div>
                  <div
                    className="mt-1.5 text-[10.5px] font-medium uppercase"
                    style={{ color: `${onPrimary}bf`, letterSpacing: "1px" }}
                  >
                    {stat.l}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* CONTACT TABLE */}
      <section className="px-7 pt-7">
        <SectionTitle accent={accent} primary={primary}>
          {t.contact}
        </SectionTitle>
        <div
          className="overflow-hidden rounded-lg"
          style={{ background: SURFACE_PAGE, border: `1px solid ${HAIRLINE}` }}
        >
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
        </div>
      </section>

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="px-7 pt-7">
          <SectionTitle accent={accent} primary={primary}>
            {t.testimonial}
          </SectionTitle>
          <figure
            className="relative rounded-lg p-5"
            style={{ background: SURFACE_PAGE, border: `1px solid ${HAIRLINE}` }}
          >
            <Quote
              size={36}
              strokeWidth={1.4}
              className="absolute right-4 top-3"
              style={{ color: accent, opacity: 0.4 }}
            />
            <div className="mb-2 flex" style={{ color: accent }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="text-[13.5px] italic leading-relaxed" style={{ color: INK }}>
              &ldquo;{testimonials[0].quote}&rdquo;
            </blockquote>
            <figcaption
              className="serif mt-3 text-[12px] font-semibold"
              style={{ color: primary }}
            >
              — {testimonials[0].author}
              {testimonials[0].role && (
                <span className="ml-2 font-normal" style={{ color: INK_SOFT }}>
                  {testimonials[0].role}
                </span>
              )}
            </figcaption>
          </figure>
        </section>
      )}

      {/* CTA */}
      <section className="px-7 pt-7">
        <a
          href={
            cardData.bookingUrl ||
            (waDigits
              ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookConsult)}`
              : `mailto:${cardData.email ?? ""}`)
          }
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center gap-2.5 overflow-hidden rounded-lg px-5 py-[16px] text-[14.5px] font-semibold transition-all hover:-translate-y-0.5"
          style={{
            background: primary,
            color: onPrimary,
            boxShadow: "0 4px 16px rgba(15,23,42,0.14)",
            letterSpacing: "0.3px",
          }}
        >
          <Calendar size={17} strokeWidth={2.2} />
          {t.bookConsult}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px]"
            style={{ background: accent }}
          />
        </a>
        <p
          className="mt-2.5 text-center text-[10.5px] font-medium uppercase"
          style={{ color: INK_SOFT, letterSpacing: "1.4px" }}
        >
          {t.free}
        </p>
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section className="px-7 pt-7">
          <SectionTitle accent={accent} primary={primary}>
            {t.social}
          </SectionTitle>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-7 mt-7 rounded-2xl bg-white p-5"
        style={{ border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-7 mt-4 rounded-2xl bg-white p-5"
          labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        translations={t}
        company={cardData.company || cardData.name}
        year={year}
      />
    </article>
  );
}

function SectionTitle({
  accent,
  primary,
  children,
}: {
  accent: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className="serif mb-4 flex items-center gap-3 text-[17px] font-semibold"
      style={{ color: primary }}
    >
      <span
        aria-hidden
        className="block h-[2px] w-7 rounded-full"
        style={{ background: accent }}
      />
      {children}
    </h2>
  );
}

function ActionPill({
  href,
  label,
  Icon,
  variant,
  external,
  primary,
  primaryDeep,
  accent,
  onPrimary,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  variant: "primary" | "ghost" | "gold";
  external?: boolean;
  primary: string;
  primaryDeep: string;
  accent: string;
  onPrimary: string;
}) {
  void primaryDeep;
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  const styleByVariant: React.CSSProperties =
    variant === "primary"
      ? { background: primary, color: onPrimary }
      : variant === "gold"
      ? { background: accent, color: "#fff" }
      : {
          background: "#fff",
          color: primary,
          border: `1px solid ${HAIRLINE_FIRM}`,
        };
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
      style={{ ...styleByVariant, letterSpacing: "0.2px" }}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </a>
  );
}

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  onPrimary,
  translations,
  company,
  year,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  translations: AcCopy;
  company: string;
  year: number;
}) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <footer
      className="mt-7 px-7 py-6 text-center"
      style={{ background: primary, borderTop: `3px solid ${accent}` }}
    >
      <div
        className="serif text-[13px] font-semibold"
        style={{ color: accent, letterSpacing: "0.5px" }}
      >
        {company}
      </div>
      <div
        className="mt-1 text-[10.5px]"
        style={{ color: `${onPrimary}80`, letterSpacing: "0.5px" }}
      >
        © {year} · {translations.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accent }}
          className="font-semibold"
        >
          OpSolid
        </a>
      </div>
      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px]"
        style={{ color: `${onPrimary}b0` }}
      >
        <button
          type="button"
          onClick={async () => {
            if (typeof navigator !== "undefined" && "share" in navigator) {
              try {
                await navigator.share({ url, title: "Smart Card" });
                return;
              } catch {
                /* ignore */
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
        <span className="inline-flex items-center gap-1">
          <Shield size={11} strokeWidth={1.6} />
          <ArrowRight size={11} strokeWidth={1.6} />
        </span>
      </div>
    </footer>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const accountingEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 31,
  key: "accounting",
  name: "Accounting",
  industry: "Accounting / tax advisor / CPA",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
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
  sampleSlug: "demo-accounting",
};

// photo: Unsplash, Tax/finance professional. Unsplash License — free, no attribution.
export const accountingSample: SampleData = {
  templateId: 31,
  slug: "demo-accounting",
  cardData: {
    name: "Mehmet Şahin",
    position: "Steuerberater · Mali Müşavir",
    title: "GmbH & Steuerexperte",
    company: "Şahin Steuerberatung",
    email: "mehmet@sahin-steuer.de",
    phone: "+49 30 889 2345",
    whatsapp: "+49 170 889 2345",
    website: "https://sahin-steuer.de",
    address: "Potsdamer Platz 3, 10785 Berlin",
    bio: "Ihr verlässlicher Partner für Steuern, GmbH-Gründung und digitale Buchhaltung. Erstgespräch kostenlos. 200+ zufriedene Mandanten in Berlin und Brandenburg.",
    bookingUrl: "https://cal.com/sahin-steuer/intro",
    impressumUrl: "https://sahin-steuer.de/impressum",
    privacyUrl: "https://sahin-steuer.de/datenschutz",
    sectorKey: "consultant",
    services: [
      { title: "Steuererklärung", description: "Privat & Selbständige", priceLabel: "ab €350" },
      { title: "GmbH-Gründung", description: "Komplettpaket inkl. Notar", priceLabel: "€980" },
      { title: "Buchhaltung monatlich", description: "Digital, papierlos, DATEV", priceLabel: "ab €180" },
      { title: "Lohnbuchhaltung", description: "Monatliche Abrechnung", priceLabel: "ab €120" },
      { title: "Jahresabschluss", description: "Bilanz · GuV · Anlagen", priceLabel: "ab €1.200" },
    ],
    testimonials: [
      {
        author: "Caroline B.",
        role: "Geschäftsführerin · Berlin Startup",
        quote:
          "Herr Şahin hat mir bei der GmbH-Gründung enorm geholfen. Schnell, transparent und freundlich. Klare Empfehlung.",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/mehmet-sahin-steuerberater",
      xing: "https://xing.com/profile/mehmet_sahin",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
