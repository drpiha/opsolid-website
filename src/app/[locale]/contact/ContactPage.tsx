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
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ CONTACT · 07 ]   CONVERSATION
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-10 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 animate-fade-in">
              <div className="mono-label text-ink/60 mb-5">{s.hero.label}</div>
              <h1
                id="contact-title"
                className="font-serif text-ink text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance"
              >
                {s.hero.headline}
              </h1>
            </div>

            <div className="lg:col-span-5 lg:pt-6 animate-fade-in">
              <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
                {s.hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form + meeting panel */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Form — left */}
            <AnimatedSection className="lg:col-span-7">
              <div className="mono-label mb-5">[ 01 ] WRITE</div>
              <h2 className="font-serif text-ink text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] mb-8 text-balance">
                Tell us about your operations
              </h2>

              <div id="contact-form" className="hairline bg-paper-warm rounded-2xl p-6 md:p-10">
                {formState === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle
                      size={40}
                      className="text-amber-700 mx-auto mb-4"
                      aria-hidden="true"
                    />
                    <h3 className="font-serif text-ink text-[1.5rem] leading-[1.2] mb-2">
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
                        className="mt-1 h-4 w-4 rounded border-ink/30 text-ink focus:ring-amber"
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
                      <div className="flex items-center gap-2 text-sm text-amber-700 hairline bg-amber/10 rounded-md p-3">
                        <AlertCircle size={16} aria-hidden="true" />
                        <span>{s.form.error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-3.5 font-medium hairline hover:bg-amber-600 hover:text-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Right column — meeting + info */}
            <AnimatedSection delay={0.15} className="lg:col-span-5">
              <div className="mono-label mb-5">[ 02 ] SCHEDULE</div>
              <h2 className="font-serif text-ink text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] mb-8 text-balance">
                {s.meeting.headline}
              </h2>

              {/* Cal.com trigger */}
              <div className="hairline bg-ink text-paper paper-grain rounded-2xl p-6 md:p-7">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar
                    size={20}
                    className="text-amber"
                    aria-hidden="true"
                  />
                  <span className="mono-label text-paper/60">
                    DISCOVERY CALL · 30 MIN
                  </span>
                </div>
                <p className="text-paper/70 text-sm leading-relaxed text-pretty mb-5">
                  {s.meeting.description}
                </p>
                <button
                  data-cal-link={`${CALCOM_USERNAME}/${CALCOM_EVENT}`}
                  data-cal-config={JSON.stringify({
                    layout: "month_view",
                    theme: "light",
                    locale,
                  })}
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-5 py-3 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <Calendar size={16} aria-hidden="true" />
                  <span>{s.meeting.cta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              </div>

              {/* Info cards */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="hairline bg-paper-warm rounded-2xl p-5">
                  <div className="mono-label text-ink/50 mb-3 flex items-center gap-2">
                    <Clock size={12} aria-hidden="true" />
                    <span>RESPONSE</span>
                  </div>
                  <p className="text-sm text-ink/80 leading-relaxed text-pretty">
                    {s.info.response}
                  </p>
                </div>

                <div className="hairline bg-paper-warm rounded-2xl p-5">
                  <div className="mono-label text-ink/50 mb-3 flex items-center gap-2">
                    <MapPin size={12} aria-hidden="true" />
                    <span>LOCATION</span>
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
