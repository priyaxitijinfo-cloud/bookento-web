"use client";

import { UserBottomNav } from "@/components/layout/user-nav";
import { BannerShowcase } from "@/components/home/banner-showcase";
import { CategoryGrid } from "@/components/home/category-grid";
import { HomeHeader } from "@/components/home/home-header";
import { PopularServicesShowcase } from "@/components/home/popular-services-showcase";
import { SectionHeader } from "@/components/home/section-header";
import { SpecialPackagesShowcase } from "@/components/home/special-packages-showcase";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { UpcomingAppointmentCard } from "@/components/home/upcoming-appointment-card";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { ROUTES } from "@/constants/routes.constants";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

export function HomeMobile({ topRated }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "overflow-x-hidden")}>
      <HomeHeader />
      <main className={cn(PAGE_CONTAINER_VARIANTS.wide, "space-y-8")}>
        <UpcomingAppointmentCard />

        <section>
          <SectionHeader title="Category" />
          <CategoryGrid />
        </section>

        <section>
          <BannerShowcase />
        </section>

        <section>
          <SectionHeader title="Top Rated Professionals" href={ROUTES.PROVIDERS} />
          <MobileScrollRow>
            {topRated.map((p) => (
              <div key={p.id} className="w-[calc((100vw-4.25rem)/2)] shrink-0 snap-start">
                <TopRatedProviderCard provider={p} compact categorySlug={p.categorySlug} />
              </div>
            ))}
          </MobileScrollRow>
        </section>

        <PopularServicesShowcase />
        <SpecialPackagesShowcase />
      </main>
      <UserBottomNav />
    </div>
  );
}
