"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { providerPackageRoute, ROUTES } from "@/constants/routes.constants";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { getFeaturedPackages } from "@/mock/packages";
import { cn } from "@/lib/utils";

const PROMO_TITLE_SIZE = "text-[0.9375rem]";

const FEATURED_PACKAGES = getFeaturedPackages(4);

const PROMO_CARDS = [
  {
    href: FEATURED_PACKAGES[0]
      ? providerPackageRoute(FEATURED_PACKAGES[0].providerId, FEATURED_PACKAGES[0].id)
      : ROUTES.PROVIDERS,
    badge: "Hot Deal",
    badgeClass: "text-rose-500",
    title: "Summer Special",
    titleLines: ["Summer Special", "Up to 40% OFF"],
    offer: null,
    description: "On all spa services",
    titleClass: "text-[#881337]",
    descClass: "text-[#9D174D]/70",
    arrowClass: "text-[#881337]",
    gradient: "from-[#FDF2F8] to-[#FCE7F3]",
    fadeFrom: "#FDF2F8",
    image: "/images/promo-summer-spa.png",
    imageClass: "object-cover object-center",
    hideImageFade: true,
    fullImage: true,
  },
  {
    href: FEATURED_PACKAGES[1]
      ? providerPackageRoute(FEATURED_PACKAGES[1].providerId, FEATURED_PACKAGES[1].id)
      : ROUTES.PROVIDERS,
    badge: "New",
    badgeClass: "text-blue-600",
    title: "New Providers Near You",
    titleLines: ["New Providers", "Near You"],
    offer: null,
    description: "Check out latest",
    descriptionLines: ["Check out latest"],
    descSize: "text-[11px]",
    titleClass: "text-[#1E3A8A]",
    descClass: "text-[#1E40AF]/65",
    arrowClass: "text-blue-600",
    gradient: "from-[#EFF6FF] to-[#DBEAFE]",
    fadeFrom: "#EFF6FF",
    image: "/images/promo-new-providers.png",
    imageClass: "object-cover object-center",
    hideImageFade: true,
    fullImage: true,
  },
  {
    href: FEATURED_PACKAGES[2]
      ? providerPackageRoute(FEATURED_PACKAGES[2].providerId, FEATURED_PACKAGES[2].id)
      : ROUTES.BOOKING,
    badge: "Limited Time",
    badgeClass: "text-emerald-600",
    title: "Book Now & Save 30%",
    titleLines: ["Book Now &", "Save 30%"],
    offer: null,
    description: "On selected services",
    titleClass: "text-[#065F46]",
    descClass: "text-[#047857]/65",
    arrowClass: "text-emerald-600",
    gradient: "from-[#ECFDF5] to-[#D1FAE5]",
    fadeFrom: "#ECFDF5",
    image: "/images/promo-limited-time.png",
    imageClass: "object-cover object-center",
    hideImageFade: true,
    fullImage: true,
  },
  {
    href: FEATURED_PACKAGES[3]
      ? providerPackageRoute(FEATURED_PACKAGES[3].providerId, FEATURED_PACKAGES[3].id)
      : ROUTES.PROVIDERS,
    badge: "Premium",
    badgeClass: "text-violet-600",
    title: "Premium Spa Packages",
    titleLines: ["Premium Spa", "Packages"],
    offer: null,
    description: "Relax & Rejuvenate",
    titleClass: "text-[#5B21B6]",
    descClass: "text-[#6D28D9]/65",
    arrowClass: "text-violet-600",
    gradient: "from-[#F5F3FF] to-[#EDE9FE]",
    fadeFrom: "#F5F3FF",
    image: "/images/promo-premium-spa.png",
    imageClass: "object-cover object-center",
    hideImageFade: true,
    fullImage: true,
  },
];

function PromoCard({ promo, className }) {
  const isFullImage = promo.fullImage;

  return (
    <Link
      href={promo.href}
      className={cn(
        "group relative flex h-[10rem] overflow-hidden rounded-xl sm:h-[10.5rem]",
        "shadow-card",
        "transition-shadow duration-300 ease-out",
        "hover:shadow-[0_14px_36px_-10px_rgba(15,23,42,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        !isFullImage && cn("bg-gradient-to-br", promo.gradient),
        className,
      )}
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col p-4">
        <span
          className={cn(
            "bg-card w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm",
            promo.badgeClass,
          )}
        >
          {promo.badge}
        </span>

        <div className="mt-2 min-w-0 pr-2">
          <h3
            className={cn(
              "line-clamp-2 leading-snug font-bold",
              PROMO_TITLE_SIZE,
              promo.titleClass,
            )}
          >
            {promo.titleLines ? (
              <>
                {promo.titleLines[0]}
                <br />
                {promo.titleLines[1]}
              </>
            ) : (
              promo.title
            )}
          </h3>
          {promo.offer && (
            <p className={cn("mt-0.5 text-sm font-bold", promo.titleClass)}>{promo.offer}</p>
          )}
          <p
            className={cn(
              "mt-0.5 line-clamp-2 leading-snug",
              promo.descSize ?? "text-[11px]",
              promo.descClass,
            )}
          >
            {promo.descriptionLines ? (
              <>
                {promo.descriptionLines[0]}
                <br />
                {promo.descriptionLines[1]}
              </>
            ) : (
              promo.description
            )}
          </p>
        </div>

        <span className="bg-card mt-auto flex size-8 items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-out group-hover:scale-105">
          <ArrowRight
            className={cn(
              "size-4 transition-transform duration-300 group-hover:translate-x-0.5",
              promo.arrowClass,
            )}
          />
        </span>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute",
          isFullImage ? "inset-0" : "top-0 right-0 h-full w-[46%]",
        )}
      >
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className={cn("object-cover object-center", promo.imageClass)}
          sizes={isFullImage ? "(max-width: 768px) 100vw, 25vw" : "(max-width: 768px) 40vw, 180px"}
        />
        {!promo.hideImageFade && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, ${promo.fadeFrom} 0%, ${promo.fadeFrom}99 40%, transparent 100%)`,
            }}
          />
        )}
      </div>
    </Link>
  );
}

function PromoCarouselDot({ active }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 rounded-full transition-all duration-300",
        active
          ? "size-2.5 bg-primary shadow-[0_0_0_3px_#B8D4FF]"
          : "size-2 bg-[#C8DAF5]",
      )}
    />
  );
}

function PromoMobileCarousel() {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const slide = container.querySelector("[data-promo-slide]");
      if (!slide) return;

      const gap = 12;
      const index = Math.round(container.scrollLeft / (slide.offsetWidth + gap));
      setActive(Math.min(Math.max(index, 0), PROMO_CARDS.length - 1));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <MobileScrollRow containerRef={scrollRef}>
        {PROMO_CARDS.map((promo) => (
          <div
            key={promo.title}
            data-promo-slide
            className="w-[calc(100vw-4.25rem)] shrink-0 snap-start"
          >
            <PromoCard
              promo={promo}
              className="h-[10.5rem] w-full rounded-2xl border border-black/[0.06] shadow-none"
            />
          </div>
        ))}
      </MobileScrollRow>

      <div className="mt-3 flex items-center justify-center gap-2.5" role="tablist" aria-label="Promotion slides">
        {PROMO_CARDS.map((promo, index) => (
          <PromoCarouselDot key={promo.title} active={active === index} />
        ))}
      </div>
    </div>
  );
}

export function BannerShowcase() {
  return (
    <>
      <div className="md:hidden">
        <PromoMobileCarousel />
      </div>

      <div className="hidden grid-cols-2 gap-3 md:grid md:grid-cols-4 md:gap-4">
        {PROMO_CARDS.map((promo) => (
          <PromoCard key={promo.title} promo={promo} />
        ))}
      </div>
    </>
  );
}
