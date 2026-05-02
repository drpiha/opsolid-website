"use client";

// =============================================================================
// OnboardingClient — Faz 7.0a B0.7
//
// 3-step state machine: industry → personal → preview/publish.
//
// Linear (no skip-forward), back is allowed. Premium feel: copper accents on
// progress dots and primary CTAs, ink text, generous whitespace, simple
// opacity+slide step transitions via CSS (no framer-motion).
//
// State held in a single OnboardingState object so steps stay decoupled and
// can be swapped/reordered later. Each step receives `value`, `onChange`,
// `onNext`, `onBack` and is otherwise free to compose its own UI.
// =============================================================================

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { IndustryStep } from "./steps/IndustryStep";
import { PersonalStep } from "./steps/PersonalStep";
import { PreviewStep } from "./steps/PreviewStep";

export type OnboardingStep = "industry" | "personal" | "preview";

export interface OnboardingState {
  templateId: number | null;
  industryKey: string | null;
  name: string;
  jobTitle: string;
  phone: string;
  company: string;
  bio: string;
  photoPath: string | null;
  brandPrimaryHex: string | null;
}

interface Props {
  userId: string;
  userEmail: string;
  userName: string | null;
  userLocale: string;
}

const STEP_ORDER: OnboardingStep[] = ["industry", "personal", "preview"];

export function OnboardingClient({ userEmail, userName, userLocale }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const [step, setStep] = useState<OnboardingStep>("industry");
  const [state, setState] = useState<OnboardingState>(() => ({
    templateId: null,
    industryKey: null,
    name: userName ?? "",
    jobTitle: "",
    phone: "",
    company: "",
    bio: "",
    photoPath: null,
    brandPrimaryHex: null,
  }));

  const stepIndex = STEP_ORDER.indexOf(step);

  const updateState = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => {
      const i = STEP_ORDER.indexOf(s);
      return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => {
      const i = STEP_ORDER.indexOf(s);
      return STEP_ORDER[Math.max(i - 1, 0)];
    });
  }, []);

  const onCancel = useCallback(() => {
    router.push(`/${userLocale}/dashboard/cards`);
  }, [router, userLocale]);

  const stepLabels = useMemo(
    () => [
      { key: "industry" as const, label: t.onboarding.steps.industry },
      { key: "personal" as const, label: t.onboarding.steps.personal },
      { key: "preview" as const, label: t.onboarding.steps.preview },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-bg-0">
      {/* Top bar — minimal, single brand line */}
      <header className="border-b border-line-soft bg-bg-1/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink">
            <span className="inline-block h-2 w-2 rounded-full bg-copper" />
            OpSolid
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-ink-300 transition-colors hover:text-ink"
          >
            {t.onboarding.cancel}
          </button>
        </div>
      </header>

      {/* Progress dots */}
      <div className="mx-auto w-full max-w-[1180px] px-4 pt-8 sm:px-6 lg:px-10 lg:pt-12">
        <ol className="flex items-center gap-3" aria-label="Onboarding progress">
          {stepLabels.map((s, idx) => {
            const isActive = step === s.key;
            const isDone = idx < stepIndex;
            return (
              <li key={s.key} className="flex items-center gap-3">
                <div
                  className={[
                    "flex items-center gap-2 transition-opacity",
                    isActive || isDone ? "opacity-100" : "opacity-50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                      isActive
                        ? "border-copper bg-copper text-white shadow-[0_0_0_4px_rgba(194,121,64,0.12)]"
                        : isDone
                        ? "border-copper-300 bg-copper-50 text-copper-700"
                        : "border-line bg-bg-1 text-ink-300",
                    ].join(" ")}
                  >
                    {isDone ? "✓" : idx + 1}
                  </span>
                  <span
                    className={[
                      "hidden text-sm font-medium sm:inline",
                      isActive ? "text-ink" : "text-ink-300",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <span
                    className={[
                      "h-px w-8 transition-colors sm:w-12",
                      isDone ? "bg-copper-300" : "bg-line",
                    ].join(" ")}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Step body */}
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pt-10">
        <div key={step} className="onboarding-step-anim">
          {step === "industry" && (
            <IndustryStep
              value={state}
              onChange={updateState}
              onNext={goNext}
            />
          )}
          {step === "personal" && (
            <PersonalStep
              value={state}
              userEmail={userEmail}
              onChange={updateState}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === "preview" && (
            <PreviewStep
              value={state}
              userEmail={userEmail}
              userLocale={userLocale}
              onBack={goBack}
            />
          )}
        </div>
      </main>

      <style jsx>{`
        :global(.onboarding-step-anim) {
          animation: ob-fade-slide 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @keyframes ob-fade-slide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.onboarding-step-anim) {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
