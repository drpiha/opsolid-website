"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  ArrowRight,
  Sparkles,
  IdCard,
  BellRing,
  Phone,
  MessageCircle,
  MessagesSquare,
  CalendarClock,
  Mail,
  UserCheck,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={20} strokeWidth={1.75} />,
  idCard: <IdCard size={20} strokeWidth={1.75} />,
  bell: <BellRing size={20} strokeWidth={1.75} />,
  phone: <Phone size={20} strokeWidth={1.75} />,
  messageCircle: <MessageCircle size={20} strokeWidth={1.75} />,
  messagesSquare: <MessagesSquare size={20} strokeWidth={1.75} />,
  calendarClock: <CalendarClock size={20} strokeWidth={1.75} />,
  mail: <Mail size={20} strokeWidth={1.75} />,
  userCheck: <UserCheck size={20} strokeWidth={1.75} />,
};

export function ProductsTeaser() {
  const { t } = useLocale();
  const s = t.home.pricingPreview;
  const items = t.products.items.slice(0, 6);

  return (
    <section className="section bg-neutral-50">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            description={s.description}
            align="center"
          />
        </AnimatedSection>

        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item, i) => (
            <AnimatedSection key={item.href} delay={i * 0.05}>
              <Link
                href={item.href}
                className="pop-card group block h-full p-6 md:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-ink">
                    {iconMap[item.icon] ?? (
                      <Sparkles size={20} strokeWidth={1.75} />
                    )}
                  </div>
                  <span className="trust-pill text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-extrabold tracking-[-0.02em] text-ink leading-tight">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-brand">
                  {item.tagline}
                </p>
                <p className="mt-3 text-sm text-ink/65 leading-relaxed line-clamp-3 text-pretty">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold text-ink/70">
                    {item.startingPrice}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                    Explore
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand transition-colors"
          >
            See all products
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
