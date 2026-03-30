"use client";

import { motion } from "framer-motion";
import { Mail, Workflow, Brain, Database, BarChart3 } from "lucide-react";

interface AutomationFlowProps {
  className?: string;
}

const tools = [
  { icon: Mail, label: "Email", color: "#ef4444", bg: "bg-red-500/15", ring: "ring-red-500/20" },
  { icon: Workflow, label: "n8n", color: "#f97316", bg: "bg-orange-500/15", ring: "ring-orange-500/20" },
  { icon: Brain, label: "AI", color: "#8b5cf6", bg: "bg-accent-500/15", ring: "ring-accent-500/20" },
  { icon: Database, label: "CRM", color: "#3b82f6", bg: "bg-brand-500/15", ring: "ring-brand-500/20" },
  { icon: BarChart3, label: "Dashboard", color: "#14b8a6", bg: "bg-teal-500/15", ring: "ring-teal-500/20" },
];

function FlowConnector({ index }: { index: number }) {
  return (
    <div className="flex-1 relative h-[2px] mx-1 sm:mx-2 min-w-[20px]">
      {/* Background line */}
      <motion.div
        className="absolute inset-0 bg-white/[0.06] rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
        style={{ transformOrigin: "left" }}
      />
      {/* Animated dot */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        initial={{ left: "0%", opacity: 0 }}
        animate={{
          left: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          delay: 1 + index * 0.3,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
      {/* Second dot offset */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30"
        initial={{ left: "0%", opacity: 0 }}
        animate={{
          left: ["0%", "100%"],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 2.2,
          delay: 2.2 + index * 0.3,
          repeat: Infinity,
          repeatDelay: 1.8,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function AutomationFlow({ className = "" }: AutomationFlowProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-center">
        {tools.map((tool, i) => (
          <div key={i} className="contents">
            {/* Tool icon */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.12,
                ease: "backOut",
              }}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl ${tool.bg} ring-1 ${tool.ring} transition-transform duration-300 hover:scale-110`}
              >
                <tool.icon
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  style={{ color: tool.color }}
                  strokeWidth={1.5}
                />
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: `0 0 20px -5px ${tool.color}40`,
                  }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">
                {tool.label}
              </span>
            </motion.div>

            {/* Connector line between tools */}
            {i < tools.length - 1 && <FlowConnector index={i} />}
          </div>
        ))}
      </div>
    </div>
  );
}
