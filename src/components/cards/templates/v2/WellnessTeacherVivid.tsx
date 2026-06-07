"use client";

// =============================================================================
// WellnessTeacherVivid — v2 template (id=42, key="wellness-teacher-vivid").
//
// Sector: Yoga teacher / wellness — VIVID variant. Mood: sunset gradient,
// energetic poppy emerald-style, white app cards, follower stats glow strip.
// Inspired by kart_17_yoga_vivid.html. Default colors here use a vibrant
// orange-amber (sunrise) palette so it visually contrasts with the sage
// default and the white pure variant.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: tall gradient panel (primaryâ†’deep) with rounded radial glows,
//     a "tag" pill, big bold name, role line and a mantra paragraph.
//   - Profile strip floats over hero (-36 px) with avatar + white card chip.
//   - 3 quick-action pills (Call · WhatsApp · Email).
//   - Class categories: 2×2 grid of icon cards with rounded squircle wrap.
//   - Service price cards: gradient row backgrounds.
//   - Stats panel: gradient banner with three numbers.
//   - Free trial CTA card at the end.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Leaf,
  Mail,
  MessageCircle,
  Moon,
  Phone,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#f97316"; // sunset orange
const LOCKED_ACCENT = "#fbbf24"; // golden amber
const PAGE = "#fff8f1";
const SURFACE = "#ffffff";
const INK = "#1f1408";
const INK_SOFT = "#73604c";
const HAIRLINE = "#f1e7d8";

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
  role: string;
  mantra: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  classCats: string;
  services: string;
  yearsLabel: string;
  studentsLabel: string;
  communityLabel: string;
  trialBadge: string;
  trialTitle: string;
  trialDesc: string;
  trialBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    tag: "Yoga & Wellness",
    role: "Zertifizierte RYT-500 Yoga-Lehrerin",
    mantra:
      "Komm zurück in deinen Körper. Atme. Sei hier. Yoga beginnt genau in diesem Moment.",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    classCats: "Stundenkategorien",
    services: "Pakete",
    yearsLabel: "Jahre",
    studentsLabel: "Schüler:innen",
    communityLabel: "Community",
    trialBadge: "Für Anfänger:innen",
    trialTitle: "Erste Stunde kostenlos",
    trialDesc:
      "Du beginnst gerade mit Yoga? Die erste Stunde geht aufs Haus. Kennenlernen, ausprobieren, entscheiden.",
    trialBtn: "Jetzt buchen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
  },
  en: {
    tag: "Yoga & Wellness",
    role: "RYT-500 Certified Yoga Teacher",
    mantra:
      "Come back to your body. Breathe. Be here. Yoga starts in exactly this moment.",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    classCats: "Class categories",
    services: "Packages",
    yearsLabel: "Years",
    studentsLabel: "Students",
    communityLabel: "Community",
    trialBadge: "Beginners welcome",
    trialTitle: "First class free",
    trialDesc:
      "Just starting with yoga? Your first class is on me. Try it, feel it, decide for yourself.",
    trialBtn: "Book now",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
  },
  tr: {
    tag: "Yoga & Wellness",
    role: "RYT-500 Sertifikalı Yoga Eğitmeni",
    mantra:
      "Bedenine geri dön. Nefesini dinle. Tam burada ol. Yoga yolculuğu burada başlıyor.",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    classCats: "Ders Kategorileri",
    services: "Paketler",
    yearsLabel: "Yıl",
    studentsLabel: "Öğrenci",
    communityLabel: "Topluluk",
    trialBadge: "Yeni Başlayanlara",
    trialTitle: "İlk Ders Ücretsiz",
    trialDesc:
      "Yoga yolculuğuna başlıyorsan ilk dersin bizden. Tanı, dene, karar ver.",
    trialBtn: "Hemen Rezervasyon",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    contact: "İletişim",
  },
  es: {

    tag: "Yoga y bienestar",
    role: "Profesor de yoga certificado RYT-500",
    mantra:
      "Come back to your body. Breathe. Be here. Yoga starts in exactly this moment.",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    classCats: "Categorías de clase",
    services: "Paquetes",
    yearsLabel: "Años",
    studentsLabel: "Estudiantes",
    communityLabel: "Comunidad",
    trialBadge: "Principiantes bienvenidos",
    trialTitle: "Primera clase gratis",
    trialDesc:
      "Just starting with yoga? Your first class is on me. Try it, feel it, decide for yourself.",
    trialBtn: "Reservar ahora",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    contact: "Contacto",
  
  },
  it: {

    tag: "Yoga e benessere",
    role: "Insegnante di yoga certificato RYT-500",
    mantra:
      "Come back to your body. Breathe. Be here. Yoga starts in exactly this moment.",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    classCats: "Categorie di classi",
    services: "Pacchetti",
    yearsLabel: "Anni",
    studentsLabel: "Studenti",
    communityLabel: "Comunità",
    trialBadge: "Principianti benvenuti",
    trialTitle: "Prima lezione gratuita",
    trialDesc:
      "Just starting with yoga? Your first class is on me. Try it, feel it, decide for yourself.",
    trialBtn: "Prenota ora",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    contact: "Contatto",
  
  },
  fr: {

    tag: "Yoga et bien-être",
    role: "Professeur de yoga certifié RYT-500",
    mantra:
      "Come back to your body. Breathe. Be here. Yoga starts in exactly this moment.",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    classCats: "Catégories de cours",
    services: "Forfaits",
    yearsLabel: "Années",
    studentsLabel: "Étudiants",
    communityLabel: "Communauté",
    trialBadge: "Débutants bienvenus",
    trialTitle: "Premier cours offert",
    trialDesc:
      "Just starting with yoga? Your first class is on me. Try it, feel it, decide for yourself.",
    trialBtn: "Réserver maintenant",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    contact: "Contact",
  
  },
  ar: {

    tag: "اليوغا والعافية",
    role: "معلم يوغا معتمد RYT-500",
    mantra:
      "Come back to your body. Breathe. Be here. Yoga starts in exactly this moment.",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    classCats: "فئات الحصص",
    services: "الباقات",
    yearsLabel: "سنوات",
    studentsLabel: "الطلاب",
    communityLabel: "المجتمع",
    trialBadge: "نرحب بالمبتدئين",
    trialTitle: "الحصة الأولى مجانية",
    trialDesc:
      "Just starting with yoga? Your first class is on me. Try it, feel it, decide for yourself.",
    trialBtn: "احجز الآن",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    contact: "اتصال",
  
  },
};

const CLASS_CATS: { Icon: typeof Leaf; name: string; meta: string }[] = [
  { Icon: Leaf, name: "Hatha", meta: "60 min" },
  { Icon: Sun, name: "Vinyasa", meta: "75 min" },
  { Icon: Wind, name: "Restorative", meta: "90 min" },
  { Icon: Moon, name: "Meditation", meta: "30 min" },
];

export function WellnessTeacherVivid({
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
  const primaryDeep = shade(primary, -50);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";
  const services = cardData.services ?? [];
  const year = new Date().getFullYear();

  return (
    <article
      data-template="wellness-teacher-vivid"
      className="wtv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 18px 50px rgba(249,115,22,0.18)",
      }}
    >
      <style jsx global>{`
        .wtv-card {
          font-family: var(--tpl-font-body, 'Poppins', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
        }
        .wtv-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 py-14"
        style={{
          background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 50%, ${accent} 100%)`,
          color: "#fff",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)",
          }}
        />

        <div className="relative">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase"
            style={{
              background: "rgba(255,255,255,0.18)",
              borderColor: "rgba(255,255,255,0.32)",
              letterSpacing: "1.5px",
            }}
          >
            <Leaf size={12} strokeWidth={2} />
            {t.tag}
            {cardData.address ? ` · ${cardData.address.split(",")[0]?.trim()}` : ""}
          </span>
          <h1
            className="mt-5 text-[30px] font-bold leading-[1.05] tracking-[-0.6px]"
          >
            {cardData.name}
          </h1>
          <div
            className="mt-1.5 text-[14px] font-medium"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            {cardData.title || t.role}
          </div>
          <p
            className="mt-7 text-[14px] italic leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            “{cardData.bio || t.mantra}”
          </p>
        </div>
      </header>

      {/* PROFILE STRIP */}
      <section className="relative z-[2] -mt-9 flex items-center gap-4 px-7">
        <div
          className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-full"
          style={{
            border: "4px solid #fff",
            boxShadow: "0 8px 28px rgba(15,15,26,0.18)",
            background: PAGE,
          }}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt="" fill sizes="72px" unoptimized className="object-cover tpl-photo" />
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
            boxShadow: "0 8px 28px rgba(249,115,22,0.18)",
          }}
        >
          <div
            className="text-[12px] font-semibold uppercase"
            style={{ color: primary, letterSpacing: "0.8px" }}
          >
            {cardData.position?.split("·")[0]?.trim() || "Yoga Teacher"}
          </div>
          <div className="mt-0.5 text-[13px]" style={{ color: INK_SOFT }}>
            6 {t.yearsLabel} · 350+ {t.studentsLabel}
          </div>
        </div>
      </section>

      {/* QUICK */}
      <section className="flex gap-2.5 px-7 pb-2 pt-6">
        {phoneDigits && (
          <Pill href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} bg={primaryDeep} fg="#fff" />
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
          <Pill href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} bg={primary} fg={onPrimary} />
        )}
      </section>

      {/* CLASS CATEGORIES */}
      <section className="px-7 pt-7">
        <SectionTitle primary={primary}>{t.classCats}</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {CLASS_CATS.map(({ Icon, name, meta }) => (
            <div
              key={name}
              className="rounded-2xl px-4 py-5 text-center transition-all hover:-translate-y-0.5"
              style={{
                background: SURFACE,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <div
                className="mx-auto mb-3 flex h-13 w-13 items-center justify-center rounded-2xl"
                style={{
                  width: 52,
                  height: 52,
                  background: `${accent}33`,
                  color: primary,
                }}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <div className="text-[14px] font-bold" style={{ color: INK }}>
                {name}
              </div>
              <div className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>
                {meta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-7 pt-7">
          <SectionTitle primary={primary}>{t.services}</SectionTitle>
          <div className="mt-4 grid gap-2.5">
            {services.slice(0, 5).map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-center justify-between rounded-2xl px-5 py-4"
                style={{
                  background: `linear-gradient(135deg, ${accent}26 0%, ${SURFACE} 100%)`,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold" style={{ color: INK }}>
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div
                    className="ml-3 whitespace-nowrap text-[20px] font-bold"
                    style={{ color: primary }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATS */}
      <section
        className="mt-7 px-7 py-8"
        style={{
          background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 100%)`,
          color: "#fff",
        }}
      >
        <div className="flex justify-around text-center">
          <Stat num="6" label={t.yearsLabel} accent={accent} />
          <Stat num="350+" label={t.studentsLabel} accent={accent} />
          <Stat num="18K" label={t.communityLabel} accent={accent} />
        </div>
      </section>

      {/* FREE TRIAL */}
      <section className="px-7 pt-7">
        <div
          className="relative overflow-hidden rounded-[20px] px-6 py-7 text-center"
          style={{
            background: `linear-gradient(135deg, ${SURFACE} 0%, ${accent}22 100%)`,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full"
            style={{ background: `radial-gradient(circle, ${accent}33, transparent 70%)` }}
          />
          <span
            className="relative inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase"
            style={{
              background: primary,
              color: onPrimary,
              letterSpacing: "1.5px",
            }}
          >
            {t.trialBadge}
          </span>
          <h3
            className="relative mt-3 text-[20px] font-bold"
            style={{ color: INK }}
          >
            {t.trialTitle}
          </h3>
          <p className="relative mt-2 text-[13px]" style={{ color: INK_SOFT }}>
            {t.trialDesc}
          </p>
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-bold transition-all hover:-translate-y-0.5"
            style={{
              background: primary,
              color: onPrimary,
              boxShadow: `0 12px 24px ${primary}66`,
            }}
          >
            <MessageCircle size={14} strokeWidth={2.4} />
            {t.trialBtn}
            <ArrowUpRight size={14} strokeWidth={2.4} />
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-7 pt-7">
        <SectionTitle primary={primary}>{t.contact}</SectionTitle>
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
        className="mt-7 px-7 py-6 text-center text-[11px]"
        style={{
          background: INK,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "1px",
        }}
      >
        <div className="font-bold" style={{ color: accent }}>
          {cardData.company || cardData.name}
        </div>
        <div className="mt-1">
          © {year} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: onAccent === "#1a1a1a" ? accent : accent }}
          >
            OpSolid
          </a>
        </div>
        <div
          className="mt-2 inline-flex items-center gap-1 text-[10.5px]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <Sparkles size={11} strokeWidth={1.6} /> {cardData.address || ""}
        </div>
      </footer>
    </article>
  );
}

function SectionTitle({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="flex items-center gap-2.5 text-[16px] font-bold"
      style={{ color: INK }}
    >
      <span
        aria-hidden
        className="block h-[22px] w-1 rounded-[2px]"
        style={{ background: primary }}
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
      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
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
      <div className="text-[30px] font-extrabold leading-none" style={{ color: accent }}>
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

export const wellnessTeacherVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 42,
  key: "wellness-teacher-vivid",
  name: "Wellness — Vivid",
  industry: "Yoga teacher / wellness coach (solo)",
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
  sampleSlug: "demo-wellness-teacher-vivid",
};

// photo: Unsplash, yoga teacher portrait. Unsplash License — free, no attribution required.
export const wellnessTeacherVividSample: SampleData = {
  templateId: 42,
  slug: "demo-wellness-teacher-vivid",
  cardData: {
    name: "Sera Özdoğan",
    position: "Yoga-Lehrerin · Wellness Coach",
    title: "RYT-500 zertifiziert",
    company: "Sera Yoga & Wellness",
    email: "sera@serayoga.de",
    phone: "+49 176 223 4567",
    whatsapp: "+49 176 223 4567",
    website: "serayoga.de",
    address: "Friedrichshain, Berlin",
    bio: "Atem, Bewegung, Achtsamkeit. Jede Stunde ist eine Einladung, kurz aus dem Lärm zu treten und in den eigenen Körper zurückzukehren.",
    bookingUrl: "https://cal.com/serayoga/intro",
    sectorKey: "fitness",
    services: [
      { title: "Einzelstunde", description: "60 min · 1:1, individuell", priceLabel: "â‚¬80" },
      { title: "Monatskurs", description: "4×/Woche, kleine Gruppe", priceLabel: "â‚¬160" },
      { title: "Retreat", description: "3 Tage · Vollpension", priceLabel: "â‚¬480" },
    ],
    socials: {
      instagram: "https://instagram.com/serayoga",
      youtube: "https://youtube.com/@serayoga",
      tiktok: "https://tiktok.com/@serayoga",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

