"use client";

// =============================================================================
// BarberNoir — v2 template (id=76, key="barber-noir").
//
// Sector: Barber / Men's grooming — NOIR variant. Mood: Mayfair luxury barber,
// near-black surfaces, vintage gold + burgundy stripe ornaments, Bebas Neue
// display + Cormorant Garamond italic. Inspired by kart_07_berber_noir.html.
//
// Design DNA (different from Barber.tsx id=7, BarberPure/Vivid/Stone):
//   - Repeating gold/red/cream stripe band at top and bottom of card.
//   - Centred "EST." italic eyebrow with hairline rule + Bebas Neue mega name
//     (gold second word).
//   - Profile band on raised panel: 80px gold-gradient avatar + role + city.
//   - 3-cell vintage stat strip with Bebas digits + lowercase italic labels.
//   - Service list with featured row gold-tinted left border.
//   - Quote block with gold L-corners, oversized italic quote-mark.
//   - Vertical CTA stack with gold outline button (slide-in fill on hover).
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#c8a951";
const SURFACE = "#0a0805";
const SURFACE_2 = "#141008";
const SURFACE_3 = "#1f1a10";
const RED = "#8b1a1a";
const TEXT = "#f0ede8";
const TEXT_SOFT = "#a09080";
const TEXT_DIM = "#5e5448";
const LINE_SOFT = "rgba(255,255,255,0.06)";

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
  estPrefix: string;
  taglineFallback: string;
  yearsLabel: string;
  clientsLabel: string;
  followersLabel: string;
  servicesEyebrow: string;
  servicesH: string;
  servicesSub: string;
  contactEyebrow: string;
  contactH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  hoursH: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    estPrefix: "Est.",
    taglineFallback: "Master Barber & Stylist",
    yearsLabel: "jahre",
    clientsLabel: "kunden",
    followersLabel: "follower",
    servicesEyebrow: "— Menü —",
    servicesH: "Leistungen",
    servicesSub: "Klassische & moderne Herrenpflege",
    contactEyebrow: "— Kontakt —",
    contactH: "Termin & Kontakt",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    hoursH: "Öffnungszeiten",
  },
  en: {
    estPrefix: "Est.",
    taglineFallback: "Master Barber & Stylist",
    yearsLabel: "years",
    clientsLabel: "clients",
    followersLabel: "followers",
    servicesEyebrow: "— Menu —",
    servicesH: "Services",
    servicesSub: "Classic & modern grooming",
    contactEyebrow: "— Contact —",
    contactH: "Book & Contact",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    hoursH: "Hours",
  },
  tr: {
    estPrefix: "Est.",
    taglineFallback: "Master Berber & Stylist",
    yearsLabel: "yıl",
    clientsLabel: "müşteri",
    followersLabel: "takipçi",
    servicesEyebrow: "— Menü —",
    servicesH: "Hizmetler",
    servicesSub: "Klasik & modern erkek bakımı",
    contactEyebrow: "— İletişim —",
    contactH: "Randevu & İletişim",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    hoursH: "Çalışma Saatleri",
  },
  es: {

    estPrefix: "Est.",
    taglineFallback: "Maestro barbero y estilista",
    yearsLabel: "años",
    clientsLabel: "clientes",
    followersLabel: "seguidores",
    servicesEyebrow: "— Menu —",
    servicesH: "Servicios",
    servicesSub: "Arreglo clásico y moderno",
    contactEyebrow: "— Contact —",
    contactH: "Reservar y contactar",
    bookBtn: "Reservar cita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    hoursH: "Horario",
  
  },
  it: {

    estPrefix: "Est.",
    taglineFallback: "Master Barber e Stylist",
    yearsLabel: "anni",
    clientsLabel: "clienti",
    followersLabel: "follower",
    servicesEyebrow: "— Menu —",
    servicesH: "Servizi",
    servicesSub: "Grooming classico e moderno",
    contactEyebrow: "— Contact —",
    contactH: "Prenota e contatta",
    bookBtn: "Prenota un appuntamento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    hoursH: "Orari",
  
  },
  fr: {

    estPrefix: "Est.",
    taglineFallback: "Maître barbier et styliste",
    yearsLabel: "ans",
    clientsLabel: "clients",
    followersLabel: "abonnés",
    servicesEyebrow: "— Menu —",
    servicesH: "Services",
    servicesSub: "Soins classiques et modernes",
    contactEyebrow: "— Contact —",
    contactH: "Réserver et contacter",
    bookBtn: "Prendre rendez-vous",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    hoursH: "Horaires",
  
  },
  ar: {

    estPrefix: "تأسس",
    taglineFallback: "حلاق رئيسي ومصفف",
    yearsLabel: "سنة",
    clientsLabel: "عملاء",
    followersLabel: "متابعون",
    servicesEyebrow: "— Menu —",
    servicesH: "الخدمات",
    servicesSub: "عناية كلاسيكية وحديثة",
    contactEyebrow: "— Contact —",
    contactH: "احجز واتصل",
    bookBtn: "حجز موعد",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    hoursH: "ساعات العمل",
  
  },
};

export function BarberNoir({
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
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  const Stripe = ({ thin = false }: { thin?: boolean }) => (
    <div
      aria-hidden
      style={{
        height: thin ? 3 : 6,
        background: thin
          ? `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`
          : `repeating-linear-gradient(90deg, ${accent} 0 12px, ${RED} 12px 24px, ${TEXT} 24px 36px)`,
      }}
    />
  );

  return (
    <article
      data-template="barber-noir"
      className="barber-noir-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .barber-noir-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .barber-noir-card .display {
          font-family: var(--tpl-font-display, 'Bebas Neue', 'Oswald', 'Inter', sans-serif);
        }
        .barber-noir-card .serif {
          font-family: var(--tpl-font-display, 'Cormorant Garamond', 'Playfair Display', serif);
        }
        .barber-noir-card a { color: inherit; }
      `}</style>

      <Stripe />

      {/* HEADER */}
      <header
        className="px-7 pt-12 pb-9 text-center"
        style={{ background: SURFACE_2, borderBottom: `1px solid ${LINE_SOFT}` }}
      >
        <div
          className="serif relative mb-3.5 inline-block pb-2.5 italic"
          style={{
            color: accent,
            fontSize: 13,
            letterSpacing: "3px",
          }}
        >
          {`— ${t.estPrefix} ${new Date().getFullYear() - 14}${
            cityFromAddress ? ` · ${cityFromAddress}` : ""
          } —`}
          <span
            aria-hidden
            className="absolute left-1/2 bottom-0 -translate-x-1/2"
            style={{ width: 36, height: 1, background: accent }}
          />
        </div>
        <h1
          className="display"
          style={{
            fontWeight: 400,
            fontSize: "clamp(48px, 14vw, 64px)",
            lineHeight: 0.9,
            letterSpacing: "2px",
            color: TEXT,
            marginBottom: 6,
          }}
        >
          {nameFirst.toUpperCase()}
          {nameLast && (
            <span
              className="block"
              style={{ color: accent, fontSize: "inherit" }}
            >
              {nameLast.toUpperCase()}
            </span>
          )}
        </h1>
        <div
          className="serif italic"
          style={{
            fontSize: 15,
            color: TEXT_SOFT,
            marginTop: 14,
            letterSpacing: "0.5px",
          }}
        >
          {cardData.title || cardData.position || t.taglineFallback}
        </div>
        <div
          aria-hidden
          className="mt-4"
          style={{ color: accent, fontSize: 14, letterSpacing: "8px" }}
        >
          âœ¦ âœ¦ âœ¦
        </div>
      </header>

      <Stripe />

      {/* PROFILE BAND */}
      <section
        className="grid items-center gap-[18px] px-7 py-6"
        style={{
          background: SURFACE_3,
          borderBottom: `1px solid ${LINE_SOFT}`,
          gridTemplateColumns: "80px 1fr",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            padding: 3,
            background: `linear-gradient(135deg, ${accent} 0%, ${RED} 100%)`,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={74}
              height={74}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{
                border: `2px solid ${SURFACE_3}`,
                filter: "saturate(0.75) contrast(1.1)",
              }}
            />
          ) : (
            <div
              className="display flex h-full w-full items-center justify-center rounded-full"
              style={{
                background: SURFACE_2,
                color: accent,
                border: `2px solid ${SURFACE_3}`,
                fontSize: 26,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div
            className="serif italic mb-1"
            style={{ fontSize: 13, color: accent, letterSpacing: "1px" }}
          >
            {cardData.position || t.taglineFallback}
          </div>
          <div
            className="display truncate mb-1.5"
            style={{
              fontSize: 22,
              letterSpacing: "2px",
              color: TEXT,
              lineHeight: 1.1,
            }}
          >
            {cardData.company || cardData.name}
          </div>
          {cityFromAddress && (
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                color: TEXT_SOFT,
                letterSpacing: "2.5px",
                fontWeight: 400,
              }}
            >
              {cityFromAddress}
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <div
        className="grid grid-cols-3 px-7 pt-9 pb-9"
        style={{ borderBottom: `1px solid ${LINE_SOFT}` }}
      >
        {[
          { num: "15", label: t.yearsLabel },
          { num: "5K+", label: t.clientsLabel },
          { num: "32K", label: t.followersLabel },
        ].map((s, i) => (
          <div
            key={i}
            className="px-2 text-center"
            style={{ borderRight: i < 2 ? `1px solid ${LINE_SOFT}` : "none" }}
          >
            <div
              className="display"
              style={{ fontSize: 42, color: accent, lineHeight: 1, letterSpacing: "1px" }}
            >
              {s.num}
            </div>
            <div
              className="serif italic mt-1.5 lowercase"
              style={{ fontSize: 11, color: TEXT_SOFT, letterSpacing: "1.5px" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* BIO */}
      {cardData.bio && (
        <section className="px-7 pt-9 pb-2 text-center">
          <p
            className="serif italic"
            style={{ fontSize: 16, lineHeight: 1.65, color: TEXT, letterSpacing: "0.3px" }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <>
          <section className="px-7 pt-9">
            <SectHead
              tag={t.servicesEyebrow}
              title={t.servicesH}
              sub={t.servicesSub}
              accent={accent}
            />
          </section>
          <div
            className="mt-3"
            style={{
              background: SURFACE_3,
              borderTop: `1px solid ${accent}33`,
              borderBottom: `1px solid ${accent}33`,
            }}
          >
            {services.map((svc, i) => {
              const featured = i === services.length - 1 && services.length > 2;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex items-baseline px-6 py-4"
                  style={{
                    borderBottom:
                      i < services.length - 1 ? `1px dashed ${LINE_SOFT}` : "none",
                    background: featured
                      ? `linear-gradient(90deg, ${accent}14 0%, transparent 100%)`
                      : "transparent",
                    borderLeft: featured ? `3px solid ${accent}` : "none",
                    paddingLeft: featured ? 21 : 24,
                  }}
                >
                  <span
                    className="serif"
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: featured ? accent : TEXT,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {svc.title}
                  </span>
                  <span
                    aria-hidden
                    className="mx-3 flex-1"
                    style={{
                      borderBottom: `1px dotted ${TEXT_DIM}`,
                      alignSelf: "center",
                      marginBottom: 5,
                    }}
                  />
                  {svc.priceLabel && (
                    <span
                      className="display"
                      style={{
                        fontSize: featured ? 22 : 20,
                        color: accent,
                        letterSpacing: "1px",
                      }}
                    >
                      {svc.priceLabel}
                    </span>
                  )}
                </ServiceLink>
              );
            })}
          </div>
        </>
      )}

      {/* QUOTE / TESTIMONIAL */}
      {cardData.bio && (
        <section
          className="relative mx-7 mt-9 px-7 pt-9 pb-7 text-center"
          style={{ background: SURFACE_3, border: `1px solid ${accent}33` }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              width: 24,
              height: 24,
              borderTop: `1px solid ${accent}`,
              borderLeft: `1px solid ${accent}`,
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: -1,
              right: -1,
              width: 24,
              height: 24,
              borderBottom: `1px solid ${accent}`,
              borderRight: `1px solid ${accent}`,
            }}
          />
          <div
            className="serif italic mb-2"
            style={{ fontSize: 48, color: accent, lineHeight: 1 }}
          >
            “
          </div>
          <p
            className="serif italic"
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: TEXT,
              marginBottom: 14,
            }}
          >
            {cardData.bio}
          </p>
          <cite
            className="not-italic uppercase"
            style={{
              fontSize: 10.5,
              fontWeight: 400,
              letterSpacing: "3px",
              color: accent,
            }}
          >
            — {cardData.name}
          </cite>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-7 pt-9">
        <SectHead
          tag={t.contactEyebrow}
          title={t.contactH}
          accent={accent}
        />
      </section>
      <section
        className="px-7 pt-2 pb-7"
        style={{ borderBottom: `1px solid ${LINE_SOFT}` }}
      >
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
        />
      </section>

      {/* CTA STACK */}
      <section className="px-7 pt-9">
        <div className="flex flex-col gap-3">
          {(cardData.bookingUrl || waDigits) && (
            <a
              href={
                cardData.bookingUrl ||
                `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="display flex items-center justify-center px-6 py-4 uppercase"
              style={{
                background: "transparent",
                color: accent,
                border: `1.5px solid ${accent}`,
                fontSize: 16,
                letterSpacing: "3px",
              }}
            >
              {t.bookBtn}
            </a>
          )}
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="display flex items-center justify-center px-6 py-4 uppercase"
              style={{
                background: SURFACE_2,
                color: TEXT,
                border: `1.5px solid ${LINE_SOFT}`,
                fontSize: 14,
                letterSpacing: "3px",
              }}
            >
              {cardData.email}
            </a>
          )}
        </div>
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={accent} />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-9 px-7 py-7"
        style={{
          background: SURFACE_2,
          borderTop: `1px solid ${LINE_SOFT}`,
          borderBottom: `1px solid ${LINE_SOFT}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              color: TEXT,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="serif italic px-7 py-7 text-center"
        style={{ fontSize: 13, color: TEXT_SOFT, letterSpacing: "0.5px" }}
      >
        {cardData.company || cardData.name}{" "}
        <span style={{ color: accent, margin: "0 8px" }}>âœ¦</span>{" "}
        {new Date().getFullYear()}
        {cityFromAddress && (
          <>
            {" "}
            <span style={{ color: accent, margin: "0 8px" }}>âœ¦</span> {cityFromAddress}
          </>
        )}
        <div className="mt-2" style={{ color: TEXT_DIM }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </div>
      </footer>

      <Stripe />
    </article>
  );
}

function SectHead({
  tag,
  title,
  sub,
  accent,
}: {
  tag: string;
  title: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="text-center">
      <div
        className="uppercase"
        style={{
          fontSize: 10.5,
          letterSpacing: "4px",
          color: accent,
          marginBottom: 6,
          fontWeight: 400,
        }}
      >
        {tag}
      </div>
      <h2
        className="display"
        style={{
          fontSize: 30,
          letterSpacing: "2.5px",
          marginBottom: sub ? 6 : 0,
          color: TEXT,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="serif italic"
          style={{ fontSize: 13, color: TEXT_SOFT, marginBottom: 18 }}
        >
          {sub}
          <span
            aria-hidden
            style={{
              display: "block",
              width: 36,
              height: 1,
              background: accent,
              margin: "14px auto 0",
            }}
          />
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const barberNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 76,
  key: "barber-noir",
  name: "Barber — Noir",
  industry: "Barber / Mayfair luxury barbershop",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-barber-noir",
};

// photo: Unsplash, https://unsplash.com/photos/jqe5lY4ROMQ — Free, no attribution required.
export const barberNoirSample: SampleData = {
  templateId: 76,
  slug: "demo-barber-noir",
  cardData: {
    name: "Tarkan Arslan",
    position: "Master Barber & Inhaber",
    title: "Master Barber & Inhaber",
    company: "TA Barbershop Berlin",
    email: "tarkan@tabarbershop.de",
    phone: "+49 176 223 4568",
    whatsapp: "+49 176 223 4568",
    website: "tabarbershop.de",
    address: "Friedrichstraße 88, 10117 Berlin",
    bio: "Master Barber seit 15 Jahren. Klassischer Herrenschnitt, Heißrasur, Premium Fades. Termine online.",
    bookingUrl: "https://cal.com/tabarbershop/booking",
    impressumUrl: "https://tabarbershop.de/impressum",
    privacyUrl: "https://tabarbershop.de/datenschutz",
    sectorKey: "salon",
    socials: {
      instagram: "https://instagram.com/ta.barbershop",
    },
    services: [
      { title: "Premium Haarschnitt", description: "Beratung, Schnitt, Styling.", priceLabel: "â‚¬35" },
      { title: "Heißrasur", description: "Klassische Rasur mit heißem Tuch.", priceLabel: "â‚¬28" },
      { title: "Kombination", description: "Schnitt + Heißrasur in einem Termin.", priceLabel: "â‚¬55" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

