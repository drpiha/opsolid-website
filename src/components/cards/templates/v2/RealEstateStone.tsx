"use client";

// =============================================================================
// RealEstateStone — v2 template (id=55, key="real-estate-stone").
//
// Sector: real estate / broker — STONE variant. Mood: warm taupe paper banner,
// Fraunces serif italic, sepia-tinted circular portrait, earthy greys & golds,
// rounded warm panels. Inspired by kart_01_emlak_stone.html.
//
// Design DNA (different from default RealEstate.tsx):
//   - Warm banner: paper-grain SVG texture + warm radial gradients, eyebrow
//     in serif italic, large 132 px circular framed avatar with sepia filter.
//   - Wave divider SVG between banner and content.
//   - 3-up rounded warm stat tiles with gold top-rule.
//   - Centered "Story" section with first-person serif paragraph & signature.
//   - Slogan: rounded warm panel with side hairline whiskers.
//   - Services: warm rounded rows with gold square icon.
//   - Testimonial: warm gradient block with stars.
//   - Contact: pill-shape rounded buttons with circular icon chips.
//   - Footer: warm panel + rounded copper vCard pill.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Globe, Home, Mail, MessageCircle, Phone, Shield, Star } from "lucide-react";

import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#6b5340"; // warm taupe primary
const LOCKED_ACCENT = "#c8a951"; // warm gold accent

const CARD = "#fdf8f0";
const PAPER_WARM = "#f8f1e3";
const PAPER_DEEP_1 = "#f8efde";
const PAPER_DEEP_2 = "#f5e8d0";
const PAPER_DEEP_3 = "#efe1c4";
const TEXT = "#2a1f14";
const TEXT_MUTED = "#7a6858";
const BORDER = "#ddd0be";
const BORDER_SOFT = "#ebdfca";

// Decorative paper grain (kept inline as a small data URI to avoid an asset).
const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.4 0 0 0 0 0.2 0 0 0 0.07 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")";

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  return (parts[0][0] ?? "•").toUpperCase() + (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

interface ResCopy {
  bannerEyebrow: string;
  storyEyebrow: string;
  storyTitle: string;
  servicesTitle: string;
  contactTitle: string;
  contactCall: string;
  contactWa: string;
  contactWaSub: string;
  contactEmail: string;
  contactWeb: string;
  yearsLabel: string;
  closedLabel: string;
  portfolioLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", ResCopy> = {
  de: {
    bannerEyebrow: "Mit Sorgfalt seit 2014",
    storyEyebrow: "Meine Geschichte",
    storyTitle: "Bewährte Vermittlung",
    servicesTitle: "Was ich tue",
    contactTitle: "Lassen Sie uns reden",
    contactCall: "Telefon",
    contactWa: "WhatsApp",
    contactWaSub: "Schreiben Sie mir",
    contactEmail: "E-Mail",
    contactWeb: "Web",
    yearsLabel: "Jahre",
    closedLabel: "Abschlüsse",
    portfolioLabel: "Portfolio â‚¬",
    saveContact: "In Kontakte speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
  },
  en: {
    bannerEyebrow: "With care since 2014",
    storyEyebrow: "My story",
    storyTitle: "Trusted brokerage",
    servicesTitle: "What I do",
    contactTitle: "Let's talk",
    contactCall: "Phone",
    contactWa: "WhatsApp",
    contactWaSub: "Send a message",
    contactEmail: "Email",
    contactWeb: "Web",
    yearsLabel: "Years",
    closedLabel: "Closed",
    portfolioLabel: "Portfolio â‚¬",
    saveContact: "Save to contacts",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
  },
  tr: {
    bannerEyebrow: "2014'ten beri sevgiyle",
    storyEyebrow: "Hikayem",
    storyTitle: "Güvenilir Aracılık",
    servicesTitle: "Yapabildiklerim",
    contactTitle: "Beraber Konuşalım",
    contactCall: "Telefon",
    contactWa: "WhatsApp",
    contactWaSub: "Bana yazın",
    contactEmail: "E-posta",
    contactWeb: "Web",
    yearsLabel: "Yıl",
    closedLabel: "Satış",
    portfolioLabel: "Portföy â‚º",
    saveContact: "Rehbere Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
  },
  es: {

    bannerEyebrow: "Con cuidado desde 2014",
    storyEyebrow: "Mi historia",
    storyTitle: "Inmobiliaria de confianza",
    servicesTitle: "Lo que hago",
    contactTitle: "Hablemos",
    contactCall: "Teléfono",
    contactWa: "WhatsApp",
    contactWaSub: "Enviar un mensaje",
    contactEmail: "Correo",
    contactWeb: "Web",
    yearsLabel: "Años",
    closedLabel: "Cerrado",
    portfolioLabel: "Portfolio â‚¬",
    saveContact: "Guardar en contactos",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    share: "Compartir",
  
  },
  it: {

    bannerEyebrow: "Con cura dal 2014",
    storyEyebrow: "La mia storia",
    storyTitle: "Agenzia di fiducia",
    servicesTitle: "Cosa faccio",
    contactTitle: "Parliamo",
    contactCall: "Telefono",
    contactWa: "WhatsApp",
    contactWaSub: "Invia un messaggio",
    contactEmail: "Email",
    contactWeb: "Web",
    yearsLabel: "Anni",
    closedLabel: "Chiuso",
    portfolioLabel: "Portfolio â‚¬",
    saveContact: "Salva nei contatti",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    impressum: "Impressum",
    privacy: "Privacy",
    share: "Condividi",
  
  },
  fr: {

    bannerEyebrow: "Avec soin depuis 2014",
    storyEyebrow: "Mon histoire",
    storyTitle: "Agence de confiance",
    servicesTitle: "Ce que je fais",
    contactTitle: "Discutons",
    contactCall: "Téléphone",
    contactWa: "WhatsApp",
    contactWaSub: "Envoyer un message",
    contactEmail: "E-mail",
    contactWeb: "Web",
    yearsLabel: "Années",
    closedLabel: "Fermé",
    portfolioLabel: "Portfolio â‚¬",
    saveContact: "Enregistrer dans les contacts",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    share: "Partager",
  
  },
  ar: {

    bannerEyebrow: "بعناية منذ 2014",
    storyEyebrow: "قصتي",
    storyTitle: "وساطة موثوقة",
    servicesTitle: "ما أفعله",
    contactTitle: "لنتحدث",
    contactCall: "هاتف",
    contactWa: "واتساب",
    contactWaSub: "أرسل رسالة",
    contactEmail: "البريد الإلكتروني",
    contactWeb: "ويب",
    yearsLabel: "سنوات",
    closedLabel: "مغلق",
    portfolioLabel: "Portfolio â‚¬",
    saveContact: "حفظ في جهات الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    share: "مشاركة",
  
  },
};

export function RealEstateStone({
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

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];
  const reference = testimonials[0];

  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const region = cardData.address?.split(",").slice(-1)[0]?.trim() || "Berlin";
  const year = new Date().getFullYear();

  return (
    <article
      data-template="real-estate-stone"
      className="res-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: CARD,
        color: TEXT,
        boxShadow: "0 24px 60px rgba(74,55,40,0.18)",
      }}
    >
      <style jsx global>{`
        .res-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.65;
        }
        .res-card .serif {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', Georgia, serif);
        }
        .res-card a { color: inherit; }
      `}</style>

      {/* WARM BANNER */}
      <header
        className="relative px-7 pb-9 pt-12 text-center"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${accent}29 0%, transparent 45%), radial-gradient(circle at 80% 60%, ${primary}1f 0%, transparent 50%), linear-gradient(180deg, ${PAPER_DEEP_1} 0%, ${PAPER_DEEP_2} 100%)`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: PAPER_GRAIN,
            opacity: 0.45,
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="serif relative mb-4 text-[13px] italic font-normal"
          style={{ color: primary, letterSpacing: "0.5px" }}
        >
          {cardData.company || "Walker & Stein"} · {t.bannerEyebrow}
        </div>
        <div
          className="relative mx-auto mb-5"
          style={{
            position: "relative",
            width: 132,
            height: 132,
            borderRadius: "50%",
            padding: 6,
            background: CARD,
            boxShadow: `0 6px 20px ${primary}33`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `1.5px solid ${accent}` }}
          />
          <div
            className="relative h-full w-full overflow-hidden rounded-full"
            style={{ background: PAPER_WARM }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                fill
                sizes="132px"
                unoptimized
                className="object-cover tpl-photo"
                style={{ filter: "sepia(0.18) contrast(1.05) saturate(1.08)" }}
              />
            ) : (
              <div
                className="serif flex h-full w-full items-center justify-center text-[40px] font-bold"
                style={{ color: primary }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
        <h1
          className="serif relative text-[34px] font-semibold leading-[1.05]"
          style={{ color: TEXT, letterSpacing: "-1px" }}
        >
          {firstName}{" "}
          {lastName && (
            <em
              className="font-normal italic"
              style={{ color: primary }}
            >
              {lastName}
            </em>
          )}
        </h1>
        <div
          className="relative mt-2 text-[13px] font-medium"
          style={{ color: TEXT_MUTED, letterSpacing: "0.3px" }}
        >
          {[cardData.position, region].filter(Boolean).join(" · ")}
        </div>
      </header>

      {/* WAVE DIVIDER */}
      <div className="block h-8 w-full" style={{ background: CARD }} aria-hidden>
        <svg viewBox="0 0 460 32" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0,16 Q57.5,0 115,16 T230,16 T345,16 T460,16 L460,0 L0,0 Z"
            fill={PAPER_DEEP_2}
          />
        </svg>
      </div>

      {/* STATS ROW */}
      <div className="flex gap-3 px-7 pb-8">
        <StatTile num="12" label={t.yearsLabel} primary={primary} accent={accent} />
        <StatTile num="180+" label={t.closedLabel} primary={primary} accent={accent} />
        <StatTile num="2.4B" label={t.portfolioLabel} primary={primary} accent={accent} />
      </div>

      {/* STORY */}
      {cardData.bio && (
        <section className="px-7 py-8">
          <Flourish accent={accent} />
          <h2 className="serif mb-5 text-center text-[26px] italic font-medium" style={{ color: primary, letterSpacing: "-0.3px" }}>
            {t.storyEyebrow}
          </h2>
          <p
            className="serif text-center text-[15.5px] leading-[1.75]"
            style={{ color: TEXT }}
          >
            {cardData.bio}
            <span
              className="serif mt-4 block text-[16px] italic font-medium"
              style={{ color: primary }}
            >
              — {cardData.name}
            </span>
          </p>
        </section>
      )}

      {/* SLOGAN */}
      <div
        className="relative mx-7 rounded-[14px] px-6 py-7 text-center"
        style={{
          background: PAPER_WARM,
          border: `1px solid ${BORDER_SOFT}`,
        }}
      >
        <span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 block h-px"
          style={{ left: -8, width: 26, background: accent }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 block h-px"
          style={{ right: -8, width: 26, background: accent }}
        />
        <p
          className="serif text-[17px] italic font-medium leading-[1.5]"
          style={{ color: primary }}
        >
          &ldquo;{cardData.title || "Bringing every brief to its right address."}&rdquo;
        </p>
      </div>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-7 py-8">
          <Flourish accent={accent} />
          <h2 className="serif mb-5 text-center text-[26px] italic font-medium" style={{ color: primary, letterSpacing: "-0.3px" }}>
            {t.servicesTitle}
          </h2>
          <div className="flex flex-col gap-3">
            {services.slice(0, 6).map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex items-center gap-4 rounded-[14px] px-[18px] py-4 transition-all hover:translate-x-1"
                style={{
                  background: PAPER_WARM,
                  border: `1px solid ${BORDER_SOFT}`,
                }}
              >
                <div
                  className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-[12px]"
                  style={{ background: `${accent}29`, color: primary }}
                >
                  <Home size={20} strokeWidth={1.7} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="serif text-[15.5px] font-medium leading-[1.3]"
                    style={{ color: TEXT }}
                  >
                    {svc.title}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="mt-0.5 text-[11px] font-semibold uppercase"
                      style={{ color: primary, letterSpacing: "0.5px" }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {reference && (
        <div
          className="relative mx-7 rounded-2xl border px-6 py-8"
          style={{
            background: `linear-gradient(180deg, ${PAPER_DEEP_2} 0%, ${PAPER_DEEP_3} 100%)`,
            borderColor: BORDER,
          }}
        >
          <span
            aria-hidden
            className="serif absolute left-[18px] top-2 text-[70px] italic font-bold"
            style={{ color: accent, opacity: 0.6, lineHeight: 1 }}
          >
            &ldquo;
          </span>
          <p
            className="serif relative pl-[22px] text-[15px] italic font-normal leading-[1.65]"
            style={{ color: TEXT }}
          >
            {reference.quote}
          </p>
          <div className="mt-4 flex items-center gap-2.5 pl-[22px]">
            <span className="flex" style={{ color: accent }} aria-label="5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span
              className="text-[13px] font-bold"
              style={{ color: primary }}
            >
              {reference.author}
              {reference.role && <span style={{ color: TEXT_MUTED, fontWeight: 600 }}> · {reference.role}</span>}
            </span>
          </div>
        </div>
      )}

      {/* CONTACT */}
      <section className="px-7 py-8">
        <Flourish accent={accent} />
        <h2
          className="serif mb-5 text-center text-[26px] italic font-medium"
          style={{ color: primary, letterSpacing: "-0.3px" }}
        >
          {t.contactTitle}
        </h2>
        <div className="flex flex-col gap-2.5">
          {phoneDigits && (
            <PillBtn href={`tel:${phoneDigits}`} label={t.contactCall} value={cardData.phone ?? ""} primary={primary} Icon={Phone} />
          )}
          {waDigits && (
            <PillBtn
              href={`https://wa.me/${waDigits}`}
              external
              label={t.contactWa}
              value={t.contactWaSub}
              primary={primary}
              Icon={MessageCircle}
            />
          )}
          {cardData.email && (
            <PillBtn
              href={`mailto:${cardData.email}`}
              label={t.contactEmail}
              value={cardData.email}
              primary={primary}
              Icon={Mail}
            />
          )}
          {cardData.website && (
            <PillBtn
              href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
              external
              label={t.contactWeb}
              value={cardData.website.replace(/^https?:\/\//, "")}
              primary={primary}
              Icon={Globe}
            />
          )}
        </div>
      </section>

      {/* CTA Slots */}
      <section className="px-7 pb-2">
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {/* QR-WARM PANEL + vCard */}
      <div
        className="px-7 py-9 text-center"
        style={{
          background: PAPER_WARM,
          borderTop: `1px solid ${BORDER_SOFT}`,
        }}
      >
        <p
          className="serif mb-4 text-[13px] italic"
          style={{ color: primary }}
        >
          {cardData.address || `${cardData.company || "Walker & Stein"} · ${region}`}
        </p>
        <a
          href={`/api/cards/${encodeURIComponent(slug)}/vcard`}
          download
          className="inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[14px] font-bold transition-all hover:opacity-95"
          style={{
            background: primary,
            color: onPrimary,
            boxShadow: `0 4px 12px ${primary}40`,
            letterSpacing: "0.4px",
            width: "100%",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {t.saveContact}
        </a>
      </div>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em]"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <section className="px-7 pb-3 pt-6" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 pb-8 pt-7 text-center"
        style={{ borderTop: `1px solid ${BORDER_SOFT}`, background: CARD }}
      >
        <div
          className="serif text-[14px] font-medium italic"
          style={{ color: primary }}
        >
          {cardData.name}
          {cardData.company && (
            <span style={{ color: TEXT_MUTED, fontStyle: "normal", fontWeight: 600 }}>
              {" · "}
              {cardData.company}
            </span>
          )}
        </div>
        <div
          className="mt-1 text-[11px]"
          style={{ color: TEXT_MUTED }}
        >
          © {year} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </div>
        <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px]" style={{ color: TEXT_MUTED }}>
          {cardData.impressumUrl && (
            <a href={cardData.impressumUrl} target="_blank" rel="noopener noreferrer">
              {t.impressum}
            </a>
          )}
          {cardData.privacyUrl && (
            <a href={cardData.privacyUrl} target="_blank" rel="noopener noreferrer">
              {t.privacy}
            </a>
          )}
          <span className="inline-flex items-center gap-1">
            <Shield size={11} strokeWidth={1.6} />
            opsolid.de/c/{slug}
          </span>
        </div>
      </footer>
    </article>
  );
}

function Flourish({ accent }: { accent: string }) {
  return (
    <div className="mb-3.5 flex items-center gap-3">
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 0 3px ${accent}2e` }}
      />
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
    </div>
  );
}

function StatTile({
  num,
  label,
  primary,
  accent,
}: {
  num: string;
  label: string;
  primary: string;
  accent: string;
}) {
  return (
    <div
      className="relative flex-1 overflow-hidden rounded-[14px] px-[10px] py-[18px] text-center"
      style={{
        background: PAPER_WARM,
        border: `1px solid ${BORDER_SOFT}`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${primary})`,
        }}
      />
      <div
        className="serif text-[26px] font-semibold leading-none"
        style={{ color: primary, letterSpacing: "-0.5px" }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[10.5px] font-semibold uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "0.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function PillBtn({
  href,
  label,
  value,
  primary,
  Icon,
  external,
}: {
  href: string;
  label: string;
  value: string;
  primary: string;
  Icon: typeof Phone;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center gap-3.5 rounded-full px-[18px] py-3.5 transition-all hover:translate-x-0.5"
      style={{
        background: PAPER_WARM,
        border: `1.5px solid ${BORDER}`,
        color: TEXT,
        textDecoration: "none",
      }}
    >
      <span
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          background: `${primary}1a`,
          color: primary,
        }}
      >
        <Icon size={16} strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="block text-[11px] font-semibold uppercase"
          style={{ color: TEXT_MUTED, letterSpacing: "0.5px", lineHeight: 1 }}
        >
          {label}
        </span>
        <span
          className="serif mt-1 block truncate text-[14px] font-medium"
          style={{ color: TEXT, lineHeight: 1.2 }}
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

export const realEstateStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 55,
  key: "real-estate-stone",
  name: "Real Estate — Stone",
  industry: "Real estate agent / broker",
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
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-real-estate-stone",
};

// photo: Unsplash, by Christina Wocintechchat — Unsplash License, no attribution required.
export const realEstateStoneSample: SampleData = {
  templateId: 55,
  slug: "demo-real-estate-stone",
  cardData: {
    name: "Hannah Walker",
    position: "Senior Listing Agent",
    title: "Bringing every brief to its right address.",
    company: "Walker & Stein",
    email: "hannah@walker-stein.de",
    phone: "+49 30 1234 5678",
    whatsapp: "+49 170 1234 567",
    website: "walker-stein.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "Selling a home means safeguarding a dream. Twelve years in Berlin's most thoughtful neighbourhoods has taught me to speak plainly, advise honestly, and keep my word. To me, a card is a promise.",
    bookingUrl: "https://cal.com/walker-stein/intro",
    brochureUrl: "https://walker-stein.de/portfolio.pdf",
    impressumUrl: "https://walker-stein.de/impressum",
    privacyUrl: "https://walker-stein.de/datenschutz",
    sectorKey: "real-estate",
    socials: {
      linkedin: "https://linkedin.com/in/hannahwalker-de",
      instagram: "https://instagram.com/walker.stein.berlin",
    },
    services: [
      { title: "Charlottenburg Townhouse", priceLabel: "â‚¬2.85M" },
      { title: "Wannsee Waterfront Build", priceLabel: "FOR SALE" },
      { title: "Mitte Penthouse", priceLabel: "â‚¬1.65M" },
      { title: "Investment Advisory" },
      { title: "Property Valuation" },
    ],
    testimonials: [
      {
        author: "Sebastian & Marie L.",
        role: "Mitte penthouse",
        quote: "Hannah understood us before we did. Eight months of dead-end viewings became a single home that felt inevitable.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

