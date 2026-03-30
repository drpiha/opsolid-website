"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const viewportConfig = { once: true, margin: "-60px" as const };

function Frame({
  label,
  gridId,
  children,
  className = "",
}: {
  label: string;
  gridId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="rounded-2xl bg-[#0d1117] border border-white/[0.06] shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#d29922]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/80" />
          </div>
          <span className="ml-2 text-[10px] text-slate-500 font-medium tracking-wide">
            {label}
          </span>
        </div>
        {/* Canvas */}
        <div className="relative p-3 md:p-4">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={gridId}
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${gridId})`} />
          </svg>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Reusable glow filter */
function GlowFilter({ id, color, opacity = 0.3 }: { id: string; color: string; opacity?: number }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feFlood floodColor={color} floodOpacity={opacity} />
      <feComposite in2="blur" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/* ------------------------------------------------------------------ */
/*  1. ProcessAutomationIllustration                                   */
/* ------------------------------------------------------------------ */

const processNodes = [
  { label: "Trigger", x: 20, y: 65, color: "#3b82f6", bg: "#1e3a8a" },
  { label: "Process", x: 100, y: 65, color: "#10b981", bg: "#064e3b" },
  { label: "Filter", x: 180, y: 65, color: "#8b5cf6", bg: "#4c1d95" },
  { label: "Output", x: 260, y: 65, color: "#14b8a6", bg: "#115e59" },
];

const processConns = [
  "M 68,80 L 100,80",
  "M 148,80 L 180,80",
  "M 228,80 L 260,80",
];

export function ProcessAutomationIllustration({ className = "" }: { className?: string }) {
  return (
    <Frame label="process.flow" gridId="procGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="procGlowB" color="#3b82f6" />
          <GlowFilter id="procGlowT" color="#14b8a6" />
        </defs>

        {/* Connections */}
        {processConns.map((path, i) => (
          <g key={i}>
            <motion.path
              d={path}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            />
            <motion.path
              d={path}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            >
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite" />
            </motion.path>
            <circle r="2.5" fill="white" opacity="0.6">
              <animateMotion dur={`${2 + i * 0.4}s`} repeatCount="indefinite" path={path} />
            </circle>
          </g>
        ))}

        {/* Nodes */}
        {processNodes.map((n, i) => (
          <motion.g
            key={n.label}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: "backOut" }}
            style={{ transformOrigin: `${n.x + 24}px ${n.y + 15}px` }}
          >
            <rect x={n.x} y={n.y} width="48" height="30" rx="8" fill={n.bg} stroke={n.color} strokeWidth="1" opacity="0.9" filter={i === 0 ? "url(#procGlowB)" : i === 3 ? "url(#procGlowT)" : undefined} />
            {/* Small icon inside */}
            <circle cx={n.x + 24} cy={n.y + 13} r="4" fill="none" stroke={n.color} strokeWidth="1" opacity="0.6" />
            <text x={n.x + 24} y={n.y + 15} textAnchor="middle" fill={n.color} fontSize="5" fontFamily="system-ui" fontWeight="600">
              {(i + 1).toString()}
            </text>
            <text x={n.x + 24} y={n.y + 44} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="system-ui" fontWeight="500">
              {n.label}
            </text>
          </motion.g>
        ))}

        {/* Arrow heads hint */}
        {processConns.map((_, i) => (
          <motion.polygon
            key={`arr${i}`}
            points={`${100 + i * 80 - 3},76 ${100 + i * 80},80 ${100 + i * 80 - 3},84`}
            fill="rgba(255,255,255,0.15)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.7 + i * 0.15 }}
          />
        ))}
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  2. InternalToolsIllustration                                       */
/* ------------------------------------------------------------------ */

const barHeights = [50, 75, 40, 90, 65];
const sparkline1 = "M0,12 L8,8 L16,10 L24,4 L32,6 L40,2";
const sparkline2 = "M0,10 L8,12 L16,6 L24,8 L32,3 L40,5";

export function InternalToolsIllustration({ className = "" }: { className?: string }) {
  return (
    <Frame label="dashboard.view" gridId="dashGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="dashGlowB" color="#3b82f6" />
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        {/* Metric card 1 */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <rect x="20" y="15" width="130" height="50" rx="8" fill="#161b22" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x="32" y="33" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="system-ui">Active Processes</text>
          <text x="32" y="50" fill="#3b82f6" fontSize="14" fontFamily="system-ui" fontWeight="700">2,847</text>
          <g transform="translate(100,28)">
            <path d={sparkline1} fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          </g>
        </motion.g>

        {/* Metric card 2 */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <rect x="170" y="15" width="130" height="50" rx="8" fill="#161b22" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x="182" y="33" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="system-ui">Success Rate</text>
          <text x="182" y="50" fill="#14b8a6" fontSize="14" fontFamily="system-ui" fontWeight="700">99.2%</text>
          <g transform="translate(250,28)">
            <path d={sparkline2} fill="none" stroke="#14b8a6" strokeWidth="1.5" opacity="0.7" />
          </g>
        </motion.g>

        {/* Bar chart */}
        {barHeights.map((h, i) => {
          const barW = 30;
          const gap = 12;
          const startX = 40 + i * (barW + gap);
          const maxH = 90;
          const barH = (h / 100) * maxH;
          return (
            <motion.rect
              key={i}
              x={startX}
              y={170 - barH}
              width={barW}
              height={barH}
              rx="4"
              fill="url(#barGrad)"
              opacity="0.85"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: "backOut" }}
              style={{ transformOrigin: `${startX + barW / 2}px 170px` }}
            />
          );
        })}

        {/* Bar chart baseline */}
        <line x1="30" y1="170" x2="290" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  3. WorkflowOrchestrationIllustration                               */
/* ------------------------------------------------------------------ */

const orchPaths = {
  startToDiamond: "M 80,90 L 130,90",
  diamondToA: "M 170,75 L 220,50",
  diamondToB: "M 170,105 L 220,130",
};

export function WorkflowOrchestrationIllustration({ className = "" }: { className?: string }) {
  return (
    <Frame label="orchestration.tree" gridId="orchGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="orchGlow" color="#8b5cf6" />
          <GlowFilter id="orchGlowG" color="#10b981" />
        </defs>

        {/* Connections */}
        {Object.values(orchPaths).map((path, i) => (
          <g key={i}>
            <motion.path
              d={path}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
            />
            <motion.path
              d={path}
              stroke="#8b5cf6"
              strokeWidth="1.5"
              fill="none"
              opacity="0.35"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
            >
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.8s" repeatCount="indefinite" />
            </motion.path>
            <circle r="2" fill="#8b5cf6" opacity="0.7">
              <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" path={path} />
            </circle>
          </g>
        ))}

        {/* Start node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
          style={{ transformOrigin: "55px 90px" }}
        >
          <rect x="30" y="75" width="50" height="30" rx="8" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1" filter="url(#orchGlow)" />
          <text x="55" y="94" textAnchor="middle" fill="#c4b5fd" fontSize="7" fontFamily="system-ui" fontWeight="600">Start</text>
        </motion.g>

        {/* Diamond decision */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
          style={{ transformOrigin: "150px 90px" }}
        >
          <polygon points="150,65 175,90 150,115 125,90" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1" />
          <text x="150" y="93" textAnchor="middle" fill="#c4b5fd" fontSize="6" fontFamily="system-ui" fontWeight="600">IF</text>
        </motion.g>

        {/* Branch labels */}
        <motion.text
          x="185" y="72" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="system-ui"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ delay: 0.6 }}
        >
          Yes
        </motion.text>
        <motion.text
          x="185" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="system-ui"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ delay: 0.6 }}
        >
          No
        </motion.text>

        {/* End node A */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.5, ease: "backOut" }}
          style={{ transformOrigin: "245px 50px" }}
        >
          <rect x="220" y="35" width="55" height="30" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1" filter="url(#orchGlowG)" />
          <text x="247" y="54" textAnchor="middle" fill="#6ee7b7" fontSize="7" fontFamily="system-ui" fontWeight="600">Action A</text>
        </motion.g>

        {/* End node B */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.6, ease: "backOut" }}
          style={{ transformOrigin: "247px 130px" }}
        >
          <rect x="220" y="115" width="55" height="30" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
          <text x="247" y="134" textAnchor="middle" fill="#fcd34d" fontSize="7" fontFamily="system-ui" fontWeight="600">Action B</text>
        </motion.g>
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  4. SystemsIntegrationIllustration                                  */
/* ------------------------------------------------------------------ */

const satellites = [
  { label: "CRM", angle: 0, color: "#10b981", bg: "#064e3b" },
  { label: "ERP", angle: 90, color: "#8b5cf6", bg: "#4c1d95" },
  { label: "DB", angle: 180, color: "#f59e0b", bg: "#78350f" },
  { label: "API", angle: 270, color: "#14b8a6", bg: "#115e59" },
];

function satPos(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 160 + Math.cos(rad) * r, y: 90 + Math.sin(rad) * r };
}

export function SystemsIntegrationIllustration({ className = "" }: { className?: string }) {
  const cx = 160;
  const cy = 90;
  const radius = 60;

  return (
    <Frame label="integration.hub" gridId="intGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="intGlowB" color="#3b82f6" />
          <GlowFilter id="intGlowS" color="#8b5cf6" />
        </defs>

        {/* Connections + flowing dots */}
        {satellites.map((sat, i) => {
          const pos = satPos(sat.angle, radius);
          const pathOut = `M ${cx},${cy} L ${pos.x},${pos.y}`;
          const pathIn = `M ${pos.x},${pos.y} L ${cx},${cy}`;
          return (
            <g key={sat.label}>
              <motion.line
                x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              />
              <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={sat.color} strokeWidth="1" opacity="0.15" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="2s" repeatCount="indefinite" />
              </line>
              {/* Outbound dot */}
              <circle r="2" fill={sat.color} opacity="0.7">
                <animateMotion dur={`${2 + i * 0.2}s`} repeatCount="indefinite" path={pathOut} />
              </circle>
              {/* Inbound dot */}
              <circle r="2" fill="white" opacity="0.5">
                <animateMotion dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" path={pathIn} />
              </circle>
            </g>
          );
        })}

        {/* Center hub */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle cx={cx} cy={cy} r="22" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" filter="url(#intGlowB)" />
          <text x={cx} y={cy + 3} textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="system-ui" fontWeight="700">Hub</text>
          {/* Pulsing ring */}
          <circle cx={cx} cy={cy} r="22" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
            <animate attributeName="r" values="22;28;22" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </motion.g>

        {/* Satellite nodes */}
        {satellites.map((sat, i) => {
          const pos = satPos(sat.angle, radius);
          return (
            <motion.g
              key={sat.label}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: "backOut" }}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              <circle cx={pos.x} cy={pos.y} r="16" fill={sat.bg} stroke={sat.color} strokeWidth="1" />
              <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={sat.color} fontSize="7" fontFamily="system-ui" fontWeight="600">{sat.label}</text>
            </motion.g>
          );
        })}
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  5. MarketingSalesIllustration                                      */
/* ------------------------------------------------------------------ */

export function MarketingSalesIllustration({ className = "" }: { className?: string }) {
  const stages = [
    { label: "Leads", y: 25, w: 220, color: "#8b5cf6" },
    { label: "Nurture", y: 70, w: 160, color: "#3b82f6" },
    { label: "Convert", y: 115, w: 100, color: "#14b8a6" },
  ];

  return (
    <Frame label="funnel.pipeline" gridId="funnelGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="funnGlowV" color="#8b5cf6" />
          <GlowFilter id="funnGlowT" color="#14b8a6" />
        </defs>

        {/* Funnel shape (trapezoid outlines) */}
        <motion.path
          d="M 50,20 L 270,20 L 210,160 L 110,160 Z"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Stage bars */}
        {stages.map((s, i) => {
          const x = (320 - s.w) / 2;
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: "backOut" }}
              style={{ transformOrigin: `160px ${s.y + 15}px` }}
            >
              <rect x={x} y={s.y} width={s.w} height="30" rx="6" fill={s.color} opacity="0.15" stroke={s.color} strokeWidth="1" strokeOpacity="0.4" filter={i === 0 ? "url(#funnGlowV)" : i === 2 ? "url(#funnGlowT)" : undefined} />
              <text x="160" y={s.y + 19} textAnchor="middle" fill={s.color} fontSize="8" fontFamily="system-ui" fontWeight="600">{s.label}</text>
            </motion.g>
          );
        })}

        {/* Flowing dots downward */}
        {[0, 1, 2].map((i) => (
          <circle key={`fd${i}`} r="2.5" fill="white" opacity="0.5">
            <animateMotion
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
              path={`M ${150 + i * 10},18 L ${155 + i * 3},90 L 160,160`}
              begin={`${i * 0.6}s`}
            />
          </circle>
        ))}

        {/* Bottom result indicator */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ delay: 0.9 }}
        >
          <text x="160" y="175" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="system-ui">Conversions</text>
        </motion.g>
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  6. ShippingOrderIllustration                                       */
/* ------------------------------------------------------------------ */

const shipSteps = [
  { label: "Order", x: 35, color: "#3b82f6", bg: "#1e3a8a" },
  { label: "Process", x: 110, color: "#10b981", bg: "#064e3b" },
  { label: "Ship", x: 185, color: "#14b8a6", bg: "#115e59" },
  { label: "Deliver", x: 260, color: "#f59e0b", bg: "#78350f" },
];

export function ShippingOrderIllustration({ className = "" }: { className?: string }) {
  const lineY = 90;

  return (
    <Frame label="order.tracking" gridId="shipGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="shipGlowB" color="#3b82f6" />
          <linearGradient id="shipLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Base line */}
        <line x1="55" y1={lineY} x2="280" y2={lineY} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

        {/* Animated progress line */}
        <motion.line
          x1="55" y1={lineY} x2="280" y2={lineY}
          stroke="url(#shipLineGrad)"
          strokeWidth="2"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 1.2, delay: 0.4 }}
        />

        {/* Flowing progress dot */}
        <circle r="3" fill="white" opacity="0.7">
          <animateMotion dur="3s" repeatCount="indefinite" path={`M 55,${lineY} L 280,${lineY}`} />
        </circle>

        {/* Step nodes */}
        {shipSteps.map((step, i) => (
          <motion.g
            key={step.label}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: "backOut" }}
            style={{ transformOrigin: `${step.x}px ${lineY}px` }}
          >
            {/* Circle node */}
            <circle cx={step.x} cy={lineY} r="16" fill={step.bg} stroke={step.color} strokeWidth="1.5" filter={i === 0 ? "url(#shipGlowB)" : undefined} />
            {/* Step number */}
            <text x={step.x} y={lineY + 3} textAnchor="middle" fill={step.color} fontSize="9" fontFamily="system-ui" fontWeight="700">{i + 1}</text>
            {/* Label below */}
            <text x={step.x} y={lineY + 32} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="system-ui" fontWeight="500">{step.label}</text>
          </motion.g>
        ))}

        {/* Connecting dots between steps */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`dot${i}`}
            cx={(shipSteps[i].x + shipSteps[i + 1].x) / 2}
            cy={lineY}
            r="1.5"
            fill="rgba(255,255,255,0.15)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.6 + i * 0.1 }}
          />
        ))}
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  7. MessagingIllustration                                           */
/* ------------------------------------------------------------------ */

const channels = [
  { label: "WhatsApp", angle: -45, color: "#22c55e", bg: "#14532d" },
  { label: "Telegram", angle: 45, color: "#38bdf8", bg: "#0c4a6e" },
  { label: "Email", angle: 135, color: "#f87171", bg: "#7f1d1d" },
  { label: "SMS", angle: 225, color: "#f59e0b", bg: "#78350f" },
];

function chPos(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 160 + Math.cos(rad) * r, y: 90 + Math.sin(rad) * r };
}

export function MessagingIllustration({ className = "" }: { className?: string }) {
  const cx = 160;
  const cy = 90;
  const radius = 58;

  return (
    <Frame label="messaging.hub" gridId="msgGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="msgGlowC" color="#3b82f6" />
          <GlowFilter id="msgGlowG" color="#22c55e" />
        </defs>

        {/* Connections + outward flowing dots */}
        {channels.map((ch, i) => {
          const pos = chPos(ch.angle, radius);
          const pathOut = `M ${cx},${cy} L ${pos.x},${pos.y}`;
          return (
            <g key={ch.label}>
              <motion.line
                x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              />
              <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={ch.color} strokeWidth="1" opacity="0.2" strokeDasharray="3 5">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.5s" repeatCount="indefinite" />
              </line>
              {/* Message dot flowing outward */}
              <circle r="2.5" fill={ch.color} opacity="0.8">
                <animateMotion dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" path={pathOut} />
              </circle>
            </g>
          );
        })}

        {/* Center hub */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle cx={cx} cy={cy} r="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" filter="url(#msgGlowC)" />
          {/* Chat icon */}
          <g transform={`translate(${cx - 7},${cy - 7})`}>
            <path d="M2 2C2 1.4 2.4 1 3 1H11C11.6 1 12 1.4 12 2V8C12 8.6 11.6 9 11 9H6L3 12V9H3C2.4 9 2 8.6 2 8V2Z" stroke="#93c5fd" strokeWidth="1" fill="none" />
            <line x1="5" y1="4" x2="9" y2="4" stroke="#93c5fd" strokeWidth="0.8" />
            <line x1="5" y1="6" x2="8" y2="6" stroke="#93c5fd" strokeWidth="0.8" />
          </g>
          {/* Pulsing glow */}
          <circle cx={cx} cy={cy} r="20" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="20;27;20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </motion.g>

        {/* Channel nodes */}
        {channels.map((ch, i) => {
          const pos = chPos(ch.angle, radius);
          return (
            <motion.g
              key={ch.label}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: "backOut" }}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              <circle cx={pos.x} cy={pos.y} r="15" fill={ch.bg} stroke={ch.color} strokeWidth="1" />
              <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={ch.color} fontSize="6" fontFamily="system-ui" fontWeight="600">{ch.label}</text>
            </motion.g>
          );
        })}
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  8. AIAssistantsIllustration                                        */
/* ------------------------------------------------------------------ */

const nnLayers = [
  { count: 3, x: 60, color: "#8b5cf6", bg: "#4c1d95" },
  { count: 4, x: 150, color: "#8b5cf6", bg: "#4c1d95" },
  { count: 2, x: 240, color: "#14b8a6", bg: "#115e59" },
];

function nnY(layerCount: number, index: number): number {
  const totalH = 130;
  const spacing = totalH / (layerCount + 1);
  return 25 + spacing * (index + 1);
}

export function AIAssistantsIllustration({ className = "" }: { className?: string }) {
  // Pre-compute all node positions
  const layers = nnLayers.map((l) => {
    const positions = [];
    for (let i = 0; i < l.count; i++) {
      positions.push({ x: l.x, y: nnY(l.count, i) });
    }
    return { ...l, positions };
  });

  // Compute connections between adjacent layers
  const connections: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const from = layers[li];
    const to = layers[li + 1];
    from.positions.forEach((fp, fi) => {
      to.positions.forEach((tp, ti) => {
        connections.push({
          x1: fp.x + 12,
          y1: fp.y,
          x2: tp.x - 12,
          y2: tp.y,
          key: `${li}-${fi}-${ti}`,
        });
      });
    });
  }

  return (
    <Frame label="ai.network" gridId="aiGrid" className={className}>
      <svg viewBox="0 0 320 180" className="w-full h-auto relative z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <GlowFilter id="aiGlowV" color="#8b5cf6" />
          <GlowFilter id="aiGlowT" color="#14b8a6" />
        </defs>

        {/* Connections with animated opacity */}
        {connections.map((c, i) => (
          <motion.line
            key={c.key}
            x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke="#8b5cf6"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            viewport={viewportConfig}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.02 }}
          >
            <animate
              attributeName="opacity"
              values="0.08;0.25;0.08"
              dur={`${2 + (i % 5) * 0.3}s`}
              repeatCount="indefinite"
              begin={`${(i % 7) * 0.2}s`}
            />
          </motion.line>
        ))}

        {/* Data flow dots on a few connections */}
        {connections.filter((_, i) => i % 4 === 0).map((c, i) => (
          <circle key={`dot${c.key}`} r="1.5" fill="#8b5cf6" opacity="0.6">
            <animateMotion
              dur={`${1.5 + i * 0.3}s`}
              repeatCount="indefinite"
              path={`M ${c.x1},${c.y1} L ${c.x2},${c.y2}`}
              begin={`${i * 0.4}s`}
            />
          </circle>
        ))}

        {/* Nodes */}
        {layers.map((layer, li) =>
          layer.positions.map((pos, ni) => (
            <motion.g
              key={`n-${li}-${ni}`}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.4, delay: 0.15 + li * 0.15 + ni * 0.05, ease: "backOut" }}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              <circle
                cx={pos.x} cy={pos.y} r="10"
                fill={layer.bg} stroke={layer.color} strokeWidth="1"
                filter={li === 0 && ni === 0 ? "url(#aiGlowV)" : li === 2 ? "url(#aiGlowT)" : undefined}
              />
              <circle cx={pos.x} cy={pos.y} r="3" fill={layer.color} opacity="0.5" />
            </motion.g>
          ))
        )}

        {/* Layer labels */}
        {["Input", "Hidden", "Output"].map((label, i) => (
          <motion.text
            key={label}
            x={layers[i].x} y="170"
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="7"
            fontFamily="system-ui"
            fontWeight="500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            {label}
          </motion.text>
        ))}

        {/* Chat bubble at output */}
        <motion.g
          initial={{ opacity: 0, x: -5 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <rect x="270" y="68" width="38" height="24" rx="6" fill="#115e59" stroke="#14b8a6" strokeWidth="1" />
          <polygon points="270,82 264,85 270,88" fill="#115e59" stroke="#14b8a6" strokeWidth="1" />
          <line x1="277" y1="76" x2="301" y2="76" stroke="#14b8a6" strokeWidth="1" opacity="0.5" />
          <line x1="277" y1="80" x2="295" y2="80" stroke="#14b8a6" strokeWidth="1" opacity="0.5" />
          <line x1="277" y1="84" x2="289" y2="84" stroke="#14b8a6" strokeWidth="1" opacity="0.5" />
        </motion.g>
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  Export mapping                                                     */
/* ------------------------------------------------------------------ */

export const solutionIllustrationMap: Record<string, React.FC<{ className?: string }>> = {
  workflow: ProcessAutomationIllustration,
  layout: InternalToolsIllustration,
  gitBranch: WorkflowOrchestrationIllustration,
  plug: SystemsIntegrationIllustration,
  target: MarketingSalesIllustration,
  package: ShippingOrderIllustration,
  messageSquare: MessagingIllustration,
  bot: AIAssistantsIllustration,
};
