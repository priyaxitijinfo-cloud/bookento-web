"use client";

import { useEffect } from "react";

import { UserBottomNav } from "@/components/layout/user-nav";
import { BannerShowcase } from "@/components/home/banner-showcase";
import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSection } from "@/components/home/hero-section";
import { HomeHeader } from "@/components/home/home-header";
import { PopularServicesShowcase } from "@/components/home/popular-services-showcase";
import { SectionHeader, DesktopSectionHeading } from "@/components/home/section-header";
import { SpecialPackagesShowcase } from "@/components/home/special-packages-showcase";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { UpcomingAppointmentCard } from "@/components/home/upcoming-appointment-card";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { ROUTES } from "@/constants/routes.constants";
import { setBackFromSource } from "@/lib/navigation/back-navigation";
import {
  HOME_PAGE_CONTAINER,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { getTrendingProviders } from "@/mock/providers";

const TOP_RATED_CARDS = [
  { image: "/images/top-rated-elite-studio.png", categorySlug: "salon" },
  { image: "/images/top-rated-premium-spa.png", categorySlug: "salon" },
  { image: "/images/top-rated-royal-clinic.png", categorySlug: "doctor" },
  { image: "/images/top-rated-urban-salon.png", categorySlug: "salon" },
];

export default function HomePage() {
  useEffect(() => {
    setBackFromSource("home");
  }, []);

  const topRated = getTrendingProviders(10)
    .slice(0, TOP_RATED_CARDS.length)
    .map((provider, index) => ({
      ...provider,
      coverImage: TOP_RATED_CARDS[index].image,
      categorySlug: TOP_RATED_CARDS[index].categorySlug,
    }));

  return (
    <div className={cn(PAGE_SHELL_CLASS, "max-md:overflow-x-hidden md:pb-10")}>
      <HomeHeader />

      {/* Desktop full-bleed marketplace hero */}
      <HeroSection className="hidden md:block" />

      <main
        className={cn(
          HOME_PAGE_CONTAINER,
          "relative z-10 pt-4 pb-4 space-y-8 md:mt-10 md:space-y-12 md:pt-6 md:pb-6",
        )}
      >
        <div className="md:hidden">
          <UpcomingAppointmentCard />
        </div>

        <section
          id="categories"
          className="scroll-mt-28 max-md:[&_h2]:gap-0.5 md:overflow-visible"
        >
          <SectionHeader title="Category" className="md:hidden" />
          <DesktopSectionHeading
            badge="Our Services"
            title="All Your Services"
            highlight="In One Place"
          />
          <CategoryGrid />
        </section>

        <section id="offers" className="scroll-mt-28">
          <DesktopSectionHeading
            badge="Offers"
            title="Exclusive Deals"
            highlight="Just For You"
          />
          <BannerShowcase />
        </section>

        <section id="professionals" className="scroll-mt-28">
          <SectionHeader
            title="Top Rated Professionals"
            href={ROUTES.PROVIDERS}
            className="md:hidden"
          />
          <DesktopSectionHeading
            badge="Professionals"
            title="Top Rated"
            highlight="Professionals"
          />

          <MobileScrollRow className="md:hidden">
            {topRated.map((p) => (
              <div
                key={p.id}
                className="w-[calc((100vw-4.25rem)/2)] shrink-0 snap-start"
              >
                <TopRatedProviderCard
                  provider={p}
                  compact
                  categorySlug={p.categorySlug}
                />
              </div>
            ))}
          </MobileScrollRow>

          <div className="hidden gap-3 md:grid md:grid-cols-4 md:gap-4">
            {topRated.map((p) => (
              <TopRatedProviderCard
                key={p.id}
                provider={p}
                categorySlug={p.categorySlug}
              />
            ))}
          </div>
        </section>

        <PopularServicesShowcase />

        <SpecialPackagesShowcase />
      </main>
      <UserBottomNav />
    </div>
  );
}
