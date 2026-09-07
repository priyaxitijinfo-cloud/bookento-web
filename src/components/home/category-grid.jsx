"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { HOME_CATEGORIES } from "@/constants/home-categories";
import { CategoryItem, MoreCategoryItem } from "@/components/home/category-item";
import { cn } from "@/lib/utils";

const MOBILE_CATEGORY_SLUGS = [
  "doctor",
  "salon",
  "fitness",
  "pet-care",
  "tutoring",
  "homecare",
  "automotive",
];

/** Desktop: 6 visible tiles, remaining scroll horizontally */
const DESKTOP_VISIBLE = 6;
const DESKTOP_GAP_PX = 16;

function DesktopCategoryScroll() {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-visible py-1">
      {/* Half-in / half-out edge arrows */}
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scrollByPage(-1)}
        className={cn(
          "absolute top-1/2 left-0 z-20 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8ECF2] bg-white text-[#0F1B2D]",
          "shadow-[0_8px_24px_-6px_rgba(15,23,42,0.28)] transition-all",
          "hover:border-primary/35 hover:text-primary",
          !canScrollLeft && "pointer-events-none",
        )}
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scrollByPage(1)}
        className={cn(
          "absolute top-1/2 right-0 z-20 flex size-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8ECF2] bg-white text-[#0F1B2D]",
          "shadow-[0_8px_24px_-6px_rgba(15,23,42,0.28)] transition-all",
          "hover:border-primary/35 hover:text-primary",
          !canScrollRight && "pointer-events-none",
        )}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Extra padding keeps card shadows inside the scrollport (overflow-x clips otherwise) */}
      <div
        ref={scrollerRef}
        className={cn(
          "scrollbar-hide flex overflow-x-auto overscroll-x-contain scroll-smooth",
          "snap-x snap-mandatory px-2.5 py-5",
        )}
        style={{ gap: DESKTOP_GAP_PX }}
      >
        {HOME_CATEGORIES.map((category) => (
          <div
            key={category.slug}
            className="shrink-0 snap-start"
            style={{
              width: `calc((100% - ${(DESKTOP_VISIBLE - 1) * DESKTOP_GAP_PX}px) / ${DESKTOP_VISIBLE})`,
              minWidth: `calc((100% - ${(DESKTOP_VISIBLE - 1) * DESKTOP_GAP_PX}px) / ${DESKTOP_VISIBLE})`,
            }}
          >
            <CategoryItem
              category={category}
              className={cn(
                "h-full min-h-[7.5rem] border-[3px] border-white",
                "shadow-[0_8px_20px_-4px_rgba(15,23,42,0.14),0_4px_8px_-4px_rgba(15,23,42,0.08)]",
                "hover:scale-100 hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.18),0_6px_12px_-4px_rgba(15,23,42,0.1)]",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryGrid() {
  const mobileCategories = MOBILE_CATEGORY_SLUGS.map((slug) =>
    HOME_CATEGORIES.find((category) => category.slug === slug),
  ).filter(Boolean);

  return (
    <>
      {/* Mobile — unchanged */}
      <div className="grid grid-cols-4 gap-2.5 md:hidden">
        {mobileCategories.map((category) => (
          <div key={category.slug} className="aspect-square min-w-0">
            <CategoryItem category={category} compact />
          </div>
        ))}
        <div className="aspect-square min-w-0">
          <MoreCategoryItem compact />
        </div>
      </div>

      {/* Desktop — 6 visible + half-edge arrow scroll */}
      <div className="hidden md:block">
        <DesktopCategoryScroll />
      </div>
    </>
  );
}
