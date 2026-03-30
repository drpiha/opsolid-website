"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingDown, Zap, Clock, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

const iconConfig = [
  { icon: TrendingDown, gradient: "from-brand-500/10 to-brand-600/5", iconColor: "text-brand-500" },
  { icon: Zap, gradient: "from-teal-500/10 to-teal-600/5", iconColor: "text-teal-500" },
  { icon: Clock, gradient: "from-accent-500/10 to-accent-600/5", iconColor: "text-accent-500" },
  { icon: Rocket, gradient: "from-cyan-400/10 to-brand-500/5", iconColor: "text-cyan-500" },
];

function AnimatedNumber({
  value,
  isInView,
}: {
  value: string;
  isInView: boolean;
}) {
  const numericMatch = value.match(/(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const prefix = value.slice(0, value.indexOf(numericMatch?.[0] || ""));
  const suffix = value.slice(
    value.indexOf(numericMatch?.[0] || "") + (numericMatch?.[0]?.length || 0)
  );

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1800;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * numericValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, numericValue]);

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export function ResultsShowcase() {
  const { t } = useLocale();
  const s = t.home.results;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/[0.03] rounded-full blur-[120px] -z-10" />

      <div className="container-wide">
        <SectionHeading label={s.label} headline={s.headline} />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {(s.items as Array<{ value: string; label: string; description: string }>).map((item, i) => {
            const config = iconConfig[i] || iconConfig[0];
            const Icon = config.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="group relative"
              >
                <div className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} border border-slate-100/80 bg-white/70 backdrop-blur-xl p-6 md:p-7 h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1 hover:border-slate-200`}>
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-soft mb-4 ${config.iconColor}`}>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    <AnimatedNumber value={item.value} isInView={isInView} />
                  </div>

                  <div className="mt-1.5 text-sm font-semibold text-slate-700">
                    {item.label}
                  </div>

                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
