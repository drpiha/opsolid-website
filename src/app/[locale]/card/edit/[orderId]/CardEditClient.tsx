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

import { useEffect, useMemo, useState } from "react";
import { Loader2, Upload, AlertCircle, CheckCircle2, Check } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { useLocale } from "@/context/LocaleContext";
import { TemplateRenderer } from "@/components/cards/TemplateRenderer";
import type { CardData, ImagePosition } from "@/lib/validation";
import { PhotoEditor } from "@/components/cards/PhotoEditor";
import { CustomSectionsEditor } from "@/components/cards/order-form/CustomSectionsEditor";
import { CustomSectionsBlock } from "@/components/cards/templates/v2/shared/CustomSectionsBlock";
import { TYPOGRAPHY_PRESET_LIST, getTypographyPreset } from "@/lib/typographyPresets";
import { getTemplateEntry } from "@/components/cards/templates/v2/registry";

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
        setErrorMsg(body.error ?? edit.savedError);
        setFormState("error");
        return;
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
        <div className="mb-10 max-w-3xl">
          <p className="text-eyebrow uppercase tracking-wider text-ink/50">
            OpSolid · Digital Card
          </p>
          <h1 className="mt-3 font-display text-display-sm text-ink">
            {edit.title}
          </h1>
          <p className="mt-3 text-body text-ink/60">{edit.subtitle}</p>
          {props.slug && props.status === "PUBLISHED" && (
            <p className="mt-3 text-sm text-ink/60">
              {edit.publicUrlLabel}{" "}
              <a
                href={`/c/${props.slug}`}
                className="font-medium text-ink underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                /c/{props.slug}
              </a>
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_minmax(320px,420px)]"
        >
          {/* ================ LEFT ================ */}
          <div className="space-y-10">
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
    </main>
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
