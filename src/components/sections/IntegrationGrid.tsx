"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageCircle,
  Send,
  Workflow,
  ShoppingBag,
  Users,
  Database,
  Mail,
  Code,
  Cloud,
  HardDrive,
  Zap,
  Settings,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  messageCircle: <MessageCircle size={22} />,
  send: <Send size={22} />,
  workflow: <Workflow size={22} />,
  shoppingBag: <ShoppingBag size={22} />,
  users: <Users size={22} />,
  database: <Database size={22} />,
  mail: <Mail size={22} />,
  code: <Code size={22} />,
  cloud: <Cloud size={22} />,
  hardDrive: <HardDrive size={22} />,
  zap: <Zap size={22} />,
  settings: <Settings size={22} />,
};

// Brand-colored backgrounds per tool
const colorMap: Record<string, { bg: string; text: string; hoverBorder: string }> = {
  messageCircle: { bg: "bg-green-50", text: "text-green-600", hoverBorder: "hover:border-green-200" },
  send: { bg: "bg-blue-50", text: "text-blue-500", hoverBorder: "hover:border-blue-200" },
  workflow: { bg: "bg-orange-50", text: "text-orange-600", hoverBorder: "hover:border-orange-200" },
  shoppingBag: { bg: "bg-emerald-50", text: "text-emerald-600", hoverBorder: "hover:border-emerald-200" },
  users: { bg: "bg-brand-50", text: "text-brand-600", hoverBorder: "hover:border-brand-200" },
  database: { bg: "bg-slate-50", text: "text-slate-600", hoverBorder: "hover:border-slate-300" },
  mail: { bg: "bg-red-50", text: "text-red-500", hoverBorder: "hover:border-red-200" },
  code: { bg: "bg-teal-50", text: "text-teal-600", hoverBorder: "hover:border-teal-200" },
  cloud: { bg: "bg-sky-50", text: "text-sky-500", hoverBorder: "hover:border-sky-200" },
  hardDrive: { bg: "bg-purple-50", text: "text-purple-500", hoverBorder: "hover:border-purple-200" },
  zap: { bg: "bg-orange-50", text: "text-orange-500", hoverBorder: "hover:border-orange-200" },
  settings: { bg: "bg-violet-50", text: "text-violet-600", hoverBorder: "hover:border-violet-200" },
};

/**
 * Animated SVG overlay that draws connecting lines between grid items,
 * giving the impression that all tools are interconnected.
 */
function ConnectionOverlay({ itemCount }: { itemCount: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  // Pre-calculate connection lines for a 6-column grid (max 12 items)
  // These are expressed as percentages to stay responsive
  const connections = [
    // Row 1 horizontal connections
    { x1: "16.6%", y1: "30%", x2: "33.3%", y2: "30%" },
    { x1: "33.3%", y1: "30%", x2: "50%", y2: "30%" },
    { x1: "50%", y1: "30%", x2: "66.6%", y2: "30%" },
    { x1: "66.6%", y1: "30%", x2: "83.3%", y2: "30%" },
    // Cross connections (diagonal)
    { x1: "25%", y1: "35%", x2: "42%", y2: "65%" },
    { x1: "58%", y1: "35%", x2: "42%", y2: "65%" },
    { x1: "75%", y1: "35%", x2: "58%", y2: "65%" },
    // Row 2 horizontal connections
    { x1: "16.6%", y1: "70%", x2: "33.3%", y2: "70%" },
    { x1: "33.3%", y1: "70%", x2: "50%", y2: "70%" },
    { x1: "50%", y1: "70%", x2: "66.6%", y2: "70%" },
    { x1: "66.6%", y1: "70%", x2: "83.3%", y2: "70%" },
  ].slice(0, Math.min(itemCount + 2, 11));

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none hidden md:block">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {connections.map((conn, i) => (
          <motion.line
            key={i}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="url(#connectionGrad)"
            strokeWidth="1"
            strokeDasharray="4 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
          >
            {isInView && (
              <animate
                attributeName="stroke-dashoffset"
                values="0;-20"
                dur={`${3 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            )}
          </motion.line>
        ))}
      </svg>
    </div>
  );
}

export function IntegrationGrid() {
  const { t } = useLocale();
  const s = t.home.integrations;

  return (
    <section className="section-padding-sm">
      <div className="container-wide">
        <SectionHeading label={s.label} headline={s.headline} />

        <div className="relative max-w-4xl mx-auto">
          {/* Animated connecting lines overlay */}
          <ConnectionOverlay itemCount={s.items.length} />

          <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 relative z-10">
            {s.items.map((item, i) => {
              const color = colorMap[item.icon] || { bg: "bg-slate-50", text: "text-slate-500", hoverBorder: "hover:border-slate-300" };
              return (
                <StaggerItem key={i}>
                  <div
                    className={`flex flex-col items-center gap-3 rounded-2xl bg-white border border-slate-100/80 p-5 md:p-6 transition-all duration-300 ${color.hoverBorder} hover:shadow-glow hover:scale-105 cursor-default`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.bg} ${color.text}`}>
                      {iconMap[item.icon] || <Code size={22} />}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center leading-tight">
                      {item.name}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
