"use client";

import { useState, useEffect } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { getCalApi } from "@calcom/embed-react";

type FormState = "idle" | "sending" | "success" | "error";

const CALCOM_USERNAME = process.env.NEXT_PUBLIC_CALCOM_USERNAME || "drhasanhd";
const CALCOM_EVENT = process.env.NEXT_PUBLIC_CALCOM_EVENT || "discovery-call";

export function ContactPage() {
  const { t, locale } = useLocale();
  const s = t.contact;
  const [formState, setFormState] = useState<FormState>("idle");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    (async function initCal() {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="contact-title"
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <div className="eyebrow uppercase text-brand mb-4">
              {s.hero.label}
            </div>
            <h1
              id="contact-title"
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
            >
              {s.hero.headline}
            </h1>
            <p className="mt-6 md:mt-8 text-ink/70 text-body-lg leading-relaxed max-w-2xl text-pretty">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form + meeting panel */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Form — left */}
            <AnimatedSection className="lg:col-span-7">
              <div className="eyebrow uppercase text-ink/50 mb-4">Write</div>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-ink tracking-[-0.025em] leading-[1.1] mb-8 text-balance">
                Tell us about your operations
              </h2>

              <div
                id="contact-form"
                className="pop-card p-6 md:p-10"
              >
                {formState === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle
                      size={40}
                      className="text-green-600 mx-auto mb-4"
                      aria-hidden="true"
                    />
                    <h3 className="text-xl font-bold text-ink tracking-[-0.015em] mb-2">
                      {s.form.success.split(".")[0]}.
                    </h3>
                    <p className="text-sm text-ink/70">{s.form.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        name="name"
                        id="name"
                        label={s.form.name}
                        placeholder="Jane Smith"
                        required
                      />
                      <Input
                        name="email"
                        id="email"
                        type="email"
                        label={s.form.email}
                        placeholder="jane@company.com"
                        required
                      />
                    </div>
                    <Input
                      name="company"
                      id="company"
                      label={s.form.company}
                      placeholder="Acme GmbH"
                    />
                    <Textarea
                      name="message"
                      id="message"
                      label={s.form.message}
                      required
                    />

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand/30"
                      />
                      <span className="text-xs text-ink/60 leading-relaxed">
                        {s.form.consent}{" "}
                        <Link
                          href="/privacy"
                          className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                        >
                          {s.form.privacyLink}
                        </Link>
                      </span>
                    </label>

                    {formState === "error" && (
                      <div className="flex items-center gap-2 text-sm text-brand bg-brand/5 border border-brand/20 rounded-2xl px-4 py-3">
                        <AlertCircle size={16} aria-hidden="true" />
                        <span>{s.form.error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {formState === "sending" ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                          <span>{s.form.sending}</span>
                        </>
                      ) : (
                        <>
                          <span>{s.form.submit}</span>
                          <ArrowRight size={16} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Right column — meeting + info */}
            <AnimatedSection delay={0.15} className="lg:col-span-5">
              <div className="eyebrow uppercase text-ink/50 mb-4">Schedule</div>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-ink tracking-[-0.025em] leading-[1.1] mb-8 text-balance">
                {s.meeting.headline}
              </h2>

              {/* Cal.com trigger card (ink) */}
              <div className="rounded-[1.25rem] bg-ink text-white p-7 md:p-8">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar
                    size={20}
                    className="text-brand"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Discovery Call · 30 min
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed text-pretty mb-6">
                  {s.meeting.description}
                </p>
                <button
                  data-cal-link={`${CALCOM_USERNAME}/${CALCOM_EVENT}`}
                  data-cal-config={JSON.stringify({
                    layout: "month_view",
                    theme: "light",
                    locale,
                  })}
                  className="btn-primary"
                >
                  <Calendar size={16} aria-hidden="true" />
                  <span>{s.meeting.cta}</span>
                </button>
              </div>

              {/* Info cards */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="pop-card p-5">
                  <div className="flex items-center gap-2 eyebrow uppercase text-ink/50 mb-3">
                    <Clock size={12} aria-hidden="true" />
                    <span>Response</span>
                  </div>
                  <p className="text-sm text-ink/80 leading-relaxed text-pretty">
                    {s.info.response}
                  </p>
                </div>

                <div className="pop-card p-5">
                  <div className="flex items-center gap-2 eyebrow uppercase text-ink/50 mb-3">
                    <MapPin size={12} aria-hidden="true" />
                    <span>Location</span>
                  </div>
                  <p className="text-sm text-ink/80 leading-relaxed text-pretty">
                    {s.info.location}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
