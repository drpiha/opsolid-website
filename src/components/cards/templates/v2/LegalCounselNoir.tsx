"use client";

// =============================================================================
// LegalCounselNoir — v2 template (id=56, key="legal-counsel-noir").
//
// Sector: Lawyer / Rechtsanwalt — NOIR variant. Mood: editorial luxury,
// near-black surface, warm-gold pinstripe, Playfair Display serif italic.
// Inspired by kart_02_avukat_noir.html.
//
// Design DNA (different from default LegalCounsel.tsx):
//   - No giant photo. Compact 64 px circular avatar with gold ring.
//   - Header: "SINCE YEAR" cap label + firm tag, big two-line italic-serif
//     name with gold last word, small uppercase title strip.
//   - Centered gold rule between header and stats bar.
//   - Stats bar: 3 cells (Years · Cases · Win-rate) with gold serif numerals
//     + copper superscripts.
//   - Practice areas: numbered list (I·II·III·IV·V) with gold left-rule cards.
//   - Pull quote on a darker panel with oversized gold quote glyph.
//   - Italic-serif slogan / firm motto strip.
//   - Contact rows on near-black surface.
//   - Footer: italic gold name on near-black band.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a1a1a";
const LOCKED_ACCENT = "#c8a951";
const SURFACE = "#111111";
const SURFACE_2 = "#1a1a1d";
const SURFACE_3 = "#16161a";
const COPPER = "#b87333";
const TEXT = "#f0ede8";
const TEXT_SOFT = "rgba(240,237,232,0.7)";
const TEXT_MUTED = "rgba(240,237,232,0.45)";
const HAIRLINE = "rgba(200,169,100,0.18)";

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
  const parts = name
    .replace(/^(Dr\.?|Av\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase();
}

interface Copy {
  sinceLabel: string;
  practiceEyebrow: string;
  practiceH: string;
  contactEyebrow: string;
  contactH: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  yearsLabel: string;
  casesLabel: string;
  winRateLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    sinceLabel: "Seit 2005",
    practiceEyebrow: "Fachgebiete",
    practiceH: "Praxisgebiete",
    contactEyebrow: "Kontakt",
    contactH: "Kontakt aufnehmen",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    yearsLabel: "Jahre",
    casesLabel: "Mandate",
    winRateLabel: "Erfolg",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    sinceLabel: "Since 2005",
    practiceEyebrow: "Practice",
    practiceH: "Areas of practice",
    contactEyebrow: "Contact",
    contactH: "Reach out",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    yearsLabel: "Years",
    casesLabel: "Mandates",
    winRateLabel: "Win rate",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    sinceLabel: "2005'ten beri",
    practiceEyebrow: "Uzmanlık",
    practiceH: "Uzmanlık Alanları",
    contactEyebrow: "İletişim",
    contactH: "Bize Ulaşın",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    yearsLabel: "Yıl",
    casesLabel: "Dava",
    winRateLabel: "Başarı",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    sinceLabel: "Desde 2005",
    practiceEyebrow: "Despacho",
    practiceH: "Áreas de práctica",
    contactEyebrow: "Contacto",
    contactH: "Contacta",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    yearsLabel: "Años",
    casesLabel: "Mandatos",
    winRateLabel: "Tasa de éxito",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    sinceLabel: "Dal 2005",
    practiceEyebrow: "Studio",
    practiceH: "Aree di pratica",
    contactEyebrow: "Contatto",
    contactH: "Contattaci",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    yearsLabel: "Anni",
    casesLabel: "Mandati",
    winRateLabel: "Tasso di successo",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    sinceLabel: "Depuis 2005",
    practiceEyebrow: "Cabinet",
    practiceH: "Domaines de pratique",
    contactEyebrow: "Contact",
    contactH: "Nous contacter",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    yearsLabel: "Années",
    casesLabel: "Mandats",
    winRateLabel: "Taux de réussite",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    sinceLabel: "منذ 2005",
    practiceEyebrow: "ممارسة",
    practiceH: "مجالات الممارسة",
    contactEyebrow: "اتصال",
    contactH: "تواصل",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    yearsLabel: "سنوات",
    casesLabel: "تكليفات",
    winRateLabel: "معدل النجاح",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function LegalCounselNoir({
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
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const testimonial = cardData.testimonials?.[0];

  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts.slice(0, -1).join(" ") || cardData.name;
  const nameLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="legal-counsel-noir"
      className="lcn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .lcn-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .lcn-card .serif {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Cormorant Garamond', Georgia, serif);
        }
        .lcn-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="relative px-7 pb-7 pt-9"
        style={{
          background: "linear-gradient(180deg, #0d0d0d 0%, #131313 100%)",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
          }}
        />
        <div className="mb-7 flex items-center gap-4">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 flex-shrink-0 rounded-full object-cover tpl-photo"
              style={{
                border: `1.5px solid ${accent}`,
                boxShadow: "0 0 0 3px rgba(200,169,100,0.08)",
              }}
            />
          ) : (
            <div
              className="serif flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-[20px] font-bold"
              style={{
                background: SURFACE_2,
                color: accent,
                border: `1.5px solid ${accent}`,
                boxShadow: "0 0 0 3px rgba(200,169,100,0.08)",
              }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div
              className="mb-1.5 flex items-center gap-2 text-[10px] font-medium uppercase"
              style={{ color: accent, letterSpacing: "3px" }}
            >
              <span aria-hidden className="block h-px w-[18px]" style={{ background: accent }} />
              {t.sinceLabel}
            </div>
            {cardData.company && (
              <div
                className="truncate text-[11px] uppercase"
                style={{ color: TEXT_MUTED, letterSpacing: "0.8px" }}
              >
                {cardData.company}
                {cardData.address?.split(",").slice(-1)[0]?.trim()
                  ? ` · ${cardData.address.split(",").slice(-1)[0]?.trim()}`
                  : ""}
              </div>
            )}
          </div>
        </div>

        <h1
          className="serif mb-2.5 text-[34px] font-bold leading-[1.05]"
          style={{ color: TEXT, letterSpacing: "-1px" }}
        >
          {nameFirst}
          {nameLast && (
            <>
              <br />
              <em className="font-normal italic" style={{ color: accent }}>
                {nameLast}
              </em>
            </>
          )}
        </h1>
        {(cardData.position || cardData.title) && (
          <div
            className="text-[12.5px] font-light leading-snug"
            style={{ color: TEXT_SOFT, letterSpacing: "0.4px" }}
          >
            {[cardData.position, cardData.title].filter(Boolean).join(" · ")}
          </div>
        )}
      </header>

      <div
        aria-hidden
        className="mx-7 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200,169,100,0.6) 30%, rgba(200,169,100,0.6) 70%, transparent)",
        }}
      />

      {/* STATS BAR */}
      <div
        className="grid grid-cols-3 py-7"
        style={{
          background: SURFACE_3,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <NoirStat num="20" sup="+" label={t.yearsLabel} accent={accent} />
        <NoirStat num="800" sup="+" label={t.casesLabel} accent={accent} divider />
        <NoirStat num="94" sup="%" label={t.winRateLabel} accent={accent} divider />
      </div>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2.5 px-7 py-6">
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

      {/* PRACTICE AREAS — numbered list */}
      {services.length > 0 && (
        <section
          className="px-7 pb-9 pt-2"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <NoirEyebrow accent={accent}>{t.practiceEyebrow}</NoirEyebrow>
          <h2
            className="serif mb-6 text-[24px] italic"
            style={{ color: TEXT, letterSpacing: "-0.3px", fontWeight: 400 }}
          >
            {t.practiceH}
          </h2>
          <div className="flex flex-col gap-2.5">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex items-stretch px-[18px] py-4"
                style={{
                  background: SURFACE_2,
                  borderLeft: `2px solid ${accent}`,
                }}
              >
                <span
                  className="serif mr-[18px] min-w-[28px] pt-0.5 text-[13px] italic"
                  style={{ color: accent, letterSpacing: "1px", fontWeight: 400 }}
                >
                  {ROMAN[i] ?? `${i + 1}`}
                </span>
                <div className="flex-1">
                  <div
                    className="serif text-[15px] leading-snug"
                    style={{ color: TEXT, fontWeight: 400 }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-1 text-[12px]" style={{ color: TEXT_MUTED }}>
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="mt-1.5 text-[10px] font-semibold uppercase"
                      style={{ color: COPPER, letterSpacing: "1.5px" }}
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

      {/* PULL QUOTE */}
      {testimonial && (
        <section
          className="px-7 py-12 text-center"
          style={{
            background: SURFACE_3,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <span
            aria-hidden
            className="serif block leading-[0.5]"
            style={{ color: accent, opacity: 0.5, fontSize: "64px", marginBottom: 4 }}
          >
            {"“"}
          </span>
          <p
            className="serif mx-auto mb-5 max-w-[360px] text-[19px] italic leading-[1.5]"
            style={{ color: TEXT, letterSpacing: "-0.2px", fontWeight: 400 }}
          >
            {testimonial.quote}
          </p>
          <div
            className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "2.5px" }}
          >
            <span aria-hidden className="block h-px w-6" style={{ background: "rgba(200,169,100,0.6)" }} />
            <span>
              {testimonial.author}
              {testimonial.role ? ` · ${testimonial.role}` : ""}
            </span>
            <span aria-hidden className="block h-px w-6" style={{ background: "rgba(200,169,100,0.6)" }} />
          </div>
        </section>
      )}

      {/* SLOGAN / BIO */}
      {cardData.bio && (
        <div className="px-7 py-8 text-center">
          <p
            className="serif text-[17px] italic leading-[1.5]"
            style={{ color: accent, letterSpacing: "0.2px", fontWeight: 400 }}
          >
            {"“"}
            {cardData.bio}
            {"”"}
          </p>
        </div>
      )}

      {/* CONTACT */}
      <section
        className="px-7 pb-9 pt-2"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <NoirEyebrow accent={accent}>{t.contactEyebrow}</NoirEyebrow>
        <h2
          className="serif mb-6 text-[24px] italic"
          style={{ color: TEXT, letterSpacing: "-0.3px", fontWeight: 400 }}
        >
          {t.contactH}
        </h2>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{ background: SURFACE_3, borderTop: `1px solid ${HAIRLINE}` }}
      >
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
        style={{ background: "#0a0a0a" }}
      >
        <div className="serif mb-1 text-[13px] italic" style={{ color: accent }}>
          {cardData.name}
          {cardData.company ? ` · ${cardData.company}` : ""}
        </div>
        <div
          className="text-[10px]"
          style={{ color: TEXT_MUTED, letterSpacing: "1px" }}
        >
          © {new Date().getFullYear()} · {t.poweredBy}{" "}
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

function NoirEyebrow({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="mb-3 flex items-center gap-2.5 text-[10px] font-medium uppercase"
      style={{ color: accent, letterSpacing: "3px" }}
    >
      <span>{children}</span>
      <span aria-hidden className="block h-px flex-1" style={{ background: HAIRLINE }} />
    </div>
  );
}

function NoirStat({
  num,
  sup,
  label,
  accent,
  divider,
}: {
  num: string;
  sup?: string;
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
        className="serif text-[30px] font-bold leading-none"
        style={{ color: accent, letterSpacing: "-0.5px" }}
      >
        {num}
        {sup && (
          <sup
            className="relative ml-0.5 text-[14px]"
            style={{ color: COPPER, top: 4 }}
          >
            {sup}
          </sup>
        )}
      </div>
      <div
        className="mt-2 text-[10px] font-medium uppercase"
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
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-2 rounded-none border px-3 py-3 text-[11.5px] font-medium uppercase transition-colors"
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

export const legalCounselNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 56,
  key: "legal-counsel-noir",
  name: "Legal Counsel — Noir",
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
    brandPrimaryHex: "#1a1a1a",
    brandAccentHex: "#c8a951",
  },
  sampleSlug: "demo-legal-counsel-noir",
};

// photo: Unsplash, lawyer portrait. Unsplash License — free, no attribution required.
export const legalCounselNoirSample: SampleData = {
  templateId: 56,
  slug: "demo-legal-counsel-noir",
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
    bio: "Zwei Jahrzehnte am Verhandlungstisch — Strafrecht, Familienrecht, Arbeitsrecht. Klare Sprache, kurze Briefe, lange Beziehungen.",
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
      {
        title: "Strafrecht",
        description: "Beratung und Vertretung in Ermittlungs- und Strafverfahren.",
        priceLabel: "Erstberatung â‚¬200",
      },
      {
        title: "Familienrecht",
        description: "Scheidung, Sorgerecht, Unterhalt — diskret und lösungsorientiert.",
        priceLabel: "ab â‚¬300/h",
      },
      {
        title: "Arbeitsrecht",
        description: "Kündigungsschutz, Aufhebungsverträge, Vergütungsstreitigkeiten.",
        priceLabel: "Erfolgshonorar",
      },
    ],
    testimonials: [
      {
        author: "Mehmet T.",
        role: "Mandant — Strafverfahren",
        quote: "Dr. Bauer hat ruhig, präzise und mit unfehlbarem Gespür für den richtigen Moment verhandelt.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#1a1a1a",
  brandAccentHex: "#c8a951",
};

