"use client";

// =============================================================================
// ContentCreatorPure — v2 template (id=39, key="content-creator-pure").
//
// Sector: Influencer / content creator — PURE variant. Mood: editorial media-
// kit on white, DM Sans, large left-aligned name with brand-mark, hairline
// stats table, clean collab card. Inspired by kart_16_icerik_uretici_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - Header: brand-mark line ("MEDIA KIT — 2026"), large 28 px name beside
//     64 px round avatar; channel-line callout shows total reach in primary.
//   - Quick actions: 3-column equal grid (DM · Mail · Web), no rounding.
//   - Stats table: each platform a row with handle and big primary count
//     right-aligned.
//   - Categories chips.
//   - Collab card: heading + desc + price-line.
//   - Bio: section.
//   - CTA: solid black button.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Shield,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1e293b";
const LOCKED_ACCENT = "#f97316";
const INK = "#111111";
const INK_2 = "#2a2a2a";
const INK_SOFT = "#717171";
const INK_DIM = "#9ca3af";
const HAIRLINE = "#ececec";
const HAIRLINE_FIRM = "#d4d4d4";
const HAIRLINE_SOFT = "#f4f4f4";
const PAGE = "#fafafa";

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

function platformHandleFromUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  const m = url.replace(/\/$/, "").split("/").pop();
  return m && m.startsWith("@") ? m : m ? `@${m}` : fallback;
}

interface CcpCopy {
  mediaKit: string;
  totalReach: string;
  channels: string;
  contact: string;
  about: string;
  collab: string;
  collabBlurb: string;
  partner: string;
  scheduleCall: string;
  callMe: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  startingFrom: string;
  responseLabel: string;
  categories: string;
  dm: string;
  mail: string;
  web: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", CcpCopy> = {
  de: {
    mediaKit: "Media Kit · 2026",
    totalReach: "120K+ Reichweite",
    channels: "Kanäle",
    contact: "Kontakt",
    about: "Profil",
    collab: "Kooperationen",
    collabBlurb:
      "Wir arbeiten mit Marken, deren Werte wir teilen. Premium-Storytelling für Lifestyle-, Travel- und Wellness-Brands.",
    partner: "Jetzt anfragen",
    scheduleCall: "Anfrage senden",
    callMe: "Direkt anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    startingFrom: "ab",
    responseLabel: "Antwortzeit",
    categories: "Themen",
    dm: "DM",
    mail: "Mail",
    web: "Web",
  },
  en: {
    mediaKit: "Media Kit · 2026",
    totalReach: "120K+ reach",
    channels: "Channels",
    contact: "Contact",
    about: "Profile",
    collab: "Collaborations",
    collabBlurb:
      "I work with brands whose values I share. Premium storytelling for lifestyle, travel and wellness brands.",
    partner: "Request now",
    scheduleCall: "Send request",
    callMe: "Call directly",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    startingFrom: "from",
    responseLabel: "Response time",
    categories: "Topics",
    dm: "DM",
    mail: "Mail",
    web: "Web",
  },
  tr: {
    mediaKit: "Media Kit · 2026",
    totalReach: "120K+ Erişim",
    channels: "Kanallar",
    contact: "İletişim",
    about: "Profil",
    collab: "İş Birlikleri",
    collabBlurb:
      "Değerlerini paylaştığım markalarla çalışıyorum. Lifestyle, travel ve wellness markaları için premium hikâye anlatımı.",
    partner: "Şimdi Sor",
    scheduleCall: "Talep Gönder",
    callMe: "Direkt Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    startingFrom: "başlangıç",
    responseLabel: "Yanıt Süresi",
    categories: "Konular",
    dm: "DM",
    mail: "Mail",
    web: "Web",
  },
  es: {

    mediaKit: "Media Kit · 2026",
    totalReach: "120K+ alcance",
    channels: "Canales",
    contact: "Contacto",
    about: "Perfil",
    collab: "Colaboraciones",
    collabBlurb:
      "I work with brands whose values I share. Premium storytelling for lifestyle, travel and wellness brands.",
    partner: "Solicitar ahora",
    scheduleCall: "Enviar solicitud",
    callMe: "Llamada directa",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    share: "Compartir",
    poweredBy: "Desarrollado por",
    startingFrom: "desde",
    responseLabel: "Tiempo de respuesta",
    categories: "Temas",
    dm: "MD",
    mail: "Correo",
    web: "Web",
  
  },
  it: {

    mediaKit: "Media Kit · 2026",
    totalReach: "120K+ copertura",
    channels: "Canali",
    contact: "Contatto",
    about: "Profilo",
    collab: "Collaborazioni",
    collabBlurb:
      "I work with brands whose values I share. Premium storytelling for lifestyle, travel and wellness brands.",
    partner: "Richiedi ora",
    scheduleCall: "Invia richiesta",
    callMe: "Chiama direttamente",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    share: "Condividi",
    poweredBy: "Realizzato con",
    startingFrom: "da",
    responseLabel: "Tempo di risposta",
    categories: "Argomenti",
    dm: "DM",
    mail: "Posta",
    web: "Web",
  
  },
  fr: {

    mediaKit: "Media Kit · 2026",
    totalReach: "120K+ portée",
    channels: "Canaux",
    contact: "Contact",
    about: "Profil",
    collab: "Collaborations",
    collabBlurb:
      "I work with brands whose values I share. Premium storytelling for lifestyle, travel and wellness brands.",
    partner: "Demander maintenant",
    scheduleCall: "Envoyer la demande",
    callMe: "Appeler directement",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    share: "Partager",
    poweredBy: "Propulsé par",
    startingFrom: "de",
    responseLabel: "Temps de réponse",
    categories: "Sujets",
    dm: "DM",
    mail: "Courrier",
    web: "Web",
  
  },
  ar: {

    mediaKit: "Media Kit · 2026",
    totalReach: "120 ألف+ وصول",
    channels: "القنوات",
    contact: "اتصال",
    about: "الملف الشخصي",
    collab: "تعاونات",
    collabBlurb:
      "I work with brands whose values I share. Premium storytelling for lifestyle, travel and wellness brands.",
    partner: "اطلب الآن",
    scheduleCall: "إرسال الطلب",
    callMe: "اتصال مباشر",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
    startingFrom: "من",
    responseLabel: "وقت الاستجابة",
    categories: "المواضيع",
    dm: "رسالة خاصة",
    mail: "بريد",
    web: "ويب",
  
  },
};

const CATEGORIES = ["Lifestyle", "Travel", "Wellness", "Fashion", "Food", "Premium"];

export function ContentCreatorPure({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const accent = brandAccentHex || LOCKED_ACCENT;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const igHandle = platformHandleFromUrl(cardData.socials?.instagram, "@creator");
  const tikHandle = platformHandleFromUrl(cardData.socials?.tiktok, "@creator");
  const ytHandle = platformHandleFromUrl(cardData.socials?.youtube, "@creator");

  const year = new Date().getFullYear();

  const minPriceLabel =
    services.find((s) => s.priceLabel)?.priceLabel || "â‚¬450";

  return (
    <article
      data-template="content-creator-pure"
      className="ccp-card relative mx-auto w-full max-w-[460px]"
      style={{
        background: "#ffffff",
        color: INK,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .ccp-card { line-height: 1.6; }
        .ccp-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="px-8 pb-9 pt-14"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-9 flex items-center gap-2 text-[12px] font-medium uppercase"
          style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
        >
          <span aria-hidden className="block h-px w-6" style={{ background: INK }} />
          {t.mediaKit}
        </div>
        <div className="flex items-start gap-4">
          <div
            className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full"
            style={{ background: HAIRLINE_SOFT }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                width={120}
                height={120}
                unoptimized
                className="h-full w-full object-cover tpl-photo"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[16px] font-bold"
                style={{ color: accent }}
              >
                {cardData.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1
              className="text-[28px] font-bold leading-[1.15] tracking-[-0.6px]"
              style={{ color: INK }}
            >
              {cardData.name}
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: INK_SOFT }}>
              {cardData.position || cardData.title || "Content Creator"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-[13px]" style={{ color: INK_2 }}>
          <strong style={{ color: accent, fontWeight: 600 }}>
            {t.totalReach}
          </strong>
          {" "}· Lifestyle · Travel · Premium Brands
        </p>
      </header>

      {/* QUICK ACTIONS — 3-up flat */}
      <section
        className="grid grid-cols-3"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(waDigits || phoneDigits) && (
          <PureAction
            href={waDigits ? `https://wa.me/${waDigits}` : `tel:${phoneDigits}`}
            external={!!waDigits}
            label={t.dm}
            Icon={MessageCircle}
            withRight
          />
        )}
        {cardData.email && (
          <PureAction
            href={`mailto:${cardData.email}`}
            label={t.mail}
            Icon={Mail}
            withRight
          />
        )}
        {cardData.website && (
          <PureAction
            href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
            external
            label={t.web}
            Icon={Globe}
          />
        )}
      </section>

      {/* CHANNELS — stats table */}
      <section
        className="px-8 py-12"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-5 text-[11px] font-medium uppercase"
          style={{ color: INK_SOFT, letterSpacing: "2px" }}
        >
          {t.channels}
        </div>
        <div>
          <StatsRow label="Instagram" handle={igHandle} count="120K" accent={accent} />
          <StatsRow label="TikTok" handle={tikHandle} count="85K" accent={accent} />
          <StatsRow label="YouTube" handle={ytHandle} count="22K" accent={accent} last />
        </div>
      </section>

      {/* ABOUT */}
      {cardData.bio && (
        <section
          className="px-8 py-12"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-5 text-[11px] font-medium uppercase"
            style={{ color: INK_SOFT, letterSpacing: "2px" }}
          >
            {t.about}
          </div>
          <p className="text-[15px] leading-[1.75]" style={{ color: INK_2 }}>
            {cardData.bio}
          </p>
        </section>
      )}

      {/* CATEGORIES */}
      <section
        className="px-8 py-10"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-5 text-[11px] font-medium uppercase"
          style={{ color: INK_SOFT, letterSpacing: "2px" }}
        >
          {t.categories}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className="rounded-full px-3.5 py-2 text-[12px] font-medium"
              style={{ background: HAIRLINE_SOFT, color: INK_2 }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* COLLAB CARD */}
      {services.length > 0 && (
        <section
          className="px-8 py-12"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-5 text-[11px] font-medium uppercase"
            style={{ color: INK_SOFT, letterSpacing: "2px" }}
          >
            {t.collab}
          </div>
          <div
            className="rounded-2xl p-6"
            style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
          >
            <h3
              className="text-[18px] font-bold leading-tight tracking-[-0.3px]"
              style={{ color: INK }}
            >
              {t.collab}
            </h3>
            <p
              className="mt-2 text-[13px] leading-[1.65]"
              style={{ color: INK_SOFT }}
            >
              {t.collabBlurb}
            </p>
            <div
              className="mt-5 flex items-baseline justify-between border-t pt-5"
              style={{ borderColor: HAIRLINE_FIRM }}
            >
              <span
                className="text-[11px] font-medium uppercase"
                style={{ color: INK_SOFT, letterSpacing: "1.2px" }}
              >
                {t.startingFrom}
              </span>
              <span
                className="text-[22px] font-bold tabular-nums tracking-[-0.5px]"
                style={{ color: accent }}
              >
                {minPriceLabel}
              </span>
            </div>
            {/* Service list */}
            <div className="mt-4">
              {services.slice(0, 4).map((s, i, arr) => (
                <ServiceLink
                  key={`${s.title}-${i}`}
                  href={s.href}
                  className="flex items-baseline justify-between py-2.5"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px dashed ${HAIRLINE}` : "none",
                  }}
                >
                  <span className="text-[12.5px] font-medium" style={{ color: INK }}>
                    {s.title}
                  </span>
                  {s.priceLabel && (
                    <span
                      className="text-[12.5px] tabular-nums"
                      style={{ color: INK_SOFT }}
                    >
                      {s.priceLabel}
                    </span>
                  )}
                </ServiceLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section
        className="px-8 py-12"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-5 text-[11px] font-medium uppercase"
          style={{ color: INK_SOFT, letterSpacing: "2px" }}
        >
          {t.contact}
        </div>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </section>

      {/* CTA */}
      <div
        className="space-y-2.5 px-8 py-9"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold uppercase tracking-[0.6px] transition-opacity hover:opacity-90"
            style={{ background: INK, color: "#fff" }}
          >
            <span>{t.scheduleCall}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold uppercase tracking-[0.6px] transition-colors hover:bg-[#f8fafc]"
            style={{ background: "transparent", color: INK, border: `1px solid ${HAIRLINE}` }}
          >
            <span>{t.callMe}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* SOCIAL */}
      {cardData.socials && (
        <div
          className="px-8 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
        </div>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div
          className="px-8 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div
        className="px-8 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-8 py-7 text-[10px] font-medium uppercase"
        style={{ color: INK_DIM, letterSpacing: "1.5px" }}
      >
        <span>© {year}</span>
        <span>{cardData.company || cardData.name}</span>
      </footer>
      <div
        className="flex items-center justify-center gap-1.5 px-8 pb-7 text-[10px]"
        style={{ color: INK_DIM }}
      >
        <Shield size={11} strokeWidth={1.6} />
        {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
          style={{ color: accent }}
        >
          OpSolid
        </a>
      </div>
    </article>
  );
}

function StatsRow({
  label,
  handle,
  count,
  accent,
  last,
}: {
  label: string;
  handle: string;
  count: string;
  accent: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-baseline justify-between py-4"
      style={{ borderBottom: last ? "none" : `1px solid ${HAIRLINE}` }}
    >
      <div>
        <span className="text-[14px] font-semibold" style={{ color: INK }}>
          {label}
        </span>
        <span className="ml-2 text-[11px]" style={{ color: INK_SOFT }}>
          {handle}
        </span>
      </div>
      <span
        className="text-[22px] font-bold tabular-nums tracking-[-0.5px]"
        style={{ color: accent }}
      >
        {count}
      </span>
    </div>
  );
}

function PureAction({
  href,
  label,
  Icon,
  external,
  withRight,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  external?: boolean;
  withRight?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center transition-colors hover:bg-[#fafafa]"
      style={{
        color: INK,
        borderRight: withRight ? `1px solid ${HAIRLINE}` : "none",
      }}
    >
      <Icon size={17} strokeWidth={1.8} />
      <span
        className="text-[11px] font-medium uppercase"
        style={{ color: INK_SOFT, letterSpacing: "1.2px" }}
      >
        {label}
      </span>
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const contentCreatorPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 39,
  key: "content-creator-pure",
  name: "Content Creator — Pure",
  industry: "Influencer / content creator (editorial pure variant)",
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
  sampleSlug: "demo-content-creator-pure",
};

export const contentCreatorPureSample: SampleData = {
  templateId: 39,
  slug: "demo-content-creator-pure",
  cardData: {
    name: "Tuna Yılmaz",
    position: "Content Creator",
    title: "Lifestyle & Travel",
    company: "Tuna Yılmaz Media",
    email: "tuna@tunayilmaz.de",
    phone: "+49 178 556 7890",
    whatsapp: "+49 178 556 7890",
    website: "tunayilmaz.de",
    address: "Berlin",
    bio: "I work with brands whose values I share. Premium storytelling for lifestyle, travel and wellness. 120K+ engaged followers across IG, TikTok and YouTube.",
    bookingUrl: "https://cal.com/tunayilmaz/booking",
    sectorKey: "creator",
    services: [
      { title: "Instagram Post", priceLabel: "â‚¬450" },
      { title: "TikTok Video", priceLabel: "â‚¬380" },
      { title: "YouTube Integration", priceLabel: "â‚¬800" },
      { title: "Story Series", priceLabel: "â‚¬250" },
    ],
    socials: {
      instagram: "https://instagram.com/tunayilmaz",
      tiktok: "https://tiktok.com/@tunayilmaz",
      youtube: "https://youtube.com/@tunayilmaz",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

