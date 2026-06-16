import { SITE_CONFIG } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg-0">
      {/* Left marketing panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[60%] flex-col justify-between p-12 xl:p-16 border-r border-line bg-bg-1">
        <div>
          {/* Brand mark */}
          <div className="flex items-center gap-2.5 mb-16">
            <span className="text-sm font-semibold tracking-[0.12em] uppercase text-copper-500 font-mono">
              {SITE_CONFIG.name}
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-md">
            <h1 className="text-3xl xl:text-4xl font-semibold text-ink leading-[1.15] tracking-tight mb-5">
              Digital business cards
              <br />
              <span className="text-copper-500">that work for you.</span>
            </h1>
            <p className="text-ink-300 text-base leading-relaxed mb-10">
              Share your contact, portfolio, and links from a single card.
              Always current — no printing required.
            </p>

            {/* Bullets */}
            <ul className="space-y-4">
              {[
                {
                  label: "One link, everything in it",
                  detail: "Contact info, social profiles, portfolio — on one polished card.",
                },
                {
                  label: "Update once, seen everywhere",
                  detail: "Edit your card live. No reprints, no outdated paper.",
                },
                {
                  label: "Built for real business use",
                  detail: "Link & QR share, vCard export, and analytics.",
                },
              ].map((item) => (
                <li key={item.label} className="flex gap-3 items-start">
                  <span className="mt-1 flex-none w-4 h-4 rounded-full border border-copper-500/40 bg-copper-500/10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-copper-500" />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-ink-200">{item.label}</span>
                    <span className="block text-sm text-ink-400">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom stamp */}
        <p className="text-xs text-ink-500 tracking-wide">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name} &mdash; Germany
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 lg:py-12">
        {/* Mobile brand mark */}
        <div className="lg:hidden mb-8 self-start">
          <span className="text-sm font-semibold tracking-[0.12em] uppercase text-copper-500 font-mono">
            {SITE_CONFIG.name}
          </span>
        </div>
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
