"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader, DesktopSectionHeading } from "@/components/home/section-header";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { ServiceCard } from "@/components/home/service-card";
import {
  HOME_POPULAR_SERVICES,
  WEB_HOME_POPULAR_SERVICES,
} from "@/constants/popular-services";
import { ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

export function PopularServicesShowcase() {
  const { t } = useWebLocale();

  return (
    <section
      id="popular"
      className={cn(
        "scroll-mt-28",
        "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
        "md:py-10",
      )}
    >
      <div className="md:mx-auto md:w-full md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]">
        <SectionHeader
          title="Popular Services"
          href={ROUTES.SERVICES}
          className="md:hidden"
        />

        {/* Web: popular services heading + explore all */}
        <div className="mb-6 hidden items-end justify-between gap-6 md:flex">
          <DesktopSectionHeading
            badgeKey="popularBadge"
            titleKey="popularTitle"
            highlightKey="popularHighlight"
            align="left"
            className="mb-0"
          />
          <Link
            href={ROUTES.SERVICES}
            className="mb-1 inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-[#1865EA] focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:outline-none"
          >
            {t("popularServicesSeeAll")}
            <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
          </Link>
        </div>

        <MobileScrollRow className="md:hidden">
          {HOME_POPULAR_SERVICES.map((svc, i) => (
            <div
              key={svc.id}
              className="w-[calc((100vw-4.25rem)/2)] shrink-0 snap-start"
            >
              <ServiceCard service={svc} index={i} />
            </div>
          ))}
        </MobileScrollRow>

        <div className="hidden gap-5 md:grid md:grid-cols-4 md:gap-5 xl:gap-6">
          {WEB_HOME_POPULAR_SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} service={svc} index={i} desktop />
          ))}
        </div>
      </div>
    </section>
  );
}
