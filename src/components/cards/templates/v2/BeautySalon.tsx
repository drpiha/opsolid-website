"use client";

// =============================================================================
// BeautySalon — v2 template (id=28, key="beauty-salon").
//
// Sector: beauty studio / lash artist / aesthetician. Mood: feminine premium,
// rose gold + magenta gradient, gold rating chip. Inspired by
// kart_13_guzellik.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: vivid pink/magenta gradient + gold star rating + bold sans name.
//   - Banner photo (180 px) overlapping the hero (-88 px) with shadow.
//   - Profile strip with avatar + name + Sertifikalı/Premium badges.
//   - Social row 3-up (IG / TikTok / WhatsApp) with brand-fill colors.
//   - Pill-shaped magenta-gradient CTA.
//   - Services 2-col tile grid with featured center cell.
//   - Before/After call-out card (gold gradient).
//   - Stats panel on dark gradient with pink/gold gradient text.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  Eye,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#c08b7c"; // dusty rose
const LOCKED_ACCENT = "#e8c4b8";
const GOLD = "#d6a763";
const SURFACE = "#ffffff";
const PAGE = "#fdf2f8";
const INK = "#1a0a13";
const INK_SOFT = "#6b4858";
const HAIRLINE = "#f5d3e1";

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

interface BsCopy {
  certified: string;
  premium: string;
  bookCta: string;
  servicesTitle: string;
  servicesSub: string;
  beforeAfter: string;
  beforeAfterDesc: string;
  beforeAfterCta: string;
  servicesLabel: string;
  reviewsLabel: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  studio: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", BsCopy> = {
  de: {
    certified: "Zertifiziert",
    premium: "Premium",
    bookCta: "Termin sichern",
    servicesTitle: "Services",
    servicesSub: "Premium Beauty & Permanent Makeup",
    beforeAfter: "Vorher / Nachher",
    beforeAfterDesc: "5.000+ zufriedene Kund:innen — sehen Sie die Ergebnisse",
    beforeAfterCta: "Auf Instagram ansehen",
    servicesLabel: "Leistungen",
    reviewsLabel: "Bewertungen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    studio: "Beauty Studio",
  },
  en: {
    certified: "Certified",
    premium: "Premium",
    bookCta: "Book now",
    servicesTitle: "Services",
    servicesSub: "Premium beauty & permanent makeup",
    beforeAfter: "Before / After",
    beforeAfterDesc: "5,000+ happy clients — see the transformations",
    beforeAfterCta: "View on Instagram",
    servicesLabel: "Services",
    reviewsLabel: "Reviews",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    studio: "Beauty Studio",
  },
  tr: {
    certified: "Sertifikalı",
    premium: "Premium",
    bookCta: "Hemen Randevu Al",
    servicesTitle: "Hizmetler",
    servicesSub: "Premium güzellik & kalıcı makyaj",
    beforeAfter: "Önce / Sonra",
    beforeAfterDesc: "5.000+ memnun müşteriden öncesi / sonrası fotoğraflar",
    beforeAfterCta: "Instagram'da gör",
    servicesLabel: "Hizmetler",
    reviewsLabel: "Yorum",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    studio: "Beauty Studio",
  },
  es: {

    certified: "Certificado",
    premium: "Premium",
    bookCta: "Reservar ahora",
    servicesTitle: "Servicios",
    servicesSub: "Belleza premium y maquillaje permanente",
    beforeAfter: "Antes / Después",
    beforeAfterDesc: "5.000+ clientes felices — mira las transformaciones",
    beforeAfterCta: "Ver en Instagram",
    servicesLabel: "Servicios",
    reviewsLabel: "Reseñas",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    share: "Compartir",
    poweredBy: "Desarrollado por",
    studio: "Estudio de belleza",
  
  },
  it: {

    certified: "Certificato",
    premium: "Premium",
    bookCta: "Prenota ora",
    servicesTitle: "Servizi",
    servicesSub: "Bellezza premium e trucco permanente",
    beforeAfter: "Prima / Dopo",
    beforeAfterDesc: "5.000+ clienti felici — guarda le trasformazioni",
    beforeAfterCta: "Vedi su Instagram",
    servicesLabel: "Servizi",
    reviewsLabel: "Recensioni",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    share: "Condividi",
    poweredBy: "Realizzato con",
    studio: "Studio di bellezza",
  
  },
  fr: {

    certified: "Certifié",
    premium: "Premium",
    bookCta: "Réserver maintenant",
    servicesTitle: "Services",
    servicesSub: "Beauté premium et maquillage permanent",
    beforeAfter: "Avant / Après",
    beforeAfterDesc: "5 000+ clients heureux — voyez les transformations",
    beforeAfterCta: "Voir sur Instagram",
    servicesLabel: "Services",
    reviewsLabel: "Avis",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    share: "Partager",
    poweredBy: "Propulsé par",
    studio: "Studio de beauté",
  
  },
  ar: {

    certified: "معتمد",
    premium: "مميز",
    bookCta: "احجز الآن",
    servicesTitle: "الخدمات",
    servicesSub: "تجميل فاخر ومكياج دائم",
    beforeAfter: "قبل / بعد",
    beforeAfterDesc: "5,000+ عميل سعيد — شاهد التحولات",
    beforeAfterCta: "عرض على إنستغرام",
    servicesLabel: "الخدمات",
    reviewsLabel: "التقييمات",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
    studio: "استوديو تجميل",
  
  },
};

export function BeautySalon({
  slug,
  cardData,
  locale = "de",
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const onPrimary = readableTextOn(primary);
  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);

  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];

  const heroGrad = `linear-gradient(135deg, ${primary}cc 0%, ${primary} 50%, ${accent} 100%)`;

  return (
    <article
      data-template="beauty-salon"
      className="bs-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        fontFamily: "'Nunito', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .bs-card { line-height: 1.6; }
        .bs-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 pb-28 pt-8"
        style={{ background: heroGrad, color: onPrimary }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-[280px] w-[280px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}33 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 mb-8 flex items-center justify-between">
          <div className="text-[13px] font-extrabold uppercase tracking-[1.5px]">
            {cardData.company}
          </div>
          {testimonials.length > 0 && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold"
              style={{ background: GOLD, color: INK }}
            >
              <Star size={11} fill={INK} strokeWidth={0} /> {testimonials.length}
            </span>
          )}
        </div>
        <h1 className="relative z-10 text-[36px] font-black leading-none tracking-[-1.2px]">
          {cardData.name}
        </h1>
        <div className="relative z-10 mt-3 text-[13px] font-semibold leading-[1.5] opacity-90">
          {cardData.position} {cardData.title && `· ${cardData.title}`}
        </div>
      </header>

      {/* BANNER PHOTO */}
      <section className="relative z-10 mx-[22px] -mt-[88px] overflow-hidden rounded-[22px]">
        <div
          className="relative h-[180px]"
          style={{ boxShadow: `0 18px 50px -10px ${primary}40` }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={920}
              height={460}
              unoptimized
              className="h-full w-full object-cover tpl-photo"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: `linear-gradient(135deg, ${primary}cc, ${accent}cc)` }}
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, transparent 50%, rgba(26,10,19,0.7) 100%)",
            }}
          />
          {cardData.address && (
            <div className="absolute inset-x-5 bottom-4 flex items-center justify-between text-white">
              <span className="inline-flex items-center gap-1 text-[12px] font-bold">
                <MapPin size={14} strokeWidth={2.4} />
                {cardData.address.split(",").slice(-2)[0]?.trim() || cardData.address}
              </span>
              {cardData.socials?.instagram && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold">
                  <SocialIg /> {cardData.company?.split(" ")[0] || "IG"}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* PROFILE STRIP */}
      <section
        className="mx-[22px] mt-5 flex items-center gap-4 rounded-[22px] p-5"
        style={{
          background: `linear-gradient(135deg, #fff 0%, ${PAGE} 200%)`,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={90}
            height={90}
            unoptimized
            className="h-[72px] w-[72px] flex-shrink-0 rounded-[22px] object-cover tpl-logo"
            style={{ border: "3px solid #fff", boxShadow: `0 6px 16px ${primary}40` }}
          />
        ) : (
          <div
            className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-[22px] text-white"
            style={{
              background: heroGrad,
              border: "3px solid #fff",
              boxShadow: `0 6px 16px ${primary}40`,
            }}
          >
            <Sparkles size={26} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-extrabold" style={{ color: INK }}>
            {cardData.name}
          </div>
          {(cardData.position || cardData.title) && (
            <div className="mt-0.5 text-[12px] font-semibold" style={{ color: INK_SOFT }}>
              {cardData.position || cardData.title}
            </div>
          )}
          <div className="mt-2 flex gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.4px] text-white"
              style={{ background: primary }}
            >
              {t.certified}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.4px]"
              style={{ background: GOLD, color: INK }}
            >
              {t.premium}
            </span>
          </div>
        </div>
      </section>

      {/* SOCIAL ROW */}
      <section className="grid grid-cols-3 gap-2.5 px-[22px] pt-5">
        {cardData.socials?.instagram && (
          <BsSocial
            href={cardData.socials.instagram}
            label="Instagram"
            icon={<SocialIg />}
            style={{
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              color: "#fff",
            }}
          />
        )}
        {cardData.socials?.tiktok && (
          <BsSocial
            href={cardData.socials.tiktok}
            label="TikTok"
            icon={<SocialTt />}
            style={{ background: INK, color: "#fff" }}
          />
        )}
        {waDigits && (
          <BsSocial
            href={`https://wa.me/${waDigits}`}
            label="WhatsApp"
            icon={<SocialWa />}
            style={{ background: "#25d366", color: "#fff" }}
          />
        )}
      </section>

      {/* CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="mx-[22px] mt-5">
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-[18px] text-[15px] font-extrabold tracking-[0.4px] transition-all hover:-translate-y-0.5"
            style={{
              background: heroGrad,
              color: onPrimary,
              boxShadow: `0 12px 30px -8px ${primary}66`,
            }}
          >
            {t.bookCta} →
          </a>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-[22px] py-7">
          <div className="text-[18px] font-black tracking-[-0.3px]" style={{ color: INK }}>
            {t.servicesTitle}
          </div>
          <div className="mt-1 mb-5 text-[12px] font-semibold" style={{ color: INK_SOFT }}>
            {t.servicesSub}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {services.map((s, i) => {
              const featured = i === 0;
              return (
                <article
                  key={`${s.title}-${i}`}
                  className="relative overflow-hidden rounded-[18px] p-4 transition-all hover:-translate-y-1"
                  style={
                    featured
                      ? {
                          background: heroGrad,
                          color: onPrimary,
                          border: `2px solid ${primary}`,
                        }
                      : { background: "#fff", color: INK, border: `2px solid ${HAIRLINE}` }
                  }
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-5 -top-5 h-12 w-12 rounded-full"
                    style={{
                      background: featured
                        ? "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)"
                        : `radial-gradient(circle, ${HAIRLINE} 0%, transparent 70%)`,
                    }}
                  />
                  <div
                    className="relative z-10 mb-2 flex h-9 w-9 items-center justify-center"
                    aria-hidden
                  >
                    <Wand2
                      size={22}
                      strokeWidth={2}
                      style={{ color: featured ? onPrimary : primary }}
                    />
                  </div>
                  <div
                    className="relative z-10 text-[13.5px] font-extrabold"
                    style={{ color: featured ? onPrimary : INK }}
                  >
                    {s.title}
                  </div>
                  {s.description && (
                    <div
                      className="relative z-10 mt-0.5 text-[11px]"
                      style={{ color: featured ? onPrimary : INK_SOFT, opacity: featured ? 0.9 : 1 }}
                    >
                      {s.description}
                    </div>
                  )}
                  {s.priceLabel && (
                    <div
                      className="relative z-10 mt-2 text-[15px] font-black tracking-[-0.3px]"
                      style={{ color: featured ? onPrimary : primary }}
                    >
                      {s.priceLabel}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* BEFORE / AFTER */}
      {cardData.socials?.instagram && (
        <section className="px-[22px] pb-7">
          <div
            className="flex items-center gap-3.5 rounded-[22px] p-5"
            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #c5942f 100%)`, color: INK }}
          >
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[18px] text-[28px]"
              style={{ background: "rgba(26,10,19,0.15)" }}
              aria-hidden
            >
              <Eye size={28} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] font-black">{t.beforeAfter}</div>
              <div className="mt-0.5 text-[12px] font-semibold opacity-85">
                {t.beforeAfterDesc}
              </div>
              <a
                href={cardData.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex border-b-2 pb-px text-[11.5px] font-extrabold"
                style={{ borderColor: INK, color: INK }}
              >
                {t.beforeAfterCta} →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* STATS — driven by real data */}
      {(() => {
        const statsItems = [
          ...(services.length ? [{ n: String(services.length), l: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ n: String(testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <section
            className="mx-[22px] rounded-[22px] p-6 text-white"
            style={{
              background: "linear-gradient(135deg, #1a0a13 0%, #4c0519 100%)",
              display: "grid",
              gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
              gap: "0.375rem",
            }}
          >
            {statsItems.map((stat, i) => (
              <BsStat key={stat.l} n={stat.n} l={stat.l} primary={primary} accent={accent} last={i === statsItems.length - 1} />
            ))}
          </section>
        );
      })()}

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="px-[22px] py-7">
          <article
            className="rounded-[22px] p-5"
            style={{
              background: "#fff",
              border: `2px solid ${HAIRLINE}`,
            }}
          >
            <div className="mb-2 text-[14px]" style={{ color: GOLD, letterSpacing: "2px" }}>
              ★★★★★
            </div>
            <p className="text-[13.5px] italic leading-[1.65]" style={{ color: INK }}>
              &ldquo;{testimonials[0].quote}&rdquo;
            </p>
            <div className="mt-3 text-[12px] font-extrabold" style={{ color: primary }}>
              — {testimonials[0].author}
            </div>
          </article>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-[22px] pb-7">
        <h3 className="mb-4 text-[16px] font-black" style={{ color: INK }}>
          Kontakt
        </h3>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section className="px-[22px] pb-5">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* WALLET */}
      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-[22px] mb-4 rounded-3xl border bg-white px-5 py-4"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* SEND / EXCHANGE */}
      <section
        className="mx-[22px] mb-5 rounded-3xl bg-white p-5"
        style={{ border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {/* FOOTER */}
      <footer
        className="px-[22px] py-7 text-center text-white"
        style={{ background: heroGrad, color: onPrimary }}
      >
        <div className="text-[16px] font-black tracking-[-0.3px]">
          {cardData.company || cardData.name}
        </div>
        <div className="mt-1 text-[11px] font-semibold opacity-85">
          {cardData.website} · © {new Date().getFullYear()}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] opacity-90"
          style={{ color: onPrimary }}
        >
          <Shield size={11} strokeWidth={1.6} />
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline-offset-2"
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

function BsSocial({
  href,
  label,
  icon,
  style,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-[16px] px-2 py-3.5 text-[12px] font-extrabold transition-all hover:-translate-y-0.5"
      style={style}
    >
      {icon}
      {label}
    </a>
  );
}

function BsStat({
  n,
  l,
  primary,
  accent,
  last,
}: {
  n: string;
  l: string;
  primary: string;
  accent: string;
  last?: boolean;
}) {
  void primary;
  return (
    <div
      className="text-center"
      style={{ borderRight: last ? "none" : "1px solid rgba(255,255,255,0.10)" }}
    >
      <div
        className="text-[22px] font-black"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${GOLD})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {n}
      </div>
      <div className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.5px] opacity-75">
        {l}
      </div>
    </div>
  );
}

function SocialIg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SocialTt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.6 6.3a4.7 4.7 0 01-3-1.4 4.6 4.6 0 01-1.4-3H11.5v13.2c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5c.3 0 .6.05.8.14V8.9a6.4 6.4 0 00-.8-.05A6.3 6.3 0 003 15.1a6.3 6.3 0 0011.5 3.6V11.5a8.3 8.3 0 005.1 1.7V9.5a4.7 4.7 0 01-1-.05V6.3z" />
    </svg>
  );
}

function SocialWa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01A9.84 9.84 0 0012.04 2z" />
    </svg>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const beautySalonEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 28,
  key: "beauty-salon",
  name: "Beauty Salon",
  industry: "Beauty studio / lash artist / aesthetician",
  supports: {
    services: true,
    faqs: true,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: { brandPrimaryHex: LOCKED_PRIMARY, brandAccentHex: LOCKED_ACCENT },
  sampleSlug: "demo-beauty-salon",
};

// photo: Unsplash, Element5 Digital. Unsplash License — free, no attribution required.
export const beautySalonSample: SampleData = {
  templateId: 28,
  slug: "demo-beauty-salon",
  cardData: {
    name: "Buse Arslan",
    position: "Beauty & Lash Artist",
    title: "Permanent Makeup",
    company: "Beauty by Buse",
    phone: "+49 30 558 4422",
    whatsapp: "+49 176 445 2345",
    email: "buse@beautybybuse.de",
    website: "beautybybuse.de",
    address: "Friedrichstr. 67, 10117 Berlin",
    bio: "7 yıl deneyim · 5.000+ memnun müşteri. Premium güzellik & kalıcı makyaj.",
    services: [
      { title: "Microblading", description: "Kalıcı kaş", priceLabel: "€280" },
      { title: "Lash Lift & Tint", description: "Kirpik bakımı", priceLabel: "€65" },
      { title: "Gesichtsbehandlung", description: "Hidrafacial", priceLabel: "€85" },
      { title: "Eyeliner", description: "Kalıcı makyaj", priceLabel: "€220" },
    ],
    testimonials: [
      { author: "Selin K.", quote: "Microblading sonucu inanılmaz doğal duruyor. Buse'nin elinden çıkmış her ayrıntı kusursuz." },
    ],
    socials: {
      instagram: "https://instagram.com/beautybybuse",
      tiktok: "https://tiktok.com/@beautybybuse",
    },
    sectorKey: "salon",
  },
  photoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
