"use client";

// =============================================================================
// ClinicStone — v2 template (id=71, key="clinic-stone").
//
// Sector: Doctor / Clinic — STONE variant. Mood: warm grey/sage calming
// wellness clinic, holistic, Playfair display + Nunito body.
// Inspired by kart_05_doktor_stone.html.
//
// Design DNA (different from default Clinic.tsx):
//   - Warm cream background, framed cards, holistic clinic aesthetic.
//   - Header with stamp pill + "Holistik Yaklaşım" cap title + clinic name.
//   - SVG wave divider transitioning into card surface.
//   - Big circular gold-sage gradient ring portrait, sepia tone.
//   - Italic Playfair name with sage accent, ornament glyph row.
//   - Framed "Yaklaşımım" philosophy section with gold rule decoration.
//   - Specialty list with circular sage icon chips.
//   - Roman-numbered (I·II·III·IV) "Süreciniz" steps.
//   - Quote block on darker cream gradient.
//   - Pill CTAs (sage filled + line variants).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Calendar, Heart, Stethoscope } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#4a5568";
const LOCKED_ACCENT = "#68a09a";
const PAGE = "#f0ebe4";
const SURFACE = "#fdf8f3";
const SURFACE_2 = "#f7f0e6";
const SAGE_DARK = "#365e54";
const GOLD = "#b8951e";
const INK = "#1e2d26";
const INK_SOFT = "#6b7c72";
const HAIRLINE = "#dcd4c5";

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
  stamp: string;
  preH: string;
  approachH: string;
  approachSub: string;
  servicesH: string;
  servicesSub: string;
  stepsH: string;
  stepsSub: string;
  contactH: string;
  bookBtn: string;
  emailBtn: string;
  mapBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  steps: { h: string; p: string }[];
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    stamp: "M.D. — Fachärztin · Est. 2014",
    preH: "Ganzheitlicher Ansatz",
    approachH: "Mein Ansatz",
    approachSub: "Ganzheitliche Heilung",
    servicesH: "Leistungen",
    servicesSub: "Bereiche, in denen ich Sie begleite",
    stepsH: "Ihr Termin-Ablauf",
    stepsSub: "Schritt für Schritt",
    contactH: "Kontakt",
    bookBtn: "Termin anfragen",
    emailBtn: "E-Mail",
    mapBtn: "Anfahrt",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    steps: [
      {
        h: "Erster Kontakt",
        p: "Per WhatsApp oder Telefon — kurze Schilderung Ihrer Situation.",
      },
      {
        h: "Termin & Vorbereitung",
        p: "Ein passender Termin wird gefunden, Erinnerung wird gesendet.",
      },
      {
        h: "Untersuchung & Plan",
        p: "Detaillierte Anamnese, individueller Behandlungsplan gemeinsam.",
      },
      {
        h: "Begleitung",
        p: "Regelmäßige Nachsorge und persönliche Beratung im Verlauf.",
      },
    ],
  },
  en: {
    stamp: "M.D. — Specialist · Est. 2014",
    preH: "Holistic approach",
    approachH: "My approach",
    approachSub: "Whole-person healing",
    servicesH: "Services",
    servicesSub: "Where I can accompany you",
    stepsH: "Your appointment flow",
    stepsSub: "Step by step",
    contactH: "Contact",
    bookBtn: "Request appointment",
    emailBtn: "Email",
    mapBtn: "Directions",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    steps: [
      { h: "First contact", p: "Reach out by WhatsApp or phone — describe briefly." },
      { h: "Appointment", p: "We find a suitable time and send a reminder." },
      { h: "Consultation", p: "Thorough exam, plan tailored to you." },
      { h: "Follow-up", p: "Regular check-ins and personal guidance." },
    ],
  },
  tr: {
    stamp: "M.D. — Fachärztin · Est. 2014",
    preH: "Bütünsel Yaklaşım",
    approachH: "Yaklaşımım",
    approachSub: "Bütünsel iyileşme felsefesi",
    servicesH: "Hizmetler",
    servicesSub: "Sizinle birlikte ilerlediğim alanlar",
    stepsH: "Randevu Süreciniz",
    stepsSub: "Adım adım rehber",
    contactH: "İletişim",
    bookBtn: "Randevu Al",
    emailBtn: "E-posta",
    mapBtn: "Konum",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    steps: [
      { h: "İlk İletişim", p: "WhatsApp veya telefonla durumunuzu kısaca paylaşın." },
      { h: "Randevu Planı", p: "Uygun saat bulunur, hatırlatma gönderilir." },
      { h: "Muayene & Plan", p: "Detaylı muayene sonrası kişiye özel plan." },
      { h: "Takip Süreci", p: "Düzenli takip ve bireysel danışmanlık." },
    ],
  },
  es: {

    stamp: "M.D. — Specialist · Est. 2014",
    preH: "Enfoque holístico",
    approachH: "Mi enfoque",
    approachSub: "Sanación integral",
    servicesH: "Servicios",
    servicesSub: "Dónde puedo acompañarte",
    stepsH: "Tu flujo de cita",
    stepsSub: "Paso a paso",
    contactH: "Contacto",
    bookBtn: "Solicitar cita",
    emailBtn: "Correo",
    mapBtn: "Cómo llegar",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    steps: [
      { h: "First contact", p: "Reach out by WhatsApp or phone — describe briefly." },
      { h: "Appointment", p: "We find a suitable time and send a reminder." },
      { h: "Consultation", p: "Thorough exam, plan tailored to you." },
      { h: "Follow-up", p: "Regular check-ins and personal guidance." },
    ],
  
  },
  it: {

    stamp: "M.D. — Specialist · Est. 2014",
    preH: "Approccio olistico",
    approachH: "Il mio approccio",
    approachSub: "Guarigione integrale",
    servicesH: "Servizi",
    servicesSub: "Dove posso accompagnarti",
    stepsH: "Il tuo percorso di appuntamento",
    stepsSub: "Passo dopo passo",
    contactH: "Contatto",
    bookBtn: "Richiedi appuntamento",
    emailBtn: "Email",
    mapBtn: "Indicazioni",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    steps: [
      { h: "First contact", p: "Reach out by WhatsApp or phone — describe briefly." },
      { h: "Appointment", p: "We find a suitable time and send a reminder." },
      { h: "Consultation", p: "Thorough exam, plan tailored to you." },
      { h: "Follow-up", p: "Regular check-ins and personal guidance." },
    ],
  
  },
  fr: {

    stamp: "M.D. — Specialist · Est. 2014",
    preH: "Approche holistique",
    approachH: "Mon approche",
    approachSub: "Guérison globale",
    servicesH: "Services",
    servicesSub: "Où je peux vous accompagner",
    stepsH: "Votre parcours de rendez-vous",
    stepsSub: "Étape par étape",
    contactH: "Contact",
    bookBtn: "Demander un rendez-vous",
    emailBtn: "E-mail",
    mapBtn: "Itinéraire",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    steps: [
      { h: "First contact", p: "Reach out by WhatsApp or phone — describe briefly." },
      { h: "Appointment", p: "We find a suitable time and send a reminder." },
      { h: "Consultation", p: "Thorough exam, plan tailored to you." },
      { h: "Follow-up", p: "Regular check-ins and personal guidance." },
    ],
  
  },
  ar: {

    stamp: "M.D. — Specialist · Est. 2014",
    preH: "نهج شامل",
    approachH: "نهجي",
    approachSub: "شفاء شامل",
    servicesH: "الخدمات",
    servicesSub: "حيث يمكنني مرافقتك",
    stepsH: "مسار موعدك",
    stepsSub: "خطوة بخطوة",
    contactH: "اتصال",
    bookBtn: "طلب موعد",
    emailBtn: "البريد الإلكتروني",
    mapBtn: "الاتجاهات",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    steps: [
      { h: "First contact", p: "Reach out by WhatsApp or phone — describe briefly." },
      { h: "Appointment", p: "We find a suitable time and send a reminder." },
      { h: "Consultation", p: "Thorough exam, plan tailored to you." },
      { h: "Follow-up", p: "Regular check-ins and personal guidance." },
    ],
  
  },
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function ClinicStone({
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
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 4);
  const testimonial = cardData.testimonials?.[0];

  const titleMatch = cardData.name.match(/^(Dr\.?|Prof\.?|Dipl\.?|Mr\.?|Mrs\.?|Ms\.?|Av\.?)\s+/i);
  let prefix = "";
  let restName = cardData.name;
  if (titleMatch) {
    prefix = titleMatch[1];
    restName = cardData.name.slice(titleMatch[0].length);
  }

  return (
    <article
      data-template="clinic-stone"
      className="cstone-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .cstone-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .cstone-card .serif {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Cormorant Garamond', Georgia, serif);
        }
        .cstone-card a { color: inherit; }
      `}</style>

      {/* WARM HEADER */}
      <header
        className="relative px-7 pt-9 text-center"
        style={{
          background: `linear-gradient(180deg,#ede4d3 0%,${PAGE} 100%)`,
        }}
      >
        <div
          className="serif mb-3.5 inline-block px-4 py-1.5 italic"
          style={{
            border: `1px solid ${accent}`,
            borderRadius: 999,
            background: `${accent}10`,
            color: accent,
            fontSize: 11,
            letterSpacing: "1px",
          }}
        >
          {t.stamp}
        </div>
        <h1
          className="serif mb-1.5 text-[13px] uppercase"
          style={{ color: INK_SOFT, letterSpacing: "5px", fontWeight: 400 }}
        >
          {t.preH}
        </h1>
        <div
          className="serif text-[24px] font-bold"
          style={{ color: INK }}
        >
          {cardData.company || cardData.name}
        </div>
      </header>

      {/* SVG WAVE */}
      <svg
        viewBox="0 0 460 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full"
        style={{ height: 60 }}
      >
        <path
          d="M0,30 C115,60 230,0 345,30 C400,45 430,40 460,30 L460,60 L0,60 Z"
          fill={SURFACE}
        />
      </svg>

      {/* PROFILE */}
      <section
        className="px-7 pb-7 pt-2 text-center"
        style={{ background: SURFACE }}
      >
        <div
          className="mx-auto mb-5"
          style={{
            width: 140,
            height: 140,
            padding: 5,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent} 0%, ${GOLD} 100%)`,
            boxShadow: `0 8px 32px -8px ${accent}59`,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={130}
              height={130}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{
                border: `4px solid ${SURFACE}`,
                filter: "sepia(0.1) saturate(0.95)",
              }}
            />
          ) : (
            <div
              className="serif flex h-full w-full items-center justify-center rounded-full text-[40px]"
              style={{
                background: SURFACE,
                color: accent,
                border: `4px solid ${SURFACE}`,
                fontWeight: 700,
              }}
            >
              {restName
                .split(" ")
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")}
            </div>
          )}
        </div>
        <h2
          className="serif mb-1.5 text-[32px] leading-[1.1]"
          style={{ color: INK, fontWeight: 700 }}
        >
          {prefix && (
            <span
              className="font-normal italic"
              style={{ color: accent, fontWeight: 400 }}
            >
              {prefix}{" "}
            </span>
          )}
          {restName}
        </h2>
        {(cardData.title || cardData.position) && (
          <p
            className="serif mb-3.5 text-[15px] italic"
            style={{ color: INK_SOFT, fontWeight: 400 }}
          >
            {cardData.title || cardData.position}
          </p>
        )}
        <div
          className="flex items-center justify-center gap-3.5"
          style={{ color: GOLD, fontSize: 14 }}
        >
          <span aria-hidden style={{ width: 40, height: 1, background: GOLD, opacity: 0.4 }} />
          <span aria-hidden>❋</span>
          <span aria-hidden style={{ width: 40, height: 1, background: GOLD, opacity: 0.4 }} />
        </div>
      </section>

      {/* APPROACH SECTION */}
      {cardData.bio && (
        <section className="mx-4 mb-5">
          <div
            className="px-6 py-7"
            style={{
              background: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 14,
              boxShadow: `0 4px 16px -4px ${accent}14`,
            }}
          >
            <h3
              className="serif mb-1.5 text-center text-[20px] font-bold"
              style={{ color: INK }}
            >
              {t.approachH}
            </h3>
            <p
              className="serif mb-5 text-center text-[12.5px] italic"
              style={{ color: accent, letterSpacing: "0.5px" }}
            >
              {t.approachSub}
            </p>
            <div className="px-2 text-center">
              <span
                aria-hidden
                className="mx-auto mb-4 block"
                style={{ width: 32, height: 1, background: GOLD, opacity: 0.5 }}
              />
              <p
                className="serif text-[16px] italic leading-[1.7]"
                style={{ color: INK, fontWeight: 400 }}
              >
                {cardData.bio}
              </p>
              <span
                aria-hidden
                className="mx-auto mt-4 block"
                style={{ width: 32, height: 1, background: GOLD, opacity: 0.5 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="mx-4 mb-5">
          <div
            className="px-6 py-7"
            style={{
              background: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 14,
              boxShadow: `0 4px 16px -4px ${accent}14`,
            }}
          >
            <h3
              className="serif mb-1.5 text-center text-[20px] font-bold"
              style={{ color: INK }}
            >
              {t.servicesH}
            </h3>
            <p
              className="serif mb-5 text-center text-[12.5px] italic"
              style={{ color: accent, letterSpacing: "0.5px" }}
            >
              {t.servicesSub}
            </p>
            <div className="grid gap-3">
              {services.map((svc, i) => (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex items-center gap-3.5 px-4 py-3.5"
                  style={{
                    background: SURFACE_2,
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: `${accent}1f`,
                      color: accent,
                    }}
                  >
                    {i % 2 === 0 ? (
                      <Heart size={18} strokeWidth={2} />
                    ) : (
                      <Stethoscope size={18} strokeWidth={2} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-[14px] font-semibold leading-tight"
                      style={{ color: INK }}
                    >
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div
                        className="mt-0.5 text-[12px]"
                        style={{ color: INK_SOFT }}
                      >
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="serif text-[13px] italic"
                      style={{ color: GOLD }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </ServiceLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STEPS */}
      <section className="mx-4 mb-5">
        <div
          className="px-6 py-7"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 14,
            boxShadow: `0 4px 16px -4px ${accent}14`,
          }}
        >
          <h3
            className="serif mb-1.5 text-center text-[20px] font-bold"
            style={{ color: INK }}
          >
            {t.stepsH}
          </h3>
          <p
            className="serif mb-5 text-center text-[12.5px] italic"
            style={{ color: accent, letterSpacing: "0.5px" }}
          >
            {t.stepsSub}
          </p>
          <div className="flex flex-col gap-4">
            {t.steps.map((step, i) => (
              <div
                key={i}
                className="grid items-start gap-3.5"
                style={{ gridTemplateColumns: "48px 1fr" }}
              >
                <div
                  className="serif flex flex-shrink-0 items-center justify-center text-[18px] font-bold"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: accent,
                    color: SURFACE,
                    boxShadow: `0 4px 14px -4px ${accent}80`,
                  }}
                >
                  {ROMAN[i]}
                </div>
                <div>
                  <h4
                    className="serif mb-1 text-[15px] font-bold"
                    style={{ color: INK }}
                  >
                    {step.h}
                  </h4>
                  <p
                    className="text-[13px] leading-[1.5]"
                    style={{ color: INK_SOFT }}
                  >
                    {step.p}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      {testimonial && (
        <div
          className="relative mx-4 mb-5 overflow-hidden px-7 py-8 text-center"
          style={{
            background: "linear-gradient(135deg,#ede4d3 0%,#e6dac5 100%)",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 14,
          }}
        >
          <span
            aria-hidden
            className="serif absolute"
            style={{
              top: -12,
              left: 18,
              fontSize: 90,
              fontWeight: 700,
              color: GOLD,
              opacity: 0.4,
              lineHeight: 1,
            }}
          >
            {"“"}
          </span>
          <p
            className="serif relative mb-3.5 text-[16px] italic leading-[1.7]"
            style={{ color: INK, fontWeight: 400 }}
          >
            {testimonial.quote}
          </p>
          <div
            className="text-[11.5px] font-bold uppercase"
            style={{ color: SAGE_DARK, letterSpacing: "2px" }}
          >
            — {testimonial.author}
            {testimonial.role ? ` · ${testimonial.role}` : ""}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mx-4 mb-5 flex flex-col gap-3">
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
            className="flex items-center justify-center gap-2.5 px-6 py-4 text-[14px] font-bold"
            style={{
              background: accent,
              color: SURFACE,
              borderRadius: 999,
              letterSpacing: "0.5px",
              boxShadow: `0 6px 20px -6px ${accent}80`,
            }}
          >
            <Calendar size={18} strokeWidth={2} />
            {t.bookBtn}
          </a>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="flex items-center justify-center px-6 py-3.5 text-[13px] font-bold"
              style={{
                background: SURFACE,
                color: INK,
                border: `1.5px solid ${HAIRLINE}`,
                borderRadius: 999,
              }}
            >
              {t.emailBtn}
            </a>
          )}
          {cardData.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-3.5 text-[13px] font-bold"
              style={{
                background: SURFACE,
                color: INK,
                border: `1.5px solid ${HAIRLINE}`,
                borderRadius: 999,
              }}
            >
              {t.mapBtn}
            </a>
          )}
        </div>
      </div>

      {/* CONTACT */}
      <section className="mx-4 mb-5">
        <div
          className="px-6 py-6"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 14,
          }}
        >
          <h3
            className="serif mb-4 text-center text-[16px] italic"
            style={{ color: accent }}
          >
            — {t.contactH} —
          </h3>
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            accentHex={accent}
          />
        </div>
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-4 mb-5 rounded-[14px] px-6 py-6"
        style={{
          background: SURFACE_2,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-4 mb-5 rounded-[14px] px-6 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              background: SURFACE,
              borderRadius: 14,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section className="mx-4 mb-5 px-6 py-5">
          <SocialRow socials={cardData.socials} variant="icon" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-5 py-6 text-center"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="serif text-[12px] italic"
          style={{ color: INK_SOFT }}
        >
          — {cardData.company || cardData.name} · {new Date().getFullYear()} ·{" "}
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accent, fontWeight: 700 }}
          >
            OpSolid
          </a>
          {" "}—
        </div>
      </footer>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const clinicStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 71,
  key: "clinic-stone",
  name: "Clinic — Stone",
  industry: "Doctor / Holistic clinic",
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
  defaults: {
    brandPrimaryHex: "#4a5568",
    brandAccentHex: "#68a09a",
  },
  sampleSlug: "demo-clinic-stone",
};

// photo: Unsplash, doctor portrait. Unsplash License — free, no attribution required.
export const clinicStoneSample: SampleData = {
  templateId: 71,
  slug: "demo-clinic-stone",
  cardData: {
    name: "Dr. Ayşe Demir",
    position: "Fachärztin",
    title: "Allgemeinmedizin & Präventivmedizin",
    company: "Praxis am Ku'damm",
    email: "ayse@praxis-demir.de",
    phone: "+49 30 334 5678",
    whatsapp: "+49 170 334 5678",
    website: "praxis-demir.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "Fachärztin für Allgemeinmedizin & Präventivmedizin. Individuell, ganzheitlich, digital erreichbar.",
    bookingUrl: "https://cal.com/praxis-demir/intro",
    brochureUrl: "https://praxis-demir.de/profil.pdf",
    impressumUrl: "https://praxis-demir.de/impressum",
    privacyUrl: "https://praxis-demir.de/datenschutz",
    sectorKey: "clinic",
    socials: {
      linkedin: "https://linkedin.com/in/ayse-demir-md",
      instagram: "https://instagram.com/praxis.demir",
    },
    services: [
      {
        title: "Vorsorgeuntersuchung",
        description: "Ganzheitlicher Check-up.",
        priceLabel: "ab €80",
      },
      {
        title: "Reisemedizin",
        description: "Impfungen & Notfallset.",
        priceLabel: "€120",
      },
      {
        title: "Online-Konsultation",
        description: "Videosprechstunde, Rezept-Service.",
        priceLabel: "€60",
      },
    ],
    testimonials: [
      {
        author: "Mehmet K.",
        role: "Patient",
        quote:
          "Sehr aufmerksam, nimmt sich Zeit und erklärt alles verständlich. Genau die Praxis, die ich gesucht habe.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#4a5568",
  brandAccentHex: "#68a09a",
};

