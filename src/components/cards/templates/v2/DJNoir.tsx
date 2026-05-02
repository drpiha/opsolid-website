"use client";

// =============================================================================
// DJNoir â€” v2 template (id=72, key="dj-noir").
//
// Sector: DJ / Music â€” NOIR variant. Mood: pitch-black underground club,
// neon purple/cyan accents, animated EQ bars, Syne display + Space Mono.
// Inspired by kart_06_dj_noir.html.
//
// Design DNA (different from default Studio.tsx and MusicProducer.tsx):
//   - Pitch-black with neon-purple/pink radial glows.
//   - REC // Live Set hero meta with blinking dot.
//   - Mega Syne clamp(56-84px) name with second word in purpleâ†’pink gradient.
//   - 18-bar animated SVG EQ frequency display below hero.
//   - Compact profile row (84px gradient ring avatar + Resident//Producer cap).
//   - 3-cell stat divider strip (years/events/listeners).
//   - Sect-num "// 01" eyebrows on every section.
//   - Genre pills with .hot variant for primary genres.
//   - Event rows with neon-purple date/venue stack.
//   - Neon-outline CTA with glow shadow.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#000000";
const LOCKED_ACCENT = "#a855f7";
const SURFACE = "#050507";
const SURFACE_2 = "#0d0d12";
const LINE = "#1f1f29";
const LINE_2 = "#2a2a36";
const ACCENT_2 = "#ec4899";
const TEXT = "#f5f5f7";
const TEXT_SOFT = "#9494a3";
const TEXT_DIM = "#5e5e6e";

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
  recLabel: string;
  yearsLabel: string;
  eventsLabel: string;
  listenersLabel: string;
  genresH: string;
  upcomingH: string;
  bookingH: string;
  contactH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    recLabel: "REC // Live Set",
    yearsLabel: "Active",
    eventsLabel: "Events",
    listenersLabel: "Listeners",
    genresH: "Genres",
    upcomingH: "Upcoming",
    bookingH: "Booking",
    contactH: "Contact",
    bookBtn: "Anfrage senden",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    recLabel: "REC // Live Set",
    yearsLabel: "Active",
    eventsLabel: "Events",
    listenersLabel: "Listeners",
    genresH: "Genres",
    upcomingH: "Upcoming",
    bookingH: "Booking",
    contactH: "Contact",
    bookBtn: "Book now",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    recLabel: "REC // Live Set",
    yearsLabel: "Aktif",
    eventsLabel: "Etkinlik",
    listenersLabel: "Dinleyici",
    genresH: "TÃ¼rler",
    upcomingH: "YaklaÅŸan",
    bookingH: "Booking",
    contactH: "Ä°letiÅŸim",
    bookBtn: "Booking Talebi",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
  },
};

const BAR_HEIGHTS = [30, 60, 80, 45, 90, 55, 70, 35, 65, 50, 85, 40, 75, 55, 30, 60, 80, 45];

export function DJNoir({
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

  // Split name in two words for gradient effect
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  // Build genres + months for events from services
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const today = new Date();

  return (
    <article
      data-template="dj-noir"
      className="djnoir-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .djnoir-card {
          font-family: var(--tpl-font-body, 'Space Mono', 'JetBrains Mono', monospace);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
          position: relative;
        }
        .djnoir-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(800px 400px at 20% 0%, ${accent}14, transparent 60%),
            radial-gradient(600px 300px at 80% 100%, ${ACCENT_2}10, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .djnoir-card .display {
          font-family: var(--tpl-font-display, 'Syne', 'Inter', sans-serif);
        }
        .djnoir-card .relz { position: relative; z-index: 1; }
        .djnoir-card a { color: inherit; }
        @keyframes djnoir-blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes djnoir-eq {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .djnoir-card .blink, .djnoir-card .bar { animation: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section
        className="relz px-6 pt-16 pb-12"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <div
          className="mb-3.5 flex items-center gap-2 text-[11px] uppercase"
          style={{ color: accent, letterSpacing: "3px" }}
        >
          <span
            aria-hidden
            className="blink block"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 24px ${accent}73`,
              animation: "djnoir-blink 1.6s ease-in-out infinite",
            }}
          />
          {t.recLabel}
        </div>
        <h1
          className="display leading-[0.92]"
          style={{
            fontWeight: 800,
            fontSize: "clamp(56px, 16vw, 84px)",
            letterSpacing: "-2px",
            color: TEXT,
            textShadow: `0 0 40px ${accent}59`,
          }}
        >
          {nameFirst.toUpperCase()}
          {nameLast && (
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${ACCENT_2})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {nameLast.toUpperCase()}.
            </span>
          )}
        </h1>
        {cardData.bio && (
          <p
            className="mt-4 max-w-[340px] text-[13px] leading-[1.6]"
            style={{ color: TEXT_SOFT, letterSpacing: "0.5px" }}
          >
            {cardData.bio}
          </p>
        )}
        <div
          className="mt-6 flex items-end gap-1"
          style={{ height: 48 }}
          aria-hidden
        >
          {BAR_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className="bar"
              style={{
                flex: 1,
                background: `linear-gradient(180deg, ${accent}, ${ACCENT_2})`,
                borderRadius: 2,
                boxShadow: `0 0 8px ${accent}80`,
                height: `${h}%`,
                animation: `djnoir-eq 1.2s ease-in-out infinite alternate`,
                animationDelay: `${(i % 6) * 0.08}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* PROFILE */}
      <section
        className="relz flex items-center gap-[18px] px-6 py-7"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <div
          className="flex-shrink-0"
          style={{
            width: 84,
            height: 84,
            padding: 3,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent}, ${ACCENT_2})`,
            boxShadow: `0 0 24px ${accent}73`,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={78}
              height={78}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{ border: `2px solid ${SURFACE}` }}
            />
          ) : (
            <div
              className="display flex h-full w-full items-center justify-center rounded-full text-[28px]"
              style={{ background: SURFACE_2, color: TEXT, border: `2px solid ${SURFACE}`, fontWeight: 800 }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2
            className="display mb-1 truncate text-[18px] font-bold"
            style={{ color: TEXT }}
          >
            {cardData.name}
          </h2>
          <p
            className="text-[11px] uppercase"
            style={{ color: accent, letterSpacing: "2px" }}
          >
            {cardData.title || cardData.position || "Resident // Producer"}
          </p>
        </div>
      </section>

      {/* STATS */}
      <div
        className="relz grid grid-cols-3"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        {[
          { num: "10Y", label: t.yearsLabel },
          { num: "450+", label: t.eventsLabel },
          { num: "85K", label: t.listenersLabel },
        ].map((s, i) => (
          <div
            key={i}
            className="px-2 py-6 text-center"
            style={{
              borderRight: i < 2 ? `1px solid ${LINE}` : "none",
            }}
          >
            <div
              className="display text-[24px]"
              style={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${accent}, ${ACCENT_2})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {s.num}
            </div>
            <div
              className="mt-1 text-[9px] uppercase"
              style={{ color: TEXT_SOFT, letterSpacing: "1.5px" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* GENRES */}
      {cardData.bio && (
        <section
          className="relz px-6 py-8"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          <SectHead title={t.genresH} num="01" />
          <div className="flex flex-wrap gap-2">
            {(cardData.bio.match(/[A-Z][a-zA-Z]+/g)?.slice(0, 5) ?? [
              "House",
              "Techno",
              "Afro",
              "Melodic",
            ]).map((g, i) => (
              <span
                key={`${g}-${i}`}
                className="inline-flex items-center px-3.5 py-2 text-[11px] uppercase"
                style={{
                  border: `1px solid ${i < 2 ? accent : LINE_2}`,
                  background: i < 2 ? `${accent}14` : "transparent",
                  color: i < 2 ? accent : TEXT_SOFT,
                  borderRadius: 999,
                  letterSpacing: "1px",
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* UPCOMING / BOOKINGS */}
      {services.length > 0 && (
        <section
          className="relz px-6 py-8"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          <SectHead title={t.upcomingH} num="02" />
          <div className="flex flex-col gap-3">
            {services.map((svc, i) => {
              const date = new Date(today);
              date.setDate(today.getDate() + 7 * (i + 1));
              return (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex gap-4 px-[18px] py-[18px]"
                  style={{
                    background: SURFACE_2,
                    border: `1px solid ${LINE}`,
                    borderRadius: 8,
                  }}
                >
                  <div
                    className="flex-shrink-0 pr-3.5 text-center"
                    style={{
                      minWidth: 54,
                      borderRight: `1px solid ${LINE_2}`,
                    }}
                  >
                    <div
                      className="display text-[28px] leading-none"
                      style={{ color: accent, fontWeight: 800 }}
                    >
                      {String(date.getDate()).padStart(2, "0")}
                    </div>
                    <div
                      className="mt-1 text-[10px] uppercase"
                      style={{ color: TEXT_SOFT, letterSpacing: "1.5px" }}
                    >
                      {months[date.getMonth()]}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="display mb-1 text-[14px] font-bold"
                      style={{ color: TEXT }}
                    >
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div
                        className="text-[11px]"
                        style={{ color: TEXT_SOFT, letterSpacing: "0.5px" }}
                      >
                        {svc.description}
                      </div>
                    )}
                    {svc.priceLabel && (
                      <div
                        className="mt-1.5 text-[10px] uppercase"
                        style={{ color: ACCENT_2, letterSpacing: "1px" }}
                      >
                        {svc.priceLabel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BOOKING CTA */}
      <section
        className="relz px-6 py-8"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <SectHead title={t.bookingH} num="03" />
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="display flex w-full items-center justify-center gap-2.5 px-4 py-4 text-[13px] font-bold uppercase"
            style={{
              background: "transparent",
              border: `1.5px solid ${accent}`,
              color: accent,
              borderRadius: 6,
              letterSpacing: "2px",
              boxShadow: `0 0 24px ${accent}40`,
            }}
          >
            {t.bookBtn}
          </a>
        )}
        {cardData.email && (
          <a
            href={`mailto:${cardData.email}`}
            className="mt-2.5 flex w-full items-center justify-center px-4 py-3.5 text-[11px] uppercase"
            style={{
              background: SURFACE_2,
              border: `1px solid ${LINE_2}`,
              color: TEXT_SOFT,
              borderRadius: 6,
              letterSpacing: "1.5px",
            }}
          >
            {cardData.email}
          </a>
        )}
        {cardData.socials && (
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={accent} />
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section
        className="relz px-6 py-8"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <SectHead title={t.contactH} num="04" />
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
        />
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="relz px-6 py-7"
        style={{
          background: SURFACE_2,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="relz px-6 py-6"
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
        className="relz px-6 py-6 text-center text-[10px] uppercase"
        style={{ color: TEXT_DIM, letterSpacing: "2px" }}
      >
        <span style={{ color: accent }}>{"// "}</span>
        Â© {new Date().getFullYear()} {cardData.name.toUpperCase()}
        {cityFromAddress && ` Â· ${cityFromAddress.toUpperCase()}`}
        <span style={{ color: accent }}>{" //"}</span>
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
    </article>
  );

  function SectHead({ title, num }: { title: string; num: string }) {
    return (
      <div className="mb-5 flex items-center justify-between">
        <div
          className="display text-[14px] font-bold uppercase"
          style={{ color: TEXT, letterSpacing: "2px" }}
        >
          {title}
        </div>
        <div
          className="text-[10px] uppercase"
          style={{ color: TEXT_DIM, letterSpacing: "2px" }}
        >
          {`// ${num}`}
        </div>
      </div>
    );
  }
}

// =============================================================================
// Registry & sample
// =============================================================================

export const djNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 72,
  key: "dj-noir",
  name: "DJ â€” Noir",
  industry: "DJ / Underground club",
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
    brandPrimaryHex: "#000000",
    brandAccentHex: "#a855f7",
  },
  sampleSlug: "demo-dj-noir",
};

// photo: Unsplash, DJ portrait. Unsplash License â€” free, no attribution required.
export const djNoirSample: SampleData = {
  templateId: 72,
  slug: "demo-dj-noir",
  cardData: {
    name: "DJ KAYA",
    position: "DJ & Producer",
    title: "Resident // Producer",
    company: "DJ KAYA Music",
    email: "booking@djkaya.de",
    phone: "+49 178 445 1234",
    whatsapp: "+49 178 445 1234",
    website: "djkaya.de",
    address: "KÃ¶penicker Str. 70, 10179 Berlin",
    bio: "Techno & House DJ aus Berlin. Resident DJ im Tresor & Berghain Kantine. Booking: booking@djkaya.de",
    bookingUrl: "https://cal.com/djkaya/booking",
    brochureUrl: "https://djkaya.de/presskit.pdf",
    impressumUrl: "https://djkaya.de/impressum",
    privacyUrl: "https://djkaya.de/datenschutz",
    sectorKey: "music",
    socials: {
      instagram: "https://instagram.com/djkaya",
      youtube: "https://youtube.com/@djkaya",
      tiktok: "https://tiktok.com/@djkaya",
    },
    services: [
      {
        title: "Club Night",
        description: "2-4h Set, full sound check.",
        priceLabel: "ab â‚¬800",
      },
      {
        title: "Festival Set",
        description: "60-120min main stage with rider.",
        priceLabel: "ab â‚¬2.400",
      },
      {
        title: "Private Event",
        description: "All-night set, custom playlist.",
        priceLabel: "ab â‚¬1.200",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571266028243-d220c6a35c92?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#000000",
  brandAccentHex: "#a855f7",
};

