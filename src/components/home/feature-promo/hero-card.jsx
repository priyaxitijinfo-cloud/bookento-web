"use client";

import Link from "next/link";
import { ArrowRight, Check, Heart, Zap } from "lucide-react";

import { ServiceIllustration } from "@/components/home/feature-promo/service-illustration";
import { ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const TRUST = [
  { icon: Check, key: "promoTrustVerified", tone: "text-[#1865EA] bg-[#EAF2FF]" },
  { icon: Zap, key: "promoTrustFast", tone: "text-[#EF6820] bg-[#FFF4EB]" },
  { icon: Heart, key: "promoTrustLoved", tone: "text-[#DD2590] bg-[#FCEAF5]" },
];

/**
 * Large left hero card — vector illustration + copy + CTA.
 */
export function HeroCard({ className }) {
  const { t } = useWebLocale();

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.85rem]",
        "bg-[linear-gradient(135deg,#EEF5FF_0%,#F3ECFF_42%,#FFF0F6_78%,#FFFFFF_100%)]",
        "shadow-[0_18px_40px_-24px_rgba(24,101,234,0.35)]",
        "ring-1 ring-[#E4ECF8]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-10 size-56 rounded-full bg-[#BFD9FF]/35 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-0 size-48 rounded-full bg-[#F5C6FF]/25 blur-3xl"
      />

      <div className="relative z-10 grid h-full items-center gap-6 p-7 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-4 lg:p-10">
        <div className="max-w-md">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#5B6B82] uppercase">
            {t("promoMainEyebrow")}
          </p>

          <h3 className="mt-4 text-[2rem] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] sm:text-[2.25rem] lg:text-[2.55rem]">
            <span className="block">{t("promoMainTitle1")}</span>
            <span className="mt-1 block bg-[linear-gradient(105deg,#1865EA_0%,#7A5AF8_52%,#DD2590_100%)] bg-clip-text text-transparent">
              {t("promoMainTitle2")}
            </span>
          </h3>

          <p className="mt-4 max-w-[22rem] text-[14px] leading-relaxed text-[#5B6B82] sm:text-[15px]">
            {t("promoMainBody")}
          </p>

          <Link
            href={ROUTES.CATEGORIES}
            className={cn(
              "mt-7 inline-flex items-center gap-2.5 rounded-full px-5 py-3.5",
              "gradient-brand text-sm font-semibold text-white",
              "shadow-[0_12px_28px_-12px_rgba(24,101,234,0.75)]",
              "focus-visible:ring-2 focus-visible:ring-[#1865EA]/45 focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
          >
            {t("promoMainCta")}
            <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
          </Link>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {TRUST.map(({ icon: Icon, key, tone }) => (
              <li
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 text-[11px] font-semibold text-[#314158] ring-1 ring-[#E8EEF7]"
              >
                <span
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded-full",
                    tone,
                  )}
                >
                  <Icon className="size-3" strokeWidth={2.6} aria-hidden />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <ServiceIllustration className="mx-auto min-h-[14rem] w-full max-w-sm sm:min-h-[16rem] lg:mx-0 lg:min-h-[20rem] lg:max-w-none" />
      </div>
    </article>
  );
}
