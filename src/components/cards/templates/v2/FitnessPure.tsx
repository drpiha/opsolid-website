"use client";

// =============================================================================
// FitnessPure — v2 template (id=89, key="fitness-pure").
//
// Sector: Fitness / personal training — PURE variant. Mood: clinical "evidence
// based" performance lab, white surfaces, DM Sans body + Space Grotesk meta.
// Inspired by kart_10_fitness_pure.html.
//
// Design DNA (different from Athlete.tsx id=10, FitnessNoir):
//   - Hairline header with firm caption + "EVIDENCE-BASED · '16" stamp.
//   - Two-column profile band: huge ink h1 with gold rule eyebrow + 110px
//     square grayscale photo.
//   - Meta-row table (Studio / Practice / Languages).
//   - Certifications table: green/gold badge column + ink title + muted org.
//   - Programs list panels with green border-on-hover and price column.
//   - 3-cell stat strip with green sub-units.
//   - Hairline contact table — pure typographic data.
//   - Side-by-side QR/text footer.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveStats, resolveLocation } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ffffff";
const LOCKED_ACCENT = "#1a1a1a";
const SURFACE = "#f2f8f5";
const CARD = "#ffffff";
const INK = "#0f1f1a";
const INK_SOFT = "#1f3a31";
const GREEN = "#065f46";
const GOLD = "#f59e0b";
const MUTE = "#4b5e58";
const MUTE_2 = "#8a9b94";
const LINE = "#d8e6e0";
const LINE_SOFT = "#e6efe9";

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
  studioLabel: string;
  programsTitle: string;
  contactTitle: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    studioLabel: "Studio",
    programsTitle: "Programme",
    contactTitle: "Kontakt",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    studioLabel: "Studio",
    programsTitle: "Programs",
    contactTitle: "Contact",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    studioLabel: "Stüdyo",
    programsTitle: "Program Türleri",
    contactTitle: "İletişim",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {
    studioLabel: "Estudio",
    programsTitle: "Programas",
    contactTitle: "Contacto",
    bookBtn: "Reservar cita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {
    studioLabel: "Studio",
    programsTitle: "Programmi",
    contactTitle: "Contatto",
    bookBtn: "Prenota un appuntamento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {
    studioLabel: "Studio",
    programsTitle: "Programmes",
    contactTitle: "Contact",
    bookBtn: "Prendre rendez-vous",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {
    studioLabel: "استوديو",
    programsTitle: "البرامج",
    contactTitle: "اتصال",
    bookBtn: "حجز موعد",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function FitnessPure({
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

  const services = (cardData.services ?? []).slice(0, 5);
  const locationLabel = resolveLocation(cardData);
  const stats = resolveStats(cardData.stats);
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="fitness-pure"
      className="fitness-pure-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK_SOFT }}
    >
      <style jsx global>{`
        .fitness-pure-card {
          font-family: var(--tpl-font-body, 'DM Sans', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .fitness-pure-card .mono {
          font-family: var(--tpl-font-display, 'Space Grotesk', 'JetBrains Mono', sans-serif);
        }
        .fitness-pure-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="flex items-center justify-between px-7 py-5"
        style={{ background: CARD, borderBottom: `1px solid ${LINE}` }}
      >
        <div
          className="uppercase"
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "3px",
            color: INK,
          }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="mono uppercase"
          style={{ fontSize: 10, letterSpacing: "2px", color: MUTE }}
        >
          EVIDENCE-BASED
        </div>
      </header>

      {/* PROFILE */}
      <section
        className="grid items-start gap-5 px-7 pb-8 pt-9"
        style={{
          background: CARD,
          borderBottom: `1px solid ${LINE}`,
          gridTemplateColumns: "1fr 110px",
        }}
      >
        <div className="pt-1 min-w-0">
          {cardData.position && (
            <div
              className="mono mb-3.5 flex items-center gap-2.5 uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "2.5px",
                color: GREEN,
                fontWeight: 500,
              }}
            >
              <span aria-hidden style={{ width: 24, height: 2, background: GOLD }} />
              {cardData.position}
            </div>
          )}
          <h1
            style={{
              fontSize: "clamp(40px, 12vw, 50px)",
              fontWeight: 500,
              color: INK,
              lineHeight: 0.95,
              letterSpacing: "-2px",
            }}
          >
            {nameFirst}
            {nameLast && (
              <>
                <br />
                {nameLast}
              </>
            )}
          </h1>
          {cardData.bio && (
            <p
              className="mt-3.5"
              style={{
                fontSize: 13,
                color: MUTE,
                fontWeight: 400,
                letterSpacing: "0.2px",
              }}
            >
              {cardData.bio}
            </p>
          )}
        </div>
        {photoUrl && (
          <div
            className="relative shrink-0"
            style={{ width: 110, height: 110 }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              fill
              unoptimized
              sizes="110px"
              className="object-cover tpl-photo"
              style={{ filter: "grayscale(1) contrast(1.05)" }}
            />
          </div>
        )}
      </section>

      {/* META TABLE — location only (real data); fabricated practice/language
          rows removed in the 2026-06 purge. */}
      {locationLabel && (
      <div className="bg-transparent" style={{ background: CARD }}>
        {[
          { k: t.studioLabel, v: locationLabel },
        ].map((m, i, arr) => (
          <div
            key={m.k}
            className="grid items-baseline gap-4 px-7 py-3.5"
            style={{
              borderBottom:
                i < arr.length - 1 ? `1px solid ${LINE_SOFT}` : "none",
              gridTemplateColumns: "110px 1fr",
              fontSize: 13,
            }}
          >
            <div
              className="mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "1.8px",
                color: MUTE_2,
                fontWeight: 500,
              }}
            >
              {m.k}
            </div>
            <div style={{ color: INK, fontWeight: 500 }}>{m.v}</div>
          </div>
        ))}
      </div>
      )}


      {/* PROGRAMS */}
      {services.length > 0 && (
        <section
          className="px-7 pb-8"
          style={{ background: SURFACE }}
        >
          <SectHead num="02" title={t.programsTitle} />
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="grid items-center gap-3.5"
                style={{
                  background: CARD,
                  border: `1px solid ${LINE}`,
                  padding: "18px 18px",
                  gridTemplateColumns: "1fr auto",
                }}
              >
                <div className="min-w-0">
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: INK,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-0.5"
                      style={{ fontSize: 12, color: MUTE }}
                    >
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div className="shrink-0 text-right">
                    <span
                      className="mono"
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: GREEN,
                      }}
                    >
                      {svc.priceLabel}
                    </span>
                  </div>
                )}
              </ServiceLink>
            ))}
          </ul>
        </section>
      )}

      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
      <section
        className="grid px-7 py-8"
        style={{
          background: CARD,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
        }}
      >
        {stats.map((s, i, arr) => (
          <div key={s.label} className="relative py-1">
            <div
              style={{
                fontSize: 38,
                fontWeight: 500,
                color: INK,
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              className="mono mt-2 uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "1.8px",
                color: MUTE,
              }}
            >
              {s.label}
            </div>
            {i < arr.length - 1 && (
              <span
                aria-hidden
                className="absolute"
                style={{
                  right: 16,
                  top: "12%",
                  width: 1,
                  height: "76%",
                  background: LINE,
                }}
              />
            )}
          </div>
        ))}
      </section>
      )}

      {/* CONTACT */}
      <section className="px-7 pb-8 pt-9">
        <SectHead num="03" title={t.contactTitle} />
        <div
          className="mt-3.5"
          style={{
            ["--card-primary" as string]: GREEN,
          } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            tone="light"
            accentHex={GREEN}
          />
        </div>
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow
              socials={cardData.socials}
              variant="pill"
              accentHex={GREEN}
            />
          </div>
        )}
      </section>

      {/* CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="px-7 pb-2">
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3.5 uppercase"
            style={{
              background: GREEN,
              color: "#fff",
              fontSize: 12,
              letterSpacing: "2.5px",
              fontWeight: 500,
            }}
          >
            {t.bookBtn}
          </a>
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-7 px-7 py-7"
        style={{
          background: CARD,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={GREEN} locale={locale} />
        <ExchangeSlot slug={slug} primary={GREEN} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: GREEN,
              color: INK,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between gap-4 px-7 py-7"
        style={{ background: CARD, borderTop: `1px solid ${LINE}` }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.3px",
            color: INK,
          }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "1.5px",
            color: MUTE_2,
          }}
        >
          &copy; {new Date().getFullYear()} — Evidence-based
        </div>
      </footer>
      <div
        className="mono px-7 pb-7 text-center uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "1.5px",
          color: MUTE_2,
          background: CARD,
        }}
      >
        {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: GREEN }}
        >
          OpSolid
        </a>
      </div>
    </article>
  );
}

function SectHead({ num, title }: { num: string; title: string }) {
  return (
    <>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "2.5px",
          color: MUTE_2,
          marginBottom: 6,
        }}
      >
        — {num}
      </div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: INK,
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h2>
    </>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const fitnessPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 89,
  key: "fitness-pure",
  name: "Fitness — Pure",
  industry: "Fitness coach / clinical evidence-based lab",
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
  sampleSlug: "demo-fitness-pure",
};

// photo: Unsplash, https://unsplash.com/photos/8mqOw4DBBSg — Free, no attribution required.
export const fitnessPureSample: SampleData = {
  templateId: 89,
  slug: "demo-fitness-pure",
  cardData: {
    name: "Can Öztürk",
    position: "Performance Coach",
    title: "Performance Coach",
    company: "CanFit Berlin",
    email: "can@canfit.de",
    phone: "+49 176 778 9012",
    whatsapp: "+49 176 778 9012",
    website: "canfit.de",
    address: "Kastanienallee 24, 10435 Berlin",
    bio: "Wissenschaftsbasiertes Training und Ernährungsplanung — 8 Jahre Praxis, 600+ begleitete Transformationen.",
    bookingUrl: "https://cal.com/canfit/intro",
    impressumUrl: "https://canfit.de/impressum",
    privacyUrl: "https://canfit.de/datenschutz",
    sectorKey: "fitness",
    stats: [
      { value: "600+", label: "Transformationen" },
      { value: "8", label: "Jahre" },
      { value: "73K", label: "Follower" },
    ],
    socials: {
      instagram: "https://instagram.com/canfit.berlin",
      youtube: "https://youtube.com/CanFit",
    },
    services: [
      { title: "1-1 Online Coaching", description: "Individueller Plan + wöchentlicher Check-in.", priceLabel: "€199/Monat" },
      { title: "Personal Training", description: "Studio-Session, 60 Minuten.", priceLabel: "€75/h" },
      { title: "Ernährungsplan", description: "Makro-Profil + Habit-Loops.", priceLabel: "€45/h" },
      { title: "12-Wochen Transformation", description: "Training + Ernährung + Mindset.", priceLabel: "€899" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
