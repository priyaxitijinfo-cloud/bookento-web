"use client";

import { MapPin } from "lucide-react";

import { DoctorIllustration } from "@/components/home/feature-promo/doctor-illustration";
import { HeroCard } from "@/components/home/feature-promo/hero-card";
import { SalonIllustration } from "@/components/home/feature-promo/salon-illustration";
import { ServicePromoCard } from "@/components/home/feature-promo/service-promo-card";
import { categoryListingRoute } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

/**
 * Premium multi-service marketplace promo section — vector-first, editable in code.
 */
export function FeaturePromoBanner({ className }) {
  const { t } = useWebLocale();
  const highlight = t("promoSectionHighlight");

  return (
    <section aria-label={t("promoSectionAria")} className={cn("w-full", className)}>
      {/* Intro */}
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 overflow-visible">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-[#1865EA] uppercase">
            {t("promoSectionKicker")}
          </p>
          <h2 className="mt-2 flex flex-wrap items-baseline gap-x-2 overflow-visible text-[1.85rem] leading-[1.12] font-bold tracking-tight text-[#0F1B2D] sm:text-[2.15rem] md:flex-nowrap md:items-center md:gap-x-2.5 md:leading-none lg:text-[2.45rem]">
            <span className="md:whitespace-nowrap">{t("promoSectionTitle")}</span>
            {/* Mobile: solid script color */}
            <span className="font-script text-[1.15em] font-semibold text-[#1865EA] md:hidden">
              {highlight}
            </span>
            {/* Desktop: SVG gradient — aligned to title baseline */}
            <svg
              className="font-script hidden h-[1.05em] shrink-0 overflow-visible md:block"
              style={{ width: `${Math.max(highlight.length * 0.52, 2.2)}em` }}
              viewBox={`0 0 ${Math.max(highlight.length * 34, 100)} 58`}
              role="img"
              aria-label={highlight}
              preserveAspectRatio="xMinYMid meet"
            >
              <defs>
                <linearGradient
                  id="promo-today-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#1865EA" />
                  <stop offset="40%" stopColor="#7A5AF8" />
                  <stop offset="75%" stopColor="#DD2590" />
                  <stop offset="100%" stopColor="#FF6B4A" />
                </linearGradient>
              </defs>
              <text
                x="4"
                y="46"
                fill="url(#promo-today-gradient)"
                fontFamily="var(--font-caveat), Caveat, cursive"
                fontSize="52"
                fontWeight="600"
              >
                {highlight}
              </text>
            </svg>
          </h2>
        </div>
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5B6B82]">
          <MapPin
            className="size-4 shrink-0 text-[#1865EA]"
            strokeWidth={2.2}
            aria-hidden
          />
          {t("promoSectionTagline")}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] md:gap-5">
        <HeroCard className="min-h-[22rem] lg:min-h-[26rem]" />

        <div className="flex flex-col gap-4 md:min-h-[22rem] lg:min-h-[26rem] lg:gap-5">
          <ServicePromoCard
            href={categoryListingRoute("doctor")}
            tone="doctor"
            eyebrow={t("promoDoctorEyebrow")}
            title={t("promoDoctorTitle")}
            description={t("promoDoctorBody")}
            backgroundImage="/images/promo-doctor-banner-v2.png"
            backgroundPosition="object-[78%_center]"
            illustration={
              <DoctorIllustration className="h-[95%] w-auto max-w-none translate-x-2" />
            }
          />
          <ServicePromoCard
            href={categoryListingRoute("salon")}
            tone="salon"
            eyebrow={t("promoSalonEyebrow")}
            title={t("promoSalonTitle")}
            description={t("promoSalonBody")}
            backgroundImage="/images/promo-salon-banner-v2.png"
            backgroundPosition="object-[82%_center]"
            illustration={
              <SalonIllustration className="h-[95%] w-auto max-w-none translate-x-2" />
            }
          />
        </div>
      </div>
    </section>
  );
}
