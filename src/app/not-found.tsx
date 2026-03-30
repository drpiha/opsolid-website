"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();
  const s = t.notFound;

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <span className="text-7xl md:text-8xl font-bold gradient-text-vibrant">404</span>
      <h1 className="mt-4 text-heading-sm font-bold text-slate-900">
        {s.title}
      </h1>
      <p className="mt-2 text-body text-slate-500 max-w-md">
        {s.description}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="gradient" size="md">
            <ArrowLeft size={16} />
            {s.backHome}
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="secondary" size="md">
            {s.contactUs}
          </Button>
        </Link>
      </div>
    </section>
  );
}
