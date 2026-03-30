"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function AboutPage() {
  const { t } = useLocale();
  const s = t.about;

  return (
    <>
      {/* Hero - Dark gradient */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 gradient-hero-mesh overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[15%] w-60 h-60 bg-teal-500/10 rounded-full blur-[100px]" />

        <div className="container-wide text-center relative z-10">
          <AnimatedSection>
            <Badge variant="gradient" className="mb-4">{s.hero.label}</Badge>
            <h1 className="text-display-sm md:text-display font-bold text-white text-balance max-w-4xl mx-auto">
              Building <span className="gradient-text-vibrant">operational infrastructure</span> for businesses that have outgrown manual processes
            </h1>
            <p className="mt-5 text-body-lg text-slate-300 max-w-2xl mx-auto">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story - Split layout with image */}
      <section className="pb-20 md:pb-28 relative">
        <div className="absolute inset-0 gradient-mesh -z-10" />
        <div className="container-wide pt-20 md:pt-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <AnimatedSection>
              <h2 className="text-heading font-bold text-slate-900 mb-6">
                {s.story.headline}
              </h2>
              <div className="space-y-4">
                {s.story.paragraphs.map((p, i) => (
                  <p key={i} className="text-body text-slate-500 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </AnimatedSection>

            {/* Right - Image */}
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-500/20 via-accent-500/10 to-teal-500/20 rounded-2xl blur-sm" />
                <div className="relative h-[360px] lg:h-[420px] rounded-2xl overflow-hidden shadow-medium">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/20 to-transparent" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values - with subtle background image */}
      <section className="section-padding relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-slate-50/[0.94]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
        </div>

        <div className="container-wide relative z-10">
          <AnimatedSection>
            <h2 className="text-heading-lg md:text-display-sm font-bold text-slate-900 text-center mb-14">
              {s.values.headline}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {s.values.items.map((value, i) => (
              <StaggerItem key={i}>
                <div className="relative rounded-xl bg-white/80 backdrop-blur-sm border border-slate-100/80 p-6 md:p-7 pl-8 md:pl-9 h-full overflow-hidden transition-all duration-300 hover:shadow-glow-brand hover:-translate-y-0.5">
                  {/* Gradient left border */}
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-500 via-accent-500 to-teal-500 rounded-full" />
                  <h3 className="text-base font-semibold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Founder - with professional office background */}
      <section className="section-padding relative overflow-hidden">
        {/* Background image behind the entire section */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/[0.92]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40" />
        </div>

        {/* Subtle orb accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/[0.03] rounded-full blur-[120px]" />

        <div className="container-wide max-w-4xl relative z-10">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Card with gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-accent-500/10 to-teal-500/20 rounded-3xl" />
              <div className="relative m-[1px] rounded-3xl bg-white/90 backdrop-blur-sm">
                {/* Decorative pattern background */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <svg className="absolute top-0 right-0 w-80 h-80 opacity-[0.03]" viewBox="0 0 200 200">
                    <defs>
                      <pattern id="founderDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#founderDots)" />
                  </svg>
                  <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-brand-500/[0.04] to-transparent rounded-full blur-2xl" />
                </div>

                <div className="relative p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar with gradient */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                      className="flex-shrink-0"
                    >
                      <div className="relative">
                        {/* Outer glow ring */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-brand-500 via-accent-500 to-teal-500 rounded-full opacity-20 blur-sm" />
                        {/* Avatar circle */}
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-brand-600 via-accent-600 to-teal-600 flex items-center justify-center shadow-lg">
                          <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                            HD
                          </span>
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-white" />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                        {s.founder.title}
                      </p>
                      <h2 className="text-heading-sm md:text-heading font-bold text-slate-900 mb-1">
                        {s.founder.name}
                      </h2>

                      {/* Education with icon */}
                      {(s.founder as { education?: string }).education && (
                        <div className="flex items-center gap-2 mb-5">
                          <GraduationCap size={14} className="text-slate-400 flex-shrink-0" />
                          <p className="text-sm text-slate-500 italic">
                            {(s.founder as { education?: string }).education}
                          </p>
                        </div>
                      )}

                      <p className="text-body text-slate-500 leading-relaxed">
                        {s.founder.description}
                      </p>

                      {/* Expertise badges - enhanced visual treatment */}
                      {(s.founder as { expertise?: string[] }).expertise && (
                        <div className="mt-6">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-3">
                            {(s.founder as { expertiseLabel?: string }).expertiseLabel}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {((s.founder as { expertise?: string[] }).expertise ?? []).map((skill, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                              >
                                <Badge
                                  variant={i % 3 === 0 ? "gradient" : i % 3 === 1 ? "teal" : "accent"}
                                  className="shadow-sm"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                        <MapPin size={14} />
                        <span>{s.founder.footnote}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <div className="relative rounded-2xl gradient-cta px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
              {/* Floating orbs */}
              <div className="absolute top-8 right-12 w-64 h-64 bg-gradient-to-br from-brand-400/15 to-teal-400/10 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-6 left-10 w-48 h-48 bg-gradient-to-br from-accent-400/12 to-brand-400/8 rounded-full blur-2xl animate-float-delayed" />

              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                  {s.cta.headline}
                </h2>
                <p className="mt-4 text-body text-slate-300">{s.cta.description}</p>
                <Link href="/contact" className="mt-8 inline-block">
                  <Button size="xl" className="bg-white text-slate-900 hover:bg-slate-100 hover:shadow-glow">
                    {s.cta.primaryCta}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
