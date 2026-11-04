"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FORM } from "@/content/v7/form";
import type { BlockOf } from "@/content/v7/types";
import { href, type L3 } from "@/lib/v7-routes";

const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";
const label = `${mono} mb-2 block text-[12px] uppercase text-[#6B665F]`;
// Control and chip borders are #8F877C: 3.5:1 on paper and 3.2:1 on porcelain (WCAG 1.4.11 needs 3:1).
const control =
  "block min-h-[52px] w-full rounded-[16px] border border-[#8F877C] bg-white px-4 py-3 text-[17px] text-[#16191D] placeholder:text-[#6B665F] aria-[invalid=true]:border-[#A12A1B]";
const chip =
  "inline-flex min-h-[44px] items-center rounded-full border border-[#8F877C] bg-white px-4 text-[16px] transition-colors peer-checked:border-[#16191D] peer-checked:bg-[#16191D] peer-checked:text-[#F6F2EC] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8A4524]";

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

export function ContactForm({ block, locale }: { block: BlockOf<"form">; locale: L3 }) {
  const t = FORM[locale];
  const tt = t.trainer;
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [tTopics, setTTopics] = useState<Set<string>>(new Set());
  // Trainer applications (anliegen=trainer) get structured fields; every other topic keeps the plain form.
  const isTrainer = topics.has("trainer");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errs, setErrs] = useState<Partial<Record<Field, boolean>>>({});
  const [sentTrainer, setSentTrainer] = useState(false);
  const okRef = useRef<HTMLDivElement>(null);
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
  }, [state]);

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
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          company: v.company || undefined,
          message: v.message,
          website: String(f.get("website") ?? ""),
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
      // 503 (mail delivery not configured), 429 (rate limit) and any other failure all show the same fallback.
      setState(res.ok ? "ok" : "err");
      if (res.ok) {
        form.reset();
        setTopics(new Set());
        setTTopics(new Set());
        setSentTrainer(isTrainer);
      }
    } catch {
      setState("err");
    }
  };

  const mark = (k: Field, help?: string) => ({
    "aria-invalid": errs[k] ? true : undefined,
    "aria-describedby": [help, errs[k] ? `f-${k}-err` : undefined].filter(Boolean).join(" ") || undefined,
  });
  const err = (k: Field) =>
    errs[k] ? (
      <p className="mt-2 text-[15px] font-medium text-[#A12A1B]" id={`f-${k}-err`}>
        {errText[k]}
      </p>
    ) : null;
  const help = (id: string, text: string) => (
    <p id={id} className="mt-2 text-[14px] leading-[1.5] text-[#6B665F]">
      {text}
    </p>
  );

  if (state === "ok") {
    return (
      <div ref={okRef} tabIndex={-1} role="status" className="mt-10 rounded-[24px] border border-[#8A4524] bg-white p-6 md:mt-14 md:p-8">
        <p className={`${mono} text-[12px] uppercase text-[#8A4524]`}>{sentTrainer ? tt.okH : t.okH}</p>
        <p className="mt-3 max-w-[52ch] text-[18px]">{sentTrainer ? tt.ok : t.ok}</p>
      </div>
    );
  }

  // noValidate: the checks above replace the browser bubbles (which follow the browser language, not the page).
  // The trainer blocks stay mounted and are only hidden, so typed values survive switching the topic back and forth.
  return (
    <form onSubmit={submit} onInput={recheck} noValidate className="mt-10 max-w-[720px] space-y-7 md:mt-14">
      {block.intro && <p className="text-[#16191D]">{block.intro}</p>}
      <div>
        <label htmlFor="f-name" className={label}>
          {t.name}
        </label>
        <input id="f-name" name="name" type="text" autoComplete="name" required maxLength={120} className={control} {...mark("name", "f-name-h")} />
        {help("f-name-h", t.nameHelp)}
        {err("name")}
      </div>
      <div>
        <label htmlFor="f-email" className={label}>
          {t.email}
        </label>
        <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} className={control} {...mark("email", "f-email-h")} />
        {help("f-email-h", t.emailHelp)}
        {err("email")}
      </div>
      <div>
        <label htmlFor="f-company" className={label}>
          {t.company}
        </label>
        <input id="f-company" name="company" type="text" autoComplete="organization" maxLength={160} className={control} />
      </div>
      <fieldset className="m-0 border-0 p-0" aria-describedby="f-topics-h">
        <legend className={label}>{t.topics}</legend>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
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
      {/* For an application the copper rule spans the trainer fields and the Kurzprofil, so the whole application
          reads as one section; for an inquiry the wrapper is plain and the message field looks as before. */}
      <div
        role={isTrainer ? "group" : undefined}
        aria-labelledby={isTrainer ? "f-trainer-h" : undefined}
        className={isTrainer ? "space-y-7 border-l-2 border-[#B5623A] pl-5 md:pl-7" : "space-y-7"}
      >
        <div hidden={!isTrainer} className="space-y-7" data-testid="trainer-fields">
          <p id="f-trainer-h" className={`${mono} text-[12px] uppercase text-[#8A4524]`}>
            {tt.group}
          </p>
          <fieldset className="m-0 border-0 p-0" aria-describedby={errs.ttopics ? "f-ttopics-h f-ttopics-err" : "f-ttopics-h"}>
            <legend className={label}>{tt.legend}</legend>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
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
          <div>
            <label htmlFor="f-languages" className={label}>
              {tt.languages}
            </label>
            <input id="f-languages" name="languages" type="text" required maxLength={160} className={control} {...mark("languages", "f-languages-h")} />
            {help("f-languages-h", tt.languagesHelp)}
            {err("languages")}
          </div>
          <div>
            <label htmlFor="f-region" className={label}>
              {tt.region}
            </label>
            <input id="f-region" name="region" type="text" required maxLength={160} className={control} {...mark("region", "f-region-h")} />
            {help("f-region-h", tt.regionHelp)}
            {err("region")}
          </div>
          <div>
            <label htmlFor="f-link" className={label}>
              {tt.link}
            </label>
            <input id="f-link" name="link" type="url" inputMode="url" autoComplete="url" maxLength={300} placeholder="https://" className={control} {...mark("link", "f-link-h")} />
            {help("f-link-h", tt.linkHelp)}
            {err("link")}
          </div>
          <div>
            <label htmlFor="f-rate" className={label}>
              {tt.rate}
            </label>
            <input id="f-rate" name="rate" type="text" maxLength={160} className={control} aria-describedby="f-rate-h" />
            {help("f-rate-h", tt.rateHelp)}
          </div>
        </div>
        <div>
          <label htmlFor="f-message" className={label}>
            {isTrainer ? tt.message : t.message}
          </label>
          <textarea id="f-message" name="message" required maxLength={10000} rows={6} className={`${control} min-h-[160px]`} {...mark("message", "f-message-h")} />
          {help("f-message-h", isTrainer ? tt.messageHelp : t.messageHelp)}
          {err("message")}
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="f-website">{t.honeypot}</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div hidden={!isTrainer}>
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-[10px] text-[16px] leading-[1.5] text-[#16191D]">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={errs.consent ? true : undefined}
            aria-describedby={errs.consent ? "f-consent-err" : undefined}
            className="mt-[3px] h-5 w-5 shrink-0 cursor-pointer accent-[#16191D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A4524]"
          />
          <span>
            {tt.consent}{" "}
            <a className="whitespace-nowrap text-[#8A4524] underline underline-offset-4" href={href("privacy", locale, { hash: "bewerbungen" })} target="_blank" rel="noopener">
              {tt.consentLink}
              <span className="sr-only"> {tt.newTab}</span>
            </a>
          </span>
        </label>
        {err("consent")}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <button
            type="submit"
            aria-disabled={state === "sending" || undefined}
            className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] bg-[#16191D] px-7 text-[16px] font-medium text-[#F6F2EC] transition-colors duration-150 hover:bg-[#8A4524] aria-disabled:opacity-70"
          >
            {state === "sending" ? t.sending : isTrainer ? tt.send : t.send}
          </button>
        </div>
        <p role="alert" className="text-[16px] font-medium text-[#A12A1B]">
          {state === "err" ? (
            <span>
              {t.fallback[0]}
              <a className="underline underline-offset-4" href={`mailto:${t.mail}`}>
                {t.mail}
              </a>
              {t.fallback[1]}
            </span>
          ) : null}
        </p>
      </div>
      <p className="text-[14px] leading-[1.6] text-[#6B665F]" hidden={isTrainer || undefined}>
        {t.consent}{" "}
        <a className="text-[#8A4524] underline underline-offset-4" href={href("privacy", locale)}>
          {t.privacy}
        </a>
        .
      </p>
    </form>
  );
}
