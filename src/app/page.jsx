"use client";

import { useEffect } from "react";

import { AppDownloadShowcase } from "@/components/home/app-download-showcase";
import { BannerShowcase } from "@/components/home/banner-showcase";
import { CategoryGrid } from "@/components/home/category-grid";
import { DesktopTopRatedScroll } from "@/components/home/desktop-top-rated-scroll";
import { FeaturePromoBanner } from "@/components/home/feature-promo-banner";
import { FeaturesShowcase } from "@/components/home/features-showcase";
import { FaqShowcase } from "@/components/home/faq-showcase";
import { HeroSection } from "@/components/home/hero-section";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { PopularServicesShowcase } from "@/components/home/popular-services-showcase";
import { OnlineConsultationsBanner } from "@/components/home/online-consultations-banner";
import { DesktopSectionHeading } from "@/components/home/section-header";
import { SpecialPackagesShowcase } from "@/components/home/special-packages-showcase";
import { TestimonialsShowcase } from "@/components/home/testimonials-showcase";
import { VideosShowcase } from "@/components/home/videos-showcase";
import { setBackFromSource } from "@/lib/navigation/back-navigation";
import {
  HOME_PAGE_CONTAINER,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { getTrendingProviders } from "@/mock/providers";
import { getServicesByProvider } from "@/mock/services";

const TOP_RATED_CARDS = [
  {
    image: "/images/top-rated-elite-studio.png",
    categorySlug: "salon",
    description:
      "Signature cuts and styling with senior stylists — transparent pricing and easy reschedule.",
  },
  {
    image: "/images/top-rated-premium-spa.png",
    categorySlug: "salon",
    description:
      "Full-body spa rituals and massage therapies designed for deep recovery and calm.",
  },
  {
    image: "/images/top-rated-royal-clinic.png",
    categorySlug: "doctor",
    description:
      "Trusted clinic care with clear slots, verified doctors, and patient-first reviews.",
  },
  {
    image: "/images/top-rated-urban-salon.png",
    categorySlug: "salon",
    description:
      "Colour, grooming, and blowouts in a modern studio — book the look you want nearby.",
  },
  {
    image: "/images/nearby-glow-salon.png",
    categorySlug: "salon",
    description:
      "Glow-ups, facials, and finishing touches from highly rated beauty professionals.",
  },
  {
    image: "/images/nearby-serene-spa.png",
    categorySlug: "salon",
    description:
      "Quiet spa suites with curated therapies — perfect for weekday resets and weekends.",
  },
  {
    image: "/images/nearby-bright-dental.png",
    categorySlug: "doctor",
    description:
      "Gentle dental cleaning and check-ups with clear plans and same-week availability.",
  },
  {
    image: "/images/nearby-fitzone-gym.png",
    categorySlug: "fitness",
    description:
      "Personal training and strength coaching — home or studio sessions that fit your week.",
  },
];

export default function HomePage() {
  useEffect(() => {
    setBackFromSource("home");
  }, []);

  const topRated = getTrendingProviders(10)
    .slice(0, TOP_RATED_CARDS.length)
    .map((provider, index) => {
      const card = TOP_RATED_CARDS[index];
      const primaryService = getServicesByProvider(provider.id)[0];
      return {
        ...provider,
        coverImage: card.image,
        categorySlug: card.categorySlug,
        description: card.description || provider.description,
        appointmentDuration: primaryService?.duration ?? 20 + (index % 4) * 10,
      };
    });

  return (
    <div className={cn(PAGE_SHELL_CLASS, "!pb-0 max-md:overflow-x-hidden")}>
      <HomeHeader marketplace />

      <HeroSection />

      <main
        className={cn(
          HOME_PAGE_CONTAINER,
          "relative z-10 space-y-10 pt-8 pb-8 md:mt-[50px] md:space-y-[50px] md:pt-0 md:pb-0",
        )}
      >
        <section id="categories" className="scroll-mt-28 md:overflow-visible">
          <DesktopSectionHeading
            badgeKey="servicesBadge"
            titleKey="servicesTitle"
            highlightKey="servicesHighlight"
            className="mb-3"
          />
          <CategoryGrid web />
        </section>

        <OnlineConsultationsBanner />

        <section id="offers" className="scroll-mt-28">
          <DesktopSectionHeading
            badge="Offers"
            title="Exclusive Deals"
            highlight="Just For You"
          />
          <BannerShowcase web />
        </section>

        <section
          id="professionals"
          className={cn(
            "scroll-mt-28",
            "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
            "overflow-visible border-y border-[#E2EAF5] py-8 md:py-10",
            "bg-[radial-gradient(120%_80%_at_50%_-10%,#E8F1FF_0%,#F5F8FC_45%,#EEF3F9_100%)]",
          )}
        >
          <div className="mx-auto w-full max-w-[calc(96rem-60px)] px-4 md:px-[4.875rem] xl:px-[5.875rem]">
            <DesktopTopRatedScroll providers={topRated} />
          </div>
        </section>

        <SpecialPackagesShowcase id="packages" className="scroll-mt-28" web />

        <PopularServicesShowcase web />

        <VideosShowcase />

        <FeaturePromoBanner className="hidden md:block" />

        <FeaturesShowcase />

        <TestimonialsShowcase />

        <FaqShowcase />

        <AppDownloadShowcase />
      </main>

      <HomeFooter />
    </div>
  );
}
