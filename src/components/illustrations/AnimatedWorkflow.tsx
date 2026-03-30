"use client";

import { motion } from "framer-motion";

interface AnimatedWorkflowProps {
  className?: string;
}

const nodes = [
  { id: "webhook", label: "Webhook", x: 60, y: 55, color: "#3b82f6", bgColor: "#1e3a8a", icon: "trigger" },
  { id: "process", label: "Process Data", x: 220, y: 55, color: "#10b981", bgColor: "#064e3b", icon: "gear" },
  { id: "ai", label: "AI Analysis", x: 380, y: 55, color: "#8b5cf6", bgColor: "#4c1d95", icon: "brain" },
  { id: "email", label: "Send Email", x: 540, y: 25, color: "#14b8a6", bgColor: "#115e59", icon: "mail" },
  { id: "crm", label: "Update CRM", x: 540, y: 85, color: "#10b981", bgColor: "#064e3b", icon: "database" },
  { id: "slack", label: "Slack Notify", x: 380, y: 145, color: "#f59e0b", bgColor: "#78350f", icon: "chat" },
];

const connections = [
  { from: "webhook", to: "process", path: "M 120,70 L 205,70" },
  { from: "process", to: "ai", path: "M 280,70 L 365,70" },
  { from: "ai", to: "email", path: "M 440,70 Q 480,70 490,50 L 525,40" },
  { from: "ai", to: "crm", path: "M 440,70 Q 480,70 490,90 L 525,100" },
  { from: "ai", to: "slack", path: "M 420,85 Q 420,120 410,145 L 400,155" },
];

function NodeIcon({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "trigger":
      return (
        <path
          d="M8 3L12 8L8 13"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "gear":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round">
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 2.5V4M8 12V13.5M2.5 8H4M12 8H13.5M4.1 4.1L5.2 5.2M10.8 10.8L11.9 11.9M4.1 11.9L5.2 10.8M10.8 5.2L11.9 4.1" />
        </g>
      );
    case "brain":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round">
          <path d="M8 13V8M8 8C6 8 4.5 6.5 4.5 5S6 2 8 2S11.5 3.5 11.5 5S10 8 8 8Z" />
          <path d="M5.5 6C4.5 7 3.5 7.5 3 8.5" />
          <path d="M10.5 6C11.5 7 12.5 7.5 13 8.5" />
        </g>
      );
    case "mail":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4.5" width="10" height="7" rx="1" />
          <path d="M3 5.5L8 9L13 5.5" />
        </g>
      );
    case "database":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round">
          <ellipse cx="8" cy="4.5" rx="4.5" ry="1.8" />
          <path d="M3.5 4.5V11.5C3.5 12.5 5.5 13.3 8 13.3S12.5 12.5 12.5 11.5V4.5" />
          <path d="M3.5 8C3.5 9 5.5 9.8 8 9.8S12.5 9 12.5 8" />
        </g>
      );
    case "chat":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4C3 3.4 3.4 3 4 3H12C12.6 3 13 3.4 13 4V9C13 9.6 12.6 10 12 10H7L4 13V10H4C3.4 10 3 9.6 3 9V4Z" />
          <path d="M6 6.5H10M6 8H8.5" />
        </g>
      );
    default:
      return null;
  }
}

export function AnimatedWorkflow({ className = "" }: AnimatedWorkflowProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Editor frame */}
        <div className="rounded-2xl bg-[#0d1117] border border-white/[0.06] shadow-2xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#d29922]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/80" />
            </div>
            <span className="ml-2 text-[10px] text-slate-500 font-medium tracking-wide">
              workflow.solidra
            </span>
          </div>

          {/* Canvas */}
          <div className="relative p-3 md:p-4">
            {/* Subtle grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="workflowGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#workflowGrid)" />
            </svg>

            <svg
              viewBox="0 0 610 185"
              className="w-full h-auto relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glow filters for each color */}
                <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#3b82f6" floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#10b981" floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowPurple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#8b5cf6" floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowTeal" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#14b8a6" floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowAmber" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#f59e0b" floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connection lines with animated dashes */}
              {connections.map((conn, i) => (
                <g key={conn.from + conn.to}>
                  {/* Background line */}
                  <motion.path
                    d={conn.path}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: "easeInOut" }}
                  />
                  {/* Animated dashed line */}
                  <motion.path
                    d={conn.path}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: "easeInOut" }}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-20"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </motion.path>
                  {/* Flowing dot */}
                  <motion.circle
                    r="2.5"
                    fill="white"
                    opacity="0.7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                  >
                    <animateMotion
                      dur={`${2 + i * 0.3}s`}
                      repeatCount="indefinite"
                      path={conn.path}
                    />
                  </motion.circle>
                </g>
              ))}

              {/* Nodes */}
              {nodes.map((node, i) => {
                const glowFilter =
                  node.icon === "trigger" ? "url(#glowBlue)" :
                  node.icon === "brain" ? "url(#glowPurple)" :
                  node.icon === "mail" ? "url(#glowTeal)" :
                  node.icon === "chat" ? "url(#glowAmber)" :
                  "url(#glowGreen)";

                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.12,
                      ease: "backOut",
                    }}
                    style={{ transformOrigin: `${node.x + 30}px ${node.y + 15}px` }}
                  >
                    {/* Node background with rounded corners */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width="60"
                      height="30"
                      rx="8"
                      fill={node.bgColor}
                      stroke={node.color}
                      strokeWidth="1"
                      opacity="0.9"
                      filter={glowFilter}
                    />
                    {/* Icon area */}
                    <g transform={`translate(${node.x + 4}, ${node.y + 7})`}>
                      <NodeIcon type={node.icon} color={node.color} />
                    </g>
                    {/* Label */}
                    <text
                      x={node.x + 30}
                      y={node.y + 42}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="7"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="500"
                    >
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}

              {/* Active indicator dot on webhook (pulsing) */}
              <motion.circle
                cx={nodes[0].x + 4}
                cy={nodes[0].y + 4}
                r="3"
                fill="#3fb950"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
