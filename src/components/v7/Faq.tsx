"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Faq as FaqData } from "@/content/v7/types";

/** Accessible accordion: real buttons with aria-expanded/aria-controls, one open at a time, first open. */
export function FaqList({ items }: { items: FaqData["items"] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <div className="border-t border-[#E3DCD1]">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-[#E3DCD1]">
            <h3>
              <button
                type="button"
                id={`${uid}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left"
              >
                <span className="f-display text-[22px] leading-[1.2] md:text-[26px]">{it.q}</span>
                <span aria-hidden="true" className="relative size-5 shrink-0 text-[#B5623A]">
                  <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                  <span className={`absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-200 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-p${i}`}
                  role="region"
                  aria-labelledby={`${uid}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[60ch] pb-6 text-[#16191D]">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
