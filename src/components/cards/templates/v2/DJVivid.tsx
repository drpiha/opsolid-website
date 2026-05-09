"use client";

// =============================================================================
// DJVivid — v2 template (id=74, key="dj-vivid").
//
// Sector: DJ / Music — VIVID variant. Mood: festival main-stage energy with
// electric yellow/black contrast and neon purple-amber gradients. Inspired by
// kart_06_dj_vivid.html.
//
// Design DNA (different from default Studio.tsx, MusicProducer, DJNoir, DJPure):
//   - Deep midnight gradient hero (indigo→violet→navy) with radial neon glows.
//   - Live booking dot pulse + Bebas Neue mega name with rainbow gradient text.
//   - Floating white card crashes into the hero (-72 px) with 80×80 photo,
//     gradient genre pills, and 3-up gradient stat numbers.
//   - Bebas Neue 32px section titles with thick rainbow rule on the left.
//   - Event cards with 64×64 gradient date tile, "Main Stage" amber pill.
//   - 4-up branded social tiles (IG/Spotify/SC/YouTube colors).
//   - Big neon-purple-to-amber primary CTA + ghost mail row.
//   - Footer pulled into electric yellow band — distinctive festival ID.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#eab308";
const LOCKED_ACCENT = "#000000";
const PAGE = "#f4f3f8";
const SURFACE = "#ffffff";
const HERO_GRAD =
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)";
const PURPLE = "#a855f7";
const AMBER = "#f59e0b";
const PILL_GRAD = "linear-gradient(135deg, #a855f7 0%, #f59e0b 100%)";
const INK = "#1a1a2e";
const INK_2 = "#4a4a5e";
const MUTED = "#7e7e95";
const LINE = "#ece9f3";
const ELECTRIC = "#eab308";

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
  liveBadge: string;
  heroSub: string;
  upcomingH: string;
  listenH: string;
  bookH: string;
  bookBtn: string;
  scanLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  yearsLabel: string;
  eventsLabel: string;
  spotifyLabel: string;
  badgeMain: string;
  badgeResident: string;
  badgeHeadliner: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    liveBadge: "Live booking 2026",
    heroSub: "Festival DJ — House & Techno",
    upcomingH: "Kommende Sets",
    listenH: "Hör mich",
    bookH: "Booking",
    bookBtn: "Buchungsanfrage senden",
    scanLabel: "Auf der Bühne sehen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    yearsLabel: "Jahre",
    eventsLabel: "Events",
    spotifyLabel: "Spotify",
    badgeMain: "Main Stage",
    badgeResident: "Resident Night",
    badgeHeadliner: "Headliner",
  },
  en: {
    liveBadge: "Live booking 2026",
    heroSub: "Festival DJ — House & Techno",
    upcomingH: "Upcoming sets",
    listenH: "Listen",
    bookH: "Booking",
    bookBtn: "Send booking request",
    scanLabel: "Catch me live",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    yearsLabel: "Years",
    eventsLabel: "Events",
    spotifyLabel: "Spotify",
    badgeMain: "Main Stage",
    badgeResident: "Resident Night",
    badgeHeadliner: "Headliner",
  },
  tr: {
    liveBadge: "Canlı Booking 2026",
    heroSub: "Festival DJ — House & Techno",
    upcomingH: "Yaklaşan Setler",
    listenH: "Beni Dinle",
    bookH: "Booking",
    bookBtn: "Booking Talebi Gönder",
    scanLabel: "Sahnemde Gör",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    yearsLabel: "Yıl",
    eventsLabel: "Event",
    spotifyLabel: "Spotify",
    badgeMain: "Main Stage",
    badgeResident: "Resident Night",
    badgeHeadliner: "Headliner",
  },
  es: {

    liveBadge: "Reserva en directo 2026",
    heroSub: "DJ de festival — House & Techno",
    upcomingH: "Próximos sets",
    listenH: "Escuchar",
    bookH: "Reserva",
    bookBtn: "Enviar solicitud de reserva",
    scanLabel: "Atrápame en vivo",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    yearsLabel: "Años",
    eventsLabel: "Eventos",
    spotifyLabel: "Spotify",
    badgeMain: "Escenario principal",
    badgeResident: "Noche de residente",
    badgeHeadliner: "Cabeza de cartel",
  
  },
  it: {

    liveBadge: "Prenotazione live 2026",
    heroSub: "DJ da festival — House & Techno",
    upcomingH: "Prossimi set",
    listenH: "Ascolta",
    bookH: "Prenotazione",
    bookBtn: "Invia richiesta di prenotazione",
    scanLabel: "Vedimi dal vivo",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    yearsLabel: "Anni",
    eventsLabel: "Eventi",
    spotifyLabel: "Spotify",
    badgeMain: "Palco principale",
    badgeResident: "Resident Night",
    badgeHeadliner: "Headliner",
  
  },
  fr: {

    liveBadge: "Réservation live 2026",
    heroSub: "DJ de festival — House & Techno",
    upcomingH: "Sets à venir",
    listenH: "Écouter",
    bookH: "Réservation",
    bookBtn: "Envoyer la demande de réservation",
    scanLabel: "Attrapez-moi en live",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    yearsLabel: "Années",
    eventsLabel: "Événements",
    spotifyLabel: "Spotify",
    badgeMain: "Scène principale",
    badgeResident: "Soirée résidente",
    badgeHeadliner: "Tête d'affiche",
  
  },
  ar: {

    liveBadge: "حجز مباشر 2026",
    heroSub: "دي جي مهرجان — هاوس وتكنو",
    upcomingH: "العروض القادمة",
    listenH: "استمع",
    bookH: "الحجز",
    bookBtn: "إرسال طلب الحجز",
    scanLabel: "شاهدني مباشراً",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    yearsLabel: "سنوات",
    eventsLabel: "الفعاليات",
    spotifyLabel: "سبوتيفاي",
    badgeMain: "المسرح الرئيسي",
    badgeResident: "ليلة المقيم",
    badgeHeadliner: "نجم العرض",
  
  },
};

interface UpcomingEvent {
  d: string;
  m: string;
  venue: string;
  city: string;
  badge: string;
}

const UPCOMING_FALLBACK: UpcomingEvent[] = [
  { d: "15", m: "JUN", venue: "Watergate", city: "Kreuzberg, DE · 23:00", badge: "Main" },
  { d: "22", m: "JUN", venue: "Tresor", city: "Mitte, DE · 00:00", badge: "Resident" },
  { d: "29", m: "JUN", venue: "Berghain Kantine", city: "Friedrichshain · 22:00", badge: "Headliner" },
];

export function DJVivid({
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

  const services = (cardData.services ?? []).slice(0, 3);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim() || "Berlin";

  const upcoming: UpcomingEvent[] =
    services.length > 0
      ? services.map((s, i) => ({
          d: String(15 + i * 7).padStart(2, "0"),
          m: "JUN",
          venue: s.title,
          city: s.description ?? "",
          badge:
            i === 0 ? t.badgeMain : i === 1 ? t.badgeResident : t.badgeHeadliner,
        }))
      : UPCOMING_FALLBACK;

  const stageName =
    cardData.name.toUpperCase().replace(/^DJ\s+/, "DJ ") || cardData.name;
  const genres = ["House", "Deep Techno", "Afro House", "Melodic"];

  return (
    <article
      data-template="dj-vivid"
      className="djviv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .djviv-card {
          font-family: var(--tpl-font-body, 'Poppins', 'Inter', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .djviv-card .display {
          font-family: var(--tpl-font-display, 'Bebas Neue', 'Anton', 'Inter', sans-serif);
        }
        .djviv-card a { color: inherit; }
        @keyframes djviv-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .djviv-card .pulse { animation: none !important; }
        }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO */}
        <section
          className="relative px-6 pb-[100px] pt-12"
          style={{ background: HERO_GRAD, overflow: "hidden" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(420px 200px at 18% 22%, rgba(168,85,247,0.42), transparent 60%), radial-gradient(320px 160px at 82% 82%, rgba(245,158,11,0.32), transparent 60%)`,
            }}
          />
          <div
            className="relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase"
            style={{
              background: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.22)",
              color: "#fff",
              letterSpacing: "1.5px",
            }}
          >
            <span
              aria-hidden
              className="pulse block h-2 w-2 rounded-full"
              style={{
                background: "#10b981",
                animation: "djviv-pulse 1.5s ease-in-out infinite",
              }}
            />
            {t.liveBadge}
          </div>
          <h1
            className="display relative mt-6 leading-[0.85]"
            style={{
              fontSize: "clamp(64px, 18vw, 96px)",
              letterSpacing: "3px",
              background:
                "linear-gradient(135deg, #fff 0%, #a855f7 50%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stageName}
          </h1>
          <div
            className="relative mt-3 text-[13px] font-medium uppercase"
            style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "2px" }}
          >
            {cardData.title || cardData.position || t.heroSub} · {cityFromAddress}
          </div>
        </section>

        {/* FLOATING CARD */}
        <div
          className="relative z-10 -mt-[72px] mx-4 rounded-[20px] p-6"
          style={{
            background: SURFACE,
            boxShadow: "0 24px 60px rgba(48,43,99,0.18)",
          }}
        >
          <div className="mb-5 flex items-center gap-4">
            {photoUrl && (
              <div
                className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[20px]"
                style={{
                  border: "3px solid #fff",
                  boxShadow: "0 8px 24px rgba(168,85,247,0.32)",
                }}
              >
                <Image
                  src={photoUrl}
                  alt={cardData.name}
                  fill
                  unoptimized
                  className="object-cover tpl-photo"
                  sizes="80px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2
                className="text-[20px] font-bold leading-tight"
                style={{ color: INK, letterSpacing: "-0.2px" }}
              >
                {cardData.name}
              </h2>
              <div
                className="mt-1 text-[12px] font-semibold uppercase"
                style={{ color: PURPLE, letterSpacing: "1px" }}
              >
                {cityFromAddress}, {cardData.position || "DJ"}
              </div>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span
                key={g}
                className="rounded-full border px-3 py-1.5 text-[11px] font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(245,158,11,0.12))",
                  borderColor: "rgba(168,85,247,0.22)",
                  color: PURPLE,
                }}
              >
                {g}
              </span>
            ))}
          </div>

          <div
            className="grid grid-cols-3 gap-2 pt-4"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <VividStat n="10" l={t.yearsLabel} />
            <VividStat n="450+" l={t.eventsLabel} />
            <VividStat n="85K" l={t.spotifyLabel} />
          </div>
        </div>

        {/* UPCOMING */}
        <section className="px-5 pt-8">
          <SectTitle text={t.upcomingH} />
          <div className="grid gap-3.5">
            {upcoming.map((e, i) => (
              <div
                key={`${e.venue}-${i}`}
                className="flex items-center gap-4 rounded-[16px] border p-[18px]"
                style={{
                  background:
                    "linear-gradient(135deg, #faf8ff 0%, #fff7ed 100%)",
                  borderColor: LINE,
                }}
              >
                <div
                  className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-[14px] text-white"
                  style={{
                    background: PILL_GRAD,
                    boxShadow: "0 8px 20px rgba(168,85,247,0.32)",
                  }}
                >
                  <span
                    className="display text-[26px] leading-none"
                    style={{ letterSpacing: "1px" }}
                  >
                    {e.d}
                  </span>
                  <span
                    className="mt-0.5 text-[10px] font-bold"
                    style={{ letterSpacing: "1px" }}
                  >
                    {e.m}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[15px] font-bold leading-tight"
                    style={{ color: INK }}
                  >
                    {e.venue}
                  </div>
                  {e.city && (
                    <div
                      className="mt-0.5 text-[12px] font-medium"
                      style={{ color: MUTED }}
                    >
                      {e.city}
                    </div>
                  )}
                  <span
                    className="mt-1.5 inline-block rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase"
                    style={{
                      background: "rgba(245,158,11,0.16)",
                      color: AMBER,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {e.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LISTEN — branded social tiles */}
        {cardData.socials && (
          <section className="px-5 pt-8">
            <SectTitle text={t.listenH} />
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  k: "instagram",
                  label: "Instagram",
                  bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                },
                {
                  k: "youtube",
                  label: "YouTube",
                  bg: "#ff0000",
                },
                {
                  k: "tiktok",
                  label: "TikTok",
                  bg: "#000000",
                },
                {
                  k: "linkedin",
                  label: "LinkedIn",
                  bg: "#0077b5",
                },
                {
                  k: "facebook",
                  label: "Facebook",
                  bg: "#1877f2",
                },
                {
                  k: "xing",
                  label: "Xing",
                  bg: "#006567",
                },
              ]
                .filter(
                  (s) =>
                    typeof (cardData.socials as Record<string, string | undefined>)[
                      s.k
                    ] === "string",
                )
                .slice(0, 4)
                .map((s) => (
                  <a
                    key={s.k}
                    href={(cardData.socials as Record<string, string>)[s.k]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-[14px] border bg-white p-3.5 text-[13px] font-semibold"
                    style={{ borderColor: LINE, color: INK }}
                  >
                    <span
                      aria-hidden
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[12px] text-white"
                      style={{ background: s.bg }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                    {s.label}
                  </a>
                ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-5 pb-8 pt-8">
          {(waDigits || phoneDigits) && (
            <a
              href={
                waDigits
                  ? `https://wa.me/${waDigits}?text=${encodeURIComponent("Booking — DJ Set")}`
                  : `tel:${phoneDigits}`
              }
              target={waDigits ? "_blank" : undefined}
              rel={waDigits ? "noopener noreferrer" : undefined}
              className="display flex w-full items-center justify-center gap-2.5 rounded-[16px] px-5 py-[18px] text-[18px] uppercase text-white"
              style={{
                background: PILL_GRAD,
                letterSpacing: "1.5px",
                boxShadow: "0 14px 36px rgba(168,85,247,0.42)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              {t.bookBtn}
            </a>
          )}
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] border px-4 py-3.5 text-[13px] font-semibold"
              style={{ borderColor: LINE, color: INK_2 }}
            >
              {cardData.email}
            </a>
          )}
        </section>

        {/* CONTACT (compact strip) */}
        <section
          className="px-5 pb-2"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div className="pt-6">
            <ContactRows
              cardData={cardData}
              locale={locale}
              variant="compact"
              accentHex={PURPLE}
            />
          </div>
        </section>

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="px-5 py-7"
          style={{
            background: "linear-gradient(135deg, #faf8ff 0%, #fff7ed 100%)",
            borderTop: `1px solid ${LINE}`,
          }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={PURPLE} locale={locale} />
          <ExchangeSlot slug={slug} primary={PURPLE} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="border-t px-5 py-6"
            labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
          >
            <div style={{ ["--card-primary" as string]: PURPLE }}>{walletSlot}</div>
          </WalletDock>
        )}

        {/* QR / Stage tease */}
        <section className="mx-5 mb-5 mt-2 rounded-[20px] px-6 py-7 text-center text-white"
          style={{ background: PILL_GRAD, boxShadow: "0 16px 40px rgba(168,85,247,0.32)" }}
        >
          <div
            className="text-[11px] font-semibold uppercase opacity-90"
            style={{ letterSpacing: "2px" }}
          >
            {t.scanLabel}
          </div>
          <div
            className="display mt-3 text-[26px]"
            style={{ letterSpacing: "1.5px" }}
          >
            {cityFromAddress.toUpperCase()}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="px-5 py-5 text-center text-[11px] font-bold uppercase"
          style={{
            background: ELECTRIC,
            color: "#000",
            letterSpacing: "2px",
          }}
        >
          © {new Date().getFullYear()} {cardData.name.toUpperCase()} ·{" "}
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#000", borderBottom: "1.5px solid #000" }}
          >
            OpSolid
          </a>
        </footer>
      </div>
      <span className="hidden">{accent}</span>
    </article>
  );
}

function SectTitle({ text }: { text: string }) {
  return (
    <div className="display mb-5 flex items-center gap-3 text-[28px]"
      style={{ color: INK, letterSpacing: "1.5px" }}
    >
      <span
        aria-hidden
        className="block h-1.5 w-9 rounded-full"
        style={{ background: PILL_GRAD }}
      />
      {text}
    </div>
  );
}

function VividStat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center">
      <div
        className="display text-[28px] leading-none"
        style={{
          background: PILL_GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "1px",
        }}
      >
        {n}
      </div>
      <div
        className="mt-1 text-[10px] font-semibold"
        style={{ color: MUTED, letterSpacing: "0.5px" }}
      >
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const djVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 74,
  key: "dj-vivid",
  name: "DJ — Vivid",
  industry: "DJ / Festival",
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
    brandPrimaryHex: "#eab308",
    brandAccentHex: "#000000",
  },
  sampleSlug: "demo-dj-vivid",
};

// photo: Unsplash, DJ at decks. Unsplash License — free, no attribution required.
export const djVividSample: SampleData = {
  templateId: 74,
  slug: "demo-dj-vivid",
  cardData: {
    name: "DJ KAYA",
    position: "DJ & Producer",
    title: "Festival DJ",
    company: "DJ KAYA Music",
    email: "booking@djkaya.de",
    phone: "+49 178 445 1234",
    whatsapp: "+49 178 445 1234",
    website: "djkaya.de",
    address: "Köpenicker Str. 70, 10179 Berlin",
    bio: "Techno & House DJ aus Berlin. Resident im Tresor & Berghain Kantine.",
    bookingUrl: "https://cal.com/djkaya/booking",
    impressumUrl: "https://djkaya.de/impressum",
    privacyUrl: "https://djkaya.de/datenschutz",
    sectorKey: "music",
    socials: {
      instagram: "https://instagram.com/djkaya",
      youtube: "https://youtube.com/@djkaya",
      tiktok: "https://tiktok.com/@djkaya",
      linkedin: "https://linkedin.com/in/kemalyildiz",
    },
    services: [
      {
        title: "Watergate Berlin",
        description: "Kreuzberg, DE · 23:00",
        priceLabel: "Main Stage",
      },
      {
        title: "Tresor Resident Night",
        description: "Mitte, DE · 00:00",
        priceLabel: "Resident",
      },
      {
        title: "Berghain Kantine",
        description: "Friedrichshain · 22:00",
        priceLabel: "Headliner",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571266028243-d220c6a35c92?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#eab308",
  brandAccentHex: "#000000",
};
