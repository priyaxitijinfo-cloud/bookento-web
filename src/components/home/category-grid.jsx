"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { HOME_CATEGORIES } from "@/constants/home-categories";
import { CategoryItem, MoreCategoryItem } from "@/components/home/category-item";
import { categoryListingRoute } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
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
const DESKTOP_GAP_PX = 18;
const LOOP_TRACKS = 3;
const DESKTOP_ICON_SIZE_PX = 36;

const CATEGORY_NAME_KEYS = {
  doctor: "catDoctor",
  salon: "catSalon",
  fitness: "catFitness",
  tutoring: "catTutoring",
  "pet-care": "catPetCare",
  homecare: "catHomecare",
  "kids-care": "catKidsCare",
  plumbing: "catPlumbing",
  automotive: "catAutomotive",
  gardening: "catGardening",
  cooking: "catCooking",
  events: "catEvents",
  carpenter: "catCarpenter",
  renovation: "catRenovation",
  shooting: "catShooting",
};

const CATEGORY_DESC_KEYS = {
  doctor: "catDescDoctor",
  salon: "catDescSalon",
  fitness: "catDescFitness",
  tutoring: "catDescTutoring",
  "pet-care": "catDescPetCare",
  homecare: "catDescHomecare",
  "kids-care": "catDescKidsCare",
  plumbing: "catDescPlumbing",
  automotive: "catDescAutomotive",
  gardening: "catDescGardening",
  cooking: "catDescCooking",
  events: "catDescEvents",
  carpenter: "catDescCarpenter",
  renovation: "catDescRenovation",
  shooting: "catDescShooting",
};

/** Desktop-only unique hues — no adjacent / duplicate card colors */
const DESKTOP_CATEGORY_COLORS = {
  doctor: "#37B8FF",
  salon: "#FF4766",
  fitness: "#5EB12D",
  tutoring: "#FFAF2A",
  "pet-care": "#6357FF",
  homecare: "#E046FF",
  "kids-care": "#FF37B8",
  plumbing: "#C47A1A",
  automotive: "#3B82F6",
  gardening: "#10B981",
  cooking: "#0EA5E9",
  events: "#14B8A6",
  carpenter: "#A16207",
  renovation: "#F97316",
  shooting: "#D946EF",
};

function getDesktopCategoryIconSrc(slug) {
  return `/icons/categories/${slug}.svg`;
}

function getTrackWidth(scroller) {
  const child = scroller.children[HOME_CATEGORIES.length];
  if (!child) return 0;
  return child.offsetLeft - scroller.children[0].offsetLeft;
}

function shadeHex(hex, amount) {
  const raw = hex.replace("#", "");
  const channel = (start) => parseInt(raw.slice(start, start + 2), 16);
  const r = Math.round(channel(0) * (1 - amount));
  const g = Math.round(channel(2) * (1 - amount));
  const b = Math.round(channel(4) * (1 - amount));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function lightenHex(hex, mix = 0.88) {
  const raw = hex.replace("#", "");
  const channel = (start) => parseInt(raw.slice(start, start + 2), 16);
  const blend = (c) => Math.round(c + (255 - c) * mix);
  return `#${[blend(channel(0)), blend(channel(2)), blend(channel(4))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

function CategoryIconMask({ slug, size, className, style }) {
  const iconSrc = getDesktopCategoryIconSrc(slug);
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0", className)}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${iconSrc})`,
        maskImage: `url(${iconSrc})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
    />
  );
}

/** Desktop-only — pastel service card matching reference */
function DesktopCategoryTile({ category }) {
  const { t } = useWebLocale();
  const accent = DESKTOP_CATEGORY_COLORS[category.slug] || category.iconTile;
  const cardBg = lightenHex(accent, 0.95);
  const arrowBg = lightenHex(accent, 0.88);
  const arrowColor = shadeHex(accent, 0.05);
  const nameKey = CATEGORY_NAME_KEYS[category.slug];
  const descKey = CATEGORY_DESC_KEYS[category.slug];
  const label = nameKey ? t(nameKey) : category.name;
  const description = descKey ? t(descKey) : "";

  return (
    <Link
      href={categoryListingRoute(category.slug)}
      className={cn(
        "group relative flex h-[calc(14.5rem-10px)] w-full flex-col overflow-hidden rounded-[1.35rem] border-[3px] border-white p-5 pb-14",
        "shadow-[0_10px_24px_-8px_rgba(15,23,42,0.14)]",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/35 focus-visible:outline-none",
      )}
      style={{ backgroundColor: cardBg }}
    >
      <span
        className="relative z-10 flex aspect-square size-14 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: accent }}
      >
        <CategoryIconMask
          slug={category.slug}
          size={DESKTOP_ICON_SIZE_PX}
          className="bg-white"
        />
      </span>

      <h3 className="relative z-10 mt-3 text-[1.05rem] leading-snug font-bold tracking-tight text-[#0F1B2D]">
        {label}
      </h3>

      {description ? (
        <p className="relative z-10 mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-[#6B7A8D]">
          {description}
        </p>
      ) : null}

      <span
        className="absolute bottom-4 left-5 z-10 inline-flex aspect-square size-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: arrowBg, color: arrowColor }}
        aria-hidden
      >
        <ArrowRight className="size-4" strokeWidth={2.4} />
      </span>

      {/* Faint watermark icon */}
      <CategoryIconMask
        slug={category.slug}
        size={72}
        className="pointer-events-none absolute -right-1 -bottom-1 opacity-[0.04]"
        style={{ backgroundColor: accent }}
      />
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
        "absolute top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-[#E6EAF0] bg-white text-[#3D4A5C]",
        "shadow-[0_6px_18px_-4px_rgba(15,23,42,0.16)]",
        "transition-colors duration-200",
        "hover:border-[#1865EA]/30 hover:text-[#1865EA]",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/30 focus-visible:outline-none",
        side === "left" ? "left-0" : "right-0",
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
    <div className="relative overflow-visible px-5">
      {/* Soft edge fades — keep arrows clear of card text */}
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-5 left-0 z-10 w-12 bg-gradient-to-r to-transparent"
      />
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-5 right-0 z-10 w-12 bg-gradient-to-l to-transparent"
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
        className="scrollbar-hide flex overflow-x-auto overscroll-x-contain px-1 py-7"
        style={{ gap: DESKTOP_GAP_PX }}
      >
        {loopItems.map(({ category, track }) => (
          <div
            key={`${track}-${category.slug}`}
            className="shrink-0 py-1"
            style={{ width: tileWidth, minWidth: tileWidth }}
          >
            <DesktopCategoryTile category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopCategoriesShowcase() {
  return (
    <div className="relative hidden md:block">
      {/* Soft atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 h-56 w-[70%] -translate-x-1/2 rounded-full bg-[#EAF1FF]/55 blur-3xl"
      />

      <DesktopCategoryScroll />
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

      <DesktopCategoriesShowcase />
    </>
  );
}
