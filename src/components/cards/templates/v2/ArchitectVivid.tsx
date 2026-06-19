"use client";

// =============================================================================
// ArchitectVivid — v2 template (id=86, key="architect-vivid").
//
// Sector: Architecture — VIVID variant. Mood: bold concrete-and-steel
// gradient hero, Poppins display + Open Sans body, modern marketing-led firm.
// Inspired by kart_09_mimar_vivid.html.
//
// Design DNA (different from Architect.tsx id=9, ArchitectNoir/Pure):
//   - Deep navy/steel gradient hero with radial accent blobs (amber + sky).
//   - Float card overlapping hero with rounded photo + role/firm meta.
//   - Pill-rounded white stat grid with alternating accent colours.
//   - Two-column rounded service cards with iconography and gradient borders.
//   - Sky-blue gradient CTA panel with white solid + ghost ghost-white buttons.
//   - Reference panel with featured 16/9 image, amber tag and 3-col meta strip.
//   - Two-column rounded contact tiles.
// =============================================================================

import * as React from "react";
import { linkify } from "@/lib/linkify";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveStats, resolveTagline, resolveLocation } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1e3a8a";
const LOCKED_ACCENT = "#3b82f6";
const SURFACE = "#f1f5f9";
const CARD = "#ffffff";
const ACCENT = "#0ea5e9";
const ACCENT_2 = "#f59e0b";
const INK = "#0f172a";
const INK_SOFT = "#334155";
const MUTE = "#64748b";
const MUTE_2 = "#94a3b8";
const LINE = "#e2e8f0";

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
  servicesEyebrow: string;
  servicesH: string;
  ctaTitle: string;
  ctaSub: string;
  ctaCall: string;
  ctaWhatsApp: string;
  featuredEyebrow: string;
  featuredH: string;
  featuredTag: string;
  locationLabel: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    servicesEyebrow: "— Leistungen",
    servicesH: "Spezialgebiete",
    ctaTitle: "Lassen Sie uns Ihr Projekt gestalten.",
    ctaSub: "Kostenloses Erstgespräch — Termin sichern.",
    ctaCall: "Anrufen",
    ctaWhatsApp: "WhatsApp",
    featuredEyebrow: "— Featured",
    featuredH: "Aktuelles Projekt",
    featuredTag: "Featured",
    locationLabel: "Standort",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    servicesEyebrow: "— Services",
    servicesH: "Specialties",
    ctaTitle: "Let's design your next project.",
    ctaSub: "Free intro call — book your slot now.",
    ctaCall: "Call now",
    ctaWhatsApp: "WhatsApp",
    featuredEyebrow: "— Featured",
    featuredH: "Featured Project",
    featuredTag: "Featured",
    locationLabel: "Location",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    servicesEyebrow: "— Hizmetler",
    servicesH: "Uzmanlık Alanları",
    ctaTitle: "Projenizi birlikte tasarlayalım.",
    ctaSub: "Ücretsiz keşif görüşmesi için randevu oluşturun.",
    ctaCall: "Hemen Ara",
    ctaWhatsApp: "WhatsApp",
    featuredEyebrow: "— Featured",
    featuredH: "Öne Çıkan Proje",
    featuredTag: "Featured",
    locationLabel: "Konum",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {
    servicesEyebrow: "— Servicios",
    servicesH: "Especialidades",
    ctaTitle: "Diseñemos tu próximo proyecto.",
    ctaSub: "Llamada introductoria gratis — reserva tu hueco.",
    ctaCall: "Llamar ahora",
    ctaWhatsApp: "WhatsApp",
    featuredEyebrow: "— Destacado",
    featuredH: "Proyecto destacado",
    featuredTag: "Destacado",
    locationLabel: "Ubicación",
    bookBtn: "Reservar cita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  },
  it: {
    servicesEyebrow: "— Servizi",
    servicesH: "Specialità",
    ctaTitle: "Progettiamo il tuo prossimo progetto.",
    ctaSub: "Chiamata introduttiva gratuita — prenota ora.",
    ctaCall: "Chiama ora",
    ctaWhatsApp: "WhatsApp",
    featuredEyebrow: "— In evidenza",
    featuredH: "Progetto in evidenza",
    featuredTag: "In evidenza",
    locationLabel: "Posizione",
    bookBtn: "Prenota un appuntamento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  },
  fr: {
    servicesEyebrow: "— Services",
    servicesH: "Spécialités",
    ctaTitle: "Concevons votre prochain projet.",
    ctaSub: "Appel d'introduction gratuit — réservez votre créneau.",
    ctaCall: "Appeler maintenant",
    ctaWhatsApp: "WhatsApp",
    featuredEyebrow: "— À la une",
    featuredH: "Projet en vedette",
    featuredTag: "À la une",
    locationLabel: "Emplacement",
    bookBtn: "Prendre rendez-vous",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  },
  ar: {
    servicesEyebrow: "— الخدمات",
    servicesH: "التخصصات",
    ctaTitle: "لنصمم مشروعك القادم.",
    ctaSub: "مكالمة تعريفية مجانية — احجز موعدك الآن.",
    ctaCall: "اتصل الآن",
    ctaWhatsApp: "واتساب",
    featuredEyebrow: "— مميز",
    featuredH: "مشروع مميز",
    featuredTag: "مميز",
    locationLabel: "الموقع",
    bookBtn: "حجز موعد",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  },
};

export function ArchitectVivid({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  void primary;
  void accent;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";
  const callHref = cardData.phone
    ? `tel:${digitsOnly(cardData.phone)}`
    : undefined;
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.ctaTitle)}`
    : undefined;

  const services = (cardData.services ?? []).slice(0, 5);
  const stats = resolveStats(cardData.stats);
  const tagline = resolveTagline(cardData);
  const locationLabel = resolveLocation(cardData);
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  const featuredService = services[0];
  const heroImage = photoUrl;

  const heroGrad = `linear-gradient(135deg, ${primary} 0%, #1e3a5f 50%, #0c4a6e 100%)`;

  return (
    <article
      data-template="architect-vivid"
      className="architect-vivid-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK_SOFT }}
    >
      <style jsx global>{`
        .architect-vivid-card {
          font-family: var(--tpl-font-body, 'Open Sans', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .architect-vivid-card .display {
          font-family: var(--tpl-font-display, 'Poppins', system-ui, sans-serif);
        }
        .architect-vivid-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-7 pb-28 pt-12"
        style={{ background: heroGrad }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "-40%",
            right: "-30%",
            width: 380,
            height: 380,
            background: `radial-gradient(circle, ${ACCENT_2}33, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            bottom: "-50%",
            left: "-20%",
            width: 360,
            height: 360,
            background: `radial-gradient(circle, ${ACCENT}38, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
        <div className="relative z-[2]">
          {cardData.company && (
            <div
              className="mb-4 flex items-center gap-2.5 uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.6)",
                fontWeight: 600,
              }}
            >
              <span
                aria-hidden
                style={{ width: 28, height: 2, background: ACCENT_2 }}
              />
              {cardData.company}
            </div>
          )}
          <h1
            className="display"
            style={{
              fontSize: "clamp(34px, 10vw, 38px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: "-1px",
            }}
          >
            {nameFirst}
            {nameLast && <span style={{ color: ACCENT_2 }}> {nameLast}</span>}
          </h1>
          {cardData.bio && (
            <p
              className="mt-3.5"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.55,
                maxWidth: "90%",
              }}
            >
              {cardData.bio}
            </p>
          )}
        </div>
      </section>

      {/* FLOAT CARD */}
      <section
        className="relative z-[5] mx-6 mb-0 -mt-20 px-5 py-5"
        style={{
          background: CARD,
          borderRadius: 20,
          boxShadow:
            "0 20px 50px -20px rgba(15,23,42,0.35), 0 4px 14px rgba(15,23,42,0.08)",
        }}
      >
        <div
          className="grid items-center gap-4"
          style={{ gridTemplateColumns: "80px 1fr" }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={80}
              height={80}
              unoptimized
              className="rounded-full object-cover tpl-photo"
              style={{
                border: "4px solid #fff",
                boxShadow: "0 4px 14px rgba(15,23,42,0.18)",
                width: 80,
                height: 80,
              }}
            />
          ) : (
            <div
              className="display flex items-center justify-center rounded-full"
              style={{
                width: 80,
                height: 80,
                background: heroGrad,
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            {tagline && (
              <div
                className="uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "2px",
                  color: ACCENT,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {tagline}
              </div>
            )}
            <div
              className="display truncate"
              style={{ fontSize: 18, fontWeight: 700, color: INK }}
            >
              {cardData.name}
            </div>
            <div
              className="truncate"
              style={{ fontSize: 12, color: MUTE, marginTop: 2 }}
            >
              {[cardData.company, locationLabel].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
      </section>

      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
        <section
          className="mx-6 mt-7 grid px-2 py-5"
          style={{
            background: CARD,
            borderRadius: 20,
            boxShadow: "0 4px 14px rgba(15,23,42,0.05)",
            gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((s, i, arr) => (
            <div
              key={s.label}
              className="relative px-1 text-center"
            >
              <div
                className="display"
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: i % 2 === 0 ? ACCENT : ACCENT_2,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                className="mt-1.5 uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "1.2px",
                  color: MUTE,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
              {i < arr.length - 1 && (
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    right: 0,
                    top: "14%",
                    width: 1,
                    height: "72%",
                    background: LINE,
                  }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <>
          <SectionHead
            eb={t.servicesEyebrow}
            h={t.servicesH}
            ebColor={ACCENT}
          />
          <section
            className="grid grid-cols-2 gap-3 px-6 pb-2"
          >
            {services.map((svc, i) => {
              const tint = i % 2 === 0 ? ACCENT : ACCENT_2;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex flex-col"
                  style={{
                    background: CARD,
                    borderRadius: 16,
                    padding: "18px 16px",
                    border: `1px solid ${LINE}`,
                    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                    gridColumn:
                      services.length % 2 === 1 && i === services.length - 1
                        ? "1 / -1"
                        : "auto",
                  }}
                >
                  <div
                    className="mb-3 flex h-9 w-9 items-center justify-center"
                    style={{
                      borderRadius: 10,
                      background: `${tint}1a`,
                      color: tint,
                    }}
                  >
                    <ServiceGlyph idx={i} />
                  </div>
                  <div
                    className="display"
                    style={{ fontSize: 14, fontWeight: 700, color: INK }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-1"
                      style={{
                        fontSize: 11,
                        color: MUTE,
                        lineHeight: 1.45,
                      }}
                    >
                      {linkify(svc.description)}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="display mt-2"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: tint,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </ServiceLink>
              );
            })}
          </section>
        </>
      )}

      {/* CTA */}
      {(callHref || waHref) && (
        <section
          className="relative mx-6 mt-7 overflow-hidden px-5 py-6"
          style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, #0284c7 100%)`,
            borderRadius: 20,
            color: "#fff",
            boxShadow: `0 10px 30px -10px ${ACCENT}80`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: "-40%",
              right: "-30%",
              width: 200,
              height: 200,
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
            }}
          />
          <div className="relative z-[2]">
            <div
              className="display"
              style={{
                fontSize: 19,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {t.ctaTitle}
            </div>
            <div
              className="mt-1.5"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}
            >
              {t.ctaSub}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {callHref && (
                <a
                  href={callHref}
                  className="display flex items-center justify-center px-3.5 py-3"
                  style={{
                    background: "#fff",
                    color: ACCENT,
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {t.ctaCall}
                </a>
              )}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display flex items-center justify-center px-3.5 py-3"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {t.ctaWhatsApp}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED REFERENCE */}
      {heroImage && featuredService && (
        <>
          <SectionHead
            eb={t.featuredEyebrow}
            h={t.featuredH}
            ebColor={ACCENT}
          />
          <section
            className="mx-6 mb-0 overflow-hidden"
            style={{
              background: CARD,
              borderRadius: 20,
              border: `1px solid ${LINE}`,
              boxShadow: "0 4px 14px rgba(15,23,42,0.05)",
            }}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={heroImage}
                alt={featuredService.title}
                fill
                unoptimized
                sizes="(max-width: 460px) 100vw, 460px"
                className="object-cover"
              />
            </div>
            <div
              className="px-5 pb-5 pt-5"
              style={{
                background: `linear-gradient(180deg, ${ACCENT_2}10, transparent)`,
              }}
            >
              <span
                className="inline-block uppercase"
                style={{
                  background: ACCENT_2,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  padding: "4px 10px",
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                {t.featuredTag}
              </span>
              <div
                className="display"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1.3,
                }}
              >
                {featuredService.title}
              </div>
              {locationLabel && (
                <div
                  className="mt-3.5 pt-3.5"
                  style={{ borderTop: `1px solid ${LINE}` }}
                >
                  <div
                    className="uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: "1.2px",
                      color: MUTE,
                      fontWeight: 600,
                    }}
                  >
                    {t.locationLabel}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: INK,
                      marginTop: 2,
                    }}
                  >
                    {locationLabel}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* CONTACT */}
      <section className="mx-6 mt-7">
        <div
          className="grid grid-cols-2 gap-2.5"
          style={{ ["--card-primary" as string]: ACCENT } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="tile"
            tone="light"
            accentHex={ACCENT}
          />
        </div>
        {cardData.socials && (
          <div className="mt-5 flex justify-center">
            <SocialRow
              socials={cardData.socials}
              variant="icon"
              accentHex={ACCENT}
            />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-7 px-7 py-7"
        style={{
          background: CARD,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={ACCENT} locale={locale} />
        <ExchangeSlot slug={slug} primary={ACCENT} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: ACCENT,
              color: INK,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer className="px-7 py-8 text-center">
        <div
          className="display"
          style={{ fontSize: 12, fontWeight: 700, color: INK }}
        >
          {(cardData.company || cardData.name).split(" ")[0]}{" "}
          <span style={{ color: ACCENT }}>
            {(cardData.company || cardData.name).split(" ").slice(1).join(" ")}
          </span>
        </div>
        <div
          className="mt-1"
          style={{ fontSize: 10, color: MUTE_2, letterSpacing: "0.5px" }}
        >
          &copy; {new Date().getFullYear()} —{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ACCENT }}
          >
            {t.poweredBy} OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

function SectionHead({
  eb,
  h,
  ebColor,
}: {
  eb: string;
  h: string;
  ebColor: string;
}) {
  return (
    <div className="px-7 pb-3.5 pt-8">
      <div
        className="uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "2.5px",
          color: ebColor,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {eb}
      </div>
      <h2
        className="display"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: INK,
          letterSpacing: "-0.4px",
        }}
      >
        {h}
      </h2>
    </div>
  );
}

function ServiceGlyph({ idx }: { idx: number }) {
  // Architectural glyphs cycle through house, building, layers, interior, leaf
  const paths = [
    "M3 12l9-9 9 9M5 10v10h14V10",
    "M3 3h18v18H3zM3 9h18M9 21V9",
    "M12 2v8M3 10l9 4 9-4M3 14l9 4 9-4M3 18l9 4 9-4",
    "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
    "M2 22c1.5-2 4-3 6-3s4 1 6 3M2 17c1.5-2 4-3 6-3s4 1 6 3",
  ];
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[idx % paths.length]} />
    </svg>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const architectVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 86,
  key: "architect-vivid",
  name: "Architect — Vivid",
  industry: "Architecture / bold concrete & steel marketing",
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
  sampleSlug: "demo-architect-vivid",
};

// photo: Unsplash, https://unsplash.com/photos/Q9y3LRuuxmg — Free, no attribution required.
export const architectVividSample: SampleData = {
  templateId: 86,
  slug: "demo-architect-vivid",
  cardData: {
    name: "Mehmet Yıldız",
    position: "Architekt & Gründer",
    title: "Architekt & Gründer",
    company: "YıldızArch Architekten Berlin",
    email: "mehmet@yildizarch.de",
    phone: "+49 30 445 6780",
    whatsapp: "+49 30 445 6780",
    website: "yildizarch.de",
    address: "Linienstraße 142, 10115 Berlin",
    bio: "Architekt mit Fokus auf nachhaltiges Bauen und minimalistische Raumkonzepte. 15+ Projekte realisiert.",
    bookingUrl: "https://cal.com/yildizarch/intro",
    impressumUrl: "https://yildizarch.de/impressum",
    privacyUrl: "https://yildizarch.de/datenschutz",
    sectorKey: "architecture",
    socials: {
      instagram: "https://instagram.com/yildizarch",
      linkedin: "https://linkedin.com/in/mehmetyildiz-arch",
    },
    services: [
      { title: "Neubauplanung", description: "Boğaz villaları & Rezidanzen.", priceLabel: "ab €8.000" },
      { title: "Innenarchitektur", description: "Karakter dolu mekan tasarımı.", priceLabel: "ab €3.500" },
      { title: "Beratung", description: "Strategische Bauberatung.", priceLabel: "€200/h" },
      { title: "Sustainable Design", description: "DGNB-orientierte Konzepte." },
      { title: "Urban Renewal", description: "Quartiers-Regenerierung." },
    ],
    stats: [
      { value: "14", label: "Jahre" },
      { value: "85+", label: "Projekte" },
      { value: "8", label: "Länder" },
      { value: "4", label: "Preise" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
