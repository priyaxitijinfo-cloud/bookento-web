"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import {
  HOME_CATEGORIES,
  HOME_CATEGORY_ACCENTS,
  lightenHex,
  shadeHex,
} from "@/constants/home-categories";
import { CategoryItem, MoreCategoryItem } from "@/components/home/category-item";
import { categoryListingRoute } from "@/constants/routes.constants";
import { useRequireLoginToBook } from "@/hooks/use-require-login-to-book";
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

/** Desktop: 6 visible tiles; mobile website: 2 visible, advance by 2 */
const DESKTOP_VISIBLE = 6;
const MOBILE_VISIBLE = 2;
const DESKTOP_GAP_PX = 18;
const MOBILE_GAP_PX = 12;
const LOOP_TRACKS = 3;
const DESKTOP_ICON_SIZE_PX = 36;
const MOBILE_PAGE_HOLD_MS = 2800;

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
const DESKTOP_CATEGORY_COLORS = HOME_CATEGORY_ACCENTS;

function getDesktopCategoryIconSrc(slug) {
  return `/icons/categories/${slug}.svg`;
}

function getTrackWidth(scroller) {
  const child = scroller.children[HOME_CATEGORIES.length];
  if (!child) return 0;
  return child.offsetLeft - scroller.children[0].offsetLeft;
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

/** Website pastel service card — compact on mobile, full on desktop */
function DesktopCategoryTile({ category }) {
  const { t } = useWebLocale();
  const { getBookHref } = useRequireLoginToBook();
  const accent = DESKTOP_CATEGORY_COLORS[category.slug] || category.iconTile;
  const cardBg = lightenHex(accent, 0.95);
  const arrowBg = lightenHex(accent, 0.88);
  const arrowColor = shadeHex(accent, 0.05);
  const nameKey = CATEGORY_NAME_KEYS[category.slug];
  const descKey = CATEGORY_DESC_KEYS[category.slug];
  const label = nameKey ? t(nameKey) : category.name;
  const description = descKey ? t(descKey) : "";
  const href = getBookHref(categoryListingRoute(category.slug));

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden border-[3px] border-white",
        "h-[13.25rem] rounded-[1.25rem] p-4 pb-12 md:h-[calc(14.5rem-10px)] md:rounded-[1.35rem] md:p-5 md:pb-14",
        "shadow-[0_6px_14px_-6px_rgba(15,23,42,0.12)]",
        "md:shadow-[0_10px_24px_-8px_rgba(15,23,42,0.14)]",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/35 focus-visible:outline-none",
      )}
      style={{ backgroundColor: cardBg }}
    >
      <span
        className="relative z-10 flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105 md:size-14"
        style={{ backgroundColor: accent }}
      >
        <CategoryIconMask
          slug={category.slug}
          size={DESKTOP_ICON_SIZE_PX}
          className="scale-90 bg-white md:scale-100"
        />
      </span>

      <h3 className="relative z-10 mt-2.5 text-[1rem] leading-snug font-bold tracking-tight text-[#0F1B2D] md:mt-3 md:text-[1.05rem]">
        {label}
      </h3>

      {description ? (
        <p className="relative z-10 mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#6B7A8D] md:mt-1.5 md:line-clamp-3">
          {description}
        </p>
      ) : null}

      <span
        className="absolute bottom-3.5 left-4 z-10 inline-flex aspect-square size-8 shrink-0 items-center justify-center rounded-full md:bottom-4 md:left-5 md:size-9"
        style={{ backgroundColor: arrowBg, color: arrowColor }}
        aria-hidden
      >
        <ArrowRight className="size-3.5 md:size-4" strokeWidth={2.4} />
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

/** Mobile website: horizontal scroll — 2 cards visible, next 2 on scroll */
function MobileCategoryPager() {
  const scrollerRef = useRef(null);
  const holdingRef = useRef(false);
  const inViewRef = useRef(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const pageWidth = () => {
      const first = el.children[0];
      const third = el.children[MOBILE_VISIBLE];
      if (first && third) return third.offsetLeft - first.offsetLeft;
      if (first) return first.offsetWidth + MOBILE_GAP_PX;
      return el.clientWidth;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    const onPointerDown = () => {
      holdingRef.current = true;
    };
    const onPointerUp = () => {
      holdingRef.current = false;
    };

    const timer = window.setInterval(() => {
      if (!inViewRef.current || holdingRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const step = pageWidth();
      if (step <= 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      el.scrollBy({ left: step, behavior: "smooth" });
    }, MOBILE_PAGE_HOLD_MS);

    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    el.addEventListener("pointerup", onPointerUp, { passive: true });
    el.addEventListener("pointercancel", onPointerUp, { passive: true });
    el.addEventListener("touchstart", onPointerDown, { passive: true });
    el.addEventListener("touchend", onPointerUp, { passive: true });

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("touchstart", onPointerDown);
      el.removeEventListener("touchend", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="scrollbar-hide flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-0.5 pt-0.5 pb-3.5 md:hidden"
    >
      {HOME_CATEGORIES.map((category, index) => (
        <div
          key={category.slug}
          className={cn(
            "w-[calc((100%-0.75rem)/2)] min-w-[calc((100%-0.75rem)/2)] shrink-0",
            index % MOBILE_VISIBLE === 0 && "snap-start",
          )}
        >
          <DesktopCategoryTile category={category} />
        </div>
      ))}
    </div>
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
    <div className="relative hidden overflow-visible px-5 md:block">
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
        className="scrollbar-hide flex overflow-x-auto overscroll-x-contain px-1 pt-3 pb-7"
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
    <div className="relative md:mx-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 hidden h-56 w-[70%] -translate-x-1/2 rounded-full bg-[#EAF1FF]/55 blur-3xl md:block"
      />

      <MobileCategoryPager />
      <DesktopCategoryScroll />
    </div>
  );
}

export function CategoryGrid({ web = false }) {
  const mobileCategories = MOBILE_CATEGORY_SLUGS.map((slug) =>
    HOME_CATEGORIES.find((category) => category.slug === slug),
  ).filter(Boolean);

  if (web) {
    return <DesktopCategoriesShowcase />;
  }

  return (
    <>
      {/* App-style mobile grid */}
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
        <DesktopCategoriesShowcase />
      </div>
    </>
  );
}
