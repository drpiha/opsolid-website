"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function CTASection() {
  const { t } = useLocale();
  const s = t.home.cta;

  return (
    <section className="section-padding">
      <div className="container-wide">
        <AnimatedSection>
          <div className="relative rounded-2xl px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
            {/* Gradient CTA background */}
            <div className="absolute inset-0 gradient-cta" />
            {/* Animated floating orbs */}
            <div className="absolute top-8 right-12 w-64 h-64 bg-gradient-to-br from-brand-400/15 to-teal-400/10 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-6 left-10 w-48 h-48 bg-gradient-to-br from-accent-400/12 to-brand-400/8 rounded-full blur-2xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-gradient-to-br from-teal-400/10 to-cyan-400/8 rounded-full blur-2xl animate-float-slow" />

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                {s.headline}
              </h2>
              <p className="mt-4 text-body text-slate-300">
                {s.description}
              </p>
              <Link href="/contact" className="mt-8 inline-block">
                <Button
                  size="xl"
                  className="bg-white text-slate-900 hover:bg-slate-100 hover:shadow-glow"
                >
                  {s.primaryCta}
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
