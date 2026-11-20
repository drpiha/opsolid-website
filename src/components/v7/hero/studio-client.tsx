"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { StudioText } from "@/content/v7/types-produkte";
import type { L3 } from "@/lib/v7-routes";

type Design = "onyx" | "linea" | "monolith";
type Side = "front" | "back";
type Reg = "idle" | "sending" | "sent" | "email" | "name" | "busy" | "down";

/**
 * How often the card is redrawn while someone types. It is drawn when typing pauses for PREVIEW_PAUSE_MS, and
 * during steady typing once per PREVIEW_STEADY_MS. Before, a 160 ms pause was enough, so nearly every keystroke
 * asked for a drawing: a full card typed on a phone (about 100 characters) passed the limit of previews a minute
 * and the last words were never drawn (measured on the live page on the release day). With these two values even
 * the slowest typing cannot ask more than 133 times a minute, and fast typing asks about once a second.
 */
const PREVIEW_PAUSE_MS = 450;
const PREVIEW_STEADY_MS = 900;
/** When the limit is reached all the same, the current state is drawn again after these waits. */
const PREVIEW_RETRY_MS = [4_000, 12_000, 30_000];
type Preview = {
  design: Design;
  orientation: "landscape" | "portrait";
  fits: boolean;
  unsupported: string | null;
  suggestedDesign: Design | null;
  front: string | null;
  back: string | null;
};
const DESIGNS: readonly Design[] = ["onyx", "linea", "monolith"];
/** "E-Mail" never breaks after its hyphen. A span does it, so the archived consent wording stays character for character. */
const NO_BREAK = /(E-Mail-Adresse|E-Mail|e-mail|e-posta)/g;
const nb = (text: string): ReactNode[] =>
  text.split(NO_BREAK).map((part, i) =>
    i % 2 ? (
      <span key={i} className="wk-nb">
        {part}
      </span>
    ) : (
      part
    ),
  );
/** Static sample faces (Onyx, the sample person) shown until the first live preview arrives, and without JS. */
const SAMPLE_IMG = { front: "/img/v7/opso/studio/sample-onyx-front.svg", back: "/img/v7/opso/studio/sample-onyx-back.svg" } as const;

/** Pictogram of a layout: where the QR code and the text sit (a schema, not a preview). */
function LayoutMark({ design }: { design: Design }) {
  const ink = "#e9e2d4";
  if (design === "monolith") {
    return (
      <svg viewBox="0 0 86 54" width="120" height="76" aria-hidden="true" focusable="false">
        <rect x="26" y="1" width="34" height="52" rx="2.4" fill="#121213" />
        <rect x="36" y="6" width="14" height="14" rx="1.6" fill={ink} />
        <rect x="33" y="27" width="20" height="2.2" fill={ink} />
        <rect x="36" y="32" width="14" height="1.4" fill={ink} opacity="0.7" />
        <rect x="37" y="41" width="12" height="1.2" fill={ink} opacity="0.7" />
      </svg>
    );
  }
  const linea = design === "linea";
  return (
    <svg viewBox="0 0 86 54" width="120" height="76" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="84" height="52" rx="3" fill="#121213" />
      {linea ? (
        <>
          <rect x="8" y="10" width="34" height="2.6" fill={ink} />
          <rect x="8" y="16" width="24" height="1.5" fill={ink} opacity="0.7" />
          <rect x="8" y="25" width="32" height="0.6" fill={ink} opacity="0.7" />
          <rect x="8" y="42" width="28" height="1.3" fill={ink} opacity="0.7" />
          <rect x="59" y="27" width="20" height="20" rx="2" fill={ink} />
        </>
      ) : (
        <>
          <rect x="7" y="17" width="20" height="20" rx="2" fill={ink} />
          <rect x="31.5" y="11" width="0.6" height="32" fill={ink} opacity="0.7" />
          <rect x="37" y="19" width="34" height="2.6" fill={ink} />
          <rect x="37" y="25" width="24" height="1.5" fill={ink} opacity="0.7" />
          <rect x="37" y="33" width="30" height="1.3" fill={ink} opacity="0.7" />
        </>
      )}
    </svg>
  );
}

/**
 * The card studio: the copy (`head`, server-rendered) and the job ticket in one column, the card on its mat in the
 * other. One form; the ticket is torn in two (fields and layouts, then price and interest) so that on phones the
 * sticky card strip ends where the fields end.
 */
export function StudioClient({ t, locale, head, privacyHref }: { t: StudioText; locale: L3; head: ReactNode; privacyHref: string }) {
  const uid = useId();
  const [f, setF] = useState({ name: "", title: "", org: "", line1: "", line2: "" });
  const [design, setDesign] = useState<Design>("onyx");
  const [side, setSide] = useState<Side>("back");
  const [pv, setPv] = useState<Preview | null>(null);
  /** The latest answer when it does not fit or names unprintable characters; the card keeps the last version that fits. */
  const [issue, setIssue] = useState<Preview | null>(null);
  const [down, setDown] = useState(false);
  const [open, setOpen] = useState(false);
  /** The e-mail step: idle, sending, sent (confirmation mail on its way), or the reason it did not go through. */
  const [reg, setReg] = useState<Reg>("idle");
  const first = useRef(true);
  /** Time of the last preview request, its number, and the number of the newest request already drawn. */
  const asked = useRef(0);
  const sent = useRef(0);
  const drawn = useRef(0);
  const mail = useRef<HTMLInputElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const sentNote = useRef<HTMLParagraphElement>(null);
  const own = f.name.trim().length >= 2;

  useEffect(() => {
    let left = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const card = own
      ? { name: f.name, title: f.title, org: f.org, lines: [f.line1, f.line2].filter((line) => line.trim()) }
      : { name: t.sample.name, title: t.sample.title, org: t.sample.org, lines: [t.sample.line] };
    const draw = async (attempt: number) => {
      const mine = ++sent.current;
      asked.current = Date.now();
      try {
        const r = await fetch("/api/opso/card-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ design, locale, ...card }),
        });
        if (r.status === 429 && attempt < PREVIEW_RETRY_MS.length) {
          // Too many previews in a minute (many people behind one connection): draw this state a little later
          // instead of leaving the card one sentence behind. The card shown stays as it is meanwhile.
          if (!left) retry = setTimeout(() => void draw(attempt + 1), PREVIEW_RETRY_MS[attempt]);
          return;
        }
        // An answer that arrives after a newer one is dropped; an older one that arrives first is still drawn,
        // so the card follows slow typing step by step instead of waiting for the very last letter.
        if (mine < drawn.current) return;
        if (!r.ok) {
          drawn.current = mine;
          return setDown(r.status !== 422);
        }
        const next = (await r.json()) as Preview;
        if (mine < drawn.current) return;
        drawn.current = mine;
        const bad = !next.fits || Boolean(next.unsupported);
        setIssue(bad ? next : null);
        // A layout change always shows the new layout; within one layout a draft that does not fit leaves the card as it was.
        setPv((prev) => (bad && prev && prev.design === next.design && prev.back ? prev : next));
        setDown(false);
      } catch {
        if (mine >= drawn.current) setDown(true);
      }
    };
    // Draw when typing pauses, and during steady typing at most once per PREVIEW_STEADY_MS.
    const wait = first.current ? 0 : Math.min(PREVIEW_PAUSE_MS, Math.max(0, PREVIEW_STEADY_MS - (Date.now() - asked.current)));
    const timer = setTimeout(() => {
      first.current = false;
      void draw(0);
    }, wait);
    return () => {
      left = true;
      clearTimeout(timer);
      clearTimeout(retry);
    };
  }, [f, design, locale, own, t.sample]);

  useEffect(() => {
    if (open) mail.current?.focus();
  }, [open]);
  // The step is replaced by the note; focus follows it so that it is read out and the keyboard position is kept.
  useEffect(() => {
    if (reg === "sent") sentNote.current?.focus();
  }, [reg]);
  // The "name first" note goes as soon as there is a name.
  useEffect(() => {
    if (own) setReg((now) => (now === "name" ? "idle" : now));
  }, [own]);
  const toName = () => {
    const input = document.getElementById(`${uid}-name`);
    input?.focus({ preventScroll: true });
    input?.scrollIntoView({ block: "center" });
  };

  /**
   * "Vormerken". Consent is the click on this button (or Enter in the e-mail field), so the form itself never
   * submits: Enter in a card field must not register anyone.
   */
  const register = async () => {
    if (reg === "sending" || reg === "sent") return;
    if (!own) return setReg("name");
    const email = mail.current?.value.trim() ?? "";
    if (!email || !mail.current?.checkValidity()) {
      mail.current?.focus();
      return setReg("email");
    }
    setReg("sending");
    try {
      const r = await fetch("/api/opso/card-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          draft: { design, name: f.name, title: f.title, org: f.org, lines: [f.line1, f.line2].filter((line) => line.trim()) },
          locale,
          hp_blank: trap.current?.value ?? "",
        }),
      });
      setReg(r.ok ? "sent" : r.status === 422 ? "name" : r.status === 400 ? "email" : r.status === 429 ? "busy" : "down");
    } catch {
      setReg("down");
    }
  };
  const regError = reg === "email" || reg === "name" || reg === "busy" || reg === "down" ? t.interest.errors[reg] : null;

  const set = (key: keyof typeof f) => (e: { target: { value: string } }) => setF((prev) => ({ ...prev, [key]: e.target.value }));
  const portrait = pv ? pv.orientation === "portrait" : false;
  const etikett = own ? t.stage.own : t.stage.sample;
  const cut = etikett.indexOf(" · ");
  const label = cut < 0 ? { pre: "", rest: etikett } : { pre: etikett.slice(0, cut + 3), rest: etikett.slice(cut + 3) };
  const jobCut = t.docket.title.indexOf(" · ");
  const job = jobCut < 0 ? { pre: "", rest: t.docket.title } : { pre: t.docket.title.slice(0, jobCut + 3), rest: t.docket.title.slice(jobCut + 3) };
  const linkAt = t.interest.consent.indexOf(t.interest.consentLink);
  const consent =
    linkAt < 0
      ? { before: t.interest.consent, link: "", after: "" }
      : { before: t.interest.consent.slice(0, linkAt), link: t.interest.consentLink, after: t.interest.consent.slice(linkAt + t.interest.consentLink.length) };
  const shown = own ? [f.name, f.title, f.org, f.line1, f.line2] : [t.sample.name, t.sample.title, t.sample.org, t.sample.line];
  const alt = `${t.stage.alt.replace("{side}", side === "front" ? t.stage.front : t.stage.back)}${side === "back" ? `: ${shown.filter((v) => v.trim()).join(", ")}` : ""}`;
  const face = (which: Side) => {
    const svg = pv?.[which];
    return svg ? (
      <div className={`wk-card-face is-${which}`} dangerouslySetInnerHTML={{ __html: svg }} />
    ) : (
      <div className={`wk-card-face is-${which}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {!pv && <img src={SAMPLE_IMG[which]} alt="" width={856} height={540} decoding="async" />}
      </div>
    );
  };
  const field = (key: keyof typeof f, text: string, max: number, auto: string, wide = false, hint?: string) => (
    <div className={`wk-tfield${wide ? " is-wide" : ""}`}>
      <label htmlFor={`${uid}-${key}`}>{text}</label>
      <input id={`${uid}-${key}`} type="text" autoComplete={auto} maxLength={max} aria-describedby={hint} value={f[key]} onChange={set(key)} />
    </div>
  );

  return (
    <form
      className="wk-studio"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="wk-studio-copy">{head}</div>

      <div className="wk-studio-work">
        <div className="wk-studio-stage">
          <div className="wk-studio-top">
            <span className="wk-etikett is-solid">
              {/* "Vorschau · " is dropped on phones, where the label sits beside the small card */}
              <span className="wk-studio-pre">{label.pre}</span>
              {label.rest}
            </span>
            <div className="wk-seg" role="group" aria-label={t.stage.sides}>
              {(["front", "back"] as const).map((s) => (
                <button key={s} type="button" aria-pressed={side === s} onClick={() => setSide(s)}>
                  {t.stage[s]}
                </button>
              ))}
            </div>
          </div>
          <div className={`wk-studio-mat${portrait ? " is-portrait" : ""}`}>
            {own && issue && !down && <span className="wk-etikett wk-studio-flag">{t.stage.tight}</span>}
            <div className="wk-card-wrap">
              {/* rulers along the card's own edges: they always span the rendered card, in either orientation */}
              <span className="wk-rule is-x" aria-hidden="true">
                <span>{portrait ? t.stage.short : t.stage.long}</span>
              </span>
              <span className="wk-rule is-y" aria-hidden="true">
                <span>{portrait ? t.stage.long : t.stage.short}</span>
              </span>
              <div className={`wk-card${side === "front" ? " is-front" : ""}`} role="img" aria-label={alt}>
                {face("back")}
                {face("front")}
              </div>
            </div>
          </div>
          <p className="wk-studio-caption">{t.stage.caption}</p>
        </div>

        <div className="wk-ticket is-a">
          <div className="wk-ticket-head">
            <span className="wk-etikett is-solid">
              <span className="wk-job-long">{job.pre}</span>
              {job.rest} · <span className="wk-job-long">{t.docket.layout} </span>
              {t.docket.layouts[design].name} · {t.stage[side]}
            </span>
          </div>
          <div className="wk-ticket-grid">
            {field("name", t.docket.name, 40, "name", true)}
            {field("title", t.docket.title2, 40, "organization-title")}
            {field("org", t.docket.org, 48, "organization")}
            {field("line1", t.docket.line1, 64, "off", true, `${uid}-lh`)}
            {field("line2", t.docket.line2, 64, "off", true, `${uid}-lh`)}
            <p className="wk-ticket-hint" id={`${uid}-lh`}>
              {t.docket.lineHint} {t.docket.linkNote}
            </p>
          </div>

          <fieldset className="wk-layouts">
            <legend>{t.docket.layout}</legend>
            {DESIGNS.map((d) => (
              <label key={d} className="wk-layout">
                <input type="radio" name={`${uid}-layout`} value={d} checked={design === d} onChange={() => setDesign(d)} />
                <LayoutMark design={d} />
                <span className="wk-layout-name">{t.docket.layouts[d].name}</span>
                <span className="wk-layout-note">{t.docket.layouts[d].note}</span>
              </label>
            ))}
          </fieldset>

          <div className="wk-ticket-live" aria-live="polite">
            {down && <p className="wk-form-status">{t.stage.unavailable}</p>}
            {!down && own && issue && issue.unsupported && (
              <p className="wk-form-status is-error">
                {t.docket.glyphs} {issue.unsupported}
              </p>
            )}
            {!down && own && issue && !issue.unsupported && (
              <p className="wk-form-status is-error">
                {t.docket.tight}{" "}
                {issue.suggestedDesign === "onyx" && (
                  <button type="button" className="wk-tlink" onClick={() => setDesign("onyx")}>
                    {t.docket.useOnyx}
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="wk-ticket is-b">
        <span className="wk-ticket-key">{t.price.label}</span>
        <p className="wk-price-row">
          <span className="wk-price-value">{t.price.value}</span>
          <span className="wk-price-status">{t.price.status}</span>
        </p>
        <p className="wk-price-note">{t.price.note}</p>
        <div className="wk-interest">
          {reg === "sent" ? (
            <p ref={sentNote} tabIndex={-1} className="wk-interest-sent">
              <span className="wk-price-status">{t.interest.sentState}</span>
              <span>{nb(t.interest.sent)}</span>
            </p>
          ) : (
            <>
              <button type="button" className="wk-btn wk-btn-ink" aria-expanded={open} aria-controls={`${uid}-interest`} onClick={() => setOpen((v) => !v)}>
                {t.interest.open}
              </button>
              <div id={`${uid}-interest`} className="wk-interest-step" hidden={!open}>
                <div className="wk-tfield is-wide">
                  <label htmlFor={`${uid}-mail`}>{t.interest.email}</label>
                  <input
                    ref={mail}
                    id={`${uid}-mail`}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    required
                    aria-invalid={reg === "email" || undefined}
                    aria-describedby={`${uid}-consent${regError ? ` ${uid}-regerr` : ""}`}
                    onInput={() => {
                      if (reg === "email") setReg("idle");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void register();
                    }}
                  />
                </div>
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                  {/* Spam trap; its name is no word browser autofill knows (see the contact form). */}
                  <label htmlFor={`${uid}-hp`}>{t.interest.trap}</label>
                  <input ref={trap} id={`${uid}-hp`} name="hp_blank" type="text" tabIndex={-1} autoComplete="off" data-1p-ignore="true" data-lpignore="true" data-form-type="other" />
                </div>
                <p className="wk-ticket-hint" id={`${uid}-consent`}>
                  {nb(consent.before)}
                  {/* a new tab, so the draft typed above is not lost */}
                  {consent.link && (
                    <a href={privacyHref} target="_blank" rel="noopener noreferrer">
                      {consent.link}
                    </a>
                  )}
                  {nb(consent.after)}
                </p>
                <button type="button" className="wk-btn wk-btn-ink wk-btn-sm" aria-disabled={reg === "sending" || undefined} onClick={() => void register()}>
                  {reg === "sending" ? t.interest.sending : t.interest.send}
                </button>
                {regError && (
                  <p id={`${uid}-regerr`} className="wk-form-status is-error" role="alert">
                    {regError}
                    {reg === "name" && (
                      <>
                        {" "}
                        <button type="button" className="wk-tlink" onClick={toName}>
                          {t.interest.toName}
                        </button>
                      </>
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
