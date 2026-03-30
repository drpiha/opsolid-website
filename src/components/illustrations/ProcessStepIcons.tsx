"use client";

import { motion } from "framer-motion";

const entrance = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" } as const,
  transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

const svgClass = "w-full h-auto max-w-[120px] mx-auto";

/* ------------------------------------------------------------------ */
/*  1. Discover – Magnifying glass scanning over node dots            */
/* ------------------------------------------------------------------ */
function DiscoverStepIcon({ className }: { className?: string }) {
  const dots = [[30, 52], [48, 44], [62, 56], [78, 42], [55, 64], [40, 62]];
  return (
    <motion.div className={className} {...entrance}>
      <svg viewBox="0 0 120 80" fill="none" className={svgClass}>
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="#cbd5e1">
            <animate attributeName="fill" values="#cbd5e1;#60a5fa;#cbd5e1" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="3;3.8;3" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0;8,0;-8,0;0,0" dur="4s" repeatCount="indefinite" />
          <circle cx="55" cy="32" r="14" fill="#eff6ff" opacity="0.6" />
          <circle cx="55" cy="32" r="14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
          <line x1="65" y1="42" x2="74" y2="51" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Design – Blueprint wireframe lines drawing themselves          */
/* ------------------------------------------------------------------ */
function DesignStepIcon({ className }: { className?: string }) {
  const lp = { stroke: "#8b5cf6", strokeWidth: 1.5, strokeLinecap: "round" as const, fill: "none" };
  const lines = ["M 20,20 L 100,20", "M 20,40 L 100,40", "M 20,60 L 100,60", "M 40,15 L 40,65", "M 75,15 L 75,65"];

  return (
    <motion.div className={className} {...entrance}>
      <svg viewBox="0 0 120 80" fill="none" className={svgClass}>
        {lines.map((d, i) => (
          <motion.path key={i} d={d} {...lp}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              pathLength: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
              opacity: { duration: 0.2, delay: i * 0.15 },
            }}
          />
        ))}
        <motion.rect x="46" y="25" width="22" height="10" rx="2" stroke="#c4b5fd" strokeWidth="1.5" fill="none"
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.8 }}
        />
        <motion.circle cx="30" cy="50" r="6" stroke="#c4b5fd" strokeWidth="1.5" fill="none"
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.95 }}
        />
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Build – Code blocks assembling + rotating gear                 */
/* ------------------------------------------------------------------ */
function BuildStepIcon({ className }: { className?: string }) {
  const blocks = [
    { ix: -2, iy: 22, fx: 18, fy: 22 },
    { ix: 50, iy: -6, fx: 18, fy: 40 },
    { ix: -14, iy: 76, fx: 18, fy: 58 },
  ];
  const conns = ["M 35,36 L 35,40", "M 35,54 L 35,58"];
  const teeth = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <motion.div className={className} {...entrance}>
      <svg viewBox="0 0 120 80" fill="none" className={svgClass}>
        {blocks.map((b, i) => (
          <motion.rect key={i} width="34" height="14" rx="4" stroke="#14b8a6" strokeWidth="1.5" fill="none"
            initial={{ x: b.ix, y: b.iy, opacity: 0 }}
            whileInView={{ x: b.fx, y: b.fy, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
        ))}
        {conns.map((d, i) => (
          <motion.path key={`c-${i}`} d={d} stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.7 + i * 0.15 }}
          />
        ))}
        <g transform="translate(85, 40)">
          <animateTransform attributeName="transform" type="rotate" from="0 85 40" to="360 85 40" dur="6s" repeatCount="indefinite" />
          <circle cx="0" cy="0" r="10" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
          <circle cx="0" cy="0" r="4" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
          {teeth.map((a) => {
            const r = (a * Math.PI) / 180;
            return <line key={a} x1={Math.cos(r) * 9} y1={Math.sin(r) * 9} x2={Math.cos(r) * 13} y2={Math.sin(r) * 13} stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" />;
          })}
        </g>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Improve – Upward trend graph with animated line                */
/* ------------------------------------------------------------------ */
function ImproveStepIcon({ className }: { className?: string }) {
  const chart = "M 24,60 L 40,52 L 56,46 L 72,34 L 88,18";
  const area = "M 24,60 L 40,52 L 56,46 L 72,34 L 88,18 L 88,66 L 24,66 Z";
  const pts = [[24, 60], [40, 52], [56, 46], [72, 34], [88, 18]];

  return (
    <motion.div className={className} {...entrance}>
      <svg viewBox="0 0 120 80" fill="none" className={svgClass}>
        <defs>
          <linearGradient id="improve-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="improve-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <motion.path d="M 20,14 L 20,66 L 96,66" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Area fill */}
        <motion.path d={area} fill="url(#improve-area)"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Chart line */}
        <motion.path d={chart} stroke="url(#improve-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />

        {/* Data points */}
        {pts.map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r="2.5" fill="white" stroke="url(#improve-line)" strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.5 + i * 0.12 }}
          />
        ))}

        {/* Upward arrow */}
        <motion.path d="M 84,14 L 88,8 L 92,14" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ opacity: 0, y: 4 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.1 }}
        />
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                           */
/* ------------------------------------------------------------------ */
export const processStepIcons: React.FC<{ className?: string }>[] = [
  DiscoverStepIcon,
  DesignStepIcon,
  BuildStepIcon,
  ImproveStepIcon,
];

export { DiscoverStepIcon, DesignStepIcon, BuildStepIcon, ImproveStepIcon };
