"use client";

import { useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import {
  N8nLogo,
  MakeLogo,
  ZapierLogo,
  CustomApiLogo,
} from "@/components/icons/ToolLogos";

/* ------------------------------------------------------------------ */
/*  Tool config                                                        */
/* ------------------------------------------------------------------ */

const toolConfig = [
  {
    key: "n8n",
    icon: N8nLogo,
    color: "#FF6D00",
    gradient: "from-orange-500 to-red-500",
    accentBg: "bg-orange-50",
    accentText: "text-orange-600",
  },
  {
    key: "Make",
    icon: MakeLogo,
    color: "#7B2FBE",
    gradient: "from-purple-500 to-violet-500",
    accentBg: "bg-purple-50",
    accentText: "text-purple-600",
  },
  {
    key: "Zapier",
    icon: ZapierLogo,
    color: "#FF8C00",
    gradient: "from-orange-400 to-amber-500",
    accentBg: "bg-orange-50",
    accentText: "text-orange-500",
  },
  {
    key: "AI Agents",
    icon: CustomApiLogo,
    color: "#0D9488",
    gradient: "from-teal-500 to-cyan-500",
    accentBg: "bg-teal-50",
    accentText: "text-teal-600",
  },
];

/* ------------------------------------------------------------------ */
/*  Subtle hover sound (Web Audio API)                                 */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;

function playHoverPop() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      1320,
      audioCtx.currentTime + 0.06
    );
    gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch {
    /* silent fallback */
  }
}

/* ------------------------------------------------------------------ */
/*  Workflow SVG visualizations                                        */
/* ------------------------------------------------------------------ */

function N8nWorkflow() {
  const nodes = [
    { x: 15, y: 45, label: "Webhook", w: 62 },
    { x: 100, y: 45, label: "HTTP", w: 48 },
    { x: 170, y: 22, label: "Slack", w: 48 },
    { x: 170, y: 68, label: "DB", w: 48 },
  ];

  const paths = [
    "M 77 45 L 100 45",
    "M 148 45 C 160 45, 160 22, 170 22",
    "M 148 45 C 160 45, 160 68, 170 68",
  ];

  return (
    <svg viewBox="0 0 235 90" className="w-full h-full" fill="none">
      {paths.map((d, i) => (
        <g key={i}>
          <motion.path
            d={d}
            stroke="#FF6D00"
            strokeWidth={2}
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
          />
          <motion.path
            d={d}
            stroke="#FF6D00"
            strokeWidth={2}
            strokeDasharray="5 5"
            className="animate-flow-dash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        </g>
      ))}

      {nodes.map((node, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
          style={{
            transformOrigin: `${node.x + node.w / 2}px ${node.y}px`,
          }}
        >
          <rect
            x={node.x}
            y={node.y - 14}
            width={node.w}
            height={28}
            rx={6}
            fill="#FF6D0012"
            stroke="#FF6D00"
            strokeWidth={1.5}
          />
          <text
            x={node.x + node.w / 2}
            y={node.y + 4}
            textAnchor="middle"
            fill="#FF6D00"
            fontSize={10}
            fontWeight={500}
            fontFamily="system-ui"
          >
            {node.label}
          </text>
        </motion.g>
      ))}

      <motion.circle
        r={3}
        fill="#FFD54F"
        filter="url(#n8n-glow)"
        animate={{
          cx: [46, 124, 194],
          cy: [45, 45, 22],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.5,
        }}
      />
      <motion.circle
        r={3}
        fill="#FFD54F"
        filter="url(#n8n-glow)"
        animate={{
          cx: [46, 124, 194],
          cy: [45, 45, 68],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.8,
          delay: 0.6,
        }}
      />
      <defs>
        <filter id="n8n-glow">
          <feGaussianBlur stdDeviation="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function MakeWorkflow() {
  const modules = [
    { cx: 30, label: "API" },
    { cx: 75, label: "Filter" },
    { cx: 120, label: "Router" },
    { cx: 165, label: "Map" },
    { cx: 210, label: "CRM" },
  ];

  return (
    <svg viewBox="0 0 240 80" className="w-full h-full" fill="none">
      {modules.slice(0, -1).map((mod, i) => (
        <motion.line
          key={`line-${i}`}
          x1={mod.cx + 15}
          y1={40}
          x2={modules[i + 1].cx - 15}
          y2={40}
          stroke="#7B2FBE"
          strokeWidth={2}
          strokeOpacity={0.35}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}

      {modules.map((mod, i) => (
        <motion.g
          key={mod.label}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 500,
            damping: 18,
          }}
          style={{ transformOrigin: `${mod.cx}px 40px` }}
        >
          <circle
            cx={mod.cx}
            cy={40}
            r={15}
            fill="#7B2FBE0D"
            stroke="#7B2FBE"
            strokeWidth={1.5}
          />
          <text
            x={mod.cx}
            y={44}
            textAnchor="middle"
            fill="#7B2FBE"
            fontSize={8}
            fontWeight={600}
            fontFamily="system-ui"
          >
            {mod.label}
          </text>
        </motion.g>
      ))}

      <motion.circle
        r={4}
        fill="#A855F7"
        cy={40}
        filter="url(#make-glow)"
        animate={{
          cx: [30, 75, 120, 165, 210],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.4,
        }}
      />
      <defs>
        <filter id="make-glow">
          <feGaussianBlur stdDeviation="3" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function ZapierWorkflow() {
  const steps = [
    { x: 10, label: "Trigger", w: 55 },
    { x: 80, label: "Filter", w: 48 },
    { x: 143, label: "Action", w: 52 },
    { x: 210, label: "Notify", w: 50 },
  ];

  return (
    <svg viewBox="0 0 270 80" className="w-full h-full" fill="none">
      {steps.slice(0, -1).map((step, i) => {
        const x1 = step.x + step.w + 2;
        const x2 = steps[i + 1].x - 2;
        return (
          <g key={`conn-${i}`}>
            <motion.line
              x1={x1}
              y1={40}
              x2={x2}
              y2={40}
              stroke="#FF8C00"
              strokeWidth={2}
              strokeOpacity={0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.3 }}
            />
            <motion.polygon
              points={`${x2},40 ${x2 - 6},36 ${x2 - 6},44`}
              fill="#FF8C00"
              fillOpacity={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.15 }}
            />
          </g>
        );
      })}

      {steps.map((step, i) => (
        <motion.g
          key={step.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.12,
            type: "spring",
            stiffness: 300,
          }}
        >
          <rect
            x={step.x}
            y={25}
            width={step.w}
            height={30}
            rx={8}
            fill="#FF8C000D"
            stroke="#FF8C00"
            strokeWidth={1.5}
          />
          <text
            x={step.x + step.w / 2}
            y={44}
            textAnchor="middle"
            fill="#FF8C00"
            fontSize={9}
            fontWeight={500}
            fontFamily="system-ui"
          >
            {step.label}
          </text>
        </motion.g>
      ))}

      <motion.path
        d="M 132 10 L 127 18 H 132 L 128 26"
        stroke="#FFD54F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      />
    </svg>
  );
}

function AIAgentWorkflow() {
  const layerX = [25, 80, 135, 190];
  const layers = [
    [15, 40, 65],
    [8, 28, 48, 68],
    [18, 42, 66],
    [28, 52],
  ];

  return (
    <svg viewBox="0 0 220 80" className="w-full h-full" fill="none">
      {layers.slice(0, -1).flatMap((layer, li) =>
        layer.flatMap((y, ni) =>
          layers[li + 1].map((nextY, nxi) => (
            <motion.line
              key={`c-${li}-${ni}-${nxi}`}
              x1={layerX[li]}
              y1={y}
              x2={layerX[li + 1]}
              y2={nextY}
              stroke="#0D9488"
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.45, 0.08] }}
              transition={{
                duration: 1.5 + Math.random() * 0.8,
                repeat: Infinity,
                delay: li * 0.2 + ni * 0.1,
              }}
            />
          ))
        )
      )}

      {layers.flatMap((layer, li) =>
        layer.map((y, ni) => (
          <motion.g key={`n-${li}-${ni}`}>
            <motion.circle
              cx={layerX[li]}
              cy={y}
              r={8}
              fill="none"
              stroke="#0D948835"
              strokeWidth={1}
              animate={{ r: [5, 11, 5], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (li + ni) * 0.15,
              }}
            />
            <motion.circle
              cx={layerX[li]}
              cy={y}
              r={4.5}
              fill="#0D9488"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: (li * 3 + ni) * 0.05,
                type: "spring",
                stiffness: 400,
              }}
            />
          </motion.g>
        ))
      )}

      <motion.text
        x={210}
        y={42}
        fill="#5EEAD4"
        fontSize={7}
        fontFamily="system-ui"
        fontWeight={500}
        animate={{ opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        AI
      </motion.text>
    </svg>
  );
}

const workflowComponents = [
  N8nWorkflow,
  MakeWorkflow,
  ZapierWorkflow,
  AIAgentWorkflow,
];

/* ------------------------------------------------------------------ */
/*  Tool Card                                                          */
/* ------------------------------------------------------------------ */

interface ToolData {
  name: string;
  description: string;
  techFeatures: string[];
}

function ToolCard({
  tool,
  config,
  index,
}: {
  tool: ToolData;
  config: (typeof toolConfig)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const Icon = config.icon;
  const Workflow = workflowComponents[index];
  const glowBg = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, ${config.color}14, transparent 60%)`;

  return (
    <StaggerItem>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
          playHoverPop();
        }}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-2xl p-6 md:p-7 glass-light cursor-default overflow-hidden"
        style={{ minHeight: "380px" }}
      >
        {/* Cursor-following glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
          style={{
            background: glowBg,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Accent bar at top with glow on hover */}
        <div
          className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${config.gradient} rounded-full`}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
              filter: "blur(4px)",
            }}
            animate={{ opacity: isHovered ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Icon with scale on hover */}
        <motion.div
          className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl ${config.accentBg} ${config.accentText} mb-4`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon size={22} />
        </motion.div>

        {/* Title */}
        <h3 className="relative z-10 text-base font-semibold text-slate-900 mb-2">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="relative z-10 text-sm text-slate-500 leading-relaxed mb-4">
          {tool.description}
        </p>

        {/* Animated workflow visualization area */}
        <div className="relative h-[90px] mb-2">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="workflow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Workflow />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: `${config.color}35` }}
                      animate={{ opacity: [0.3, 0.9, 0.3] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tech feature badges */}
        <div className="relative z-10 flex flex-wrap gap-1.5 min-h-[28px]">
          <AnimatePresence>
            {isHovered &&
              tool.techFeatures.map((feature, i) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    delay: 0.08 + i * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-medium tracking-wide"
                  style={{
                    backgroundColor: `${config.color}0D`,
                    color: config.color,
                    border: `1px solid ${config.color}20`,
                  }}
                >
                  {feature}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>

        {/* Bottom glow line on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          }}
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 0.5 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover shadow glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          animate={{
            boxShadow: isHovered
              ? `0 8px 32px -8px ${config.color}30, 0 0 0 1px ${config.color}15`
              : "0 0 0 0 transparent, 0 0 0 0 transparent",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </StaggerItem>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export function ToolsShowcase() {
  const { t } = useLocale();
  const s = t.home.toolsShowcase;

  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeading
          label={s.label}
          headline={s.headline}
          description={s.description}
          gradient
        />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {(s.tools as ToolData[]).map((tool, i) => (
            <ToolCard key={i} tool={tool} config={toolConfig[i]} index={i} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
