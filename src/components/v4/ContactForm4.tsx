"use client";

import { useState, type FormEvent } from "react";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";

const MAIL = "info@opsolid.de";

const T = {
  de: {
    name: "Name",
    email: "E-Mail",
    company: "Firma (optional)",
    topics: "Worum geht es?",
    message: "Nachricht",
    send: "Nachricht senden",
    sending: "Wird gesendet …",
    ok: "Danke, Ihre Nachricht ist bei uns angekommen. Wir antworten in der Regel innerhalb weniger Arbeitstage.",
    err: ["Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie direkt an ", "."],
    errName: "Bitte geben Sie Ihren Namen an.",
    errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
    errMessage: "Bitte schreiben Sie kurz, worum es geht.",
    consent: "Ihre Angaben verwenden wir nur, um Ihre Anfrage zu beantworten. Mehr dazu in der",
    privacy: "Datenschutzerklärung",
    topicList: ["KI-Agents", "Websites", "Automatisierung", "KI-Check", "KI-Schulungen", "Sonstiges"],
  },
  en: {
    name: "Name",
    email: "Email",
    company: "Company (optional)",
    topics: "What is it about?",
    message: "Message",
    send: "Send message",
    sending: "Sending …",
    ok: "Thank you, your message has reached us. We usually reply within a few working days.",
    err: ["Your message could not be sent. Please write directly to ", "."],
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errMessage: "Please tell us briefly what it is about.",
    consent: "We use your details only to answer your inquiry. More in the",
    privacy: "privacy policy",
    topicList: ["AI agents", "Websites", "Automation", "AI check", "AI training", "Other"],
  },
  tr: {
    name: "Ad",
    email: "E-posta",
    company: "Şirket (isteğe bağlı)",
    topics: "Konu nedir?",
    message: "Mesaj",
    send: "Mesajı gönder",
    sending: "Gönderiliyor …",
    ok: "Teşekkürler, mesajınız bize ulaştı. Genellikle birkaç iş günü içinde yanıt veriyoruz.",
    err: ["Mesajınız gönderilemedi. Lütfen doğrudan ", " adresine yazın."],
    errName: "Lütfen adınızı girin.",
    errEmail: "Lütfen geçerli bir e-posta adresi girin.",
    errMessage: "Lütfen konunuzu kısaca yazın.",
    consent: "Bilgilerinizi yalnızca talebinizi yanıtlamak için kullanırız. Ayrıntılar",
    privacy: "gizlilik politikasında",
    topicList: ["YZ agent'ları", "Web siteleri", "Otomasyon", "YZ kontrolü", "YZ eğitimleri", "Diğer"],
  },
} as const;

type Field = "name" | "email" | "message";
const FIELDS: Field[] = ["name", "email", "message"];
// The server's rules (src/lib/contact-guard.ts): name and message non-empty after trimming, the address
// matched with zod's email pattern. Checking them here gives a field-level error instead of a failed send.
const EMAIL = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;
const isValid = (k: Field, v: string) => (k === "email" ? EMAIL.test(v.trim()) : v.trim().length > 0);

export function ContactForm4() {
  const { locale } = useLocale();
  const loc = locale === "de" || locale === "tr" ? locale : "en";
  const t = T[loc];
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errs, setErrs] = useState<Partial<Record<Field, boolean>>>({});
  const errText: Record<Field, string> = { name: t.errName, email: t.errEmail, message: t.errMessage };

  const toggle = (k: string) => {
    const n = new Set(topics);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setTopics(n);
  };

  // A marked field clears its error as soon as its value is valid.
  const recheck = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as HTMLInputElement;
    const k = el.name as Field;
    if (errs[k] && isValid(k, el.value)) setErrs({ ...errs, [k]: false });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The button is aria-disabled while sending (it keeps focus); a repeated submit is ignored here.
    if (state === "sending") return;
    // React clears currentTarget after the synchronous part of the handler; keep the form itself.
    const form = e.currentTarget;
    const f = new FormData(form);
    const bad = FIELDS.filter((k) => !isValid(k, String(f.get(k) ?? "")));
    const next: Partial<Record<Field, boolean>> = {};
    bad.forEach((k) => {
      next[k] = true;
    });
    setErrs(next);
    if (bad.length) {
      setState("idle");
      const first = form.elements.namedItem(bad[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(f.get("name") ?? ""),
          email: String(f.get("email") ?? ""),
          company: String(f.get("company") ?? "") || undefined,
          message: String(f.get("message") ?? ""),
          website: String(f.get("website") ?? ""),
          topics: Array.from(topics),
          source: `v4-contact-${loc}`,
        }),
      });
      setState(res.ok ? "ok" : "err");
      if (res.ok) {
        form.reset();
        setTopics(new Set());
      }
    } catch {
      setState("err");
    }
  };

  /** aria-invalid plus the error text as description, only while the field is marked. */
  const mark = (k: Field) => ({ "aria-invalid": errs[k] ? true : undefined, "aria-describedby": errs[k] ? `c-${k}-err` : undefined });
  const err = (k: Field) =>
    errs[k] ? (
      <p className="v4-field-err" id={`c-${k}-err`}>
        {errText[k]}
      </p>
    ) : null;

  // noValidate: the checks above replace the browser bubbles (which follow the browser language, not the page).
  return (
    <form className="v4-form" onSubmit={submit} onInput={recheck} noValidate>
      <div className="v4-field">
        <label htmlFor="c-name">{t.name}</label>
        <input id="c-name" name="name" type="text" autoComplete="name" required maxLength={120} {...mark("name")} />
        {err("name")}
      </div>
      <div className="v4-field">
        <label htmlFor="c-email">{t.email}</label>
        <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} {...mark("email")} />
        {err("email")}
      </div>
      <div className="v4-field">
        <label htmlFor="c-company">{t.company}</label>
        <input id="c-company" name="company" type="text" autoComplete="organization" maxLength={160} />
      </div>
      <fieldset className="v4-field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontFamily: "var(--v4-mono)", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--v4-ink3)", marginBottom: 8 }}>{t.topics}</legend>
        <ul className="v4-tags" style={{ marginTop: 0, padding: 0 }}>
          {t.topicList.map((k) => (
            <li key={k} style={{ padding: 0, border: 0 }}>
              <button
                type="button"
                aria-pressed={topics.has(k)}
                onClick={() => toggle(k)}
                className="v4-topic"
              >
                {k}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="v4-field">
        <label htmlFor="c-message">{t.message}</label>
        <textarea id="c-message" name="message" required maxLength={10000} {...mark("message")} />
        {err("message")}
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="v4-form-send">
        <button type="submit" className="v4-btn v4-btn-primary v4-btn-lg" aria-disabled={state === "sending" || undefined}>
          {state === "sending" ? t.sending : t.send}
        </button>
        <p className="v4-form-msg is-ok" role="status" aria-live="polite">
          {state === "ok" ? t.ok : null}
        </p>
        <p className="v4-form-msg is-err" role="alert">
          {state === "err" ? (
            <span>
              {t.err[0]}
              <a className="v4-link" href={`mailto:${MAIL}`}>
                {MAIL}
              </a>
              {t.err[1]}
            </span>
          ) : null}
        </p>
      </div>
      <p className="v4-note" style={{ margin: 0 }}>
        {t.consent} <a className="v4-link" href={`/${loc}/privacy`}>{t.privacy}</a>.
      </p>
    </form>
  );
}
