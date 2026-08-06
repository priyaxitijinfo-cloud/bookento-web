"use client";

import { BannerShowcase } from "@/components/home/banner-showcase";
import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSection } from "@/components/home/hero-section";
import { HomeHeader } from "@/components/home/home-header";
import { PopularServicesShowcase } from "@/components/home/popular-services-showcase";
import { SectionHeader } from "@/components/home/section-header";
import { SpecialPackagesShowcase } from "@/components/home/special-packages-showcase";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { UpcomingAppointmentCard } from "@/components/home/upcoming-appointment-card";
import { ROUTES } from "@/constants/routes.constants";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

export function HomeTablet({ topRated }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "overflow-x-hidden pb-8")}>
      <HomeHeader />
      <main className={cn(PAGE_CONTAINER_VARIANTS.wide, "space-y-10")}>
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <HeroSection />
          <UpcomingAppointmentCard />
        </div>

        <section>
          <SectionHeader title="Category" />
          <CategoryGrid />
        </section>

        <section>
          <SectionHeader title="Offers & Promotions" />
          <BannerShowcase />
        </section>

        <section>
          <SectionHeader title="Top Rated Professionals" href={ROUTES.PROVIDERS} />
          <div className="grid grid-cols-3 gap-4">
            {topRated.map((p) => (
              <TopRatedProviderCard key={p.id} provider={p} categorySlug={p.categorySlug} />
            ))}
          </div>
        </section>

        <PopularServicesShowcase />
        <SpecialPackagesShowcase />
      </main>
    </div>
  );
}
