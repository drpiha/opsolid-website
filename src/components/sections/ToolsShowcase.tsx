"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import {
  N8nLogo,
  MakeLogo,
  ZapierLogo,
  CustomApiLogo,
} from "@/components/icons/ToolLogos";

/* ------------------------------------------------------------------ */
/*  Tool config — editorial variant (no gradients, no per-brand hues)  */
/* ------------------------------------------------------------------ */

const toolConfig = [
  { key: "n8n", icon: N8nLogo },
  { key: "Make", icon: MakeLogo },
  { key: "Zapier", icon: ZapierLogo },
  { key: "AI Agents", icon: CustomApiLogo },
] as const;

/* ------------------------------------------------------------------ */
/*  Small static schematics (ink strokes only, pure SVG + CSS)         */
/*  Animation is provided by the CSS `.animate-flow-dash` class        */
/*  on the dashed overlay line.                                        */
/* ------------------------------------------------------------------ */

function N8nSchematic() {
  const nodes = [
    { x: 8, y: 45, w: 62, label: "Webhook" },
    { x: 90, y: 45, w: 48, label: "HTTP" },
    { x: 158, y: 22, w: 48, label: "Slack" },
    { x: 158, y: 68, w: 48, label: "DB" },
  ];
  const paths = [
    "M 70 45 L 90 45",
    "M 138 45 C 150 45, 150 22, 158 22",
    "M 138 45 C 150 45, 150 68, 158 68",
  ];
  return (
    <svg viewBox="0 0 220 90" fill="none" className="w-full h-full">
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.25} />
          <path
            d={d}
            stroke="currentColor"
            strokeWidth={1.25}
            strokeDasharray="4 4"
            className="animate-flow-dash"
            strokeOpacity={0.5}
          />
        </g>
      ))}
      {nodes.map((node, i) => (
        <g key={i}>
          <rect
            x={node.x}
            y={node.y - 12}
            width={node.w}
            height={24}
            rx={4}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1}
          />
          <text
            x={node.x + node.w / 2}
            y={node.y + 3}
            textAnchor="middle"
            fill="currentColor"
            fontSize={9}
            fontFamily="var(--font-geist-mono), ui-monospace"
            fontWeight={500}
            opacity={0.75}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MakeSchematic() {
  const modules = [
    { cx: 22, label: "API" },
    { cx: 70, label: "Filter" },
    { cx: 118, label: "Router" },
    { cx: 166, label: "Map" },
    { cx: 210, label: "CRM" },
  ];
  return (
    <svg viewBox="0 0 232 80" fill="none" className="w-full h-full">
      {modules.slice(0, -1).map((mod, i) => (
        <line
          key={`line-${i}`}
          x1={mod.cx + 13}
          y1={40}
          x2={modules[i + 1].cx - 13}
          y2={40}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="3 3"
          className="animate-flow-dash"
        />
      ))}
      {modules.map((mod) => (
        <g key={mod.label}>
          <circle
            cx={mod.cx}
            cy={40}
            r={13}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1}
          />
          <text
            x={mod.cx}
            y={43}
            textAnchor="middle"
            fill="currentColor"
            fontSize={7}
            fontFamily="var(--font-geist-mono), ui-monospace"
            fontWeight={500}
            opacity={0.75}
          >
            {mod.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ZapierSchematic() {
  const steps = [
    { x: 6, label: "Trigger", w: 52 },
    { x: 74, label: "Filter", w: 48 },
    { x: 138, label: "Action", w: 52 },
    { x: 206, label: "Notify", w: 52 },
  ];
  return (
    <svg viewBox="0 0 270 80" fill="none" className="w-full h-full">
      {steps.slice(0, -1).map((step, i) => {
        const x1 = step.x + step.w + 2;
        const x2 = steps[i + 1].x - 2;
        return (
          <g key={`conn-${i}`}>
            <line
              x1={x1}
              y1={40}
              x2={x2}
              y2={40}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth={1}
              strokeDasharray="3 3"
              className="animate-flow-dash"
            />
            <polygon
              points={`${x2},40 ${x2 - 5},37 ${x2 - 5},43`}
              fill="currentColor"
              opacity={0.5}
            />
          </g>
        );
      })}
      {steps.map((step) => (
        <g key={step.label}>
          <rect
            x={step.x}
            y={26}
            width={step.w}
            height={28}
            rx={4}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1}
          />
          <text
            x={step.x + step.w / 2}
            y={44}
            textAnchor="middle"
            fill="currentColor"
            fontSize={8}
            fontFamily="var(--font-geist-mono), ui-monospace"
            fontWeight={500}
            opacity={0.75}
          >
            {step.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function AIAgentSchematic() {
  const layerX = [25, 80, 135, 190];
  const layers = [
    [15, 40, 65],
    [8, 28, 48, 68],
    [18, 42, 66],
    [28, 52],
  ];
  return (
    <svg viewBox="0 0 210 80" fill="none" className="w-full h-full">
      {/* Connection lines */}
      {layers.slice(0, -1).flatMap((layer, li) =>
        layer.flatMap((y, ni) =>
          layers[li + 1].map((nextY, nxi) => (
            <line
              key={`c-${li}-${ni}-${nxi}`}
              x1={layerX[li]}
              y1={y}
              x2={layerX[li + 1]}
              y2={nextY}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={0.8}
            />
          ))
        )
      )}
      {/* Nodes */}
      {layers.flatMap((layer, li) =>
        layer.map((y, ni) => (
          <circle
            key={`n-${li}-${ni}`}
            cx={layerX[li]}
            cy={y}
            r={3.5}
            fill="currentColor"
            opacity={0.6}
          />
        ))
      )}
    </svg>
  );
}

const schematicFor = [N8nSchematic, MakeSchematic, ZapierSchematic, AIAgentSchematic];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

interface ToolData {
  name: string;
  description: string;
  techFeatures: string[];
}

export function ToolsShowcase() {
  const { t } = useLocale();
  const s = t.home.toolsShowcase;
  const tools = s.tools as ToolData[];

  return (
    <section className="section hairline-t bg-paper">
      <div className="container-wide">
        {/* Editorial two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <AnimatedSection className="lg:col-span-7">
            <div className="mono-label mb-4">{s.label}</div>
            <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              {s.headline}
            </h2>
          </AnimatedSection>
          <AnimatedSection
            delay={0.1}
            className="lg:col-span-5 lg:pt-2 flex items-start"
          >
            <p className="text-ink/70 text-body leading-relaxed text-pretty">
              {s.description}
            </p>
          </AnimatedSection>
        </div>

        {/* Tools grid — hairline bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/10">
          {tools.map((tool, i) => {
            const Icon = toolConfig[i]?.icon;
            const Schematic = schematicFor[i] || schematicFor[0];
            return (
              <AnimatedSection
                key={i}
                delay={0.05 + i * 0.06}
                className="group border-r border-b border-ink/10 p-6 md:p-7 bg-paper-warm hover:bg-paper transition-colors duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-paper text-ink">
                    {Icon ? <Icon size={20} /> : null}
                  </div>
                  <span className="mono-label text-ink/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-serif text-ink text-[1.375rem] leading-[1.2] tracking-[-0.015em]">
                  {tool.name}
                </h3>
                <p className="mt-2.5 text-ink/70 text-sm leading-relaxed text-pretty">
                  {tool.description}
                </p>

                {/* Schematic */}
                <div className="mt-5 aspect-[4/1] min-h-[48px] text-ink/80 group-hover:text-amber-700 transition-colors duration-300">
                  <Schematic />
                </div>

                {/* Tech feature chips */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {tool.techFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center rounded-full border border-ink/15 bg-paper px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.1em] uppercase text-ink/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
