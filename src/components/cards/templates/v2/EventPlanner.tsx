"use client";

// =============================================================================
// EventPlanner — v2 template (id=43, key="event-planner").
//
// Sector: Wedding & event planner — DEFAULT variant. Mood: elegant navy +
// gold, premium events agency. Inspired by kart_18_organizasyon.html (we
// translate the purple/gold of the source into a navy-gold elite palette
// to match the persona's "Luxury Wedding & Event Planner" positioning).
//
// Locked design DNA (only colors respond to brand):
//   - Hero: rich gradient panel (primary→deep) with two large radial glows,
//     a small uppercase tag, and an oversized italic serif tagline that
//     uses the accent color for one phrase.
//   - Profile strip floats (-36 px) with avatar + white card chip showing
//     name, role and 5-star rating + count.
//   - 3 quick action pills (Call · WhatsApp · Email).
//   - Services grid: 6 cards with emoji-style icons + name + description.
//   - Stats banner: gradient panel with 3 numbers.
//   - Brand client tags (gold pills).
//   - Testimonial card: warm gold-soft surface with serif quote.
//   - CTA: gradient button with sheen.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Camera,
  Cake,
  GraduationCap,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a2b4a"; // navy
const LOCKED_ACCENT = "#c8a951"; // gold
const SURFACE = "#ffffff";
const PAGE = "#fbf8f1";
const GOLD_SOFT = "#fef3c7";
const INK = "#2a1430";
const INK_SOFT = "#6b5c75";
const HAIRLINE = "#efe5f3";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1a1a1a" : "#ffffff";
}

function shade(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
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
  tag: string;
  taglineLead: string;
  taglineAccent: string;
  taglineTail: string;
  role: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  servicesH: string;
  servicesLabel: string;
  reviewsLabel: string;
  clientsH: string;
  testimonialH: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    tag: "Wedding & Events",
    taglineLead: "Lass uns deinen",
    taglineAccent: "schönsten Tag",
    taglineTail: "gemeinsam gestalten.",
    role: "Event-Designerin",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    servicesH: "Leistungen",
    servicesLabel: "Leistungen",
    reviewsLabel: "Bewertungen",
    clientsH: "Vertrauen mir",
    testimonialH: "Stimmen",
    cta: "Lass uns dein Event entwerfen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
  },
  en: {
    tag: "Wedding & Events",
    taglineLead: "Let's design your",
    taglineAccent: "most beautiful day",
    taglineTail: "together.",
    role: "Event Designer",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesH: "Services",
    servicesLabel: "Services",
    reviewsLabel: "Reviews",
    clientsH: "Trusted by",
    testimonialH: "Voices",
    cta: "Let's design your event",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
  },
  tr: {
    tag: "Wedding & Events",
    taglineLead: "Hayalinizdeki",
    taglineAccent: "günü",
    taglineTail: "birlikte tasarlayalım.",
    role: "Etkinlik Tasarımcısı",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    servicesH: "Hizmetler",
    servicesLabel: "Hizmetler",
    reviewsLabel: "Yorum",
    clientsH: "Çalıştığım Markalar",
    testimonialH: "Yorumlar",
    cta: "Hayalinizdeki Etkinliği Tasarlayalım",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    contact: "İletişim",
  },
  es: {

    tag: "Bodas y eventos",
    taglineLead: "Diseñemos tu",
    taglineAccent: "el día más hermoso",
    taglineTail: "juntos.",
    role: "Diseñador de eventos",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    servicesH: "Servicios",
    servicesLabel: "Servicios",
    reviewsLabel: "Reseñas",
    clientsH: "Confían en nosotros",
    testimonialH: "Voces",
    cta: "Diseñemos tu evento",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    contact: "Contacto",
  
  },
  it: {

    tag: "Matrimoni ed eventi",
    taglineLead: "Progettiamo il tuo",
    taglineAccent: "il giorno più bello",
    taglineTail: "insieme.",
    role: "Event Designer",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesH: "Servizi",
    servicesLabel: "Servizi",
    reviewsLabel: "Recensioni",
    clientsH: "Si fidano di noi",
    testimonialH: "Voci",
    cta: "Progettiamo il tuo evento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    contact: "Contatto",
  
  },
  fr: {

    tag: "Mariages et événements",
    taglineLead: "Concevons votre",
    taglineAccent: "le plus beau jour",
    taglineTail: "ensemble.",
    role: "Designer d'événements",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    servicesH: "Services",
    servicesLabel: "Services",
    reviewsLabel: "Avis",
    clientsH: "Ils nous font confiance",
    testimonialH: "Témoignages",
    cta: "Concevons votre événement",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    contact: "Contact",
  
  },
  ar: {

    tag: "أعراس وفعاليات",
    taglineLead: "لنصمم",
    taglineAccent: "أجمل يوم",
    taglineTail: "معاً.",
    role: "مصمم فعاليات",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    servicesH: "الخدمات",
    servicesLabel: "الخدمات",
    reviewsLabel: "التقييمات",
    clientsH: "يثق بنا",
    testimonialH: "أصوات",
    cta: "لنصمم فعاليتك",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    contact: "اتصال",
  
  },
};

const SERVICE_ICONS: { Icon: typeof Heart; key: string }[] = [
  { Icon: Heart, key: "wedding" },
  { Icon: Briefcase, key: "corporate" },
  { Icon: Cake, key: "birthday" },
  { Icon: GraduationCap, key: "graduation" },
  { Icon: Sparkles, key: "concept" },
  { Icon: Camera, key: "photo" },
];

const CLIENT_TAGS = [
  "Mandarin Oriental",
  "Soho House",
  "Four Seasons",
  "Fashion Week BLN",
  "Mercedes-Benz",
  "Ritz-Carlton",
];

export function EventPlanner({
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
  const onPrimary = readableTextOn(primary);
  const onAccent = readableTextOn(accent);
  const primaryDeep = shade(primary, -30);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];
  const year = new Date().getFullYear();

  return (
    <article
      data-template="event-planner"
      className="ep-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 18px 50px rgba(26,43,74,0.18)",
      }}
    >
      <style jsx global>{`
        .ep-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
        }
        .ep-card .serif {
          font-family: var(--tpl-font-display, 'Cormorant Garamond', Georgia, serif);
          font-style: italic;
        }
        .ep-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 py-16"
        style={{
          background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 60%, ${accent} 100%)`,
          color: "#fff",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent}55, transparent 65%)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-12 h-60 w-60 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)" }}
        />
        <div className="relative">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase"
            style={{
              background: "rgba(255,255,255,0.18)",
              borderColor: "rgba(255,255,255,0.32)",
              letterSpacing: "1.8px",
            }}
          >
            <Heart size={12} strokeWidth={2} />
            {t.tag}
          </span>
          <h1
            className="serif mt-6 text-[36px] font-normal leading-[1.05] tracking-[-0.8px]"
          >
            {t.taglineLead}
            <br />
            <span style={{ color: accent, fontWeight: 500 }}>{t.taglineAccent}</span>
            <br />
            {t.taglineTail}
          </h1>
          <div
            className="mt-5 text-[12px] font-extrabold uppercase"
            style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "4px" }}
          >
            {(cardData.company || "Events").toUpperCase()}
            {cardData.address ? ` · ${cardData.address.split(",").pop()?.trim()}` : ""}
          </div>
        </div>
      </header>

      {/* PROFILE STRIP */}
      <section className="relative z-[2] -mt-9 flex items-center gap-4 px-7">
        <div
          className="relative h-[76px] w-[76px] flex-shrink-0 overflow-hidden rounded-full"
          style={{
            border: "4px solid #fff",
            boxShadow: "0 8px 28px rgba(26,43,74,0.22)",
            background: PAGE,
          }}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt="" fill sizes="76px" unoptimized className="object-cover tpl-photo" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[22px] font-bold"
              style={{ color: primary }}
            >
              {cardData.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div
          className="min-w-0 flex-1 rounded-2xl px-4 py-3"
          style={{
            background: "#fff",
            boxShadow: "0 8px 24px rgba(26,43,74,0.14)",
          }}
        >
          <div className="text-[17px] font-extrabold tracking-[-0.3px]" style={{ color: primary }}>
            {cardData.name}
          </div>
          <div
            className="mt-0.5 text-[12px] font-semibold"
            style={{ color: shade(primary, 50), letterSpacing: "0.5px" }}
          >
            {cardData.position || t.role}
          </div>
          {testimonials.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: accent }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
              ))}
              <span className="font-bold" style={{ color: INK }}>
                {testimonials.length} {t.reviewsLabel}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* QUICK */}
      <section className="flex gap-2.5 px-7 pb-2 pt-6">
        {phoneDigits && (
          <Pill href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} bg={primary} fg="#fff" />
        )}
        {waDigits && (
          <Pill
            href={`https://wa.me/${waDigits}`}
            external
            Icon={MessageCircle}
            label={t.whatsappBtn}
            bg="#25d366"
            fg="#fff"
          />
        )}
        {cardData.email && (
          <Pill href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} bg={accent} fg={onAccent} />
        )}
      </section>

      {/* SERVICES */}
      <section className="px-7 pt-7">
        <SectionTitle primary={primary} accent={accent}>
          {t.servicesH}
        </SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(services.length > 0 ? services.slice(0, 6) : SERVICE_ICONS.map((s) => ({
            title: s.key,
            description: "",
            priceLabel: undefined as string | undefined,
          }))).map((svc, i) => {
            const { Icon } = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={'href' in svc ? (svc as { href?: string | null }).href : undefined}
                className="relative overflow-hidden rounded-[18px] px-4 py-5 transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${SURFACE} 0%, ${PAGE} 100%)`,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                <Icon size={26} strokeWidth={1.6} style={{ color: primary }} />
                <div className="mt-2.5 text-[14px] font-bold" style={{ color: INK }}>
                  {svc.title}
                </div>
                {svc.description && (
                  <div className="mt-1 text-[11.5px] leading-[1.5]" style={{ color: INK_SOFT }}>
                    {svc.description}
                  </div>
                )}
                {svc.priceLabel && (
                  <div
                    className="mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: `${accent}26`, color: shade(primary, 30) }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </ServiceLink>
            );
          })}
        </div>
      </section>

      {/* STATS BANNER — driven by real data */}
      {(() => {
        const statsItems = [
          ...(services.length ? [{ num: String(services.length), label: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ num: String(testimonials.length), label: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <section className="px-7 pt-7">
            <div
              className="relative overflow-hidden rounded-[22px] px-6 py-7"
              style={{
                background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 100%)`,
                color: "#fff",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full"
                style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }}
              />
              <div className="relative flex justify-around text-center">
                {statsItems.map((s) => (
                  <Stat key={s.label} num={s.num} label={s.label} accent={accent} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* CLIENT TAGS */}
      <section className="px-7 pt-7">
        <SectionTitle primary={primary} accent={accent}>
          {t.clientsH}
        </SectionTitle>
        <div className="mt-4 flex flex-wrap gap-2">
          {CLIENT_TAGS.map((c) => (
            <span
              key={c}
              className="rounded-full px-3.5 py-2 text-[12px] font-bold"
              style={{
                background: GOLD_SOFT,
                border: `1px solid ${accent}66`,
                color: INK,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="px-7 pt-7">
          <div
            className="relative rounded-[18px] px-6 py-7"
            style={{ background: GOLD_SOFT }}
          >
            <span
              aria-hidden
              className="serif absolute left-4 top-1 text-[80px] leading-none"
              style={{ color: accent, opacity: 0.6 }}
            >
              “
            </span>
            <p
              className="serif relative pl-4 text-[17px] leading-[1.5]"
              style={{ color: INK }}
            >
              {testimonials[0].quote}
            </p>
            <div
              className="mt-3 pl-4 text-[12px] font-extrabold"
              style={{ color: primary, letterSpacing: "0.5px" }}
            >
              — {testimonials[0].author}
              {testimonials[0].role ? ` · ${testimonials[0].role}` : ""}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-7 pt-7">
        <a
          href={
            cardData.bookingUrl ||
            (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-[18px] text-[15px] font-extrabold transition-all hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 100%)`,
            color: "#fff",
            boxShadow: `0 16px 36px ${primary}80`,
          }}
        >
          <MessageCircle size={18} strokeWidth={2.2} />
          {t.cta}
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </a>
      </section>

      {/* CONTACT */}
      <section className="px-7 pt-7">
        <SectionTitle primary={primary} accent={accent}>
          {t.contact}
        </SectionTitle>
        <div className="mt-3">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
        </div>
      </section>

      {cardData.socials && (
        <section className="px-7 pt-7">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-7 mt-7 rounded-3xl p-5"
        style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-7 mt-4 rounded-3xl p-5"
          labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary, background: PAGE }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="mt-7 px-7 py-6 text-center"
        style={{ background: primary, color: onPrimary }}
      >
        <div
          className="text-[13px] font-extrabold"
          style={{ color: accent, letterSpacing: "1.5px" }}
        >
          {(cardData.company || cardData.name).toUpperCase()}
        </div>
        <div
          className="mt-1 text-[11px]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          © {year} · {t.poweredBy}{" "}
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
        <div
          className="mt-1.5 inline-flex items-center gap-1 text-[10.5px]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <Award size={10} strokeWidth={1.8} /> {cardData.address || ""}
        </div>
      </footer>
    </article>
  );
}

function SectionTitle({
  children,
  primary,
  accent,
}: {
  children: React.ReactNode;
  primary: string;
  accent: string;
}) {
  return (
    <h2
      className="flex items-center gap-2.5 text-[17px] font-extrabold"
      style={{ color: primary }}
    >
      <span
        aria-hidden
        className="block h-6 w-1 rounded-[2px]"
        style={{ background: `linear-gradient(180deg, ${primary}, ${accent})` }}
      />
      {children}
    </h2>
  );
}

function Pill({
  href,
  Icon,
  label,
  bg,
  fg,
  external,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  bg: string;
  fg: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-[13px] font-bold transition-all hover:-translate-y-0.5"
      style={{ background: bg, color: fg }}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </a>
  );
}

function Stat({ num, label, accent }: { num: string; label: string; accent: string }) {
  return (
    <div>
      <div className="text-[32px] font-black leading-none" style={{ color: accent }}>
        {num}
      </div>
      <div
        className="mt-1.5 text-[11px] uppercase"
        style={{ color: "rgba(255,255,255,0.78)", letterSpacing: "1px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const eventPlannerEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 43,
  key: "event-planner",
  name: "Event Planner",
  industry: "Wedding & event planner",
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
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-event-planner",
};

// photo: Unsplash, wedding planner. Unsplash License — free, no attribution required.
export const eventPlannerSample: SampleData = {
  templateId: 43,
  slug: "demo-event-planner",
  cardData: {
    name: "Naz Erdoğan",
    position: "Wedding & Event Planner",
    title: "Naz Events",
    company: "Naz Events",
    email: "naz@nazevents.de",
    phone: "+49 172 667 8901",
    whatsapp: "+49 172 667 8901",
    website: "nazevents.de",
    address: "Berlin · Europa",
    bio: "Luxury Wedding & Event Planner in Berlin & Europa. Maßgeschneiderte Erlebnisse für unvergessliche Momente.",
    bookingUrl: "https://cal.com/nazevents/intro",
    sectorKey: "events",
    services: [
      { title: "Komplettpaket", description: "Konzept · Logistik · Koordination", priceLabel: "ab €4.800" },
      { title: "Tageskoordination", description: "Day-of mit komplettem Team", priceLabel: "ab €1.200" },
      { title: "Beratung", description: "Strategie & Sourcing pro Stunde", priceLabel: "€150 / h" },
      { title: "Konzeptdesign", description: "Locations · Decor · Atmosphäre", priceLabel: "ab €900" },
      { title: "Foto & Video", description: "Premium-Team, kuratiert", priceLabel: "ab €1.800" },
      { title: "Gala & Corporate", description: "Lansman, Konferenz, Awards", priceLabel: "auf Anfrage" },
    ],
    testimonials: [
      {
        author: "Lena & Max K.",
        role: "Wedding 2025 · Berlin",
        quote:
          "Das schönste Event unseres Lebens — Naz hat jedes Detail perfekt umgesetzt.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/naz.events",
      facebook: "https://facebook.com/nazevents",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
