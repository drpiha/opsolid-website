"use client";

// =============================================================================
// EventPlannerNoir â€” v2 template (id=44, key="event-planner-noir").
//
// Sector: Wedding & event planner â€” NOIR variant. Mood: dark dramatic, gala,
// luxury weddings. Inspired by kart_18_organizasyon_noir.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero is a centered "gala invitation": tiny letter-spaced GOLD eyebrow
//     between two hairlines, the persona name in oversized italic Cormorant
//     with a subtle text-gradient (textâ†’gold), a vertical 32 px gold rule,
//     then a serif-italic tagline (max-width 320 px, centered).
//   - Profile is a horizontal two-row: thin-bordered avatar with gold ring
//     + italic name + small gold caps role.
//   - Sections are sparse 48 px-padded blocks divided by hairlines. Section
//     labels: 10 px / 4 px tracked / gold uppercase + flex-1 hairline.
//   - Services are a hairline list of italic names with right-aligned 2-digit
//     gold "01 / 02" numbers. No prices in noir.
//   - Prestige testimonial card: dark surface with gold rule.
//   - CTA: hairline border button (gold on transparent).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#c8a951";
const PAGE = "#080508";
const SURFACE = "#130810";
const SURFACE_2 = "#1a0d18";
const TEXT = "#f5f0ed";
const TEXT_SOFT = "rgba(245,240,237,0.78)";
const TEXT_MUTED = "rgba(245,240,237,0.5)";
const HAIRLINE = "rgba(255,255,255,0.08)";
const HAIRLINE_GOLD = "rgba(200,169,100,0.22)";

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
  tagline: string;
  role: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  servicesH: string;
  testimonialH: string;
  ctaH: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Diskret, durchdacht, unvergesslich. Hochzeiten und private Galas mit der Sorgfalt eines kuratierten Salons.",
    role: "Event Designer Â· Wedding Planner",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    servicesH: "Dienste",
    testimonialH: "Stimmen",
    ctaH: "Kontaktanfrage",
    cta: "ErstgesprÃ¤ch anfragen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
  },
  en: {
    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Discreet, deliberate, unforgettable. Weddings and private galas with the care of a curated salon.",
    role: "Event Designer Â· Wedding Planner",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesH: "Services",
    testimonialH: "Voices",
    ctaH: "Inquiry",
    cta: "Request a consultation",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
  },
  tr: {
    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Sessiz, Ã¶zenli, unutulmaz. DÃ¼ÄŸÃ¼nler ve Ã¶zel galalar â€” kÃ¼rate edilmiÅŸ bir salonun titizliÄŸiyle.",
    role: "Etkinlik TasarÄ±mcÄ±sÄ± Â· Wedding Planner",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    servicesH: "Hizmetler",
    testimonialH: "Yorumlar",
    ctaH: "Ä°letiÅŸim",
    cta: "GÃ¶rÃ¼ÅŸme Talep Et",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
    contact: "Ä°letiÅŸim",
  },
  es: {

    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Discreet, deliberate, unforgettable. Weddings and private galas with the care of a curated salon.",
    role: "Event Designer Â· Wedding Planner",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    servicesH: "Servicios",
    testimonialH: "Voces",
    ctaH: "Consulta",
    cta: "Solicitar una consulta",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    contact: "Contacto",
  
  },
  it: {

    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Discreet, deliberate, unforgettable. Weddings and private galas with the care of a curated salon.",
    role: "Event Designer Â· Wedding Planner",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesH: "Servizi",
    testimonialH: "Voci",
    ctaH: "Richiesta",
    cta: "Richiedi una consulenza",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    contact: "Contatto",
  
  },
  fr: {

    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Discreet, deliberate, unforgettable. Weddings and private galas with the care of a curated salon.",
    role: "Event Designer Â· Wedding Planner",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    servicesH: "Services",
    testimonialH: "Témoignages",
    ctaH: "Demande",
    cta: "Demander une consultation",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    contact: "Contact",
  
  },
  ar: {

    eyebrow: "BLACK TIE GALA Â· BERLIN",
    tagline:
      "Discreet, deliberate, unforgettable. Weddings and private galas with the care of a curated salon.",
    role: "Event Designer Â· Wedding Planner",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    servicesH: "الخدمات",
    testimonialH: "أصوات",
    ctaH: "استفسار",
    cta: "اطلب استشارة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    contact: "اتصال",
  
  },
};

export function EventPlannerNoir({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const accent = brandAccentHex || LOCKED_ACCENT;
  // primary stays as deep black; we keep the brand override as a tonal anchor
  void (brandPrimaryHex || LOCKED_PRIMARY);
  void readableTextOn;

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
      data-template="event-planner-noir"
      className="epn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: TEXT,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
      }}
    >
      <style jsx global>{`
        .epn-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          font-weight: 300;
          line-height: 1.7;
          background: ${PAGE};
        }
        .epn-card .serif {
          font-family: var(--tpl-font-display, 'Cormorant Garamond', Georgia, serif);
          font-style: italic;
          font-weight: 400;
        }
        .epn-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO GALA */}
        <header
          className="relative overflow-hidden px-8 py-20 text-center"
          style={{
            background: `radial-gradient(ellipse at top right, ${accent}29, transparent 55%),
                         radial-gradient(ellipse at bottom left, ${accent}17, transparent 55%)`,
          }}
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-6 h-px w-16 -translate-x-1/2"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-6 left-1/2 h-px w-16 -translate-x-1/2"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
          <div
            className="text-[10px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "5px" }}
          >
            {t.eyebrow}
          </div>
          <h1
            className="serif mx-auto mt-6 text-[44px] leading-[1.05] tracking-[-1px]"
            style={{
              backgroundImage: `linear-gradient(135deg, ${TEXT} 0%, ${accent} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {cardData.name}
          </h1>
          <div
            aria-hidden
            className="mx-auto my-5 h-8 w-px"
            style={{ background: accent }}
          />
          <p
            className="serif mx-auto max-w-[320px] text-[16px] leading-[1.5]"
            style={{ color: TEXT_SOFT }}
          >
            {cardData.bio || t.tagline}
          </p>
        </header>

        {/* PROFILE */}
        <section
          className="flex items-center gap-5 px-8 py-7"
          style={{
            background: SURFACE_2,
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full"
            style={{
              border: `1px solid ${accent}`,
              padding: 3,
              background: SURFACE,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full">
              {photoUrl ? (
                <Image src={photoUrl} alt="" fill sizes="64px" unoptimized className="object-cover tpl-photo" />
              ) : (
                <div
                  className="serif flex h-full w-full items-center justify-center text-[18px]"
                  style={{ color: accent, background: SURFACE_2 }}
                >
                  {cardData.name.slice(0, 1)}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="serif text-[22px]" style={{ color: TEXT }}>
              {cardData.name}
            </div>
            <div
              className="mt-1 text-[11px] uppercase"
              style={{ color: accent, letterSpacing: "2.5px" }}
            >
              {cardData.position || t.role}
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS â€” minimal hairline strip */}
        <section
          className="grid grid-cols-3 text-center"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {phoneDigits && (
            <NoirAction
              href={`tel:${phoneDigits}`}
              Icon={Phone}
              label={t.callBtn}
              accent={accent}
              right
            />
          )}
          {waDigits && (
            <NoirAction
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              accent={accent}
              right={!!cardData.email}
            />
          )}
          {cardData.email && (
            <NoirAction href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} accent={accent} />
          )}
        </section>

        {/* SERVICES */}
        {services.length > 0 && (
          <section className="px-8 py-12">
            <NoirSectionLabel accent={accent}>{t.servicesH}</NoirSectionLabel>
            <div className="mt-7">
              {services.slice(0, 6).map((svc, i, arr) => (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex items-baseline justify-between py-4"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <span className="serif text-[18px]" style={{ color: TEXT }}>
                    {svc.title}
                  </span>
                  <span
                    className="text-[11px] font-medium tabular-nums"
                    style={{ color: accent, letterSpacing: "2px" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRESTIGE TESTIMONIAL */}
        {testimonials.length > 0 && (
          <section className="px-8 pb-12">
            <div
              className="relative px-7 py-9"
              style={{
                background: SURFACE_2,
                border: `1px solid ${HAIRLINE_GOLD}`,
              }}
            >
              <div
                aria-hidden
                className="absolute left-0 top-0 h-px w-12"
                style={{ background: accent }}
              />
              <div
                className="text-[10px] font-medium uppercase"
                style={{ color: accent, letterSpacing: "4px" }}
              >
                {t.testimonialH}
              </div>
              <p
                className="serif mt-4 text-[19px] leading-[1.5]"
                style={{ color: TEXT }}
              >
                â€œ{testimonials[0].quote}â€
              </p>
              <div
                className="mt-5 text-[11px] uppercase"
                style={{ color: TEXT_MUTED, letterSpacing: "2.5px" }}
              >
                â€” {testimonials[0].author}
                {testimonials[0].role ? ` Â· ${testimonials[0].role}` : ""}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-8 pb-12">
          <NoirSectionLabel accent={accent}>{t.ctaH}</NoirSectionLabel>
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-full items-center justify-center gap-3 px-5 py-[18px] text-[12px] font-medium uppercase transition-all hover:opacity-90"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              letterSpacing: "3.5px",
              background: "transparent",
            }}
          >
            {t.cta}
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </a>
        </section>

        {/* CONTACT */}
        <section className="px-8 pb-12">
          <NoirSectionLabel accent={accent}>{t.contact}</NoirSectionLabel>
          <div className="mt-5">
            <ContactRows
              cardData={cardData}
              locale={locale}
              variant="hairline"
              accentHex={accent}
            />
          </div>
        </section>

        {cardData.socials && (
          <section className="px-8 pb-12">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-8 mb-9 p-5"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
          <ExchangeSlot slug={slug} primary={accent} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-8 mb-9 p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: accent, background: SURFACE_2 }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="px-8 py-7 text-center"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="serif text-[16px]"
            style={{ color: accent }}
          >
            {cardData.company || cardData.name}
          </div>
          <div
            className="mt-2 text-[10px] uppercase"
            style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
          >
            Â© {year} Â· {t.poweredBy}{" "}
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
      </div>
    </article>
  );
}

function NoirSectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-3 text-[10px] font-medium uppercase"
      style={{ color: accent, letterSpacing: "4px" }}
    >
      {children}
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{ background: HAIRLINE_GOLD }}
      />
    </div>
  );
}

function NoirAction({
  href,
  Icon,
  label,
  external,
  accent,
  right,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  external?: boolean;
  accent: string;
  right?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-2 px-4 py-5 text-[11px] font-medium uppercase transition-colors hover:bg-[--hover]"
      style={{
        color: TEXT_SOFT,
        borderRight: right ? `1px solid ${HAIRLINE}` : undefined,
        letterSpacing: "2.5px",
        ["--hover" as string]: `${accent}1a`,
      }}
    >
      <Icon size={14} strokeWidth={1.6} style={{ color: accent }} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const eventPlannerNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 44,
  key: "event-planner-noir",
  name: "Event Planner â€” Noir",
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
  sampleSlug: "demo-event-planner-noir",
};

// photo: Unsplash, wedding planner. Unsplash License â€” free, no attribution required.
export const eventPlannerNoirSample: SampleData = {
  templateId: 44,
  slug: "demo-event-planner-noir",
  cardData: {
    name: "Naz ErdoÄŸan",
    position: "Event Designer Â· Wedding Planner",
    title: "Naz Events Atelier",
    company: "Naz Events Atelier",
    email: "naz@nazevents.de",
    phone: "+49 172 667 8901",
    whatsapp: "+49 172 667 8901",
    website: "nazevents.de",
    address: "Berlin Â· Europa",
    bio:
      "Diskret, durchdacht, unvergesslich. Hochzeiten und private Galas mit der Sorgfalt eines kuratierten Salons.",
    bookingUrl: "https://cal.com/nazevents/intro",
    sectorKey: "events",
    services: [
      { title: "Black-Tie Wedding", description: "", priceLabel: undefined },
      { title: "Private Gala", description: "", priceLabel: undefined },
      { title: "Destination Event", description: "", priceLabel: undefined },
      { title: "Brand Activation", description: "", priceLabel: undefined },
      { title: "Concept Direction", description: "", priceLabel: undefined },
      { title: "Production Oversight", description: "", priceLabel: undefined },
    ],
    testimonials: [
      {
        author: "Beatrice & Henri",
        role: "Wedding 2025 Â· Lake Como",
        quote:
          "Eine Aufmerksamkeit fÃ¼rs Detail, die wir nirgends sonst gesehen haben â€” leise, unbemerkt, perfekt.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/naz.events",
      linkedin: "https://linkedin.com/in/nazerdogan",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

