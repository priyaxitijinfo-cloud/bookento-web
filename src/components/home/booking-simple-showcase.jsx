"use client";

import { CalendarCheck2, Search, Sparkles } from "lucide-react";

import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    titleKey: "howBookStep1Title",
    bodyKey: "howBookStep1Body",
    icon: Search,
    accent: "from-[#EAF2FF] to-[#DCE9FF]",
    iconTile: "bg-[#1865EA] text-white shadow-[0_10px_20px_-10px_rgba(24,101,234,0.7)]",
    ring: "ring-[#C9DBFF]",
  },
  {
    n: "02",
    titleKey: "howBookStep2Title",
    bodyKey: "howBookStep2Body",
    icon: CalendarCheck2,
    accent: "from-[#EEFBF3] to-[#D9F5E4]",
    iconTile: "bg-[#039855] text-white shadow-[0_10px_20px_-10px_rgba(3,152,85,0.65)]",
    ring: "ring-[#C6EBD5]",
  },
  {
    n: "03",
    titleKey: "howBookStep3Title",
    bodyKey: "howBookStep3Body",
    icon: Sparkles,
    accent: "from-[#F5F0FF] to-[#E8DEFF]",
    iconTile:
      "bg-[#7A5AF8] text-white shadow-[0_10px_20px_-10px_rgba(122,90,248,0.65)]",
    ring: "ring-[#DDD0FF]",
  },
];

/**
 * Desktop-only booking flow section — redesigned card steps for Bookento.
 */
export function BookingSimpleShowcase({ className }) {
  const { t } = useWebLocale();

  return (
    <section
      id="how-booking-works"
      aria-label={t("howBookAria")}
      className={cn(
        "hidden scroll-mt-28 md:block",
        "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
        className,
      )}
    >
      <div className="relative overflow-hidden border-y border-[#E2EAF5] bg-[#F8FBFF]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(24,101,234,0.12)_0%,transparent_45%),radial-gradient(ellipse_at_90%_100%,rgba(122,90,248,0.08)_0%,transparent_40%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 right-[12%] size-40 rounded-full bg-[#58A1FF]/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[calc(96rem-60px)] px-[4.875rem] py-14 xl:px-[5.875rem] xl:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[#C9D3E2]" />
              <span className="text-[12px] font-semibold tracking-[0.22em] text-[#1865EA] uppercase">
                {t("howBookBadge")}
              </span>
              <span aria-hidden className="h-px w-10 bg-[#C9D3E2]" />
            </div>

            <h2 className="mt-4 text-[2.15rem] leading-[1.1] font-bold tracking-tight text-[#0F1B2D] lg:text-[2.5rem]">
              {t("howBookTitle1")}{" "}
              <span className="bg-[linear-gradient(105deg,#1865EA_0%,#58A1FF_100%)] bg-clip-text text-transparent">
                {t("howBookTitle2")}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[#5B6B82]">
              {t("howBookSubtitle")}
            </p>
          </div>

          <ol className="relative mt-12 grid grid-cols-3 gap-5 lg:gap-6">
            {/* Soft connector behind cards */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-[3.25rem] right-[16%] left-[16%] h-px bg-[linear-gradient(90deg,transparent_0%,#C9DBFF_12%,#C9DBFF_88%,transparent_100%)]"
            />

            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.n} className="relative">
                  <article
                    className={cn(
                      "relative h-full overflow-hidden rounded-[1.5rem] bg-white p-7",
                      "shadow-[0_16px_40px_-24px_rgba(24,101,234,0.28)] ring-1",
                      step.ring,
                    )}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-gradient-to-br opacity-90 blur-2xl",
                        step.accent,
                      )}
                    />

                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-3 right-4 text-[3.5rem] leading-none font-bold tracking-tight text-[#0F1B2D]/[0.045] select-none lg:text-[4rem]"
                    >
                      {step.n}
                    </span>

                    <div
                      className={cn(
                        "relative inline-flex size-12 items-center justify-center rounded-2xl",
                        step.iconTile,
                      )}
                    >
                      <Icon className="size-5" strokeWidth={2.2} aria-hidden />
                    </div>

                    <p className="relative mt-5 text-[11px] font-semibold tracking-[0.18em] text-[#1865EA] uppercase">
                      {t("howBookStepLabel")} {step.n.replace(/^0/, "")}
                    </p>
                    <h3 className="relative mt-2 text-[1.2rem] leading-snug font-bold tracking-tight text-[#0F1B2D] lg:text-[1.3rem]">
                      {t(step.titleKey)}
                    </h3>
                    <p className="relative mt-2.5 text-[14px] leading-relaxed text-[#5B6B82]">
                      {t(step.bodyKey)}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
