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
            {/* Desktop: larger gradient script — extra end pad so “?” isn’t clipped by bg-clip-text */}
            <span
              className={cn(
                "font-script hidden overflow-visible font-semibold md:inline-block",
                "bg-gradient-to-r from-[#1865EA] via-[#DD2590] to-[#FF6B4A]",
                "bg-clip-text text-transparent",
                "pr-[0.28em] pb-[0.12em] text-[1.55em] leading-none lg:text-[1.65em]",
              )}
              aria-label={highlight}
            >
              {highlight}
            </span>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] md:items-stretch md:gap-5">
        <HeroCard className="min-h-[22rem] md:aspect-[806/472] md:h-auto md:min-h-0" />

        <div className="flex flex-col gap-4 md:h-full lg:gap-5">
          <ServicePromoCard
            href={categoryListingRoute("doctor")}
            tone="doctor"
            eyebrow={t("promoDoctorEyebrow")}
            title={t("promoDoctorTitle")}
            description={t("promoDoctorBody")}
            backgroundImage="/images/promo-doctor-banner-v2.png"
            backgroundPosition="object-[78%_center]"
            className="md:flex-1"
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
            backgroundImage="/images/promo-salon-banner-v5.png"
            backgroundPosition="object-[70%_center]"
            className="md:flex-1"
            illustration={
              <SalonIllustration className="h-[95%] w-auto max-w-none translate-x-2" />
            }
          />
        </div>
      </div>
    </section>
  );
}
