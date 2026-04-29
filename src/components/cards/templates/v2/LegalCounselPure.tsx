"use client";

// =============================================================================
// LegalCounselPure — v2 template (id=57, key="legal-counsel-pure").
//
// Sector: Lawyer / Rechtsanwalt — PURE variant. Mood: Swiss minimal,
// editorial white, deep navy headlines, hairline rows, Lora italic body.
// Inspired by kart_02_avukat_pure.html.
//
// Design DNA:
//   - Header: portrait card-photo (92×110) on left + eyebrow + huge sans
//     name + italic Lora title on right.
//   - Hairline divider above and below a 3-cell meta-row (admit year, bar,
//     languages).
//   - About section: italic Lora paragraph, no quote glyph.
//   - Slogan strip: hairline-bordered italic line.
//   - Spec list: hairline rows with short colored leading rule.
//   - Stats grid 2×2 with hairline borders.
//   - Education / Membership 2-column block (signature noir-pure detail).
//   - Reference block.
//   - Contact table: hairline rows with right-aligned values.
//   - Footer row with QR placeholder + vCard ghost button.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Globe, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ffffff";
const LOCKED_ACCENT = "#1a2b4a";
const PAGE = "#f2f0ed";
const SURFACE = "#ffffff";
const ACCENT_2 = "#8b0000";
const INK = "#111111";
const INK_SOFT = "#666666";
const HAIRLINE = "#e0e0e0";
const HAIRLINE_LIGHT = "#ececea";

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
  about: string;
  practice: string;
  practiceH: string;
  reference: string;
  contact: string;
  contactH: string;
  education: string;
  educationLabel: string;
  membershipLabel: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  metaActive: string;
  metaBar: string;
  metaLanguages: string;
  yearsLabel: string;
  casesLabel: string;
  winRateLabel: string;
  langsLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    about: "Über mich",
    practice: "Praxisgebiete",
    practiceH: "Leistungsspektrum",
    reference: "Referenz",
    contact: "Kontakt",
    contactH: "Kontakt aufnehmen",
    education: "Ausbildung & Zulassung",
    educationLabel: "Ausbildung",
    membershipLabel: "Zulassung",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    metaActive: "Aktiv",
    metaBar: "Kammer",
    metaLanguages: "Sprachen",
    yearsLabel: "Jahre Erfahrung",
    casesLabel: "Mandate",
    winRateLabel: "Erfolgsquote",
    langsLabel: "Sprachen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    about: "About",
    practice: "Practice Areas",
    practiceH: "Service spectrum",
    reference: "Reference",
    contact: "Contact",
    contactH: "Reach out",
    education: "Education & Bar",
    educationLabel: "Education",
    membershipLabel: "Bar admission",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    metaActive: "Active",
    metaBar: "Bar",
    metaLanguages: "Languages",
    yearsLabel: "Years",
    casesLabel: "Mandates",
    winRateLabel: "Win rate",
    langsLabel: "Languages",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    about: "Hakkımda",
    practice: "Uzmanlık Alanları",
    practiceH: "Hizmet Yelpazesi",
    reference: "Referans",
    contact: "İletişim",
    contactH: "Bize Ulaşın",
    education: "Eğitim & Üyelik",
    educationLabel: "Eğitim",
    membershipLabel: "Üyelik",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    metaActive: "Aktif",
    metaBar: "Baro",
    metaLanguages: "Dil",
    yearsLabel: "Yıl Tecrübe",
    casesLabel: "Tamamlanan Dava",
    winRateLabel: "Başarı Oranı",
    langsLabel: "Dil",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

export function LegalCounselPure({
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
  const services = (cardData.services ?? []).slice(0, 6);
  const testimonial = cardData.testimonials?.[0];

  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts.slice(0, -1).join(" ") || cardData.name;
  const nameLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const city = cardData.address?.split(",").slice(-2)[0]?.trim() || "Berlin";

  return (
    <article
      data-template="legal-counsel-pure"
      className="lcp-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .lcp-card {
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .lcp-card .serif-i {
          font-family: 'Lora', 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }
        .lcp-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header className="flex items-start gap-5 px-8 pb-7 pt-10">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={cardData.name}
            width={92}
            height={110}
            unoptimized
            className="flex-shrink-0 object-cover"
            style={{
              width: 92,
              height: 110,
              filter: "grayscale(20%) contrast(1.05)",
            }}
          />
        ) : (
          <div
            className="flex flex-shrink-0 items-center justify-center text-[26px] font-medium"
            style={{
              width: 92,
              height: 110,
              background: PAGE,
              color: accent,
            }}
          >
            {cardData.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div
            className="mb-2.5 text-[10px] font-medium uppercase"
            style={{ color: ACCENT_2, letterSpacing: "2.5px" }}
          >
            {cardData.company || "Bar Admitted"}
          </div>
          <h1
            className="mb-3.5 text-[42px] font-medium leading-[0.95]"
            style={{ color: accent, letterSpacing: "-2px" }}
          >
            {nameFirst}
            {nameLast && (
              <>
                <br />
                {nameLast}
              </>
            )}
          </h1>
          <div
            className="serif-i text-[13px] leading-[1.5]"
            style={{ color: INK_SOFT }}
          >
            {[cardData.position, cardData.title].filter(Boolean).join(" — ") ||
              "Senior Counsel"}
          </div>
        </div>
      </header>

      <div aria-hidden className="mx-8 h-px" style={{ background: HAIRLINE }} />

      {/* META ROW */}
      <div
        className="flex justify-between px-8 py-4 text-[11px] font-medium"
        style={{ color: INK_SOFT, letterSpacing: "0.5px" }}
      >
        <span>
          <strong style={{ color: INK, fontWeight: 600 }}>2005</strong> {t.metaActive}
        </span>
        <span>
          <strong style={{ color: INK, fontWeight: 600 }}>{city}</strong> {t.metaBar}
        </span>
        <span>
          <strong style={{ color: INK, fontWeight: 600 }}>DE/EN</strong> {t.metaLanguages}
        </span>
      </div>

      <div aria-hidden className="mx-8 h-px" style={{ background: HAIRLINE }} />

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2 px-8 pt-5">
        {phoneDigits && (
          <PureAction href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} accent={accent} />
        )}
        {waDigits && (
          <PureAction
            href={`https://wa.me/${waDigits}`}
            Icon={MessageCircle}
            label={t.whatsappBtn}
            accent={accent}
            external
          />
        )}
        {cardData.email && (
          <PureAction
            href={`mailto:${cardData.email}`}
            Icon={Mail}
            label={t.emailBtn}
            accent={accent}
          />
        )}
      </section>

      {/* ABOUT */}
      {cardData.bio && (
        <section className="px-8 py-8">
          <PureLabel>{t.about}</PureLabel>
          <p
            className="serif-i mt-3 text-[15px] leading-[1.7]"
            style={{ color: INK }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* SLOGAN */}
      <div
        className="px-8 py-7 text-center"
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <p
          className="serif-i text-[16px] leading-[1.5]"
          style={{ color: accent }}
        >
          {"“"}
          {cardData.bio?.split(/[.!?]/)[0]?.trim() ||
            "Hukuki Güvenceniz, Başarınızın Temeli"}
          {"”"}
        </p>
      </div>

      {/* SPECIALIZATIONS */}
      {services.length > 0 && (
        <section className="px-8 pt-8">
          <PureLabel>{t.practice}</PureLabel>
          <h2
            className="mt-3 text-[22px] font-medium leading-tight"
            style={{ color: accent, letterSpacing: "-0.5px" }}
          >
            {t.practiceH}
          </h2>
          <div className="mt-5 flex flex-col">
            {services.map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-center gap-4 py-3.5"
                style={{
                  borderBottom: i === services.length - 1 ? "none" : `1px solid ${HAIRLINE_LIGHT}`,
                }}
              >
                <span
                  aria-hidden
                  className="block h-px w-7 flex-shrink-0"
                  style={{ background: ACCENT_2 }}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[14px] font-medium"
                    style={{ color: INK, letterSpacing: "-0.1px" }}
                  >
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
                    className="text-[11px] font-semibold"
                    style={{ color: accent, letterSpacing: "0.3px" }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATS GRID 2x2 */}
      <div
        className="mt-8 grid grid-cols-2"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <PureStat num="20" label={t.yearsLabel} accent={accent} divider="r" />
        <PureStat num="800+" label={t.casesLabel} accent={accent} />
        <PureStat
          num="94%"
          label={t.winRateLabel}
          accent={accent}
          divider="rt"
        />
        <PureStat num="3" label={`${t.langsLabel} · DE/EN/TR`} accent={accent} divider="t" />
      </div>

      {/* EDUCATION 2-COL */}
      <section className="px-8 pt-8">
        <PureLabel>{t.education}</PureLabel>
        <div className="mt-3 grid grid-cols-2 gap-5">
          <div>
            <h4
              className="mb-2.5 text-[11px] font-semibold uppercase"
              style={{ color: INK_SOFT, letterSpacing: "2px" }}
            >
              {t.educationLabel}
            </h4>
            <ul className="m-0 list-none p-0 text-[12.5px]">
              <li className="py-1.5 leading-snug" style={{ color: INK, fontWeight: 500 }}>
                Humboldt-Universität
                <span className="block text-[10.5px] font-normal" style={{ color: INK_SOFT }}>
                  Jura, 2003
                </span>
              </li>
              <li className="py-1.5 leading-snug" style={{ color: INK, fontWeight: 500 }}>
                Heidelberg LL.M.
                <span className="block text-[10.5px] font-normal" style={{ color: INK_SOFT }}>
                  Strafrecht, 2005
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="mb-2.5 text-[11px] font-semibold uppercase"
              style={{ color: INK_SOFT, letterSpacing: "2px" }}
            >
              {t.membershipLabel}
            </h4>
            <ul className="m-0 list-none p-0 text-[12.5px]">
              <li className="py-1.5 leading-snug" style={{ color: INK, fontWeight: 500 }}>
                Rechtsanwaltskammer Berlin
                <span className="block text-[10.5px] font-normal" style={{ color: INK_SOFT }}>
                  Reg. 38421
                </span>
              </li>
              <li className="py-1.5 leading-snug" style={{ color: INK, fontWeight: 500 }}>
                DAV
                <span className="block text-[10.5px] font-normal" style={{ color: INK_SOFT }}>
                  2008—
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      {testimonial && (
        <section className="px-8 pt-8">
          <PureLabel>{t.reference}</PureLabel>
          <p
            className="serif-i mt-3 text-[14px] leading-[1.7]"
            style={{ color: INK }}
          >
            {"“"}
            {testimonial.quote}
            {"”"}
          </p>
          <div
            className="mt-3.5 text-[11.5px] font-semibold"
            style={{ color: accent, letterSpacing: "0.4px" }}
          >
            {testimonial.author}
            {testimonial.role ? ` — ${testimonial.role}` : ""}
          </div>
        </section>
      )}

      {/* CONTACT TABLE */}
      <section
        className="mt-8 px-8 pt-8"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <PureLabel>{t.contact}</PureLabel>
        <h2
          className="mt-3 text-[22px] font-medium leading-tight"
          style={{ color: accent, letterSpacing: "-0.5px" }}
        >
          {t.contactH}
        </h2>
        <div className="mt-5">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
        </div>
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-8 px-8 py-7"
        style={{ background: PAGE, borderTop: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-8 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-8 py-6"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-8 py-5 text-center"
        style={{ borderTop: `1px solid ${HAIRLINE}`, background: PAGE }}
      >
        <div
          className="text-[12px] font-semibold"
          style={{ color: accent, letterSpacing: "0.3px" }}
        >
          {cardData.name}
          {cardData.company ? ` — ${cardData.company}` : ""}
        </div>
        <div
          className="mt-1 text-[10.5px]"
          style={{ color: INK_SOFT, letterSpacing: "0.5px" }}
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

      {/* import-only safe */}
      <span className="hidden">
        <Globe size={1} />
      </span>
    </article>
  );
}

function PureLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-semibold uppercase"
      style={{ color: INK_SOFT, letterSpacing: "3px" }}
    >
      {children}
    </div>
  );
}

function PureStat({
  num,
  label,
  accent,
  divider,
}: {
  num: string;
  label: string;
  accent: string;
  divider?: "r" | "rt" | "t";
}) {
  const borderRight = divider?.includes("r") ? `1px solid ${HAIRLINE}` : "none";
  const borderTop = divider?.includes("t") ? `1px solid ${HAIRLINE}` : "none";
  return (
    <div
      className="px-6 py-5"
      style={{ borderRight, borderTop, borderBottom: divider?.includes("t") ? "none" : `1px solid ${HAIRLINE}` }}
    >
      <div
        className="text-[28px] font-medium leading-none"
        style={{ color: accent, letterSpacing: "-1px" }}
      >
        {num}
      </div>
      <div
        className="mt-1.5 text-[11px] font-medium"
        style={{ color: INK_SOFT, letterSpacing: "0.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function PureAction({
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
      className="flex items-center justify-center gap-2 px-3 py-2.5 text-[12px] font-semibold transition-colors"
      style={{
        background: PAGE,
        color: accent,
        border: `1px solid ${HAIRLINE}`,
        letterSpacing: "0.3px",
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

export const legalCounselPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 57,
  key: "legal-counsel-pure",
  name: "Legal Counsel — Pure",
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
    brandPrimaryHex: "#ffffff",
    brandAccentHex: "#1a2b4a",
  },
  sampleSlug: "demo-legal-counsel-pure",
};

export const legalCounselPureSample: SampleData = {
  templateId: 57,
  slug: "demo-legal-counsel-pure",
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
    bio: "Recht ist kein Wettkampf, sondern Sorgfalt. Seit zwei Jahrzehnten in der Berliner Rechtsanwaltskammer eingetragen — und seit ebenso langer Zeit überzeugt davon, dass kürzeste Briefe oft die besten Ergebnisse bringen.",
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
      { title: "Strafrecht", description: "Beratung und Vertretung im Strafverfahren.", priceLabel: "€200 Erstberatung" },
      { title: "Familienrecht", description: "Scheidung, Sorgerecht, Unterhalt.", priceLabel: "ab €300/h" },
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
  brandPrimaryHex: "#ffffff",
  brandAccentHex: "#1a2b4a",
};
