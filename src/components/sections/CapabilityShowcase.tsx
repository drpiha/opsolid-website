"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type IconType = "workflow" | "plug" | "bot" | "ship" | "radio" | "shield";

interface CapabilityShowcaseProps {
  iconType: IconType | null;
  title: string;
  body: string;
  tag?: string;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: easeOut } },
};

export function CapabilityShowcase({
  iconType,
  title,
  body,
  tag,
}: CapabilityShowcaseProps) {
  return (
    <div className="os-cap-showcase" aria-live="polite">
      <AnimatePresence mode="wait">
        {iconType && (
          <motion.div
            key={iconType}
            className="os-cap-showcase-inner"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
          >
            <div className="os-cap-showcase-copy">
              {tag && <span className="os-cap-showcase-tag">{tag}</span>}
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            <div className="os-cap-showcase-stage">
              <Visualization iconType={iconType} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Visualization({ iconType }: { iconType: IconType }) {
  const reduced = useReducedMotion();
  if (reduced) return <ReducedFallback iconType={iconType} />;
  switch (iconType) {
    case "workflow":
      return <WorkflowAnim />;
    case "plug":
      return <IntegrationAnim />;
    case "bot":
      return <AIAnim />;
    case "ship":
      return <InternalToolsAnim />;
    case "radio":
      return <VoiceAnim />;
    case "shield":
      return <GdprAnim />;
  }
}

// ---------------------------------------------------------------------------
// 1. Workflow — sequential pipeline with a traveling data dot
// ---------------------------------------------------------------------------

function WorkflowAnim() {
  const stations = ["TRIGGER", "PARSE", "ROUTE", "WRITE", "NOTIFY"];
  return (
    <svg
      viewBox="0 0 480 220"
      className="os-cap-svg"
      role="img"
      aria-label="Workflow pipeline animation"
    >
      <defs>
        <linearGradient id="wf-track" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(194,121,64,0.12)" />
          <stop offset="0.5" stopColor="rgba(194,121,64,0.45)" />
          <stop offset="1" stopColor="rgba(194,121,64,0.12)" />
        </linearGradient>
        <radialGradient id="wf-glow">
          <stop offset="0" stopColor="rgba(221,162,102,1)" />
          <stop offset="1" stopColor="rgba(221,162,102,0)" />
        </radialGradient>
      </defs>

      <line
        x1="40"
        y1="110"
        x2="440"
        y2="110"
        stroke="url(#wf-track)"
        strokeWidth="2"
      />

      {stations.map((label, i) => {
        const x = 40 + i * 100;
        return (
          <g key={label} transform={`translate(${x}, 110)`}>
            <motion.circle
              r="14"
              fill="rgba(20,20,20,0.55)"
              stroke="rgba(221,162,102,0.5)"
              strokeWidth="1.2"
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: [0.4, 1, 0.4],
                stroke: [
                  "rgba(221,162,102,0.5)",
                  "rgba(221,162,102,1)",
                  "rgba(221,162,102,0.5)",
                ],
              }}
              transition={{
                duration: 2.6,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <text
              y="38"
              textAnchor="middle"
              fontFamily="var(--font-mono, monospace)"
              fontSize="9"
              letterSpacing="0.16em"
              fill="rgba(255,243,225,0.55)"
            >
              {label}
            </text>
          </g>
        );
      })}

      <motion.g
        initial={{ x: 40 }}
        animate={{ x: [40, 440] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      >
        <circle cy="110" r="22" fill="url(#wf-glow)" opacity="0.55" />
        <circle cy="110" r="6" fill="#F5D9B8" />
      </motion.g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 2. Systems integration — central hub with satellite systems
// ---------------------------------------------------------------------------

function IntegrationAnim() {
  const systems = [
    { label: "ERP", angle: -90 },
    { label: "CRM", angle: -30 },
    { label: "WMS", angle: 30 },
    { label: "BILLING", angle: 90 },
    { label: "MSG", angle: 150 },
    { label: "API", angle: -150 },
  ];
  const cx = 240;
  const cy = 110;
  const radius = 78;
  return (
    <svg
      viewBox="0 0 480 220"
      className="os-cap-svg"
      role="img"
      aria-label="Systems integration animation"
    >
      <defs>
        <radialGradient id="hub-grad">
          <stop offset="0" stopColor="rgba(221,162,102,0.95)" />
          <stop offset="1" stopColor="rgba(126,74,36,0)" />
        </radialGradient>
      </defs>

      {/* spokes */}
      {systems.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;
        return (
          <g key={s.label}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(221,162,102,0.18)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            {/* traveling packet */}
            <motion.circle
              r="3"
              fill="#DDA266"
              initial={{ cx: cx, cy: cy, opacity: 0 }}
              animate={{ cx: [cx, x, cx], cy: [cy, y, cy], opacity: [0, 1, 0] }}
              transition={{
                duration: 2.2,
                delay: i * 0.32,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="22"
              fill="rgba(20,20,20,0.7)"
              stroke="rgba(221,162,102,0.4)"
              strokeWidth="1"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2.2,
                delay: i * 0.32 + 0.95,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <text
              x={x}
              y={y + 3.5}
              textAnchor="middle"
              fontFamily="var(--font-mono, monospace)"
              fontSize="8.5"
              letterSpacing="0.1em"
              fill="rgba(255,243,225,0.85)"
            >
              {s.label}
            </text>
          </g>
        );
      })}

      {/* hub */}
      <circle cx={cx} cy={cy} r="40" fill="url(#hub-grad)" opacity="0.35" />
      <motion.circle
        cx={cx}
        cy={cy}
        r="22"
        fill="#1B1614"
        stroke="rgba(221,162,102,0.9)"
        strokeWidth="1.4"
        animate={{
          stroke: [
            "rgba(221,162,102,0.4)",
            "rgba(221,162,102,1)",
            "rgba(221,162,102,0.4)",
          ],
        }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <text
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="9"
        letterSpacing="0.12em"
        fill="#F5D9B8"
      >
        HUB
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 3. AI processes — selective routing through a classifier
// ---------------------------------------------------------------------------

function AIAnim() {
  const tokens = [
    { y: 30, type: "ai" },
    { y: 60, type: "pass" },
    { y: 90, type: "ai" },
    { y: 120, type: "pass" },
    { y: 150, type: "ai" },
    { y: 180, type: "pass" },
  ];
  return (
    <svg
      viewBox="0 0 480 220"
      className="os-cap-svg"
      role="img"
      aria-label="AI selective routing animation"
    >
      <defs>
        <linearGradient id="ai-rail" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(221,162,102,0.04)" />
          <stop offset="0.45" stopColor="rgba(221,162,102,0.45)" />
          <stop offset="0.55" stopColor="rgba(221,162,102,0.45)" />
          <stop offset="1" stopColor="rgba(221,162,102,0.04)" />
        </linearGradient>
      </defs>

      {/* classifier gate, vertical bar at center */}
      <rect
        x="225"
        y="20"
        width="30"
        height="180"
        rx="4"
        fill="rgba(20,20,20,0.7)"
        stroke="rgba(221,162,102,0.6)"
        strokeWidth="1"
      />
      <text
        x="240"
        y="14"
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="9"
        letterSpacing="0.18em"
        fill="rgba(255,243,225,0.7)"
      >
        CLASSIFY
      </text>

      {tokens.map((tok, i) => (
        <motion.g
          key={i}
          initial={{ x: -40, opacity: 0 }}
          animate={{
            x: [-40, 200, 280, 480],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.4,
            delay: i * 0.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <rect
            y={tok.y - 7}
            width="36"
            height="14"
            rx="3"
            fill={
              tok.type === "ai" ? "rgba(126,74,36,0.85)" : "rgba(40,40,40,0.7)"
            }
            stroke={
              tok.type === "ai"
                ? "rgba(245,217,184,0.9)"
                : "rgba(155,155,155,0.4)"
            }
            strokeWidth="1"
          />
          <text
            x="18"
            y={tok.y + 3.2}
            textAnchor="middle"
            fontFamily="var(--font-mono, monospace)"
            fontSize="7.5"
            letterSpacing="0.15em"
            fill={
              tok.type === "ai" ? "#F5D9B8" : "rgba(180,180,180,0.85)"
            }
          >
            {tok.type === "ai" ? "AI" : "PASS"}
          </text>
        </motion.g>
      ))}

      {/* output rails */}
      <line
        x1="255"
        y1="80"
        x2="460"
        y2="80"
        stroke="rgba(221,162,102,0.35)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <line
        x1="255"
        y1="140"
        x2="460"
        y2="140"
        stroke="rgba(221,162,102,0.18)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <text
        x="455"
        y="74"
        textAnchor="end"
        fontFamily="var(--font-mono, monospace)"
        fontSize="8"
        letterSpacing="0.18em"
        fill="rgba(245,217,184,0.85)"
      >
        WITH AI
      </text>
      <text
        x="455"
        y="156"
        textAnchor="end"
        fontFamily="var(--font-mono, monospace)"
        fontSize="8"
        letterSpacing="0.18em"
        fill="rgba(180,180,180,0.6)"
      >
        DETERMINISTIC
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 4. Internal tools — admin dashboard slide-in
// ---------------------------------------------------------------------------

function InternalToolsAnim() {
  const rows = [
    { label: "Order #4082", state: "OPEN", color: "rgba(212,162,58,0.85)" },
    { label: "Invoice #2210", state: "APPROVED", color: "rgba(127,178,134,0.85)" },
    { label: "Lead — Bauer GmbH", state: "OPEN", color: "rgba(212,162,58,0.85)" },
    { label: "Refund #88", state: "FLAGGED", color: "rgba(184,81,75,0.85)" },
  ];
  return (
    <div className="os-cap-dash" aria-label="Internal dashboard preview">
      <div className="os-cap-dash-bar">
        <span className="os-cap-dash-dot" />
        <span className="os-cap-dash-dot" />
        <span className="os-cap-dash-dot" />
        <span className="os-cap-dash-title">OPS · APPROVALS</span>
      </div>
      <div className="os-cap-dash-body">
        <motion.div
          className="os-cap-dash-tabs"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="os-cap-dash-tab active">Queue · 4</span>
          <span className="os-cap-dash-tab">History</span>
          <span className="os-cap-dash-tab">Audit</span>
        </motion.div>
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            className="os-cap-dash-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18 + i * 0.08 }}
          >
            <span className="os-cap-dash-label">{r.label}</span>
            <span
              className="os-cap-dash-pill"
              style={{ color: r.color, borderColor: r.color }}
            >
              {r.state}
            </span>
          </motion.div>
        ))}
        <motion.div
          className="os-cap-dash-cta"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            boxShadow: [
              "0 0 0 0 rgba(221,162,102,0)",
              "0 0 0 6px rgba(221,162,102,0.18)",
              "0 0 0 0 rgba(221,162,102,0)",
            ],
          }}
          transition={{
            opacity: { duration: 0.4, delay: 0.65 },
            boxShadow: { duration: 1.8, delay: 0.7, repeat: Infinity },
          }}
        >
          Approve next
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Voice & chat — waveform + transcript type-in
// ---------------------------------------------------------------------------

function VoiceAnim() {
  const bars = Array.from({ length: 28 });
  return (
    <div className="os-cap-voice" aria-label="Voice agent waveform animation">
      <div className="os-cap-voice-wave">
        {bars.map((_, i) => (
          <motion.span
            key={i}
            className="os-cap-voice-bar"
            animate={{
              scaleY: [
                0.18,
                0.28 + 0.6 * Math.abs(Math.sin(i * 0.55)),
                0.18,
              ],
            }}
            transition={{
              duration: 1.4,
              delay: (i % 14) * 0.06,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <Transcript />
      <div className="os-cap-voice-meta">
        <span>● LIVE</span>
        <span>DE → INTENT: BOOKING</span>
        <span>P50 · 540ms</span>
      </div>
    </div>
  );
}

function Transcript() {
  const lines = [
    "Hallo, ich möchte einen Tisch für vier reservieren.",
    "Donnerstag um halb acht — geht das?",
    "Eine Person ist Vegetarier.",
  ];
  return (
    <div className="os-cap-voice-transcript">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 1.1 }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. GDPR shield — concentric pulse rings + residency badge
// ---------------------------------------------------------------------------

function GdprAnim() {
  return (
    <svg
      viewBox="0 0 480 220"
      className="os-cap-svg"
      role="img"
      aria-label="GDPR-native infrastructure animation"
    >
      <defs>
        <linearGradient id="shield-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3A2615" />
          <stop offset="1" stopColor="#1B1108" />
        </linearGradient>
      </defs>

      {/* concentric pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="240"
          cy="100"
          r="48"
          fill="none"
          stroke="rgba(221,162,102,0.55)"
          strokeWidth="1"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: [0.9, 2.2], opacity: [0.55, 0] }}
          transition={{
            duration: 3,
            delay: i * 1,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{ transformOrigin: "240px 100px" }}
        />
      ))}

      {/* shield body */}
      <motion.path
        d="M240 50 L286 68 L286 112 C286 138 264 152 240 158 C216 152 194 138 194 112 L194 68 Z"
        fill="url(#shield-fill)"
        stroke="rgba(221,162,102,0.9)"
        strokeWidth="1.4"
        initial={{ scale: 0.96 }}
        animate={{ scale: [0.96, 1.02, 0.96] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "240px 100px" }}
      />
      {/* check */}
      <motion.path
        d="M225 102 L237 114 L257 92"
        fill="none"
        stroke="#F5D9B8"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
      />

      {/* residency badge */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        <rect
          x="120"
          y="180"
          width="240"
          height="26"
          rx="13"
          fill="rgba(20,20,20,0.7)"
          stroke="rgba(221,162,102,0.55)"
          strokeWidth="1"
        />
        <text
          x="240"
          y="197"
          textAnchor="middle"
          fontFamily="var(--font-mono, monospace)"
          fontSize="9.5"
          letterSpacing="0.22em"
          fill="rgba(245,217,184,0.95)"
        >
          FRA · EU-WEST · ISO 27001
        </text>
      </motion.g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Reduced-motion fallback — calm, static visual
// ---------------------------------------------------------------------------

function ReducedFallback({ iconType }: { iconType: IconType }) {
  const labels: Record<IconType, string> = {
    workflow: "TRIGGER → PARSE → ROUTE → WRITE → NOTIFY",
    plug: "ERP · CRM · WMS · BILLING · MSG · API",
    bot: "WITH AI · DETERMINISTIC",
    ship: "QUEUE · HISTORY · AUDIT · APPROVALS",
    radio: "DE · EN · TR · INTENT · HANDOFF",
    shield: "FRA · EU-WEST · ISO 27001",
  };
  return (
    <div className="os-cap-fallback">
      <span className="os-cap-fallback-label">{labels[iconType]}</span>
    </div>
  );
}
