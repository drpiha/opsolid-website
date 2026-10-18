"use client";

import { useState } from "react";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";

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
    err: "Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie direkt an info@opsolid.de.",
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
    err: "Your message could not be sent. Please write directly to info@opsolid.de.",
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
    err: "Mesajınız gönderilemedi. Lütfen doğrudan info@opsolid.de adresine yazın.",
    consent: "Bilgilerinizi yalnızca talebinizi yanıtlamak için kullanırız. Ayrıntılar",
    privacy: "gizlilik politikasında",
    topicList: ["YZ agent'ları", "Web siteleri", "Otomasyon", "YZ kontrolü", "YZ eğitimleri", "Diğer"],
  },
} as const;

export function ContactForm4() {
  const { locale } = useLocale();
  const loc = locale === "de" || locale === "tr" ? locale : "en";
  const t = T[loc];
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const toggle = (k: string) => {
    const n = new Set(topics);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setTopics(n);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // React clears currentTarget after the synchronous part of the handler; keep the form itself.
    const form = e.currentTarget;
    const f = new FormData(form);
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

  return (
    <form className="v4-form" onSubmit={submit} noValidate={false}>
      <div className="v4-field">
        <label htmlFor="c-name">{t.name}</label>
        <input id="c-name" name="name" type="text" autoComplete="name" required maxLength={120} />
      </div>
      <div className="v4-field">
        <label htmlFor="c-email">{t.email}</label>
        <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} />
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
        <textarea id="c-message" name="message" required maxLength={10000} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="v4-btn v4-btn-primary v4-btn-lg" disabled={state === "sending"}>
        {state === "sending" ? t.sending : t.send}
      </button>
      <p className="v4-note" style={{ margin: 0 }}>
        {t.consent} <a className="v4-link" href={`/${loc}/privacy`}>{t.privacy}</a>.
      </p>
      <p className={`v4-form-msg ${state === "ok" ? "is-ok" : state === "err" ? "is-err" : ""}`} role="status" aria-live="polite">
        {state === "ok" ? t.ok : state === "err" ? t.err : ""}
      </p>
    </form>
  );
}
