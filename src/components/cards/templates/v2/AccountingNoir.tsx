"use client";

// =============================================================================
// AccountingNoir — v2 template (id=32, key="accounting-noir").
//
// Sector: tax advisor / CPA — NOIR variant. Mood: near-black canvas, gold
// pinstripe accents, hairline gold ornaments, premium private-banking. Inspired
// by kart_14_muhasebe_noir.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: dark gradient with gold radial halo, gold "marker" line of dashes,
//     serif large title "Steuerberatung", uppercase tracked tagline.
//   - Profile: 78 px circle with double gold ring, serif name in white.
//   - Credential GRID 3-up: each cell uses gold serif numeral (years/clients/rating).
//   - Quick actions: small square buttons (Call · WA · Mail) on dark.
//   - Bio with serif italic pulled out word.
//   - Services: hairline list with gold pricing on the right.
//   - Centered editorial pulled quote (testimonial).
//   - CTA: gold solid "Termin vereinbaren" + dark ghost.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  Mail,
  MessageCircle,
  Phone,
  Shield,
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
const BG = "#080c14";
const CARD = "#0f1520";
const PANEL = "#161e2c";
const INK = "#e6edf7";
const INK_SOFT = "#8a96aa";
const HAIRLINE = "rgba(200,169,81,0.18)";
const HAIRLINE_FIRM = "rgba(200,169,81,0.32)";
const HAIRLINE_SOFT = "rgba(255,255,255,0.08)";

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
  return (parts[0][0] ?? "•").toUpperCase() + (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

interface AcnCopy {
  estLine: string;
  steuerberatung: string;
  consultTagline: string;
  call: string;
  whatsapp: string;
  email: string;
  about: string;
  services: string;
  philosophy: string;
  philosophyQuote: string;
  contact: string;
  social: string;
  bookConsult: string;
  callOffice: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
  servicesLabel: string;
  reviewsLabel: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", AcnCopy> = {
  de: {
    estLine: "Steuerberater · Berlin",
    steuerberatung: "Steuerberatung",
    consultTagline: "Diskret · Präzise · Verlässlich",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    about: "Über",
    services: "Leistungen",
    philosophy: "Kanzleiphilosophie",
    philosophyQuote:
      "Steuern verstehen, GmbH gründen, digital arbeiten. Ihr verlässlicher Partner.",
    contact: "Kontakt",
    social: "Folgen",
    bookConsult: "Termin vereinbaren",
    callOffice: "Kanzlei anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
    servicesLabel: "Leistungen",
    reviewsLabel: "Bewertungen",
  },
  en: {
    estLine: "Tax advisor · Berlin",
    steuerberatung: "Tax Practice",
    consultTagline: "Discreet · Precise · Reliable",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    about: "About",
    services: "Services",
    philosophy: "Practice Philosophy",
    philosophyQuote:
      "Understand taxes, found GmbH, work digitally. Your reliable partner.",
    contact: "Contact",
    social: "Follow",
    bookConsult: "Book a meeting",
    callOffice: "Call the office",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
    servicesLabel: "Services",
    reviewsLabel: "Reviews",
  },
  tr: {
    estLine: "Mali Müşavir · Berlin",
    steuerberatung: "Mali Müşavirlik",
    consultTagline: "Diskret · Hassas · Güvenilir",
    call: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    about: "Hakkımda",
    services: "Hizmetler",
    philosophy: "Ofis Felsefesi",
    philosophyQuote:
      "Vergi anlamak, GmbH kurmak, dijital çalışmak. Güvenilir partneriniz.",
    contact: "İletişim",
    social: "Sosyal",
    bookConsult: "Randevu Al",
    callOffice: "Ofisi Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
    servicesLabel: "Hizmetler",
    reviewsLabel: "Yorum",
  },
  es: {

    estLine: "Asesor fiscal · Berlín",
    steuerberatung: "Despacho fiscal",
    consultTagline: "Discreto · Preciso · Confiable",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    about: "Acerca de",
    services: "Servicios",
    philosophy: "Filosofía del despacho",
    philosophyQuote:
      "Understand taxes, found GmbH, work digitally. Your reliable partner.",
    contact: "Contacto",
    social: "Seguir",
    bookConsult: "Reservar una reunión",
    callOffice: "Llamar a la oficina",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    share: "Compartir",
    servicesLabel: "Servicios",
    reviewsLabel: "Reseñas",
  
  },
  it: {

    estLine: "Consulente fiscale · Berlino",
    steuerberatung: "Studio fiscale",
    consultTagline: "Discreto · Preciso · Affidabile",
    call: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    about: "Chi siamo",
    services: "Servizi",
    philosophy: "Filosofia dello studio",
    philosophyQuote:
      "Understand taxes, found GmbH, work digitally. Your reliable partner.",
    contact: "Contatto",
    social: "Segui",
    bookConsult: "Prenota un incontro",
    callOffice: "Chiama l'ufficio",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    impressum: "Impressum",
    privacy: "Privacy",
    share: "Condividi",
    servicesLabel: "Servizi",
    reviewsLabel: "Recensioni",
  
  },
  fr: {

    estLine: "Conseiller fiscal · Berlin",
    steuerberatung: "Cabinet fiscal",
    consultTagline: "Discret · Précis · Fiable",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    about: "À propos",
    services: "Services",
    philosophy: "Philosophie du cabinet",
    philosophyQuote:
      "Understand taxes, found GmbH, work digitally. Your reliable partner.",
    contact: "Contact",
    social: "Suivre",
    bookConsult: "Prendre rendez-vous",
    callOffice: "Appeler le bureau",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    share: "Partager",
    servicesLabel: "Services",
    reviewsLabel: "Avis",
  
  },
  ar: {

    estLine: "مستشار ضريبي · برلين",
    steuerberatung: "ممارسة ضريبية",
    consultTagline: "خاص · دقيق · موثوق",
    call: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    about: "حول",
    services: "الخدمات",
    philosophy: "فلسفة المكتب",
    philosophyQuote:
      "Understand taxes, found GmbH, work digitally. Your reliable partner.",
    contact: "اتصال",
    social: "متابعة",
    bookConsult: "احجز موعداً",
    callOffice: "اتصل بالمكتب",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    share: "مشاركة",
    servicesLabel: "الخدمات",
    reviewsLabel: "التقييمات",
  
  },
};

export function AccountingNoir({
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
  void brandPrimaryHex;
  const accent = brandAccentHex || LOCKED_ACCENT;
  // Use accent for the gold throughout (palette intent of NOIR)
  const gold = accent;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];

  const year = new Date().getFullYear();

  return (
    <article
      data-template="accounting-noir"
      className="acn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: BG,
        color: INK,
      }}
    >
      <style jsx global>{`
        .acn-card {
          font-family: var(--tpl-font-body, "IBM Plex Sans", system-ui, sans-serif);
          line-height: 1.65;
        }
        .acn-card .serif {
          font-family: var(--tpl-font-display, "IBM Plex Serif", Georgia, serif);
        }
        .acn-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 pb-8 pt-10"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, ${gold}33, transparent 60%), linear-gradient(180deg, ${CARD} 0%, ${BG} 100%)`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        {/* Marker line */}
        <div
          className="serif mb-3 flex items-center gap-2.5 text-[10px] font-semibold uppercase"
          style={{ color: gold, letterSpacing: "5px" }}
        >
          <span aria-hidden className="block h-px w-6" style={{ background: `${gold}80` }} />
          <span>{t.estLine}</span>
          <span aria-hidden className="block h-px w-6" style={{ background: `${gold}80` }} />
        </div>
        <h1
          className="serif text-[26px] font-semibold leading-[1.15]"
          style={{ color: "#fff", letterSpacing: "0.3px" }}
        >
          {cardData.company || t.steuerberatung}
        </h1>
        <p
          className="mt-2 text-[12px] uppercase"
          style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "1.5px" }}
        >
          {t.consultTagline}
        </p>
      </header>

      {/* PROFILE */}
      <section
        className="flex items-center gap-4 px-7 py-6"
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          background: `linear-gradient(180deg, ${CARD} 0%, ${BG} 100%)`,
        }}
      >
        <div
          className="relative h-[78px] w-[78px] flex-shrink-0 overflow-hidden rounded-full"
          style={{
            border: `1px solid ${gold}`,
            boxShadow: `0 0 0 4px ${BG}, 0 0 0 5px ${gold}4d`,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="78px"
              unoptimized
              className="object-cover tpl-photo"
              style={{ filter: "contrast(1.05)" }}
            />
          ) : (
            <div
              className="serif flex h-full w-full items-center justify-center text-[24px] font-semibold"
              style={{ background: PANEL, color: gold }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="serif text-[21px] font-semibold leading-tight" style={{ color: "#fff" }}>
            {cardData.name}
          </div>
          {cardData.position && (
            <div
              className="mt-1 text-[12.5px]"
              style={{ color: INK_SOFT, letterSpacing: "0.3px" }}
            >
              {cardData.position}
            </div>
          )}
          {cardData.title && (
            <div
              className="mt-2 text-[10.5px] font-semibold uppercase"
              style={{ color: gold, letterSpacing: "2px" }}
            >
              {cardData.title}
            </div>
          )}
        </div>
      </section>

      {/* CREDENTIAL GRID — driven by real data */}
      {(() => {
        const statsItems = [
          ...(cardData.services?.length ? [{ n: String(cardData.services.length), l: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ n: String(testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <section
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
              gap: 1,
              background: HAIRLINE_SOFT,
            }}
          >
            {statsItems.map((stat) => (
              <div
                key={stat.l}
                className="px-2 py-4 text-center"
                style={{ background: CARD }}
              >
                <div
                  className="serif text-[22px] font-semibold leading-none"
                  style={{ color: gold }}
                >
                  {stat.n}
                </div>
                <div
                  className="mt-1.5 text-[9.5px] font-medium uppercase"
                  style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
                >
                  {stat.l}
                </div>
              </div>
            ))}
          </section>
        );
      })()}

      {/* QUICK ACTIONS */}
      <section
        className="grid grid-cols-3 gap-2 px-7 py-5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {phoneDigits && (
          <NoirAction
            href={`tel:${phoneDigits}`}
            label={t.call}
            Icon={Phone}
            gold={gold}
          />
        )}
        {waDigits && (
          <NoirAction
            href={`https://wa.me/${waDigits}`}
            external
            label={t.whatsapp}
            Icon={MessageCircle}
            gold={gold}
          />
        )}
        {cardData.email && (
          <NoirAction
            href={`mailto:${cardData.email}`}
            label={t.email}
            Icon={Mail}
            gold={gold}
          />
        )}
      </section>

      {/* PHILOSOPHY (replaces bio with editorial framing) */}
      <section
        className="px-7 py-8"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <NoirEyebrow gold={gold}>{t.philosophy}</NoirEyebrow>
        <p
          className="serif mt-4 text-[16px] italic leading-[1.7]"
          style={{ color: INK }}
        >
          &ldquo;{cardData.bio || t.philosophyQuote}&rdquo;
        </p>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section
          className="px-7 py-8"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <NoirEyebrow gold={gold}>{t.services}</NoirEyebrow>
          <div className="mt-4">
            {services.slice(0, 6).map((svc, i, arr) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="grid grid-cols-[28px_1fr_auto] items-baseline gap-3 py-3"
                style={{
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE_SOFT}` : "none",
                }}
              >
                <span
                  className="serif text-[13px] font-semibold"
                  style={{ color: gold, letterSpacing: "0.5px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="serif text-[14px] font-semibold" style={{ color: "#fff" }}>
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <span
                    className="text-[11px] font-semibold uppercase"
                    style={{ color: gold, letterSpacing: "1px" }}
                  >
                    {svc.priceLabel}
                  </span>
                )}
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section
          className="px-7 py-9"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <p
            className="serif text-center text-[18px] italic leading-[1.55] tracking-[-0.2px]"
            style={{ color: "#fff" }}
          >
            &ldquo;{testimonials[0].quote}&rdquo;
          </p>
          <div
            className="mt-5 flex items-center justify-center gap-3 text-[10.5px] font-semibold uppercase"
            style={{ color: gold, letterSpacing: "2.5px" }}
          >
            <span aria-hidden className="block h-px w-6" style={{ background: `${gold}80` }} />
            {testimonials[0].author}
            <span aria-hidden className="block h-px w-6" style={{ background: `${gold}80` }} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="space-y-2.5 px-7 py-8"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-sm px-5 py-[16px] text-[13px] font-semibold transition-all hover:opacity-90"
            style={{
              background: gold,
              color: "#0a1020",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <CalendarCheck size={16} strokeWidth={2.4} />
              {t.bookConsult}
            </span>
            <ArrowRight size={15} strokeWidth={2.4} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="flex w-full items-center justify-between rounded-sm px-5 py-[16px] text-[13px] font-semibold transition-colors"
            style={{
              background: "transparent",
              color: gold,
              border: `1px solid ${HAIRLINE_FIRM}`,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Phone size={16} strokeWidth={2.4} />
              {t.callOffice}
            </span>
            <ArrowRight size={15} strokeWidth={2.4} />
          </a>
        )}
      </section>

      {/* CONTACT */}
      <section
        className="px-7 py-8"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <NoirEyebrow gold={gold}>{t.contact}</NoirEyebrow>
        <div className="mt-4">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={gold} />
        </div>
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section
          className="px-7 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <NoirEyebrow gold={gold}>{t.social}</NoirEyebrow>
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={gold} />
          </div>
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div
          className="px-7 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <WalletDock
            label={t.walletLabel}
            labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[2px] text-center"
          >
            <div style={{ ["--card-primary" as string]: gold }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div
        className="px-7 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={gold} locale={locale} />
        <ExchangeSlot slug={slug} primary={gold} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer className="px-7 py-7 text-center">
        <div
          className="serif text-[12px] font-semibold uppercase"
          style={{ color: gold, letterSpacing: "3px" }}
        >
          {cardData.name}
        </div>
        <div
          className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10.5px]"
          style={{ color: INK_SOFT }}
        >
          <button
            type="button"
            onClick={async () => {
              const url = `${siteUrl}/c/${slug}`;
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
            {t.share}
          </button>
          {cardData.impressumUrl && (
            <a href={cardData.impressumUrl} target="_blank" rel="noopener noreferrer">
              {t.impressum}
            </a>
          )}
          {cardData.privacyUrl && (
            <a href={cardData.privacyUrl} target="_blank" rel="noopener noreferrer">
              {t.privacy}
            </a>
          )}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[10.5px]"
          style={{ color: INK_SOFT }}
        >
          <Shield size={11} strokeWidth={1.6} />
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="serif font-semibold"
            style={{ color: gold }}
          >
            OpSolid
          </a>
          {" · "}© {year}
        </div>
      </footer>
    </article>
  );
}

function NoirEyebrow({
  children,
  gold,
}: {
  children: React.ReactNode;
  gold: string;
}) {
  return (
    <h2
      className="serif flex items-center gap-3 text-[10.5px] font-semibold uppercase"
      style={{ color: gold, letterSpacing: "3px" }}
    >
      <span aria-hidden className="block h-px w-6" style={{ background: `${gold}66` }} />
      {children}
      <span aria-hidden className="block h-px flex-1" style={{ background: `${gold}33` }} />
    </h2>
  );
}

function NoirAction({
  href,
  label,
  Icon,
  external,
  gold,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  external?: boolean;
  gold: string;
}) {
  void readableTextOn;
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-1.5 rounded-sm px-2 py-3 text-[12.5px] font-medium transition-colors"
      style={{
        background: PANEL,
        border: `1px solid ${HAIRLINE}`,
        color: INK,
        letterSpacing: "0.3px",
      }}
    >
      <Icon size={14} strokeWidth={2} style={{ color: gold }} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const accountingNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 32,
  key: "accounting-noir",
  name: "Accounting — Noir",
  industry: "Accounting / tax advisor (noir variant)",
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
  sampleSlug: "demo-accounting-noir",
};

// photo: Unsplash, professional portrait. Unsplash License — free, no attribution required.
export const accountingNoirSample: SampleData = {
  templateId: 32,
  slug: "demo-accounting-noir",
  cardData: {
    name: "Mehmet Şahin",
    position: "Steuerberater · CPA",
    title: "Senior Partner",
    company: "Şahin Steuerberatung",
    email: "mehmet@sahin-steuer.de",
    phone: "+49 30 889 2345",
    whatsapp: "+49 170 889 2345",
    website: "https://sahin-steuer.de",
    address: "Potsdamer Platz 3, 10785 Berlin",
    bio: "Steuern verstehen, GmbH gründen, digital arbeiten. Diskret, präzise und verlässlich seit 15 Jahren.",
    bookingUrl: "https://cal.com/sahin-steuer/intro",
    impressumUrl: "https://sahin-steuer.de/impressum",
    privacyUrl: "https://sahin-steuer.de/datenschutz",
    sectorKey: "consultant",
    services: [
      { title: "Steuererklärung", description: "Privat & Selbständige", priceLabel: "ab €350" },
      { title: "GmbH-Gründung", description: "Komplettpaket inkl. Notar", priceLabel: "€980" },
      { title: "Buchhaltung monatlich", description: "DATEV · digital", priceLabel: "ab €180" },
      { title: "Jahresabschluss", description: "Bilanz · GuV · Anlagen", priceLabel: "ab €1.200" },
    ],
    testimonials: [
      {
        author: "Caroline B.",
        role: "Geschäftsführerin · Berlin",
        quote: "Diskret, präzise und immer erreichbar. Genau das, was man von einer Top-Kanzlei erwartet.",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/mehmet-sahin-steuerberater",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
