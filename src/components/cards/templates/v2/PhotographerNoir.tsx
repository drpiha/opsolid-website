"use client";

// =============================================================================
// PhotographerNoir — v2 template (id=64, key="photographer-noir").
//
// Sector: Creator / Photographer — NOIR variant. Mood: black studio backdrop,
// silver/cream type, fine-art portfolio editorial. Distinct from default
// Photographer.tsx (id=4, full-bleed warm gallery).
//
// Inspired by kart_04_fotograf_noir.html — Cormorant Garamond serif italic
// on near-black.
//
// Design DNA:
//   - Insignia top — small EST cap, double-ring monogram circle, oversized
//     name in uppercase serif, italic tag, micro city/region line.
//   - Hero photo (360 px) with gold inner frame and italic caption ("Manifesto").
//   - About block — eyebrow + serif name + bio + thin gold rule.
//   - Stats grid — 3 cells with hairline dividers, gold serif numerals.
//   - Services — Roman numeral list (I–V) with serif names + italic descriptions.
//   - Packages — investment/price rows.
//   - Portfolio CTA — bordered uppercase pill button.
//   - Contact list — italic serif links on near-black.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Download, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import { resolveStats, resolveLocation } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#e0e0e0";
const SURFACE = "#0d0d0d";
const SURFACE_2 = "#141414";
const SURFACE_3 = "#181818";
const TEXT = "#f0ede8";
const TEXT_SOFT = "rgba(240,237,232,0.72)";
const TEXT_MUTED = "rgba(240,237,232,0.45)";
const HAIRLINE = "rgba(224,224,224,0.16)";

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

function getInitial(name: string): string {
  const cleaned = name.replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "").trim();
  return (cleaned[0] ?? "·").toUpperCase();
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

interface Copy {
  manifestoLabel: string;
  aboutEyebrow: string;
  servicesEyebrow: string;
  servicesH: string;
  packagesEyebrow: string;
  packagesH: string;
  ctaEyebrow: string;
  ctaBtn: string;
  contactEyebrow: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    manifestoLabel: "Manifest",
    aboutEyebrow: "Über mich",
    servicesEyebrow: "Leistungsspektrum",
    servicesH: "Meine Arbeit",
    packagesEyebrow: "Pakete",
    packagesH: "Investition",
    ctaEyebrow: "Sehen Sie das Portfolio",
    ctaBtn: "Portfolio",
    contactEyebrow: "Kontakt",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    manifestoLabel: "Manifesto",
    aboutEyebrow: "About",
    servicesEyebrow: "Service",
    servicesH: "How I work",
    packagesEyebrow: "Packages",
    packagesH: "Investment",
    ctaEyebrow: "View the portfolio",
    ctaBtn: "Portfolio",
    contactEyebrow: "Contact",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    manifestoLabel: "Manifesto",
    aboutEyebrow: "Hakkımda",
    servicesEyebrow: "Hizmet Alanları",
    servicesH: "Çalışma Biçimim",
    packagesEyebrow: "Paketler",
    packagesH: "Yatırım",
    ctaEyebrow: "Portföyü görüntüle",
    ctaBtn: "Portföy",
    contactEyebrow: "İletişim",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    manifestoLabel: "Manifiesto",
    aboutEyebrow: "Acerca de",
    servicesEyebrow: "Servicio",
    servicesH: "Cómo trabajo",
    packagesEyebrow: "Paquetes",
    packagesH: "Inversión",
    ctaEyebrow: "Ver el portafolio",
    ctaBtn: "Portafolio",
    contactEyebrow: "Contacto",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    manifestoLabel: "Manifesto",
    aboutEyebrow: "Chi siamo",
    servicesEyebrow: "Servizio",
    servicesH: "Come lavoro",
    packagesEyebrow: "Pacchetti",
    packagesH: "Investimento",
    ctaEyebrow: "Vedi il portfolio",
    ctaBtn: "Portfolio",
    contactEyebrow: "Contatto",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    manifestoLabel: "Manifeste",
    aboutEyebrow: "À propos",
    servicesEyebrow: "Service",
    servicesH: "Comment je travaille",
    packagesEyebrow: "Forfaits",
    packagesH: "Investissement",
    ctaEyebrow: "Voir le portfolio",
    ctaBtn: "Portfolio",
    contactEyebrow: "Contact",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    manifestoLabel: "البيان",
    aboutEyebrow: "حول",
    servicesEyebrow: "خدمة",
    servicesH: "كيف أعمل",
    packagesEyebrow: "الباقات",
    packagesH: "الاستثمار",
    ctaEyebrow: "عرض المعرض",
    ctaBtn: "المعرض",
    contactEyebrow: "اتصال",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function PhotographerNoir({
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
  const initial = getInitial(cardData.name);
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const tagline = cardData.title || cardData.position || "";
  const city = resolveLocation(cardData);
  const stats = resolveStats(cardData.stats);

  return (
    <article
      data-template="photographer-noir"
      className="phn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .phn-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .phn-card .serif {
          font-family: var(--tpl-font-display, 'Cormorant Garamond', 'Playfair Display', Georgia, serif);
        }
        .phn-card a { color: inherit; }
      `}</style>

      {/* INSIGNIA TOP */}
      <header
        className="relative px-7 pb-9 pt-12 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-7 block h-px w-7 -translate-x-1/2"
          style={{ background: accent, opacity: 0.6 }}
        />
        <div className="relative mx-auto mb-5 mt-6 h-16 w-16">
          <span
            aria-hidden
            className="absolute -inset-1.5 block rounded-full"
            style={{ border: `1px solid ${HAIRLINE}` }}
          />
          <div
            className="serif relative flex h-full w-full items-center justify-center rounded-full text-[28px] italic"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              fontWeight: 300,
            }}
          >
            {initial}
          </div>
        </div>

        <h1
          className="serif text-[34px] leading-none"
          style={{
            color: TEXT,
            letterSpacing: "1.2px",
            fontWeight: 300,
            textTransform: "uppercase",
          }}
        >
          {cardData.name}
        </h1>
        {tagline && (
          <div
            className="serif mt-1.5 text-[16px] italic"
            style={{ color: TEXT_SOFT, letterSpacing: "0.5px" }}
          >
            {tagline}
          </div>
        )}
        {city && (
          <div
            className="mt-4 text-[10px] font-medium uppercase"
            style={{ color: "rgba(224,224,224,0.55)", letterSpacing: "3px" }}
          >
            {city}
          </div>
        )}
      </header>

      {/* HERO with inner frame */}
      {photoUrl && (
        <div className="relative h-[340px] w-full overflow-hidden">
          <Image
            src={photoUrl}
            alt={cardData.name}
            fill
            unoptimized
            className="object-cover tpl-photo"
            style={{ filter: "brightness(0.78) contrast(1.05)" }}
            sizes="460px"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(13,13,13,0.05) 0%, rgba(13,13,13,0.6) 100%), linear-gradient(135deg, rgba(224,224,224,0.12) 0%, transparent 60%)`,
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[18px]"
            style={{ border: `1px solid rgba(224,224,224,0.32)` }}
          />
          <div className="absolute bottom-7 left-7 z-10 max-w-[280px]">
            <div
              className="mb-1.5 text-[9.5px] font-medium uppercase"
              style={{ color: accent, letterSpacing: "3px" }}
            >
              {t.manifestoLabel}
            </div>
            {cardData.bio && (
              <div
                className="serif text-[16.5px] italic leading-snug"
                style={{ color: TEXT, fontWeight: 400 }}
              >
                {"“"}
                {cardData.bio.split(/[.!?]/)[0]?.trim()}
                {"”"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {cardData.bio && (
        <section
          className="px-8 py-9 text-center"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-3 text-[10px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "4px" }}
          >
            {t.aboutEyebrow}
          </div>
          <h2
            className="serif mb-3 text-[24px]"
            style={{ color: TEXT, letterSpacing: "0.5px", fontWeight: 300 }}
          >
            {cardData.name}
          </h2>
          <p
            className="text-[13.5px]"
            style={{ color: TEXT_SOFT, lineHeight: 1.7, fontWeight: 300 }}
          >
            {cardData.bio}
          </p>
          <span
            aria-hidden
            className="mx-auto mt-5 block h-7 w-px"
            style={{ background: accent, opacity: 0.5 }}
          />
        </section>
      )}

      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
        <div
          className="grid py-7"
          style={{
            background: SURFACE_2,
            borderBottom: `1px solid ${HAIRLINE}`,
            gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((s, i) => (
            <NoirStat
              key={s.label}
              num={s.value}
              label={s.label}
              accent={accent}
              divider={i > 0}
            />
          ))}
        </div>
      )}

      {/* SERVICES — Roman list */}
      {services.length > 0 && (
        <section
          className="px-8 py-9"
          style={{
            background: SURFACE_2,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            className="mb-1 text-center text-[11px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "5px" }}
          >
            {t.servicesEyebrow}
          </div>
          <h3
            className="serif mb-6 text-center text-[26px] italic"
            style={{ color: TEXT, fontWeight: 300 }}
          >
            {t.servicesH}
          </h3>
          <div>
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="grid items-baseline gap-4 py-4"
                style={{
                  gridTemplateColumns: "28px 1fr",
                  borderBottom:
                    i === services.length - 1 ? "none" : `1px solid ${HAIRLINE}`,
                }}
              >
                <span
                  className="serif text-[18px] italic"
                  style={{ color: accent, fontWeight: 300, letterSpacing: "1px" }}
                >
                  {ROMAN[i] ?? `${i + 1}`}
                </span>
                <div>
                  <div
                    className="serif text-[18px] leading-tight"
                    style={{ color: TEXT, fontWeight: 600 }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="serif mt-1 text-[12.5px] italic"
                      style={{ color: TEXT_MUTED, fontWeight: 400 }}
                    >
                      {svc.description}
                    </div>
                  )}
                </div>
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* PACKAGES */}
      {services.some((svc) => svc.priceLabel) && (
        <section
          className="px-8 py-9"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-1 text-center text-[10px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "4px" }}
          >
            {t.packagesEyebrow}
          </div>
          <h3
            className="serif mb-5 text-center text-[24px] italic"
            style={{ color: TEXT, fontWeight: 300 }}
          >
            {t.packagesH}
          </h3>
          <div>
            {services
              .filter((svc) => svc.priceLabel)
              .map((svc, i, arr) => (
                <div
                  key={`pkg-${svc.title}-${i}`}
                  className="grid items-center gap-3 py-4"
                  style={{
                    gridTemplateColumns: "1fr auto",
                    borderBottom:
                      i === arr.length - 1 ? "none" : `1px solid ${HAIRLINE}`,
                  }}
                >
                  <div>
                    <h4
                      className="serif text-[18px]"
                      style={{ color: TEXT, fontWeight: 600 }}
                    >
                      {svc.title}
                    </h4>
                    {svc.description && (
                      <p
                        className="serif mt-1 text-[12px] italic"
                        style={{ color: TEXT_MUTED, fontWeight: 400 }}
                      >
                        {svc.description}
                      </p>
                    )}
                  </div>
                  <div
                    className="text-right text-[13px] font-medium"
                    style={{ color: accent, letterSpacing: "1px" }}
                  >
                    {svc.priceLabel}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="px-7 py-9 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="serif mb-5 text-[16px] italic"
          style={{ color: TEXT_SOFT, fontWeight: 400 }}
        >
          {t.ctaEyebrow}
        </div>
        {cardData.brochureUrl ? (
          <a
            href={cardData.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 text-[11px] font-medium uppercase transition-colors"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              letterSpacing: "5px",
            }}
          >
            {t.ctaBtn}
          </a>
        ) : (
          cardData.website && (
            <a
              href={`https://${cardData.website.replace(/^https?:\/\//, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-4 text-[11px] font-medium uppercase transition-colors"
              style={{
                border: `1px solid ${accent}`,
                color: accent,
                letterSpacing: "5px",
              }}
            >
              {t.ctaBtn}
            </a>
          )
        )}
        <div className="mt-5 flex justify-center gap-6 text-[11px] uppercase">
          {phoneDigits && (
            <a
              href={`tel:${phoneDigits}`}
              style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
            >
              {t.callBtn}
            </a>
          )}
          {waDigits && (
            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
            >
              {t.whatsappBtn}
            </a>
          )}
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
            >
              {t.emailBtn}
            </a>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-8 py-9 text-center">
        <div
          className="mb-5 text-[10px] font-medium uppercase"
          style={{ color: accent, letterSpacing: "4px" }}
        >
          {t.contactEyebrow}
        </div>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2 px-7 pb-7">
        {phoneDigits && (
          <NoirAction href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} accent={accent} />
        )}
        {waDigits && (
          <NoirAction
            href={`https://wa.me/${waDigits}`}
            Icon={MessageCircle}
            label={t.whatsappBtn}
            accent={accent}
            external
          />
        )}
        {cardData.email && (
          <NoirAction
            href={`mailto:${cardData.email}`}
            Icon={Mail}
            label={t.emailBtn}
            accent={accent}
          />
        )}
      </section>

      {/* SAVE CONTACT + WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7 space-y-3"
        style={{ background: SURFACE_3, borderTop: `1px solid ${HAIRLINE}` }}
      >
        <a
          href={`/api/cards/${slug}/vcard`}
          className="flex items-center justify-center gap-2 w-full min-h-[52px] border text-[11px] font-medium uppercase transition-colors"
          style={{
            background: "transparent",
            borderColor: accent,
            color: accent,
            letterSpacing: "3px",
          }}
        >
          <Download size={14} strokeWidth={1.6} />
          {t.saveContact}
        </a>
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              color: TEXT,
              borderColor: HAIRLINE,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-7 py-6"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="icon" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 py-6 text-center"
        style={{ background: "#080808" }}
      >
        <div className="serif mb-1 text-[14px] italic" style={{ color: accent, fontWeight: 400 }}>
          {cardData.name}
        </div>
        <div
          className="text-[9.5px]"
          style={{ color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase" }}
        >
          {city ? `${city} · ` : ""}{t.poweredBy}{" "}
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
      </footer>
    </article>
  );
}

function NoirStat({
  num,
  label,
  accent,
  divider,
}: {
  num: string;
  label: string;
  accent: string;
  divider?: boolean;
}) {
  return (
    <div className="relative px-3 text-center">
      {divider && (
        <span
          aria-hidden
          className="absolute left-0 top-[12%] h-[76%] w-px"
          style={{ background: HAIRLINE }}
        />
      )}
      <div
        className="serif text-[30px] leading-none"
        style={{ color: accent, fontWeight: 300 }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[9.5px] font-medium uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function NoirAction({
  href,
  label,
  Icon,
  accent,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  accent: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-2 border px-3 py-3 text-[11.5px] font-medium uppercase transition-colors"
      style={{
        background: SURFACE_2,
        borderColor: HAIRLINE,
        color: accent,
        letterSpacing: "1.5px",
      }}
    >
      <Icon size={13} strokeWidth={1.7} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const photographerNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 64,
  key: "photographer-noir",
  name: "Photographer — Noir",
  industry: "Photographer / Wedding & portrait",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: "#0d0d0d",
    brandAccentHex: "#e0e0e0",
  },
  sampleSlug: "demo-photographer-noir",
};

// photo: Unsplash, photographer with camera. Unsplash License — free.
export const photographerNoirSample: SampleData = {
  templateId: 64,
  slug: "demo-photographer-noir",
  cardData: {
    name: "Lena Schwarz",
    position: "Fotografin / Videografin",
    title: "Berlin · Worldwide",
    company: "Lena Schwarz Studio",
    email: "lena@lenaschwarz.de",
    phone: "+49 176 889 0123",
    whatsapp: "+49 176 889 0123",
    website: "lenaschwarz.de",
    address: "Mariannenstraße 7, 10999 Berlin",
    bio: "Hochzeits- und Porträtfotografin aus Berlin. Natürliches Licht, echte Momente, zeitlose Bilder.",
    bookingUrl: "https://cal.com/lena-schwarz/intro",
    brochureUrl: "https://lenaschwarz.de/portfolio.pdf",
    impressumUrl: "https://lenaschwarz.de/impressum",
    privacyUrl: "https://lenaschwarz.de/datenschutz",
    sectorKey: "creator",
    socials: {
      instagram: "https://instagram.com/lena.schwarz.foto",
      youtube: "https://youtube.com/@lenaschwarz",
    },
    services: [
      {
        title: "Hochzeitsfotografie",
        description: "ganzer tag · zwei fotografen · feinjustierte alben",
        priceLabel: "ab €2.800",
      },
      {
        title: "Porträtshooting",
        description: "studio oder natürliches licht · 2 stunden",
        priceLabel: "€350 / 2h",
      },
      {
        title: "Produktfotografie",
        description: "kampagnen · lookbooks · e-commerce",
        priceLabel: "ab €480",
      },
    ],
    stats: [
      { value: "7", label: "Jahre" },
      { value: "280+", label: "Hochzeiten" },
      { value: "15", label: "Länder" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#0d0d0d",
  brandAccentHex: "#e0e0e0",
};
