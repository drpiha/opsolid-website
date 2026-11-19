"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { StudioText } from "@/content/v7/types-produkte";
import type { L3 } from "@/lib/v7-routes";

type Design = "onyx" | "linea" | "monolith";
type Side = "front" | "back";
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
export function StudioClient({ t, locale, head }: { t: StudioText; locale: L3; head: ReactNode }) {
  const uid = useId();
  const [f, setF] = useState({ name: "", title: "", org: "", line1: "", line2: "" });
  const [design, setDesign] = useState<Design>("onyx");
  const [side, setSide] = useState<Side>("back");
  const [pv, setPv] = useState<Preview | null>(null);
  const [down, setDown] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const first = useRef(true);
  const mail = useRef<HTMLInputElement>(null);
  const own = f.name.trim().length >= 2;

  useEffect(() => {
    const ctl = new AbortController();
    const card = own
      ? { name: f.name, title: f.title, org: f.org, lines: [f.line1, f.line2].filter((line) => line.trim()) }
      : { name: t.sample.name, title: t.sample.title, org: t.sample.org, lines: [t.sample.line] };
    const timer = setTimeout(
      async () => {
        first.current = false;
        try {
          const r = await fetch("/api/opso/card-preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ design, locale, ...card }),
            signal: ctl.signal,
          });
          if (!r.ok) return setDown(r.status !== 422);
          setPv((await r.json()) as Preview);
          setDown(false);
        } catch {
          if (!ctl.signal.aborted) setDown(true);
        }
      },
      first.current ? 0 : 160,
    );
    return () => {
      clearTimeout(timer);
      ctl.abort();
    };
  }, [f, design, locale, own, t.sample]);

  useEffect(() => {
    if (open) mail.current?.focus();
  }, [open]);

  const set = (key: keyof typeof f) => (e: { target: { value: string } }) => setF((prev) => ({ ...prev, [key]: e.target.value }));
  const portrait = pv ? pv.orientation === "portrait" : false;
  const etikett = own ? t.stage.own : t.stage.sample;
  const cut = etikett.indexOf(" · ");
  const label = cut < 0 ? { pre: "", rest: etikett } : { pre: etikett.slice(0, cut + 3), rest: etikett.slice(cut + 3) };
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
      onSubmit={(e) => {
        e.preventDefault();
        setPending(true);
      }}
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
              {t.docket.title} · {t.docket.layout} {t.docket.layouts[design].name} · {t.stage[side]}
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
            {!down && own && pv && pv.unsupported && (
              <p className="wk-form-status is-error">
                {t.docket.glyphs} {pv.unsupported}
              </p>
            )}
            {!down && own && pv && !pv.fits && !pv.unsupported && (
              <p className="wk-form-status is-error">
                {t.docket.tight}{" "}
                {pv.suggestedDesign === "onyx" && (
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
          <button type="button" className="wk-btn wk-btn-ink" aria-expanded={open} aria-controls={`${uid}-interest`} onClick={() => setOpen((v) => !v)}>
            {t.interest.open}
          </button>
          <div id={`${uid}-interest`} className="wk-interest-step" hidden={!open}>
            <div className="wk-tfield is-wide">
              <label htmlFor={`${uid}-mail`}>{t.interest.email}</label>
              <input ref={mail} id={`${uid}-mail`} type="email" autoComplete="email" inputMode="email" maxLength={254} required aria-describedby={`${uid}-consent`} />
            </div>
            <p className="wk-ticket-hint" id={`${uid}-consent`}>
              {t.interest.consent}
            </p>
            <button type="submit" className="wk-btn wk-btn-ink wk-btn-sm">
              {t.interest.send}
            </button>
            {pending && (
              <p className="wk-form-status" role="status">
                {t.interest.pending}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
