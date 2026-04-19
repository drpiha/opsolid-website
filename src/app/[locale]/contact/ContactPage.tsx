"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import Image from "next/image";
import { Clock, MapPin, Calendar, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

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
      {/* Hero with gradient accent */}
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="container-wide text-center">
          <AnimatedSection>
            <Badge variant="gradient" className="mb-4">{s.hero.label}</Badge>
            <h1 className="text-display-sm md:text-display font-bold text-slate-900 text-balance max-w-3xl mx-auto">
              {s.hero.headline}
            </h1>
            <p className="mt-5 text-body-lg text-slate-500 max-w-2xl mx-auto">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <AnimatedSection className="lg:col-span-3">
              {/* Form card - glass-light styling with gradient border */}
              <div id="contact-form" className="rounded-2xl glass-light gradient-border p-6 md:p-10">
                {formState === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle size={40} className="text-teal-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {s.form.success.split(".")[0]}.
                    </h3>
                    <p className="text-sm text-slate-500">{s.form.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input name="name" id="name" label={s.form.name} placeholder="Jane Smith" required />
                      <Input name="email" id="email" type="email" label={s.form.email} placeholder="jane@company.com" required />
                    </div>
                    <Input name="company" id="company" label={s.form.company} placeholder="Acme GmbH" />
                    <Textarea name="message" id="message" label={s.form.message} required />

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        {s.form.consent}{" "}
                        <Link href="/privacy" className="text-brand-600 hover:underline">
                          {s.form.privacyLink}
                        </Link>
                      </span>
                    </label>

                    {formState === "error" && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                        <AlertCircle size={16} />
                        <span>{s.form.error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={formState === "sending"}
                    >
                      {formState === "sending" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {s.form.sending}
                        </>
                      ) : (
                        <>
                          {s.form.submit}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="lg:col-span-2">
              <div className="space-y-5">
                {/* Meeting card - Cal.com popup trigger */}
                <div className="block">
                  <div className="rounded-2xl gradient-cta p-6 md:p-7 hover:shadow-glow transition-all duration-300 overflow-hidden relative">
                    {/* Subtle floating orb */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl" />

                    <div className="relative z-10">
                      <Calendar size={20} className="text-teal-300 mb-3" />
                      <h3 className="text-base font-semibold text-white mb-2">{s.meeting.headline}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-5">{s.meeting.description}</p>
                      <button
                        data-cal-link={`${CALCOM_USERNAME}/${CALCOM_EVENT}`}
                        data-cal-config={JSON.stringify({ layout: "month_view", theme: "light", locale })}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 text-sm font-medium transition-colors"
                      >
                        <Calendar size={16} />
                        {s.meeting.cta}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100/80 bg-white/80 backdrop-blur-sm p-6 md:p-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
                      <Clock size={13} className="text-teal-500" />
                    </div>
                    <span className="text-sm text-slate-500">{s.info.response}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-50">
                      <MapPin size={13} className="text-accent-500" />
                    </div>
                    <span className="text-sm text-slate-500">{s.info.location}</span>
                  </div>
                </div>

                {/* Modern office image accent */}
                <div className="relative h-[200px] rounded-2xl overflow-hidden shadow-soft">
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 via-brand-900/10 to-transparent" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
