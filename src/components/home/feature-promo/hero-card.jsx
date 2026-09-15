"use client";

import Image from "next/image";
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
 * Large left hero card — HD photo background on web, vector on mobile.
 */
export function HeroCard({ className }) {
  const { t } = useWebLocale();

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.85rem]",
        "bg-[#EAF3FF]",
        "ring-1 ring-[#E4ECF8]",
        className,
      )}
    >
      {/* Web-only HD background */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        <Image
          src="/images/promo-hero-banner.jpg"
          alt=""
          fill
          unoptimized
          className="object-cover object-[70%_center]"
          sizes="(min-width: 1280px) 800px, (min-width: 768px) 60vw, 0px"
          priority
        />
        <div className="absolute inset-y-0 left-0 w-[38%] bg-[linear-gradient(90deg,rgba(234,243,255,0.5)_0%,rgba(234,243,255,0.18)_75%,transparent_100%)]" />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-10 size-56 rounded-full bg-[#BFD9FF]/35 blur-3xl md:hidden"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-0 size-48 rounded-full bg-[#F5C6FF]/25 blur-3xl md:hidden"
      />

      <div className="relative z-10 flex h-full min-h-[inherit] items-center p-7 sm:p-8 md:px-6 md:py-7 lg:px-8 lg:py-8">
        <div className="w-full max-w-md md:max-w-[38%] lg:max-w-[36%]">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#5B6B82] uppercase">
            {t("promoMainEyebrow")}
          </p>

          <h3 className="mt-3 text-[1.85rem] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] sm:text-[2.1rem] md:text-[1.85rem] lg:text-[2.05rem]">
            <span className="block md:whitespace-nowrap">{t("promoMainTitle1")}</span>
            <span className="mt-1 block bg-[linear-gradient(105deg,#1865EA_0%,#7A5AF8_52%,#DD2590_100%)] bg-clip-text text-transparent md:whitespace-nowrap">
              {t("promoMainTitle2")}
            </span>
          </h3>

          <p className="mt-3 max-w-[18rem] text-[13.5px] leading-relaxed text-[#5B6B82] sm:text-[14px]">
            {t("promoMainBody")}
          </p>

          <Link
            href={ROUTES.CATEGORIES}
            className={cn(
              "mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3",
              "gradient-brand text-sm font-semibold text-white",
              "shadow-[0_12px_28px_-12px_rgba(24,101,234,0.75)]",
              "focus-visible:ring-2 focus-visible:ring-[#1865EA]/45 focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
          >
            {t("promoMainCta")}
            <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
          </Link>

          {/* 3 trust chips — full-width rows so text doesn’t overflow */}
          <ul className="mt-5 flex flex-wrap gap-2 md:mt-6 md:flex md:flex-col md:gap-2">
            {TRUST.map(({ icon: Icon, key, tone }) => (
              <li
                key={key}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-2 py-2",
                  "text-[10px] leading-tight font-semibold text-[#314158] ring-1 ring-[#E8EEF7]",
                  "md:w-full md:gap-2.5 md:rounded-2xl md:px-3 md:py-2.5 md:text-[12px] md:leading-snug",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded-full md:size-6",
                    tone,
                  )}
                >
                  <Icon className="size-3 md:size-3.5" strokeWidth={2.6} aria-hidden />
                </span>
                <span className="min-w-0">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <ServiceIllustration className="mx-auto mt-4 min-h-[14rem] w-full max-w-sm sm:min-h-[16rem] md:hidden" />
      </div>
    </article>
  );
}
