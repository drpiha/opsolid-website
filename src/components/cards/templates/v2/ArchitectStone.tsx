"use client";

// =============================================================================
// ArchitectStone — v2 template (id=87, key="architect-stone").
//
// Sector: Architecture — STONE variant. Mood: warm concrete-grey atelier with
// exposed-material aesthetic, Fraunces italic display + Nunito body.
// Inspired by kart_09_mimar_stone.html.
//
// Design DNA (different from Architect.tsx id=9, ArchitectNoir/Pure/Vivid):
//   - Warm taupe gradient header with double-dot italic divider.
//   - Wave SVG transition into card surface.
//   - Centred 116px circular photo on cream halo.
//   - Italic Fraunces philosophy block with copper accent.
//   - Stacked rounded service cards with copper-gold gradient icon tile.
//   - Featured project frame with sepia photo + dark overlay caption + body.
//   - Linen-gradient testimonial with oversized faded quote-mark.
//   - Pill-rounded contact rows + filled/outlined CTA pair.
// =============================================================================

import * as React from "react";
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

const LOCKED_PRIMARY = "#4a4a42";
const LOCKED_ACCENT = "#b8a898";
const SURFACE = "#f8f4ec";
const SURFACE_2 = "#f1ebde";
const INK = "#2a2418";
const WARM = "#5c4a2a";
const WARM_SOFT = "#7a6541";
const GOLD_SOFT = "#d9be3c";
const GOLD = "#c8a500";
const MUTE = "#8a7e64";
const MUTE_2 = "#b6a98c";
const LINE = "#ddd2bb";
const LINE_SOFT = "#e6dec9";

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
  philLabel: string;
  servicesH: string;
  featuredH: string;
  testiCite: string;
  contactH: string;
  ctaPrimary: string;
  ctaSecondary: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    philLabel: "Philosophie",
    servicesH: "Hizmet Alanlarım",
    featuredH: "Öne Çıkan Çalışma",
    testiCite: "Bauherrin",
    contactH: "İletişim",
    ctaPrimary: "Anrufen",
    ctaSecondary: "WhatsApp",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    philLabel: "Philosophy",
    servicesH: "Service Suite",
    featuredH: "Featured Work",
    testiCite: "Project owner",
    contactH: "Contact",
    ctaPrimary: "Call",
    ctaSecondary: "WhatsApp",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    philLabel: "Felsefem",
    servicesH: "Hizmet Alanlarım",
    featuredH: "Öne Çıkan Çalışma",
    testiCite: "Proje sahibi",
    contactH: "İletişim Kuralım",
    ctaPrimary: "Ara",
    ctaSecondary: "WhatsApp",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    philLabel: "Filosofía",
    servicesH: "Suite de servicios",
    featuredH: "Trabajo destacado",
    testiCite: "Propietario del proyecto",
    contactH: "Contacto",
    ctaPrimary: "Llamar",
    ctaSecondary: "WhatsApp",
    bookBtn: "Reservar cita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    philLabel: "Filosofia",
    servicesH: "Suite dei servizi",
    featuredH: "Lavori in evidenza",
    testiCite: "Titolare del progetto",
    contactH: "Contatto",
    ctaPrimary: "Chiama",
    ctaSecondary: "WhatsApp",
    bookBtn: "Prenota un appuntamento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    philLabel: "Philosophie",
    servicesH: "Suite de services",
    featuredH: "Travaux en vedette",
    testiCite: "Propriétaire du projet",
    contactH: "Contact",
    ctaPrimary: "Appeler",
    ctaSecondary: "WhatsApp",
    bookBtn: "Prendre rendez-vous",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    philLabel: "الفلسفة",
    servicesH: "حزمة الخدمات",
    featuredH: "أعمال مميزة",
    testiCite: "صاحب المشروع",
    contactH: "اتصال",
    ctaPrimary: "اتصال",
    ctaSecondary: "واتساب",
    bookBtn: "حجز موعد",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function ArchitectStone({
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
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
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

  return (
    <article
      data-template="architect-stone"
      className="architect-stone-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .architect-stone-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.65;
          -webkit-font-smoothing: antialiased;
        }
        .architect-stone-card .serif {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', serif);
        }
        .architect-stone-card a { color: inherit; }
      `}</style>

      {/* WARM HEADER */}
      <header
        className="relative overflow-hidden px-7 pb-16 pt-9 text-center"
        style={{
          background:
            "linear-gradient(180deg, #d4c2a0 0%, #c9b58e 60%, #c5b189 100%)",
          color: INK,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,245,220,0.35), transparent 50%), radial-gradient(circle at 80% 70%, rgba(140,110,60,0.18), transparent 60%)",
          }}
        />
        <div className="relative z-[2]">
          <div
            className="serif italic"
            style={{
              fontWeight: 400,
              fontSize: 18,
              letterSpacing: "1px",
              color: WARM,
              marginBottom: 6,
            }}
          >
            {cardData.company || cardData.name}
          </div>
          {locationLabel && (
            <div
              className="serif uppercase"
              style={{
                fontSize: 13,
                letterSpacing: "4px",
                color: WARM_SOFT,
              }}
            >
              {locationLabel}
            </div>
          )}
          <div
            aria-hidden
            className="relative mx-auto mt-3.5"
            style={{ width: 60, height: 1, background: WARM_SOFT }}
          >
            <span
              aria-hidden
              className="absolute"
              style={{
                top: "50%",
                left: -10,
                transform: "translateY(-50%)",
                width: 4,
                height: 4,
                background: WARM,
                borderRadius: "50%",
              }}
            />
            <span
              aria-hidden
              className="absolute"
              style={{
                top: "50%",
                right: -10,
                transform: "translateY(-50%)",
                width: 4,
                height: 4,
                background: WARM,
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </header>

      {/* WAVE DIVIDER */}
      <div
        className="relative"
        style={{ height: 38, marginTop: -1, background: SURFACE }}
      >
        <svg
          viewBox="0 0 460 38"
          preserveAspectRatio="none"
          className="absolute left-0 block"
          style={{ top: -38, width: "100%", height: 38 }}
          aria-hidden
        >
          <path
            d="M0,0 C115,38 230,38 345,18 C390,10 425,8 460,0 L460,38 L0,38 Z"
            fill={SURFACE}
          />
        </svg>
      </div>

      {/* PROFILE */}
      <section className="relative z-[5] -mt-10 px-7 text-center">
        <div
          className="relative inline-block"
          style={{
            padding: 6,
            background: SURFACE,
            borderRadius: "50%",
            boxShadow: "0 8px 24px rgba(92,74,42,0.18)",
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={116}
              height={116}
              unoptimized
              className="rounded-full object-cover tpl-photo"
              style={{
                width: 116,
                height: 116,
                border: `3px solid ${SURFACE}`,
              }}
            />
          ) : (
            <div
              className="serif italic flex items-center justify-center rounded-full"
              style={{
                width: 116,
                height: 116,
                border: `3px solid ${SURFACE}`,
                background: `${WARM}1a`,
                color: WARM,
                fontSize: 36,
                fontWeight: 400,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <h1
          className="serif"
          style={{
            fontSize: 32,
            color: INK,
            marginTop: 18,
            lineHeight: 1.1,
          }}
        >
          {nameFirst}{" "}
          <em
            style={{
              fontStyle: "italic",
              color: WARM,
              fontWeight: 400,
            }}
          >
            {nameLast}
          </em>
        </h1>
        {tagline && (
          <div
            className="mt-2 uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "2.5px",
              color: WARM_SOFT,
              fontWeight: 600,
            }}
          >
            {tagline}
          </div>
        )}
      </section>

      {/* PHILOSOPHY */}
      {cardData.bio && (
        <section className="px-7 pb-3 pt-9 text-center">
          <div
            className="serif italic"
            style={{
              fontSize: 14,
              color: WARM,
              marginBottom: 12,
            }}
          >
            {t.philLabel}
          </div>
          <p
            className="serif"
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: INK,
              fontWeight: 400,
            }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <>
          <SectionHead
            ornament={
              <path
                d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"
                strokeWidth={1.5}
              />
            }
            h={t.servicesH}
          />
          <section className="flex flex-col gap-3.5 px-6 pb-2">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="grid items-center gap-3.5"
                style={{
                  background: SURFACE_2,
                  borderRadius: 18,
                  padding: 18,
                  border: `1px solid ${LINE}`,
                  boxShadow: "0 2px 8px rgba(92,74,42,0.05)",
                  gridTemplateColumns: "44px 1fr",
                }}
              >
                <div
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${GOLD_SOFT}, #b8a04a)`,
                    color: "#fff",
                  }}
                >
                  <ServiceGlyph idx={i} />
                </div>
                <div className="min-w-0">
                  <div
                    className="serif"
                    style={{
                      fontSize: 16,
                      color: INK,
                      fontWeight: 400,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-0.5"
                      style={{
                        fontSize: 12,
                        color: MUTE,
                        lineHeight: 1.5,
                      }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="serif italic mt-1"
                      style={{
                        fontSize: 13,
                        color: WARM,
                        fontWeight: 400,
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              </ServiceLink>
            ))}
          </section>
        </>
      )}

      {/* FEATURED */}
      {heroImage && featuredService && (
        <>
          <SectionHead
            ornament={
              <>
                <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                <path d="M12 7v5l3 2" strokeWidth={1.5} />
              </>
            }
            h={t.featuredH}
          />
          <section
            className="mx-6 overflow-hidden"
            style={{
              background: SURFACE_2,
              borderRadius: 22,
              border: `1px solid ${LINE}`,
              boxShadow: "0 4px 12px rgba(92,74,42,0.08)",
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "5/4" }}
            >
              <Image
                src={heroImage}
                alt={featuredService.title}
                fill
                unoptimized
                sizes="(max-width: 460px) 100vw, 460px"
                className="object-cover"
                style={{ filter: "sepia(0.18) saturate(1.05)" }}
              />
              <span
                className="absolute z-[2] uppercase"
                style={{
                  top: 14,
                  left: 14,
                  background: SURFACE,
                  color: WARM,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  padding: "6px 12px",
                  borderRadius: 30,
                }}
              >
                Featured
              </span>
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(42,36,24,0.55) 100%)",
                }}
              />
              <div
                className="absolute z-[2]"
                style={{
                  bottom: 16,
                  left: 16,
                  right: 16,
                  color: "#fff",
                }}
              >
                <div
                  className="serif"
                  style={{ fontSize: 22, lineHeight: 1.2 }}
                >
                  {featuredService.title}
                </div>
                {locationLabel && (
                  <div
                    className="mt-1 uppercase"
                    style={{
                      fontSize: 11,
                      letterSpacing: "1.5px",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {locationLabel}
                  </div>
                )}
              </div>
            </div>
            {featuredService.description && (
              <div className="px-6 pb-5 pt-5">
                <p
                  style={{
                    fontSize: 13,
                    color: WARM_SOFT,
                    lineHeight: 1.6,
                  }}
                >
                  {featuredService.description}
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
        <section
          className="grid gap-1.5 px-7 py-8 text-center"
          style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="serif italic"
                style={{
                  fontSize: 30,
                  color: WARM,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                className="mt-1.5 uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: MUTE,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CONTACT */}
      <SectionHead
        ornament={
          <path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
            strokeWidth={1.5}
          />
        }
        h={t.contactH}
      />
      <section className="px-6 pb-2">
        <div
          style={{
            ["--card-primary" as string]: WARM,
          } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="compact"
            tone="light"
            accentHex={WARM}
          />
        </div>
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow
              socials={cardData.socials}
              variant="pill"
              accentHex={WARM}
            />
          </div>
        )}
      </section>

      {/* CTA */}
      {(callHref || waHref) && (
        <section className="mx-6 mt-7 flex gap-2.5">
          {callHref && (
            <a
              href={callHref}
              className="flex-1 px-4 py-3.5 text-center"
              style={{
                background: WARM,
                color: "#fff",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.3px",
                boxShadow: "0 4px 14px rgba(92,74,42,0.25)",
              }}
            >
              {t.ctaPrimary}
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3.5 text-center"
              style={{
                background: "transparent",
                color: WARM,
                border: `1.5px solid ${WARM}`,
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {t.ctaSecondary}
            </a>
          )}
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-9 px-7 py-7"
        style={{
          background: SURFACE_2,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={WARM} locale={locale} />
        <ExchangeSlot slug={slug} primary={WARM} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: WARM,
              color: INK,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 pb-9 pt-6 text-center"
        style={{ borderTop: `1px solid ${LINE_SOFT}` }}
      >
        <div
          className="serif italic"
          style={{ fontSize: 18, color: WARM }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="mt-1"
          style={{
            fontSize: 10,
            color: MUTE_2,
            letterSpacing: "0.5px",
          }}
        >
          &copy; {new Date().getFullYear()}
        </div>
        <div
          className="mt-1"
          style={{ fontSize: 10, color: MUTE_2, letterSpacing: "0.5px" }}
        >
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: WARM }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

function SectionHead({
  h,
  sub,
  ornament,
}: {
  h: string;
  sub?: string;
  ornament: React.ReactNode;
}) {
  return (
    <div className="px-7 pb-4 pt-9 text-center">
      <svg
        viewBox="0 0 24 24"
        width={28}
        height={28}
        fill="none"
        stroke={GOLD}
        className="mx-auto mb-2.5"
        style={{ opacity: 0.85 }}
        aria-hidden
      >
        {ornament}
      </svg>
      <h2
        className="serif"
        style={{ fontSize: 24, color: INK, lineHeight: 1.2 }}
      >
        {h}
      </h2>
      {sub && (
        <div
          className="mt-1.5"
          style={{
            fontSize: 12,
            color: MUTE,
            letterSpacing: "0.5px",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function ServiceGlyph({ idx }: { idx: number }) {
  const paths = [
    "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
    "M3 3h18v18H3zM3 9h18",
    "M2 22c1.5-2 4-3 6-3s4 1 6 3M2 17c1.5-2 4-3 6-3s4 1 6 3M2 12c1.5-2 4-3 6-3s4 1 6 3",
    "M12 2v8M3 10l9 4 9-4M3 14l9 4 9-4",
    "M3 12c1.5-2 4-3 6-3M21 12c-1.5-2-4-3-6-3M12 5v14M9 19h6",
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

export const architectStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 87,
  key: "architect-stone",
  name: "Architect — Stone",
  industry: "Architecture / warm atelier with exposed material",
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
  sampleSlug: "demo-architect-stone",
};

// photo: Unsplash, https://unsplash.com/photos/Q9y3LRuuxmg — Free, no attribution required.
export const architectStoneSample: SampleData = {
  templateId: 87,
  slug: "demo-architect-stone",
  cardData: {
    name: "Mehmet Yıldız",
    position: "Atelier Architekt",
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
      { title: "Neubauplanung", description: "Bireye özel Boğaz villaları.", priceLabel: "ab €8.000" },
      { title: "Innenarchitektur", description: "Karakter dolu kurumsal mekanlar.", priceLabel: "ab €3.500" },
      { title: "Sustainable Design", description: "Düşük karbonlu yerel malzeme." },
      { title: "Urban Renewal & Interiors", description: "Tarihi dokuyu koruyan müdahaleler." },
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
