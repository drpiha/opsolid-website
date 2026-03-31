"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Workflow, MessageCircle, Send, Zap, Bot, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleContext";
import { AnimatedWorkflow } from "@/components/illustrations/AnimatedWorkflow";

const floatingIcons = [
  { icon: Workflow, className: "top-[15%] left-[8%] animate-float", color: "text-brand-400/30" },
  { icon: MessageCircle, className: "top-[25%] right-[10%] animate-float-delayed", color: "text-teal-400/25" },
  { icon: Send, className: "bottom-[30%] left-[12%] animate-float-slow", color: "text-accent-400/20" },
  { icon: Zap, className: "top-[60%] right-[8%] animate-float", color: "text-cyan-400/25" },
  { icon: Bot, className: "top-[10%] right-[25%] animate-float-slow", color: "text-brand-300/20" },
  { icon: LayoutDashboard, className: "bottom-[20%] right-[22%] animate-float-delayed", color: "text-teal-300/20" },
];

export function Hero() {
  const { t } = useLocale();
  const hero = t.home.hero;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 lg:pt-48 lg:pb-36 gradient-hero-mesh">
      {/* Decorative glowing orbs */}
      <div className="absolute top-20 left-[15%] w-72 h-72 bg-brand-500/15 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/8 rounded-full blur-[150px]" />

      {/* Floating tool icons */}
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className={`absolute hidden lg:block ${item.className} ${item.color}`}
        >
          <item.icon size={28} />
        </div>
      ))}

      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side - Text content (60%) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 lg:max-w-[60%] text-center lg:text-left"
          >
            <h1 className="text-display-sm md:text-display lg:text-display-lg font-bold text-white whitespace-pre-line">
              {hero.headline.includes("\n") ? (
                <>
                  <span className="gradient-text-vibrant">{hero.headline.split("\n")[0]}</span>
                  {"\n"}
                  {hero.headline.split("\n").slice(1).join("\n")}
                </>
              ) : (
                <span className="gradient-text-vibrant">{hero.headline}</span>
              )}
            </h1>
            <p className="mt-6 md:mt-8 text-body-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subheadline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link href="/contact">
                <Button variant="gradient" size="xl">
                  {hero.primaryCta}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  size="xl"
                  className="glass-dark text-white hover:bg-white/10 border-white/10"
                >
                  {hero.secondaryCta}
                </Button>
              </Link>
            </div>

          </motion.div>

          {/* Right side - Animated Workflow (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:block w-full lg:w-[45%] lg:max-w-[540px]"
          >
            <AnimatedWorkflow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
