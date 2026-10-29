"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FORM } from "@/content/v7/form";
import type { BlockOf } from "@/content/v7/types";
import { href, type L3 } from "@/lib/v7-routes";

const mono = "font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tracking-[0.02em]";
const label = `${mono} mb-2 block text-[12px] uppercase text-[#6B665F]`;
const control =
  "block min-h-[52px] w-full rounded-[16px] border border-[#CFC6B8] bg-white px-4 py-3 text-[17px] text-[#16191D] placeholder:text-[#6B665F] aria-[invalid=true]:border-[#A12A1B]";

type Field = "name" | "email" | "message";
const FIELDS: Field[] = ["name", "email", "message"];
// The server's rules (src/lib/contact-guard.ts): name and message non-empty after trimming, the address
// matched with zod's email pattern. Checking them here gives a field-level error instead of a failed send.
const EMAIL = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;
const isValid = (k: Field, v: string) => (k === "email" ? EMAIL.test(v.trim()) : v.trim().length > 0);

export function ContactForm({ block, locale }: { block: BlockOf<"form">; locale: L3 }) {
  const t = FORM[locale];
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errs, setErrs] = useState<Partial<Record<Field, boolean>>>({});
  const okRef = useRef<HTMLDivElement>(null);
  const errText: Record<Field, string> = { name: t.errName, email: t.errEmail, message: t.errMessage };

  // Pre-select a topic from ?anliegen=<value> (read after mount, so the server HTML stays identical).
  useEffect(() => {
    try {
      const want = new URLSearchParams(window.location.search).getAll("anliegen");
      const hit = block.topics.filter((x) => want.includes(x.value)).map((x) => x.value);
      if (hit.length) setTopics(new Set(hit));
    } catch {
      /* no query access: start with nothing selected */
    }
  }, [block.topics]);

  useEffect(() => {
    if (state === "ok") okRef.current?.focus();
  }, [state]);

  const toggle = (v: string) => {
    const n = new Set(topics);
    if (n.has(v)) n.delete(v);
    else n.add(v);
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
    if (state === "sending") return;
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
          topics: block.topics.filter((x) => topics.has(x.value)).map((x) => x.label),
          source: `v7-contact-${locale}`,
        }),
      });
      // 503 (mail delivery not configured), 429 (rate limit) and any other failure all show the same fallback.
      setState(res.ok ? "ok" : "err");
      if (res.ok) {
        form.reset();
        setTopics(new Set());
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
        <p className={`${mono} text-[12px] uppercase text-[#8A4524]`}>{t.okH}</p>
        <p className="mt-3 max-w-[52ch] text-[18px]">{t.ok}</p>
      </div>
    );
  }

  // noValidate: the checks above replace the browser bubbles (which follow the browser language, not the page).
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
                <span className="inline-flex min-h-[44px] items-center rounded-full border border-[#CFC6B8] bg-white px-4 text-[16px] transition-colors peer-checked:border-[#16191D] peer-checked:bg-[#16191D] peer-checked:text-[#F6F2EC] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8A4524]">
                  {x.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {help("f-topics-h", t.topicsHelp)}
      </fieldset>
      <div>
        <label htmlFor="f-message" className={label}>
          {t.message}
        </label>
        <textarea id="f-message" name="message" required maxLength={10000} rows={6} className={`${control} min-h-[160px]`} {...mark("message", "f-message-h")} />
        {help("f-message-h", t.messageHelp)}
        {err("message")}
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="f-website">{t.honeypot}</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <button
            type="submit"
            aria-disabled={state === "sending" || undefined}
            className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] bg-[#16191D] px-7 text-[16px] font-medium text-[#F6F2EC] transition-colors duration-150 hover:bg-[#8A4524] aria-disabled:opacity-70"
          >
            {state === "sending" ? t.sending : t.send}
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
      <p className="text-[14px] leading-[1.6] text-[#6B665F]">
        {t.consent}{" "}
        <a className="text-[#8A4524] underline underline-offset-4" href={href("privacy", locale)}>
          {t.privacy}
        </a>
        .
      </p>
    </form>
  );
}
