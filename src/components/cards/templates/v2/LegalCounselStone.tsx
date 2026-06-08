"use client";

// =============================================================================
// LegalCounselStone — v2 template (id=59, key="legal-counsel-stone").
//
// Sector: Lawyer / Rechtsanwalt — STONE variant. Mood: warm Mayfair-restraint
// taupe / cream paper, Fraunces serif, sepia portrait, paper-warm tiles.
// Inspired by kart_02_avukat_stone.html.
//
// Design DNA:
//   - WARM BANNER: cream gradient with subtle radial glow + faint noise
//     overlay; italic eyebrow line, round photo frame with copper inner
//     ring, Fraunces serif name with italic last word in copper accent,
//     small thin sans title.
//   - WAVE divider (SVG, single curve).
//   - 3 STONE STAT TILES: cream cards, Fraunces serif numerals, copper top
//     bar.
//   - STORY section: italic Fraunces paragraph, copper signature line.
//   - SLOGAN strip: cream tile with small horizontal copper rules left/right.
//   - SVC LIST: cream pill rows with rounded copper-tinted icon cell.
//   - TESTIMONIAL: deeper cream gradient with oversized italic quote glyph
//     and 5-star copper rating.
//   - CONTACT: rounded full-pill rows with circular icon and stacked
//     label/value.
//   - QR FRAME: cream paper with corner bracket markers.
//   - VCARD button: copper rounded pill.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Briefcase,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Scale,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#3d4451";
const LOCKED_ACCENT = "#8a9ba8";
const PAGE = "#ede8e1";
const SURFACE = "#f9f5ef";
const PAPER_WARM = "#f3ede2";
const ACCENT = "#4a3728";
const ACCENT_SOFT = "#6b5340";
const ACCENT_2 = "#8b7355";
const ACCENT_3 = "#b8985f";
const TEXT = "#1e1410";
const TEXT_SOFT = "#6b5c4e";
const BORDER = "#d8cfc0";
const BORDER_SOFT = "#e6dfd0";

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
  eyebrow: string;
  storyH: string;
  storySignature: string;
  servicesH: string;
  contactH: string;
  yearsLabel: string;
  casesLabel: string;
  winRateLabel: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  webBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    eyebrow: "Bauer & Partner — Sorgfalt seit 2005",
    storyH: "Meine Geschichte",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "Was ich tue",
    contactH: "Sprechen wir",
    yearsLabel: "Jahre",
    casesLabel: "Mandate",
    winRateLabel: "Erfolg",
    callBtn: "Telefon",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    webBtn: "Webseite",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    eyebrow: "Bauer & Partner — Diligence since 2005",
    storyH: "My story",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "What I do",
    contactH: "Let's talk",
    yearsLabel: "Years",
    casesLabel: "Mandates",
    winRateLabel: "Win rate",
    callBtn: "Phone",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    webBtn: "Website",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    eyebrow: "Bauer & Partner — 2005'ten beri özen",
    storyH: "Hukuk Hikayem",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "Yapabildiklerim",
    contactH: "Konuşalım",
    yearsLabel: "Yıl",
    casesLabel: "Dava",
    winRateLabel: "Başarı",
    callBtn: "Telefon",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    webBtn: "Web Sitesi",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    eyebrow: "Bauer & Partner — Diligence since 2005",
    storyH: "Mi historia",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "Lo que hago",
    contactH: "Hablemos",
    yearsLabel: "Años",
    casesLabel: "Mandatos",
    winRateLabel: "Tasa de éxito",
    callBtn: "Teléfono",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    webBtn: "Sitio web",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    eyebrow: "Bauer & Partner — Diligence since 2005",
    storyH: "La mia storia",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "Cosa faccio",
    contactH: "Parliamo",
    yearsLabel: "Anni",
    casesLabel: "Mandati",
    winRateLabel: "Tasso di successo",
    callBtn: "Telefono",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    webBtn: "Sito web",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    eyebrow: "Bauer & Partner — Diligence since 2005",
    storyH: "Mon histoire",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "Ce que je fais",
    contactH: "Discutons",
    yearsLabel: "Années",
    casesLabel: "Mandats",
    winRateLabel: "Taux de réussite",
    callBtn: "Téléphone",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    webBtn: "Site web",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    eyebrow: "Bauer & Partner — Diligence since 2005",
    storyH: "قصتي",
    storySignature: "— Dr. Klaus Bauer",
    servicesH: "ما أفعله",
    contactH: "لنتحدث",
    yearsLabel: "سنوات",
    casesLabel: "تكليفات",
    winRateLabel: "معدل النجاح",
    callBtn: "هاتف",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    webBtn: "الموقع",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

const SVC_ICONS = [Scale, Users, Briefcase, Shield, Sparkles];

export function LegalCounselStone({
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

  const services = (cardData.services ?? []).slice(0, 5);
  const testimonial = cardData.testimonials?.[0];

  const nameParts = cardData.name.trim().split(/\s+/);
  const nameLead = nameParts.slice(0, -1).join(" ") || cardData.name;
  const nameTail = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="legal-counsel-stone"
      className="lcs-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .lcs-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.65;
          -webkit-font-smoothing: antialiased;
        }
        .lcs-card .serif {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', Georgia, serif);
        }
        .lcs-card a { color: inherit; }
      `}</style>

      {/* WARM BANNER */}
      <header
        className="relative overflow-hidden px-7 pb-9 pt-12 text-center"
        style={{
          background:
            `radial-gradient(circle at 20% 30%, rgba(184,152,95,0.16) 0%, transparent 45%), radial-gradient(circle at 80% 60%, rgba(74,55,40,0.08) 0%, transparent 50%), linear-gradient(180deg, #f1e9d9 0%, #ebe1cc 100%)`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="serif relative mb-4.5 text-[13px] italic font-normal"
          style={{ color: ACCENT, letterSpacing: "0.5px" }}
        >
          {t.eyebrow}
        </div>

        <div
          className="relative mx-auto mb-5"
          style={{
            width: 132,
            height: 132,
            padding: 6,
            borderRadius: 9999,
            background: SURFACE,
            boxShadow: "0 6px 20px rgba(74,55,40,0.18)",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `1.5px solid ${ACCENT_3}` }}
          />
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={120}
              height={120}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{
                filter: "sepia(0.12) contrast(1.05) saturate(1.05)",
              }}
            />
          ) : (
            <div
              className="serif flex h-full w-full items-center justify-center rounded-full text-[36px]"
              style={{
                background: PAPER_WARM,
                color: ACCENT,
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              {cardData.name.slice(0, 1)}
            </div>
          )}
        </div>

        <h1
          className="serif relative text-[34px] leading-[1.05]"
          style={{ color: TEXT, fontWeight: 600, letterSpacing: "-1px" }}
        >
          {nameLead}
          {nameTail && (
            <em
              className="font-normal italic"
              style={{ color: ACCENT, marginLeft: 8 }}
            >
              {nameTail}
            </em>
          )}
        </h1>
        <div
          className="relative mt-1.5 text-[13px] font-medium leading-[1.5]"
          style={{ color: TEXT_SOFT, letterSpacing: "0.3px" }}
        >
          {[cardData.position, cardData.title].filter(Boolean).join(" · ") ||
            "Senior Counsel"}
        </div>
      </header>

      {/* WAVE DIVIDER */}
      <div
        aria-hidden
        className="block h-8 w-full"
        style={{ background: SURFACE }}
      >
        <svg
          viewBox="0 0 460 32"
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          <path
            d="M0,16 Q57.5,0 115,16 T230,16 T345,16 T460,16 L460,0 L0,0 Z"
            fill="#ebe1cc"
          />
        </svg>
      </div>

      {/* STATS */}
      <div className="flex gap-3 px-7 pb-8">
        <StoneStat num="20+" label={t.yearsLabel} />
        <StoneStat num="800+" label={t.casesLabel} />
        <StoneStat num="94%" label={t.winRateLabel} />
      </div>

      {/* STORY */}
      {cardData.bio && (
        <section className="px-7 pb-8">
          <Flourish />
          <h2
            className="serif mb-4.5 text-center text-[26px] italic"
            style={{
              color: ACCENT,
              fontWeight: 500,
              letterSpacing: "-0.3px",
            }}
          >
            {t.storyH}
          </h2>
          <p
            className="serif text-center text-[15.5px] leading-[1.75]"
            style={{ color: TEXT, fontWeight: 400 }}
          >
            {cardData.bio}
            <span
              className="serif mt-4.5 block text-center italic"
              style={{
                color: ACCENT,
                fontSize: 16,
                fontWeight: 500,
                marginTop: 18,
              }}
            >
              {t.storySignature}
            </span>
          </p>
        </section>
      )}

      {/* SLOGAN */}
      <div
        className="relative mx-7 rounded-[14px] px-6 py-6.5 text-center"
        style={{
          background: PAPER_WARM,
          border: `1px solid ${BORDER_SOFT}`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 -left-2 block h-px w-6.5"
          style={{ background: ACCENT_3 }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 -right-2 block h-px w-6.5"
          style={{ background: ACCENT_3 }}
        />
        <p
          className="serif text-[17px] italic leading-[1.5]"
          style={{ color: ACCENT, fontWeight: 500 }}
        >
          {"“"}
          {locale === "tr"
            ? "Hukuki Güvenceniz, Başarınızın Temeli."
            : locale === "de"
              ? "Hukuki Güvenceniz — die ruhige Hand am Verhandlungstisch."
              : "Your legal certainty — quiet hand, decisive moves."}
          {"”"}
        </p>
      </div>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-7 pb-8 pt-8">
          <Flourish />
          <h2
            className="serif mb-4.5 text-center text-[26px] italic"
            style={{
              color: ACCENT,
              fontWeight: 500,
              letterSpacing: "-0.3px",
            }}
          >
            {t.servicesH}
          </h2>
          <div className="flex flex-col gap-3">
            {services.map((svc, i) => {
              const Icon = SVC_ICONS[i % SVC_ICONS.length];
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex items-center gap-4 rounded-[14px] px-4.5 py-4 transition-transform hover:translate-x-1"
                  style={{
                    background: PAPER_WARM,
                    border: `1px solid ${BORDER_SOFT}`,
                  }}
                >
                  <span
                    className="flex h-10.5 w-10.5 flex-shrink-0 items-center justify-center rounded-[12px]"
                    style={{
                      background: "rgba(184,152,95,0.18)",
                      color: ACCENT,
                      width: 42,
                      height: 42,
                    }}
                  >
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className="serif text-[15.5px] leading-[1.3]"
                      style={{ color: TEXT, fontWeight: 500 }}
                    >
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div
                        className="mt-0.5 text-[12px]"
                        style={{ color: TEXT_SOFT }}
                      >
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="serif text-[12px] font-semibold"
                      style={{ color: ACCENT, letterSpacing: "0.3px" }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </ServiceLink>
              );
            })}
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {testimonial && (
        <div
          className="relative mx-7 rounded-[16px] px-6 py-7"
          style={{
            background: "linear-gradient(180deg, #ebe1cc 0%, #e3d6b9 100%)",
            border: `1px solid ${BORDER}`,
          }}
        >
          <span
            aria-hidden
            className="serif pointer-events-none absolute left-4.5 top-2 leading-none"
            style={{
              fontSize: 70,
              fontWeight: 700,
              fontStyle: "italic",
              color: ACCENT_3,
              opacity: 0.6,
            }}
          >
            {"“"}
          </span>
          <p
            className="serif relative mb-4 pl-5.5 text-[15px] italic leading-[1.65]"
            style={{ color: TEXT, fontWeight: 400 }}
          >
            {testimonial.quote}
          </p>
          <div className="flex items-center gap-2.5 pl-5.5">
            <span
              aria-label="5 stars"
              className="text-[13px]"
              style={{ color: ACCENT_3, letterSpacing: "2px" }}
            >
              {"â˜…â˜…â˜…â˜…â˜…"}
            </span>
            <span
              className="text-[13px] font-bold"
              style={{ color: ACCENT }}
            >
              {testimonial.author}
              {testimonial.role ? ` · ${testimonial.role}` : ""}
            </span>
          </div>
        </div>
      )}

      {/* CONTACT */}
      <section className="px-7 pb-8 pt-8">
        <Flourish />
        <h2
          className="serif mb-4.5 text-center text-[26px] italic"
          style={{
            color: ACCENT,
            fontWeight: 500,
            letterSpacing: "-0.3px",
          }}
        >
          {t.contactH}
        </h2>
        <div className="flex flex-col gap-2.5">
          {phoneDigits && (
            <StonePill
              href={`tel:${phoneDigits}`}
              Icon={Phone}
              label={t.callBtn}
              value={cardData.phone ?? ""}
            />
          )}
          {waDigits && (
            <StonePill
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              value={cardData.whatsapp ?? ""}
            />
          )}
          {cardData.email && (
            <StonePill
              href={`mailto:${cardData.email}`}
              Icon={Mail}
              label={t.emailBtn}
              value={cardData.email}
            />
          )}
          {cardData.website && (
            <StonePill
              href={
                cardData.website.startsWith("http")
                  ? cardData.website
                  : `https://${cardData.website}`
              }
              external
              Icon={Globe}
              label={t.webBtn}
              value={cardData.website.replace(/^https?:\/\//, "")}
            />
          )}
        </div>

        <div className="mt-6">
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
        className="px-7 py-8"
        style={{
          background: PAPER_WARM,
          borderTop: `1px solid ${BORDER_SOFT}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={ACCENT} locale={locale} />
        <ExchangeSlot slug={slug} primary={ACCENT} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: ACCENT }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-7 py-6"
          style={{ borderTop: `1px solid ${BORDER_SOFT}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={ACCENT} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 pb-8 pt-6 text-center"
        style={{ background: SURFACE, borderTop: `1px solid ${BORDER_SOFT}` }}
      >
        <div
          className="serif text-[14px] italic"
          style={{ color: ACCENT, fontWeight: 500 }}
        >
          {cardData.name}
          {cardData.company ? ` · ${cardData.company}` : ""}
        </div>
        <div
          className="mt-1 text-[11px]"
          style={{ color: TEXT_SOFT }}
        >
          © {new Date().getFullYear()} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: ACCENT }}
          >
            OpSolid
          </a>
        </div>
        {/* unused for tree-shake */}
        <span className="hidden">
          <ArrowUpRight size={1} />
          {ACCENT_SOFT}
          {ACCENT_2}
          {PAGE}
        </span>
      </footer>
    </article>
  );
}

function Flourish() {
  return (
    <div className="mb-3.5 flex items-center gap-3">
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT_3}, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full"
        style={{
          background: ACCENT_3,
          boxShadow: "0 0 0 3px rgba(184,152,95,0.18)",
        }}
      />
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT_3}, transparent)`,
        }}
      />
    </div>
  );
}

function StoneStat({ num, label }: { num: string; label: string }) {
  return (
    <div
      className="relative flex-1 overflow-hidden rounded-[14px] px-2 py-4.5 text-center"
      style={{
        background: PAPER_WARM,
        border: `1px solid ${BORDER_SOFT}`,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${ACCENT_3}, ${ACCENT})`,
        }}
      />
      <div
        className="serif text-[26px] leading-none"
        style={{ color: ACCENT, fontWeight: 600, letterSpacing: "-0.5px" }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[10.5px] font-semibold uppercase"
        style={{ color: TEXT_SOFT, letterSpacing: "0.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function StonePill({
  href,
  Icon,
  label,
  value,
  external,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  value: string;
  external?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center gap-3.5 rounded-full px-4.5 py-3.5 transition-all hover:translate-x-1"
      style={{
        background: PAPER_WARM,
        border: `1.5px solid ${BORDER}`,
      }}
    >
      <span
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          background: "rgba(74,55,40,0.1)",
          color: ACCENT,
        }}
      >
        <Icon size={16} strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="block text-[11px] font-semibold uppercase leading-none"
          style={{ color: TEXT_SOFT, letterSpacing: "0.5px" }}
        >
          {label}
        </span>
        <span
          className="serif mt-0.5 block truncate text-[14px] leading-tight"
          style={{ color: TEXT, fontWeight: 500 }}
        >
          {value}
        </span>
      </span>
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const legalCounselStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 59,
  key: "legal-counsel-stone",
  name: "Legal Counsel — Stone",
  industry: "Lawyer / Rechtsanwalt",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: "#3d4451",
    brandAccentHex: "#8a9ba8",
  },
  sampleSlug: "demo-legal-counsel-stone",
};

export const legalCounselStoneSample: SampleData = {
  templateId: 59,
  slug: "demo-legal-counsel-stone",
  cardData: {
    name: "Dr. Klaus Bauer",
    position: "Rechtsanwalt",
    title: "Fachanwalt für Strafrecht",
    company: "Bauer & Partner",
    email: "bauer@bauer-partner.de",
    phone: "+49 30 555 7890",
    whatsapp: "+49 170 555 7890",
    website: "bauer-partner.de",
    address: "Unter den Linden 21, 10117 Berlin",
    bio: "Recht ist für mich kein Wettkampf, sondern Verantwortung. Vor zwanzig Jahren in Heidelberg promoviert, heute in Berlin zugelassen — und seit dem ersten Tag derselbe Grundsatz: kürzeste Briefe, längste Beziehungen, ruhige Hand am Verhandlungstisch.",
    bookingUrl: "https://cal.com/bauer-partner/intro",
    brochureUrl: "https://bauer-partner.de/profil.pdf",
    impressumUrl: "https://bauer-partner.de/impressum",
    privacyUrl: "https://bauer-partner.de/datenschutz",
    sectorKey: "lawyer",
    socials: {
      linkedin: "https://linkedin.com/in/klausbauer-de",
      xing: "https://xing.com/profile/Klaus_Bauer",
    },
    services: [
      { title: "Strafrecht", description: "Beratung im Ermittlungs- und Strafverfahren.", priceLabel: "â‚¬200 Erstberatung" },
      { title: "Familienrecht", description: "Scheidung, Sorgerecht, Unterhalt.", priceLabel: "ab â‚¬300/h" },
      { title: "Arbeitsrecht", description: "Kündigung, Aufhebung, Vergütung.", priceLabel: "Erfolgshonorar" },
    ],
    testimonials: [
      {
        author: "Mehmet T.",
        role: "Mandant",
        quote: "Dr. Bauer hat ruhig, präzise und mit unfehlbarem Gespür für den richtigen Moment verhandelt.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#3d4451",
  brandAccentHex: "#8a9ba8",
};

