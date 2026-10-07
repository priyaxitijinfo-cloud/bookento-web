"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Heart, Zap } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { useRequireLoginToBook } from "@/hooks/use-require-login-to-book";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const TRUST = [
  { icon: Check, key: "promoTrustVerified", tone: "text-[#1865EA] bg-[#EAF2FF]" },
  { icon: Zap, key: "promoTrustFast", tone: "text-[#EF6820] bg-[#FFF4EB]" },
  { icon: Heart, key: "promoTrustLoved", tone: "text-[#DD2590] bg-[#FCEAF5]" },
];

/**
 * Large left hero card — same web photo treatment on mobile, compact copy.
 */
export function HeroCard({ className }) {
  const { t } = useWebLocale();
  const { getBookHref } = useRequireLoginToBook();
  const exploreHref = getBookHref(ROUTES.CATEGORIES);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] md:rounded-[1.85rem]",
        "bg-[#EAF3FF]",
        "ring-1 ring-[#E4ECF8]",
        className,
      )}
    >
      {/* HD background — all breakpoints */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/promo-hero-banner.jpg"
          alt=""
          fill
          unoptimized
          className="object-cover object-[72%_center] md:object-[70%_center]"
          sizes="(min-width: 1280px) 800px, (min-width: 768px) 60vw, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(234,243,255,0.88)_0%,rgba(234,243,255,0.72)_42%,rgba(234,243,255,0.35)_100%)] md:inset-y-0 md:left-0 md:w-[38%] md:bg-[linear-gradient(90deg,rgba(234,243,255,0.5)_0%,rgba(234,243,255,0.18)_75%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex h-full min-h-[inherit] items-center p-5 sm:p-7 md:px-6 md:py-7 lg:px-8 lg:py-8">
        <div className="w-full max-w-md text-center md:max-w-[38%] md:text-left lg:max-w-[36%]">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#5B6B82] uppercase">
            {t("promoMainEyebrow")}
          </p>

          <h3 className="mt-2.5 text-[1.55rem] leading-[1.1] font-bold tracking-tight text-[#0F1B2D] sm:text-[1.85rem] md:mt-3 md:text-[1.85rem] lg:text-[2.05rem]">
            <span className="block md:whitespace-nowrap">{t("promoMainTitle1")}</span>
            <span className="mt-1 block bg-[linear-gradient(105deg,#1865EA_0%,#7A5AF8_52%,#DD2590_100%)] bg-clip-text text-transparent md:whitespace-nowrap">
              {t("promoMainTitle2")}
            </span>
          </h3>

          <p className="mx-auto mt-2.5 max-w-[18rem] text-[13px] leading-relaxed text-[#5B6B82] md:mx-0 md:mt-3 md:text-[14px]">
            {t("promoMainBody")}
          </p>

          <Link
            href={exploreHref}
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 md:mt-5 md:py-3",
              "gradient-brand text-sm font-semibold text-white",
              "shadow-[0_12px_28px_-12px_rgba(24,101,234,0.75)]",
              "focus-visible:ring-2 focus-visible:ring-[#1865EA]/45 focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
          >
            {t("promoMainCta")}
            <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
          </Link>

          <ul className="mt-4 flex flex-wrap justify-center gap-2 md:mt-6 md:flex-col md:justify-start md:gap-2">
            {TRUST.map(({ icon: Icon, key, tone }) => (
              <li
                key={key}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-2.5 py-2",
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
      </div>
    </article>
  );
}
