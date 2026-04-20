"use client";

import React from "react";

/**
 * Editorial warm-graphite use-case icons.
 * 12 icons cycling through 3 accent tones (ink / amber / olive). Shapes
 * preserved verbatim from the legacy set; only the circle background
 * gradient and the inner "white" strokes were recolored.
 *
 * Inner strokes use `#FAF6EF` (paper-warm) so the line work reads clearly
 * against the darker accent circle regardless of which accent is used.
 */

const INK = "#15120F";
const AMBER = "#C07E30"; // amber-600 for enough contrast against paper line
const OLIVE = "#8E9A63"; // olive-600

const LINE = "#FAF6EF"; // paper-warm — foreground line colour on the circle
const LINE_DIM = "rgba(250,246,239,0.72)";

/** Pick a solid accent color per icon position. 3-tone cycle. */
function accentFor(index: number): string {
  const cycle = index % 3;
  if (cycle === 0) return INK;
  if (cycle === 1) return AMBER;
  return OLIVE;
}

/* ------------------------------------------------------------------ */
/*  1 - Order Processing                                              */
/* ------------------------------------------------------------------ */
function OrderProcessingIcon({ className }: { className?: string }) {
  const fill = accentFor(0);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Cart body */}
        <path d="M14 16h2l2.5 10h9l2.5-7H18" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="29" r="1.2" fill={LINE} />
        <circle cx="27" cy="29" r="1.2" fill={LINE} />
        {/* Circular arrows */}
        <path d="M29 14a7 7 0 0 1 1 3.5" stroke={LINE} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M31 14l-2 0 0 2" stroke={LINE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2 - Invoice Processing                                            */
/* ------------------------------------------------------------------ */
function InvoiceProcessingIcon({ className }: { className?: string }) {
  const fill = accentFor(1);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Document */}
        <rect x="14" y="10" width="16" height="22" rx="2" stroke={LINE} strokeWidth="1.6" />
        <line x1="18" y1="16" x2="26" y2="16" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="18" y1="20" x2="24" y2="20" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="18" y1="24" x2="22" y2="24" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" />
        {/* Scan line animating down */}
        <line x1="13" y1="15" x2="31" y2="15" stroke={LINE} strokeWidth="1" opacity="0.65">
          <animate attributeName="y1" values="12;30;12" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="12;30;12" dur="2.5s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3 - Approval Workflow                                             */
/* ------------------------------------------------------------------ */
function ApprovalWorkflowIcon({ className }: { className?: string }) {
  const fill = accentFor(2);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Shield */}
        <path d="M22 10l-9 4v6c0 6.3 3.8 11.2 9 13 5.2-1.8 9-6.7 9-13v-6l-9-4z" stroke={LINE} strokeWidth="1.6" strokeLinejoin="round" />
        {/* Checkmark */}
        <path d="M17.5 22l3 3 6-6" stroke={LINE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4 - Dashboard                                                     */
/* ------------------------------------------------------------------ */
function DashboardIcon({ className }: { className?: string }) {
  const fill = accentFor(3);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Three bars */}
        <rect x="14" y="22" width="4" height="10" rx="1" fill={LINE_DIM} />
        <rect x="20" y="16" width="4" height="16" rx="1" fill={LINE} />
        <rect x="26" y="12" width="4" height="20" rx="1" fill={LINE_DIM} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5 - Onboarding                                                    */
/* ------------------------------------------------------------------ */
function OnboardingIcon({ className }: { className?: string }) {
  const fill = accentFor(4);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* User silhouette */}
        <circle cx="19" cy="16" r="3.5" stroke={LINE} strokeWidth="1.6" />
        <path d="M12 30c0-4 3.1-7 7-7s7 3 7 7" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        {/* Plus */}
        <line x1="30" y1="14" x2="30" y2="20" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="27" y1="17" x2="33" y2="17" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        {/* Checklist lines */}
        <line x1="27" y1="26" x2="32" y2="26" stroke={LINE_DIM} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="27" y1="29" x2="31" y2="29" stroke={LINE_DIM} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  6 - Digitization                                                  */
/* ------------------------------------------------------------------ */
function DigitizationIcon({ className }: { className?: string }) {
  const fill = accentFor(5);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Paper */}
        <rect x="10" y="13" width="10" height="14" rx="1.5" stroke={LINE} strokeWidth="1.4" />
        <line x1="13" y1="17" x2="17" y2="17" stroke={LINE} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="13" y1="20" x2="16" y2="20" stroke={LINE} strokeWidth="1.2" strokeLinecap="round" />
        {/* Arrow */}
        <path d="M21 22h4" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M23.5 19.5L26 22l-2.5 2.5" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Monitor */}
        <rect x="28" y="14" width="8" height="7" rx="1" stroke={LINE} strokeWidth="1.3" />
        <line x1="32" y1="21" x2="32" y2="24" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="30" y1="24" x2="34" y2="24" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  7 - Data Sync                                                     */
/* ------------------------------------------------------------------ */
function DataSyncIcon({ className }: { className?: string }) {
  const fill = accentFor(6);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Top arrow (clockwise) */}
        <path d="M28 16a8 8 0 0 1 1.5 9" stroke={LINE} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M29 13l-1 3h3" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom arrow (counter-clockwise) */}
        <path d="M16 28a8 8 0 0 1-1.5-9" stroke={LINE} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 31l1-3h-3" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  8 - Client Communication                                          */
/* ------------------------------------------------------------------ */
function ClientCommIcon({ className }: { className?: string }) {
  const fill = accentFor(7);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Back bubble */}
        <path d="M27 13h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-3-3h-3a2 2 0 0 1-2-2v-1" stroke={LINE_DIM} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Front bubble */}
        <rect x="10" y="16" width="16" height="10" rx="2" stroke={LINE} strokeWidth="1.6" />
        <path d="M14 29l3-3" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        <circle cx="15" cy="21" r="1" fill={LINE} />
        <circle cx="18" cy="21" r="1" fill={LINE} />
        <circle cx="21" cy="21" r="1" fill={LINE} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  9 - Chat Support                                                  */
/* ------------------------------------------------------------------ */
function ChatSupportIcon({ className }: { className?: string }) {
  const fill = accentFor(8);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Phone body */}
        <rect x="15" y="10" width="12" height="22" rx="2.5" stroke={LINE} strokeWidth="1.6" />
        <line x1="19" y1="28" x2="23" y2="28" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" />
        {/* Chat bubble */}
        <rect x="26" y="13" width="8" height="5" rx="1.5" stroke={LINE} strokeWidth="1.2" />
        <path d="M28 18l-1.5 2" stroke={LINE} strokeWidth="1.2" strokeLinecap="round" />
        {/* Bubble dot */}
        <circle cx="30" cy="15.5" r="0.7" fill={LINE} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  10 - Voice Assistant                                              */
/* ------------------------------------------------------------------ */
function VoiceAssistantIcon({ className }: { className?: string }) {
  const fill = accentFor(9);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Microphone */}
        <rect x="19" y="12" width="6" height="10" rx="3" stroke={LINE} strokeWidth="1.6" />
        <path d="M15 22a7 7 0 0 0 14 0" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="22" y1="29" x2="22" y2="32" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="19" y1="32" x2="25" y2="32" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        {/* Sound waves */}
        <path d="M32 17a4 4 0 0 1 0 8" stroke={LINE_DIM} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M34 14a8 8 0 0 1 0 14" stroke={LINE_DIM} strokeWidth="1.2" strokeLinecap="round" opacity="0.45">
          <animate attributeName="opacity" values="0.2;0.65;0.2" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  11 - Content Ops                                                  */
/* ------------------------------------------------------------------ */
function ContentOpsIcon({ className }: { className?: string }) {
  const fill = accentFor(10);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Play button circle */}
        <circle cx="19" cy="22" r="8" stroke={LINE} strokeWidth="1.6" />
        {/* Play triangle */}
        <path d="M17 18l6 4-6 4z" fill={LINE} />
        {/* Calendar / clock */}
        <rect x="28" y="13" width="7" height="7" rx="1.5" stroke={LINE} strokeWidth="1.2" />
        <line x1="30" y1="12" x2="30" y2="14" stroke={LINE} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="33" y1="12" x2="33" y2="14" stroke={LINE} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="28" y1="16" x2="35" y2="16" stroke={LINE} strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  12 - Sales Pipeline                                               */
/* ------------------------------------------------------------------ */
function SalesPipelineIcon({ className }: { className?: string }) {
  const fill = accentFor(11);
  return (
    <div className={`${className} animate-fade-in`}>
      <svg viewBox="0 0 44 44" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill={fill} />
        {/* Funnel */}
        <path d="M12 12h20l-6 10v7l-4 3v-10L12 12z" stroke={LINE} strokeWidth="1.6" strokeLinejoin="round" />
        {/* Dots flowing through */}
        <circle cx="18" cy="14" r="1.2" fill={LINE} opacity="0.75">
          <animate attributeName="cy" values="14;22;30" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="14" r="1" fill={LINE} opacity="0.55">
          <animate attributeName="cy" values="14;22;28" dur="2s" begin="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.4;0" dur="2s" begin="0.7s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ordered export array                                              */
/* ------------------------------------------------------------------ */
export const useCaseIcons: React.FC<{ className?: string }>[] = [
  OrderProcessingIcon,
  InvoiceProcessingIcon,
  ApprovalWorkflowIcon,
  DashboardIcon,
  OnboardingIcon,
  DigitizationIcon,
  DataSyncIcon,
  ClientCommIcon,
  ChatSupportIcon,
  VoiceAssistantIcon,
  ContentOpsIcon,
  SalesPipelineIcon,
];

export {
  OrderProcessingIcon,
  InvoiceProcessingIcon,
  ApprovalWorkflowIcon,
  DashboardIcon,
  OnboardingIcon,
  DigitizationIcon,
  DataSyncIcon,
  ClientCommIcon,
  ChatSupportIcon,
  VoiceAssistantIcon,
  ContentOpsIcon,
  SalesPipelineIcon,
};
