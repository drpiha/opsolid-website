"use client";

// =============================================================================
// DJPure — v2 template (id=73, key="dj-pure").
//
// Sector: DJ / Music — PURE variant. Mood: clean editorial press-kit, white
// surface, DM Sans display + DM Mono captions, swiss grid sensibility.
// Inspired by kart_06_dj_pure.html.
//
// Design DNA (different from default Studio.tsx and MusicProducer.tsx):
//   - White card with thick top hairline rules.
//   - Top meta row "DJ // Producer" + "EST. 2016".
//   - Mega 72px DM Sans name with first/last on separate lines, purple "."
//     accent dot.
//   - 120×120 grayscale square photo + bio block (left photo, right info).
//   - Numbered sections "/ 01" "/ 02" with hairline-bottom labels.
//   - Profile detail table (years/events/listeners/genres/bpm).
//   - Mix list with track number + duration (audio-focused detail).
//   - Event row with date + arrow.
//   - Platforms row with @handle links.
//   - Filled-ink primary CTA (turns purple on hover).
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ffffff";
const LOCKED_ACCENT = "#1a1a1a";
const PAGE = "#f8f8f8";
const SURFACE = "#ffffff";
const INK = "#111111";
const INK_2 = "#444444";
const INK_3 = "#888888";
const LINE = "#e5e5e5";
const LINE_2 = "#d4d4d4";
const PURPLE = "#6d28d9";

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
  meta1: string;
  meta2: string;
  profileH: string;
  yearsK: string;
  eventsK: string;
  listenersK: string;
  genresK: string;
  bpmK: string;
  mixesH: string;
  upcomingH: string;
  platformsH: string;
  bookingH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  scanLabel: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    meta1: "DJ // Producer",
    meta2: "EST. 2016",
    profileH: "Profile",
    yearsK: "Years",
    eventsK: "Events",
    listenersK: "Listeners",
    genresK: "Genres",
    bpmK: "BPM Range",
    mixesH: "Latest Mixes",
    upcomingH: "Upcoming Sets",
    platformsH: "Platforms",
    bookingH: "Booking",
    bookBtn: "Buchungsanfrage senden",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    scanLabel: "/ Scan",
  },
  en: {
    meta1: "DJ // Producer",
    meta2: "EST. 2016",
    profileH: "Profile",
    yearsK: "Years",
    eventsK: "Events",
    listenersK: "Listeners",
    genresK: "Genres",
    bpmK: "BPM Range",
    mixesH: "Latest Mixes",
    upcomingH: "Upcoming Sets",
    platformsH: "Platforms",
    bookingH: "Booking",
    bookBtn: "Send booking request",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    scanLabel: "/ Scan",
  },
  tr: {
    meta1: "DJ // Producer",
    meta2: "EST. 2016",
    profileH: "Profil",
    yearsK: "Yıl",
    eventsK: "Etkinlik",
    listenersK: "Dinleyici",
    genresK: "Türler",
    bpmK: "BPM",
    mixesH: "Son Mikslerim",
    upcomingH: "Yaklaşan Setler",
    platformsH: "Platformlar",
    bookingH: "Booking",
    bookBtn: "Booking Talebi Gönder",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    scanLabel: "/ Scan",
  },
  es: {

    meta1: "DJ // Productor",
    meta2: "EST. 2016",
    profileH: "Perfil",
    yearsK: "Años",
    eventsK: "Eventos",
    listenersK: "Oyentes",
    genresK: "Géneros",
    bpmK: "Rango de BPM",
    mixesH: "Últimas mezclas",
    upcomingH: "Próximos sets",
    platformsH: "Plataformas",
    bookingH: "Reserva",
    bookBtn: "Enviar solicitud de reserva",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    scanLabel: "/ Escanear",
  
  },
  it: {

    meta1: "DJ // Producer",
    meta2: "EST. 2016",
    profileH: "Profilo",
    yearsK: "Anni",
    eventsK: "Eventi",
    listenersK: "Ascoltatori",
    genresK: "Generi",
    bpmK: "Range BPM",
    mixesH: "Ultimi mix",
    upcomingH: "Prossimi set",
    platformsH: "Piattaforme",
    bookingH: "Prenotazione",
    bookBtn: "Invia richiesta di prenotazione",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    scanLabel: "/ Scansiona",
  
  },
  fr: {

    meta1: "DJ // Producteur",
    meta2: "EST. 2016",
    profileH: "Profil",
    yearsK: "Années",
    eventsK: "Événements",
    listenersK: "Auditeurs",
    genresK: "Genres",
    bpmK: "Plage de BPM",
    mixesH: "Derniers mixes",
    upcomingH: "Sets à venir",
    platformsH: "Plateformes",
    bookingH: "Réservation",
    bookBtn: "Envoyer la demande de réservation",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    scanLabel: "/ Scanner",
  
  },
  ar: {

    meta1: "دي جي // منتج",
    meta2: "تأسس 2016",
    profileH: "الملف الشخصي",
    yearsK: "سنوات",
    eventsK: "الفعاليات",
    listenersK: "المستمعون",
    genresK: "الأنواع",
    bpmK: "نطاق BPM",
    mixesH: "أحدث المكسات",
    upcomingH: "العروض القادمة",
    platformsH: "المنصات",
    bookingH: "الحجز",
    bookBtn: "إرسال طلب الحجز",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    scanLabel: "/ مسح",
  
  },
};

export function DJPure({
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
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 4);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();

  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const today = new Date();

  return (
    <article
      data-template="dj-pure"
      className="djpure-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .djpure-card {
          font-family: var(--tpl-font-body, 'DM Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .djpure-card .mono {
          font-family: var(--tpl-font-display, 'DM Mono', 'JetBrains Mono', ui-monospace, monospace);
        }
        .djpure-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO */}
        <section className="px-7 pt-12 pb-8">
          <div className="mb-8 flex justify-between">
            <span
              className="mono text-[10px] uppercase"
              style={{ color: INK_3, letterSpacing: "1.5px" }}
            >
              {t.meta1}
            </span>
            <span
              className="mono text-[10px] uppercase"
              style={{ color: INK_3, letterSpacing: "1.5px" }}
            >
              {t.meta2}
            </span>
          </div>
          <h1
            className="text-[64px] leading-[0.92]"
            style={{ fontWeight: 700, letterSpacing: "-3px", color: INK }}
          >
            {nameFirst}
            {nameLast && (
              <>
                <br />
                {nameLast}
              </>
            )}
            <span style={{ color: accent === "#1a1a1a" ? PURPLE : accent }}>.</span>
          </h1>
          {(cardData.title || cardData.position || cityFromAddress) && (
            <div
              className="mono mt-6 text-[11px] uppercase"
              style={{ color: INK_2, letterSpacing: "2px" }}
            >
              {cardData.title || cardData.position}
              {cityFromAddress && ` — ${cityFromAddress}`}
            </div>
          )}
        </section>

        <div style={{ height: 1, background: INK }} />

        {/* PROFILE BLOCK */}
        <section
          className="grid items-start gap-5 px-7 py-8"
          style={{ gridTemplateColumns: "120px 1fr" }}
        >
          <div
            className="overflow-hidden"
            style={{ width: 120, height: 120, background: PAGE }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={cardData.name}
                width={120}
                height={120}
                unoptimized
                className="block h-full w-full object-cover tpl-photo"
                style={{ filter: "grayscale(100%) contrast(1.05)" }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[32px]"
                style={{ color: INK, fontWeight: 700 }}
              >
                {nameFirst[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2
              className="text-[22px]"
              style={{ fontWeight: 600, letterSpacing: "-0.5px", color: INK }}
            >
              {cardData.name}
            </h2>
            {cardData.address && (
              <div
                className="mono mt-1.5 text-[11px]"
                style={{ color: INK_3, letterSpacing: "1px" }}
              >
                {cityFromAddress}
              </div>
            )}
            {cardData.bio && (
              <p
                className="mt-3.5 text-[14px] leading-[1.55]"
                style={{ color: INK_2, fontWeight: 400 }}
              >
                {cardData.bio}
              </p>
            )}
          </div>
        </section>

        <div style={{ height: 1, background: LINE }} />

        {/* PROFILE DETAIL TABLE */}
        <section className="px-7 py-8">
          <SectLabel name={t.profileH} idx="01" />
          <div>
            <DetailRow k={t.yearsK} v="10+ years" />
            <DetailRow k={t.eventsK} v="450+ played" />
            <DetailRow k={t.listenersK} v="85.000 monthly" />
            <DetailRow k={t.genresK} v="House, Techno, Afro, Melodic" />
            <DetailRow k={t.bpmK} v="118 — 128" last />
          </div>
        </section>

        <div style={{ height: 1, background: LINE }} />

        {/* MIXES (services rendered as mix list) */}
        {services.length > 0 && (
          <>
            <section className="px-7 py-8">
              <SectLabel name={t.mixesH} idx="02" />
              <div className="flex flex-col">
                {services.map((svc, i) => {
                  const last = i === services.length - 1;
                  return (
                    <div
                      key={`${svc.title}-${i}`}
                      className="grid items-center gap-3.5 py-3.5"
                      style={{
                        gridTemplateColumns: "24px 1fr auto",
                        borderBottom: last ? "none" : `1px solid ${LINE}`,
                      }}
                    >
                      <div
                        className="mono text-[11px]"
                        style={{ color: INK_3 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="text-[14px]" style={{ color: INK, fontWeight: 500 }}>
                          {svc.title}
                        </div>
                        {svc.description && (
                          <div
                            className="mono mt-0.5 text-[10px] uppercase"
                            style={{ color: INK_3, letterSpacing: "1px", fontWeight: 400 }}
                          >
                            {svc.description}
                          </div>
                        )}
                      </div>
                      {svc.priceLabel && (
                        <div className="mono text-[11px]" style={{ color: INK_3 }}>
                          {svc.priceLabel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
            <div style={{ height: 1, background: LINE }} />
          </>
        )}

        {/* UPCOMING SETS — built from services dates */}
        {services.length > 0 && (
          <>
            <section className="px-7 py-8">
              <SectLabel name={t.upcomingH} idx="03" />
              <div>
                {services.slice(0, 3).map((svc, i) => {
                  const date = new Date(today);
                  date.setDate(today.getDate() + 7 * (i + 1));
                  const last = i === Math.min(2, services.length - 1);
                  return (
                    <div
                      key={`up-${i}`}
                      className="grid items-center gap-3.5 py-3.5"
                      style={{
                        gridTemplateColumns: "64px 1fr auto",
                        borderBottom: last ? "none" : `1px solid ${LINE}`,
                      }}
                    >
                      <div
                        className="mono text-[11px]"
                        style={{ color: INK, letterSpacing: "1px" }}
                      >
                        {String(date.getDate()).padStart(2, "0")} / {months[date.getMonth()]}
                      </div>
                      <div>
                        <div className="text-[14px]" style={{ color: INK, fontWeight: 500 }}>
                          {svc.title}
                        </div>
                        {svc.description && (
                          <div
                            className="mono mt-0.5 text-[10px] uppercase"
                            style={{ color: INK_3, letterSpacing: "1px", fontWeight: 400 }}
                          >
                            {svc.description}
                          </div>
                        )}
                      </div>
                      <div
                        className="mono text-[14px]"
                        style={{ color: accent === "#1a1a1a" ? PURPLE : accent }}
                      >
                        →
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            <div style={{ height: 1, background: LINE }} />
          </>
        )}

        {/* PLATFORMS / SOCIALS */}
        {cardData.socials && (
          <>
            <section className="px-7 py-8">
              <SectLabel name={t.platformsH} idx="04" />
              <SocialRow
                socials={cardData.socials}
                variant="pill"
                accentHex={accent === "#1a1a1a" ? PURPLE : accent}
              />
            </section>
            <div style={{ height: 1, background: LINE }} />
          </>
        )}

        {/* CONTACT */}
        <section className="px-7 py-8">
          <SectLabel name={t.bookingH} idx="05" />
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            accentHex={accent === "#1a1a1a" ? PURPLE : accent}
          />
          {(cardData.bookingUrl || waDigits || phoneDigits) && (
            <a
              href={
                cardData.bookingUrl ||
                (waDigits
                  ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
                  : `tel:${phoneDigits}`)
              }
              target={cardData.bookingUrl || waDigits ? "_blank" : undefined}
              rel={cardData.bookingUrl || waDigits ? "noopener noreferrer" : undefined}
              className="mt-5 block w-full px-6 py-[18px] text-center text-[14px] font-medium"
              style={{
                background: INK,
                color: SURFACE,
                letterSpacing: "0.5px",
              }}
            >
              {t.bookBtn}
            </a>
          )}
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="mono mt-2.5 block w-full px-4 py-4 text-center text-[11px] uppercase"
              style={{
                background: "transparent",
                border: `1px solid ${LINE_2}`,
                color: INK,
                letterSpacing: "1.5px",
              }}
            >
              {cardData.email}
            </a>
          )}
        </section>

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="px-7 py-7"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <SendMyInfoSlot
            slug={slug}
            sourceQs=""
            primary={accent === "#1a1a1a" ? PURPLE : accent}
            locale={locale}
          />
          <ExchangeSlot
            slug={slug}
            primary={accent === "#1a1a1a" ? PURPLE : accent}
            locale={locale}
          />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="border-t px-7 py-6"
            labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
          >
            <div
              style={{
                ["--card-primary" as string]: accent === "#1a1a1a" ? PURPLE : accent,
              }}
            >
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="flex items-center justify-between px-7 py-6"
          style={{ borderTop: `1px solid ${INK}` }}
        >
          <span
            className="mono text-[10px] uppercase"
            style={{ color: INK_3, letterSpacing: "1.5px" }}
          >
            © {new Date().getFullYear()}
          </span>
          <span
            className="text-[11px] font-semibold uppercase"
            style={{ color: INK, letterSpacing: "1px" }}
          >
            {cardData.name.toUpperCase()}
          </span>
        </footer>
        <div className="px-7 pb-6 text-center">
          <span
            className="mono text-[10px] uppercase"
            style={{ color: INK_3, letterSpacing: "1.5px" }}
          >
            {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accent === "#1a1a1a" ? PURPLE : accent, fontWeight: 600 }}
            >
              OpSolid
            </a>
          </span>
        </div>
      </div>
    </article>
  );
}

function SectLabel({ name, idx }: { name: string; idx: string }) {
  return (
    <div
      className="mb-5 flex items-baseline justify-between pb-3.5"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="text-[13px] font-semibold uppercase"
        style={{ color: INK, letterSpacing: "0.5px" }}
      >
        {name}
      </span>
      <span
        className="mono text-[10px]"
        style={{ color: INK_3, letterSpacing: "1.5px" }}
      >
        / {idx}
      </span>
    </div>
  );
}

function DetailRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className="grid items-start gap-4 py-3 text-[13px]"
      style={{
        gridTemplateColumns: "110px 1fr",
        borderBottom: last ? "none" : `1px solid ${LINE}`,
      }}
    >
      <span
        className="mono pt-0.5 text-[10px] uppercase"
        style={{ color: INK_3, letterSpacing: "1.5px" }}
      >
        {k}
      </span>
      <span className="text-[14px] font-medium" style={{ color: INK }}>
        {v}
      </span>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const djPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 73,
  key: "dj-pure",
  name: "DJ — Pure",
  industry: "DJ / Press kit",
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
    brandPrimaryHex: "#ffffff",
    brandAccentHex: "#1a1a1a",
  },
  sampleSlug: "demo-dj-pure",
};

// photo: Unsplash, DJ portrait. Unsplash License — free, no attribution required.
export const djPureSample: SampleData = {
  templateId: 73,
  slug: "demo-dj-pure",
  cardData: {
    name: "DJ KAYA",
    position: "DJ & Producer",
    title: "Resident DJ",
    company: "DJ KAYA Music",
    email: "booking@djkaya.de",
    phone: "+49 178 445 1234",
    whatsapp: "+49 178 445 1234",
    website: "djkaya.de",
    address: "Köpenicker Str. 70, 10179 Berlin",
    bio: "House, deep techno und afro house sınırında ses tasarımı. 10 yıldır kulüp, festival ve radyo session'ları.",
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
        title: "Deep Sessions Vol. 14",
        description: "Recorded at Tresor",
        priceLabel: "62:40",
      },
      {
        title: "Bosphorus After Dark",
        description: "Live set / 2026",
        priceLabel: "75:18",
      },
      {
        title: "Afro House Selects",
        description: "Studio mix",
        priceLabel: "58:22",
      },
      {
        title: "Melodic Techno Edits",
        description: "DJ tools",
        priceLabel: "48:55",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571266028243-d220c6a35c92?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#ffffff",
  brandAccentHex: "#1a1a1a",
};

