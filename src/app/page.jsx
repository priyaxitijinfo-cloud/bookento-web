"use client";

import { useEffect } from "react";

import { UserBottomNav } from "@/components/layout/user-nav";
import { AppDownloadShowcase } from "@/components/home/app-download-showcase";
import { BannerShowcase } from "@/components/home/banner-showcase";
import { CategoryGrid } from "@/components/home/category-grid";
import { DesktopTopRatedScroll } from "@/components/home/desktop-top-rated-scroll";
import { FeaturePromoBanner } from "@/components/home/feature-promo-banner";
import { FaqShowcase } from "@/components/home/faq-showcase";
import { HeroSection } from "@/components/home/hero-section";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { PopularServicesShowcase } from "@/components/home/popular-services-showcase";
import { SectionHeader, DesktopSectionHeading } from "@/components/home/section-header";
import { SpecialPackagesShowcase } from "@/components/home/special-packages-showcase";
import { TestimonialsShowcase } from "@/components/home/testimonials-showcase";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { UpcomingAppointmentCard } from "@/components/home/upcoming-appointment-card";
import { VideosShowcase } from "@/components/home/videos-showcase";
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
  { image: "/images/nearby-glow-salon.png", categorySlug: "salon" },
  { image: "/images/nearby-serene-spa.png", categorySlug: "salon" },
  { image: "/images/nearby-bright-dental.png", categorySlug: "doctor" },
  { image: "/images/nearby-fitzone-gym.png", categorySlug: "fitness" },
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

  const mobileTopRated = topRated.slice(0, 4);

  return (
    <div className={cn(PAGE_SHELL_CLASS, "max-md:overflow-x-hidden md:pb-0")}>
      <HomeHeader />

      {/* Desktop full-bleed marketplace hero */}
      <HeroSection className="hidden md:block" />

      <main
        className={cn(
          HOME_PAGE_CONTAINER,
          "relative z-10 space-y-8 pt-4 pb-4 md:mt-[100px] md:space-y-[100px] md:pt-0 md:pb-0",
        )}
      >
        <div className="md:hidden">
          <UpcomingAppointmentCard />
        </div>

        <section
          id="categories"
          className="scroll-mt-28 md:overflow-visible max-md:[&_h2]:gap-0.5"
        >
          <SectionHeader title="Category" className="md:hidden" />
          <DesktopSectionHeading
            badge="Our Services"
            title="All Your Services"
            highlight="In One Place"
          />
          <CategoryGrid />
        </section>

        <section id="offers" className="scroll-mt-28 md:hidden">
          <DesktopSectionHeading
            badge="Offers"
            title="Exclusive Deals"
            highlight="Just For You"
          />
          <BannerShowcase />
        </section>

        <section
          id="professionals"
          className={cn(
            "scroll-mt-28",
            "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
            "md:border-y md:border-[#E8EDF5] md:bg-[#F7F8FA] md:py-10",
          )}
        >
          <div className="md:mx-auto md:w-full md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]">
            <SectionHeader
              title="Top Rated Professionals"
              href={ROUTES.PROVIDERS}
              className="md:hidden"
            />

            <MobileScrollRow className="md:hidden">
              {mobileTopRated.map((p) => (
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

            <DesktopTopRatedScroll providers={topRated} />
          </div>
        </section>

        <SpecialPackagesShowcase id="packages" className="scroll-mt-28 max-md:hidden" />

        <PopularServicesShowcase />

        <SpecialPackagesShowcase className="md:hidden" />

        <VideosShowcase />

        <FeaturePromoBanner />

        <TestimonialsShowcase />

        <FaqShowcase />

        <AppDownloadShowcase />
      </main>

      <HomeFooter />

      <UserBottomNav />
    </div>
  );
}
