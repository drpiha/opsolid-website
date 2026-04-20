"use client";

import { IPhoneMockup, LaptopMockup } from "@/components/shared/mockups";
import {
  PhoneCall,
  Phone,
  Check,
  CheckCheck,
  User,
  Bot,
  Mic,
  Inbox,
  Mail,
  Calendar,
  AlertTriangle,
  Sparkles,
  Target,
} from "lucide-react";

export type AgentDemoVariant =
  | "voice"
  | "chat"
  | "whatsapp"
  | "booking"
  | "email"
  | "qualifier";

interface AgentDemoPreviewProps {
  variant: AgentDemoVariant;
  className?: string;
}

/* --------------------------------------------------------------------------
 * Shared: animated audio wave (for voice + qualifier variants)
 * Uses CSS keyframes, no framer-motion.
 * ------------------------------------------------------------------------ */
function WaveBars({
  color = "bg-white",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <>
      <style>{`
        @keyframes wave-bar {
          0%, 100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1); }
        }
        .wave-bar {
          transform-origin: center;
          animation: wave-bar 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className={`flex items-end justify-center gap-1.5 h-10 ${className}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`wave-bar w-1.5 rounded-full ${color}`}
            style={{
              height: "100%",
              animationDelay: `${i * 0.12}s`,
              opacity: 0.6 + i * 0.08,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ==========================================================================
 * VOICE — iPhone, live call screen
 * ======================================================================= */
function VoiceDemo() {
  return (
    <IPhoneMockup scale="md" title="Voice AI Agent — live call demo">
      <div className="flex h-full w-full flex-col bg-gradient-to-b from-ink via-ink to-neutral-900 text-white">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-12 pb-3 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </span>
        </div>

        {/* Caller info */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4">
          <p className="text-[10px] uppercase tracking-widest text-white/50">
            OpSolid · Voice Agent
          </p>
          <p className="mt-2 text-lg font-semibold">+49 40 1234567</p>
          <p className="mt-1 text-xs text-white/60">Hotel Nord · DE</p>
        </div>

        {/* Avatar with pulsing ring */}
        <div className="relative my-4 flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-28 w-28 rounded-full bg-brand/20 animate-ping" />
          </div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-600 shadow-lg">
            <Mic size={32} strokeWidth={2} className="text-white" />
          </div>
        </div>

        {/* Wave */}
        <div className="px-6 py-2">
          <WaveBars color="bg-white" />
        </div>

        {/* Speech bubble */}
        <div className="mx-5 mt-2 rounded-2xl rounded-tl-sm bg-white/10 backdrop-blur p-3">
          <p className="text-[11px] font-medium leading-relaxed text-white/90">
            &ldquo;Guten Tag, Hotel Nord. Wie kann ich Ihnen helfen?&rdquo;
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-white/40">
            AI · DE
          </p>
        </div>

        {/* Call controls */}
        <div className="mt-auto flex items-center justify-around px-6 pb-8">
          <button
            aria-label="Mute"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
          >
            <Mic size={16} className="text-white" />
          </button>
          <button
            aria-label="End call"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500"
          >
            <Phone size={20} className="rotate-[135deg] text-white" />
          </button>
          <button
            aria-label="Speaker"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
          >
            <PhoneCall size={16} className="text-white" />
          </button>
        </div>
      </div>
    </IPhoneMockup>
  );
}

/* ==========================================================================
 * CHAT — Laptop, website with chat widget bottom-right
 * ======================================================================= */
function ChatDemo() {
  return (
    <LaptopMockup title="Website Chatbot — live demo">
      <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Fake browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-white/80 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-4 flex-1 rounded-full bg-neutral-100 px-3 py-1 text-[9px] text-neutral-500">
            opsolid.de
          </div>
        </div>

        {/* Fake website content */}
        <div className="flex-1 p-5">
          <div className="mb-3 h-2 w-16 rounded-full bg-neutral-300" />
          <div className="mb-6 h-3 w-40 rounded-full bg-neutral-800" />
          <div className="mb-2 h-1.5 w-full rounded-full bg-neutral-200" />
          <div className="mb-2 h-1.5 w-3/4 rounded-full bg-neutral-200" />
          <div className="mb-6 h-1.5 w-5/6 rounded-full bg-neutral-200" />
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-lg bg-neutral-200" />
            <div className="aspect-square rounded-lg bg-neutral-200" />
            <div className="aspect-square rounded-lg bg-neutral-200" />
          </div>
        </div>

        {/* Chat widget bottom-right */}
        <div className="absolute bottom-3 right-3 w-[58%] max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] border border-neutral-200">
          <div className="flex items-center gap-2 bg-ink px-3 py-2 text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand">
              <Sparkles size={12} />
            </div>
            <div className="text-[10px] font-semibold leading-none">
              OpSolid Assistant
              <p className="mt-0.5 text-[8px] font-normal text-white/60">
                Online
              </p>
            </div>
          </div>
          <div className="space-y-2 p-3">
            <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-neutral-100 px-3 py-1.5">
              <p className="text-[10px] leading-snug text-ink">
                Do you also handle WhatsApp?
              </p>
            </div>
            <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-brand px-3 py-1.5">
              <p className="text-[10px] leading-snug text-white">
                Yes — via the official Meta BSP. Want to book a demo?
              </p>
            </div>
            <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-neutral-100 px-3 py-1.5">
              <p className="text-[10px] leading-snug text-ink">Let&apos;s do it.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-2.5 py-1.5">
              <Check size={10} className="text-green-600" />
              <p className="text-[9px] font-semibold text-green-700">
                Booked · Thu 14:00
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-neutral-100 px-3 py-2">
            <div className="flex-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] text-neutral-400">
              Type a message…
            </div>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ink">
              <Bot size={10} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </LaptopMockup>
  );
}

/* ==========================================================================
 * WHATSAPP — iPhone, WhatsApp-like conversation
 * ======================================================================= */
function WhatsAppDemo() {
  return (
    <IPhoneMockup scale="md" title="WhatsApp Business Agent — demo">
      <div className="flex h-full w-full flex-col bg-[#E5DDD3]">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-[#075E54] px-4 pt-12 pb-2 text-[10px] font-semibold text-white">
          <span>9:41</span>
          <span>••• 5G</span>
        </div>
        {/* WhatsApp header */}
        <div className="flex items-center gap-3 bg-[#075E54] px-3 pb-3 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold leading-none">ZK Handmade</p>
            <p className="mt-0.5 text-[9px] text-white/70">
              Business · online
            </p>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400/90">
            <Check size={10} strokeWidth={3} className="text-white" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-2 overflow-hidden p-3">
          <div className="ml-auto max-w-[75%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-2.5 py-1.5 shadow-sm">
            <p className="text-[10px] leading-snug text-ink">
              Where is my order #4412?
            </p>
            <p className="mt-0.5 text-right text-[8px] text-ink/50">
              9:38 <CheckCheck size={8} className="inline text-[#53BDEB]" />
            </p>
          </div>

          <div className="max-w-[80%] rounded-lg rounded-tl-sm bg-white px-2.5 py-1.5 shadow-sm">
            <p className="text-[10px] leading-snug text-ink">
              Hi! Order <strong>#4412</strong> shipped yesterday 🚚
            </p>
            <p className="mt-0.5 text-[8px] leading-snug text-ink/70">
              Tracking: DHL 2348 0922 14
            </p>
            <p className="mt-0.5 text-right text-[8px] text-ink/50">9:38</p>
          </div>

          <div className="max-w-[75%] rounded-lg rounded-tl-sm bg-white px-2.5 py-1.5 shadow-sm">
            <p className="text-[10px] leading-snug text-ink">
              Arrival: <strong>tomorrow, 10–14h</strong>.
            </p>
            <p className="mt-0.5 text-right text-[8px] text-ink/50">9:38</p>
          </div>

          <div className="ml-auto max-w-[60%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-2.5 py-1.5 shadow-sm">
            <p className="text-[10px] leading-snug text-ink">Perfect, thanks!</p>
            <p className="mt-0.5 text-right text-[8px] text-ink/50">
              9:39 <CheckCheck size={8} className="inline text-[#53BDEB]" />
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-[#F0F0F0] px-3 py-2">
          <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[9px] text-neutral-400">
            Message
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#075E54]">
            <Mic size={12} className="text-white" />
          </div>
        </div>
      </div>
    </IPhoneMockup>
  );
}

/* ==========================================================================
 * BOOKING — Laptop, calendar month view with highlighted slot
 * ======================================================================= */
function BookingDemo() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = 14;
  const booked = 15;

  return (
    <LaptopMockup title="Booking Agent — live calendar demo">
      <div className="flex h-full w-full flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Calendar size={14} />
            </div>
            <div>
              <p className="text-xs font-bold leading-none text-ink">
                Booking · Cal.com
              </p>
              <p className="mt-0.5 text-[9px] text-ink/50">
                Dr. Ayşe Demir · 30-min consultation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="trust-pill text-[9px] !py-1 !px-2">
              <span className="h-1 w-1 rounded-full bg-green-500" />
              AI agent active
            </span>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Calendar grid */}
          <div className="flex-1 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink">
              April 2026
            </p>
            <div className="grid grid-cols-7 gap-1 text-[8px] font-semibold text-ink/50">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {days.map((d) => {
                const isToday = d === today;
                const isBooked = d === booked;
                return (
                  <div
                    key={d}
                    className={`aspect-square flex items-center justify-center rounded-md text-[9px] font-semibold transition ${
                      isBooked
                        ? "bg-brand text-white ring-2 ring-brand/30"
                        : isToday
                          ? "bg-ink text-white"
                          : d < today
                            ? "text-ink/30"
                            : "text-ink hover:bg-neutral-100"
                    }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="w-[42%] border-l border-neutral-200 bg-neutral-50 p-4">
            <p className="text-[9px] uppercase tracking-wider text-ink/50">
              Next available
            </p>
            <p className="mt-1 text-sm font-bold text-ink">Tomorrow</p>
            <p className="text-[10px] text-ink/60">Wed 15 April · 10:00</p>

            <div className="mt-3 space-y-1.5">
              {["09:30", "10:00", "10:30", "11:00"].map((t, i) => (
                <div
                  key={t}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[9px] font-medium ${
                    i === 1
                      ? "bg-brand text-white"
                      : "bg-white border border-neutral-200 text-ink"
                  }`}
                >
                  <span>{t}</span>
                  {i === 1 && <Check size={10} strokeWidth={3} />}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-2">
              <div className="flex items-center gap-1.5">
                <Check size={10} className="text-green-600" />
                <p className="text-[9px] font-semibold text-green-700">
                  Confirmed · Tomorrow 10:00
                </p>
              </div>
              <p className="mt-1 text-[8px] text-green-700/70">
                Reminder sent via SMS
              </p>
            </div>
          </div>
        </div>
      </div>
    </LaptopMockup>
  );
}

/* ==========================================================================
 * EMAIL — Laptop inbox with AI tags
 * ======================================================================= */
function EmailDemo() {
  const rows = [
    {
      from: "Sophie Lambert",
      subject: "Re: Q2 proposal — pricing questions",
      time: "09:12",
      tag: "AI REPLIED",
      tagColor: "bg-green-100 text-green-700",
      icon: <Check size={8} strokeWidth={3} />,
    },
    {
      from: "Björn Svensson",
      subject: "URGENT: contract terms need legal review",
      time: "08:44",
      tag: "ESCALATED",
      tagColor: "bg-red-100 text-red-700",
      icon: <AlertTriangle size={8} strokeWidth={2.5} />,
    },
    {
      from: "Anna Köhler",
      subject: "Invoice #2024-0412 — payment confirmation",
      time: "08:22",
      tag: "TRIAGED",
      tagColor: "bg-blue-100 text-blue-700",
      icon: <Inbox size={8} strokeWidth={2.5} />,
    },
    {
      from: "newsletter@industry.io",
      subject: "Weekly digest: April 2026 trends",
      time: "07:50",
      tag: "FILED",
      tagColor: "bg-neutral-100 text-neutral-600",
      icon: <Inbox size={8} strokeWidth={2.5} />,
    },
    {
      from: "Daniel Park",
      subject: "Quick availability for next week?",
      time: "07:31",
      tag: "AI REPLIED",
      tagColor: "bg-green-100 text-green-700",
      icon: <Check size={8} strokeWidth={3} />,
    },
  ];

  return (
    <LaptopMockup title="Email Automation Agent — inbox demo">
      <div className="flex h-full w-full flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Mail size={14} />
            </div>
            <div>
              <p className="text-xs font-bold leading-none text-ink">Inbox</p>
              <p className="mt-0.5 text-[9px] text-ink/50">
                hello@opsolid.de · 42 unread
              </p>
            </div>
          </div>
          <span className="trust-pill text-[9px] !py-1 !px-2">
            <span className="h-1 w-1 rounded-full bg-green-500" />
            AI triage on
          </span>
        </div>

        {/* Rows */}
        <div className="flex-1 divide-y divide-neutral-100 overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                i === 0 ? "bg-brand/[0.03]" : "hover:bg-neutral-50"
              }`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-ink">
                {r.from[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[11px] font-semibold text-ink">
                    {r.from}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${r.tagColor}`}
                  >
                    {r.icon}
                    {r.tag}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[10px] text-ink/60">
                  {r.subject}
                </p>
              </div>
              <span className="shrink-0 text-[9px] text-ink/40">{r.time}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-2 text-[9px] text-ink/50">
          Drafts reviewed in queue · 8 waiting
        </div>
      </div>
    </LaptopMockup>
  );
}

/* ==========================================================================
 * QUALIFIER — iPhone chat with score card
 * ======================================================================= */
function QualifierDemo() {
  return (
    <IPhoneMockup scale="md" title="Lead Qualifier — live conversation">
      <div className="flex h-full w-full flex-col bg-gradient-to-b from-neutral-50 to-white">
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-12 pb-2 text-[10px] font-semibold text-ink">
          <span>9:41</span>
          <span>••• 5G</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-600 text-white">
            <Target size={14} />
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-none text-ink">
              OpSolid · Sales
            </p>
            <p className="mt-0.5 text-[9px] text-ink/60">AI qualifier · live</p>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 space-y-2 overflow-hidden p-3">
          <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-neutral-100 px-2.5 py-1.5">
            <p className="text-[10px] leading-snug text-ink">
              Hi! What brings you here?
            </p>
          </div>
          <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-ink px-2.5 py-1.5">
            <p className="text-[10px] leading-snug text-white">
              We need a voice agent for 3 clinics.
            </p>
          </div>
          <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-neutral-100 px-2.5 py-1.5">
            <p className="text-[10px] leading-snug text-ink">
              Got it — monthly call volume per clinic?
            </p>
          </div>
          <div className="ml-auto max-w-[75%] rounded-xl rounded-tr-sm bg-ink px-2.5 py-1.5">
            <p className="text-[10px] leading-snug text-white">
              ~1,200 calls / month.
            </p>
          </div>
          <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-neutral-100 px-2.5 py-1.5">
            <p className="text-[10px] leading-snug text-ink">
              Perfect fit. Booking you with an AE now.
            </p>
          </div>

          {/* Score card */}
          <div className="mx-auto mt-3 w-full rounded-xl border border-brand/20 bg-gradient-to-br from-brand/5 to-white p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand">
                ICP Score
              </span>
              <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[8px] font-bold text-green-700">
                SQL
              </span>
            </div>
            <p className="mt-1 text-lg font-extrabold text-ink">
              87<span className="text-xs text-ink/40">/100</span>
            </p>
            <p className="mt-0.5 text-[9px] text-ink/60">
              Ready for @sales · routed to HubSpot
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: "87%" }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 bg-white px-3 py-2 text-[9px] text-ink/40">
          End of demo · you won&apos;t be contacted
        </div>
      </div>
    </IPhoneMockup>
  );
}

/* --------------------------------------------------------------------------
 * Main export
 * ------------------------------------------------------------------------ */
export function AgentDemoPreview({ variant, className }: AgentDemoPreviewProps) {
  const content = (() => {
    switch (variant) {
      case "voice":
        return <VoiceDemo />;
      case "chat":
        return <ChatDemo />;
      case "whatsapp":
        return <WhatsAppDemo />;
      case "booking":
        return <BookingDemo />;
      case "email":
        return <EmailDemo />;
      case "qualifier":
        return <QualifierDemo />;
      default:
        return null;
    }
  })();

  return <div className={className}>{content}</div>;
}
