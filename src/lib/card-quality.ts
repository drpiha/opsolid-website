// Card quality score engine — pure computation, no external dependencies.
// Scores a CardOrder against 12 criteria to produce a 0-100 quality score
// and a list of actionable improvement suggestions.

export interface QualityScoreResult {
  score: number;
  maxScore: 100;
  breakdown: QualityCriterion[];
  suggestions: QualitySuggestion[];
}

export interface QualityCriterion {
  key: string;
  label: string;
  points: number;
  maxPoints: number;
  passed: boolean;
}

export interface QualitySuggestion {
  key: string;
  priority: "high" | "medium" | "low";
  points: number;
  title: Record<"de" | "en" | "tr", string>;
  description: Record<"de" | "en" | "tr", string>;
  targetSection: string; // which section in the editor to scroll to
}

const CRITERIA = [
  { key: "photo",              points: 15, targetSection: "brand"   },
  { key: "identity",           points: 15, targetSection: "contact" },
  { key: "contact_method",     points: 10, targetSection: "contact" },
  { key: "social_link",        points:  5, targetSection: "content" },
  { key: "service_description",points: 10, targetSection: "content" },
  { key: "location",           points:  5, targetSection: "contact" },
  { key: "cta_button",         points: 10, targetSection: "content" },
  { key: "vcard",              points:  5, targetSection: "publish" },
  { key: "gallery_or_video",   points:  5, targetSection: "content" },
  { key: "booking_or_form",    points:  5, targetSection: "content" },
  { key: "networking_flags",   points:  5, targetSection: "publish" },
  { key: "multilingual",       points: 10, targetSection: "content" },
] as const;

const SUGGESTION_TEXTS: Record<
  string,
  {
    title: Record<string, string>;
    description: Record<string, string>;
  }
> = {
  photo: {
    title: {
      de: "Profilfoto hinzufügen",
      en: "Add a profile photo",
      tr: "Profil fotoğrafı ekle",
    },
    description: {
      de: "Karten mit Foto erhalten 40% mehr Kontaktanfragen.",
      en: "Cards with photos receive 40% more contact requests.",
      tr: "Fotoğraflı kartlar %40 daha fazla iletişim talebi alır.",
    },
  },
  identity: {
    title: {
      de: "Name, Titel und Firma angeben",
      en: "Add name, title and company",
      tr: "Ad, unvan ve firma ekle",
    },
    description: {
      de: "Vollständige Identität baut Vertrauen bei Erstbesuchern auf.",
      en: "A complete identity builds trust with first-time visitors.",
      tr: "Eksiksiz kimlik, ilk ziyaretçilerde güven oluşturur.",
    },
  },
  contact_method: {
    title: {
      de: "Kontaktmöglichkeit hinzufügen",
      en: "Add a contact method",
      tr: "İletişim yöntemi ekle",
    },
    description: {
      de: "Telefon, E-Mail oder WhatsApp — mindestens eine Methode ist Pflicht.",
      en: "Phone, email or WhatsApp — at least one method is required.",
      tr: "Telefon, e-posta veya WhatsApp — en az biri zorunlu.",
    },
  },
  social_link: {
    title: {
      de: "Social-Media-Link hinzufügen",
      en: "Add a social media link",
      tr: "Sosyal medya linki ekle",
    },
    description: {
      de: "LinkedIn, Instagram oder Xing stärken Ihre Glaubwürdigkeit.",
      en: "LinkedIn, Instagram or Xing strengthens your credibility.",
      tr: "LinkedIn, Instagram veya Xing güvenilirliğinizi artırır.",
    },
  },
  service_description: {
    title: {
      de: "Leistungsbeschreibung hinzufügen",
      en: "Add a service description",
      tr: "Hizmet açıklaması ekle",
    },
    description: {
      de: "Erklären Sie, was Sie anbieten — in 1-2 Sätzen.",
      en: "Explain what you offer — in 1-2 sentences.",
      tr: "Ne sunduğunuzu açıklayın — 1-2 cümle yeterli.",
    },
  },
  location: {
    title: {
      de: "Standort hinzufügen",
      en: "Add your location",
      tr: "Konum ekle",
    },
    description: {
      de: "Stadt und Land helfen Interessenten, Sie einzuordnen.",
      en: "City and country help prospects understand where you're based.",
      tr: "Şehir ve ülke, potansiyel müşterilerin sizi tanımlamasına yardımcı olur.",
    },
  },
  cta_button: {
    title: {
      de: "Call-to-Action-Button hinzufügen",
      en: "Add a call-to-action button",
      tr: "CTA butonu ekle",
    },
    description: {
      de: "Ein klarer CTA erhöht die Konversionsrate erheblich.",
      en: "A clear CTA significantly increases conversion rates.",
      tr: "Net bir CTA, dönüşüm oranını önemli ölçüde artırır.",
    },
  },
  vcard: {
    title: {
      de: "vCard-Download aktivieren",
      en: "Enable vCard download",
      tr: "vCard indirmeyi etkinleştir",
    },
    description: {
      de: "Besucher können Ihre Kontaktdaten direkt speichern.",
      en: "Visitors can save your contact details directly.",
      tr: "Ziyaretçiler iletişim bilgilerinizi doğrudan kaydedebilir.",
    },
  },
  gallery_or_video: {
    title: {
      de: "Galerie oder Video hinzufügen",
      en: "Add gallery or video",
      tr: "Galeri veya video ekle",
    },
    description: {
      de: "Visuelle Inhalte steigern die Verweildauer auf Ihrer Karte.",
      en: "Visual content increases dwell time on your card.",
      tr: "Görsel içerik, kartta geçirilen süreyi artırır.",
    },
  },
  booking_or_form: {
    title: {
      de: "Buchungs- oder Kontaktformular aktivieren",
      en: "Enable booking or contact form",
      tr: "Rezervasyon veya iletişim formu ekle",
    },
    description: {
      de: "Ermöglichen Sie direkte Terminbuchungen oder Anfragen.",
      en: "Enable direct appointment bookings or inquiries.",
      tr: "Doğrudan randevu veya talep almanızı sağlar.",
    },
  },
  networking_flags: {
    title: {
      de: "Vernetzungsbereitschaft angeben",
      en: "Indicate networking readiness",
      tr: "Ağ kurma hazırlığını belirt",
    },
    description: {
      de: "Zeigen Sie, ob Sie offen für Kontakte oder neue Kunden sind.",
      en: "Show whether you're open to connections or new clients.",
      tr: "Yeni bağlantılara veya müşterilere açık olup olmadığınızı belirtin.",
    },
  },
  multilingual: {
    title: {
      de: "Mehrsprachigen Inhalt hinzufügen",
      en: "Add multilingual content",
      tr: "Çok dilli içerik ekle",
    },
    description: {
      de: "DE + EN Inhalte verdoppeln Ihre internationale Reichweite.",
      en: "DE + EN content doubles your international reach.",
      tr: "DE + EN içerik, uluslararası erişiminizi ikiye katlar.",
    },
  },
};

export type CardOrderForScore = {
  photoPath: string | null;
  logoPath?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  videoUrl?: string | null;
  cardData: unknown;
  city?: string | null;
  country?: string | null;
  openToNetworking?: boolean;
  acceptingClients?: boolean;
};

export function calculateQualityScore(order: CardOrderForScore): QualityScoreResult {
  const data = (order.cardData ?? {}) as Record<string, unknown>;
  const sections = (data.sections as unknown[]) ?? [];
  const socialLinks = (data.socialLinks as unknown[]) ?? [];
  const customBlocks = (data.customBlocks as unknown[]) ?? [];

  function hasSection(type: string): boolean {
    return sections.some(
      (s: unknown) => (s as Record<string, unknown>).type === type,
    );
  }

  function hasSocialLink(): boolean {
    return socialLinks.length > 0;
  }

  function hasGallery(): boolean {
    return (
      hasSection("gallery") ||
      hasSection("video") ||
      !!order.videoUrl ||
      customBlocks.some((b: unknown) => {
        const block = b as Record<string, unknown>;
        return block.type === "VideoEmbed" || block.type === "Gallery";
      })
    );
  }

  function hasBookingOrForm(): boolean {
    return (
      hasSection("booking") ||
      hasSection("contact_form") ||
      !!(data.bookingUrl as string)
    );
  }

  function hasCta(): boolean {
    const ctaBlocks = (data.ctaButtons as unknown[]) ?? [];
    return ctaBlocks.length > 0 || hasSection("cta");
  }

  function hasServiceDescription(): boolean {
    const bio = (data.bio as string) ?? "";
    const services = (data.services as unknown[]) ?? [];
    return bio.length > 30 || services.length > 0;
  }

  function hasMultilingual(): boolean {
    const locales = Object.keys(
      (data.locales as Record<string, unknown>) ?? {},
    );
    return locales.length > 1;
  }

  const checks: Record<string, boolean> = {
    photo:               !!order.photoPath || !!order.logoPath,
    identity:            !!(
                           order.contactName &&
                           (data.title as string) &&
                           (data.company as string ?? order.contactName)
                         ),
    contact_method:      !!(
                           order.contactPhone ||
                           order.contactEmail ||
                           (data.whatsapp as string)
                         ),
    social_link:         hasSocialLink(),
    service_description: hasServiceDescription(),
    location:            !!(order.city || (data.city as string)),
    cta_button:          hasCta(),
    vcard:               !!(data.vcardEnabled as boolean),
    gallery_or_video:    hasGallery(),
    booking_or_form:     hasBookingOrForm(),
    networking_flags:    !!(order.openToNetworking || order.acceptingClients),
    multilingual:        hasMultilingual(),
  };

  let score = 0;
  const breakdown: QualityCriterion[] = [];
  const suggestions: QualitySuggestion[] = [];

  for (const criterion of CRITERIA) {
    const passed = checks[criterion.key] ?? false;
    const points = passed ? criterion.points : 0;
    score += points;

    breakdown.push({
      key:       criterion.key,
      label:     criterion.key,
      points,
      maxPoints: criterion.points,
      passed,
    });

    if (!passed) {
      const texts = SUGGESTION_TEXTS[criterion.key];
      suggestions.push({
        key:      criterion.key,
        priority: criterion.points >= 10 ? "high" : criterion.points >= 5 ? "medium" : "low",
        points:   criterion.points,
        title:       texts?.title       ?? { de: criterion.key, en: criterion.key, tr: criterion.key },
        description: texts?.description ?? { de: "", en: "", tr: "" },
        targetSection: criterion.targetSection,
      });
    }
  }

  // Sort suggestions by impact (highest points first)
  suggestions.sort((a, b) => b.points - a.points);

  return { score, maxScore: 100, breakdown, suggestions };
}
