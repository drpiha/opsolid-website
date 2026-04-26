"use client";

import { useMemo, useState } from "react";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import type { z } from "zod";
import { Input, Textarea } from "@/components/ui/Input";
import { useLocale } from "@/context/LocaleContext";
import {
  cardTemplates,
  formatEuro,
  getTemplateById,
} from "@/config/card-templates";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import { OrderPayloadSchema, BillingMode } from "@/lib/validation";
import type { CardData } from "@/lib/validation";
import {
  CARD_THEME_LIST,
  type CardThemeKey,
  type CardThemePreset,
} from "@/lib/cardThemes";

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

type FormState = "idle" | "submitting" | "error";

interface Props {
  selectedTemplateId: number | null;
  // Reserved for future template-change affordances inside the form.
  onTemplateChange: (id: number) => void;
}

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

export function OrderFormSection({ selectedTemplateId }: Props) {
  const { locale, t } = useLocale();
  const order = t.products.digitalCard.order ?? {};
  const L = (key: string, fallback: string) =>
    (order.form && (order.form as Record<string, string>)[key]) || fallback;

  const [cardData, setCardData] = useState<CardData>(EMPTY_CARD);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [callMeBack, setCallMeBack] = useState(false);
  const [brandPrimaryHex, setBrandPrimaryHex] = useState("");
  const [brandAccentHex, setBrandAccentHex] = useState("");
  // Style preset — "Aurora" / "Editorial" / "Cinema" (or undefined = Custom).
  // The preset CSS-only differentiates the rendered card via `data-theme` on
  // the SmartCard root. `layoutKey` is recorded for forward-compat; the
  // current renderer ignores it.
  const [themeKey, setThemeKey] = useState<CardThemeKey | undefined>(undefined);
  const [layoutKey, setLayoutKey] = useState<string | undefined>(undefined);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [billingMode, setBillingMode] =
    useState<keyof typeof BillingMode>("YEARLY");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const activeCardData: CardData = useMemo(() => {
    const display: CardData = {
      ...cardData,
      name: cardData.name || contactName || "Ihr Name",
      phone: cardData.phone || contactPhone || undefined,
      email: cardData.email || contactEmail || undefined,
    };
    return display;
  }, [cardData, contactName, contactPhone, contactEmail]);

  const amountCents = useMemo(() => {
    if (!selectedTemplate) return 0;
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
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    const res = await fetch("/api/uploads", { method: "POST", body: form });
    if (!res.ok) {
      setErrorMsg(L("uploadFailed", "Upload fehlgeschlagen."));
      return null;
    }
    const json = (await res.json()) as { path?: string; error?: string };
    return json.path ?? null;
  };

  const setCard = <K extends keyof CardData>(key: K, value: CardData[K]) =>
    setCardData((c) => ({ ...c, [key]: value }));
  const setSocial = (key: keyof NonNullable<CardData["socials"]>, value: string) =>
    setCardData((c) => ({ ...c, socials: { ...(c.socials ?? {}), [key]: value } }));

  /**
   * Apply (or clear) a style preset. Selecting a preset:
   *   - sets `themeKey` + `layoutKey`
   *   - seeds `brandPrimaryHex` / `brandAccentHex` only when the user has not
   *     yet entered a custom value, so we never overwrite intentional input.
   * Selecting "Custom" clears both keys but leaves any colors the user
   * already chose alone.
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
      locale: (["de", "en", "tr"].includes(locale) ? locale : "de") as
        | "de"
        | "en"
        | "tr",
      contactName,
      contactEmail,
      contactPhone,
      callMeBack,
      cardData: normalizedCard,
      brandPrimaryHex: brandPrimaryHex || undefined,
      brandAccentHex: brandAccentHex || undefined,
      photoPath: photoPath || undefined,
      logoPath: logoPath || undefined,
      // Phase 6 — style preset. Both fields stay optional; when undefined the
      // SmartCard renders with default theme + sector colors.
      themeKey: themeKey || undefined,
      layoutKey: layoutKey || undefined,
    };

    const parsed = OrderPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      // Surface every issue inline at the offending field instead of just
      // the first one in a global banner. The global banner stays reserved
      // for server / network errors below.
      const errs = extractFieldErrors(parsed.error.issues);
      setFieldErrors(errs);
      setFormState("idle");
      const firstKey = Object.keys(errs)[0];
      if (firstKey) {
        const el = document.getElementById(
          `field-${firstKey.replace(".", "-")}`
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        // Defer focus until after the smooth scroll begins so it doesn't
        // fight the scroll animation.
        setTimeout(() => el?.focus({ preventScroll: true }), 250);
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
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(body.error ?? L("serverError", "Serverfehler. Bitte erneut versuchen."));
        setFormState("error");
        return;
      }
      const json = (await res.json()) as { checkoutUrl?: string };
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

  if (!selectedTemplate) return null;

  return (
    <section id="order" className="border-t border-neutral-200 bg-neutral-50 py-16 md:py-24">
      <div className="container-wide">
        <div className="mb-10 md:mb-14">
          <p className="text-eyebrow uppercase tracking-wider text-ink/50">
            {L("eyebrow", "Bestellung")}
          </p>
          <h2 className="mt-3 font-display text-display-sm text-ink">
            {L("title", "Ihre Daten, Ihr Design, Ihre Karte.")}
          </h2>
          <p className="mt-3 max-w-xl text-body text-ink/60">
            {L(
              "subtitle",
              "Füllen Sie das Formular aus — die Karte wird direkt nach der Zahlung unter opsolid.de/c/… veröffentlicht."
            )}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-10 lg:grid-cols-[1fr_minmax(360px,460px)]"
        >
          {/* ======================= LEFT: form fields ======================= */}
          <div className="space-y-10">
            {/* Template summary */}
            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
              <div>
                <span className="text-eyebrow uppercase text-ink/50">
                  {L("selectedTemplate", "Gewähltes Design")}
                </span>
                <p className="mt-1 text-heading-sm text-ink">
                  #{String(selectedTemplate.id).padStart(2, "0")} · {selectedTemplate.name}
                </p>
              </div>
              <a href="#templates" className="btn-ghost text-sm">
                {L("changeTemplate", "Ändern")}
              </a>
            </div>

            {/* Contact */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {L("contactSection", "Kontakt — so erreichen wir Sie")}
              </legend>
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
              />
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
              />
              <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-brand"
                  checked={callMeBack}
                  onChange={(e) => setCallMeBack(e.target.checked)}
                />
                <span className="text-sm text-ink">
                  <strong>{L("callMeBack", "Rufen Sie mich an")}</strong>
                  <br />
                  <span className="text-ink/60">
                    {L(
                      "callMeBackHint",
                      "Wir melden uns innerhalb eines Werktags, um Details zu klären."
                    )}
                  </span>
                </span>
              </label>
            </fieldset>

            {/* Card content */}
            <fieldset className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <legend className="text-heading-sm text-ink">
                  {L("cardSection", "Inhalt Ihrer Karte")}
                </legend>
                {(contactName || contactEmail || contactPhone) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!cardData.name && contactName) setCard("name", contactName);
                      if (!cardData.email && contactEmail) setCard("email", contactEmail);
                      if (!cardData.phone && contactPhone) setCard("phone", contactPhone);
                    }}
                    className="text-xs font-medium text-ink/50 underline underline-offset-2 transition-colors hover:text-ink"
                  >
                    {L("copyFromContact", "Von oben übernehmen")}
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
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
              <Textarea
                label={L("cardBio", "Kurzbeschreibung")}
                value={cardData.bio ?? ""}
                onChange={(e) => setCard("bio", e.target.value)}
                rows={3}
                placeholder={L("cardBioPh", "Ein Satz zu Ihnen / Ihrem Unternehmen.")}
              />
            </fieldset>

            {/* Socials */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {L("socialSection", "Social Links (optional)")}
              </legend>
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
            </fieldset>

            {/* Uploads */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {L("uploadSection", "Foto & Logo (optional)")}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <UploadTile
                  label={L("photoLabel", "Profilfoto")}
                  current={photoPath}
                  uploading={photoUploading}
                  onChange={async (file) => {
                    setPhotoUploading(true);
                    const path = await handleFileUpload(file, "photo");
                    if (path) setPhotoPath(path);
                    setPhotoUploading(false);
                  }}
                />
                <UploadTile
                  label={L("logoLabel", "Logo")}
                  current={logoPath}
                  uploading={logoUploading}
                  onChange={async (file) => {
                    setLogoUploading(true);
                    const path = await handleFileUpload(file, "logo");
                    if (path) setLogoPath(path);
                    setLogoUploading(false);
                  }}
                />
              </div>
            </fieldset>

            {/* Style preset (Phase 6) — three CSS-only presets that drive
                the SmartCard's `data-theme` attribute. Selecting a preset
                seeds the brand color pickers below; the user can still
                override either color afterwards. */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {L("themeSection", "Stilvorlage (optional)")}
              </legend>
              <p className="-mt-1 max-w-xl text-xs text-ink/55">
                {L(
                  "themeSectionHint",
                  "Wählen Sie eine vordefinierte Stimmung — Farben, Typografie und Akzente werden im Vorschaufenster sofort angepasst."
                )}
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
            </fieldset>

            {/* Branding */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {L("brandSection", "Markenfarben (optional)")}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <ColorField
                  label={L("primaryColor", "Primärfarbe")}
                  value={brandPrimaryHex}
                  onChange={setBrandPrimaryHex}
                />
                <ColorField
                  label={L("accentColor", "Akzentfarbe")}
                  value={brandAccentHex}
                  onChange={setBrandAccentHex}
                />
              </div>
            </fieldset>

            {/* Design notes */}
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

            {/* Billing */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {L("billingSection", "Zahlungsmodell")}
              </legend>
              <div className="grid gap-3 md:grid-cols-3">
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
            </fieldset>

            {errorMsg && (
              <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm text-brand">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
              <div>
                <p className="text-eyebrow uppercase text-ink/50">
                  {L("totalLabel", "Zu zahlen")}
                </p>
                <p className="text-heading text-ink">
                  {formatEuro(amountCents)}
                  {billingMode === "MONTHLY"
                    ? " / Mon."
                    : billingMode === "YEARLY"
                    ? " / Jahr"
                    : ""}
                </p>
              </div>
              <button
                type="submit"
                className="btn-primary text-base"
                disabled={formState === "submitting"}
              >
                {formState === "submitting" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                <span>
                  {formState === "submitting"
                    ? L("submitting", "Wird verarbeitet …")
                    : L("submit", "Zahlen & Karte veröffentlichen")}
                </span>
              </button>
            </div>
          </div>

          {/* ======================= RIGHT: live preview ======================= */}
          {/* Sticky sidebar with a real SmartCard render. The form grid
              reserves ~460px on the right so SmartCard's intrinsic 440px
              max-width fits without scaling — what the customer sees here
              is exactly what visitors will see at /c/<slug>.
              `pointer-events-none` blocks accidental clicks on the live
              share / tel links during preview. */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-eyebrow mb-4 uppercase text-ink/50">
              {L("previewLabel", "Live-Vorschau")}
            </p>
            <div className="pointer-events-none">
              <SmartCard
                slug="preview"
                cardData={activeCardData}
                photoPath={photoPath}
                logoPath={logoPath}
                brandPrimaryHex={brandPrimaryHex || undefined}
                brandAccentHex={brandAccentHex || undefined}
                siteUrl={
                  typeof window !== "undefined"
                    ? window.location.origin
                    : "https://opsolid.de"
                }
              />
            </div>
            <p className="mt-4 text-xs text-ink/50">
              {L(
                "previewHint",
                "Die Vorschau aktualisiert sich live — so sieht Ihre Karte nach Veröffentlichung aus."
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function UploadTile({
  label,
  current,
  uploading,
  onChange,
}: {
  label: string;
  current: string | null;
  uploading: boolean;
  onChange: (file: File) => void;
}) {
  // Resolve the upload path to a browser-loadable URL. Storage paths come
  // back as either absolute URLs (S3/CDN) or root-relative (`/uploads/...`).
  const previewSrc = current
    ? current.startsWith("http") || current.startsWith("/")
      ? current
      : `/${current}`
    : null;

  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-4 transition-colors hover:border-ink/40">
      {previewSrc ? (
        // Uploaded — show the user's image so they instantly see what
        // they sent. The spinner overlays the thumbnail when re-uploading.
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt={label}
            className="h-full w-full object-cover"
          />
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <Loader2 size={16} className="animate-spin" />
            </span>
          )}
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-ink/60">
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="truncate text-xs text-ink/50">
          {previewSrc
            ? uploading
              ? "Wird ersetzt …"
              : "Hochgeladen ✓ · klicken zum Ersetzen"
            : uploading
              ? "Wird hochgeladen …"
              : "JPG · PNG · WEBP · max 5 MB"}
        </p>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/svg+xml,image/webp"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
        }}
      />
    </label>
  );
}

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
        <input
          type="color"
          value={value || "#0A0A0A"}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-2xl border border-neutral-200 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0A0A0A"
          className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 font-mono text-sm"
        />
      </div>
    </div>
  );
}

function PresetTile({
  preset,
  active,
  onClick,
  customLabel,
  customDescription,
}: {
  preset: import("@/lib/cardThemes").CardThemePreset | null;
  active: boolean;
  onClick: () => void;
  customLabel?: string;
  customDescription?: string;
}) {
  const label = preset ? preset.label : (customLabel ?? "Custom");
  const description = preset ? preset.description : (customDescription ?? "");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-4 text-left transition-colors ${
        active
          ? "border-brand bg-white shadow-soft"
          : "border-neutral-200 bg-white hover:border-ink/40"
      }`}
    >
      {preset && (
        <div className="mb-3 flex gap-1.5">
          <span
            className="h-4 w-4 rounded-full ring-1 ring-black/10"
            style={{ background: preset.primaryHex }}
          />
          <span
            className="h-4 w-4 rounded-full ring-1 ring-black/10"
            style={{ background: preset.accentHex }}
          />
        </div>
      )}
      {!preset && (
        <div className="mb-3 flex gap-1.5">
          <span className="h-4 w-4 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-400 ring-1 ring-black/10" />
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
      className={`relative rounded-2xl border p-5 text-left transition-colors ${
        active
          ? "border-brand bg-white shadow-soft"
          : "border-neutral-200 bg-white hover:border-ink/40"
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          {badge}
        </span>
      )}
      <span className="block text-heading-sm text-ink">{label}</span>
      <span className="mt-1 block text-2xl font-semibold text-ink">
        {priceLabel}
      </span>
      <span className="mt-2 block text-xs text-ink/60">{footer}</span>
    </button>
  );
}
