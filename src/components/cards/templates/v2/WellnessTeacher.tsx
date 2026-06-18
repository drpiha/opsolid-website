"use client";

// =============================================================================
// WellnessTeacher — v2 template (id=40, key="wellness-teacher").
//
// Sector: Solo yoga teacher / wellness coach — DEFAULT variant. Mood: earthy
// sage + terracotta, holistic, retreat poster. Inspired by kart_17_yoga.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: cinematic photo with overlay gradient + serif italic mantra and
//     small location caplabel. A wave divider pulls the surface up.
//   - Profile: round avatar with conic ring, italic display name + RYT
//     credential pill + studio caption.
//   - Quick contact: 3 pills (Call · WhatsApp · Email).
//   - Philosophy: warm card with oversized open-quote glyph + serif body.
//   - Classes/services list: bordered cards with left accent.
//   - Specialties grid (4 chips).
//   - Retreat banner: gradient panel with radial glows.
//   - Stats strip on warm card.
//   - WhatsApp booking CTA.
// =============================================================================

import * as React from "react";
import { linkify } from "@/lib/linkify";
import Image from "next/image";
import {
  ArrowUpRight,
  Flame,
  Leaf,
  MessageCircle,
  Moon,
  Phone,
  Mail,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import { resolveStats } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#5f7a6e"; // sage green
const LOCKED_ACCENT = "#c8956c"; // terracotta
const PAGE_WARM = "#f3ede2";
const SURFACE = "#faf7f2";
const INK = "#2d3a36";
const INK_SOFT = "#5a6b66";
const HAIRLINE = "#e3dccf";

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

interface WtCopy {
  mantraLead: string;
  mantraAccent: string;
  mantraTail: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  philosophy: string;
  classes: string;
  specialties: string;
  retreat: string;
  retreatLabel: string;
  retreatTitle: string;
  retreatDesc: string;
  stats: string;
  yearsLabel: string;
  studentsLabel: string;
  communityLabel: string;
  bookCta: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  contact: string;
  certified: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", WtCopy> = {
  de: {
    mantraLead: "Mit Atem beginnt es,",
    mantraAccent: "in Balance",
    mantraTail: "lebt es weiter.",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    philosophy: "Philosophie",
    classes: "Stundenarten",
    specialties: "Spezialgebiete",
    retreat: "Retreat",
    retreatLabel: "Besonderes Erlebnis",
    retreatTitle: "Spring Retreat\n3 Tage am Meer",
    retreatDesc: "Strand-Yoga · Meditation · achtsame Küche",
    stats: "Auf einen Blick",
    yearsLabel: "Jahre",
    studentsLabel: "Schüler:innen",
    communityLabel: "Community",
    bookCta: "Stunde buchen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    contact: "Kontakt",
    certified: "RYT-500 · Zertifiziert",
  },
  en: {
    mantraLead: "It starts with breath,",
    mantraAccent: "in balance",
    mantraTail: "it carries on.",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    philosophy: "Philosophy",
    classes: "Class types",
    specialties: "Specialties",
    retreat: "Retreat",
    retreatLabel: "Featured retreat",
    retreatTitle: "Spring Retreat\n3 days · seaside",
    retreatDesc: "Beach yoga · meditation · whole-foods kitchen",
    stats: "At a glance",
    yearsLabel: "Years",
    studentsLabel: "Students",
    communityLabel: "Community",
    bookCta: "Book a session",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    contact: "Contact",
    certified: "RYT-500 · Certified",
  },
  tr: {
    mantraLead: "Nefesle başlar,",
    mantraAccent: "denge",
    mantraTail: "ile devam eder.",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    philosophy: "Felsefe",
    classes: "Ders Türleri",
    specialties: "Uzmanlık",
    retreat: "Retreat",
    retreatLabel: "Özel Etkinlik",
    retreatTitle: "Bahar Retreat\n3 Gün · Sahil",
    retreatDesc: "Sahil yogası · meditasyon · organik mutfak",
    stats: "Özet",
    yearsLabel: "Yıl",
    studentsLabel: "Öğrenci",
    communityLabel: "Topluluk",
    bookCta: "Ders Rezervasyonu",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    contact: "İletişim",
    certified: "RYT-500 · Sertifikalı",
  },
  es: {

    mantraLead: "Empieza con la respiración,",
    mantraAccent: "en equilibrio",
    mantraTail: "sigue.",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    philosophy: "Filosofía",
    classes: "Tipos de clase",
    specialties: "Especialidades",
    retreat: "Retiro",
    retreatLabel: "Retiro destacado",
    retreatTitle: "Retiro de primavera\n3 días · costa",
    retreatDesc: "Yoga en la playa · meditación · cocina natural",
    stats: "De un vistazo",
    yearsLabel: "Años",
    studentsLabel: "Estudiantes",
    communityLabel: "Comunidad",
    bookCta: "Reservar una sesión",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    share: "Compartir",
    poweredBy: "Desarrollado por",
    contact: "Contacto",
    certified: "RYT-500 · Certificado",
  
  },
  it: {

    mantraLead: "Inizia con il respiro,",
    mantraAccent: "in equilibrio",
    mantraTail: "prosegue.",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    philosophy: "Filosofia",
    classes: "Tipi di lezione",
    specialties: "Specialità",
    retreat: "Ritiro",
    retreatLabel: "Ritiro in evidenza",
    retreatTitle: "Ritiro di primavera\n3 giorni · costa",
    retreatDesc: "Yoga in spiaggia · meditazione · cucina naturale",
    stats: "In sintesi",
    yearsLabel: "Anni",
    studentsLabel: "Studenti",
    communityLabel: "Comunità",
    bookCta: "Prenota una sessione",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    share: "Condividi",
    poweredBy: "Realizzato con",
    contact: "Contatto",
    certified: "RYT-500 · Certificato",
  
  },
  fr: {

    mantraLead: "Cela commence par le souffle,",
    mantraAccent: "en équilibre",
    mantraTail: "elle se poursuit.",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    philosophy: "Philosophie",
    classes: "Types de cours",
    specialties: "Spécialités",
    retreat: "Retraite",
    retreatLabel: "Retraite en vedette",
    retreatTitle: "Retraite de printemps\n3 jours · bord de mer",
    retreatDesc: "Yoga sur la plage · méditation · cuisine naturelle",
    stats: "En un coup d'œil",
    yearsLabel: "Années",
    studentsLabel: "Étudiants",
    communityLabel: "Communauté",
    bookCta: "Réserver une séance",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    share: "Partager",
    poweredBy: "Propulsé par",
    contact: "Contact",
    certified: "RYT-500 · Certifié",
  
  },
  ar: {

    mantraLead: "يبدأ بالنفَس،",
    mantraAccent: "في توازن",
    mantraTail: "تستمر.",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    philosophy: "الفلسفة",
    classes: "أنواع الحصص",
    specialties: "التخصصات",
    retreat: "خلوة",
    retreatLabel: "خلوة مميزة",
    retreatTitle: "خلوة الربيع\n3 أيام · ساحلية",
    retreatDesc: "يوغا الشاطئ · تأمل · مطبخ طبيعي",
    stats: "نظرة سريعة",
    yearsLabel: "سنوات",
    studentsLabel: "الطلاب",
    communityLabel: "المجتمع",
    bookCta: "احجز جلسة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
    contact: "اتصال",
    certified: "RYT-500 · معتمد",
  
  },
};

const SPECIALTIES: { Icon: typeof Leaf; label: string }[] = [
  { Icon: Leaf, label: "Hatha" },
  { Icon: Sun, label: "Vinyasa" },
  { Icon: Wind, label: "Restorative" },
  { Icon: Moon, label: "Meditation" },
];

export function WellnessTeacher({
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
  const onPrimary = readableTextOn(primary);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const stats = resolveStats(cardData.stats);
  const year = new Date().getFullYear();

  return (
    <article
      data-template="wellness-teacher"
      className="wt-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .wt-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.7;
        }
        .wt-card .serif {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', Georgia, serif);
          font-style: italic;
          font-weight: 400;
        }
        .wt-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header className="relative h-[280px] overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="460px"
            unoptimized
            className="object-cover tpl-photo"
            priority
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0 flex flex-col justify-end px-7 pb-14 pt-7"
          style={{
            background:
              "linear-gradient(180deg, rgba(45,58,54,0.18) 0%, rgba(45,58,54,0.62) 100%)",
            color: "#fff",
          }}
        >
          <h1 className="serif text-[22px] leading-[1.35]" style={{ color: "#fff" }}>
            {t.mantraLead}
            <br />
            <span
              className="inline-block px-1"
              style={{
                background: `linear-gradient(180deg, transparent 65%, ${accent}99 65%)`,
              }}
            >
              {t.mantraAccent}
            </span>{" "}
            {t.mantraTail}
          </h1>
          {(cardData.company || cardData.position || cardData.address) && (
            <span
              className="mt-1 text-[11px] font-semibold uppercase"
              style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "2px" }}
            >
              {cardData.company || cardData.position}
              {cardData.address ? ` · ${cardData.address.split(",")[0]?.trim()}` : ""}
            </span>
          )}
        </div>
      </header>

      {/* WAVE DIVIDER */}
      <div
        aria-hidden
        className="relative -mt-10 h-10"
        style={{
          background: SURFACE,
          borderTopLeftRadius: "60% 40px",
          borderTopRightRadius: "60% 40px",
        }}
      />

      {/* PROFILE */}
      <section className="relative z-[2] -mt-16 flex flex-col items-center px-7 pb-6 text-center">
        <div className="relative mb-4 h-[120px] w-[120px]">
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 90deg, ${primary}, ${accent}, ${primary})`,
              padding: 2,
            }}
          />
          <div
            className="relative h-full w-full overflow-hidden rounded-full p-1.5"
            style={{
              background: SURFACE,
              boxShadow: "0 8px 24px rgba(74,124,111,0.18)",
            }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-full"
              style={{ border: `2px solid ${SURFACE}` }}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt=""
                  fill
                  sizes="120px"
                  unoptimized
                  className="object-cover tpl-photo"
                />
              ) : (
                <div
                  className="serif flex h-full w-full items-center justify-center text-[28px]"
                  style={{ color: primary }}
                >
                  {cardData.name.slice(0, 1)}
                </div>
              )}
            </div>
          </div>
        </div>
        <h2
          className="serif text-[30px] leading-[1.1]"
          style={{ color: INK }}
        >
          {cardData.name}
        </h2>
        {cardData.position && (
          <div
            className="mt-1.5 text-[12px] font-semibold uppercase"
            style={{ color: primary, letterSpacing: "2px" }}
          >
            {cardData.position}
          </div>
        )}
        {cardData.company && (
          <div className="mt-1 text-[14px]" style={{ color: INK_SOFT }}>
            {cardData.company}
          </div>
        )}
      </section>

      {/* QUICK CONTACT */}
      <section className="flex gap-2.5 px-7 pb-6">
        {phoneDigits && (
          <ActionPill
            href={`tel:${phoneDigits}`}
            label={t.callBtn}
            Icon={Phone}
            bg={primary}
            fg={onPrimary}
          />
        )}
        {waDigits && (
          <ActionPill
            href={`https://wa.me/${waDigits}`}
            external
            label={t.whatsappBtn}
            Icon={MessageCircle}
            bg="#25d366"
            fg="#ffffff"
          />
        )}
        {cardData.email && (
          <ActionPill
            href={`mailto:${cardData.email}`}
            label={t.emailBtn}
            Icon={Mail}
            bg={accent}
            fg={readableTextOn(accent)}
          />
        )}
      </section>

      {/* PHILOSOPHY */}
      {cardData.bio && (
        <section
          className="relative px-7 py-8"
          style={{ background: PAGE_WARM }}
        >
          <span
            aria-hidden
            className="serif absolute left-4 top-1 text-[80px] leading-none"
            style={{ color: accent, opacity: 0.22 }}
          >
            “
          </span>
          <p
            className="serif relative pl-3 text-[16px] leading-[1.7]"
            style={{ color: INK }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* CLASSES */}
      {services.length > 0 && (
        <section className="px-7 pt-7">
          <SectionHeading primary={primary} accent={accent}>
            {t.classes}
          </SectionHeading>
          <div className="mt-4 flex flex-col gap-3">
            {services.slice(0, 4).map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex items-center justify-between rounded-2xl px-5 py-4"
                style={{
                  background: SURFACE,
                  border: `1px solid ${HAIRLINE}`,
                  borderLeft: `3px solid ${primary}`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold" style={{ color: INK }}>
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                      {linkify(svc.description)}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div
                    className="serif ml-3 whitespace-nowrap text-[18px]"
                    style={{ color: primary }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* SPECIALTIES */}
      <section className="px-7 pt-7">
        <SectionHeading primary={primary} accent={accent}>
          {t.specialties}
        </SectionHeading>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {SPECIALTIES.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-center"
              style={{ background: PAGE_WARM, color: primary }}
            >
              <Icon size={22} strokeWidth={1.6} />
              <span className="text-[13px] font-semibold" style={{ color: INK }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
        <section
          className="mt-7 px-7 py-8"
          style={{ background: PAGE_WARM }}
        >
          <div className="flex justify-around text-center">
            {stats.map((s) => (
              <Stat key={s.label} num={s.value} label={s.label} primary={primary} />
            ))}
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
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-4 text-[14px] font-bold transition-all hover:-translate-y-0.5"
          style={{ background: "#25d366", color: "#fff" }}
        >
          <MessageCircle size={18} strokeWidth={2.2} />
          {t.bookCta}
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </a>
      </section>

      {/* CONTACT */}
      <section className="px-7 pt-7">
        <SectionHeading primary={primary} accent={accent}>
          {t.contact}
        </SectionHeading>
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
        style={{ background: PAGE_WARM, border: `1px solid ${HAIRLINE}` }}
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
          <div style={{ ["--card-primary" as string]: primary, background: PAGE_WARM }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="mt-7 px-7 py-7 text-center"
        style={{ background: primary, color: onPrimary }}
      >
        <div
          className="serif text-[16px]"
          style={{ color: accent }}
        >
          {cardData.name}
        </div>
        <div
          className="mt-1 text-[10.5px]"
          style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "1px" }}
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
        <div className="mt-2 inline-flex items-center gap-1.5 text-[10.5px]" style={{ color: "rgba(255,255,255,0.65)" }}>
          <Sparkles size={11} strokeWidth={1.6} />
          {cardData.address?.split(",").slice(-1)[0]?.trim()}
        </div>
      </footer>
    </article>
  );
}

function SectionHeading({
  children,
  primary,
  accent,
}: {
  children: React.ReactNode;
  primary: string;
  accent: string;
}) {
  return (
    <h3
      className="serif flex items-center gap-3 text-[22px]"
      style={{ color: primary }}
    >
      <span
        aria-hidden
        className="block h-px w-7"
        style={{ background: accent }}
      />
      {children}
    </h3>
  );
}

function ActionPill({
  href,
  label,
  Icon,
  bg,
  fg,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  bg: string;
  fg: string;
  external?: boolean;
}) {
  void Flame; // keep tree-shake friendly import for shared icon set
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-3 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
      style={{ background: bg, color: fg }}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </a>
  );
}

function Stat({
  num,
  label,
  primary,
}: {
  num: string;
  label: string;
  primary: string;
}) {
  return (
    <div>
      <div
        className="serif text-[28px] leading-none"
        style={{ color: primary }}
      >
        {num}
      </div>
      <div
        className="mt-1 text-[11px] uppercase"
        style={{ color: INK_SOFT, letterSpacing: "1px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const wellnessTeacherEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 40,
  key: "wellness-teacher",
  name: "Wellness Teacher",
  industry: "Yoga teacher / wellness coach (solo practitioner)",
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
  sampleSlug: "demo-wellness-teacher",
};

// photo: Unsplash, yoga teacher portrait. Unsplash License — free, no attribution required.
export const wellnessTeacherSample: SampleData = {
  templateId: 40,
  slug: "demo-wellness-teacher",
  cardData: {
    name: "Sera Özdoğan",
    position: "Yoga-Lehrerin · Wellness Coach",
    title: "RYT 500",
    company: "Sera Yoga & Wellness",
    email: "sera@serayoga.de",
    phone: "+49 176 223 4567",
    whatsapp: "+49 176 223 4567",
    website: "serayoga.de",
    address: "Prenzlauer Berg, Berlin",
    bio: "Zertifizierte Yoga-Lehrerin (RYT 500) und Wellness Coach. Privatkurse, Retreat-Wochen, Online-Sessions. Atem, Bewegung, Achtsamkeit — drei Werkzeuge für ein leiseres Leben.",
    bookingUrl: "https://cal.com/serayoga/intro",
    sectorKey: "fitness",
    services: [
      { title: "Einzelstunde", description: "60 min · 1:1, individueller Plan", priceLabel: "€80" },
      { title: "Monatskurs", description: "4×/Woche · kleine Gruppen", priceLabel: "€160" },
      { title: "Retreat", description: "3 Tage · Vollpension am Meer", priceLabel: "€480" },
      { title: "Online-Session", description: "30 min · live Zoom", priceLabel: "€35" },
    ],
    stats: [
      { value: "6", label: "Jahre" },
      { value: "350+", label: "Schüler:innen" },
      { value: "18K", label: "Community" },
    ],
    socials: {
      instagram: "https://instagram.com/serayoga",
      youtube: "https://youtube.com/@serayoga",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
