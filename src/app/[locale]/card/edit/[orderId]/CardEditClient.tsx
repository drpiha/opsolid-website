"use client";

// =============================================================================
// Customer self-service edit client.
//
// Mirrors the shape of OrderFormSection's left column (contact block is
// read-only here; template/billing are locked) and adds a cancel subscription
// flow. Live preview on the right reuses TemplateRenderer so what the customer
// sees is what the public page will render.
//
// `#cancel` anchor → auto-opens the cancel modal on mount. That anchor is
// embedded in the email "cancel subscription" CTA so a single link takes the
// customer from their inbox to the confirmation modal.
// =============================================================================

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Check,
  Camera,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  CheckCheck,
  ExternalLink,
  Share2,
  Mail,
  Phone,
  MessageCircle,
  Search,
  Download,
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { useLocale } from "@/context/LocaleContext";
import { TemplateRenderer } from "@/components/cards/TemplateRenderer";
import type { CardData, ImagePosition } from "@/lib/validation";
import { PhotoEditor } from "@/components/cards/PhotoEditor";
import { CustomSectionsEditor } from "@/components/cards/order-form/CustomSectionsEditor";
import { GalleryEditor } from "@/components/cards/order-form/GalleryEditor";
import { CustomSectionsBlock } from "@/components/cards/templates/v2/shared/CustomSectionsBlock";
import { TYPOGRAPHY_PRESET_LIST, getTypographyPreset } from "@/lib/typographyPresets";
import { getTemplateEntry } from "@/components/cards/templates/v2/registry";
import { ShareDrawer } from "@/components/cards/ShareDrawer";

type FormState = "idle" | "saving" | "saved" | "error";

interface Props {
  orderId: string;
  editToken: string;
  status: string;
  templateComponentKey: string;
  templateName: string;
  templateId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  billingMode: string;
  slug: string | null;
  cardData: CardData;
  brandPrimaryHex: string | null;
  brandAccentHex: string | null;
  photoPath: string | null;
  logoPath: string | null;
  hasSubscription: boolean;
  subscriptionCancelAt: string | null;
  subscriptionPeriodEnd: string | null;
}

export function CardEditClient(props: Props) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;
  const cancelCopy = t.products.digitalCard.cancel;
  const form = t.products.digitalCard.order.form;

  const [cardData, setCardData] = useState<CardData>(props.cardData);
  const [brandPrimaryHex, setBrandPrimaryHex] = useState(props.brandPrimaryHex ?? "");
  const [brandAccentHex, setBrandAccentHex] = useState(props.brandAccentHex ?? "");
  const [photoPath, setPhotoPath] = useState<string | null>(props.photoPath);
  const [logoPath, setLogoPath] = useState<string | null>(props.logoPath);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  // Phase 7.9 — photo / logo position editor modals
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [logoEditorOpen, setLogoEditorOpen] = useState(false);
  // Phase 8 — slug rename. `currentSlug` reflects the live slug; `editableSlug`
  // is the working draft. Saved on the next form submit alongside cardData.
  const [currentSlug, setCurrentSlug] = useState<string | null>(props.slug);
  const [editableSlug, setEditableSlug] = useState<string>(props.slug ?? "");
  // Phase 5 — share drawer
  const [shareOpen, setShareOpen] = useState(false);

  // Auto-open cancel modal when URL ends with #cancel (linked from email).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#cancel") setCancelOpen(true);
  }, []);

  const setCard = <K extends keyof CardData>(key: K, value: CardData[K]) =>
    setCardData((c) => ({ ...c, [key]: value }));
  const setSocial = (
    key: keyof NonNullable<CardData["socials"]>,
    value: string
  ) =>
    setCardData((c) => ({
      ...c,
      socials: { ...(c.socials ?? {}), [key]: value },
    }));

  const handleFileUpload = async (
    file: File,
    kind: "photo" | "logo"
  ): Promise<string | null> => {
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg(form.uploadTooLarge);
      return null;
    }
    const f = new FormData();
    f.append("file", file);
    f.append("kind", kind);
    const res = await fetch("/api/uploads", { method: "POST", body: f });
    if (!res.ok) {
      setErrorMsg(form.uploadFailed);
      return null;
    }
    const j = (await res.json()) as { path?: string };
    return j.path ?? null;
  };

  const activeCardData: CardData = useMemo(() => cardData, [cardData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setFormState("saving");

    const normalized: CardData = {
      ...cardData,
      title: cardData.title || undefined,
      company: cardData.company || undefined,
      phone: cardData.phone || undefined,
      email: cardData.email || undefined,
      website: cardData.website || undefined,
      address: cardData.address || undefined,
      bio: cardData.bio || undefined,
      whatsapp: cardData.whatsapp || undefined,
      designNotes: cardData.designNotes || undefined,
      socials: Object.fromEntries(
        Object.entries(cardData.socials ?? {}).filter(([, v]) => v)
      ) as CardData["socials"],
      // Phase 7.9 — keep customSections / photoPosition / logoPosition /
      // typographyPreset on the wire; the validator will strip falsy
      // optionals on the server.
      customSections: cardData.customSections,
      gallery: cardData.gallery,
      photoPosition: cardData.photoPosition,
      logoPosition: cardData.logoPosition,
      typographyPreset: cardData.typographyPreset,
    };

    const payload = {
      cardData: normalized,
      brandPrimaryHex: brandPrimaryHex || undefined,
      brandAccentHex: brandAccentHex || undefined,
      photoPath: photoPath || undefined,
      logoPath: logoPath || undefined,
      // Phase 8 — only include slug when it actually changed; the server
      // ignores undefined and only acts on a value that differs from the
      // current order.slug.
      slug:
        editableSlug && editableSlug !== currentSlug
          ? editableSlug
          : undefined,
    };

    try {
      const res = await fetch(
        `/api/card/edit/${props.orderId}?t=${encodeURIComponent(props.editToken)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (body.error === "slug_taken") {
          setErrorMsg("Bu kart adresi alınmış. Başka bir adres seç.");
        } else if (body.error === "slug_invalid") {
          setErrorMsg("Geçersiz kart adresi formatı.");
        } else if (body.error === "slug_rename_unsupported_state") {
          setErrorMsg("Kart adresi sadece yayında olan kartlar için değiştirilebilir.");
        } else {
          setErrorMsg(body.error ?? edit.savedError);
        }
        setFormState("error");
        return;
      }
      // Phase 8 — server returns the (possibly updated) slug so the UI can
      // reflect the rename without a full reload.
      const ok = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        slug?: string | null;
      };
      if (ok.slug && ok.slug !== currentSlug) {
        setCurrentSlug(ok.slug);
        setEditableSlug(ok.slug);
      }
      setFormState("saved");
      setTimeout(() => setFormState("idle"), 3500);
    } catch {
      setErrorMsg(edit.savedError);
      setFormState("error");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 py-16 md:py-20">
      <div className="container-wide">
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
          style={{
            background: "rgba(34,197,94,0.06)",
            borderColor: "rgba(34,197,94,0.25)",
            color: "#1a4d2e",
          }}
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
            style={{ color: "#16a34a" }}
          />
          <span>{t.card.owner.banner}</span>
        </div>

        <div className="mb-10 max-w-3xl">
          <p className="text-eyebrow uppercase tracking-wider text-ink/50">
            OpSolid · Digital Card
          </p>
          <h1 className="mt-3 font-display text-display-sm text-ink">
            {edit.title}
          </h1>
          <p className="mt-3 text-body text-ink/60">{edit.subtitle}</p>
          {currentSlug && props.status === "PUBLISHED" && (
            <div className="mt-4 max-w-md space-y-1.5">
              <label className="mono-label block text-[10px] uppercase tracking-[0.2em] text-ink/55">
                {edit.publicUrlLabel ?? "Kart adresi"}
              </label>
              <div className="flex items-stretch overflow-hidden rounded-2xl border border-ink/15 bg-white focus-within:border-copper">
                <span className="flex items-center px-3 text-xs text-ink/55">
                  opsolid.de/c/
                </span>
                <input
                  type="text"
                  value={editableSlug}
                  onChange={(e) =>
                    setEditableSlug(e.target.value.toLowerCase().trim())
                  }
                  spellCheck={false}
                  autoComplete="off"
                  maxLength={40}
                  className="flex-1 bg-transparent px-2 py-2 text-sm text-ink focus:outline-none"
                />
                <a
                  href={`/c/${currentSlug}?owner=${encodeURIComponent(props.editToken)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center border-l border-ink/15 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/65 transition-colors hover:bg-bg-2 hover:text-ink"
                  title="Kartı sahip modunda görüntüle"
                >
                  ↗
                </a>
              </div>
              {editableSlug && editableSlug !== currentSlug && (
                <p className="text-[11px] text-copper">
                  ⚠ Yeni adres &laquo;Kaydet&raquo; basıldığında uygulanır. Eski
                  adres otomatik olarak yeni adrese yönlenir.
                </p>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_minmax(320px,420px)]"
        >
          {/* ================ LEFT ================ */}
          <div className="space-y-10">
            {/* Phase 4 — Live banner: shown only when card is published */}
            {props.status === "PUBLISHED" && currentSlug && (
              <LiveBanner
                slug={currentSlug}
                onShare={() => setShareOpen(true)}
              />
            )}

            {/* Album pending approvals — visitor uploads awaiting owner action */}
            {props.slug && props.status === "PUBLISHED" && (
              <AlbumPendingPanel
                slug={props.slug}
                editToken={props.editToken}
              />
            )}

            {/* Analytics + CRM panels — visible once card is published */}
            {props.status === "PUBLISHED" && props.slug && (
              <AnalyticsPanel
                orderId={props.orderId}
                editToken={props.editToken}
                onShare={() => setShareOpen(true)}
              />
            )}
            {props.status === "PUBLISHED" && (
              <LeadsPanel
                orderId={props.orderId}
                editToken={props.editToken}
              />
            )}

            {/* Contact — read-only */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-eyebrow uppercase text-ink/50">
                {edit.contactReadonlyLabel}
              </p>
              <dl className="mt-3 grid gap-2 text-sm text-ink/80 md:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase text-ink/50">
                    {form.contactName}
                  </dt>
                  <dd className="mt-1">{props.contactName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-ink/50">
                    {form.contactEmail}
                  </dt>
                  <dd className="mt-1 break-all">{props.contactEmail}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-ink/50">
                    {form.contactPhone}
                  </dt>
                  <dd className="mt-1">{props.contactPhone}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-ink/50">
                {edit.contactReadonlyHint}
              </p>
            </div>

            {/* Card content */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {form.cardSection}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={form.cardName}
                  value={cardData.name}
                  onChange={(e) => setCard("name", e.target.value)}
                />
                <Input
                  label={form.cardTitle}
                  value={cardData.title ?? ""}
                  onChange={(e) => setCard("title", e.target.value)}
                />
                <Input
                  label={form.cardCompany}
                  value={cardData.company ?? ""}
                  onChange={(e) => setCard("company", e.target.value)}
                />
                <Input
                  label={form.cardWebsite}
                  value={cardData.website ?? ""}
                  onChange={(e) => setCard("website", e.target.value)}
                />
                <Input
                  type="email"
                  label={form.cardEmail}
                  value={cardData.email ?? ""}
                  onChange={(e) => setCard("email", e.target.value)}
                />
                <Input
                  type="tel"
                  label={form.cardPhone}
                  value={cardData.phone ?? ""}
                  onChange={(e) => setCard("phone", e.target.value)}
                />
                <Input
                  type="tel"
                  label={form.cardWhatsapp}
                  value={cardData.whatsapp ?? ""}
                  onChange={(e) => setCard("whatsapp", e.target.value)}
                />
                <Input
                  label={form.cardAddress}
                  value={cardData.address ?? ""}
                  onChange={(e) => setCard("address", e.target.value)}
                />
              </div>
              <Textarea
                label={form.cardBio}
                value={cardData.bio ?? ""}
                onChange={(e) => setCard("bio", e.target.value)}
                rows={3}
              />
            </fieldset>

            {/* Socials */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {form.socialSection}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="LinkedIn"
                  value={cardData.socials?.linkedin ?? ""}
                  onChange={(e) => setSocial("linkedin", e.target.value)}
                />
                <Input
                  label="Instagram"
                  value={cardData.socials?.instagram ?? ""}
                  onChange={(e) => setSocial("instagram", e.target.value)}
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
                {form.uploadSection}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <UploadTile
                    label={form.photoLabel}
                    current={photoPath}
                    uploading={photoUploading}
                    onChange={async (file) => {
                      setPhotoUploading(true);
                      const path = await handleFileUpload(file, "photo");
                      if (path) setPhotoPath(path);
                      setPhotoUploading(false);
                    }}
                  />
                  {photoPath && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPhotoEditorOpen(true)}
                        className="inline-flex items-center gap-1 rounded-full border border-copper/40 bg-copper/10 px-2.5 py-1 text-[10.5px] font-semibold text-ink transition-colors hover:border-copper hover:bg-copper/20"
                      >
                        {form.editPosition ?? "Edit position"}
                        {cardData.photoPosition && (
                          <span className="font-mono text-[9px] text-ink/55">
                            · {Math.round(cardData.photoPosition.x)}·
                            {Math.round(cardData.photoPosition.y)} ·
                            {cardData.photoPosition.scale.toFixed(2)}×
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPath(null);
                          setCard("photoPosition", undefined);
                        }}
                        className="text-[10.5px] text-ink/45 hover:text-ink"
                      >
                        {form.uploadRemove ?? "Remove"}
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <UploadTile
                    label={form.logoLabel}
                    current={logoPath}
                    uploading={logoUploading}
                    onChange={async (file) => {
                      setLogoUploading(true);
                      const path = await handleFileUpload(file, "logo");
                      if (path) setLogoPath(path);
                      setLogoUploading(false);
                    }}
                  />
                  {logoPath && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setLogoEditorOpen(true)}
                        className="inline-flex items-center gap-1 rounded-full border border-copper/40 bg-copper/10 px-2.5 py-1 text-[10.5px] font-semibold text-ink transition-colors hover:border-copper hover:bg-copper/20"
                      >
                        {form.editPosition ?? "Edit position"}
                        {cardData.logoPosition && (
                          <span className="font-mono text-[9px] text-ink/55">
                            · {Math.round(cardData.logoPosition.x)}·
                            {Math.round(cardData.logoPosition.y)} ·
                            {cardData.logoPosition.scale.toFixed(2)}×
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPath(null);
                          setCard("logoPosition", undefined);
                        }}
                        className="text-[10.5px] text-ink/45 hover:text-ink"
                      >
                        {form.uploadRemove ?? "Remove"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Gallery — up to 24 photos rendered on the public card */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {(form as Record<string, string>).gallerySection ?? "Galeri"}
              </legend>
              {(form as Record<string, string>).galleryHint && (
                <p className="-mt-2 text-xs text-ink/55">
                  {(form as Record<string, string>).galleryHint}
                </p>
              )}
              <GalleryEditor
                gallery={cardData.gallery}
                onGalleryChange={(next) => setCard("gallery", next)}
                handleFileUpload={handleFileUpload}
                L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
              />
            </fieldset>

            {/* Phase 7.9 — Custom Sections */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {form.customSectionsSection ?? "Özel bölümler"}
              </legend>
              {form.customSectionsHint && (
                <p className="-mt-2 text-xs text-ink/55">
                  {form.customSectionsHint}
                </p>
              )}
              <CustomSectionsEditor
                cardData={cardData}
                setCard={setCard}
                L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
                handleFileUpload={handleFileUpload}
              />
            </fieldset>

            {/* Phase 7.9 — Typography preset */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {form.typographySection ?? "Tipografi"}
              </legend>
              {form.typographyHint && (
                <p className="-mt-2 text-xs text-ink/55">
                  {form.typographyHint}
                </p>
              )}
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
                  const formMap = form as Record<string, string>;
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
                        {formMap[labelKey] ?? preset.label}
                      </span>
                      <span className="block text-[10.5px] leading-snug text-ink/55">
                        {formMap[descKey] ?? preset.description}
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
            </fieldset>

            {/* Branding */}
            <fieldset className="space-y-4">
              <legend className="text-heading-sm text-ink">
                {form.brandSection}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <ColorField
                  label={form.primaryColor}
                  value={brandPrimaryHex}
                  onChange={setBrandPrimaryHex}
                />
                <ColorField
                  label={form.accentColor}
                  value={brandAccentHex}
                  onChange={setBrandAccentHex}
                />
              </div>
            </fieldset>

            <Textarea
              label={form.designNotes}
              value={cardData.designNotes ?? ""}
              onChange={(e) => setCard("designNotes", e.target.value)}
              rows={3}
              placeholder={form.designNotesPh}
            />

            {errorMsg && (
              <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm text-brand">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {formState === "saved" && (
              <div className="flex items-start gap-3 rounded-2xl border border-green-600/30 bg-green-600/5 p-4 text-sm text-green-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{edit.savedSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
              <div>
                <p className="text-eyebrow uppercase text-ink/50">
                  {edit.statusLabel}
                </p>
                <p className="text-heading-sm text-ink">{props.status}</p>
              </div>
              <button
                type="submit"
                className="btn-primary text-base"
                disabled={formState === "saving"}
              >
                {formState === "saving" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                <span>
                  {formState === "saving" ? edit.saving : edit.save}
                </span>
              </button>
            </div>

            {/* Download OG image + cancel subscription */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-heading-sm text-ink">{edit.shareHeading}</p>
              <p className="mt-1 text-sm text-ink/60">{edit.shareBody}</p>
              {props.slug && props.status === "PUBLISHED" ? (
                <a
                  href={`/c/${props.slug}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex btn-ghost text-sm"
                >
                  {edit.downloadOg}
                </a>
              ) : (
                <p className="mt-4 text-xs text-ink/50">{edit.shareNotReady}</p>
              )}
            </div>

            {props.hasSubscription && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <p className="text-heading-sm text-ink">
                  {cancelCopy.heading}
                </p>
                <p className="mt-1 text-sm text-ink/60">{cancelCopy.body}</p>
                {props.subscriptionCancelAt ? (
                  <p className="mt-3 text-sm text-ink">
                    {cancelCopy.alreadyScheduled.replace(
                      "{date}",
                      new Date(props.subscriptionCancelAt).toLocaleDateString()
                    )}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    className="mt-4 inline-flex btn-ghost text-sm text-brand"
                  >
                    {cancelCopy.openCta}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ================ RIGHT: preview ================ */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-eyebrow mb-4 uppercase text-ink/50">
              {form.previewLabel}
            </p>
            <EditPreview
              templateId={props.templateId}
              templateComponentKey={props.templateComponentKey}
              cardData={activeCardData}
              photoPath={photoPath}
              logoPath={logoPath}
              brandPrimaryHex={brandPrimaryHex || undefined}
              brandAccentHex={brandAccentHex || undefined}
            />
            <p className="mt-4 text-xs text-ink/50">{form.previewHint}</p>
          </div>
        </form>
      </div>

      {/* Phase 7.9 — photo / logo position editor modals */}
      {photoEditorOpen && photoPath && (
        <PhotoEditor
          open={photoEditorOpen}
          onOpenChange={setPhotoEditorOpen}
          kind="photo"
          imageUrl={photoPath.startsWith("/") || photoPath.startsWith("http") ? photoPath : `/${photoPath}`}
          initialPosition={cardData.photoPosition}
          onSave={(pos: ImagePosition) => setCard("photoPosition", pos)}
          labels={{
            title: form.photoEditorTitle ?? "Profilfoto-Position",
            subtitle:
              form.photoEditorSubtitle ?? "Drag to position, slide to zoom.",
            zoom: form.photoEditorZoom ?? "Zoom",
            reset: form.photoEditorReset ?? "Reset",
            save: form.photoEditorSave ?? "Save",
            cancel: form.photoEditorCancel ?? "Cancel",
            hint:
              form.photoEditorHint ?? "The ring shows the visible centre.",
          }}
        />
      )}
      {logoEditorOpen && logoPath && (
        <PhotoEditor
          open={logoEditorOpen}
          onOpenChange={setLogoEditorOpen}
          kind="logo"
          imageUrl={logoPath.startsWith("/") || logoPath.startsWith("http") ? logoPath : `/${logoPath}`}
          initialPosition={cardData.logoPosition}
          onSave={(pos: ImagePosition) => setCard("logoPosition", pos)}
          labels={{
            title: form.logoEditorTitle ?? "Logo position",
            subtitle:
              form.logoEditorSubtitle ?? "Place the logo where you want it.",
            zoom: form.photoEditorZoom ?? "Zoom",
            reset: form.photoEditorReset ?? "Reset",
            save: form.photoEditorSave ?? "Save",
            cancel: form.photoEditorCancel ?? "Cancel",
            hint:
              form.photoEditorHint ?? "The ring shows the visible centre.",
          }}
        />
      )}

      {cancelOpen && (
        <CancelModal
          orderId={props.orderId}
          editToken={props.editToken}
          periodEnd={props.subscriptionPeriodEnd}
          onClose={() => setCancelOpen(false)}
        />
      )}

      {props.slug && props.status === "PUBLISHED" && (
        <OwnerPhotoFab slug={props.slug} editToken={props.editToken} />
      )}

      {/* Phase 5 — Share drawer */}
      {currentSlug && (
        <ShareDrawer
          slug={currentSlug}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </main>
  );
}

// -----------------------------------------------------------------------------
// Phase 4 — LiveBanner: shown at the top of the edit page when status is
// PUBLISHED and a slug is available. Provides quick copy + open affordances
// with a copper accent so it reads as a positive/live signal.
// -----------------------------------------------------------------------------
function LiveBanner({
  slug,
  onShare,
}: {
  slug: string;
  onShare: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const cardUrl = `https://opsolid.de/c/${slug}`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(cardUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-copper-500/10 border border-copper-500/20 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      {/* Left: pulse dot + label */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-ink font-medium text-[13px] whitespace-nowrap">Kartın Yayında</span>
      </div>

      {/* Center: clickable URL */}
      <a
        href={cardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-[120px] text-copper-500 text-[13px] font-mono hover:underline truncate"
      >
        opsolid.de/c/{slug}
      </a>

      {/* Right: action buttons — min-h-[44px] for touch */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[36px] text-xs px-3 py-1.5 rounded-lg border border-line-soft bg-bg-2 text-ink hover:bg-bg-3 transition-colors inline-flex items-center gap-1.5"
        >
          {copied ? (
            <CheckCheck size={12} className="text-green-600" />
          ) : (
            <Copy size={12} />
          )}
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="min-h-[36px] text-xs px-3 py-1.5 rounded-lg bg-copper-500 text-white hover:bg-copper-600 transition-colors inline-flex items-center gap-1.5"
        >
          <ExternalLink size={12} />
          Kartı Gör →
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Cancel modal — period-end explainer + confirm + POST /api/card/cancel.
// -----------------------------------------------------------------------------
function CancelModal({
  orderId,
  editToken,
  periodEnd,
  onClose,
}: {
  orderId: string;
  editToken: string;
  periodEnd: string | null;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const copy = t.products.digitalCard.cancel;
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [result, setResult] = useState<{
    cancelAt: string | null;
    currentPeriodEnd: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const explainer = periodEnd
    ? copy.explainer.replace(
        "{date}",
        new Date(periodEnd).toLocaleDateString()
      )
    : copy.explainerNoDate;

  const confirm = async () => {
    setState("submitting");
    setError(null);
    try {
      const res = await fetch(
        `/api/card/cancel/${orderId}?t=${encodeURIComponent(editToken)}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        setError(body.message ?? body.error ?? copy.error);
        setState("error");
        return;
      }
      const json = (await res.json()) as {
        cancelAt: string | null;
        currentPeriodEnd: string | null;
      };
      setResult(json);
      setState("done");
    } catch {
      setError(copy.error);
      setState("error");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-eyebrow uppercase tracking-wider text-ink/50">
          {copy.modalEyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          {copy.modalTitle}
        </h2>

        {state === "done" && result ? (
          <>
            <p className="mt-4 text-sm text-ink/80">
              {copy.doneBody.replace(
                "{date}",
                result.cancelAt
                  ? new Date(result.cancelAt).toLocaleDateString()
                  : result.currentPeriodEnd
                  ? new Date(result.currentPeriodEnd).toLocaleDateString()
                  : "—"
              )}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-primary text-sm"
              >
                {copy.doneClose}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm text-ink/80">{explainer}</p>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-brand/30 bg-brand/5 p-3 text-sm text-brand">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost text-sm"
                disabled={state === "submitting"}
              >
                {copy.keep}
              </button>
              <button
                type="button"
                onClick={confirm}
                className="btn-primary text-sm"
                disabled={state === "submitting"}
              >
                {state === "submitting" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                <span>{copy.confirm}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Local copies of UploadTile/ColorField to avoid coupling with the order form.
// Identical shape to the order page so the customer experience is consistent.
// -----------------------------------------------------------------------------
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
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-4 transition-colors hover:border-ink/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-ink/60">
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="truncate text-xs text-ink/50">
          {current ? current.split("/").pop() : "JPG · PNG · SVG · max 2 MB"}
        </p>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
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

// -----------------------------------------------------------------------------
// Analytics panel — shows view counts for the card owner.
// Fetches from GET /api/card/edit/[orderId]/analytics?t=<editToken>.
// -----------------------------------------------------------------------------
type AnalyticsData = {
  total: number;
  last7d: number;
  last30d: number;
  bySource: { qr: number; nfc: number; link: number; wallet: number; other: number };
};

function AnalyticsPanel({
  orderId,
  editToken,
  onShare,
}: {
  orderId: string;
  editToken: string;
  onShare: () => void;
}) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch(`/api/card/edit/${orderId}/analytics?t=${encodeURIComponent(editToken)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setData(j as AnalyticsData | null))
      .finally(() => setLoading(false));
  }, [orderId, editToken]);

  const stats: { label: string; value: number }[] = data
    ? [
        { label: "Toplam", value: data.total },
        { label: "Son 7 Gün", value: data.last7d },
        { label: "Son 30 Gün", value: data.last30d },
      ]
    : [];

  const sources = data
    ? [
        { key: "QR", value: data.bySource.qr },
        { key: "Link", value: data.bySource.link },
        { key: "NFC", value: data.bySource.nfc },
        { key: "Cüzdan", value: data.bySource.wallet },
        { key: "Diğer", value: data.bySource.other },
      ].filter((s) => s.value > 0)
    : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-ink">Görüntülenme Analitiği</span>
        {data && (
          <span className="text-[11px] font-semibold text-copper">{data.total} görüntülenme</span>
        )}
      </div>

      {/* Quick actions — Phase 5: single Paylaş button opens ShareDrawer */}
      <div className="flex gap-2 border-t border-neutral-100 px-5 py-3">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-copper-500/30 bg-copper-500/10 px-3 py-1.5 text-xs font-semibold text-copper-500 transition hover:bg-copper-500/20 active:scale-95"
        >
          <Share2 size={12} />
          Paylaş →
        </button>
      </div>

      <div className="border-t border-neutral-100 px-5 py-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-ink/50">
            <Loader2 size={14} className="animate-spin" /> Yükleniyor…
          </div>
        )}
        {!loading && !data && (
          <p className="text-sm text-ink/40">Analitik yüklenemedi.</p>
        )}
        {!loading && data && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-neutral-50 p-3 text-center">
                  <div className="text-2xl font-bold tabular-nums text-ink">{s.value}</div>
                  <div className="mt-0.5 text-[10px] text-ink/50">{s.label}</div>
                </div>
              ))}
            </div>
            {sources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sources.map((s) => (
                  <span
                    key={s.key}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-100 bg-neutral-50 px-2.5 py-1 text-[11px] text-ink/70"
                  >
                    <span className="font-medium">{s.key}</span>
                    <span className="font-bold text-copper">{s.value}</span>
                  </span>
                ))}
              </div>
            )}
            {data.total === 0 && (
              <p className="mt-2 text-xs text-ink/40">
                Henüz görüntülenme yok. Kartını paylaştıkça burada görünecek.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// CRM panel — shows received leads and card-to-card connections.
// Fetches from GET /api/card/edit/[orderId]/crm?t=<editToken> on first open.
// PATCH endpoints: /api/card/edit/[orderId]/crm/lead/[id] and
//                  /api/card/edit/[orderId]/crm/connection/[id]
// Export: GET /api/card/edit/[orderId]/crm/export?t=<editToken> → CSV
// -----------------------------------------------------------------------------
type CrmLead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  interest: string | null;
  meetingContext: string | null;
  company: string | null;
  ownerNotes: string | null;
  tags: string[];
  status: string;     // "new" | "contacted" | "qualified" | "archived"
  priority: number;   // 0 | 1 | 2
  lastContactedAt: string | null;
  createdAt: string;
};

type CrmConnection = {
  id: string;
  visitorSlug: string | null;
  visitorName: string;
  visitorEmail: string | null;     // extracted from visitorCard.cardData
  visitorPhone: string | null;     // extracted from visitorCard.cardData
  source: string | null;
  note: string | null;
  status: string;
  tags: string[];
  priority: number;
  lastContactedAt: string | null;
  createdAt: string;
};

// Tiny inline tag-input component — Enter or comma commits the tag.
function TagInput({ onAdd }: { onAdd: (tag: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <input
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === ",") && val.trim()) {
          e.preventDefault();
          onAdd(val.trim());
          setVal("");
        }
      }}
      placeholder="+ etiket"
      className="w-16 rounded-full border border-dashed border-copper/30 bg-transparent px-2 py-0.5 text-[10px] text-copper/70 placeholder-copper/40 focus:border-copper/60 focus:outline-none"
    />
  );
}

function statusChip(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new:       { bg: "bg-neutral-100",  text: "text-ink/50",    label: "Yeni" },
    contacted: { bg: "bg-blue-50",      text: "text-blue-600",  label: "İletişim" },
    qualified: { bg: "bg-green-50",     text: "text-green-600", label: "Nitelikli" },
    archived:  { bg: "bg-neutral-50",   text: "text-ink/30",    label: "Arşiv" },
    accepted:  { bg: "bg-green-50",     text: "text-green-600", label: "Kabul" },
  };
  const s = map[status] ?? map.new;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function LeadsPanel({ orderId, editToken }: { orderId: string; editToken: string }) {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState<CrmLead[] | null>(null);
  const [connections, setConnections] = useState<CrmConnection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"leads" | "connections">("leads");

  // Phase 6 — search/filter/edit state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [noteEdits, setNoteEdits] = useState<Record<string, string>>({});
  void noteEdits; // reserved for future controlled note editing

  const load = async (forceReload = false) => {
    if (leads !== null && !forceReload) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ t: editToken });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/card/edit/${orderId}/crm?${params.toString()}`);
      if (res.ok) {
        const j = await res.json() as { leads: CrmLead[]; connections: CrmConnection[] };
        setLeads(j.leads);
        setConnections(j.connections);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (!open) void load();
    setOpen((o) => !o);
  };

  // PATCH helpers — call backend endpoints added by the backend agent.
  const patchLead = async (
    leadId: string,
    data: Partial<Pick<CrmLead, "ownerNotes" | "tags" | "status" | "priority">>
  ) => {
    setSavingId(leadId);
    try {
      const res = await fetch(
        `/api/card/edit/${orderId}/crm/lead/${leadId}?t=${encodeURIComponent(editToken)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        const updated = await res.json() as CrmLead;
        setLeads((prev) => prev?.map((l) => (l.id === leadId ? { ...l, ...updated } : l)) ?? null);
      }
    } finally {
      setSavingId(null);
    }
  };

  const patchConnection = async (
    connectionId: string,
    data: Partial<Pick<CrmConnection, "note" | "tags" | "status" | "priority">>
  ) => {
    setSavingId(connectionId);
    try {
      const res = await fetch(
        `/api/card/edit/${orderId}/crm/connection/${connectionId}?t=${encodeURIComponent(editToken)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        const updated = await res.json() as CrmConnection;
        setConnections(
          (prev) => prev?.map((c) => (c.id === connectionId ? { ...c, ...updated } : c)) ?? null
        );
      }
    } finally {
      setSavingId(null);
    }
  };

  const total = (leads?.length ?? 0) + (connections?.length ?? 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {/* ── Panel header ── */}
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">Bağlantılar (CRM)</span>
          {total > 0 && (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-copper/15 px-1.5 text-[10px] font-semibold text-copper">
              {total}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-ink/40" /> : <ChevronDown size={16} className="text-ink/40" />}
      </button>

      {open && (
        <div className="border-t border-neutral-100">
          {/* ── Search + filter bar ── */}
          <div className="flex flex-wrap items-center gap-2 px-5 pb-3 pt-3 border-b border-neutral-100">
            <div className="relative flex-1 min-w-[160px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="text"
                placeholder="İsim, email, şirket, etiket..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void load(true)}
                className="w-full rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs text-ink placeholder-ink/30 focus:border-copper/50 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); void load(true); }}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs text-ink/70 focus:border-copper/50 focus:outline-none"
            >
              <option value="all">Tümü</option>
              <option value="new">Yeni</option>
              <option value="contacted">İletişim</option>
              <option value="qualified">Nitelikli</option>
              <option value="archived">Arşiv</option>
            </select>
            <a
              href={`/api/card/edit/${orderId}/crm/export?t=${encodeURIComponent(editToken)}`}
              download
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-ink/60 transition hover:border-copper/40 hover:text-copper"
            >
              <Download size={12} />
              CSV
            </a>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-neutral-100 px-5 pt-2">
            {(["leads", "connections"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`mr-4 pb-2 text-xs font-semibold uppercase tracking-wide transition ${
                  tab === t ? "border-b-2 border-copper text-copper" : "text-ink/50 hover:text-ink"
                }`}
              >
                {t === "leads"
                  ? `Gelen Bilgiler (${leads?.length ?? "…"})`
                  : `Kart Bağlantıları (${connections?.length ?? "…"})`}
              </button>
            ))}
          </div>

          <div className="px-5 py-4">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-ink/50">
                <Loader2 size={14} className="animate-spin" />
                Yükleniyor…
              </div>
            )}

            {/* ── Leads tab ── */}
            {!loading && tab === "leads" && (
              leads?.length === 0 ? (
                <p className="text-sm text-ink/40">Henüz bilgi gönderilmedi.</p>
              ) : (
                <ul className="space-y-3">
                  {leads?.map((l) => (
                    <li
                      key={l.id}
                      className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm"
                    >
                      {/* Row 1: name + date + chips */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-ink">{l.name ?? "—"}</span>
                          {statusChip(l.status ?? "new")}
                          {/* Priority dot — red when priority > 0 */}
                          {(l.priority ?? 0) > 0 && (
                            <span
                              title={`Öncelik: ${l.priority}`}
                              className="inline-block h-2 w-2 rounded-full bg-red-500"
                            />
                          )}
                          {savingId === l.id && (
                            <Loader2 size={11} className="animate-spin text-copper/60" />
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] text-ink/40">
                          {new Date(l.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>

                      {/* Row 2: company + meetingContext */}
                      {(l.company ?? l.meetingContext) && (
                        <p className="mt-1 text-[11px] text-ink/50">
                          {[l.company, l.meetingContext].filter(Boolean).join(" · ")}
                        </p>
                      )}

                      {/* Row 3: message / interest preview */}
                      {(l.message ?? l.interest) && (
                        <p className="mt-1.5 text-xs text-ink/60 line-clamp-2">
                          {l.message ?? l.interest}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(l.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-copper/10 px-2 py-0.5 text-[10px] font-medium text-copper"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                void patchLead(l.id, {
                                  tags: (l.tags ?? []).filter((t) => t !== tag),
                                })
                              }
                              className="text-copper/60 hover:text-copper leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <TagInput
                          onAdd={(newTag) => {
                            if (!(l.tags ?? []).includes(newTag)) {
                              void patchLead(l.id, { tags: [...(l.tags ?? []), newTag] });
                            }
                          }}
                        />
                      </div>

                      {/* Quick status selector + priority toggle */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <select
                          value={l.status ?? "new"}
                          onChange={(e) => void patchLead(l.id, { status: e.target.value })}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-ink/70 focus:border-copper/50 focus:outline-none"
                        >
                          <option value="new">Yeni</option>
                          <option value="contacted">İletişim</option>
                          <option value="qualified">Nitelikli</option>
                          <option value="archived">Arşiv</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            void patchLead(l.id, {
                              priority: (l.priority ?? 0) > 0 ? 0 : 1,
                            })
                          }
                          className={`rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                            (l.priority ?? 0) > 0
                              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              : "border-neutral-200 bg-white text-ink/50 hover:border-copper/30 hover:text-copper"
                          }`}
                        >
                          {(l.priority ?? 0) > 0 ? "Öncelikli" : "Öncelik"}
                        </button>
                      </div>

                      {/* Reply buttons */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {l.email && (
                          <a
                            href={`mailto:${l.email}?subject=OpSolid Smart Kart — Yanıt`}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-ink/70 transition hover:border-copper/40 hover:text-copper active:scale-95"
                          >
                            <Mail size={11} />
                            {l.email}
                          </a>
                        )}
                        {l.phone && (
                          <>
                            <a
                              href={`tel:${l.phone}`}
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-ink/70 transition hover:border-copper/40 hover:text-copper active:scale-95"
                            >
                              <Phone size={11} />
                              Ara
                            </a>
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-ink/70 transition hover:border-green-500/40 hover:text-green-600 active:scale-95"
                            >
                              <MessageCircle size={11} />
                              WhatsApp
                            </a>
                          </>
                        )}
                      </div>

                      {/* Owner notes — collapsible inline editor */}
                      {expandedNotes.has(l.id) && (
                        <textarea
                          key={l.id}
                          defaultValue={l.ownerNotes ?? ""}
                          placeholder="Bağlam: nerede tanıştık, ne konuştuk, takip notu..."
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (val !== (l.ownerNotes ?? "")) {
                              void patchLead(l.id, { ownerNotes: val });
                            }
                          }}
                          className="mt-2 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-xs text-ink/70 placeholder-ink/30 focus:border-copper/40 focus:outline-none"
                          rows={3}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedNotes((s) => {
                            const n = new Set(s);
                            n.has(l.id) ? n.delete(l.id) : n.add(l.id);
                            return n;
                          })
                        }
                        className="mt-1.5 text-[11px] text-ink/40 hover:text-copper"
                      >
                        {expandedNotes.has(l.id)
                          ? "Notu kapat"
                          : l.ownerNotes
                          ? "Notu düzenle"
                          : "Not ekle"}
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}

            {/* ── Connections tab ── */}
            {!loading && tab === "connections" && (
              connections?.length === 0 ? (
                <p className="text-sm text-ink/40">Henüz kart bağlantısı yok.</p>
              ) : (
                <ul className="space-y-3">
                  {connections?.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm"
                    >
                      {/* Row 1: name + date + chip */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-ink">{c.visitorName}</span>
                          {statusChip(c.status ?? "new")}
                          {(c.priority ?? 0) > 0 && (
                            <span
                              title={`Öncelik: ${c.priority}`}
                              className="inline-block h-2 w-2 rounded-full bg-red-500"
                            />
                          )}
                          {savingId === c.id && (
                            <Loader2 size={11} className="animate-spin text-copper/60" />
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] text-ink/40">
                          {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>

                      {/* Visitor card link */}
                      {c.visitorSlug && (
                        <a
                          href={`/c/${c.visitorSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-xs text-copper hover:underline"
                        >
                          opsolid.de/c/{c.visitorSlug}
                        </a>
                      )}
                      {c.source && (
                        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-ink/40">
                          {c.source}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(c.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-copper/10 px-2 py-0.5 text-[10px] font-medium text-copper"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                void patchConnection(c.id, {
                                  tags: (c.tags ?? []).filter((t) => t !== tag),
                                })
                              }
                              className="text-copper/60 hover:text-copper leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <TagInput
                          onAdd={(newTag) => {
                            if (!(c.tags ?? []).includes(newTag)) {
                              void patchConnection(c.id, { tags: [...(c.tags ?? []), newTag] });
                            }
                          }}
                        />
                      </div>

                      {/* Quick status selector + priority */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <select
                          value={c.status ?? "new"}
                          onChange={(e) =>
                            void patchConnection(c.id, { status: e.target.value })
                          }
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-ink/70 focus:border-copper/50 focus:outline-none"
                        >
                          <option value="new">Yeni</option>
                          <option value="contacted">İletişim</option>
                          <option value="qualified">Nitelikli</option>
                          <option value="archived">Arşiv</option>
                          <option value="accepted">Kabul</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            void patchConnection(c.id, {
                              priority: (c.priority ?? 0) > 0 ? 0 : 1,
                            })
                          }
                          className={`rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                            (c.priority ?? 0) > 0
                              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              : "border-neutral-200 bg-white text-ink/50 hover:border-copper/30 hover:text-copper"
                          }`}
                        >
                          {(c.priority ?? 0) > 0 ? "Öncelikli" : "Öncelik"}
                        </button>
                      </div>

                      {/* Reply buttons — visitorEmail/visitorPhone extracted by backend.
                          TODO: backend agent must return visitorEmail + visitorPhone
                          from visitorCard.cardData in the CRM GET response. */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {c.visitorEmail && (
                          <a
                            href={`mailto:${c.visitorEmail}?subject=OpSolid Smart Kart — Yanıt`}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-ink/70 transition hover:border-copper/40 hover:text-copper active:scale-95"
                          >
                            <Mail size={11} />
                            {c.visitorEmail}
                          </a>
                        )}
                        {c.visitorPhone && (
                          <>
                            <a
                              href={`tel:${c.visitorPhone}`}
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-ink/70 transition hover:border-copper/40 hover:text-copper active:scale-95"
                            >
                              <Phone size={11} />
                              Ara
                            </a>
                            <a
                              href={`https://wa.me/${c.visitorPhone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-ink/70 transition hover:border-green-500/40 hover:text-green-600 active:scale-95"
                            >
                              <MessageCircle size={11} />
                              WhatsApp
                            </a>
                          </>
                        )}
                      </div>

                      {/* Owner note — collapsible inline editor */}
                      {expandedNotes.has(c.id) && (
                        <textarea
                          key={c.id}
                          defaultValue={c.note ?? ""}
                          placeholder="Bu bağlantı hakkında not ekle..."
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (val !== (c.note ?? "")) {
                              void patchConnection(c.id, { note: val });
                            }
                          }}
                          className="mt-2 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-xs text-ink/70 placeholder-ink/30 focus:border-copper/40 focus:outline-none"
                          rows={3}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedNotes((s) => {
                            const n = new Set(s);
                            n.has(c.id) ? n.delete(c.id) : n.add(c.id);
                            return n;
                          })
                        }
                        className="mt-1.5 text-[11px] text-ink/40 hover:text-copper"
                      >
                        {expandedNotes.has(c.id)
                          ? "Notu kapat"
                          : c.note
                          ? "Notu düzenle"
                          : "Not ekle"}
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Phase 7.9 — preview wrapper that mirrors the order form's LivePreview:
// applies the photo/logo position + typography preset CSS variables and renders
// the v2 template (falling back to TemplateRenderer for legacy ids).
// -----------------------------------------------------------------------------
function EditPreview({
  templateId,
  templateComponentKey,
  cardData,
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
}: {
  templateId: number;
  templateComponentKey: string;
  cardData: CardData;
  photoPath: string | null;
  logoPath: string | null;
  brandPrimaryHex?: string;
  brandAccentHex?: string;
}) {
  const entry = getTemplateEntry(templateId);
  const Template = entry?.Component;

  const photoPos = cardData.photoPosition;
  const logoPos = cardData.logoPosition;
  const tpKey = cardData.typographyPreset;
  const wrapperStyle: Record<string, string> = {
    "--tpl-photo-x": `${photoPos?.x ?? 50}%`,
    "--tpl-photo-y": `${photoPos?.y ?? 50}%`,
    "--tpl-photo-scale": String(photoPos?.scale ?? 1),
    "--tpl-logo-x": `${logoPos?.x ?? 50}%`,
    "--tpl-logo-y": `${logoPos?.y ?? 50}%`,
    "--tpl-logo-scale": String(logoPos?.scale ?? 1),
  };
  if (tpKey && tpKey !== "default") {
    const preset = getTypographyPreset(tpKey);
    if (preset.displayFamily) wrapperStyle["--tpl-font-display"] = preset.displayFamily;
    if (preset.bodyFamily) wrapperStyle["--tpl-font-body"] = preset.bodyFamily;
  }

  const isDarkTemplate = entry
    ? ["barber", "developer", "music-producer", "studio", "tech-startup"].includes(
        entry.key
      )
    : false;

  // Compute siteUrl on the client only.
  const [siteUrl, setSiteUrl] = useState("https://opsolid.de");
  useEffect(() => {
    if (typeof window !== "undefined") setSiteUrl(window.location.origin);
  }, []);

  return (
    <div data-card-tpl style={wrapperStyle as React.CSSProperties}>
      {Template ? (
        <Template
          slug="preview"
          cardData={cardData}
          photoPath={photoPath}
          logoPath={logoPath}
          brandPrimaryHex={brandPrimaryHex ?? null}
          brandAccentHex={brandAccentHex ?? null}
          siteUrl={siteUrl}
          locale="de"
        />
      ) : (
        <TemplateRenderer
          componentKey={templateComponentKey}
          cardData={cardData}
          photoPath={photoPath}
          logoPath={logoPath}
          brandPrimaryHex={brandPrimaryHex}
          brandAccentHex={brandAccentHex}
        />
      )}
      <CustomSectionsBlock
        sections={cardData.customSections}
        accentHex={brandAccentHex}
        tone={isDarkTemplate ? "dark" : "light"}
      />
    </div>
  );
}

// =============================================================================
// AlbumPendingPanel — owner approval queue for visitor album uploads.
//
// Mounts a single GET to /api/cards/[slug]/album/pending; shows nothing when
// the queue is empty, otherwise a copper-tinted bar that expands into a
// thumbnail list with Approve / Reject affordances per row. Each PATCH
// optimistically removes the row from local state so the count is always in
// sync with what the owner actually sees.
// =============================================================================
interface PendingPhoto {
  id: string;
  photoPath: string | null;
  caption: string | null;
  uploaderName: string | null;
  uploaderType: string | null;
  createdAt: string;
}

function AlbumPendingPanel({
  slug,
  editToken,
}: {
  slug: string;
  editToken: string;
}) {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(
      `/api/cards/${slug}/album/pending?t=${encodeURIComponent(editToken)}`,
      { cache: "no-store" },
    )
      .then((res) =>
        res.ok ? (res.json() as Promise<{ photos: PendingPhoto[] }>) : null,
      )
      .then((data) => {
        if (cancelled || !data) return;
        setPhotos(data.photos);
      })
      .catch(() => {
        /* swallow — the panel is non-critical */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, editToken]);

  const decide = async (id: string, status: "APPROVED" | "REJECTED") => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      const res = await fetch(
        `/api/cards/${slug}/album/${id}?t=${encodeURIComponent(editToken)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) return null;
  if (photos.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-copper/30 bg-copper/[0.06]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-copper/[0.1]"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-copper text-white">
            <Camera size={16} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-ink">
              {photos.length} yeni fotoğraf onay bekliyor
            </span>
            <span className="block text-[11px] text-ink/55">
              Albümde herkese görünmesi için onayla.
            </span>
          </span>
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-ink/55" />
        ) : (
          <ChevronDown size={16} className="text-ink/55" />
        )}
      </button>

      {expanded && (
        <ul className="divide-y divide-copper/15 border-t border-copper/15 bg-white">
          {photos.map((p) => {
            const busy = busyIds.has(p.id);
            return (
              <li
                key={p.id}
                className="flex items-start gap-3 px-4 py-3 sm:px-5"
              >
                <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-black/5">
                  {p.photoPath ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.photoPath}
                      alt={p.caption ?? ""}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  {p.uploaderName && (
                    <p className="truncate text-[12px] font-semibold text-ink">
                      {p.uploaderName}
                    </p>
                  )}
                  {p.caption && (
                    <p className="line-clamp-2 text-[12px] leading-snug text-ink/65">
                      {p.caption}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink/40">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => decide(p.id, "APPROVED")}
                    disabled={busy}
                    aria-label="Onayla"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-green-600/30 bg-green-600/10 text-green-700 transition hover:bg-green-600/20 disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={14} strokeWidth={2.5} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(p.id, "REJECTED")}
                    disabled={busy}
                    aria-label="Reddet"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand transition hover:bg-brand/20 disabled:opacity-50"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// =============================================================================
// OwnerPhotoFab — fixed-position camera button for the card owner. One tap
// opens the OS file/camera picker; the selected file is uploaded straight to
// the album as APPROVED via ?asOwner=1. Sized for thumb reach on mobile and
// tucked into the bottom-right on desktop.
// =============================================================================
type FabState =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function OwnerPhotoFab({
  slug,
  editToken,
}: {
  slug: string;
  editToken: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<FabState>({ kind: "idle" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const flashToast = (next: FabState, ms = 2000) => {
    setState(next);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState({ kind: "idle" }), ms);
  };

  const handleSelect = async (file: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      flashToast({
        kind: "error",
        message: "Sadece JPEG, PNG veya WEBP",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      flashToast({ kind: "error", message: "Dosya çok büyük (max 5 MB)" });
      return;
    }

    setState({ kind: "uploading" });
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch(
        `/api/cards/${slug}/album?asOwner=1&t=${encodeURIComponent(editToken)}`,
        { method: "POST", body: fd },
      );
      if (!res.ok) {
        flashToast({ kind: "error", message: "Hata oluştu" });
        return;
      }
      flashToast({ kind: "success" });
    } catch {
      flashToast({ kind: "error", message: "Hata oluştu" });
    } finally {
      // Reset the input so the same file can be re-picked if the upload failed.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const uploading = state.kind === "uploading";

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
      />

      {/* Toast — always rendered so transitions don't pop the layout */}
      {state.kind !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "fixed bottom-24 right-6 z-50 max-w-[80vw] rounded-full px-4 py-2 text-[12px] font-semibold shadow-lg transition",
            state.kind === "success"
              ? "bg-green-600 text-white shadow-green-600/30"
              : state.kind === "error"
                ? "bg-brand text-white shadow-brand/30"
                : "bg-ink/90 text-white shadow-black/30",
          ].join(" ")}
        >
          {state.kind === "success"
            ? "✓ Eklendi"
            : state.kind === "error"
              ? state.message
              : "Yükleniyor..."}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Fotoğraf ekle"
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-copper text-white shadow-lg shadow-copper/30 transition hover:bg-copper-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {uploading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Camera size={20} />
        )}
      </button>
    </>
  );
}
