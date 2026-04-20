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
  Link2,
  QrCode,
  Layers,
  Loader2,
  AlertCircle,
  CheckCircle,
  Check,
  X,
  AlertTriangle,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { HeroCardMockup } from "@/components/sections/hero/HeroCardMockup";
import { DemoGallery } from "@/components/products/DemoGallery";
import { useLocale } from "@/context/LocaleContext";

type FormState = "idle" | "sending" | "success" | "error";

const featureIconMap: Record<string, React.ReactNode> = {
  link: <Link2 size={22} strokeWidth={2} />,
  qr: <QrCode size={22} strokeWidth={2} />,
  nfc: <Nfc size={22} strokeWidth={2} />,
  templates: <Layers size={22} strokeWidth={2} />,
  wallet: <Wallet size={22} strokeWidth={2} />,
  chart: <LineChart size={22} strokeWidth={2} />,
  sync: <RefreshCw size={22} strokeWidth={2} />,
  team: <Users size={22} strokeWidth={2} />,
  hosting: <ServerCog size={22} strokeWidth={2} />,
};

/** Map the textual delete/DPA label to a glyph + tone. */
function statusTokenFor(value: string): {
  symbol: React.ReactNode;
  tone: "good" | "bad" | "warn";
} {
  const v = value.toLowerCase();
  if (
    v === "yes" ||
    v === "native" ||
    v === "evet" ||
    v === "ja" ||
    v === "yerli" ||
    v === "nativ"
  ) {
    return {
      symbol: <Check size={14} strokeWidth={3} />,
      tone: "good",
    };
  }
  if (
    v === "no" ||
    v === "nein" ||
    v === "hayır" ||
    v.includes("no us") ||
    v.includes("keine us") ||
    v.includes("abd alt")
  ) {
    return {
      symbol: <Check size={14} strokeWidth={3} />,
      tone: "good",
    };
  }
  // partial / via SCC / teilweise / kısmen
  if (
    v.includes("partial") ||
    v.includes("scc") ||
    v.includes("teilweise") ||
    v.includes("kısmen") ||
    v.includes("limited") ||
    v.includes("begrenzt") ||
    v.includes("sınırlı")
  ) {
    return {
      symbol: <AlertTriangle size={14} strokeWidth={2.5} />,
      tone: "warn",
    };
  }
  return {
    symbol: <X size={14} strokeWidth={3} />,
    tone: "bad",
  };
}

function StatusChip({
  symbol,
  tone,
  label,
}: {
  symbol: React.ReactNode;
  tone: "good" | "bad" | "warn";
  label: string;
}) {
  const toneClass =
    tone === "good"
      ? "bg-brand/10 text-brand"
      : tone === "warn"
      ? "bg-neutral-100 text-ink/60"
      : "bg-neutral-100 text-ink/40";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${toneClass}`}
      >
        {symbol}
      </span>
      <span className="text-ink/70">{label}</span>
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50 shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-ink text-right">{value}</dd>
    </div>
  );
}

export function DigitalCardPage() {
  const { t } = useLocale();
  const d = t.products.digitalCard;
  const home = t.home;

  const [formState, setFormState] = useState<FormState>("idle");
  const [agreed, setAgreed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
        className="relative overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-20"
      >
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT */}
            <AnimatedSection className="lg:col-span-7">
              {/* Rating pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-50 border border-neutral-200 px-3.5 py-1.5 shadow-soft">
                <span
                  className="flex items-center gap-0.5 text-brand"
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </span>
                <span className="text-xs font-semibold text-ink">
                  {home.hero.ratingPill}
                </span>
              </div>

              <h1
                id="dbc-hero-title"
                className="mt-6 md:mt-8 font-sans font-extrabold text-ink tracking-[-0.035em] leading-[0.98] text-balance text-[clamp(2.75rem,7vw,5.25rem)]"
              >
                {d.hero.title.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-6 md:mt-7 text-body-lg text-ink/60 max-w-[580px] leading-relaxed text-pretty">
                {d.hero.paragraph}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#lead" className="btn-primary">
                  <span>{d.hero.primaryCta}</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link href="#features" className="btn-ghost">
                  <span>{d.hero.secondaryCta}</span>
                </Link>
              </div>

              <p className="mt-5 text-sm text-ink/50">{home.hero.footnote}</p>
            </AnimatedSection>

            {/* RIGHT — hero mockup */}
            <div className="lg:col-span-5 animate-rise">
              <HeroCardMockup
                name={d.hero.cardLabels.name}
                role={d.hero.cardLabels.role}
                company={d.hero.cardLabels.company}
                cardLabel={d.hero.cardLabels.chip}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          TRUST STRIP
          ================================================================ */}
      <section
        aria-label="Trust signals"
        className="border-t border-b border-neutral-200 bg-white"
      >
        <div className="container-wide">
          <div
            className="flex items-center justify-center md:justify-between gap-4 md:gap-6 py-5 md:py-6 overflow-x-auto [overscroll-behavior-x:contain]"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="flex items-center gap-0.5 text-brand"
                aria-hidden="true"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="text-sm font-semibold text-ink whitespace-nowrap">
                {home.trustStrip.items[0]}
              </span>
            </div>
            {home.trustStrip.items.slice(1).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 md:gap-6 shrink-0"
              >
                <span
                  className="hidden md:inline-block h-1 w-1 rounded-full bg-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-ink/60 whitespace-nowrap">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES
          ================================================================ */}
      <section id="features" className="section bg-white">
        <div className="container-wide">
          <AnimatedSection>
            <SectionHeading
              label={d.features.label}
              headline={d.features.heading}
              description={d.features.intro}
              align="center"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {d.features.items.map((item, i) => (
              <AnimatedSection key={i} delay={0.05 * i}>
                <div className="pop-card h-full p-6 md:p-8 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-5">
                    {featureIconMap[item.icon]}
                  </div>
                  <h3 className="text-heading font-bold text-ink mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-body text-ink/60 leading-relaxed text-pretty">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          DEMO GALLERY — 20 live previews
          ================================================================ */}
      <section className="bg-white">
        <DemoGallery
          title={t.products.templatesStrip?.heading ?? "10 industry templates + 10 layouts"}
          subtitle={t.products.templatesStrip?.paragraph ?? "Live previews — click any card to open a full-size interactive demo."}
          ctaLabel={t.products.templatesStrip?.cta ?? "Customize this template"}
          openLabel={t.products.categories?.all ? "Open full preview" : "Open full preview"}
          filterAll={t.products.categories?.all ?? "All"}
          filterIndustry={t.products.categories?.customerFacing ?? "Industry"}
          filterLayout="Layout"
        />
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section className="section bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection>
            <SectionHeading
              label={d.howItWorks.label}
              headline={d.howItWorks.heading}
              align="center"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
            {d.howItWorks.steps.map((step, i) => (
              <AnimatedSection
                key={i}
                delay={0.1 * i}
                className="flex flex-col items-center text-center"
              >
                <div className="w-[5.5rem] h-[5.5rem] rounded-full bg-white border-2 border-brand flex items-center justify-center shadow-soft mb-6">
                  <span className="font-sans font-black text-brand text-[2.75rem] leading-none">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-heading font-bold text-ink mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-body text-ink/60 leading-relaxed max-w-xs text-pretty">
                  {step.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SOVEREIGNTY TABLE
          ================================================================ */}
      <section className="section bg-white">
        <div className="container-wide">
          <AnimatedSection>
            <SectionHeading
              label={d.compliance.label}
              headline={d.compliance.heading}
              description={d.compliance.intro}
              align="center"
            />
          </AnimatedSection>

          {/* Desktop */}
          <AnimatedSection className="hidden md:block">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    {d.compliance.cols.map((col, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink/60"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.compliance.rows.map((row, i) => {
                    const highlighted = row.highlight === "true";
                    const dpa = statusTokenFor(row.dpa);
                    const del = statusTokenFor(row.del);
                    const sub = statusTokenFor(row.sub);
                    return (
                      <tr
                        key={i}
                        className={`border-t border-neutral-200 ${
                          highlighted
                            ? "bg-brand/[0.04]"
                            : "hover:bg-neutral-50/70 transition-colors"
                        }`}
                      >
                        <td
                          className={`px-6 py-5 ${
                            highlighted
                              ? "font-bold text-ink"
                              : "font-semibold text-ink"
                          }`}
                        >
                          {row.provider}
                        </td>
                        <td className="px-6 py-5 text-ink/70">{row.host}</td>
                        <td className="px-6 py-5">
                          <StatusChip
                            symbol={sub.symbol}
                            tone={sub.tone}
                            label={row.sub}
                          />
                        </td>
                        <td className="px-6 py-5">
                          <StatusChip
                            symbol={dpa.symbol}
                            tone={dpa.tone}
                            label={row.dpa}
                          />
                        </td>
                        <td className="px-6 py-5">
                          <StatusChip
                            symbol={del.symbol}
                            tone={del.tone}
                            label={row.del}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          {/* Mobile cards */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {d.compliance.rows.map((row, i) => {
              const highlighted = row.highlight === "true";
              const dpa = statusTokenFor(row.dpa);
              const del = statusTokenFor(row.del);
              const sub = statusTokenFor(row.sub);
              return (
                <AnimatedSection key={i} delay={0.05 * i}>
                  <div
                    className={`rounded-2xl border p-5 ${
                      highlighted
                        ? "bg-brand/[0.06] border-brand/30"
                        : "bg-white border-neutral-200"
                    }`}
                  >
                    <div
                      className={`text-lg text-ink ${
                        highlighted ? "font-bold" : "font-semibold"
                      }`}
                    >
                      {row.provider}
                    </div>
                    <dl className="mt-4 grid grid-cols-1 gap-3">
                      <Row label={d.compliance.cols[1]} value={row.host} />
                      <Row
                        label={d.compliance.cols[2]}
                        value={
                          <StatusChip
                            symbol={sub.symbol}
                            tone={sub.tone}
                            label={row.sub}
                          />
                        }
                      />
                      <Row
                        label={d.compliance.cols[3]}
                        value={
                          <StatusChip
                            symbol={dpa.symbol}
                            tone={dpa.tone}
                            label={row.dpa}
                          />
                        }
                      />
                      <Row
                        label={d.compliance.cols[4]}
                        value={
                          <StatusChip
                            symbol={del.symbol}
                            tone={del.tone}
                            label={row.del}
                          />
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
          PRICING — 3 cards
          ================================================================ */}
      <section id="pricing" className="section bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection>
            <SectionHeading
              label={d.pricing.label}
              headline={d.pricing.heading}
              align="center"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch max-w-5xl mx-auto">
            {d.pricing.plans.map((plan, i) => {
              const popular = plan.popular === "true";
              return (
                <AnimatedSection key={i} delay={0.08 * i}>
                  <div
                    className={`relative h-full rounded-3xl p-7 md:p-8 flex flex-col gap-6 ${
                      popular
                        ? "bg-white border-2 border-brand shadow-lifted md:-mt-2 md:mb-0"
                        : "bg-white border border-neutral-200 shadow-card"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-brand text-white text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1 shadow-cta">
                        {d.pricing.popularBadge}
                      </span>
                    )}

                    <div>
                      <div className="text-sm font-semibold uppercase tracking-wide text-ink/55">
                        {plan.name}
                      </div>
                      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                        <span className="font-sans font-extrabold text-ink text-[clamp(2.25rem,4.5vw,3rem)] leading-none tracking-[-0.03em]">
                          {plan.price}
                        </span>
                        {plan.cadence && (
                          <span className="text-sm text-ink/55">
                            {plan.cadence}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 flex-1">
                      {plan.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-brand/15 text-brand flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span className="text-sm leading-relaxed text-ink/80 text-pretty">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.href}
                      className={
                        popular
                          ? "btn-primary w-full"
                          : "btn-secondary w-full"
                      }
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </Link>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section className="section bg-white">
        <div className="container-wide">
          <AnimatedSection>
            <SectionHeading
              label={d.testimonials.label}
              headline={d.testimonials.heading}
              align="center"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {d.testimonials.items.map((item, i) => (
              <AnimatedSection key={i} delay={0.08 * i}>
                <figure className="pop-card h-full p-6 md:p-7 flex flex-col gap-5">
                  <div
                    className="flex items-center gap-0.5 text-brand"
                    aria-label="5 out of 5 stars"
                  >
                    {[0, 1, 2, 3, 4].map((j) => (
                      <Star
                        key={j}
                        size={16}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <blockquote className="text-ink text-body leading-relaxed text-pretty flex-1">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {item.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0] ?? "")
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-ink/55 truncate">
                        {item.role} · {item.company}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          LEAD FORM
          ================================================================ */}
      <section id="lead" className="section bg-neutral-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <div className="eyebrow uppercase mb-4 text-ink/60">
                {d.lead.label}
              </div>
              <h2 className="font-sans font-extrabold text-ink text-[clamp(2rem,4.5vw,3rem)] leading-[1.04] tracking-[-0.03em] text-balance">
                {d.lead.heading}
              </h2>
              <p className="mt-6 text-body-lg text-ink/60 leading-relaxed max-w-[50ch] text-pretty">
                {d.lead.intro}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-neutral-200 shadow-card p-6 md:p-8">
                {formState === "success" ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5">
                      <CheckCircle size={28} strokeWidth={2.5} />
                    </div>
                    <p className="font-sans font-bold text-ink text-2xl leading-snug text-balance max-w-md mx-auto">
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
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand accent-brand focus:ring-2 focus:ring-brand/30"
                      />
                      <span className="text-xs text-ink/60 leading-relaxed">
                        {d.lead.fields.consent}{" "}
                        <Link
                          href="/privacy"
                          className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-brand hover:text-brand transition-colors"
                        >
                          {d.lead.fields.privacyLink}
                        </Link>
                      </span>
                    </label>

                    {formState === "error" && (
                      <div className="flex items-center gap-2 text-sm text-brand bg-brand/5 border border-brand/20 rounded-xl p-3">
                        <AlertCircle size={16} strokeWidth={2} />
                        <span>{d.lead.fields.error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "sending" || !agreed}
                      className="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {formState === "sending" ? (
                        <>
                          <Loader2
                            size={16}
                            strokeWidth={2.5}
                            className="animate-spin"
                          />
                          <span>{d.lead.fields.submitting}</span>
                        </>
                      ) : (
                        <>
                          <span>{d.lead.fields.submit}</span>
                          <ArrowRight size={16} strokeWidth={2.5} />
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
          FAQ — short accordion
          ================================================================ */}
      <section className="section bg-white">
        <div className="container-wide max-w-3xl">
          <AnimatedSection>
            <SectionHeading
              label={d.faq.label}
              headline={d.faq.heading}
              align="center"
            />
          </AnimatedSection>

          <div className="space-y-3">
            {d.faq.items.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <AnimatedSection key={i} delay={0.04 * i}>
                  <div
                    className={`rounded-2xl border transition-colors ${
                      isOpen
                        ? "bg-white border-neutral-300 shadow-card"
                        : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left"
                    >
                      <span className="text-body font-semibold text-ink">
                        {item.question}
                      </span>
                      <ChevronDown
                        size={20}
                        strokeWidth={2.5}
                        className={`shrink-0 text-ink/50 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-brand" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0">
                        <p className="px-5 md:px-6 pb-5 text-body text-ink/65 leading-relaxed text-pretty">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section className="section bg-ink text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[70rem] h-[40rem] rounded-full bg-brand/25 blur-3xl"
        />
        <div className="container-wide relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="eyebrow uppercase text-brand-300 mb-5">
                {d.cta.eyebrow}
              </div>
              <h2 className="font-sans font-extrabold text-white text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.04] tracking-[-0.035em] text-balance whitespace-pre-line">
                {d.cta.heading}
              </h2>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact" className="btn-primary">
                  <span>{d.cta.primaryCta}</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 text-white font-semibold px-6 py-3.5 hover:bg-white hover:text-ink transition-colors"
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
