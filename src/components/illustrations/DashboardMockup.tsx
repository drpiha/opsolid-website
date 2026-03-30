"use client";

import { motion } from "framer-motion";

interface DashboardMockupProps {
  className?: string;
}

export function DashboardMockup({ className = "" }: DashboardMockupProps) {
  const barHeights = [45, 70, 55, 85, 60, 90, 75];
  const linePoints = "0,60 40,45 80,50 120,30 160,35 200,15 240,20";

  return (
    <div className={`relative w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Browser frame */}
        <div className="rounded-2xl bg-[#0d1117] border border-white/[0.06] shadow-2xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#d29922]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/80" />
            </div>
            <span className="ml-2 text-[10px] text-slate-500 font-medium tracking-wide">
              dashboard.solidra
            </span>
          </div>

          {/* Dashboard body */}
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden sm:flex w-14 md:w-16 border-r border-white/[0.04] flex-col items-center py-4 gap-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={`w-6 h-6 rounded-lg ${i === 0 ? "bg-brand-500/30" : "bg-white/[0.04]"}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-3 md:p-5 space-y-3 md:space-y-4">
              {/* Metric cards row */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { label: "Total Runs", value: "12,847", color: "from-brand-500/20 to-brand-600/5", accent: "#3b82f6" },
                  { label: "Success Rate", value: "99.2%", color: "from-teal-500/20 to-teal-600/5", accent: "#14b8a6" },
                  { label: "Time Saved", value: "847h", color: "from-accent-500/20 to-accent-600/5", accent: "#8b5cf6" },
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    className={`rounded-xl bg-gradient-to-br ${metric.color} border border-white/[0.04] p-2.5 md:p-3`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider">
                      {metric.label}
                    </div>
                    <motion.div
                      className="text-sm md:text-lg font-bold mt-0.5"
                      style={{ color: metric.accent }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      {metric.value}
                    </motion.div>
                    {/* Mini sparkline */}
                    <svg className="w-full h-4 mt-1" viewBox="0 0 80 16" preserveAspectRatio="none">
                      <motion.path
                        d="M0,12 Q10,8 20,10 T40,6 T60,8 T80,3"
                        fill="none"
                        stroke={metric.accent}
                        strokeWidth="1.5"
                        opacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }}
                      />
                    </svg>
                  </motion.div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {/* Bar chart */}
                <div className="col-span-3 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 md:p-4">
                  <div className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider mb-3">
                    Workflow Executions
                  </div>
                  <svg className="w-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet">
                    {barHeights.map((h, i) => (
                      <motion.rect
                        key={i}
                        x={i * 28 + 4}
                        y={100 - h}
                        width="18"
                        height={h}
                        rx="3"
                        fill={i === 5 ? "#3b82f6" : "rgba(59, 130, 246, 0.25)"}
                        initial={{ height: 0, y: 100 }}
                        animate={{ height: h, y: 100 - h }}
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                      />
                    ))}
                  </svg>
                </div>

                {/* Line chart */}
                <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 md:p-4">
                  <div className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider mb-3">
                    Performance
                  </div>
                  <svg className="w-full" viewBox="0 0 240 70" preserveAspectRatio="xMidYMid meet">
                    {/* Gradient fill under line */}
                    <defs>
                      <linearGradient id="lineGradFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.polygon
                      points={`0,70 ${linePoints} 240,70`}
                      fill="url(#lineGradFill)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    />
                    <motion.polyline
                      points={linePoints}
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                    {/* Dot at end */}
                    <motion.circle
                      cx="240"
                      cy="20"
                      r="3"
                      fill="#14b8a6"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.3 }}
                    />
                  </svg>
                </div>
              </div>

              {/* Activity list */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 md:p-4">
                <div className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider mb-2">
                  Recent Activity
                </div>
                <div className="space-y-1.5">
                  {[
                    { status: "#3fb950", text: "Order sync completed", time: "2m ago" },
                    { status: "#3fb950", text: "Invoice generated", time: "5m ago" },
                    { status: "#3b82f6", text: "AI analysis running...", time: "now" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + i * 0.12 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.status }} />
                      <span className="text-[8px] md:text-[9px] text-slate-400 flex-1">
                        {item.text}
                      </span>
                      <span className="text-[7px] md:text-[8px] text-slate-600">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
