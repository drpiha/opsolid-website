"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  Nfc,
  Wallet,
  LineChart,
  RefreshCw,
  Users,
  ServerCog,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CardHeroVisual } from "@/components/sections/digital-card/CardHeroVisual";
import { useLocale } from "@/context/LocaleContext";

type FormState = "idle" | "sending" | "success" | "error";

const featureIconMap: Record<string, React.ReactNode> = {
  nfc: <Nfc size={22} strokeWidth={1.25} />,
  wallet: <Wallet size={22} strokeWidth={1.25} />,
  chart: <LineChart size={22} strokeWidth={1.25} />,
  sync: <RefreshCw size={22} strokeWidth={1.25} />,
  team: <Users size={22} strokeWidth={1.25} />,
  hosting: <ServerCog size={22} strokeWidth={1.25} />,
};

/**
 * Asymmetric bento spans for the 6 features (lg:grid-cols-6).
 *   [ A A ][ B B ][ C C ]    row 1 — three equal (2/6 each)
 *   [ D D D ][ E E E ]       row 2 — two wide (3/6 each)
 *   [ F F F F F F ]          row 3 — full-width (EU hosting — amber accent)
 */
const FEATURE_SPANS = [
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-6",
];

function CheckDot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      className={className}
    >
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M 5 8 L 7.5 10.5 L 11 6" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Map the textual delete/DPA label to a glyph + tone. */
function statusPillFor(value: string): { symbol: string; tone: string } {
  const v = value.toLowerCase();
  if (
    v === "yes" ||
    v === "native" ||
    v === "evet" ||
    v === "ja" ||
    v === "yerli" ||
    v === "nativ"
  ) {
    return { symbol: "✓", tone: "text-ink" };
  }
  if (
    v === "no" ||
    v === "nein" ||
    v === "hayır" ||
    v.includes("no us") ||
    v.includes("keine us") ||
    v.includes("abd alt")
  ) {
    return { symbol: "✗", tone: "text-steel-700" };
  }
  // partial / via SCC / teilweise / kısmen / begrenzt / sınırlı / limited
  return { symbol: "⚠", tone: "text-amber-600" };
}

export function DigitalCardPage() {
  const { t } = useLocale();
  const d = t.products.digitalCard;

  const [formState, setFormState] = useState<FormState>("idle");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      company: (formData.get("company") as string) || "",
      teamSize: (formData.get("teamSize") as string) || "",
      message:
        ((formData.get("message") as string) || "").trim() ||
        "Digital Business Card request (no additional notes).",
      source: "digital-card",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setFormState("success");
      else setFormState("error");
    } catch {
      setFormState("error");
    }
  };

  return (
    <>
      {/* ================================================================
          HERO
          ================================================================ */}
      <section
        aria-labelledby="dbc-hero-title"
        className="relative overflow-hidden pt-28 md:pt-36 lg:pt-40 paper-grain"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">{d.hero.eyebrow}</span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-10 md:pt-14 lg:pt-16 pb-12 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT — text */}
            <AnimatedSection className="lg:col-span-7">
              <h1
                id="dbc-hero-title"
                className="font-serif text-ink text-[clamp(2.5rem,6.5vw,5.25rem)] leading-[1.02] tracking-[-0.025em] text-balance"
              >
                <span className="sr-only">{d.hero.title.join(" ")}</span>
                <span aria-hidden="true" className="block">
                  {d.hero.title.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </h1>

              <p className="mt-7 md:mt-9 max-w-[60ch] text-ink/70 text-body-lg leading-relaxed text-pretty">
                {d.hero.paragraph}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="#lead"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-6 py-3.5 font-medium hairline hover:bg-amber-600 hover:text-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{d.hero.primaryCta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 text-ink underline underline-offset-8 decoration-ink/20 decoration-1 hover:decoration-ink transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{d.hero.secondaryCta}</span>
                </Link>
              </div>

              <div className="mt-10 md:mt-12">
                <span className="mono-label text-ink/55 leading-relaxed">
                  {d.hero.tags}
                </span>
              </div>
            </AnimatedSection>

            {/* RIGHT — card visual */}
            <AnimatedSection delay={0.1} className="lg:col-span-5">
              <CardHeroVisual />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES BENTO
          ================================================================ */}
      <section id="features" className="section hairline-t bg-paper">
        <div className="container-wide">
          {/* Two-column editorial header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
            <AnimatedSection className="lg:col-span-7">
              <div className="mono-label mb-4">{d.features.label}</div>
              <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
                {d.features.heading}
              </h2>
            </AnimatedSection>

            <AnimatedSection
              delay={0.1}
              className="lg:col-span-5 lg:pt-2 flex items-start"
            >
              <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
                {d.features.intro}
              </p>
            </AnimatedSection>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5">
            {d.features.items.map((item, i) => {
              const isAccent = item.icon === "hosting";
              return (
                <AnimatedSection
                  key={i}
                  delay={0.04 * i}
                  className={FEATURE_SPANS[i % FEATURE_SPANS.length]}
                >
                  <div
                    className={`h-full rounded-2xl border border-ink/10 p-6 md:p-7 transition-colors duration-300 hover:border-amber/60 ${
                      isAccent ? "bg-amber/15" : "bg-paper-warm"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-paper text-ink">
                        {featureIconMap[item.icon]}
                      </div>
                      <div className="mono-label text-ink/60">{item.label}</div>
                    </div>
                    <h3 className="font-serif text-ink text-[1.375rem] leading-[1.2] tracking-[-0.015em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-ink/70 text-sm leading-relaxed text-pretty max-w-prose">
                      {item.desc}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          COMPLIANCE TABLE
          ================================================================ */}
      <section id="compliance" className="section hairline-t bg-paper-cool/40">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 lg:mb-14">
            <AnimatedSection className="lg:col-span-7">
              <div className="mono-label mb-4">{d.compliance.label}</div>
              <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
                {d.compliance.heading}
              </h2>
            </AnimatedSection>
            <AnimatedSection
              delay={0.1}
              className="lg:col-span-5 lg:pt-2 flex items-start"
            >
              <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
                {d.compliance.intro}
              </p>
            </AnimatedSection>
          </div>

          {/* Desktop: real table */}
          <AnimatedSection className="hidden md:block">
            <div className="overflow-x-auto hairline rounded-2xl bg-paper-warm">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="border-b border-ink/10">
                    {d.compliance.cols.map((col, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="text-left px-5 py-4 mono-label text-ink/60 font-normal"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.compliance.rows.map((row, i) => {
                    const highlighted = row.highlight === "true";
                    const dpa = statusPillFor(row.dpa);
                    const del = statusPillFor(row.del);
                    const sub = statusPillFor(row.sub);
                    return (
                      <tr
                        key={i}
                        className={`${
                          highlighted
                            ? "bg-amber/[0.08] font-medium"
                            : "bg-transparent"
                        } ${i < d.compliance.rows.length - 1 ? "border-b border-ink/10" : ""}`}
                      >
                        <td className="px-5 py-4 text-ink">{row.provider}</td>
                        <td className="px-5 py-4 text-ink/80">{row.host}</td>
                        <td className="px-5 py-4">
                          <StatusChip symbol={sub.symbol} tone={sub.tone} label={row.sub} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusChip symbol={dpa.symbol} tone={dpa.tone} label={row.dpa} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusChip symbol={del.symbol} tone={del.tone} label={row.del} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          {/* Mobile: stacked cards */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {d.compliance.rows.map((row, i) => {
              const highlighted = row.highlight === "true";
              const dpa = statusPillFor(row.dpa);
              const del = statusPillFor(row.del);
              const sub = statusPillFor(row.sub);
              return (
                <AnimatedSection key={i} delay={0.05 * i}>
                  <div
                    className={`rounded-2xl border border-ink/10 p-5 ${
                      highlighted ? "bg-amber/[0.08]" : "bg-paper-warm"
                    }`}
                  >
                    <div
                      className={`font-serif text-xl text-ink ${
                        highlighted ? "font-medium" : ""
                      }`}
                    >
                      {row.provider}
                    </div>
                    <dl className="mt-4 grid grid-cols-1 gap-2.5 font-mono text-xs">
                      <Row label={d.compliance.cols[1]} value={row.host} />
                      <Row
                        label={d.compliance.cols[2]}
                        value={
                          <StatusChip symbol={sub.symbol} tone={sub.tone} label={row.sub} />
                        }
                      />
                      <Row
                        label={d.compliance.cols[3]}
                        value={
                          <StatusChip symbol={dpa.symbol} tone={dpa.tone} label={row.dpa} />
                        }
                      />
                      <Row
                        label={d.compliance.cols[4]}
                        value={
                          <StatusChip symbol={del.symbol} tone={del.tone} label={row.del} />
                        }
                      />
                    </dl>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          PRICING
          ================================================================ */}
      <section id="pricing" className="section hairline-t bg-paper">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-12 lg:mb-16">
            <div className="mono-label mb-4">{d.pricing.label}</div>
            <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              {d.pricing.heading}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {d.pricing.plans.map((plan, i) => {
              const popular = plan.popular === "true";
              return (
                <AnimatedSection key={i} delay={0.06 * i}>
                  <div
                    className={`relative h-full rounded-2xl border p-7 md:p-8 flex flex-col gap-6 ${
                      popular
                        ? "border-amber bg-paper-warm shadow-medium"
                        : "border-ink/10 bg-paper-warm"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 left-7 inline-flex items-center gap-1 bg-amber text-ink px-2.5 py-1 mono-label text-[0.65rem] hairline">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                        {d.pricing.popularBadge}
                      </span>
                    )}

                    <div>
                      <div className="mono-label text-ink/60">{plan.name}</div>
                      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                        <span className="font-serif text-ink text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-[-0.02em]">
                          {plan.price}
                        </span>
                        {plan.cadence && (
                          <span className="text-ink/55 text-sm font-mono">
                            {plan.cadence}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 text-sm text-ink/80 flex-1">
                      {plan.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckDot className="mt-1 shrink-0 text-ink/60" />
                          <span className="leading-relaxed text-pretty">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.href}
                      className={`group inline-flex items-center justify-center gap-2.5 px-5 py-3 font-medium hairline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber ${
                        popular
                          ? "bg-amber text-ink hover:bg-amber-600 hover:text-paper"
                          : "bg-paper text-ink hover:bg-ink hover:text-paper"
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          LEAD FORM
          ================================================================ */}
      <section id="lead" className="section hairline-t bg-paper-cool/40">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <div className="mono-label mb-4">{d.lead.label}</div>
              <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
                {d.lead.heading}
              </h2>
              <p className="mt-6 text-ink/70 text-body-lg leading-relaxed text-pretty max-w-[50ch]">
                {d.lead.intro}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="lg:col-span-7">
              <div className="rounded-2xl hairline bg-paper-warm p-6 md:p-8">
                {formState === "success" ? (
                  <div className="text-center py-10">
                    <CheckCircle
                      size={36}
                      strokeWidth={1.25}
                      className="text-ink mx-auto mb-4"
                    />
                    <p className="font-serif text-ink text-2xl leading-snug text-balance max-w-md mx-auto">
                      {d.lead.fields.success}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        id="dbc-name"
                        name="name"
                        label={d.lead.fields.name}
                        placeholder="Jane Schmidt"
                        required
                      />
                      <Input
                        id="dbc-email"
                        name="email"
                        type="email"
                        label={d.lead.fields.email}
                        placeholder="jane@company.de"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        id="dbc-company"
                        name="company"
                        label={d.lead.fields.company}
                        placeholder="Acme GmbH"
                      />
                      <Select
                        id="dbc-teamsize"
                        name="teamSize"
                        defaultValue=""
                        label={d.lead.fields.teamSize}
                      >
                        <option value="" disabled>
                          —
                        </option>
                        {d.lead.fields.teamSizeOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <Textarea
                      id="dbc-message"
                      name="message"
                      label={d.lead.fields.message}
                      rows={4}
                    />

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4 rounded-sm border-ink/30 text-ink accent-amber-600 focus:ring-2 focus:ring-amber/50"
                      />
                      <span className="text-xs text-ink/60 leading-relaxed">
                        {d.lead.fields.consent}{" "}
                        <Link
                          href="/privacy"
                          className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                        >
                          {d.lead.fields.privacyLink}
                        </Link>
                      </span>
                    </label>

                    {formState === "error" && (
                      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber/10 hairline rounded-lg p-3">
                        <AlertCircle size={16} strokeWidth={1.25} />
                        <span>{d.lead.fields.error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "sending" || !agreed}
                      className="group inline-flex items-center gap-2.5 bg-amber text-ink px-6 py-3.5 font-medium hairline hover:bg-amber-600 hover:text-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {formState === "sending" ? (
                        <>
                          <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                          <span>{d.lead.fields.submitting}</span>
                        </>
                      ) : (
                        <>
                          <span>{d.lead.fields.submit}</span>
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            →
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          BOTTOM CTA
          ================================================================ */}
      <section className="section bg-ink text-paper paper-grain">
        <div className="container-wide">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="mono-label text-amber mb-5">
                {d.cta.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(2rem,5.5vw,4rem)] leading-[1.05] tracking-[-0.025em] text-balance whitespace-pre-line">
                {d.cta.heading}
              </h2>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hover:bg-amber-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{d.cta.primaryCta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-paper underline underline-offset-8 decoration-paper/30 decoration-1 hover:decoration-paper transition-colors duration-200"
                >
                  <span>{d.cta.secondaryCta}</span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

/** Pill rendering a glyph + textual label, using hairline border. */
function StatusChip({
  symbol,
  tone,
  label,
}: {
  symbol: string;
  tone: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 hairline rounded-full px-2.5 py-1 bg-paper text-xs">
      <span className={`${tone} font-bold`} aria-hidden="true">
        {symbol}
      </span>
      <span className="text-ink/80">{label}</span>
    </span>
  );
}

/** Mobile-card label/value row. */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="mono-label text-ink/55 shrink-0">{label}</dt>
      <dd className="text-ink text-right">{value}</dd>
    </div>
  );
}
