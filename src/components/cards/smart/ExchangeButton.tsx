"use client";

// =============================================================================
// ExchangeButton — "Kartımı Gönder" / "Send my card" CTA.
//
// A visitor who *also* owns a published OpSolid card can press this to create
// a CardConnection (card-to-card link) with the owner of the card they're
// viewing. Complements SendMyInfoButton (which writes a one-off CardLead) by
// creating a structured, idempotent two-card relationship.
//
// Slug discovery order (one-time, on mount):
//   1. ?visitor=<slug> in the URL  → cached to localStorage["myCardSlug"]
//   2. localStorage["myCardSlug"]
//   3. nothing → button opens a small modal asking for the visitor's slug
//
// Once the visitor has set a slug, every subsequent card visit POSTs without
// any modal: a single tap creates the connection.
// =============================================================================

import { useEffect, useState } from "react";
import { Send, X, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface Props {
  slug: string;
  primary: string;
  locale?: "de" | "en" | "tr";
}

type Status = "idle" | "submitting" | "ok" | "duplicate" | "error";

const STRINGS = {
  de: {
    cta: "Kartımı Gönder",
    modalTitle: "Kartenadresse",
    modalPrompt: "Geben Sie die Adresse Ihrer eigenen Karte ein:",
    modalPrefix: "go.opsolid.de/",
    modalPlaceholder: "mein-name",
    modalSave: "Senden",
    modalCancel: "Abbrechen",
    success: "Kartvizitiniz gönderildi! Bağlantı oluşturuldu.",
    duplicate: "Daha önce gönderildiniz.",
    error: "Bağlantı oluşturulamadı. Lütfen tekrar deneyin.",
    networkError: "Netzwerkfehler. Bitte erneut versuchen.",
    selfError: "Aynı kart ile takas yapılamaz.",
    sending: "Wird gesendet…",
  },
  en: {
    cta: "Send my card",
    modalTitle: "Your card address",
    modalPrompt: "Enter the address of your own OpSolid card:",
    modalPrefix: "go.opsolid.de/",
    modalPlaceholder: "my-name",
    modalSave: "Send",
    modalCancel: "Cancel",
    success: "Your card has been sent. Connection created.",
    duplicate: "You've already shared with this card.",
    error: "Could not create connection. Please try again.",
    networkError: "Network error. Please try again.",
    selfError: "Cannot exchange a card with itself.",
    sending: "Sending…",
  },
  tr: {
    cta: "Kartımı Gönder",
    modalTitle: "Kart adresiniz",
    modalPrompt: "Kendi OpSolid kartınızın adresini girin:",
    modalPrefix: "go.opsolid.de/",
    modalPlaceholder: "kullanici-adim",
    modalSave: "Gönder",
    modalCancel: "İptal",
    success: "Kartvizitiniz gönderildi! Bağlantı oluşturuldu.",
    duplicate: "Daha önce gönderildiniz.",
    error: "Bağlantı oluşturulamadı. Lütfen tekrar deneyin.",
    networkError: "Ağ hatası. Lütfen tekrar deneyin.",
    selfError: "Aynı kart ile takas yapılamaz.",
    sending: "Gönderiliyor…",
  },
} as const;

const LS_KEY = "myCardSlug";

export function ExchangeButton({ slug, primary, locale = "de" }: Props) {
  const t = STRINGS[locale] ?? STRINGS.de;

  const [open, setOpen] = useState(false);
  const [mySlug, setMySlug] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [draftSlug, setDraftSlug] = useState("");

  // ---------------------------------------------------------------------------
  // Hydrate visitor slug on mount: query param wins (and is persisted),
  // otherwise fall back to localStorage. Wrapped in try/catch because some
  // privacy modes throw on localStorage access.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const fromQuery = (search.get("visitor") ?? "").trim();
      if (fromQuery) {
        setMySlug(fromQuery);
        try {
          window.localStorage.setItem(LS_KEY, fromQuery);
        } catch {
          // ignore — non-blocking
        }
        return;
      }
      const stored = window.localStorage.getItem(LS_KEY);
      if (stored && stored.trim()) {
        setMySlug(stored.trim());
      }
    } catch {
      // SSR / privacy mode — no-op
    }
  }, []);

  // Auto-dismiss the status banner after 4s for non-idle, non-submitting
  // states. Submitting is left visible until the request resolves.
  useEffect(() => {
    if (status === "idle" || status === "submitting") return;
    const timer = setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [status]);

  // ESC closes modal — mirrors SendMyInfoButton.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function readSourceFromUrl(): { source?: string; campaign?: string } {
    try {
      const search = new URLSearchParams(window.location.search);
      const source = (search.get("src") ?? "").trim();
      const campaign = (search.get("campaign") ?? "").trim();
      return {
        source: source || undefined,
        campaign: campaign || undefined,
      };
    } catch {
      return {};
    }
  }

  async function postExchange(visitorSlug: string) {
    setStatus("submitting");
    setErrorMsg("");
    const { source, campaign } = readSourceFromUrl();
    try {
      const res = await fetch(
        `/api/cards/${encodeURIComponent(slug)}/exchange`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ visitorSlug, source, campaign }),
        },
      );
      const body = (await res.json().catch(() => null)) as
        | { ok?: boolean; existing?: boolean; error?: string }
        | null;

      if (res.ok) {
        if (body?.existing === true) {
          setStatus("duplicate");
        } else {
          setStatus("ok");
        }
        return;
      }

      if (
        res.status === 400 &&
        body?.error === "Cannot exchange with yourself."
      ) {
        setErrorMsg(t.selfError);
        setStatus("error");
        return;
      }

      setErrorMsg(body?.error ?? t.error);
      setStatus("error");
    } catch {
      setErrorMsg(t.networkError);
      setStatus("error");
    }
  }

  function handleClick() {
    if (status === "submitting") return;
    if (mySlug) {
      void postExchange(mySlug);
    } else {
      setDraftSlug("");
      setOpen(true);
    }
  }

  function handleModalSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = draftSlug.trim();
    if (!trimmed) return;
    try {
      window.localStorage.setItem(LS_KEY, trimmed);
    } catch {
      // ignore — still proceed with in-memory slug
    }
    setMySlug(trimmed);
    setOpen(false);
    void postExchange(trimmed);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "submitting"}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60"
        style={{
          borderColor: primary,
          color: primary,
          background: `${primary}10`,
        }}
      >
        <Send size={15} strokeWidth={2.2} />
        {status === "submitting" ? t.sending : t.cta}
      </button>

      {status !== "idle" && status !== "submitting" && (
        <StatusBanner
          status={status}
          message={
            status === "ok"
              ? t.success
              : status === "duplicate"
                ? t.duplicate
                : errorMsg || t.error
          }
          primary={primary}
        />
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exchange-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-bg-1 ring-1 ring-line sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3
                id="exchange-modal-title"
                className="text-base font-semibold text-ink"
              >
                {t.modalTitle}
              </h3>
              <button
                type="button"
                aria-label={t.modalCancel}
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-ink-300 hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </header>

            <form
              onSubmit={handleModalSave}
              className="grid gap-4 px-5 py-5 text-sm"
              noValidate
            >
              <p className="text-sm text-ink-300">{t.modalPrompt}</p>

              <label className="grid gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                  {t.modalTitle}
                </span>
                <div className="flex items-stretch overflow-hidden rounded-xl border border-line bg-bg-2 focus-within:border-line-firm focus-within:ring-1 focus-within:ring-line-firm">
                  <span className="flex shrink-0 items-center bg-bg-3 px-3 font-mono text-xs text-ink-400">
                    {t.modalPrefix}
                  </span>
                  <input
                    autoFocus
                    name="visitorSlug"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={draftSlug}
                    onChange={(e) => setDraftSlug(e.target.value)}
                    placeholder={t.modalPlaceholder}
                    className="w-full bg-transparent px-3 py-2 text-sm text-ink placeholder-ink-400 focus:outline-none"
                  />
                </div>
              </label>

              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-pill border border-line bg-bg-2 px-4 py-2 text-sm font-medium text-ink hover:bg-bg-3"
                >
                  {t.modalCancel}
                </button>
                <button
                  type="submit"
                  disabled={!draftSlug.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-depth-2 transition active:scale-[0.99] disabled:opacity-60"
                  style={{ background: primary }}
                >
                  <Send size={14} strokeWidth={2.2} />
                  {t.modalSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBanner({
  status,
  message,
  primary,
}: {
  status: Exclude<Status, "idle" | "submitting">;
  message: string;
  primary: string;
}) {
  const tone =
    status === "ok"
      ? {
          icon: <CheckCircle2 size={14} strokeWidth={2.2} />,
          style: { background: `${primary}15`, color: primary, borderColor: `${primary}55` },
        }
      : status === "duplicate"
        ? {
            icon: <Info size={14} strokeWidth={2.2} />,
            style: undefined,
          }
        : {
            icon: <AlertCircle size={14} strokeWidth={2.2} />,
            style: undefined,
          };

  if (status === "duplicate") {
    return (
      <div
        role="status"
        className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-bg-2 px-3 py-2 text-xs text-ink-300"
      >
        {tone.icon}
        <span>{message}</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="mt-2 flex items-center gap-2 rounded-xl border border-signal-err/40 bg-signal-err/10 px-3 py-2 text-xs text-signal-err"
      >
        {tone.icon}
        <span>{message}</span>
      </div>
    );
  }

  // ok
  return (
    <div
      role="status"
      className="mt-2 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs"
      style={tone.style}
    >
      {tone.icon}
      <span>{message}</span>
    </div>
  );
}
