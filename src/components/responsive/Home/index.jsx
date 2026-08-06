"use client";

import { useEffect } from "react";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { setBackFromSource } from "@/lib/navigation/back-navigation";
import { getTrendingProviders } from "@/mock/providers";

import { HomeDesktop } from "./HomeDesktop";
import { HomeMobile } from "./HomeMobile";
import { HomeTablet } from "./HomeTablet";

const TOP_RATED_CARDS = [
  { image: "/images/top-rated-elite-studio.png", categorySlug: "salon" },
  { image: "/images/top-rated-premium-spa.png", categorySlug: "salon" },
  { image: "/images/top-rated-royal-clinic.png", categorySlug: "doctor" },
  { image: "/images/top-rated-urban-salon.png", categorySlug: "salon" },
];

export function HomeResponsive() {
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
    <ResponsiveView
      mobile={<HomeMobile topRated={topRated} />}
      tablet={<HomeTablet topRated={topRated} />}
      desktop={<HomeDesktop topRated={topRated} />}
    />
  );
}

export default HomeResponsive;
