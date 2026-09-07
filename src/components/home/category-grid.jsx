"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { HOME_CATEGORIES } from "@/constants/home-categories";
import { CategoryIcon, CategoryItem, MoreCategoryItem } from "@/components/home/category-item";
import { categoryListingRoute } from "@/constants/routes.constants";
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

/** Desktop: 6 visible tiles */
const DESKTOP_VISIBLE = 6;
const DESKTOP_GAP_PX = 14;
const LOOP_TRACKS = 3;

function getTrackWidth(scroller) {
  const child = scroller.children[HOME_CATEGORIES.length];
  if (!child) return 0;
  return child.offsetLeft - scroller.children[0].offsetLeft;
}

/** Border slightly softer than the category box color */
function getCategoryBorderColor(bgClass) {
  const match = bgClass.match(/#[0-9A-Fa-f]{6}/);
  if (!match) return "#E8ECF2";
  const hex = match[0].slice(1);
  // Mix ~40% toward white — light border that still matches the pastel
  const channel = (start) => {
    const c = parseInt(hex.slice(start, start + 2), 16);
    return Math.round(c + (255 - c) * 0.4);
  };
  const r = channel(0);
  const g = channel(2);
  const b = channel(4);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/** Desktop-only tile — light pastel box, icon hover only */
function DesktopCategoryTile({ category }) {
  return (
    <Link
      href={categoryListingRoute(category.slug)}
      className={cn(
        "group relative flex h-[8.5rem] w-full flex-col items-center justify-center gap-3.5 rounded-2xl border border-solid px-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1865EA]/35",
        category.bg,
      )}
      style={{ borderColor: getCategoryBorderColor(category.bg) }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[0.9rem] bg-white/45"
      />
      <span className="relative inline-flex transition-transform duration-200 ease-out group-hover:scale-110">
        <CategoryIcon category={category} />
      </span>
      <p className="relative w-full truncate text-center text-[13px] font-medium tracking-tight text-[#1A2332] transition-colors duration-200 group-hover:text-[#1865EA]">
        {category.name}
      </p>
    </Link>
  );
}

function ArrowButton({ label, onClick, side }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-[#E6EAF0] bg-white text-[#3D4A5C]",
        "shadow-[0_4px_14px_-4px_rgba(15,23,42,0.18)]",
        "transition-colors duration-200",
        "hover:border-[#1865EA]/30 hover:text-[#1865EA]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1865EA]/30",
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
      )}
    >
      {side === "left" ? (
        <ChevronLeft className="size-4" strokeWidth={2.25} />
      ) : (
        <ChevronRight className="size-4" strokeWidth={2.25} />
      )}
    </button>
  );
}

function DesktopCategoryScroll() {
  const scrollerRef = useRef(null);
  const jumpingRef = useRef(false);
  const settleTimerRef = useRef(null);
  const readyRef = useRef(false);

  const loopItems = Array.from({ length: LOOP_TRACKS }, (_, track) =>
    HOME_CATEGORIES.map((category) => ({ category, track })),
  ).flat();

  const normalizeLoop = () => {
    const el = scrollerRef.current;
    if (!el || jumpingRef.current || !readyRef.current) return;

    const trackWidth = getTrackWidth(el);
    if (trackWidth <= 0) return;

    if (el.scrollLeft >= trackWidth * 2) {
      jumpingRef.current = true;
      el.scrollLeft -= trackWidth;
      jumpingRef.current = false;
    } else if (el.scrollLeft < trackWidth) {
      jumpingRef.current = true;
      el.scrollLeft += trackWidth;
      jumpingRef.current = false;
    }
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const placeInMiddle = () => {
      const trackWidth = getTrackWidth(el);
      if (trackWidth <= 0) return;
      jumpingRef.current = true;
      el.scrollLeft = trackWidth;
      jumpingRef.current = false;
      readyRef.current = true;
    };

    const raf = requestAnimationFrame(placeInMiddle);

    const scheduleNormalize = () => {
      if (jumpingRef.current || !readyRef.current) return;
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(normalizeLoop, 150);
    };

    const onResize = () => {
      readyRef.current = false;
      placeInMiddle();
    };

    el.addEventListener("scroll", scheduleNormalize, { passive: true });
    el.addEventListener("scrollend", normalizeLoop);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimerRef.current);
      el.removeEventListener("scroll", scheduleNormalize);
      el.removeEventListener("scrollend", normalizeLoop);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;

    const trackWidth = getTrackWidth(el);
    if (trackWidth <= 0) return;

    clearTimeout(settleTimerRef.current);
    jumpingRef.current = true;

    const amount = el.clientWidth * 0.82 * direction;
    let from = el.scrollLeft;

    if (direction > 0 && from + amount >= trackWidth * 2) {
      from -= trackWidth;
      el.scrollLeft = from;
    } else if (direction < 0 && from + amount < trackWidth) {
      from += trackWidth;
      el.scrollLeft = from;
    }

    requestAnimationFrame(() => {
      jumpingRef.current = false;
      el.scrollTo({ left: from + amount, behavior: "smooth" });
    });
  };

  const tileWidth = `calc((100% - ${(DESKTOP_VISIBLE - 1) * DESKTOP_GAP_PX}px) / ${DESKTOP_VISIBLE})`;

  return (
    <div className="relative">
      {/* Soft edge fades — depth without clipping card shadows awkwardly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-2 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-2 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent"
      />

      <ArrowButton
        label="Previous categories"
        side="left"
        onClick={() => scrollByPage(-1)}
      />
      <ArrowButton
        label="Next categories"
        side="right"
        onClick={() => scrollByPage(1)}
      />

      <div
        ref={scrollerRef}
        className="scrollbar-hide flex overflow-x-auto overscroll-x-contain px-1 py-3"
        style={{ gap: DESKTOP_GAP_PX }}
      >
        {loopItems.map(({ category, track }) => (
          <div
            key={`${track}-${category.slug}`}
            className="shrink-0"
            style={{ width: tileWidth, minWidth: tileWidth }}
          >
            <DesktopCategoryTile category={category} />
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

      <div className="hidden md:block">
        <DesktopCategoryScroll />
      </div>
    </>
  );
}
