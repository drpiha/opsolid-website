"use client";

import * as React from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Loader2,
  AlertCircle,
  Check,
  ChevronDown,
  ArrowRight,
  X,
  Eye,
  Lock,
  Camera,
  Building2,
  Maximize2,
} from "lucide-react";
import type { z } from "zod";
import { Input, Textarea } from "@/components/ui/Input";
import { useLocale } from "@/context/LocaleContext";
import {
  cardTemplates,
  formatEuro,
  getTemplateById,
} from "@/config/card-templates";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import {
  getTemplateEntry,
  templateRegistry,
} from "@/components/cards/templates/v2/registry";
import type { TemplateSupports, TemplateNameRules } from "@/components/cards/templates/v2/types";
import { OrderPayloadSchema, BillingMode } from "@/lib/validation";
import type {
  CardData,
  ImagePosition,
} from "@/lib/validation";
import { PhotoEditor } from "@/components/cards/PhotoEditor";
import { TYPOGRAPHY_PRESET_LIST } from "@/lib/typographyPresets";
import { downscaleImage } from "@/lib/images/downscale";
import { UniversalBlocks } from "@/components/cards/UniversalBlocks";
import { CustomSectionsEditor } from "@/components/cards/order-form/CustomSectionsEditor";
import { SectionLabelsEditor } from "@/components/cards/order-form/SectionLabelsEditor";
import type { BlockLocale } from "@/components/cards/templates/v2/shared/universalHeadings";
import {
  CardLanguageSelector,
  type CardLocale,
} from "@/components/cards/order-form/CardLanguageSelector";
import { ProfileExtrasFields } from "@/components/cards/order-form/ProfileExtrasFields";
import { StatsEditor } from "@/components/cards/order-form/StatsEditor";
import {
  CARD_THEME_LIST,
  type CardThemeKey,
  type CardThemePreset,
} from "@/lib/cardThemes";

// =============================================================================
// Validation helpers
// =============================================================================

// Map Zod validation issues to a flat record keyed by field path
// (e.g. "contactEmail" or "cardData.website"). Falls back to the raw
// Zod message if we don't have a localized label for the path.
function extractFieldErrors(issues: z.ZodIssue[]): Record<string, string> {
  const map: Record<string, string> = {};
  const label: Record<string, string> = {
    contactName: "Name ist erforderlich",
    contactEmail: "Bitte gültige E-Mail eingeben",
    contactPhone: "Bitte gültige Telefonnummer eingeben",
    "cardData.name": "Name auf der Karte ist erforderlich",
    "cardData.email": "Bitte gültige E-Mail eingeben",
    "cardData.phone": "Bitte gültige Telefonnummer eingeben",
    "cardData.website": "Bitte gültige URL eingeben (https://…)",
  };
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (!map[key]) {
      map[key] = label[key] ?? issue.message;
    }
  }
  return map;
}

// Map a field path back to the accordion step that owns it. Used by the
// submit-error scroll handler so we can auto-open the right step before
// scrolling to the offending input.
function stepForFieldPath(path: string): StepId {
  if (path.startsWith("contact") || path === "callMeBack") return "contact";
  if (path.startsWith("cardData.")) return "card";
  if (path.startsWith("brand") || path === "themeKey" || path === "layoutKey")
    return "branding";
  if (path === "billingMode") return "billing";
  return "card";
}

type FormState = "idle" | "submitting" | "error";
type StepId = "contact" | "card" | "branding" | "billing";

const STEP_ORDER: StepId[] = ["contact", "card", "branding", "billing"];

// Default supports object — covers templates not yet in the v2 registry so
// we still render every input group when the customer picks an id 2..20.
const DEFAULT_SUPPORTS: TemplateSupports = {
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
};

interface Props {
  selectedTemplateId: number | null;
  // Reserved for future template-change affordances inside the form.
  onTemplateChange: (id: number) => void;
  /** Resolved server-side from CARD_PRICING_MODE. Under "all_free" the paid
   *  billing tiles are not rendered and the form can only submit FREE. */
  pricingMode?: import("@/lib/billing/plan").CardPricingMode;
  /** Fair flow — present when the page was opened via ?event=<slug>. Shows
   *  the event banner + directory opt-in; the slug rides along in the order
   *  payload so the new card joins the attendee directory. */
  event?: import("../DigitalCardPage").OrderEventInfo | null;
}

// localStorage key for the order-form draft (see "draft autosave" below).
const ORDER_DRAFT_KEY = "opsolid-card-order-draft-v1";

const EMPTY_CARD: CardData = {
  name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  bio: "",
  whatsapp: "",
  socials: { linkedin: "", instagram: "", x: "", tiktok: "", youtube: "", github: "", facebook: "" },
  designNotes: "",
};

// A fully-populated example card. The builder used to start from EMPTY_CARD,
// which made the live preview look empty/incomplete on first load ("the full
// card doesn't show in demo"). Seeding the form with a complete sample makes
// the preview render a full card immediately; the user overwrites it with their
// own data, or hits "Leeren" (StepCardContent) to start blank. Display-safe:
// the required Contact step (real name/email/phone) is separate and still empty.
function getSampleCard(locale: string): CardData {
  if (locale === "tr") {
    return {
      name: "Elif Aydın",
      title: "Kurucu & Ürün Tasarımcısı",
      company: "Atölye Ege",
      tagline: "Fikirden rafa: sevilen ürünler",
      phone: "+90 532 123 45 67",
      email: "elif@atolyeege.com",
      website: "https://atolyeege.com",
      address: "Alsancak, 35220 İzmir",
      bio: "Kurucuların ham fikirlerini kullanıcıların sevdiği ürünlere dönüştürüyorum — ilk eskizden yayına. SaaS, fintech ve e-ticarette on yıl.",
      whatsapp: "+90 532 123 45 67",
      socials: {
        linkedin: "https://www.linkedin.com/in/elifaydin",
        instagram: "https://instagram.com/atolye.ege",
        x: "", tiktok: "", youtube: "", github: "", facebook: "",
      },
      services: [
        { title: "Ürün & UX tasarımı", description: "Araştırmadan yayına uçtan uca tasarım.", priceLabel: "₺45.000'den" },
        { title: "Tasarım sprinti", description: "Problemden test edilmiş prototipe bir hafta.", priceLabel: "₺120.000'den" },
        { title: "Tasarım sistemi", description: "Ekibinizin üzerine inşa edeceği bileşen kütüphanesi.", priceLabel: "Teklif alın" },
      ],
      stats: [
        { value: "10+", label: "Yıl deneyim" },
        { value: "60+", label: "Proje" },
        { value: "%98", label: "Memnuniyet" },
      ],
      faqs: [
        { q: "Ne kadar hızlı başlayabiliriz?", a: "Genelde bir hafta içinde. Kısa bir görüşme ayarlayalım, ilk sprinti birlikte planlayalım." },
        { q: "Uzaktan çalışıyor musunuz?", a: "Evet — tüm Türkiye ve AB'de remote-first; istek üzerine İzmir'de yüz yüze." },
      ],
      testimonials: [
        { author: "Deniz Kaya", role: "Kurucu, Hello Mauve", quote: "Elif belirsiz bir fikri kullanıcıların anında anladığı bir ürüne dönüştürdü. Hızlı, net, lafı dolandırmadan." },
      ],
      designNotes: "",
    };
  }
  if (locale === "en") {
    return {
      name: "Alex Weber",
      title: "Founder & Product Designer",
      company: "Studio Nord",
      tagline: "From rough idea to shipped product",
      phone: "+49 160 1234567",
      email: "alex@studio-nord.de",
      website: "https://studio-nord.de",
      address: "Speicherstadt 4, 20457 Hamburg",
      bio: "I help founders turn rough ideas into products people love — from first sketch to a shipped interface. Ten years across SaaS, fintech and e-commerce.",
      whatsapp: "+49 160 1234567",
      socials: {
        linkedin: "https://www.linkedin.com/in/alexweber",
        instagram: "https://instagram.com/studio.nord",
        x: "", tiktok: "", youtube: "", github: "", facebook: "",
      },
      services: [
        { title: "Product & UX design", description: "End-to-end design from research to a polished, shippable interface.", priceLabel: "from €1,500" },
        { title: "Design sprint", description: "One focused week from problem to a tested prototype.", priceLabel: "from €3,900" },
        { title: "Design system", description: "A reusable component library your team can build on.", priceLabel: "on request" },
      ],
      stats: [
        { value: "10+", label: "Years" },
        { value: "60+", label: "Projects" },
        { value: "98%", label: "Satisfaction" },
      ],
      faqs: [
        { q: "How fast can we start?", a: "Usually within a week. Book a short call and we map the first sprint together." },
        { q: "Do you work remotely?", a: "Yes — remote-first across the EU, on-site in Hamburg on request." },
      ],
      testimonials: [
        { author: "Lena Richter", role: "Founder, Hello Mauve", quote: "Alex turned a vague idea into a product our users immediately understood. Fast, sharp, no fluff." },
      ],
      designNotes: "",
    };
  }
  // de (default)
  return {
    name: "Alex Weber",
    title: "Gründer & Produktdesigner",
    company: "Studio Nord",
    tagline: "Von der Skizze zum fertigen Produkt",
    phone: "+49 160 1234567",
    email: "alex@studio-nord.de",
    website: "https://studio-nord.de",
    address: "Speicherstadt 4, 20457 Hamburg",
    bio: "Ich helfe Gründern, grobe Ideen in Produkte zu verwandeln, die Menschen lieben — von der ersten Skizze bis zum fertigen Interface. Zehn Jahre in SaaS, Fintech und E-Commerce.",
    whatsapp: "+49 160 1234567",
    socials: {
      linkedin: "https://www.linkedin.com/in/alexweber",
      instagram: "https://instagram.com/studio.nord",
      x: "", tiktok: "", youtube: "", github: "", facebook: "",
    },
    services: [
      { title: "Produkt- & UX-Design", description: "End-to-End-Design von der Recherche bis zum fertigen Interface.", priceLabel: "ab 1.500 €" },
      { title: "Design-Sprint", description: "Eine fokussierte Woche vom Problem zum getesteten Prototyp.", priceLabel: "ab 3.900 €" },
      { title: "Design-System", description: "Eine wiederverwendbare Komponentenbibliothek für Ihr Team.", priceLabel: "auf Anfrage" },
    ],
    stats: [
      { value: "10+", label: "Jahre" },
      { value: "60+", label: "Projekte" },
      { value: "98%", label: "Zufriedenheit" },
    ],
    faqs: [
      { q: "Wie schnell können wir starten?", a: "Meist innerhalb einer Woche. Buchen Sie ein kurzes Gespräch — wir planen den ersten Sprint gemeinsam." },
      { q: "Arbeiten Sie remote?", a: "Ja — remote-first in der ganzen EU, vor Ort in Hamburg auf Anfrage." },
    ],
    testimonials: [
      { author: "Lena Richter", role: "Gründerin, Hello Mauve", quote: "Alex hat aus einer vagen Idee ein Produkt gemacht, das unsere Nutzer sofort verstanden haben. Schnell, präzise, ohne Schnörkel." },
    ],
    designNotes: "",
  };
}

// Phase 7.9 — small caption shown next to "Edit position" button
function formatPositionLabel(pos: ImagePosition | undefined): string | undefined {
  if (!pos) return undefined;
  const centred = pos.x === 50 && pos.y === 50;
  const xy = centred ? "Merkez" : `${Math.round(pos.x)} · ${Math.round(pos.y)}`;
  return `${xy} · ${pos.scale.toFixed(2)}×`;
}

// =============================================================================
// Section component
// =============================================================================

export function OrderFormSection({
  selectedTemplateId,
  pricingMode = "freemium",
  event = null,
}: Props) {
  const paymentsEnabled = pricingMode !== "all_free";
  const { locale, t } = useLocale();
  const order = t.products.digitalCard.order ?? {};
  // Stable identity prevents downstream useMemos (summaries, etc.) from
  // re-running every render. The function only depends on `order.form`,
  // which is itself stable inside a given locale.
  const L = useCallback(
    (key: string, fallback: string) =>
      (order.form && (order.form as Record<string, string>)[key]) || fallback,
    [order.form]
  );

  // ---- form state (preserved verbatim from previous version) -------------
  const [cardData, setCardData] = useState<CardData>(() => getSampleCard(locale));
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [callMeBack, setCallMeBack] = useState(false);
  const [brandPrimaryHex, setBrandPrimaryHex] = useState("");
  const [brandAccentHex, setBrandAccentHex] = useState("");
  const [themeKey, setThemeKey] = useState<CardThemeKey | undefined>(undefined);
  const [layoutKey, setLayoutKey] = useState<string | undefined>(undefined);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  // Freemium-first: default to the free instant-publish tier so the self-serve
  // path is the path of least resistance. Paid tiers stay one click away.
  const [billingMode, setBillingMode] =
    useState<keyof typeof BillingMode>("FREE");
  // Phase 8 — customer-chosen slug (without forced random suffix). Empty
  // string lets the server fall back to `name-xxxx` auto-generation.
  const [desiredSlug, setDesiredSlug] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // Fair flow — listed in the event's public attendee directory. Checked by
  // default: the invite link exists precisely so participants find each other;
  // unchecking keeps the card out of the roster (the card itself stays as
  // visible as its own visibility setting).
  const [joinDirectory, setJoinDirectory] = useState(true);

  // Phase 7.7 — auto-reset colors when the user switches templates, unless
  // they've already customised them.
  const [colorsCustomised, setColorsCustomised] = useState(false);
  // Phase 7.7 — bumped on every template change to retrigger the chip pulse.
  const [pulseKey, setPulseKey] = useState(0);
  // Phase 7.7 — instant in-form preview while the upload completes in the
  // background. The data-URL is shown in both the upload tile and the live
  // preview, then replaced with the final server path on success.
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  // ---- accordion state ---------------------------------------------------
  const [openStep, setOpenStep] = useState<StepId>("contact");
  const [previewOpen, setPreviewOpen] = useState(false);
  // Phase 7.9 — photo / logo position editor modal
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [logoEditorOpen, setLogoEditorOpen] = useState(false);
  // Phase 7.9 — share-link modal (URL-hash preview without payment)
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  // Phase 7.8 — desktop full-screen preview modal + per-preview locale switch
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [previewLocale, setPreviewLocale] = useState<"de" | "en" | "tr">(
    ["de", "en", "tr"].includes(locale) ? (locale as "de" | "en" | "tr") : "de"
  );
  // Explicit card language — the language /c/[slug] renders in. Defaults to
  // the page locale but is now a visible choice (was silently inherited).
  const [cardLocale, setCardLocale] = useState<CardLocale>(
    (["de", "en", "tr"].includes(locale) ? locale : "de") as CardLocale,
  );

  // ---- draft autosave ------------------------------------------------------
  // The fair case: the form is filled on a phone, the browser gets killed by
  // a call / tab discard, and twenty minutes of typing is gone. Persist the
  // text state (never the binary uploads — photoPath/logoPath are already
  // server paths) to localStorage, debounced, and restore it on mount.
  // Cleared on successful submit. Drafts older than 7 days are ignored.
  const [draftRestored, setDraftRestored] = useState(false);
  const draftReady = useRef(false);
  const initialDraftJson = useRef<string | null>(null);

  const draftSnapshot = useMemo(
    () =>
      JSON.stringify({
        cardData,
        contactName,
        contactEmail,
        contactPhone,
        desiredSlug,
        brandPrimaryHex,
        brandAccentHex,
        themeKey: themeKey ?? null,
        layoutKey: layoutKey ?? null,
        photoPath,
        logoPath,
      }),
    [
      cardData,
      contactName,
      contactEmail,
      contactPhone,
      desiredSlug,
      brandPrimaryHex,
      brandAccentHex,
      themeKey,
      layoutKey,
      photoPath,
      logoPath,
    ],
  );

  useEffect(() => {
    // Restore once, before any save can run.
    try {
      initialDraftJson.current = draftSnapshot;
      const raw = window.localStorage.getItem(ORDER_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          savedAt?: number;
          state?: Record<string, unknown>;
        };
        const fresh =
          typeof parsed.savedAt === "number" &&
          Date.now() - parsed.savedAt < 7 * 24 * 60 * 60 * 1000;
        if (fresh && parsed.state && typeof parsed.state === "object") {
          const s = parsed.state as {
            cardData?: CardData;
            contactName?: string;
            contactEmail?: string;
            contactPhone?: string;
            desiredSlug?: string;
            brandPrimaryHex?: string;
            brandAccentHex?: string;
            themeKey?: CardThemeKey | null;
            layoutKey?: string | null;
            photoPath?: string | null;
            logoPath?: string | null;
          };
          if (s.cardData && typeof s.cardData.name === "string") {
            setCardData(s.cardData);
          }
          if (s.contactName) setContactName(s.contactName);
          if (s.contactEmail) setContactEmail(s.contactEmail);
          if (s.contactPhone) setContactPhone(s.contactPhone);
          if (s.desiredSlug) setDesiredSlug(s.desiredSlug);
          if (s.brandPrimaryHex) setBrandPrimaryHex(s.brandPrimaryHex);
          if (s.brandAccentHex) setBrandAccentHex(s.brandAccentHex);
          if (s.themeKey) setThemeKey(s.themeKey);
          if (s.layoutKey) setLayoutKey(s.layoutKey);
          if (s.photoPath) setPhotoPath(s.photoPath);
          if (s.logoPath) setLogoPath(s.logoPath);
          setDraftRestored(true);
        }
      }
    } catch {
      /* corrupt draft — start clean */
    }
    draftReady.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftReady.current) return;
    // Don't persist the untouched sample card — a draft only exists once the
    // visitor actually typed something.
    if (draftSnapshot === initialDraftJson.current) return;
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(
          ORDER_DRAFT_KEY,
          JSON.stringify({ savedAt: Date.now(), state: JSON.parse(draftSnapshot) }),
        );
      } catch {
        /* storage full / private mode — autosave is best-effort */
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [draftSnapshot]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(ORDER_DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Clear a single field's error the moment the user edits it — keeps the
  // form feeling responsive instead of waiting for the next submit.
  const clearFieldError = (key: string) =>
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const selectedTemplate = useMemo(
    () =>
      selectedTemplateId ? getTemplateById(selectedTemplateId) : cardTemplates[0],
    [selectedTemplateId]
  );

  // Phase 7.7 — registry entry drives the visual name (the catalog entry can
  // disagree, e.g. catalog id=2="Warm Serif" vs registry id=2="Legal Counsel").
  const v2Entry = useMemo(
    () => getTemplateEntry(selectedTemplateId ?? selectedTemplate?.id),
    [selectedTemplateId, selectedTemplate?.id]
  );

  const supports: TemplateSupports = useMemo(() => {
    if (!selectedTemplate) return DEFAULT_SUPPORTS;
    const entry = templateRegistry[selectedTemplate.id];
    return entry?.supports ?? DEFAULT_SUPPORTS;
  }, [selectedTemplate]);

  // Phase 7.7/7.8 — react to a fresh template selection from the carousel:
  //   - bump the pulse key so the chip animates once
  //   - if the customer is still on step 1, keep them there; otherwise leave
  //     them in the step they chose (Phase 7.8: forcing back to step 1 was
  //     reported as annoying mid-flow)
  //   - if they haven't customised colors yet, seed with the new template's
  //     defaults (otherwise their picks survive the swap)
  const hasSelectedBeforeRef = useRef(false);
  useEffect(() => {
    if (selectedTemplateId == null) return;
    setPulseKey((k) => k + 1);
    // Only bounce back to step 1 on the *first* template pick — once the
    // customer has moved past contact, respect where they are.
    if (!hasSelectedBeforeRef.current) {
      setOpenStep("contact");
      hasSelectedBeforeRef.current = true;
    }
    if (!colorsCustomised) {
      const entry = getTemplateEntry(selectedTemplateId);
      if (entry) {
        setBrandPrimaryHex(entry.defaults.brandPrimaryHex);
        setBrandAccentHex(entry.defaults.brandAccentHex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  const activeCardData: CardData = useMemo(() => {
    const display: CardData = {
      ...cardData,
      name: cardData.name || contactName || "Ihr Name",
      phone: cardData.phone || contactPhone || undefined,
      email: cardData.email || contactEmail || undefined,
    };
    // Phase-1 audit bug fix: SmartCard reads `themeKey` off cardData via a
    // type-cast (`(cardData as { themeKey?: string }).themeKey`). Merge the
    // form's themeKey state into the preview payload so the theme picker
    // visibly drives the live preview's `data-theme` attribute.
    if (themeKey) {
      (display as CardData & { themeKey?: string; layoutKey?: string }).themeKey =
        themeKey;
    }
    if (layoutKey) {
      (display as CardData & { themeKey?: string; layoutKey?: string }).layoutKey =
        layoutKey;
    }
    return display;
  }, [cardData, contactName, contactPhone, contactEmail, themeKey, layoutKey]);

  const amountCents = useMemo(() => {
    if (!selectedTemplate) return 0;
    if (billingMode === "FREE") return 0;
    if (billingMode === "MONTHLY")
      return selectedTemplate.monthlyCents ?? selectedTemplate.oneTimeCents;
    if (billingMode === "YEARLY")
      return selectedTemplate.yearlyCents ?? selectedTemplate.oneTimeCents;
    return selectedTemplate.oneTimeCents;
  }, [selectedTemplate, billingMode]);

  const handleFileUpload = async (
    file: File,
    kind: "photo" | "logo"
  ): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(L("uploadTooLarge", "Datei zu groß (max 5 MB)."));
      return null;
    }
    // Shrink in the browser before upload (see lib/images/downscale).
    const optimized = await downscaleImage(file, {
      maxEdge: kind === "logo" ? 512 : 1600,
    });
    const form = new FormData();
    form.append("file", optimized);
    form.append("kind", kind);
    const res = await fetch("/api/uploads", { method: "POST", body: form });
    if (!res.ok) {
      setErrorMsg(L("uploadFailed", "Upload fehlgeschlagen."));
      return null;
    }
    const json = (await res.json()) as { path?: string; error?: string };
    return json.path ?? null;
  };

  // Phase 7.7 — read the picked file as a data URL so we can show it
  // immediately while the real upload finishes in the background.
  const readPreview = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") resolve(result);
        else reject(new Error("FileReader returned non-string result"));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const setCard = <K extends keyof CardData>(key: K, value: CardData[K]) =>
    setCardData((c) => ({ ...c, [key]: value }));
  const setSocial = (
    key: keyof NonNullable<CardData["socials"]>,
    value: string
  ) =>
    setCardData((c) => ({ ...c, socials: { ...(c.socials ?? {}), [key]: value } }));

  /**
   * Apply (or clear) a style preset. Selecting a preset:
   *   - sets `themeKey` + `layoutKey`
   *   - seeds `brandPrimaryHex` / `brandAccentHex` only when the user has not
   *     yet entered a custom value, so we never overwrite intentional input.
   */
  const applyPreset = (preset: CardThemePreset | null) => {
    if (preset) {
      setThemeKey(preset.key);
      setLayoutKey(preset.layoutKey);
      setBrandPrimaryHex((current) => current || preset.primaryHex);
      setBrandAccentHex((current) => current || preset.accentHex);
    } else {
      setThemeKey(undefined);
      setLayoutKey(undefined);
    }
  };

  // ---- submit handler ----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    setErrorMsg(null);
    setFormState("submitting");

    const normalizedCard: CardData = {
      ...cardData,
      title: cardData.title || undefined,
      company: cardData.company || undefined,
      phone: cardData.phone || contactPhone,
      email: cardData.email || contactEmail,
      website: cardData.website || undefined,
      address: cardData.address || undefined,
      bio: cardData.bio || undefined,
      whatsapp: cardData.whatsapp || undefined,
      designNotes: cardData.designNotes || undefined,
      socials: Object.fromEntries(
        Object.entries(cardData.socials ?? {}).filter(([, v]) => v)
      ) as CardData["socials"],
    };

    const payload = {
      templateId: selectedTemplate.id,
      billingMode,
      locale: cardLocale,
      contactName,
      contactEmail,
      contactPhone,
      callMeBack,
      cardData: normalizedCard,
      brandPrimaryHex: brandPrimaryHex || undefined,
      brandAccentHex: brandAccentHex || undefined,
      photoPath: photoPath || undefined,
      logoPath: logoPath || undefined,
      themeKey: themeKey || undefined,
      layoutKey: layoutKey || undefined,
      desiredSlug: desiredSlug.trim() ? desiredSlug.trim() : undefined,
      eventSlug: event && joinDirectory ? event.slug : undefined,
    };

    const parsed = OrderPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = extractFieldErrors(parsed.error.issues);
      setFieldErrors(errs);
      setFormState("idle");
      const firstKey = Object.keys(errs)[0];
      if (firstKey) {
        // Auto-open the step that owns the offending field before scrolling,
        // otherwise the input would be hidden inside a collapsed accordion.
        const targetStep = stepForFieldPath(firstKey);
        setOpenStep(targetStep);
        // Defer scrollIntoView one tick so the accordion expansion animation
        // doesn't fight the smooth scroll.
        setTimeout(() => {
          const el = document.getElementById(
            `field-${firstKey.replace(".", "-")}`
          );
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => el?.focus({ preventScroll: true }), 250);
        }, 60);
      }
      return;
    }
    setFieldErrors({});

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          reason?: string;
        };
        if (body.error === "slug_taken") {
          setErrorMsg(
            L("slugTakenError", "Bu kart adresi alınmış. Başka bir adres seç."),
          );
          setOpenStep("billing");
        } else if (body.error === "slug_invalid") {
          setErrorMsg(
            L("slugInvalidError", "Geçersiz kart adresi. Formatı kontrol et."),
          );
          setOpenStep("billing");
        } else {
          setErrorMsg(
            body.error ??
              L("serverError", "Serverfehler. Bitte erneut versuchen."),
          );
        }
        setFormState("error");
        return;
      }
      const json = (await res.json()) as {
        checkoutUrl?: string;
        editUrl?: string;
        cardUrl?: string;
        editToken?: string;
      };
      // FREE tier: the card is already published. Land on the LIVE card in owner
      // mode (?owner=<editToken>) so the user immediately sees their published
      // card + the full share toolbar (QR, link, wallet, vCard) and a one-click
      // Edit — the "your card is live, here's how to share it" moment. Falls
      // back to the editor if the API didn't return a card URL.
      if (json.cardUrl && json.editToken) {
        clearDraft();
        window.location.href = `${json.cardUrl}?owner=${encodeURIComponent(json.editToken)}`;
        return;
      }
      if (json.editUrl) {
        clearDraft();
        window.location.href = json.editUrl;
        return;
      }
      if (!json.checkoutUrl) {
        setErrorMsg(L("noCheckoutUrl", "Keine Zahlungs-URL erhalten."));
        setFormState("error");
        return;
      }
      window.location.href = json.checkoutUrl;
    } catch {
      setErrorMsg(L("networkError", "Netzwerkfehler."));
      setFormState("error");
    }
  };

  // ---- step summaries ----------------------------------------------------
  const summaries: Record<StepId, string> = useMemo(() => {
    const empty = L("stepEmpty", "Bitte ausfüllen");
    const contactBits = [contactName, contactEmail, contactPhone].filter(Boolean);
    const cardBits = [cardData.name, cardData.title, cardData.company].filter(
      Boolean
    );

    const billingMap: Record<keyof typeof BillingMode, string> = {
      FREE: L("billingFree", "Kostenlos"),
      MONTHLY: L("billingMonthly", "Monatlich"),
      YEARLY: L("billingYearly", "Jährlich"),
      ONE_TIME: L("billingOneTime", "Einmalzahlung"),
    };

    return {
      contact:
        contactBits.length > 0 ? contactBits.slice(0, 2).join(" · ") : empty,
      card: cardBits.length > 0 ? cardBits.slice(0, 2).join(" · ") : empty,
      branding: (() => {
        // Phase 7.7 — when the customer hasn't customised colors, the swatch
        // chip should read "template colors · <template name>", not the raw
        // primary hex (which they didn't pick).
        const bits: string[] = [];
        if (colorsCustomised && brandPrimaryHex) {
          bits.push(brandPrimaryHex.toUpperCase());
        } else if (brandPrimaryHex) {
          bits.push(L("templateColors", "Şablon renkleri"));
        }
        if (v2Entry) {
          bits.push(v2Entry.name);
        } else if (themeKey) {
          const preset = CARD_THEME_LIST.find((p) => p.key === themeKey);
          if (preset) bits.push(preset.label);
        }
        return bits.length > 0
          ? bits.join(" · ")
          : L("step3Summary", "Farben, Stil, Designnotizen");
      })(),
      billing: `${billingMap[billingMode]} · ${formatEuro(amountCents)}`,
    };
  }, [
    L,
    contactName,
    contactEmail,
    contactPhone,
    cardData.name,
    cardData.title,
    cardData.company,
    themeKey,
    brandPrimaryHex,
    billingMode,
    amountCents,
    colorsCustomised,
    v2Entry,
  ]);

  // ---- next-step navigation ---------------------------------------------
  const stepIndex = STEP_ORDER.indexOf(openStep);
  const goToStep = (id: StepId) => {
    setOpenStep(id);
    // Scroll the newly opened step into view on mobile so the user always
    // sees the freshly opened section without hunting for it.
    setTimeout(() => {
      const el = document.getElementById(`step-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  if (!selectedTemplate) return null;

  // ---- preview component (sticky desktop / sheet mobile) ----------------
  // Phase 7.7 — prefer the local data-URL preview while a real upload is in
  // flight so the live preview reflects the customer's pick instantly.
  // Phase 7.8 — locale is driven by `previewLocale` so the customer can flip
  // the card output language inside the preview without leaving the form.
  const previewNode = (
    <LivePreview
      templateId={selectedTemplateId ?? selectedTemplate?.id ?? 1}
      slug="preview"
      cardData={activeCardData}
      photoPath={photoPreviewUrl ?? photoPath}
      logoPath={logoPreviewUrl ?? logoPath}
      brandPrimaryHex={brandPrimaryHex || undefined}
      brandAccentHex={brandAccentHex || undefined}
      locale={previewLocale}
    />
  );

  return (
    <section
      className="relative border-t border-neutral-200/70 bg-gradient-to-b from-bg-0 to-bg-1 py-16 md:py-24"
    >
      {/* Decorative top hairline + warm grain — multi-layered backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-[0.35]" />

      <div className="container relative mx-auto max-w-7xl px-6">
        {/* ---- header ------------------------------------------------- */}
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mono-label uppercase tracking-[0.2em] text-ink/55">
            {L("eyebrow", "BESTELLUNG")}
          </p>
          <h2 className="mt-3 font-serif text-display-sm leading-[1.05] text-ink">
            {L("title", "Ihre Daten, Ihr Design, Ihre Karte.")}
          </h2>
          <p className="mt-4 max-w-xl text-body text-ink/65">
            {L(
              "subtitle",
              "Füllen Sie das Formular aus — die Karte wird direkt nach der Zahlung unter opsolid.de/c/… veröffentlicht."
            )}
          </p>
          {/* Short "who + how" note — anonymous-first: anyone can create a card
              with no account, and gets a private edit link. */}
          <p className="mt-4 flex max-w-xl items-start gap-2 rounded-xl border border-copper/25 bg-copper/5 px-4 py-3 text-sm text-ink/75">
            <Check size={16} className="mt-0.5 shrink-0 text-copper" />
            <span>
              {L(
                "howToCreate",
                "Anyone can create a card — no account needed. Pick a design, fill in the form, and it goes live in minutes. You get a private link to edit it anytime."
              )}
            </span>
          </p>

          {/* Fair flow — invite-link banner + directory opt-in */}
          {event && (
            <div className="mt-4 max-w-xl rounded-xl border border-copper/35 bg-copper/10 px-4 py-3">
              <p className="text-sm font-semibold text-ink">
                🎪 {event.name}
                <span className="font-normal text-ink/60">
                  {" "}
                  · {event.city}
                  {event.venue ? ` · ${event.venue}` : ""}
                </span>
              </p>
              <label className="mt-2 flex cursor-pointer items-start gap-2 text-sm text-ink/75">
                <input
                  type="checkbox"
                  checked={joinDirectory}
                  onChange={(e) => setJoinDirectory(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-copper"
                />
                <span>{L(
                  "eventJoinLabel",
                  "List my card in the participant directory so other attendees can find me."
                )}</span>
              </label>
            </div>
          )}

          {/* Draft autosave — restored-session notice */}
          {draftRestored && (
            <p className="mt-4 flex max-w-xl items-center justify-between gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-ink/75">
              <span>
                {L(
                  "draftRestored",
                  "Your previous draft was restored — continue where you left off."
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  clearDraft();
                  window.location.reload();
                }}
                className="shrink-0 rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-ink/70 hover:border-neutral-400"
              >
                {L("draftDiscard", "Start over")}
              </button>
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] lg:gap-12"
        >
          {/* =====================================================
              LEFT — stepped accordion
              ===================================================== */}
          <div className="min-w-0 space-y-6">
            {/* selected template chip */}
            <div
              key={pulseKey}
              className="flex items-center justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white/85 p-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_32px_-12px_rgba(20,18,15,0.08)] backdrop-blur-sm animate-form-focus-pulse"
            >
              <div className="min-w-0">
                <span className="mono-label text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  {L("selectedTemplate", "Gewähltes Design")}
                </span>
                <p className="mt-1.5 truncate font-serif text-heading-sm text-ink">
                  #{String(selectedTemplate.id).padStart(2, "0")}
                  <span className="text-ink/30"> · </span>
                  {v2Entry?.name ?? selectedTemplate?.name ?? ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("templates")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.dispatchEvent(
                    new CustomEvent("enter-template-selection")
                  );
                }}
                className="shrink-0 rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-bg-1"
              >
                {L("changeTemplate", "Ändern")}
              </button>
            </div>

            {/* step indicator */}
            <StepIndicator
              steps={STEP_ORDER.map((id) => ({
                id,
                label: stepLabel(id, L),
                done: isStepComplete(id, {
                  contactName,
                  contactEmail,
                  contactPhone,
                  cardData,
                  brandPrimaryHex,
                  themeKey,
                  billingMode,
                }),
              }))}
              activeId={openStep}
              onSelect={goToStep}
              indicatorTpl={L("stepIndicator", "Schritt {current} von {total}")}
              activeIndex={stepIndex}
            />

            {/* accordion */}
            <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/95 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(20,18,15,0.18)]">
              <AccordionStep
                id="contact"
                stepNumber={1}
                title={L("step1Title", "Kontakt")}
                summary={summaries.contact}
                open={openStep === "contact"}
                onToggle={(next) => setOpenStep(next ? "contact" : openStep)}
                onNext={() => goToStep("card")}
                nextLabel={L("step1Next", "Weiter zum Karteninhalt")}
              >
                <StepContact
                  L={L}
                  contactName={contactName}
                  setContactName={setContactName}
                  contactEmail={contactEmail}
                  setContactEmail={setContactEmail}
                  contactPhone={contactPhone}
                  setContactPhone={setContactPhone}
                  callMeBack={callMeBack}
                  setCallMeBack={setCallMeBack}
                  fieldErrors={fieldErrors}
                  clearFieldError={clearFieldError}
                />
              </AccordionStep>

              <AccordionStep
                id="card"
                stepNumber={2}
                title={L("step2Title", "Karteninhalt")}
                summary={summaries.card}
                open={openStep === "card"}
                onToggle={(next) => setOpenStep(next ? "card" : openStep)}
                onNext={() => goToStep("branding")}
                nextLabel={L("step2Next", "Weiter zum Branding")}
              >
                {/* Card language — explicit, drives the public card chrome.
                    Changing it also flips the live preview locale. */}
                <div className="mb-4">
                  <CardLanguageSelector
                    value={cardLocale}
                    onChange={(next) => {
                      setCardLocale(next);
                      setPreviewLocale(next);
                    }}
                    L={L}
                  />
                </div>
                <StepCardContent
                  L={L}
                  cardData={cardData}
                  setCard={setCard}
                  setSocial={setSocial}
                  contactName={contactName}
                  contactEmail={contactEmail}
                  contactPhone={contactPhone}
                  fieldErrors={fieldErrors}
                  clearFieldError={clearFieldError}
                  nameRules={v2Entry?.nameRules}
                  photoPath={photoPath}
                  setPhotoPath={setPhotoPath}
                  logoPath={logoPath}
                  setLogoPath={setLogoPath}
                  photoUploading={photoUploading}
                  setPhotoUploading={setPhotoUploading}
                  logoUploading={logoUploading}
                  setLogoUploading={setLogoUploading}
                  handleFileUpload={handleFileUpload}
                  supports={supports}
                  photoPreviewUrl={photoPreviewUrl}
                  setPhotoPreviewUrl={setPhotoPreviewUrl}
                  logoPreviewUrl={logoPreviewUrl}
                  setLogoPreviewUrl={setLogoPreviewUrl}
                  photoUploadError={photoUploadError}
                  setPhotoUploadError={setPhotoUploadError}
                  logoUploadError={logoUploadError}
                  setLogoUploadError={setLogoUploadError}
                  readPreview={readPreview}
                  onEditPhoto={() => setPhotoEditorOpen(true)}
                  onEditLogo={() => setLogoEditorOpen(true)}
                  onClearCard={() => {
                    setCardData(EMPTY_CARD);
                    setPhotoPreviewUrl(null);
                    setLogoPreviewUrl(null);
                  }}
                  templateKey={v2Entry?.key ?? null}
                  cardLocale={cardLocale}
                />
              </AccordionStep>

              <AccordionStep
                id="branding"
                stepNumber={3}
                title={L("step3Title", "Branding")}
                summary={summaries.branding}
                open={openStep === "branding"}
                onToggle={(next) => setOpenStep(next ? "branding" : openStep)}
                onNext={() => goToStep("billing")}
                nextLabel={L("step3Next", "Weiter zur Zahlung")}
              >
                <StepBranding
                  L={L}
                  brandPrimaryHex={brandPrimaryHex}
                  setBrandPrimaryHex={setBrandPrimaryHex}
                  brandAccentHex={brandAccentHex}
                  setBrandAccentHex={setBrandAccentHex}
                  themeKey={themeKey}
                  applyPreset={applyPreset}
                  cardData={cardData}
                  setCard={setCard}
                  supports={supports}
                  templateDefaults={v2Entry?.defaults}
                  onColorsCustomised={() => setColorsCustomised(true)}
                  onColorsReset={() => setColorsCustomised(false)}
                />
              </AccordionStep>

              <AccordionStep
                id="billing"
                stepNumber={4}
                title={L("step4Title", "Zahlung")}
                summary={summaries.billing}
                open={openStep === "billing"}
                onToggle={(next) => setOpenStep(next ? "billing" : openStep)}
                isLast
              >
                <StepBilling
                  L={L}
                  paymentsEnabled={paymentsEnabled}
                  selectedTemplate={selectedTemplate}
                  billingMode={billingMode}
                  setBillingMode={setBillingMode}
                  amountCents={amountCents}
                  formState={formState}
                  errorMsg={errorMsg}
                  desiredSlug={desiredSlug}
                  setDesiredSlug={setDesiredSlug}
                  contactName={contactName}
                />
              </AccordionStep>
            </div>
          </div>

          {/* =====================================================
              RIGHT — sticky live preview (desktop)
              ===================================================== */}
          <aside
            aria-label="Live preview"
            className="hidden lg:block lg:self-start lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
          >
            <div className="mb-3 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
                </span>
                <span className="mono-label text-[10px] uppercase tracking-[0.22em] text-ink/55">
                  {L("previewLiveBadge", "Live-Vorschau")}
                </span>
              </div>
              {/* Phase 7.8 — open the preview at full size */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShareLinkOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-copper/40 bg-copper/10 px-2.5 py-1 text-[10.5px] font-semibold text-ink transition-colors hover:border-copper hover:bg-copper/20"
                  aria-label={L("shareLink", "Önizleme linki paylaş")}
                >
                  <span>{L("shareLink", "Önizleme linki")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFullPreviewOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[10.5px] font-semibold text-ink/70 transition-colors hover:border-copper/50 hover:text-ink"
                  aria-label={L("previewExpand", "Open full preview")}
                >
                  <Maximize2 size={11} aria-hidden />
                  <span>{L("previewExpand", "Vollvorschau")}</span>
                </button>
              </div>
            </div>

            {/* layered frame: outer glow + inner card. Click to expand. */}
            <button
              type="button"
              onClick={() => setFullPreviewOpen(true)}
              className="group relative block w-full text-left"
              aria-label={L("previewExpand", "Open full preview")}
            >
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-copper/25 via-transparent to-copper-300/15 blur-2xl opacity-60 transition-opacity group-hover:opacity-90" />
              <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_30px_80px_-30px_rgba(20,18,15,0.4)] transition-transform group-hover:-translate-y-0.5">
                <div className="pointer-events-none">{previewNode}</div>
                {/* hover hint overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-ink shadow-md">
                    <Maximize2 size={12} />
                    {L("previewExpand", "Vollvorschau öffnen")}
                  </span>
                </div>
              </div>
            </button>

            <p className="mt-3 text-center text-xs italic text-ink/50">
              {L("previewLiveHint", "Aktualisiert sich beim Tippen")}
            </p>
          </aside>
        </form>
      </div>

      {/* =====================================================
          MOBILE — floating preview pill + Radix bottom-sheet
          ===================================================== */}
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-copper/40 bg-neutral-900 px-5 py-3 text-sm font-semibold text-neutral-50 shadow-[0_18px_40px_-12px_rgba(20,18,15,0.45),0_0_24px_-6px_rgba(194,121,64,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98] lg:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <Eye size={16} aria-hidden />
            <span>{L("previewLabelMobile", "Vorschau")}</span>
            <ArrowRight size={14} aria-hidden />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-hidden rounded-t-3xl border-t border-ink/10 bg-bg-0 shadow-[0_-30px_80px_-30px_rgba(20,18,15,0.5)] data-[state=open]:animate-slide-up lg:hidden">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
                </span>
                <Dialog.Title className="font-serif text-heading-sm text-ink">
                  {L("previewSheetTitle", "Live-Vorschau")}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                  aria-label={L("previewSheetClose", "Schließen")}
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(92vh - 4rem)" }}
            >
              <div className="pointer-events-none mx-auto max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_30px_80px_-30px_rgba(20,18,15,0.3)]">
                {previewNode}
              </div>
              <p className="mt-3 text-center text-xs italic text-ink/50">
                {L("previewLiveHint", "Aktualisiert sich beim Tippen")}
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* =====================================================
          DESKTOP / TABLET — full-screen preview modal (Phase 7.8)
          ===================================================== */}
      <Dialog.Root open={fullPreviewOpen} onOpenChange={setFullPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-md data-[state=open]:animate-fade-in" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 inset-y-0 z-50 mx-auto my-4 flex max-w-5xl flex-col overflow-hidden rounded-3xl border border-ink/10 bg-bg-0 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.65)] data-[state=open]:animate-fade-in sm:inset-y-6 sm:my-0"
          >
            {/* Header — title, language switch, close */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white/95 px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <Maximize2 size={16} className="text-copper" />
                <Dialog.Title className="font-serif text-heading-sm text-ink">
                  {v2Entry?.name ?? selectedTemplate?.name ?? "Preview"}
                </Dialog.Title>
                <span className="rounded-full border border-copper/30 bg-copper/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-copper">
                  {L("previewNoPaymentNote", "Preview only")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Language switch */}
                <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-white p-1">
                  <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                    {L("previewLanguage", "Lang")}
                  </span>
                  {(["de", "en", "tr"] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setPreviewLocale(loc)}
                      className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                        previewLocale === loc
                          ? "bg-ink text-white"
                          : "text-ink/55 hover:bg-bg-1 hover:text-ink",
                      ].join(" ")}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label={L("previewClose", "Close preview")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Body — large scrollable preview. overscroll-contain stops the
                wheel from chaining to the page behind the modal. */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-bg-1 to-bg-0 p-6">
              <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_80px_-30px_rgba(20,18,15,0.4)]">
                {previewNode}
              </div>
              <p className="mt-4 text-center text-xs italic text-ink/50">
                {L(
                  "previewNoPaymentNote",
                  "Preview only — no payment required"
                )}
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Phase 7.9 — photo / logo position editor modals */}
      {photoEditorOpen && (photoPreviewUrl || photoPath) && (
        <PhotoEditor
          open={photoEditorOpen}
          onOpenChange={setPhotoEditorOpen}
          kind="photo"
          imageUrl={photoPreviewUrl ?? photoPath ?? ""}
          initialPosition={cardData.photoPosition}
          onSave={(pos) => setCard("photoPosition", pos)}
          labels={{
            title: L("photoEditorTitle", "Profilfoto pozisyonu"),
            subtitle: L(
              "photoEditorSubtitle",
              "Sürükleyerek konumla, yakınlaştırma için kaydırıcıyı kullan."
            ),
            zoom: L("photoEditorZoom", "Yakınlaştırma"),
            reset: L("photoEditorReset", "Sıfırla"),
            save: L("photoEditorSave", "Kaydet"),
            cancel: L("photoEditorCancel", "İptal"),
            hint: L(
              "photoEditorHint",
              "Halka, fotoğrafın görünür merkezini gösterir."
            ),
          }}
        />
      )}
      {logoEditorOpen && (logoPreviewUrl || logoPath) && (
        <PhotoEditor
          open={logoEditorOpen}
          onOpenChange={setLogoEditorOpen}
          kind="logo"
          imageUrl={logoPreviewUrl ?? logoPath ?? ""}
          initialPosition={cardData.logoPosition}
          onSave={(pos) => setCard("logoPosition", pos)}
          labels={{
            title: L("logoEditorTitle", "Logo pozisyonu"),
            subtitle: L(
              "logoEditorSubtitle",
              "Logoyu çerçevesinde tam istediğin yere yerleştir."
            ),
            zoom: L("photoEditorZoom", "Yakınlaştırma"),
            reset: L("photoEditorReset", "Sıfırla"),
            save: L("photoEditorSave", "Kaydet"),
            cancel: L("photoEditorCancel", "İptal"),
            hint: L(
              "photoEditorHint",
              "Halka, fotoğrafın görünür merkezini gösterir."
            ),
          }}
        />
      )}

      {/* Phase 7.9 — share-link modal (URL-hash preview without payment) */}
      {shareLinkOpen && (
        <ShareLinkModal
          open={shareLinkOpen}
          onOpenChange={setShareLinkOpen}
          payload={{
            templateId: selectedTemplate?.id ?? 1,
            cardData: activeCardData,
            photoPath: photoPath ?? undefined,
            logoPath: logoPath ?? undefined,
            brandPrimaryHex: brandPrimaryHex || undefined,
            brandAccentHex: brandAccentHex || undefined,
            locale: previewLocale,
          }}
          L={L}
        />
      )}
    </section>
  );
}

// =============================================================================
// Step labels + completion checks
// =============================================================================

function stepLabel(id: StepId, L: (k: string, f: string) => string): string {
  switch (id) {
    case "contact":
      return L("step1Title", "Kontakt");
    case "card":
      return L("step2Title", "Karteninhalt");
    case "branding":
      return L("step3Title", "Branding");
    case "billing":
      return L("step4Title", "Zahlung");
  }
}

function isStepComplete(
  id: StepId,
  state: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    cardData: CardData;
    brandPrimaryHex: string;
    themeKey: CardThemeKey | undefined;
    billingMode: keyof typeof BillingMode;
  }
): boolean {
  switch (id) {
    case "contact":
      return Boolean(
        state.contactName && state.contactEmail && state.contactPhone
      );
    case "card":
      return Boolean(state.cardData.name);
    case "branding":
      // Optional step — considered "touched" rather than required.
      return Boolean(state.brandPrimaryHex || state.themeKey);
    case "billing":
      return Boolean(state.billingMode);
  }
}

// =============================================================================
// Step indicator (top of the form)
// =============================================================================

function StepIndicator({
  steps,
  activeId,
  onSelect,
  indicatorTpl,
  activeIndex,
}: {
  steps: { id: StepId; label: string; done: boolean }[];
  activeId: StepId;
  onSelect: (id: StepId) => void;
  indicatorTpl: string;
  activeIndex: number;
}) {
  const total = steps.length;
  const text = indicatorTpl
    .replace("{current}", String(activeIndex + 1))
    .replace("{total}", String(total));
  return (
    <div className="rounded-3xl border border-neutral-200/80 bg-white/70 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="mono-label text-[10px] uppercase tracking-[0.22em] text-ink/55">
          {text}
        </span>
        <span className="text-xs text-ink/45">
          {steps.filter((s) => s.done).length}/{total}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {steps.map((s, idx) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className="group flex flex-1 items-center gap-2 text-left"
              aria-label={s.label}
            >
              <span
                className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-neutral-900 text-neutral-50 shadow-[0_4px_12px_-4px_rgba(20,18,15,0.5)]"
                    : s.done
                      ? "bg-copper text-ink"
                      : "border border-ink/20 bg-white text-ink/55"
                }`}
              >
                {s.done && !isActive ? <Check size={12} strokeWidth={3} /> : idx + 1}
              </span>
              <span className="hidden truncate text-xs font-medium text-ink/70 sm:block group-hover:text-ink">
                {s.label}
              </span>
              {idx < total - 1 && (
                <span
                  aria-hidden
                  className={`hidden h-px flex-1 sm:block ${
                    s.done ? "bg-copper/60" : "bg-ink/15"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Accordion primitive — custom (Radix Accordion not in deps).
// =============================================================================

function AccordionStep({
  id,
  stepNumber,
  title,
  summary,
  open,
  onToggle,
  children,
  onNext,
  nextLabel,
  isLast,
}: {
  id: StepId;
  stepNumber: number;
  title: string;
  summary: string;
  open: boolean;
  onToggle: (next: boolean) => void;
  children: ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  isLast?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(open ? "auto" : 0);

  // Smoothly transition height between 0 and content height. Using a fixed
  // pixel measurement keeps the open/close animation snappy without CSS hacks.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      const h = el.scrollHeight;
      setHeight(h);
      // After the transition completes, set to "auto" so internal layout
      // changes (validation messages, image previews) don't get clipped.
      const t = setTimeout(() => setHeight("auto"), 320);
      return () => clearTimeout(t);
    }
    // Snap to current height first, then animate to 0 — required because
    // CSS transitions don't run from `auto`.
    const current = el.scrollHeight;
    setHeight(current);
    requestAnimationFrame(() => setHeight(0));
  }, [open]);

  return (
    <section
      id={`step-${id}`}
      className={`group/step relative ${!isLast ? "border-b border-neutral-200/70" : ""}`}
    >
      <button
        type="button"
        onClick={() => onToggle(!open)}
        aria-expanded={open}
        aria-controls={`step-content-${id}`}
        className={`flex w-full items-center gap-4 px-5 py-5 text-left transition-colors md:px-7 md:py-6 ${
          open ? "bg-bg-1/60" : "hover:bg-bg-1/40"
        }`}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors ${
            open
              ? "bg-neutral-900 text-neutral-50"
              : "border border-ink/15 bg-white text-ink/70"
          }`}
        >
          {stepNumber}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-heading-sm leading-tight text-ink">
            {title}
          </h3>
          {!open && (
            <p className="mt-1 truncate text-sm text-ink/55">{summary}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          aria-hidden
          className={`shrink-0 text-ink/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={`step-content-${id}`}
        role="region"
        aria-labelledby={`step-${id}`}
        style={{
          height: typeof height === "number" ? `${height}px` : "auto",
          transition: "height 280ms cubic-bezier(0.32, 0.72, 0, 1)",
          overflow: "hidden",
        }}
      >
        <div ref={contentRef} className="px-5 pb-7 md:px-7">
          <div className="space-y-6">{children}</div>
          {onNext && (
            <div className="mt-7 flex justify-end border-t border-ink/10 pt-5">
              <button
                type="button"
                onClick={onNext}
                className="group/next inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-50 shadow-[0_4px_12px_-4px_rgba(20,18,15,0.4)] transition-transform hover:scale-[1.015] active:scale-[0.98]"
              >
                <span>{nextLabel}</span>
                <ArrowRight
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover/next:translate-x-0.5"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// STEP 1 — Contact
// =============================================================================

function StepContact({
  L,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  callMeBack,
  setCallMeBack,
  fieldErrors,
  clearFieldError,
}: {
  L: (k: string, f: string) => string;
  contactName: string;
  setContactName: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactPhone: string;
  setContactPhone: (v: string) => void;
  callMeBack: boolean;
  setCallMeBack: (v: boolean) => void;
  fieldErrors: Record<string, string>;
  clearFieldError: (key: string) => void;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="field-contactName"
          label={L("contactName", "Ihr Name") + " *"}
          required
          value={contactName}
          onChange={(e) => {
            setContactName(e.target.value);
            clearFieldError("contactName");
          }}
          error={fieldErrors.contactName}
          placeholder="Anna Fischer"
          autoComplete="name"
        />
        <Input
          id="field-contactEmail"
          type="email"
          label={L("contactEmail", "E-Mail") + " *"}
          required
          value={contactEmail}
          onChange={(e) => {
            setContactEmail(e.target.value);
            clearFieldError("contactEmail");
          }}
          error={fieldErrors.contactEmail}
          placeholder="anna@studio-nord.de"
          autoComplete="email"
        />
      </div>
      <Input
        id="field-contactPhone"
        type="tel"
        label={L("contactPhone", "Telefon") + " *"}
        required
        value={contactPhone}
        onChange={(e) => {
          setContactPhone(e.target.value);
          clearFieldError("contactPhone");
        }}
        error={fieldErrors.contactPhone}
        placeholder="+49 160 1234567"
        autoComplete="tel"
      />
      <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 transition-colors hover:border-ink/30">
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
          <input
            type="checkbox"
            className="peer absolute inset-0 cursor-pointer opacity-0"
            checked={callMeBack}
            onChange={(e) => setCallMeBack(e.target.checked)}
          />
          <span
            className={`absolute inset-0 grid place-items-center rounded-md border transition-colors ${
              callMeBack
                ? "border-copper bg-copper text-ink"
                : "border-ink/25 bg-white"
            }`}
          >
            {callMeBack && <Check size={12} strokeWidth={3} />}
          </span>
        </span>
        <span className="text-sm text-ink">
          <strong className="block font-semibold">
            {L("callMeBack", "Rufen Sie mich an")}
          </strong>
          <span className="mt-0.5 block text-ink/60">
            {L(
              "callMeBackHint",
              "Wir melden uns innerhalb eines Werktags, um Details zu klären."
            )}
          </span>
        </span>
      </label>
    </>
  );
}

// =============================================================================
// STEP 2 — Card content (cardData + uploads + socials)
// =============================================================================

function StepCardContent({
  L,
  cardData,
  setCard,
  setSocial,
  contactName,
  contactEmail,
  contactPhone,
  fieldErrors,
  clearFieldError,
  nameRules,
  photoPath,
  setPhotoPath,
  logoPath,
  setLogoPath,
  photoUploading,
  setPhotoUploading,
  logoUploading,
  setLogoUploading,
  handleFileUpload,
  supports,
  photoPreviewUrl,
  setPhotoPreviewUrl,
  logoPreviewUrl,
  setLogoPreviewUrl,
  photoUploadError,
  setPhotoUploadError,
  logoUploadError,
  setLogoUploadError,
  readPreview,
  onEditPhoto,
  onEditLogo,
  onClearCard,
  templateKey,
  cardLocale,
}: {
  L: (k: string, f: string) => string;
  cardData: CardData;
  setCard: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
  setSocial: (
    key: keyof NonNullable<CardData["socials"]>,
    value: string
  ) => void;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  fieldErrors: Record<string, string>;
  clearFieldError: (key: string) => void;
  nameRules?: TemplateNameRules;
  photoPath: string | null;
  setPhotoPath: (v: string | null) => void;
  logoPath: string | null;
  setLogoPath: (v: string | null) => void;
  photoUploading: boolean;
  setPhotoUploading: (v: boolean) => void;
  logoUploading: boolean;
  setLogoUploading: (v: boolean) => void;
  handleFileUpload: (
    file: File,
    kind: "photo" | "logo"
  ) => Promise<string | null>;
  supports: TemplateSupports;
  photoPreviewUrl: string | null;
  setPhotoPreviewUrl: (v: string | null) => void;
  logoPreviewUrl: string | null;
  setLogoPreviewUrl: (v: string | null) => void;
  photoUploadError: string | null;
  setPhotoUploadError: (v: string | null) => void;
  logoUploadError: string | null;
  setLogoUploadError: (v: string | null) => void;
  readPreview: (file: File) => Promise<string>;
  onEditPhoto: () => void;
  onEditLogo: () => void;
  onClearCard: () => void;
  templateKey: string | null;
  cardLocale: BlockLocale;
}) {
  return (
    <>
      {/* sample-content hint + clear-to-blank */}
      <div className="-mt-1 flex items-center justify-between gap-3 rounded-xl border border-copper/30 bg-copper/[0.06] px-3 py-2">
        <span className="text-[11px] leading-snug text-ink/60">
          {L(
            "sampleHint",
            "Sample content to explore — replace it with your own details.",
          )}
        </span>
        <button
          type="button"
          onClick={onClearCard}
          className="shrink-0 rounded-full border border-ink/15 bg-white px-3 py-1 text-[11px] font-semibold text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
        >
          {L("clearSample", "Clear")}
        </button>
      </div>

      {/* copy-from-contact affordance */}
      {(contactName || contactEmail || contactPhone) && (
        <div className="-mt-1 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!cardData.name && contactName) setCard("name", contactName);
              if (!cardData.email && contactEmail) setCard("email", contactEmail);
              if (!cardData.phone && contactPhone) setCard("phone", contactPhone);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-copper/50 bg-copper/10 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-copper hover:bg-copper/20"
          >
            <span aria-hidden className="text-sm leading-none">
              ↑
            </span>
            {L("copyFromContact", "Von oben übernehmen")}
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Input
            id="field-cardData-name"
            label={L("cardName", "Vor- und Nachname") + " *"}
            value={cardData.name}
            onChange={(e) => {
              setCard("name", e.target.value);
              clearFieldError("cardData.name");
            }}
            error={fieldErrors["cardData.name"]}
            placeholder="Anna Fischer"
          />
          {cardData.name ? (
            <div className="flex items-center gap-2">
              <span
                className="inline-block max-w-full truncate rounded-full border border-copper/30 bg-copper/5 px-3 py-1 text-xs font-medium text-ink"
                style={{
                  textTransform: nameRules?.transform === "uppercase" ? "uppercase" : "none",
                  letterSpacing: nameRules?.transform === "uppercase" ? "0.12em" : "normal",
                }}
              >
                {cardData.name}
              </span>
              {nameRules?.transform === "uppercase" && (
                <span className="mono-label text-[9px] uppercase tracking-wider text-ink/40">
                  {L("namePreviewHint", "Bu şablon isimleri büyük harfle gösterir")}
                </span>
              )}
              {nameRules?.maxDisplayLength && cardData.name.length > nameRules.maxDisplayLength && (
                <span className="mono-label text-[9px] uppercase tracking-wider text-copper">
                  {L("nameTooLong", "Uzun — taşabilir")}
                </span>
              )}
            </div>
          ) : null}
        </div>
        <Input
          id="field-cardData-title"
          label={L("cardTitle", "Titel / Rolle")}
          value={cardData.title ?? ""}
          onChange={(e) => setCard("title", e.target.value)}
          placeholder="Gründerin"
        />
        <Input
          id="field-cardData-company"
          label={L("cardCompany", "Unternehmen")}
          value={cardData.company ?? ""}
          onChange={(e) => setCard("company", e.target.value)}
          placeholder="Studio Nord"
        />
        <Input
          id="field-cardData-website"
          label={L("cardWebsite", "Website")}
          value={cardData.website ?? ""}
          onChange={(e) => {
            setCard("website", e.target.value);
            clearFieldError("cardData.website");
          }}
          error={fieldErrors["cardData.website"]}
          placeholder="https://studio-nord.de"
        />
        <Input
          id="field-cardData-email"
          type="email"
          label={L("cardEmail", "E-Mail (auf Karte)")}
          value={cardData.email ?? ""}
          onChange={(e) => {
            setCard("email", e.target.value);
            clearFieldError("cardData.email");
          }}
          error={fieldErrors["cardData.email"]}
        />
        <Input
          id="field-cardData-phone"
          type="tel"
          label={L("cardPhone", "Telefon (auf Karte)")}
          value={cardData.phone ?? ""}
          onChange={(e) => {
            setCard("phone", e.target.value);
            clearFieldError("cardData.phone");
          }}
          error={fieldErrors["cardData.phone"]}
        />
        <Input
          id="field-cardData-whatsapp"
          type="tel"
          label={L("cardWhatsapp", "WhatsApp")}
          value={cardData.whatsapp ?? ""}
          onChange={(e) => setCard("whatsapp", e.target.value)}
          placeholder="+49 …"
        />
        <Input
          id="field-cardData-address"
          label={L("cardAddress", "Adresse")}
          value={cardData.address ?? ""}
          onChange={(e) => setCard("address", e.target.value)}
        />
      </div>

      <div>
        <Textarea
          label={L("cardBio", "Kurzbeschreibung")}
          value={cardData.bio ?? ""}
          onChange={(e) => setCard("bio", e.target.value)}
          rows={3}
          maxLength={200}
          placeholder={L("cardBioPh", "Ein Satz zu Ihnen / Ihrem Unternehmen.")}
        />
        {/* Phase 7.7 — character counter, turns copper near the limit so the
            customer notices before the input clamps. */}
        <p
          className={[
            "mt-1 text-right text-[11px] mono-label",
            (200 - (cardData.bio?.length ?? 0)) < 20
              ? "text-copper"
              : "text-ink/40",
          ].join(" ")}
        >
          {cardData.bio?.length ?? 0} / 200
        </p>
      </div>

      {/* Tagline + location chip — owner-controlled profile extras (2026-06
          purge of hardcoded template personas). */}
      <ProfileExtrasFields cardData={cardData} setField={setCard} L={L} />

      {/* Stats — the proof-point numbers templates render as stat strips.
          Empty = no stat block on the card. */}
      <div className="space-y-2">
        <p className="text-heading-sm text-ink">
          {L("statsSection", "Stats")}
        </p>
        <p className="-mt-1 text-xs text-ink-300">
          {L(
            "statsHint",
            "Real numbers shown as a stat strip on many designs (e.g. 12 — Years).",
          )}
        </p>
        <StatsEditor
          stats={cardData.stats}
          onStatsChange={(next) => setCard("stats", next)}
          L={L}
        />
      </div>

      {/* Uploads — Phase 7.8: always show BOTH photo + logo so the user can
          tell which is which. If the chosen template doesn't render one, we
          render a muted "n/a" version with an explanation rather than hiding it. */}
      <SubFieldset label={L("uploadSection", "Foto & Logo (optional)")}>
        <div className="grid gap-4 md:grid-cols-2">
          <DragDropZone
            label={L("photoLabel", "Profilfoto")}
            kind="photo"
            current={photoPath}
            previewUrl={photoPreviewUrl}
            uploading={photoUploading}
            uploadError={photoUploadError}
            disabled={!supports.photo}
            disabledReason={L(
              "templateNoPhoto",
              "Dieses Design verwendet kein Foto."
            )}
            onEdit={onEditPhoto}
            positionLabel={formatPositionLabel(cardData.photoPosition)}
            onRemove={() => {
              setPhotoPath(null);
              setPhotoPreviewUrl(null);
              setPhotoUploadError(null);
              setCard("photoPosition", undefined);
            }}
            onFileSelect={async (file) => {
              const allowed = ["image/jpeg", "image/png", "image/webp"];
              if (!allowed.includes(file.type)) {
                setPhotoUploadError(
                  L(
                    "uploadWrongType",
                    "Format nicht unterstützt. Bitte JPG, PNG oder WebP."
                  )
                );
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                setPhotoUploadError(
                  L("uploadTooLarge", "Datei zu groß (max 5 MB).")
                );
                return;
              }
              setPhotoUploadError(null);
              try {
                const preview = await readPreview(file);
                setPhotoPreviewUrl(preview);
              } catch {
                /* preview is optional, never block the real upload */
              }
              setPhotoUploading(true);
              const path = await handleFileUpload(file, "photo");
              if (path) setPhotoPath(path);
              setPhotoUploading(false);
            }}
            L={L}
          />
          <DragDropZone
            label={L("logoLabel", "Logo")}
            kind="logo"
            current={logoPath}
            previewUrl={logoPreviewUrl}
            uploading={logoUploading}
            uploadError={logoUploadError}
            /* Logo is wrapper-guaranteed: templates without a native logo get
               the universal LogoBlock strip above the card, so the upload is
               always meaningful — never disable it. */
            disabled={false}
            disabledReason={L(
              "templateNoLogo",
              "Dieses Design verwendet kein Logo."
            )}
            onEdit={onEditLogo}
            positionLabel={formatPositionLabel(cardData.logoPosition)}
            onRemove={() => {
              setLogoPath(null);
              setLogoPreviewUrl(null);
              setLogoUploadError(null);
              setCard("logoPosition", undefined);
            }}
            onFileSelect={async (file) => {
              const allowed = ["image/jpeg", "image/png", "image/webp"];
              if (!allowed.includes(file.type)) {
                setLogoUploadError(
                  L(
                    "uploadWrongType",
                    "Format nicht unterstützt. Bitte JPG, PNG oder WebP."
                  )
                );
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                setLogoUploadError(
                  L("uploadTooLarge", "Datei zu groß (max 5 MB).")
                );
                return;
              }
              setLogoUploadError(null);
              try {
                const preview = await readPreview(file);
                setLogoPreviewUrl(preview);
              } catch {
                /* preview is optional, never block the real upload */
              }
              setLogoUploading(true);
              const path = await handleFileUpload(file, "logo");
              if (path) setLogoPath(path);
              setLogoUploading(false);
            }}
            L={L}
          />
        </div>
      </SubFieldset>

      {/* Socials — only when supported */}
      {supports.socials && (
        <SubFieldset label={L("socialSection", "Social Links (optional)")}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="LinkedIn"
              value={cardData.socials?.linkedin ?? ""}
              onChange={(e) => setSocial("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
            <Input
              label="Instagram"
              value={cardData.socials?.instagram ?? ""}
              onChange={(e) => setSocial("instagram", e.target.value)}
              placeholder="https://instagram.com/…"
            />
            <Input
              label="X (Twitter)"
              value={cardData.socials?.x ?? ""}
              onChange={(e) => setSocial("x", e.target.value)}
            />
            <Input
              label="TikTok"
              value={cardData.socials?.tiktok ?? ""}
              onChange={(e) => setSocial("tiktok", e.target.value)}
            />
            <Input
              label="YouTube"
              value={cardData.socials?.youtube ?? ""}
              onChange={(e) => setSocial("youtube", e.target.value)}
            />
            <Input
              label="GitHub"
              value={cardData.socials?.github ?? ""}
              onChange={(e) => setSocial("github", e.target.value)}
            />
          </div>
        </SubFieldset>
      )}

      {/* Phase 7.9 — Custom Sections editor (up to 6 free-form sections) */}
      <SubFieldset
        label={L("customSectionsSection", "Özel bölümler (opsiyonel)")}
        hint={L(
          "customSectionsHint",
          "En fazla 6 bölüm ekleyebilirsin — ödüller, diller, ne istersen."
        )}
      >
        <CustomSectionsEditor
          cardData={cardData}
          setCard={setCard}
          L={L}
          handleFileUpload={handleFileUpload}
        />
      </SubFieldset>

      {/* Editable section labels — rename any heading the template renders. */}
      <SubFieldset
        label={L("labelsSection", "Section labels (optional)")}
        hint={L(
          "labelsHint",
          "Rename any heading on your card. Leave blank to keep the template default.",
        )}
      >
        <SectionLabelsEditor
          templateKey={templateKey}
          locale={cardLocale}
          labels={cardData.labels}
          onChange={(next) => setCard("labels", next)}
        />
      </SubFieldset>
    </>
  );
}

// =============================================================================
// STEP 3 — Branding (theme picker + colors + design notes)
// =============================================================================

function StepBranding({
  L,
  brandPrimaryHex,
  setBrandPrimaryHex,
  brandAccentHex,
  setBrandAccentHex,
  themeKey,
  applyPreset,
  cardData,
  setCard,
  supports,
  templateDefaults,
  onColorsCustomised,
  onColorsReset,
}: {
  L: (k: string, f: string) => string;
  brandPrimaryHex: string;
  setBrandPrimaryHex: (v: string) => void;
  brandAccentHex: string;
  setBrandAccentHex: (v: string) => void;
  themeKey: CardThemeKey | undefined;
  applyPreset: (preset: CardThemePreset | null) => void;
  cardData: CardData;
  setCard: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
  supports: TemplateSupports;
  templateDefaults: { brandPrimaryHex: string; brandAccentHex: string } | undefined;
  onColorsCustomised: () => void;
  onColorsReset: () => void;
}) {
  return (
    <>
      {/* Theme picker — only when supported by the chosen template */}
      {supports.themeSwitch && (
        <SubFieldset
          label={L("themeSection", "Stilvorlage (optional)")}
          hint={L(
            "themeSectionHint",
            "Wählen Sie eine vordefinierte Stimmung — Farben, Typografie und Akzente werden im Vorschaufenster sofort angepasst."
          )}
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {CARD_THEME_LIST.map((preset) => (
              <PresetTile
                key={preset.key}
                preset={preset}
                active={themeKey === preset.key}
                onClick={() => applyPreset(preset)}
              />
            ))}
            <PresetTile
              preset={null}
              active={themeKey === undefined}
              onClick={() => applyPreset(null)}
              customLabel={L("themeCustom", "Eigener Stil")}
              customDescription={L(
                "themeCustomHint",
                "Eigene Farben ohne vordefiniertes Theme."
              )}
            />
          </div>
        </SubFieldset>
      )}

      {/* Brand colors */}
      <SubFieldset label={L("brandSection", "Markenfarben (optional)")}>
        <div className="grid gap-4 md:grid-cols-2">
          <ColorField
            label={L("primaryColor", "Primärfarbe")}
            value={brandPrimaryHex}
            onChange={(v) => {
              setBrandPrimaryHex(v);
              onColorsCustomised();
            }}
          />
          <ColorField
            label={L("accentColor", "Akzentfarbe")}
            value={brandAccentHex}
            onChange={(v) => {
              setBrandAccentHex(v);
              onColorsCustomised();
            }}
          />
        </div>
        {templateDefaults && (
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-4 w-4 rounded-full border border-line-soft"
                style={{ background: templateDefaults.brandPrimaryHex }}
                aria-hidden
              />
              <span
                className="inline-block h-4 w-4 rounded-full border border-line-soft"
                style={{ background: templateDefaults.brandAccentHex }}
                aria-hidden
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setBrandPrimaryHex(templateDefaults.brandPrimaryHex);
                setBrandAccentHex(templateDefaults.brandAccentHex);
                onColorsReset();
              }}
              className="text-xs text-ink/50 underline-offset-2 hover:text-ink hover:underline"
            >
              {L("resetColors", "Reset to template defaults")}
            </button>
          </div>
        )}
      </SubFieldset>

      {/* Phase 7.9 — Typography preset picker. The customer can override the
          template's built-in fonts with one of four curated pairings. */}
      <SubFieldset
        label={L("typographySection", "Tipografi (opsiyonel)")}
        hint={L(
          "typographyHint",
          "Şablonun fontlarını değiştirir. Şablon varsayılanı seçili kalırsa şablonun kendi fontları kullanılır."
        )}
      >
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {TYPOGRAPHY_PRESET_LIST.map((preset) => {
            const active =
              (cardData.typographyPreset ?? "default") === preset.key;
            const labelKey = `typography${
              preset.key.charAt(0).toUpperCase() + preset.key.slice(1)
            }Label`;
            const descKey = `typography${
              preset.key.charAt(0).toUpperCase() + preset.key.slice(1)
            }Desc`;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() =>
                  setCard(
                    "typographyPreset",
                    preset.key === "default" ? undefined : preset.key
                  )
                }
                className={[
                  "group relative flex flex-col items-start gap-2 rounded-2xl border bg-white p-3.5 text-left transition-all",
                  active
                    ? "border-copper bg-copper/5 ring-2 ring-copper/30"
                    : "border-line hover:border-copper/40 hover:bg-bg-1",
                ].join(" ")}
              >
                <span
                  className="leading-none text-3xl text-ink"
                  style={{
                    fontFamily:
                      preset.displayFamily ||
                      "Geist, Inter, system-ui, sans-serif",
                  }}
                >
                  {preset.sample}
                </span>
                <span className="block text-xs font-semibold text-ink">
                  {L(labelKey, preset.label)}
                </span>
                <span className="block text-[10.5px] leading-snug text-ink/55">
                  {L(descKey, preset.description)}
                </span>
                {active && (
                  <span className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-copper text-white">
                    <Check size={9} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </SubFieldset>

      <Textarea
        label={L("designNotes", "Anmerkungen zum Design (optional)")}
        value={cardData.designNotes ?? ""}
        onChange={(e) => setCard("designNotes", e.target.value)}
        rows={3}
        placeholder={L(
          "designNotesPh",
          "Haben Sie besondere Wünsche? Schriften, Logos, Beispiele …"
        )}
      />
    </>
  );
}

// =============================================================================
// STEP 4 — Billing + submit
// =============================================================================

function StepBilling({
  L,
  paymentsEnabled,
  selectedTemplate,
  billingMode,
  setBillingMode,
  amountCents,
  formState,
  errorMsg,
  desiredSlug,
  setDesiredSlug,
  contactName,
}: {
  L: (k: string, f: string) => string;
  paymentsEnabled: boolean;
  selectedTemplate: import("@/config/card-templates").CardTemplateDef;
  billingMode: keyof typeof BillingMode;
  setBillingMode: (m: keyof typeof BillingMode) => void;
  amountCents: number;
  formState: FormState;
  errorMsg: string | null;
  desiredSlug: string;
  setDesiredSlug: (v: string) => void;
  contactName: string;
}) {
  return (
    <>
      <SubFieldset
        label={L("slugSection", "Kart adresi")}
        hint={L(
          "slugHint",
          "Kartının URL'i. Boş bırakırsan ad-soyaddan otomatik üretilir.",
        )}
      >
        <SlugField
          L={L}
          value={desiredSlug}
          onChange={setDesiredSlug}
          contactName={contactName}
        />
      </SubFieldset>

      {/* all_free mode: the only tier is FREE — skip the picker entirely so
          the step reads as a confirmation, not a (single-choice) decision. */}
      {paymentsEnabled && (
        <SubFieldset label={L("billingSection", "Zahlungsmodell")}>
          <div className="grid gap-3 md:grid-cols-3">
            {/* FREE tier — always shown first, instant publish, no payment */}
            <BillingTile
              active={billingMode === "FREE"}
              onClick={() => setBillingMode("FREE")}
              label={L("billingFree", "Kostenlos")}
              badge={L("billingFreeNew", "Neu")}
              priceLabel={L("billingFreePrice", "€0 — sofort live")}
              footer={L(
                "billingFreeFooter",
                "Kein Kreditkarte. Direkt starten."
              )}
            />
            {selectedTemplate.monthlyCents ? (
              <BillingTile
                active={billingMode === "MONTHLY"}
                onClick={() => setBillingMode("MONTHLY")}
                label={L("billingMonthly", "Monatlich")}
                priceLabel={`${formatEuro(selectedTemplate.monthlyCents)}/Mon.`}
                footer={L(
                  "monthlyFooter",
                  "Niedrige Einstiegshürde. Jederzeit kündbar."
                )}
              />
            ) : null}
            {selectedTemplate.yearlyCents ? (
              <BillingTile
                active={billingMode === "YEARLY"}
                onClick={() => setBillingMode("YEARLY")}
                label={L("billingYearly", "Jährlich")}
                badge={L("billingBestValue", "Beste Wahl")}
                priceLabel={`${formatEuro(selectedTemplate.yearlyCents)}/Jahr`}
                footer={L(
                  "yearlyFooter",
                  "~35 % Ersparnis vs. monatlich. Revisionen inkl."
                )}
              />
            ) : null}
            <BillingTile
              active={billingMode === "ONE_TIME"}
              onClick={() => setBillingMode("ONE_TIME")}
              label={L("billingOneTime", "Einmalzahlung")}
              priceLabel={formatEuro(selectedTemplate.oneTimeCents)}
              footer={L(
                "oneTimeFooter",
                "Lebenslang gehostet. Keine Verlängerung."
              )}
            />
          </div>
        </SubFieldset>
      )}

      {errorMsg && (
        <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm text-brand">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* total + submit */}
      {billingMode === "FREE" ? (
        <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-copper/30 bg-copper/8 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="mono-label text-[10px] uppercase tracking-[0.2em] text-ink/50">
              {L("freeTierLabel", "Kostenlos starten")}
            </p>
            <p className="mt-1 text-sm text-ink/70">
              {L("freeTierHint", "Kein Kreditkarte erforderlich. Karte wird sofort veröffentlicht.")}
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-copper px-6 py-3 text-base font-semibold text-ink shadow-[0_8px_24px_-8px_rgba(194,121,64,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={formState === "submitting"}
          >
            {formState === "submitting" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            <span>
              {formState === "submitting"
                ? L("submitting", "Wird verarbeitet …")
                : L("freeTierSubmit", "Karte kostenlos erstellen →")}
            </span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-ink/15 bg-neutral-900 p-5 text-neutral-50 sm:flex-row sm:items-center">
          <div>
            <p className="mono-label text-[10px] uppercase tracking-[0.2em] text-neutral-50/60">
              {L("totalLabel", "Zu zahlen")}
            </p>
            <p className="mt-1 font-serif text-heading text-neutral-50">
              {formatEuro(amountCents)}
              <span className="text-neutral-50/55">
                {billingMode === "MONTHLY"
                  ? " / Mon."
                  : billingMode === "YEARLY"
                    ? " / Jahr"
                    : ""}
              </span>
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-copper px-6 py-3 text-base font-semibold text-ink shadow-[0_8px_24px_-8px_rgba(194,121,64,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={formState === "submitting"}
          >
            {formState === "submitting" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Lock size={14} aria-hidden />
            )}
            <span>
              {formState === "submitting"
                ? L("submitting", "Wird verarbeitet …")
                : L("submitLabel", "Bezahlen & Karte veröffentlichen")}
            </span>
          </button>
        </div>
      )}
    </>
  );
}

// =============================================================================
// SlugField — Phase 8 customer-chosen card URL with debounced availability
// check. Empty input is valid (server falls back to `name-xxxx`); a typed
// value is validated for format + uniqueness via /api/orders/slug-available.
// =============================================================================

type SlugStatus =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "available"; slug: string }
  | { kind: "taken" }
  | { kind: "invalid"; reason: string }
  | { kind: "error" };

function SlugField({
  L,
  value,
  onChange,
  contactName,
}: {
  L: (k: string, f: string) => string;
  value: string;
  onChange: (v: string) => void;
  contactName: string;
}) {
  const [status, setStatus] = useState<SlugStatus>({ kind: "idle" });

  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      setStatus({ kind: "idle" });
      return;
    }
    setStatus({ kind: "checking" });
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/orders/slug-available?s=${encodeURIComponent(trimmed)}`,
          { cache: "no-store" },
        );
        const body = (await res.json()) as
          | { ok: true; slug: string; available: boolean }
          | { ok: false; reason: string };
        if (!body.ok) {
          setStatus({ kind: "invalid", reason: body.reason });
          return;
        }
        setStatus(
          body.available
            ? { kind: "available", slug: body.slug }
            : { kind: "taken" },
        );
      } catch {
        setStatus({ kind: "error" });
      }
    }, 500);
    return () => clearTimeout(handle);
  }, [value]);

  const previewBase =
    contactName
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "card";

  return (
    <div className="space-y-1.5">
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-ink/15 bg-bg-2 focus-within:border-copper">
        <span className="flex items-center px-3 text-xs text-ink/55">
          opsolid.de/c/
        </span>
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          placeholder={previewBase}
          className="flex-1 bg-transparent px-2 py-2.5 text-sm text-ink placeholder-ink/40 focus:outline-none"
          maxLength={40}
        />
      </div>
      <p
        className={cn(
          "text-[11px]",
          status.kind === "available" && "text-signal-ok",
          status.kind === "taken" && "text-signal-err",
          status.kind === "invalid" && "text-signal-err",
          status.kind === "error" && "text-signal-warn",
          (status.kind === "idle" || status.kind === "checking") &&
            "text-ink/45",
        )}
      >
        {status.kind === "idle" &&
          L(
            "slugIdle",
            "Boş bırakılırsa otomatik atanır",
          ) +
            ` · opsolid.de/c/${previewBase}-xxxx`}
        {status.kind === "checking" && L("slugChecking", "Kontrol ediliyor…")}
        {status.kind === "available" &&
          L("slugAvailable", "Müsait") + ` · opsolid.de/c/${status.slug}`}
        {status.kind === "taken" && L("slugTaken", "Bu adres alınmış")}
        {status.kind === "invalid" &&
          (status.reason === "too_short"
            ? L("slugTooShort", "En az 3 karakter olmalı")
            : status.reason === "too_long"
              ? L("slugTooLong", "En fazla 40 karakter olabilir")
              : status.reason === "reserved"
                ? L("slugReserved", "Bu adres rezerve")
                : L(
                    "slugInvalid",
                    "Sadece küçük harf, rakam ve tire — başta/sonda tire olmaz",
                  ))}
        {status.kind === "error" && L("slugCheckError", "Kontrol başarısız")}
      </p>
    </div>
  );
}

function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

// =============================================================================
// Sub-fieldset — visual grouping inside an open accordion step.
// =============================================================================

function SubFieldset({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mono-label text-[11px] uppercase tracking-[0.18em] text-ink/55">
        {label}
      </legend>
      {hint && <p className="-mt-1 max-w-xl text-xs text-ink/55">{hint}</p>}
      {children}
    </fieldset>
  );
}

// =============================================================================
// Drag-and-drop upload zone (Phase 7.7) — replaces UploadTile in StepCardContent.
//
// Adds drag-over visual feedback, instant data-URL preview on the parent (so
// the live preview reflects the pick before the upload settles), inline error
// surface for wrong formats, and a clearer "Remove" affordance once a file
// has been uploaded.
// =============================================================================

function DragDropZone({
  label,
  kind,
  current,
  previewUrl,
  uploading,
  uploadError,
  onFileSelect,
  onRemove,
  onEdit,
  positionLabel,
  L,
  disabled = false,
  disabledReason,
}: {
  label: string;
  kind: "photo" | "logo";
  current: string | null;
  previewUrl: string | null;
  uploading: boolean;
  uploadError: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  /** Phase 7.9 — opens the PhotoEditor modal. Only shown when an image is set. */
  onEdit?: () => void;
  /** Optional small caption beside Edit ("Center · 1.0×"). */
  positionLabel?: string;
  L: (k: string, f: string) => string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  // Resolve whatever we want to render right now:
  //   1. local data-URL preview (instant, not yet persisted) wins
  //   2. then the persisted server path
  const displayed = (() => {
    if (previewUrl) return previewUrl;
    if (!current) return null;
    if (current.startsWith("data:") || current.startsWith("blob:")) return current;
    if (current.startsWith("http") || current.startsWith("/")) return current;
    return `/${current}`;
  })();

  // Phase 7.8 — when the chosen template doesn't render this asset, we still
  // show the field (so the user knows which is which) but visually mute it
  // and explain why it's unavailable.
  if (disabled) {
    return (
      <div className="relative opacity-60">
        <div className="mb-1.5 flex items-center gap-1.5">
          <p className="text-xs font-medium text-ink/70">{label}</p>
          <span className="rounded-full border border-line-soft bg-bg-1 px-1.5 py-[1px] text-[9px] uppercase tracking-wider text-ink/45">
            n/a
          </span>
        </div>
        <div className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-bg-1 px-4 py-5">
          {kind === "photo" ? (
            <Camera size={22} className="text-ink/20" />
          ) : (
            <Building2 size={22} className="text-ink/20" />
          )}
          <span className="text-center text-xs font-medium text-ink/45">
            {disabledReason ??
              L("templateNoAsset", "Dieses Design verwendet dieses Element nicht.")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="mb-1.5 text-xs font-medium text-ink/70">{label}</p>
      {displayed ? (
        <div className="relative flex items-center gap-3 rounded-2xl border border-line bg-bg-1 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayed}
            alt=""
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink/60">
              {uploading
                ? L("uploading", "Wird hochgeladen…")
                : L("uploadDone", "Hochgeladen")}
            </p>
            {/* Phase 7.9 — show edit button + position summary inline */}
            {onEdit && !uploading && (
              <button
                type="button"
                onClick={onEdit}
                className="mt-1 inline-flex items-center gap-1 rounded-full border border-copper/40 bg-copper/10 px-2 py-0.5 text-[10px] font-semibold text-ink transition-colors hover:border-copper hover:bg-copper/20"
              >
                {L("editPosition", "Pozisyonu düzenle")}
                {positionLabel && (
                  <span className="font-mono text-[9px] text-ink/55">
                    · {positionLabel}
                  </span>
                )}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={L("uploadRemove", "Remove")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink/50 transition-colors hover:border-line-firm hover:text-ink"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) onFileSelect(file);
          }}
          className={[
            "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-5 transition-colors",
            dragging
              ? "border-copper bg-copper/5"
              : "border-line bg-bg-0 hover:border-copper/50 hover:bg-bg-1",
          ].join(" ")}
        >
          {kind === "photo" ? (
            <Camera size={22} className="text-ink/30" />
          ) : (
            <Building2 size={22} className="text-ink/30" />
          )}
          <span className="text-xs font-medium text-ink/60">
            {L("dragHere", "Drag here or click to upload")}
          </span>
          <span className="text-[10px] text-ink/40">
            {L("uploadHint", "JPG, PNG, WebP · max 5 MB")}
          </span>
        </button>
      )}
      {uploadError && (
        <p className="mt-1.5 text-[11px] text-signal-err">{uploadError}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// =============================================================================
// Color field
// =============================================================================

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-ink">{label}</label>
      <div className="flex items-center gap-2">
        <span className="relative inline-flex h-12 w-16 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <input
            type="color"
            value={value || "#0A0A0A"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0"
          />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0A0A0A"
          className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 font-mono text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}

// =============================================================================
// Theme preset tile
// =============================================================================

function PresetTile({
  preset,
  active,
  onClick,
  customLabel,
  customDescription,
}: {
  preset: CardThemePreset | null;
  active: boolean;
  onClick: () => void;
  customLabel?: string;
  customDescription?: string;
}) {
  const label = preset ? preset.label : customLabel ?? "Custom";
  const description = preset ? preset.description : customDescription ?? "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-ink bg-white shadow-[0_8px_24px_-12px_rgba(20,18,15,0.3)]"
          : "border-neutral-200 bg-white hover:border-ink/40 hover:shadow-[0_4px_12px_-6px_rgba(20,18,15,0.15)]"
      }`}
    >
      {active && (
        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-copper text-ink">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
      {preset ? (
        <div className="mb-3 flex gap-1.5">
          <span
            className="h-5 w-5 rounded-full ring-1 ring-black/10"
            style={{ background: preset.primaryHex }}
          />
          <span
            className="h-5 w-5 rounded-full ring-1 ring-black/10"
            style={{ background: preset.accentHex }}
          />
        </div>
      ) : (
        <div className="mb-3 flex gap-1.5">
          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-400 ring-1 ring-black/10" />
        </div>
      )}
      <span className="block text-sm font-semibold text-ink">{label}</span>
      {description && (
        <span className="mt-1 block text-xs leading-snug text-ink/55">
          {description}
        </span>
      )}
    </button>
  );
}

// =============================================================================
// Billing tile
// =============================================================================

function BillingTile({
  active,
  onClick,
  label,
  badge,
  priceLabel,
  footer,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: string;
  priceLabel: string;
  footer: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-2xl border p-5 text-left transition-all ${
        active
          ? "border-ink bg-white shadow-[0_8px_24px_-12px_rgba(20,18,15,0.35)]"
          : "border-neutral-200 bg-white hover:border-ink/40 hover:shadow-[0_4px_12px_-6px_rgba(20,18,15,0.12)]"
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-copper px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
          {badge}
        </span>
      )}
      {active && (
        <span className="absolute left-4 top-4 grid h-5 w-5 place-items-center rounded-full bg-neutral-900 text-neutral-50">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
      <span className="block font-serif text-heading-sm text-ink">{label}</span>
      <span className="mt-1 block font-serif text-2xl font-semibold text-ink">
        {priceLabel}
      </span>
      <span className="mt-2 block text-xs text-ink/60">{footer}</span>
    </button>
  );
}

// =============================================================================
// Live preview — registry-resolved component, fallback to SmartCard.
// =============================================================================

/**
 * Resolves the v2 registry component for the chosen template id and renders
 * it with identical props to `/c/[slug]/page.tsx`. Falls back to SmartCard
 * for unmapped ids so the preview always has *something* on screen.
 */
function LivePreview({
  templateId,
  slug,
  cardData,
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  locale,
}: {
  templateId: number;
  slug: string;
  cardData: CardData;
  photoPath: string | null;
  logoPath: string | null;
  brandPrimaryHex?: string;
  brandAccentHex?: string;
  locale: "de" | "en" | "tr";
}) {
  const entry = getTemplateEntry(templateId);
  const Template = entry?.Component ?? SmartCard;
  // Compute siteUrl on the client only — `window` doesn't exist during SSR
  // for this client component's first paint, so we lazily resolve once.
  const [siteUrl, setSiteUrl] = useState("https://opsolid.de");
  useEffect(() => {
    if (typeof window !== "undefined") setSiteUrl(window.location.origin);
  }, []);

  // Phase 7.9 — wire up image position + typography preset CSS variables.
  // Templates with `.tpl-photo` / `.tpl-logo` on their <img> elements pick
  // these up automatically; templates that opt-in to `--tpl-font-display` /
  // `--tpl-font-body` for typography overrides do the same.
  const photoPos = cardData.photoPosition;
  const logoPos = cardData.logoPosition;
  const tpKey = cardData.typographyPreset;
  const wrapperStyle: React.CSSProperties = {
    "--tpl-photo-x": `${photoPos?.x ?? 50}%`,
    "--tpl-photo-y": `${photoPos?.y ?? 50}%`,
    "--tpl-photo-scale": String(photoPos?.scale ?? 1),
    "--tpl-logo-x": `${logoPos?.x ?? 50}%`,
    "--tpl-logo-y": `${logoPos?.y ?? 50}%`,
    "--tpl-logo-scale": String(logoPos?.scale ?? 1),
  } as React.CSSProperties;
  if (tpKey && tpKey !== "default") {
    // Lazy import via a synchronous lookup; the file is tiny (<2KB).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getTypographyPreset } = require("@/lib/typographyPresets") as {
      getTypographyPreset: typeof import("@/lib/typographyPresets").getTypographyPreset;
    };
    const preset = getTypographyPreset(tpKey);
    if (preset.displayFamily) {
      (wrapperStyle as Record<string, string>)["--tpl-font-display"] =
        preset.displayFamily;
    }
    if (preset.bodyFamily) {
      (wrapperStyle as Record<string, string>)["--tpl-font-body"] =
        preset.bodyFamily;
    }
  }

  // Phase 7.9 — dark templates need the white-on-dark variant for the custom
  // sections block so the eyebrow + body text stays readable.
  const isDarkTemplate = entry
    ? ["barber", "developer", "music-producer", "studio", "tech-startup"].includes(
        entry.key
      )
    : false;

  return (
    <div data-card-tpl style={wrapperStyle}>
      {/* Mirror the public card exactly: wrap the template in the universal
          block stack so logo, bio, stats, gallery, FAQ, testimonials,
          brochure, custom sections, buttons & video render live in the
          preview too (preview mode skips iframes / tip-jar / contact form).
          Without this the preview dropped every wrapper-rendered field —
          most visibly on the blank template, which delegates nearly
          everything to these blocks. */}
      <UniversalBlocks
        mode="preview"
        data={cardData}
        entryKey={entry?.key ?? null}
        logoPath={logoPath}
        tone={isDarkTemplate ? "dark" : "light"}
        primaryHex={brandPrimaryHex}
        accentHex={brandAccentHex}
        locale={locale}
      >
        <Template
          slug={slug}
          cardData={cardData}
          photoPath={photoPath}
          logoPath={logoPath}
          brandPrimaryHex={brandPrimaryHex}
          brandAccentHex={brandAccentHex}
          siteUrl={siteUrl}
          locale={locale}
        />
      </UniversalBlocks>
    </div>
  );
}

// =============================================================================
// Phase 7.9 — Share-link modal: encode the live form state as a URL hash so the
// customer can share a "preview link" *before* paying. The /c/preview/[token]
// page reads the same hash and renders an identical card.
// =============================================================================

interface SharePayload {
  templateId: number;
  cardData: CardData;
  photoPath?: string;
  logoPath?: string;
  brandPrimaryHex?: string;
  brandAccentHex?: string;
  locale: "de" | "en" | "tr";
}

function encodeSharePayload(p: SharePayload): string {
  // We use base64url so the result is safe to drop straight into a URL hash
  // (no '+', '/', '=' that browsers / chat apps tend to mangle).
  const json = JSON.stringify(p);
  // btoa needs latin-1; encode UTF-8 first via TextEncoder + manual base64.
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function ShareLinkModal({
  open,
  onOpenChange,
  payload,
  L,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: SharePayload;
  L: (k: string, f: string) => string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://opsolid.de";
    const hash = encodeSharePayload(payload);
    setShareUrl(`${origin}/${payload.locale}/c/preview#d=${hash}`);
    setCopied(false);
  }, [open, payload]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback — select the input so the customer can copy manually.
      const el = document.getElementById("share-link-input") as HTMLInputElement | null;
      el?.select();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-neutral-950/70 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[min(94vw,540px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-ink/10 bg-bg-0 shadow-[0_30px_80px_-20px_rgba(20,18,15,0.5)]">
          <div className="flex items-start justify-between border-b border-ink/10 px-6 py-5">
            <div>
              <Dialog.Title className="font-serif text-heading-sm text-ink">
                {L("shareLinkTitle", "Önizleme linkini paylaş")}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-ink/55">
                {L(
                  "shareLinkSubtitle",
                  "Kartını ödeme yapmadan başkalarına gönder. Bağlantıdaki veriler 30 gün boyunca okunabilir."
                )}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full border border-ink/15 bg-white p-2 text-ink/60 transition-colors hover:border-ink/40 hover:text-ink"
                aria-label={L("photoEditorCancel", "Schließen")}
              >
                <X size={14} />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-6 py-5">
            <label
              htmlFor="share-link-input"
              className="mono-label block text-[10px] uppercase tracking-[0.2em] text-ink/55"
            >
              {L("shareLinkUrl", "Link")}
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="share-link-input"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 font-mono text-[11px] text-ink/80 focus:border-copper focus:outline-none"
              />
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-50 shadow-[0_4px_12px_-4px_rgba(20,18,15,0.4)] transition-transform hover:scale-[1.02]"
              >
                {copied
                  ? L("shareLinkCopied", "Kopyalandı ✓")
                  : L("shareLinkCopy", "Kopyala")}
              </button>
            </div>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-copper underline-offset-4 hover:underline"
            >
              {L("shareLinkOpen", "Yeni sekmede aç")}
              <ArrowRight size={11} />
            </a>

            <p className="mt-4 rounded-xl border border-line-soft bg-bg-1/60 px-3 py-2.5 text-[11px] italic text-ink/55">
              {L(
                "shareLinkNote",
                "Bağlantı tüm form bilgilerini içerir; ödeme yapana kadar kart yayında değildir."
              )}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
