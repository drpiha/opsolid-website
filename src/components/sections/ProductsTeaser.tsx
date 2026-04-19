"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Inbox, Bot, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function ProductsTeaser() {
  const { t } = useLocale();
  const p = t.products;
  const kutasia = p.items[0];

  if (!kutasia) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50/50 via-white to-white relative overflow-hidden">
      {/* Soft background orbs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-brand-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-teal-500/5 rounded-full blur-[130px]" />

      <div className="container-wide relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <Badge variant="gradient" className="mb-4">{p.hero.label}</Badge>
          <h2 className="text-heading md:text-display-sm font-bold text-slate-900 text-balance">
            {p.hero.headline}
          </h2>
          <p className="mt-5 text-body-lg text-slate-500 leading-relaxed">
            {p.hero.description}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Link
            href={kutasia.href}
            className="group relative block rounded-3xl border border-slate-200/70 bg-white overflow-hidden transition-all duration-500 hover:border-brand-300 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.2)] hover:-translate-y-1"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0">
              {/* Left content */}
              <div className="relative p-8 md:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 text-white shadow-[0_8px_24px_-8px_rgba(20,184,166,0.5)]">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      {kutasia.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[0.65rem] font-semibold text-teal-700 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                      {kutasia.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-3">{kutasia.tagline}</p>
                  <p className="text-body text-slate-600 leading-relaxed max-w-lg">
                    {kutasia.description}
                  </p>
                </div>

                <div className="mt-8">
                  <Button size="lg" variant="primary" className="group-hover:shadow-medium">
                    {kutasia.name}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Right visual */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/80 p-8 md:p-10 lg:p-12 overflow-hidden min-h-[260px] lg:min-h-0">
                <div className="absolute top-10 right-10 w-48 h-48 bg-brand-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-4 left-4 w-40 h-40 bg-teal-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 h-full flex flex-col justify-center gap-3">
                  {[
                    { icon: <Inbox size={16} />, label: "Unified Inbox", detail: "IG · WhatsApp · Email" },
                    { icon: <Bot size={16} />, label: "AI Analysis", detail: "Sentiment · Intent · Signal" },
                    { icon: <Layers size={16} />, label: "Sector Templates", detail: "15+ industries" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 * i + 0.2, duration: 0.45 }}
                      className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/30 to-teal-500/30 text-teal-300">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-white">{item.label}</div>
                        <div className="text-[0.7rem] text-slate-400">{item.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
