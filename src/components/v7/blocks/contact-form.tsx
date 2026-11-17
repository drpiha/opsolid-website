"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FormText } from "@/content/v7/form";
import type { BlockOf } from "@/content/v7/types";
import { href, type L3 } from "@/lib/v7-routes";
import { sendFailure, type SendFailure } from "@/lib/contact-feedback";

// C form (design "Werkstatt"): a sheet card (.wk-form), fields from src/styles/werkstatt/blocks.css (.wk-field). Control
// and chip borders use --wk-control (#7d7a74: 4.28:1 on white, 4.13:1 on sheet; WCAG 1.4.11 needs 3:1).
const chip =
  "inline-flex min-h-[44px] items-center rounded-[10px] border-[1.5px] border-wk-control bg-white px-4 text-[15px] font-[540] text-wk-ink transition-colors hover:border-wk-ink peer-checked:border-wk-ink peer-checked:bg-wk-ink peer-checked:text-wk-text-d peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wk-copper-deep";

type Field = "name" | "email" | "message" | "ttopics" | "languages" | "region" | "link" | "consent";
// Page order, so focus goes to the first invalid field the visitor sees.
const BASE: Field[] = ["name", "email", "message"];
const TRAINER_ORDER: Field[] = ["name", "email", "ttopics", "languages", "region", "link", "message", "consent"];
const TRAINER_ONLY: Field[] = ["ttopics", "languages", "region", "link", "consent"];
const LINK = /^https?:\/\/[^\s]+$/i;
// "linkedin.com/in/x" is meant as a link: add the scheme instead of rejecting it.
const normLink = (v: string) => (v && !/^https?:\/\//i.test(v) && /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v) ? `https://${v}` : v);
// The server rejects control characters in one-line fields (src/lib/contact-guard.ts); a pasted tab becomes a space.
const oneLine = (v: FormDataEntryValue | null) => String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
// The server's rules (src/lib/contact-guard.ts): name and message non-empty after trimming, the address
// matched with zod's email pattern. Checking them here gives a field-level error instead of a failed send.
const EMAIL = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;
const isValid = (k: Field, v: string) =>
  k === "email" ? EMAIL.test(v.trim()) : k === "link" ? v.trim() === "" || LINK.test(normLink(v.trim())) : v.trim().length > 0;

/** `t` is the form copy of this locale, passed by the server block (FormBlock) so the client bundle carries no copy. */
export function ContactForm({ block, locale, t }: { block: BlockOf<"form">; locale: L3; t: FormText }) {
  const tt = t.trainer;
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [tTopics, setTTopics] = useState<Set<string>>(new Set());
  // Trainer applications (anliegen=trainer) get structured fields; every other topic keeps the plain form.
  const isTrainer = topics.has("trainer");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [fail, setFail] = useState<SendFailure>({ kind: "down" });
  const [errs, setErrs] = useState<Partial<Record<Field, boolean>>>({});
  const [sentTrainer, setSentTrainer] = useState(false);
  const okRef = useRef<HTMLDivElement>(null);
  const failRef = useRef<HTMLDivElement>(null);
  const errText: Record<Field, string> = {
    name: t.errName,
    email: t.errEmail,
    message: isTrainer ? tt.errMessage : t.errMessage,
    ttopics: tt.errTopics,
    languages: tt.errLanguages,
    region: tt.errRegion,
    link: tt.errLink,
    consent: tt.errConsent,
  };

  // Pre-select a topic from ?anliegen=<value> (read after mount, so the server HTML stays identical).
  useEffect(() => {
    try {
      const want = new URLSearchParams(window.location.search).getAll("anliegen");
      const hit = block.topics.filter((x) => want.includes(x.value)).map((x) => x.value);
      if (hit.length) setTopics(new Set(hit.includes("trainer") ? ["trainer"] : hit));
    } catch {
      /* no query access: start with nothing selected */
    }
  }, [block.topics]);

  useEffect(() => {
    if (state === "ok") okRef.current?.focus();
    // The notice sits under the button; on a phone it can open below the fold. Bring it into view without
    // moving focus, so the visitor can correct a field and send again straight away.
    if (state === "err") failRef.current?.scrollIntoView({ block: "nearest" });
  }, [state, fail]);

  // "trainer" is an application, not an inquiry topic, so it is chosen on its own.
  const toggle = (v: string) => {
    const n = new Set(topics);
    if (n.has(v)) n.delete(v);
    else if (v === "trainer") {
      n.clear();
      n.add(v);
    } else {
      n.delete("trainer");
      n.add(v);
    }
    if (topics.has("trainer") && !n.has("trainer")) {
      setErrs((e) => {
        const x = { ...e };
        TRAINER_ONLY.forEach((k) => delete x[k]);
        return x;
      });
    }
    setTopics(n);
  };

  const toggleT = (v: string) => {
    const n = new Set(tTopics);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    setTTopics(n);
    if (n.size) setErrs((e) => ({ ...e, ttopics: false }));
  };

  // A marked field clears its error as soon as its value is valid.
  const recheck = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as HTMLInputElement;
    const k = el.name as Field;
    if (!errs[k]) return;
    if (k === "consent" ? el.checked : isValid(k, el.value)) setErrs({ ...errs, [k]: false });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const v = {
      name: oneLine(f.get("name")),
      email: String(f.get("email") ?? "").trim(),
      company: oneLine(f.get("company")),
      message: String(f.get("message") ?? ""),
      languages: oneLine(f.get("languages")),
      region: oneLine(f.get("region")),
      link: normLink(oneLine(f.get("link"))),
      rate: oneLine(f.get("rate")),
    };
    const check = (k: Field) =>
      k === "ttopics" ? tTopics.size > 0 : k === "consent" ? f.get("consent") === "on" : isValid(k, v[k as keyof typeof v]);
    const bad = (isTrainer ? TRAINER_ORDER : BASE).filter((k) => !check(k));
    const next: Partial<Record<Field, boolean>> = {};
    bad.forEach((k) => {
      next[k] = true;
    });
    setErrs(next);
    if (bad.length) {
      setState("idle");
      const first = bad[0] === "ttopics" ? document.getElementById("f-ttopics") : form.elements.namedItem(bad[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setState("sending");
    let res: Response;
    // A request that hangs ends as the "down" notice instead of leaving the button on "sending".
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 20_000);
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        signal: abort.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          company: v.company || undefined,
          message: v.message,
          hp_blank: String(f.get("hp_blank") ?? ""),
          topics: block.topics.filter((x) => topics.has(x.value)).map((x) => x.label),
          kinds: block.topics.filter((x) => topics.has(x.value)).map((x) => x.value),
          trainer: isTrainer
            ? {
                topics: tt.topics.map(([k]) => k).filter((k) => tTopics.has(k)),
                languages: v.languages,
                region: v.region,
                link: v.link || undefined,
                rate: v.rate || undefined,
                consent: true,
              }
            : undefined,
          source: `v7-contact-${locale}`,
        }),
      });
    } catch {
      setFail(sendFailure(null, null));
      setState("err");
      return;
    } finally {
      clearTimeout(timer);
    }
    // 429 (rate limit), 400 (content rejected) and 503 or anything else (delivery) each get their own message;
    // the typed values stay in the form for every failure.
    if (!res.ok) {
      setFail(sendFailure(res.status, res.headers.get("Retry-After")));
      setState("err");
      return;
    }
    form.reset();
    setTopics(new Set());
    setTTopics(new Set());
    setSentTrainer(isTrainer);
    setState("ok");
  };

  // The failure text with {wait} filled in and {mail} as the mailto link.
  const failText = () => {
    const raw = fail.kind === "busy" ? t.failBusy : fail.kind === "invalid" ? t.failInvalid : t.failDown;
    const wait = fail.kind === "busy" ? (fail.minutes === 1 ? t.waitMinutes[0] : t.waitMinutes[1].replace("{n}", String(fail.minutes))) : "";
    const [before, after = ""] = raw.replace("{wait}", wait).split("{mail}");
    return (
      <>
        {before}
        <a className="font-semibold underline underline-offset-4" href={`mailto:${t.mail}`}>
          {t.mail}
        </a>
        {after}
      </>
    );
  };

  const mark = (k: Field, help?: string) => ({
    "aria-invalid": errs[k] ? true : undefined,
    "aria-describedby": [help, errs[k] ? `f-${k}-err` : undefined].filter(Boolean).join(" ") || undefined,
  });
  const err = (k: Field) =>
    errs[k] ? (
      <p className="wk-field-error" id={`f-${k}-err`}>
        {errText[k]}
      </p>
    ) : null;
  const help = (id: string, text: string) => (
    <p id={id} className="wk-field-hint">
      {text}
    </p>
  );

  if (state === "ok") {
    return (
      <div ref={okRef} tabIndex={-1} role="status" className="wk-form wk-form-ok">
        <p className="wk-etikett is-solid">{sentTrainer ? tt.okH : t.okH}</p>
        <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.5]">{sentTrainer ? tt.ok : t.ok}</p>
      </div>
    );
  }

  // noValidate: the checks above replace the browser bubbles (which follow the browser language, not the page).
  // The trainer blocks stay mounted and are only hidden, so typed values survive switching the topic back and forth.
  return (
    <form onSubmit={submit} onInput={recheck} noValidate className="wk-form">
      {block.intro && <p className="wk-form-intro">{block.intro}</p>}
      <div className="wk-form-grid">
        <div className="wk-field">
          <label htmlFor="f-name">{t.name}</label>
          <input id="f-name" name="name" type="text" autoComplete="name" required maxLength={120} {...mark("name", "f-name-h")} />
          {help("f-name-h", t.nameHelp)}
          {err("name")}
        </div>
        <div className="wk-field">
          <label htmlFor="f-email">{t.email}</label>
          <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} {...mark("email", "f-email-h")} />
          {help("f-email-h", t.emailHelp)}
          {err("email")}
        </div>
        <div className="wk-field is-wide">
          <label htmlFor="f-company">{t.company}</label>
          <input id="f-company" name="company" type="text" autoComplete="organization" maxLength={160} />
        </div>
        <fieldset className="wk-field is-wide m-0 border-0 p-0" aria-describedby="f-topics-h">
          <legend>{t.topics}</legend>
          <ul className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0">
            {block.topics.map((x) => (
              <li key={x.value}>
                <label className="relative inline-flex">
                  <input type="checkbox" checked={topics.has(x.value)} onChange={() => toggle(x.value)} className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  <span className={chip}>{x.label}</span>
                </label>
              </li>
            ))}
          </ul>
          {help("f-topics-h", isTrainer ? tt.alone : t.topicsHelp)}
        </fieldset>
        {/* For an application a copper rule spans the trainer fields and the Kurzprofil, so the whole application
            reads as one section; for an inquiry the wrapper is plain and the message field looks as before. */}
        <div
          role={isTrainer ? "group" : undefined}
          aria-labelledby={isTrainer ? "f-trainer-h" : undefined}
          className={`col-span-full grid gap-[18px] ${isTrainer ? "border-l-2 border-wk-copper pl-5 md:pl-7" : ""}`}
        >
          <div hidden={!isTrainer} className="grid gap-[18px] [&[hidden]]:hidden" data-testid="trainer-fields">
            <p id="f-trainer-h" className="wk-etikett is-solid">
              {tt.group}
            </p>
            <fieldset className="wk-field m-0 border-0 p-0" aria-describedby={errs.ttopics ? "f-ttopics-h f-ttopics-err" : "f-ttopics-h"}>
              <legend>{tt.legend}</legend>
              <ul className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0">
                {tt.topics.map(([k, text], i) => (
                  <li key={k}>
                    <label className="relative inline-flex">
                      <input
                        id={i === 0 ? "f-ttopics" : undefined}
                        type="checkbox"
                        checked={tTopics.has(k)}
                        onChange={() => toggleT(k)}
                        aria-invalid={errs.ttopics ? true : undefined}
                        aria-describedby={errs.ttopics ? "f-ttopics-err" : undefined}
                        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <span className={chip}>{text}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {help("f-ttopics-h", tt.topicsHelp)}
              {err("ttopics")}
            </fieldset>
            <div className="wk-field">
              <label htmlFor="f-languages">{tt.languages}</label>
              <input id="f-languages" name="languages" type="text" required maxLength={160} {...mark("languages", "f-languages-h")} />
              {help("f-languages-h", tt.languagesHelp)}
              {err("languages")}
            </div>
            <div className="wk-field">
              <label htmlFor="f-region">{tt.region}</label>
              <input id="f-region" name="region" type="text" required maxLength={160} {...mark("region", "f-region-h")} />
              {help("f-region-h", tt.regionHelp)}
              {err("region")}
            </div>
            <div className="wk-field">
              <label htmlFor="f-link">{tt.link}</label>
              <input id="f-link" name="link" type="url" inputMode="url" autoComplete="url" maxLength={300} placeholder="https://" {...mark("link", "f-link-h")} />
              {help("f-link-h", tt.linkHelp)}
              {err("link")}
            </div>
            <div className="wk-field">
              <label htmlFor="f-rate">{tt.rate}</label>
              <input id="f-rate" name="rate" type="text" maxLength={160} aria-describedby="f-rate-h" />
              {help("f-rate-h", tt.rateHelp)}
            </div>
          </div>
          <div className="wk-field">
            <label htmlFor="f-message">{isTrainer ? tt.message : t.message}</label>
            <textarea id="f-message" name="message" required maxLength={10000} rows={6} className="min-h-[160px]" {...mark("message", "f-message-h")} />
            {help("f-message-h", isTrainer ? tt.messageHelp : t.messageHelp)}
            {err("message")}
          </div>
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        {/* Spam trap. Its name must not be a word that browser autofill or a password manager knows: a trap
            called "website" can be filled from a contact card, and the route then drops a real message. */}
        <label htmlFor="f-hp">{t.honeypot}</label>
        <input id="f-hp" name="hp_blank" type="text" tabIndex={-1} autoComplete="off" data-1p-ignore="true" data-lpignore="true" data-form-type="other" />
      </div>
      <div hidden={!isTrainer} className="mt-5">
        <label className="wk-check min-h-[44px] cursor-pointer py-[10px] text-[16px] leading-[1.5]">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={errs.consent ? true : undefined}
            aria-describedby={errs.consent ? "f-consent-err" : undefined}
            className="cursor-pointer"
          />
          <span>
            {tt.consent}{" "}
            <a className="whitespace-nowrap text-wk-copper-deep underline underline-offset-4" href={href("privacy", locale, { hash: "bewerbungen" })} target="_blank" rel="noopener">
              {tt.consentLink}
              <span className="sr-only"> {tt.newTab}</span>
            </a>
          </span>
        </label>
        {err("consent")}
      </div>
      <div className="wk-form-foot">
        {/* Decision 79: the reply promise sits right above the send button (trainer applications: waiting list, see form.ts). */}
        <p className="wk-form-reply" hidden={isTrainer || undefined}>
          {t.reply}
        </p>
        <button type="submit" aria-disabled={state === "sending" || undefined} className="wk-btn wk-btn-ink">
          {state === "sending" ? t.sending : isTrainer ? tt.send : t.send}
        </button>
      </div>
      {/* Always mounted, so screen readers announce the notice when it appears. */}
      <div role="alert">
        {state === "err" ? (
          <div ref={failRef} className="wk-form-status is-error scroll-mb-6">
            <p className="wk-etikett">{t.failH}</p>
            <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.55] [text-wrap:pretty]">{failText()}</p>
          </div>
        ) : null}
      </div>
      <p className="wk-form-consent" hidden={isTrainer || undefined}>
        {t.consent}{" "}
        <a className="text-wk-copper-deep underline underline-offset-4" href={href("privacy", locale)}>
          {t.privacy}
        </a>
        .
      </p>
    </form>
  );
}
