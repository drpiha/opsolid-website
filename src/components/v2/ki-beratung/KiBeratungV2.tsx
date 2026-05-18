"use client";

/**
 * KiBeratungV2 — Live Discovery Console.
 *
 * Three motion layers:
 *   1. Background log stream — fake ops log lines crawling upward, ~6% opacity.
 *      Pure CSS, no JS cost. Looks like an OS process tail.
 *   2. Left column: eyebrow + question + lead + CTAs + animated counter card
 *      ("11,3 Std / Woche" counts up from 0 when scrolled into view).
 *   3. Right column: terminal with header LIVE pill, typewriter output, and
 *      a progress bar that fills as the scan completes.
 *
 * Reduced-motion: log stream paused, counter snaps to final, typewriter
 * renders all lines instantly, progress bar fills statically.
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  V2WhatWeDo,
  V2UseCases,
  V2Process,
  V2FinalCta,
} from "@/components/v2/services/ServiceSections";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

const CHAR_MS = 16;
const LINE_DELAY_MS = 120;

// Fake ops log lines for the background scroll. These never reach above
// ~7% opacity, so the content is unreadable as text — it reads as noise
// that hints "something is being analyzed." No translation needed.
const LOG_LINES = [
  "[14:32:01] connector.sap          | poll ok",
  "[14:32:01] queue.invoices         | depth=14",
  "[14:32:02] worker.classify        | ok 230ms",
  "[14:32:02] router.triage          | match=customer-reply",
  "[14:32:03] connector.outlook      | fetch 8 msgs",
  "[14:32:03] worker.extract.pdf     | ok 412ms",
  "[14:32:04] queue.invoices         | depth=12",
  "[14:32:04] router.escalate        | match=legal-review",
  "[14:32:05] connector.sharepoint   | sync ok",
  "[14:32:05] worker.summarize       | ok 188ms",
  "[14:32:06] queue.outgoing         | depth=3",
  "[14:32:06] connector.teams        | post ok",
  "[14:32:07] worker.reconcile       | match=inventory",
  "[14:32:07] queue.invoices         | depth=10",
  "[14:32:08] router.pricing         | match=exception",
  "[14:32:08] connector.crm          | push ok",
  "[14:32:09] worker.translate.de    | ok 304ms",
  "[14:32:09] queue.reports          | depth=2",
  "[14:32:10] connector.gdrive       | sync ok",
  "[14:32:10] worker.invoice.draft   | ok 521ms",
  "[14:32:11] queue.invoices         | depth=8",
  "[14:32:11] router.triage          | match=order-update",
  "[14:32:12] worker.classify        | ok 198ms",
  "[14:32:12] connector.sap          | poll ok",
  "[14:32:13] queue.tickets          | depth=6",
  "[14:32:13] worker.reply.draft     | ok 412ms",
  "[14:32:14] connector.outlook      | send ok",
  "[14:32:14] queue.invoices         | depth=6",
  "[14:32:15] worker.summarize       | ok 220ms",
  "[14:32:15] router.escalate        | match=human",
  "[14:32:16] queue.outgoing         | depth=1",
  "[14:32:16] connector.sharepoint   | sync ok",
  "[14:32:17] worker.classify        | ok 245ms",
  "[14:32:17] queue.invoices         | depth=4",
  "[14:32:18] worker.reconcile       | match=stock",
  "[14:32:18] connector.crm          | push ok",
];

export function KiBeratungV2() {
  const { locale, t } = useLocale();
  const c = getV2Content(locale);
  const data = c.kiBeratung;
  // Reuse the existing rich V1 content for the body sections — copy is
  // already translated and approved across DE/EN/TR. Tools section is
  // intentionally skipped: we lead with outcomes, not tool names.
  const svc = t.v2.services.kiBeratung;
  const shared = t.v2.services.shared;
  const terminal = data.terminal as typeof data.terminal;
  const lines = terminal.lines as readonly string[];
  const fullText = lines.join("\n");

  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [counterValue, setCounterValue] = useState(0);

  const rafRef = useRef<number | null>(null);
  const counterRafRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Typewriter — same RAF-driven engine, now also drives the progress bar
  // by char-count over total length.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(fullText);
      setProgressPct(100);
      setDone(true);
      return;
    }

    let i = 0;
    let lastTime = performance.now();
    let charBudget = 0;

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      charBudget += dt / CHAR_MS;

      while (charBudget >= 1 && i < fullText.length) {
        const ch = fullText[i];
        i++;
        charBudget -= 1;
        setTyped(fullText.slice(0, i));
        setProgressPct((i / fullText.length) * 100);
        if (ch === "\n") {
          charBudget -= LINE_DELAY_MS / CHAR_MS;
          break;
        }
      }

      if (i < fullText.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgressPct(100);
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [fullText]);

  // Counter — animates from 0 → 11.3 when the section enters viewport. Uses
  // IntersectionObserver so it fires once, not on every scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCounterValue(11.3);
      return;
    }
    const node = sectionRef.current;
    if (!node) return;

    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const duration = 1600;
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

            const animate = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              setCounterValue(easeOut(t) * 11.3);
              if (t < 1) counterRafRef.current = requestAnimationFrame(animate);
            };
            counterRafRef.current = requestAnimationFrame(animate);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (counterRafRef.current !== null) cancelAnimationFrame(counterRafRef.current);
    };
  }, []);

  const counterLabel =
    locale === "de"
      ? "Std / Woche identifiziert"
      : locale === "tr"
        ? "saat / hafta tasarruf potansiyeli"
        : "hrs / week identified";
  const liveLabel =
    locale === "de" ? "LIVE-SCAN" : locale === "tr" ? "CANLI TARAMA" : "LIVE SCAN";
  const progressLabel =
    locale === "de"
      ? "Analyse läuft"
      : locale === "tr"
        ? "Analiz devam ediyor"
        : "Analysis running";
  const completeLabel =
    locale === "de" ? "Scan abgeschlossen" : locale === "tr" ? "Tarama tamamlandı" : "Scan complete";

  return (
    <main>
    <section className="v2-kib-hero" ref={sectionRef}>
      {/* Background log stream — pure decoration. Two stacked copies so the
          CSS translate loop is seamless. */}
      <div className="v2-kib-logstream" aria-hidden="true">
        <div className="v2-kib-logstream__col">
          {[...LOG_LINES, ...LOG_LINES].map((l, i) => (
            <span key={i} className="v2-kib-logstream__line">
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="wrap v2-kib-hero__inner">
        <div className="v2-kib-hero__left">
          <span className="v2-kib-hero__eyebrow">{data.eyebrow}</span>
          <h1 className="v2-kib-hero__question">{data.headline}</h1>
          <p className="v2-kib-hero__lead">{data.lead}</p>
          <div className="v2-kib-hero__cta-row">
            <Link href="/contact" className="v2-btn-primary" data-cursor="link">
              {data.ctaPrimary}
            </Link>
            <Link href="/leistungen" className="v2-btn-ghost" data-cursor="link">
              {data.ctaSecondary}
            </Link>
          </div>

          {/* Counter card — appears below CTAs, animates in when the section
              enters viewport. Numeric display uses tabular-nums for stable
              digit width while counting. */}
          <div className="v2-kib-counter" aria-live="polite">
            <div className="v2-kib-counter__value">
              {counterValue.toLocaleString(
                locale === "de" || locale === "tr" ? "de-DE" : "en-US",
                { minimumFractionDigits: 1, maximumFractionDigits: 1 },
              )}
            </div>
            <div className="v2-kib-counter__label">{counterLabel}</div>
          </div>
        </div>

        <div className="v2-kib-hero__right">
          <div className="v2-terminal" role="img" aria-label="AI discovery session transcript">
            <header className="v2-terminal__head">
              <span className="v2-terminal__dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="v2-terminal__title">{terminal.title}</span>
              <span className="v2-terminal__live" aria-hidden="true">
                <span className="v2-terminal__live-dot" />
                {liveLabel}
              </span>
            </header>
            <div className="v2-terminal__body">
              <div className="v2-terminal__prompt">{terminal.prompt}</div>
              <pre className="v2-terminal__output">
                {typed}
                <span
                  className={
                    "v2-terminal__cursor" + (done ? " v2-terminal__cursor--blink" : "")
                  }
                  aria-hidden="true"
                />
              </pre>
            </div>
            <footer className="v2-terminal__foot">
              <div className="v2-terminal__progress" aria-hidden="true">
                <div
                  className="v2-terminal__progress-fill"
                  style={{ width: `${progressPct.toFixed(1)}%` }}
                />
              </div>
              <span className="v2-terminal__progress-label">
                {done ? completeLabel : progressLabel}
              </span>
            </footer>
          </div>
        </div>
      </div>
    </section>

    <V2WhatWeDo
      eyebrow={shared.whatWeDoEyebrow}
      headline={svc.whatWeDo.headline}
      bullets={svc.whatWeDo.bullets}
    />

    <V2UseCases
      eyebrow={shared.useCasesEyebrow}
      headline={svc.useCases.headline}
      items={svc.useCases.items}
    />

    <V2Process
      eyebrow={shared.processEyebrow}
      headline={svc.process.headline}
      steps={svc.process.steps}
    />

    <FaqAccordion
      eyebrow={shared.faqEyebrow}
      headline={svc.faq.headline}
      items={svc.faq.items}
      id={`${svc.slug}-faq`}
    />

    <V2FinalCta
      eyebrow={shared.finalCtaEyebrow}
      title={svc.finalCta.title}
      lead={svc.finalCta.lead}
      ctaPrimary={svc.finalCta.ctaPrimary}
      ctaSecondary={svc.finalCta.ctaSecondary}
    />
    </main>
  );
}
