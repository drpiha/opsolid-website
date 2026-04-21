"use client";

/**
 * HeroCardMockup — stylized SVG/CSS visual.
 * Renders a floating phone showing a profile preview + a physical NFC card in front,
 * with a pulsing ring emitting from the card's NFC chip.
 *
 * Used on the homepage and DBC product page hero. No framer-motion — pure Tailwind + CSS.
 * Uses tokens: white, ink, brand, neutral, shadow-pop/lifted.
 */
interface HeroCardMockupProps {
  name?: string;
  role?: string;
  company?: string;
  cardLabel?: string;
}

export function HeroCardMockup({
  name = "Alex Weber",
  role = "Product Designer",
  company = "Studio Nord",
  cardLabel = "SCAN TO SHARE",
}: HeroCardMockupProps) {
  const initials =
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0] ?? "")
      .join("")
      .toUpperCase() || "OS";

  return (
    <div
      className="relative aspect-[4/5] w-full max-w-[520px] mx-auto"
      aria-hidden="true"
    >
      {/* Ambient tonal glow — soft red halo behind stack */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[3rem] bg-brand/10 blur-3xl scale-75"
        style={{ transform: "translate(8%, 10%) scale(0.75)" }}
      />

      {/* Neutral backdrop plate — gives the stack a surface to sit on */}
      <div className="absolute inset-4 rounded-[2.25rem] bg-gradient-to-br from-neutral-100 to-neutral-50" />

      {/* ============================================================
          PHONE — back layer, rotated slightly left
          ============================================================ */}
      <div className="absolute top-[5%] left-[14%] w-[60%] aspect-[9/19] -rotate-6 drop-shadow-[0_30px_60px_rgba(10,10,10,0.28)]">
        <div className="relative h-full w-full rounded-[2.25rem] bg-ink p-[6px]">
          {/* Notch */}
          <div className="absolute left-1/2 top-[10px] -translate-x-1/2 h-[18px] w-[90px] rounded-full bg-ink-800 z-10" />
          {/* Screen */}
          <div className="relative h-full w-full rounded-[1.9rem] bg-white overflow-hidden flex flex-col">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-semibold text-ink">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-ink" />
                <span className="inline-block h-2 w-3 rounded-[1px] border border-ink" />
              </span>
            </div>

            {/* Profile hero band */}
            <div className="mt-3 mx-3 rounded-2xl bg-gradient-to-br from-brand-50 to-white px-3 pt-5 pb-4 flex flex-col items-center">
              {/* Avatar */}
              <div className="h-14 w-14 rounded-full bg-brand text-white flex items-center justify-center text-base font-bold shadow-cta">
                {initials}
              </div>
              <div className="mt-2 text-[11px] font-bold text-ink text-center leading-tight">
                {name}
              </div>
              <div className="mt-0.5 text-[8px] text-ink/60 text-center">
                {role}
              </div>
              <div className="mt-0.5 text-[8px] text-ink/50 text-center">
                {company}
              </div>

              {/* Save button */}
              <div className="mt-3 w-full rounded-full bg-brand text-white text-[9px] font-semibold py-1.5 text-center">
                Save contact
              </div>
            </div>

            {/* Action row */}
            <div className="mt-3 mx-3 grid grid-cols-3 gap-2">
              {["Call", "Email", "Web"].map((l) => (
                <div
                  key={l}
                  className="rounded-xl border border-neutral-200 px-2 py-2 text-center"
                >
                  <div className="h-4 w-4 mx-auto rounded-full bg-neutral-100" />
                  <div className="mt-1 text-[7px] font-semibold text-ink/70">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Social rows */}
            <div className="mt-2 mx-3 space-y-1.5">
              {[
                ["LinkedIn", "/in/hasan"],
                ["WhatsApp", "+49 …"],
                ["Calendar", "Book 30 min"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 border border-neutral-200 px-2 py-1.5"
                >
                  <span className="text-[8px] font-semibold text-ink">{l}</span>
                  <span className="text-[7px] text-ink/50 truncate max-w-[60px]">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Home indicator */}
            <div className="mt-auto mb-2 flex justify-center">
              <div className="h-[3px] w-16 rounded-full bg-ink/80" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          NFC CARD — front layer, rotated right, overlapping phone
          ============================================================ */}
      <div className="absolute bottom-[4%] right-[6%] w-[58%] aspect-[1.59/1] rotate-[8deg]">
        <div className="relative h-full w-full rounded-2xl bg-ink text-white p-4 shadow-pop overflow-hidden">
          {/* Subtle red vignette */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/25 blur-2xl" />

          {/* Brand row */}
          <div className="relative flex items-center justify-between text-[9px] font-semibold tracking-[0.18em] text-white/60 uppercase">
            <span>OpSolid</span>
            <span className="flex items-center gap-1 text-brand-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand animate-pulse-ring" />
              QR
            </span>
          </div>

          {/* Name block */}
          <div className="relative mt-5 pr-[76px]">
            <div className="text-[13px] font-bold leading-tight">{name}</div>
            <div className="mt-0.5 text-[9px] text-white/70">{role}</div>
            <div className="mt-0.5 text-[8px] text-white/50">{company}</div>
          </div>

          {/* QR code tile — top right, stylized SVG matrix */}
          <div className="absolute top-3 right-3 h-[64px] w-[64px] rounded-md bg-white p-[6px] shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
            <svg viewBox="0 0 29 29" className="h-full w-full text-ink" aria-hidden="true">
              {/* Position markers — 3 corners */}
              <rect x="0"  y="0"  width="7" height="7" fill="currentColor" />
              <rect x="1"  y="1"  width="5" height="5" fill="white" />
              <rect x="2"  y="2"  width="3" height="3" fill="currentColor" />
              <rect x="22" y="0"  width="7" height="7" fill="currentColor" />
              <rect x="23" y="1"  width="5" height="5" fill="white" />
              <rect x="24" y="2"  width="3" height="3" fill="currentColor" />
              <rect x="0"  y="22" width="7" height="7" fill="currentColor" />
              <rect x="1"  y="23" width="5" height="5" fill="white" />
              <rect x="2"  y="24" width="3" height="3" fill="currentColor" />
              {/* Timing + data modules (pseudo-random blocks) */}
              <g fill="currentColor">
                <rect x="9"  y="0"  width="1" height="1" />
                <rect x="11" y="0"  width="2" height="1" />
                <rect x="15" y="0"  width="1" height="1" />
                <rect x="17" y="0"  width="1" height="1" />
                <rect x="19" y="0"  width="1" height="1" />
                <rect x="8"  y="2"  width="1" height="3" />
                <rect x="12" y="2"  width="1" height="1" />
                <rect x="14" y="2"  width="3" height="1" />
                <rect x="19" y="2"  width="1" height="1" />
                <rect x="10" y="4"  width="2" height="1" />
                <rect x="14" y="4"  width="1" height="2" />
                <rect x="17" y="4"  width="2" height="1" />
                <rect x="9"  y="6"  width="1" height="2" />
                <rect x="12" y="6"  width="1" height="2" />
                <rect x="16" y="6"  width="2" height="1" />
                <rect x="20" y="6"  width="1" height="2" />
                <rect x="0"  y="8"  width="1" height="1" />
                <rect x="2"  y="8"  width="3" height="1" />
                <rect x="7"  y="8"  width="2" height="2" />
                <rect x="11" y="8"  width="1" height="3" />
                <rect x="14" y="8"  width="2" height="1" />
                <rect x="18" y="8"  width="1" height="2" />
                <rect x="22" y="8"  width="1" height="1" />
                <rect x="24" y="8"  width="3" height="1" />
                <rect x="4"  y="10" width="1" height="2" />
                <rect x="7"  y="10" width="1" height="1" />
                <rect x="13" y="10" width="2" height="2" />
                <rect x="16" y="10" width="1" height="1" />
                <rect x="20" y="10" width="3" height="1" />
                <rect x="25" y="10" width="1" height="2" />
                <rect x="0"  y="12" width="2" height="1" />
                <rect x="5"  y="12" width="2" height="1" />
                <rect x="9"  y="12" width="1" height="2" />
                <rect x="12" y="12" width="1" height="1" />
                <rect x="17" y="12" width="3" height="1" />
                <rect x="22" y="12" width="1" height="2" />
                <rect x="26" y="12" width="2" height="1" />
                <rect x="2"  y="14" width="1" height="2" />
                <rect x="6"  y="14" width="3" height="1" />
                <rect x="11" y="14" width="2" height="2" />
                <rect x="15" y="14" width="1" height="1" />
                <rect x="19" y="14" width="1" height="2" />
                <rect x="23" y="14" width="2" height="1" />
                <rect x="4"  y="16" width="2" height="1" />
                <rect x="8"  y="16" width="1" height="2" />
                <rect x="14" y="16" width="1" height="1" />
                <rect x="17" y="16" width="2" height="2" />
                <rect x="22" y="16" width="1" height="1" />
                <rect x="25" y="16" width="2" height="1" />
                <rect x="0"  y="18" width="1" height="2" />
                <rect x="3"  y="18" width="2" height="1" />
                <rect x="7"  y="18" width="1" height="1" />
                <rect x="10" y="18" width="3" height="1" />
                <rect x="15" y="18" width="1" height="2" />
                <rect x="20" y="18" width="1" height="1" />
                <rect x="24" y="18" width="2" height="2" />
                <rect x="8"  y="20" width="2" height="1" />
                <rect x="12" y="20" width="1" height="2" />
                <rect x="17" y="20" width="1" height="1" />
                <rect x="19" y="20" width="2" height="1" />
                <rect x="22" y="20" width="1" height="2" />
                <rect x="26" y="20" width="1" height="2" />
                <rect x="9"  y="22" width="3" height="1" />
                <rect x="14" y="22" width="1" height="2" />
                <rect x="17" y="22" width="2" height="1" />
                <rect x="21" y="22" width="1" height="1" />
                <rect x="23" y="22" width="3" height="1" />
                <rect x="10" y="24" width="1" height="1" />
                <rect x="13" y="24" width="2" height="1" />
                <rect x="17" y="24" width="1" height="2" />
                <rect x="20" y="24" width="1" height="2" />
                <rect x="22" y="24" width="1" height="1" />
                <rect x="24" y="24" width="1" height="2" />
                <rect x="26" y="24" width="1" height="1" />
                <rect x="9"  y="26" width="2" height="1" />
                <rect x="13" y="26" width="1" height="1" />
                <rect x="16" y="26" width="1" height="1" />
                <rect x="19" y="26" width="2" height="1" />
                <rect x="23" y="26" width="1" height="1" />
                <rect x="26" y="26" width="2" height="1" />
              </g>
            </svg>
          </div>

          {/* Scan label — bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="text-[8px] font-semibold tracking-[0.22em] text-white/60 uppercase">
              {cardLabel}
            </div>
            <div className="text-[7px] text-white/40 tracking-[0.15em] uppercase">
              opsolid.de
            </div>
          </div>
        </div>
      </div>

      {/* Tiny floating chips — add product cues */}
      <div className="absolute top-[6%] right-[4%] rounded-full bg-white border border-neutral-200 shadow-card px-3 py-1.5 text-[10px] font-semibold text-ink flex items-center gap-1.5 rotate-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
        Hosted in Germany
      </div>
      <div className="absolute bottom-[30%] left-[2%] rounded-full bg-white border border-neutral-200 shadow-card px-3 py-1.5 text-[10px] font-semibold text-ink flex items-center gap-1.5 -rotate-6">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        GDPR native
      </div>
    </div>
  );
}
