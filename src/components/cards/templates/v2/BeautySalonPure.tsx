"use client";

// =============================================================================
// BeautySalonPure — v2 template (id=30, key="beauty-salon-pure").
//
// Sector: beauty studio — PURE variant. Mood: minimalist white + blush, gold
// hairline rules, Cormorant Garamond display + DM Sans body. Inspired by
// kart_13_guzellik_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - Centered eyebrow (studio · city) + ultra-light Cormorant name + gold
//     dot/line divider + role + EST. line.
//   - Avatar row 64 px with gold star rating column.
//   - Centered eyebrow + italic serif sub for sections.
//   - Numbered services list (italic numbers + serif name + accent price).
//   - Stats hairline grid (4 cells).
//   - Pulled quote on blush surface (var(--accent-soft)).
//   - Two CTAs: solid ink + ghost outline.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLocation } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#be185d";
const LOCKED_ACCENT = "#fce7f3";
const GOLD = "#c8a564";
const SURFACE = "#ffffff";
const PAGE = "#fdf6f8";
const INK = "#1a0a13";
const INK_SOFT = "#7a5566";
const HAIRLINE = "#ecd5dd";
const HAIRLINE_SOFT = "#f7e8ed";

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

interface BspCopy {
  premium: string;
  studioLine: string;
  contact: string;
  contactSub: string;
  menu: string;
  menuSub: string;
  studioPhilosophy: string;
  studioPhilosophyQuote: string;
  bookAppointment: string;
  callStudio: string;
  saveContact: string;
  walletLabel: string;
  servicesLabel: string;
  reviewsLabel: string;
  share: string;
  poweredBy: string;
  estYear: string;
  studioLabel: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", BspCopy> = {
  de: {
    premium: "Premium",
    studioLine: "EST. 2018",
    contact: "Kontakt",
    contactSub: "Reach Out",
    menu: "Services",
    menuSub: "The Menu",
    studioPhilosophy: "Studio Philosophy",
    studioPhilosophyQuote: "Beauty is the way you live, not just the way you look.",
    bookAppointment: "Termin sichern",
    callStudio: "Studio anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    servicesLabel: "Leistungen",
    reviewsLabel: "Bewertungen",
    share: "Teilen",
    poweredBy: "Powered by",
    estYear: "© MMXXVI",
    studioLabel: "Studio",
  },
  en: {
    premium: "Premium",
    studioLine: "EST. 2018",
    contact: "Contact",
    contactSub: "Reach Out",
    menu: "Services",
    menuSub: "The Menu",
    studioPhilosophy: "Studio Philosophy",
    studioPhilosophyQuote: "Beauty is the way you live, not just the way you look.",
    bookAppointment: "Book appointment",
    callStudio: "Call studio",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    servicesLabel: "Services",
    reviewsLabel: "Reviews",
    share: "Share",
    poweredBy: "Powered by",
    estYear: "© MMXXVI",
    studioLabel: "Studio",
  },
  tr: {
    premium: "Premium",
    studioLine: "EST. 2018",
    contact: "İletişim",
    contactSub: "Reach Out",
    menu: "Hizmetler",
    menuSub: "The Menu",
    studioPhilosophy: "Studio Philosophy",
    studioPhilosophyQuote: "Beauty is the way you live, not just the way you look.",
    bookAppointment: "Randevu Al",
    callStudio: "Stüdyoyu Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    servicesLabel: "Hizmetler",
    reviewsLabel: "Yorum",
    share: "Paylaş",
    poweredBy: "Powered by",
    estYear: "© MMXXVI",
    studioLabel: "Studio",
  },
  es: {

    premium: "Premium",
    studioLine: "EST. 2018",
    contact: "Contacto",
    contactSub: "Contacta",
    menu: "Servicios",
    menuSub: "La carta",
    studioPhilosophy: "Filosofía del estudio",
    studioPhilosophyQuote: "La belleza es la forma en que vives, no solo la forma en que luces.",
    bookAppointment: "Reservar cita",
    callStudio: "Llamar al estudio",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    servicesLabel: "Servicios",
    reviewsLabel: "Reseñas",
    share: "Compartir",
    poweredBy: "Desarrollado por",
    estYear: "© MMXXVI",
    studioLabel: "Studio",

  },
  it: {

    premium: "Premium",
    studioLine: "EST. 2018",
    contact: "Contatto",
    contactSub: "Contattaci",
    menu: "Servizi",
    menuSub: "Il menù",
    studioPhilosophy: "Filosofia dello studio",
    studioPhilosophyQuote: "La bellezza è il modo in cui vivi, non solo il modo in cui appari.",
    bookAppointment: "Prenota un appuntamento",
    callStudio: "Chiama lo studio",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    servicesLabel: "Servizi",
    reviewsLabel: "Recensioni",
    share: "Condividi",
    poweredBy: "Realizzato con",
    estYear: "© MMXXVI",
    studioLabel: "Studio",

  },
  fr: {

    premium: "Premium",
    studioLine: "EST. 2018",
    contact: "Contact",
    contactSub: "Nous contacter",
    menu: "Services",
    menuSub: "Le menu",
    studioPhilosophy: "Philosophie du studio",
    studioPhilosophyQuote: "La beauté est la façon dont vous vivez, pas seulement la façon dont vous paraissez.",
    bookAppointment: "Prendre rendez-vous",
    callStudio: "Appeler le studio",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    servicesLabel: "Services",
    reviewsLabel: "Avis",
    share: "Partager",
    poweredBy: "Propulsé par",
    estYear: "© MMXXVI",
    studioLabel: "Studio",

  },
  ar: {

    premium: "مميز",
    studioLine: "تأسس 2018",
    contact: "اتصال",
    contactSub: "تواصل",
    menu: "الخدمات",
    menuSub: "القائمة",
    studioPhilosophy: "فلسفة الاستوديو",
    studioPhilosophyQuote: "الجمال هو الطريقة التي تعيش بها، وليس فقط مظهرك.",
    bookAppointment: "حجز موعد",
    callStudio: "اتصل بالاستوديو",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    servicesLabel: "الخدمات",
    reviewsLabel: "التقييمات",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
    estYear: "© MMXXVI",
    studioLabel: "Studio",

  },
};

export function BeautySalonPure({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];

  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const city = resolveLocation(cardData);

  return (
    <article
      data-template="beauty-salon-pure"
      className="bsp-card relative mx-auto w-full max-w-[460px]"
      style={{
        background: SURFACE,
        color: INK,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .bsp-card { line-height: 1.6; }
        .bsp-card a { color: inherit; }
        .bsp-editorial { font-family: var(--tpl-font-display, 'Cormorant Garamond', Georgia, serif); }
      `}</style>

      {/* HEADER */}
      <header
        className="px-10 pb-10 pt-14 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-3 text-[9.5px] font-semibold uppercase tracking-[3px]"
          style={{ color: primary }}
        >
          {[cardData.company, city].filter(Boolean).join(" · ")}
        </div>
        <h1
          className="bsp-editorial text-[56px] font-light leading-[0.95] tracking-[-1.5px]"
          style={{ color: INK }}
        >
          {firstName}{" "}
          {lastName && (
            <strong className="font-semibold italic">{lastName}</strong>
          )}
        </h1>
        <div className="my-5 flex items-center justify-center gap-2.5" aria-hidden>
          <span className="block h-px w-7" style={{ background: GOLD }} />
          <span className="block h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
          <span className="block h-px w-7" style={{ background: GOLD }} />
        </div>
        <div className="text-[12px] tracking-[0.5px]" style={{ color: INK_SOFT }}>
          {cardData.position} {cardData.title && `· ${cardData.title}`}
        </div>
        <div
          className="mt-3 text-[10px] font-semibold uppercase tracking-[2.5px]"
          style={{ color: GOLD }}
        >
          {t.studioLine} · {t.premium}
        </div>
      </header>

      {/* AVATAR ROW */}
      <div
        className="flex items-center gap-4 px-10 py-8"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ background: PAGE, border: `2px solid ${HAIRLINE_SOFT}` }}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt="" width={140} height={140} unoptimized className="h-full w-full object-cover tpl-photo" />
          ) : (
            <span className="text-[14px] font-bold" style={{ color: primary }}>
              {cardData.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div
            className="text-[9.5px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: INK_SOFT }}
          >
            {t.studioLabel}
          </div>
          <div className="bsp-editorial mt-0.5 text-[18px] italic" style={{ color: INK }}>
            {cardData.company}
          </div>
        </div>
        {testimonials.length > 0 && (
          <div className="text-right">
            <div className="text-[12px] tracking-[1px]" style={{ color: GOLD }}>
              ★★★★★
            </div>
            <div
              className="mt-0.5 text-[10.5px] font-semibold tracking-[0.5px]"
              style={{ color: INK_SOFT }}
            >
              {testimonials.length} {t.reviewsLabel}
            </div>
          </div>
        )}
      </div>

      {/* CONTACT */}
      <BspSection title={t.contact} subtitle={t.contactSub} primary={primary}>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </BspSection>

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
              <BspStat key={stat.l} n={stat.n} l={stat.l} last={i === statsItems.length - 1} />
            ))}
          </div>
        );
      })()}

      {/* SERVICES */}
      {services.length > 0 && (
        <BspSection title={t.menu} subtitle={t.menuSub} primary={primary}>
          <div>
            {services.map((s, i) => (
              <ServiceLink
                key={`${s.title}-${i}`}
                href={s.href}
                className={`grid grid-cols-[32px_1fr_auto] items-baseline gap-4 py-4 ${i < services.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <span className="bsp-editorial text-[18px] italic" style={{ color: GOLD }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="bsp-editorial text-[18px] font-semibold leading-tight"
                  style={{ color: INK }}
                >
                  {s.title}
                  {s.description && (
                    <small
                      className="mt-1 block text-[11px] font-medium tracking-[0.4px]"
                      style={{
                        color: INK_SOFT,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}
                    >
                      {s.description}
                    </small>
                  )}
                </span>
                {s.priceLabel && (
                  <span
                    className="text-[13px] font-semibold tabular-nums"
                    style={{ color: primary }}
                  >
                    {s.priceLabel}
                  </span>
                )}
              </ServiceLink>
            ))}
          </div>
        </BspSection>
      )}

      {/* TESTIMONIAL ON BLUSH */}
      {testimonials.length > 0 && (
        <section
          className="px-10 py-11 text-center"
          style={{ borderBottom: `1px solid ${HAIRLINE}`, background: LOCKED_ACCENT }}
        >
          <span
            aria-hidden
            className="mb-3 block font-serif text-[60px] leading-[0.4]"
            style={{ color: GOLD }}
          >
            &ldquo;
          </span>
          <p
            className="bsp-editorial text-[22px] italic leading-[1.4] tracking-[-0.2px]"
            style={{ color: INK }}
          >
            {testimonials[0].quote}
          </p>
          <div
            className="mt-4 text-[10px] font-semibold uppercase tracking-[2px]"
            style={{ color: primary }}
          >
            — {testimonials[0].author}
          </div>
        </section>
      )}

      {/* PHILOSOPHY (fallback if no testimonials) */}
      {testimonials.length === 0 && (
        <section
          className="px-10 py-11 text-center"
          style={{ borderBottom: `1px solid ${HAIRLINE}`, background: LOCKED_ACCENT }}
        >
          <span
            aria-hidden
            className="mb-3 block font-serif text-[60px] leading-[0.4]"
            style={{ color: GOLD }}
          >
            &ldquo;
          </span>
          <p
            className="bsp-editorial text-[22px] italic leading-[1.4]"
            style={{ color: INK }}
          >
            {t.studioPhilosophyQuote}
          </p>
          <div
            className="mt-4 text-[10px] font-semibold uppercase tracking-[2px]"
            style={{ color: primary }}
          >
            — {t.studioPhilosophy}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="px-10 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[12px] font-semibold uppercase tracking-[2px] transition-colors hover:opacity-90"
            style={{ background: INK, color: "#fff" }}
          >
            <span>{t.bookAppointment}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="mt-2.5 flex w-full items-center justify-between px-5 py-[18px] text-[12px] font-semibold uppercase tracking-[2px] transition-colors hover:bg-[#fafafa]"
            style={{
              background: "transparent",
              color: INK,
              border: `1px solid ${INK}`,
            }}
          >
            <span>{t.callStudio}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* SOCIAL */}
      {cardData.socials && (
        <div
          className="px-10 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
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
        className="flex items-center justify-between px-10 py-7 text-[9.5px] font-semibold uppercase tracking-[1.8px]"
        style={{ color: INK_SOFT }}
      >
        <span>{t.estYear}</span>
        <span>{cardData.company}</span>
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

function BspSection({
  title,
  subtitle,
  primary,
  children,
}: {
  title: string;
  subtitle: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="px-10 py-9"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="mb-6 text-center">
        <div
          className="text-[10.5px] font-bold uppercase tracking-[2px]"
          style={{ color: INK }}
        >
          {title}
        </div>
        <p
          className="bsp-editorial mt-1 text-[22px] italic"
          style={{ color: primary }}
        >
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}

function BspStat({ n, l, last }: { n: string; l: string; last?: boolean }) {
  return (
    <div
      className="px-1 py-6 text-center"
      style={{ borderRight: last ? "none" : `1px solid ${HAIRLINE_SOFT}` }}
    >
      <div
        className="bsp-editorial text-[30px] font-light tabular-nums tracking-[-0.5px]"
        style={{ color: INK }}
      >
        {n}
      </div>
      <div
        className="mt-1.5 text-[9px] font-semibold uppercase tracking-[1.5px]"
        style={{ color: INK_SOFT }}
      >
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const beautySalonPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 30,
  key: "beauty-salon-pure",
  name: "Beauty Salon — Pure",
  industry: "Beauty studio (editorial pure variant)",
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
  defaults: { brandPrimaryHex: LOCKED_PRIMARY, brandAccentHex: LOCKED_ACCENT },
  sampleSlug: "demo-beauty-salon-pure",
};

export const beautySalonPureSample: SampleData = {
  templateId: 30,
  slug: "demo-beauty-salon-pure",
  cardData: {
    name: "Buse Arslan",
    position: "Beauty & Lash Artist",
    title: "Permanent Makeup",
    company: "Beauty by Buse",
    phone: "+49 30 558 4422",
    whatsapp: "+49 176 445 2345",
    email: "buse@beautybybuse.de",
    website: "beautybybuse.de",
    address: "Friedrichstr. 67, 10117 Berlin",
    bio: "Premium beauty studio. 7 yıl deneyim · 5.000+ memnun müşteri.",
    services: [
      { title: "Microblading", description: "Kalıcı kaş tasarımı", priceLabel: "€280" },
      { title: "Eyeliner", description: "Kalıcı makyaj", priceLabel: "€220" },
      { title: "Lash Lift & Tint", description: "Volume / classic", priceLabel: "€65" },
      { title: "Hidrafacial", description: "Cilt protokolu", priceLabel: "€85" },
      { title: "Lazer Epilasyon", description: "Diode paketleri", priceLabel: "Paket" },
      { title: "Kaş Laminasyonu", description: "Brow lift", priceLabel: "€55" },
    ],
    testimonials: [
      { author: "Selin K.", quote: "Microblading sonucu inanılmaz doğal duruyor. Buse'nin elinden çıkmış her ayrıntı kusursuz." },
    ],
    socials: {
      instagram: "https://instagram.com/beautybybuse",
      tiktok: "https://tiktok.com/@beautybybuse",
    },
    sectorKey: "salon",
  },
  photoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

