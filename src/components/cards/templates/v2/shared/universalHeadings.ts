// =============================================================================
// universalHeadings — default section headings for the UniversalBlocks wrapper
// stack (gallery / embeds / faq / contact / testimonials / brochure / about).
//
// Single source of truth shared by:
//   • UniversalBlocks.tsx — renders these (resolveLabels overlays cardData.labels)
//   • SectionLabelsEditor  — lists them as editable label keys with these as
//     the placeholder defaults.
//
// Stays 3-locale (en/de/tr) by design — the wrapper blocks localize on
// BlockLocale; es/it/fr/ar fall back to en.
// =============================================================================

export type BlockLocale = "en" | "de" | "tr";

export interface UniversalHeadings {
  gallery: string;
  embeds: string;
  faq: string;
  contact: string;
  testimonials: string;
  brochure: string;
  about: string;
}

export const UNIVERSAL_HEADINGS: Record<BlockLocale, UniversalHeadings> = {
  de: { gallery: "Galerie", embeds: "Eingebettet", faq: "Häufige Fragen", contact: "Kontakt", testimonials: "Stimmen", brochure: "Broschüre", about: "Profil" },
  tr: { gallery: "Galeri", embeds: "Öne çıkan", faq: "Sık Sorulan Sorular", contact: "İletişim", testimonials: "Yorumlar", brochure: "Broşür", about: "Profil" },
  en: { gallery: "Gallery", embeds: "Featured", faq: "FAQ", contact: "Get in touch", testimonials: "Testimonials", brochure: "Brochure", about: "About" },
};

/** Ordered list of the universal heading keys (for the label editor). */
export const UNIVERSAL_LABEL_KEYS: Array<keyof UniversalHeadings> = [
  "about", "gallery", "testimonials", "faq", "brochure", "contact", "embeds",
];
