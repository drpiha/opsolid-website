"use client";

// =============================================================================
// FitnessVivid — v2 template (id=90, key="fitness-vivid").
//
// Sector: Fitness / personal training — VIVID variant. Mood: high-energy
// orange/red gradient hero, Poppins display, marketing-led "Apply now" coach.
// Inspired by kart_10_fitness_vivid.html.
//
// Design DNA (different from Athlete.tsx id=10, FitnessNoir/Pure):
//   - Redâ†’orangeâ†’yellow gradient hero with radial blobs and pulsing dot pill.
//   - Float card with rounded photo + role meta + firm sub.
//   - Stat tiles 2×2 with coloured iconography (red / orange / yellow).
//   - Two-column rounded service cards with gradient top stripe + Poppins
//     emoji icons + bold prices.
//   - Red/orange gradient CTA panel with white solid + ghost ghost-white CTAs.
//   - Cream/yellow testimonial panel with star strip + 36px avatar.
//   - Two-column rounded contact tiles with gradient text accents.
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

const LOCKED_PRIMARY = "#ea580c";
const LOCKED_ACCENT = "#f97316";
const SURFACE = "#fff5ee";
const CARD = "#ffffff";
const RED = "#dc2626";
const ORANGE = "#f97316";
const YELLOW = "#fbbf24";
const INK = "#1c1917";
const INK_SOFT = "#44403c";
const MUTE = "#78716c";
const MUTE_2 = "#a8a29e";
const LINE = "#f0e7e0";

const HERO_GRAD = "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f97316 100%)";

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
  taglineFallback: string;
  pulseLabel: string;
  yearsLabel: string;
  clientsLabel: string;
  igLabel: string;
  ytLabel: string;
  programsEyebrow: string;
  programsH: string;
  ctaTitle: string;
  ctaSub: string;
  ctaCall: string;
  ctaWa: string;
  testiText: string;
  testiName: string;
  testiResult: string;
  contactEyebrow: string;
  contactH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    taglineFallback: "Performance Coach",
    pulseLabel: "Neue Gruppe startet",
    yearsLabel: "Jahre",
    clientsLabel: "Kunden",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    programsEyebrow: "— Programme",
    programsH: "Leistungen & Preise",
    ctaTitle: "Programm starten",
    ctaSub: "Erste Beratung kostenlos. Heute den ersten Schritt machen.",
    ctaCall: "Anrufen",
    ctaWa: "WhatsApp",
    testiText:
      "Cans Programm hat mein Leben verändert. Körperlich und mental fühle ich mich stärker — eine nachhaltige Routine statt eines Crash-Plans.",
    testiName: "Selin K.",
    testiResult: "12 Wochen · -14 kg",
    contactEyebrow: "— Kontakt",
    contactH: "Verbinde dich",
    bookBtn: "Programm starten",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    taglineFallback: "Performance Coach",
    pulseLabel: "New cohort starting",
    yearsLabel: "Years",
    clientsLabel: "Clients",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    programsEyebrow: "— Programs",
    programsH: "Services & Pricing",
    ctaTitle: "Start the program",
    ctaSub: "First consult is free. Take the first step today.",
    ctaCall: "Call now",
    ctaWa: "WhatsApp",
    testiText:
      "Can's program changed my life. Stronger in body and mind — a sustainable habit, not a crash plan.",
    testiName: "Selin K.",
    testiResult: "12 weeks · -14 kg",
    contactEyebrow: "— Contact",
    contactH: "Connect",
    bookBtn: "Start now",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    taglineFallback: "Performance Coach",
    pulseLabel: "Yeni grup başlıyor",
    yearsLabel: "Yıl",
    clientsLabel: "Müşteri",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    programsEyebrow: "— Programlar",
    programsH: "Hizmetler & Fiyatlar",
    ctaTitle: "Programı Başlat",
    ctaSub: "İlk konsültasyon ücretsiz. Bugün adım at.",
    ctaCall: "Hemen Ara",
    ctaWa: "WhatsApp",
    testiText:
      "Can'ın programıyla hayatım değişti. Hem fiziksel hem zihinsel olarak çok daha güçlü hissediyorum.",
    testiName: "Selin K.",
    testiResult: "12 haftada -14 kg",
    contactEyebrow: "— İletişim",
    contactH: "Bağlantı Kur",
    bookBtn: "Programa Başla",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    taglineFallback: "Coach de rendimiento",
    pulseLabel: "Nueva cohorte comenzando",
    yearsLabel: "Años",
    clientsLabel: "Clientes",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    programsEyebrow: "— Programs",
    programsH: "Servicios y tarifas",
    ctaTitle: "Iniciar el programa",
    ctaSub: "La primera consulta es gratis. Da el primer paso hoy.",
    ctaCall: "Llamar ahora",
    ctaWa: "WhatsApp",
    testiText:
      "Can's program changed my life. Stronger in body and mind — a sustainable habit, not a crash plan.",
    testiName: "Selin K.",
    testiResult: "12 weeks · -14 kg",
    contactEyebrow: "— Contact",
    contactH: "Conectar",
    bookBtn: "Empezar ahora",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    taglineFallback: "Performance Coach",
    pulseLabel: "Nuovo gruppo in partenza",
    yearsLabel: "Anni",
    clientsLabel: "Clienti",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    programsEyebrow: "— Programs",
    programsH: "Servizi e prezzi",
    ctaTitle: "Avvia il programma",
    ctaSub: "La prima consulenza è gratuita. Fai il primo passo oggi.",
    ctaCall: "Chiama ora",
    ctaWa: "WhatsApp",
    testiText:
      "Can's program changed my life. Stronger in body and mind — a sustainable habit, not a crash plan.",
    testiName: "Selin K.",
    testiResult: "12 weeks · -14 kg",
    contactEyebrow: "— Contact",
    contactH: "Connetti",
    bookBtn: "Inizia ora",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    taglineFallback: "Coach de performance",
    pulseLabel: "Nouveau groupe en démarrage",
    yearsLabel: "Années",
    clientsLabel: "Clients",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    programsEyebrow: "— Programs",
    programsH: "Services et tarifs",
    ctaTitle: "Démarrer le programme",
    ctaSub: "La première consultation est gratuite. Faites le premier pas aujourd'hui.",
    ctaCall: "Appeler maintenant",
    ctaWa: "WhatsApp",
    testiText:
      "Can's program changed my life. Stronger in body and mind — a sustainable habit, not a crash plan.",
    testiName: "Selin K.",
    testiResult: "12 weeks · -14 kg",
    contactEyebrow: "— Contact",
    contactH: "Connecter",
    bookBtn: "Démarrer maintenant",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    taglineFallback: "مدرب الأداء",
    pulseLabel: "مجموعة جديدة تبدأ",
    yearsLabel: "سنوات",
    clientsLabel: "العملاء",
    igLabel: "إنستغرام",
    ytLabel: "يوتيوب",
    programsEyebrow: "— Programs",
    programsH: "الخدمات والأسعار",
    ctaTitle: "ابدأ البرنامج",
    ctaSub: "الاستشارة الأولى مجانية. اتخذ الخطوة الأولى اليوم.",
    ctaCall: "اتصل الآن",
    ctaWa: "واتساب",
    testiText:
      "Can's program changed my life. Stronger in body and mind — a sustainable habit, not a crash plan.",
    testiName: "Selin K.",
    testiResult: "12 weeks · -14 kg",
    contactEyebrow: "— Contact",
    contactH: "تواصل",
    bookBtn: "ابدأ الآن",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

const SVC_EMOJI = ["\u{1F525}", "\u{1F465}", "\u{1F957}", "\u{1F4AA}", "âš¡"];

export function FitnessVivid({
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

  const services = (cardData.services ?? []).slice(0, 4);
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="fitness-vivid"
      className="fitness-vivid-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK_SOFT }}
    >
      <style jsx global>{`
        .fitness-vivid-card {
          font-family: var(--tpl-font-body, 'Poppins', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .fitness-vivid-card a { color: inherit; }
        @keyframes fitnessVividPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.6); }
          50% { box-shadow: 0 0 0 6px rgba(251,191,36,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fitness-vivid-card .pulse-dot { animation: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-7 pb-28 pt-12"
        style={{ background: HERO_GRAD }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "-30%",
            right: "-25%",
            width: 360,
            height: 360,
            background: `radial-gradient(circle, ${YELLOW}55, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            bottom: "-40%",
            left: "-20%",
            width: 320,
            height: 320,
            background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div className="relative z-[2]">
          <div
            className="mb-4 flex items-center gap-2.5 uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 700,
            }}
          >
            <span
              aria-hidden
              style={{ width: 28, height: 2, background: YELLOW }}
            />
            {cardData.company || t.taglineFallback}
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 11vw, 42px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 0.95,
              letterSpacing: "-1.5px",
            }}
          >
            {nameFirst}
            {nameLast && <span style={{ color: YELLOW }}> {nameLast}</span>}
          </h1>
          {cardData.bio && (
            <p
              className="mt-3.5"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.55,
                maxWidth: "90%",
                fontWeight: 500,
              }}
            >
              {cardData.bio}
            </p>
          )}
          <div
            className="mt-5 inline-flex items-center gap-2"
            style={{
              padding: "7px 14px 7px 12px",
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 50,
              fontSize: 11,
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "0.5px",
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              aria-hidden
              className="pulse-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: YELLOW,
                animation: "fitnessVividPulse 1.8s ease-in-out infinite",
              }}
            />
            {t.pulseLabel}
          </div>
        </div>
      </section>

      {/* FLOAT CARD */}
      <section
        className="relative z-[5] mx-6 -mt-20 px-5 py-5"
        style={{
          background: CARD,
          borderRadius: 22,
          boxShadow:
            "0 20px 50px -20px rgba(220,38,38,0.4), 0 4px 14px rgba(28,25,23,0.08)",
          border: "1px solid #fff",
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
                width: 80,
                height: 80,
                border: "4px solid #fff",
                boxShadow: "0 4px 14px rgba(220,38,38,0.25)",
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 80,
                height: 80,
                background: HERO_GRAD,
                color: "#fff",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "2px",
                color: RED,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {cardData.position || t.taglineFallback}
            </div>
            <div
              className="truncate"
              style={{ fontSize: 18, fontWeight: 700, color: INK }}
            >
              {cardData.name}
            </div>
            <div
              className="truncate"
              style={{ fontSize: 12, color: MUTE, marginTop: 2 }}
            >
              8 {t.yearsLabel} · 600+ {t.clientsLabel.toLowerCase()}
            </div>
          </div>
        </div>
      </section>

      {/* STATS GRID 2x2 */}
      <section className="mx-6 mt-6 grid grid-cols-2 gap-2.5">
        {[
          { num: `8 ${t.yearsLabel}`, lbl: locale === "de" ? "Erfahrung" : locale === "tr" ? "Tecrübe" : "Experience", color: RED, glyph: "M22 12h-4l-3 9L9 3l-3 9H2" },
          { num: "600+", lbl: t.clientsLabel, color: ORANGE, glyph: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7m-4 0a4 4 0 1 1 8 0 a4 4 0 1 1 -8 0" },
          { num: "45K", lbl: t.igLabel, color: "#d97706", glyph: "M3 3h18v18H3z M12 16a4 4 0 1 1 0 -8 a4 4 0 0 1 0 8 z" },
          { num: "28K", lbl: t.ytLabel, color: RED, glyph: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02 15.5 11.75 9.75 8.48 z" },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5"
            style={{
              background: CARD,
              borderRadius: 18,
              padding: 18,
              border: `1px solid ${LINE}`,
              boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
            }}
          >
            <span
              aria-hidden
              className="flex shrink-0 items-center justify-center"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `${s.color}22`,
                color: s.color,
              }}
            >
              <StatGlyph idx={i} />
            </span>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: INK,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <div
                className="mt-1 uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "1.2px",
                  color: MUTE,
                  fontWeight: 600,
                }}
              >
                {s.lbl}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <>
          <SectionHead eb={t.programsEyebrow} h={t.programsH} ebColor={RED} />
          <section className="grid grid-cols-2 gap-3 px-6 pb-2">
            {services.map((svc, i) => {
              const grads = [
                `linear-gradient(90deg, ${RED}, ${ORANGE})`,
                `linear-gradient(90deg, ${ORANGE}, ${YELLOW})`,
                `linear-gradient(90deg, ${YELLOW}, ${ORANGE})`,
                `linear-gradient(90deg, ${RED}, #ec4899)`,
              ];
              const priceColor = i === 0 ? RED : i === 1 ? ORANGE : i === 2 ? "#d97706" : RED;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="relative flex flex-col gap-2 overflow-hidden"
                  style={{
                    background: CARD,
                    borderRadius: 18,
                    padding: "20px 16px 16px",
                    border: `1px solid ${LINE}`,
                    boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: grads[i % grads.length],
                    }}
                  />
                  <div style={{ fontSize: 22 }} aria-hidden>
                    {SVC_EMOJI[i % SVC_EMOJI.length]}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: INK,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="flex-1"
                      style={{
                        fontSize: 11,
                        color: MUTE,
                        lineHeight: 1.45,
                      }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="mt-1"
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: priceColor,
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
          className="relative mx-6 mt-7 overflow-hidden px-5 py-7 text-center"
          style={{
            background: `linear-gradient(135deg, ${RED} 0%, ${ORANGE} 100%)`,
            borderRadius: 22,
            color: "#fff",
            boxShadow: `0 14px 36px -10px ${RED}90`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: "-40%",
              right: "-30%",
              width: 220,
              height: 220,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              bottom: "-60%",
              left: "-20%",
              width: 200,
              height: 200,
              background: `${YELLOW}33`,
              borderRadius: "50%",
            }}
          />
          <div className="relative z-[2]">
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {t.ctaTitle}
            </div>
            <div
              className="mt-2"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.92)" }}
            >
              {t.ctaSub}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {callHref && (
                <a
                  href={callHref}
                  className="px-3.5 py-3.5"
                  style={{
                    background: "#fff",
                    color: RED,
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.3px",
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
                  className="px-3.5 py-3.5"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.5)",
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.3px",
                  }}
                >
                  {t.ctaWa}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      <section
        className="relative mx-6 mt-7 px-5 py-7"
        style={{
          background: "linear-gradient(135deg, #fff 0%, #fef3c7 100%)",
          borderRadius: 22,
          border: `1px solid ${LINE}`,
          boxShadow: "0 4px 14px rgba(28,25,23,0.06)",
        }}
      >
        <div className="mb-3 flex gap-1">
          {[0, 1, 2, 3, 4].map((s) => (
            <svg
              key={s}
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill={ORANGE}
              aria-hidden
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: INK,
            fontWeight: 500,
          }}
        >
          {t.testiText}
        </p>
        <div
          className="mt-3.5 flex items-center gap-3 pt-3"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div
            className="flex shrink-0 items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${ORANGE}, ${YELLOW})`,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {t.testiName[0]}
          </div>
          <div>
            <div
              style={{ fontSize: 12, fontWeight: 700, color: INK }}
            >
              {t.testiName}
            </div>
            <div
              className="mt-0.5"
              style={{ fontSize: 11, color: ORANGE, fontWeight: 700 }}
            >
              {t.testiResult}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <SectionHead eb={t.contactEyebrow} h={t.contactH} ebColor={RED} />
      <section className="mx-6 mt-0">
        <div
          className="grid grid-cols-2 gap-2.5"
          style={{ ["--card-primary" as string]: RED } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="tile"
            tone="light"
            accentHex={RED}
          />
        </div>
        {cardData.socials && (
          <div className="mt-5 flex justify-center">
            <SocialRow
              socials={cardData.socials}
              variant="icon"
              accentHex={RED}
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
        <SendMyInfoSlot slug={slug} sourceQs="" primary={RED} locale={locale} />
        <ExchangeSlot slug={slug} primary={RED} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: RED,
              color: INK,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer className="px-7 py-8 text-center">
        <div style={{ fontSize: 13, fontWeight: 800, color: INK }}>
          {(cardData.company || cardData.name).split(" ")[0]}{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${RED}, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
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
            style={{ color: ORANGE }}
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

function StatGlyph({ idx }: { idx: number }) {
  // 0: pulse line, 1: people, 2: instagram, 3: youtube
  if (idx === 0) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={22}
        height={22}
        stroke="currentColor"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={22}
        height={22}
        stroke="currentColor"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    );
  }
  if (idx === 2) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={22}
        height={22}
        stroke="currentColor"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const fitnessVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 90,
  key: "fitness-vivid",
  name: "Fitness — Vivid",
  industry: "Fitness coach / high-energy gradient marketing",
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
  sampleSlug: "demo-fitness-vivid",
};

// photo: Unsplash, https://unsplash.com/photos/8mqOw4DBBSg — Free, no attribution required.
export const fitnessVividSample: SampleData = {
  templateId: 90,
  slug: "demo-fitness-vivid",
  cardData: {
    name: "Can Öztürk",
    position: "Performance Coach",
    title: "Personal Trainer & Fitness Coach",
    company: "CanFit Berlin",
    email: "can@canfit.de",
    phone: "+49 176 778 9012",
    whatsapp: "+49 176 778 9012",
    website: "canfit.de",
    address: "Kastanienallee 24, 10435 Berlin",
    bio: "Beslenme + antrenman + zihinsel güç. Senin dönüşümün için bilim temelli koçluk.",
    bookingUrl: "https://cal.com/canfit/intro",
    impressumUrl: "https://canfit.de/impressum",
    privacyUrl: "https://canfit.de/datenschutz",
    sectorKey: "fitness",
    socials: {
      instagram: "https://instagram.com/canfit.berlin",
      youtube: "https://youtube.com/CanFit",
    },
    services: [
      { title: "1-1 Online Koçluk", description: "Kişiye özel program + haftalık takip", priceLabel: "â‚¬199/Monat" },
      { title: "Grup Koçluk", description: "Online grup dersleri + topluluk", priceLabel: "â‚¬69/Monat" },
      { title: "Beslenme Planı", description: "Tek seferlik makro planlama", priceLabel: "â‚¬129/paket" },
      { title: "12 Hafta Dönüşüm", description: "Antrenman + beslenme + takip", priceLabel: "â‚¬899/paket" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

