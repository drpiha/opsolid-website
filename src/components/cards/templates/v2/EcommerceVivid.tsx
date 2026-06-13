"use client";

// =============================================================================
// EcommerceVivid — v2 template (id=83, key="ecommerce-vivid").
//
// Sector: E-commerce / Online boutique — VIVID variant. Mood: bold gradient
// hero, energetic D2C brand, Bebas Neue + Poppins. Inspired by
// kart_08_eticaret_vivid.html.
//
// Design DNA (different from default Ecommerce, EcommerceNoir/Pure):
//   - 3-stop violet→pink→peach gradient hero with rating pill + Bebas mega
//     lockup + tracked uppercase tagline.
//   - Floating profile card (-72 mt) with 72px gold-ring avatar + accent role
//     + 2x2 mini-stat tile grid.
//   - Section title with accent gradient bar pre-text + Bebas 32px + indented
//     muted sub.
//   - Category 2-col grid with rounded cards, icon-on-gradient block + hover
//     shadow + featured row spans 2 cols (21:9).
//   - Big gradient CTA button with shadow lift + 2-col mini icon CTA row.
//   - Social pills 3-col with circular gradient icon chips.
//   - Hero-gradient QR section card.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveStats, resolveTagline, resolveLocation } from "./shared/profileExtras";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#7c3aed";
const LOCKED_ACCENT = "#f97316";
const SURFACE = "#ffffff";
const PAGE = "#fff8f3";
const ACCENT_RED = "#ff6b6b";
const ACCENT_YELLOW = "#ffd93d";
const ACCENT_GREEN = "#6bcb77";
const TEXT = "#2a1a1a";
const TEXT_2 = "#553c3c";
const MUTED = "#8a7373";
const LINE = "#f3e6dd";

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
  reviewsLabel: string;
  collectionH: string;
  collectionSub: string;
  bookBtn: string;
  emailLabel: string;
  phoneLabel: string;
  qrLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    reviewsLabel: "Bewertungen",
    collectionH: "Kollektion",
    collectionSub: "Sezonun parçaları",
    bookBtn: "Sofort bestellen",
    emailLabel: "E-Mail",
    phoneLabel: "Telefon",
    qrLabel: "Zur Kollektion",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    reviewsLabel: "Reviews",
    collectionH: "Collection",
    collectionSub: "This season's pieces",
    bookBtn: "Order now",
    emailLabel: "Email",
    phoneLabel: "Phone",
    qrLabel: "Browse collection",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    reviewsLabel: "Yorum",
    collectionH: "Koleksiyon",
    collectionSub: "Sezonun parçaları",
    bookBtn: "Hemen Sipariş Ver",
    emailLabel: "E-posta",
    phoneLabel: "Telefon",
    qrLabel: "Koleksiyona Göz At",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    reviewsLabel: "Reseñas",
    collectionH: "Colección",
    collectionSub: "Las piezas de esta temporada",
    bookBtn: "Pedir ahora",
    emailLabel: "Correo",
    phoneLabel: "Teléfono",
    qrLabel: "Explorar la colección",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    reviewsLabel: "Recensioni",
    collectionH: "Collezione",
    collectionSub: "I pezzi di questa stagione",
    bookBtn: "Ordina ora",
    emailLabel: "Email",
    phoneLabel: "Telefono",
    qrLabel: "Sfoglia la collezione",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    reviewsLabel: "Avis",
    collectionH: "Collection",
    collectionSub: "Les pièces de cette saison",
    bookBtn: "Commander",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone",
    qrLabel: "Explorer la collection",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    reviewsLabel: "التقييمات",
    collectionH: "مجموعة",
    collectionSub: "قطع هذا الموسم",
    bookBtn: "اطلب الآن",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "هاتف",
    qrLabel: "تصفح المجموعة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function EcommerceVivid({
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
  const testimonials = cardData.testimonials ?? [];
  const stats = resolveStats(cardData.stats);
  const tagline = resolveTagline(cardData);
  const locationLabel = resolveLocation(cardData);
  const nameParts = (cardData.company || cardData.name).trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  const heroGrad = `linear-gradient(135deg, ${primary} 0%, ${ACCENT_RED} 50%, ${accent} 100%)`;
  const ctaGrad = `linear-gradient(135deg, ${ACCENT_RED}, #fb7185)`;
  const accentBars = `linear-gradient(90deg, ${ACCENT_RED}, ${ACCENT_YELLOW})`;
  const tileBgs = [
    `linear-gradient(135deg, ${ACCENT_RED}, ${ACCENT_YELLOW})`,
    `linear-gradient(135deg, ${ACCENT_GREEN}, #4ecdc4)`,
    `linear-gradient(135deg, #a78bfa, ${ACCENT_RED})`,
    `linear-gradient(135deg, ${ACCENT_YELLOW}, ${ACCENT_GREEN})`,
    `linear-gradient(135deg, #fb7185, #a78bfa)`,
  ];

  return (
    <article
      data-template="ecommerce-vivid"
      className="ecommerce-vivid-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .ecommerce-vivid-card {
          font-family: var(--tpl-font-body, 'Poppins', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .ecommerce-vivid-card .display {
          font-family: var(--tpl-font-display, 'Bebas Neue', 'Oswald', system-ui, sans-serif);
        }
        .ecommerce-vivid-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-6 pt-12 pb-24"
        style={{ background: heroGrad }}
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(300px 200px at 80% 30%, rgba(255,255,255,0.3), transparent 60%), radial-gradient(200px 150px at 20% 70%, rgba(255,255,255,0.2), transparent 60%)`,
            pointerEvents: "none",
          }}
        />
        {testimonials.length > 0 && (
          <span
            className="relative inline-flex items-center gap-2 rounded-full"
            style={{
              padding: "8px 14px",
              background: "rgba(255,255,255,0.85)",
              fontSize: 11,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ color: ACCENT_RED, fontSize: 14 }}>★</span>
            {testimonials.length} {t.reviewsLabel}
          </span>
        )}
        <h1
          className="display relative"
          style={{
            fontSize: "clamp(64px, 18vw, 108px)",
            lineHeight: 0.85,
            letterSpacing: "2px",
            color: "#fff",
            textShadow: "0 4px 24px rgba(0,0,0,0.15)",
            marginBottom: 8,
          }}
        >
          {nameFirst}
          {nameLast && (
            <span
              className="block"
              style={{ fontSize: "0.7em", color: "rgba(255,255,255,0.95)" }}
            >
              {nameLast}
            </span>
          )}
        </h1>
        {tagline && (
          <div
            className="relative uppercase"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.95)",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            {tagline}
          </div>
        )}
      </section>

      {/* FLOATING PROFILE CARD */}
      <section
        className="relative z-20 mx-4 rounded-3xl px-6 py-6"
        style={{
          background: SURFACE,
          marginTop: -72,
          boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="flex items-center gap-3.5 pb-4.5"
          style={{ borderBottom: `1px solid ${LINE}`, paddingBottom: 18 }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: `3px solid ${ACCENT_YELLOW}`,
              boxShadow: `0 6px 18px ${ACCENT_RED}40`,
            }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={cardData.name}
                width={66}
                height={66}
                unoptimized
                className="block h-full w-full object-cover tpl-photo"
              />
            ) : (
              <div
                className="display flex h-full w-full items-center justify-center"
                style={{ background: ACCENT_RED, color: "#fff", fontSize: 30 }}
              >
                {(cardData.name[0] ?? "?").toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2
              className="display"
              style={{ fontSize: 20, color: TEXT, fontWeight: 700, marginBottom: 3 }}
            >
              {cardData.name}
            </h2>
            {(tagline || locationLabel) && (
              <div
                style={{
                  fontSize: 12,
                  color: ACCENT_RED,
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                }}
              >
                {[tagline, locationLabel].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
        {/* STATS — owner-entered numbers only (resolveStats). */}
        {stats && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl px-3.5 py-3.5 text-center"
                style={{ background: "linear-gradient(135deg, #fff5f5, #fffbeb)" }}
              >
                <div
                  className="display"
                  style={{
                    fontSize: 26,
                    letterSpacing: "1px",
                    color: ACCENT_RED,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="uppercase"
                  style={{
                    fontSize: 10,
                    color: TEXT_2,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    marginTop: 5,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COLLECTION */}
      {services.length > 0 && (
        <section className="px-5 pt-9">
          <h3
            className="display flex items-center gap-3"
            style={{ fontSize: 32, color: TEXT, letterSpacing: "2px", marginBottom: 6 }}
          >
            <span
              aria-hidden
              style={{ width: 36, height: 6, background: accentBars, borderRadius: 3 }}
            />
            {t.collectionH}
          </h3>
          <p
            style={{ fontSize: 12, color: MUTED, marginBottom: 20, marginLeft: 48 }}
          >
            {t.collectionSub}
          </p>
          <div className="grid grid-cols-2 gap-3.5">
            {services.map((svc, i) => {
              const isFeatured = i === 0;
              return (
                <a
                  key={`${svc.title}-${i}`}
                  href={waDigits ? `https://wa.me/${waDigits}` : "#"}
                  target={waDigits ? "_blank" : undefined}
                  rel={waDigits ? "noopener noreferrer" : undefined}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: SURFACE,
                    border: `1px solid ${LINE}`,
                    color: TEXT,
                    textDecoration: "none",
                    gridColumn: isFeatured ? "span 2" : "auto",
                  }}
                >
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: isFeatured ? "21 / 9" : "1 / 1",
                      background: tileBgs[i % tileBgs.length],
                    }}
                  >
                    <div
                      className="display absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        opacity: 0.9,
                        fontSize: isFeatured ? 64 : 48,
                      }}
                    >
                      {svc.title.slice(0, 1).toUpperCase()}
                    </div>
                  </div>
                  <div className="px-3.5 py-3.5">
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: TEXT,
                        marginBottom: 3,
                      }}
                    >
                      {svc.title}
                    </div>
                    {svc.priceLabel && (
                      <div
                        style={{
                          fontSize: 12,
                          color: ACCENT_RED,
                          fontWeight: 600,
                        }}
                      >
                        {svc.priceLabel}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* BIG CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="px-5 pt-6">
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="display flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-5 uppercase"
            style={{
              background: ctaGrad,
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "2px",
              boxShadow: `0 12px 32px ${ACCENT_RED}66`,
            }}
          >
            {t.bookBtn}
            <span aria-hidden style={{ fontSize: 18 }}>
              →
            </span>
          </a>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {cardData.email && (
              <a
                href={`mailto:${cardData.email}`}
                className="flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5"
                style={{
                  background: "#fff",
                  border: `1.5px solid ${LINE}`,
                  color: TEXT,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ✉ {t.emailLabel}
              </a>
            )}
            {cardData.phone && (
              <a
                href={`tel:${digitsOnly(cardData.phone)}`}
                className="flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5"
                style={{
                  background: "#fff",
                  border: `1.5px solid ${LINE}`,
                  color: TEXT,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ☎ {t.phoneLabel}
              </a>
            )}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-5 pt-6">
        <div
          className="rounded-2xl px-5 py-3"
          style={{ background: SURFACE, border: `1px solid ${LINE}` }}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            accentHex={ACCENT_RED}
          />
        </div>
        {cardData.socials && (
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={ACCENT_RED} />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section className="px-5 pt-6">
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: PAGE, border: `1px solid ${LINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={ACCENT_RED} locale={locale} />
          <ExchangeSlot slug={slug} primary={ACCENT_RED} locale={locale} />
        </div>
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-5 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: ACCENT_RED,
              color: TEXT,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-5 py-6 text-center"
        style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}
      >
        © {new Date().getFullYear()}{" "}
        {[cardData.company || cardData.name, cardData.website]
          .filter(Boolean)
          .join(" · ")}
        <div className="mt-2" style={{ color: MUTED }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ACCENT_RED, fontWeight: 600 }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const ecommerceVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 83,
  key: "ecommerce-vivid",
  name: "E-commerce — Vivid",
  industry: "E-commerce / Energetic D2C brand",
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
  sampleSlug: "demo-ecommerce-vivid",
};

// photo: Unsplash, https://unsplash.com/photos/eF7HN40WbAQ — Free, no attribution required.
export const ecommerceVividSample: SampleData = {
  templateId: 83,
  slug: "demo-ecommerce-vivid",
  cardData: {
    name: "Zeynep Kaya",
    position: "Gründerin & CEO",
    title: "Gründerin & CEO",
    company: "Pazar Shop",
    email: "zeynep@pazar-shop.de",
    phone: "+49 172 556 7891",
    whatsapp: "+49 172 556 7891",
    website: "pazar-shop.de",
    address: "Oranienstraße 30, 10999 Berlin",
    bio: "Kuratierte Mode & Accessoires aus der Türkei & Deutschland. Kostenloser Versand ab €50.",
    bookingUrl: "https://pazar-shop.de/shop",
    impressumUrl: "https://pazar-shop.de/impressum",
    privacyUrl: "https://pazar-shop.de/datenschutz",
    sectorKey: "retail",
    socials: {
      instagram: "https://instagram.com/pazar.shop",
      tiktok: "https://tiktok.com/@pazarshop",
    },
    services: [
      { title: "Seidenschal", description: "Handbedruckt, Premium-Seide.", priceLabel: "€89" },
      { title: "Handtasche", description: "Vollnarbenleder, handgenäht.", priceLabel: "€145" },
      { title: "Schmuckset", description: "Versilbert, kuratiert.", priceLabel: "€65" },
    ],
    stats: [
      { value: "2.400+", label: "Bestellungen" },
      { value: "4,9★", label: "Bewertung" },
      { value: "5", label: "Jahre" },
      { value: "48h", label: "Versand" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

