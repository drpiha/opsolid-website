"use client";

// =============================================================================
// BlankCanvas — the explicit blank, data-driven template (id=97,
// key="blank-canvas").
//
// The cleanest expression of the "shapes from user input" idea: a neutral
// shell that renders only the header (name / title / company / photo), the
// services list, the contact channels and socials. EVERYTHING else — logo,
// bio, stats, gallery, FAQ, testimonials, brochure, video, custom sections,
// embeds, custom buttons, tip jar, contact form — is supplied by the universal
// wrapper stack (UniversalBlocks) precisely because "blank-canvas" is
// registered in NONE of the *_NATIVE_KEYS sets in registry.ts. So a section
// appears if and only if the owner entered data for it.
//
// `services` is the one list field with no universal block, so it must render
// natively here (the coverage audit enforces this for every template).
//
// Every visible section label is COPY/`labels`-driven via resolveLabels, so an
// owner can rename "Services" → "Menu", "Contact" → "Reach me", etc.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ContactRows } from "./shared/ContactRows";
import { SocialRow } from "./shared/SocialRow";
import { ServiceLink } from "./shared/ServiceLink";
import { resolveLabels } from "./shared/resolveLabels";
import type { TemplateProps } from "./types";

const LOCKED_PRIMARY = "#1a1a1a"; // ink — neutral by design
const LOCKED_ACCENT = "#c27940"; // copper accent

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface BlankCopy {
  services: string;
  contact: string;
  social: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", BlankCopy> = {
  de: { services: "Leistungen", contact: "Kontakt", social: "Social" },
  en: { services: "Services", contact: "Contact", social: "Social" },
  tr: { services: "Hizmetler", contact: "İletişim", social: "Sosyal" },
  es: { services: "Servicios", contact: "Contacto", social: "Redes" },
  it: { services: "Servizi", contact: "Contatto", social: "Social" },
  fr: { services: "Services", contact: "Contact", social: "Réseaux" },
  ar: { services: "الخدمات", contact: "اتصال", social: "التواصل" },
};

export function BlankCanvas({
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const subtitleBits: string[] = [];
  if (cardData.position || cardData.title) {
    subtitleBits.push((cardData.position || cardData.title) as string);
  }
  if (cardData.company) subtitleBits.push(cardData.company);
  const subtitle = subtitleBits.join(" · ");

  return (
    <article
      data-template="blank-canvas"
      className="blank-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[24px] bg-white text-[#1a1a1a] ring-1 ring-black/5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)]"
      style={
        {
          ["--blank-primary" as string]: primary,
          ["--blank-accent" as string]: accent,
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      {/* Header — name, role/company, optional avatar. */}
      <header className="flex items-start gap-4 px-7 pb-6 pt-8">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ border: `1.5px solid ${accent}`, background: `${accent}14` }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={120}
              height={120}
              unoptimized
              className="h-full w-full object-cover tpl-photo"
            />
          ) : (
            <span
              className="text-[15px] font-semibold tracking-wide"
              style={{ color: accent }}
            >
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1
            className="text-[1.6rem] font-semibold leading-tight tracking-[-0.01em]"
            style={{ color: primary }}
          >
            {cardData.name}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[13px] leading-snug text-[#6b6b6b]">
              {subtitle}
            </p>
          )}
          {/* Slogan / tagline — no universal block renders it, so the blank
              template surfaces it natively under the name. */}
          {cardData.tagline && (
            <p
              className="mt-2 text-[13.5px] font-medium italic leading-snug"
              style={{ color: accent }}
            >
              {cardData.tagline}
            </p>
          )}
        </div>
      </header>

      {/* Services — the one list field with no universal block. */}
      {cardData.services && cardData.services.length > 0 && (
        <Section title={t.services} accent={accent}>
          <ul className="grid gap-2">
            {cardData.services.map((svc, i) => (
              <li key={`${svc.title}-${i}`}>
                <ServiceLink
                  href={svc.href}
                  className="flex items-baseline justify-between gap-3 rounded-xl border border-black/5 bg-[#fafafa] px-4 py-3"
                >
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium text-[#1a1a1a]">
                      {svc.title}
                    </span>
                    {svc.description && (
                      <span className="mt-0.5 block text-[12px] leading-relaxed text-[#6a6a6a]">
                        {svc.description}
                      </span>
                    )}
                  </span>
                  {svc.priceLabel && (
                    <span
                      className="shrink-0 text-[12px] font-semibold"
                      style={{ color: accent }}
                    >
                      {svc.priceLabel}
                    </span>
                  )}
                </ServiceLink>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Contact — whole-pass into the shared rows (phone/email/website/…). */}
      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          tone="light"
          accentHex={accent}
        />
      </Section>

      {/* Socials */}
      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <Section title={t.social} accent={accent}>
          <SocialRow socials={cardData.socials} variant="icon" accentHex={accent} />
        </Section>
      )}
    </article>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-7 py-5">
      <p
        className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {title}
      </p>
      {children}
    </section>
  );
}

// =============================================================================
// Registry entry + sample
// =============================================================================

import type { TemplateRegistryEntry, SampleData } from "./types";

export const blankCanvasEntry: TemplateRegistryEntry = {
  id: 97,
  key: "blank-canvas",
  name: "Blank Canvas",
  industry: "Any — neutral, data-driven blank template",
  Component: BlankCanvas,
  // All blocks enabled so every content-input group shows in the order form.
  // Most of these render via the universal wrapper stack rather than natively
  // (blank-canvas is in no *_NATIVE_KEYS set), so the coverage audit reports a
  // few benign `supports drift` WARNINGS — intended for the blank template.
  supports: {
    services: true,
    faqs: true,
    testimonials: true,
    gallery: true,
    video: true,
    brochure: true,
    socials: true,
    themeSwitch: true,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-blank-canvas",
};

export const blankCanvasSample: SampleData = {
  templateId: 97,
  slug: "demo-blank-canvas",
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Jordan Avery",
    position: "Independent Consultant",
    company: "Avery Studio",
    email: "hello@averystudio.com",
    phone: "+49 30 9876543",
    website: "https://averystudio.com",
    address: "Berlin, Germany",
    bio: "Generalist consultant. The blank template shows how any field the owner fills in becomes a section — bio, stats, gallery and the rest arrive through the universal blocks.",
    services: [
      { title: "Discovery call", description: "30 minutes, no charge.", priceLabel: "Free" },
      { title: "Audit & roadmap", description: "Two-week engagement.", priceLabel: "from €2,400" },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/example",
    },
  },
};
