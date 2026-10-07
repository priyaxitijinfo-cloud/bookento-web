"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DesktopSectionHeading } from "@/components/home/section-header";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 1;
const GAP_PX = 20;
const LOOP_TRACKS = 3;
const MD_MIN = 768;

function getVisibleCount() {
  if (typeof window === "undefined") return VISIBLE_DESKTOP;
  return window.innerWidth < MD_MIN ? VISIBLE_MOBILE : VISIBLE_DESKTOP;
}

const FILTERS = [
  { id: "recommended", labelKey: "prosFilterRecommended" },
  { id: "available_today", labelKey: "prosFilterAvailableToday" },
  { id: "online", labelKey: "prosFilterOnline" },
  { id: "under_1000", labelKey: "prosFilterUnder1000" },
];

function filterProviders(providers, filterId) {
  switch (filterId) {
    case "available_today":
      return providers.filter(
        (p) => p.isNearby || (typeof p.distance === "number" && p.distance <= 3),
      );
    case "online":
      return providers.filter((p) => p.serviceModes?.includes("online"));
    case "under_1000":
      return providers.filter(
        (p) => typeof p.startingPrice === "number" && p.startingPrice <= 1000,
      );
    case "recommended":
    default:
      return providers;
  }
}

function getTrackWidth(scroller, itemCount) {
  const child = scroller.children[itemCount];
  if (!child || !scroller.children[0]) return 0;
  return child.offsetLeft - scroller.children[0].offsetLeft;
}

/** Exact width of one page (1 card mobile / 4 cards desktop + gaps) */
function getPageWidth(scroller) {
  const visible = getVisibleCount();
  const next = scroller.children[visible];
  if (!next || !scroller.children[0]) return 0;
  return next.offsetLeft - scroller.children[0].offsetLeft;
}

function NavButton({ label, onClick, side }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center rounded-full",
        "border border-[#DCE3EE] bg-white text-[#243044]",
        "transition-colors duration-150",
        "hover:border-[#1865EA] hover:text-[#1865EA]",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/25 focus-visible:outline-none",
      )}
    >
      {side === "left" ? (
        <ChevronLeft className="size-[18px]" strokeWidth={2.25} />
      ) : (
        <ChevronRight className="size-[18px]" strokeWidth={2.25} />
      )}
    </button>
  );
}

/** Desktop-only professionals strip — page scroll of exactly 4 full cards */
export function DesktopTopRatedScroll({ providers }) {
  const { t } = useWebLocale();
  const [activeFilter, setActiveFilter] = useState("recommended");
  const scrollerRef = useRef(null);
  const jumpingRef = useRef(false);
  const settleTimerRef = useRef(null);
  const readyRef = useRef(false);

  const filteredProviders = useMemo(() => {
    const next = filterProviders(providers, activeFilter);
    return next.length > 0 ? next : providers;
  }, [providers, activeFilter]);

  const itemCount = filteredProviders.length;
  const loopItems = Array.from({ length: LOOP_TRACKS }, (_, track) =>
    filteredProviders.map((provider) => ({ provider, track })),
  ).flat();

  const desktopTileWidth = `calc((100% - ${(VISIBLE_DESKTOP - 1) * GAP_PX}px) / ${VISIBLE_DESKTOP})`;

  const snapToPage = (el) => {
    const pageWidth = getPageWidth(el);
    if (pageWidth <= 0) return el.scrollLeft;
    return Math.round(el.scrollLeft / pageWidth) * pageWidth;
  };

  const normalizeLoop = () => {
    const el = scrollerRef.current;
    if (!el || jumpingRef.current || !readyRef.current || itemCount === 0) return;

    const trackWidth = getTrackWidth(el, itemCount);
    const pageWidth = getPageWidth(el);
    if (trackWidth <= 0 || pageWidth <= 0) return;

    let left = snapToPage(el);

    if (left >= trackWidth * 2) {
      left -= trackWidth;
    } else if (left < trackWidth) {
      left += trackWidth;
    }

    jumpingRef.current = true;
    el.scrollLeft = left;
    jumpingRef.current = false;
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || itemCount === 0) return;

    readyRef.current = false;

    const placeInMiddle = () => {
      const trackWidth = getTrackWidth(el, itemCount);
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
      settleTimerRef.current = setTimeout(normalizeLoop, 120);
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
  }, [itemCount, activeFilter]);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el || itemCount === 0) return;

    const trackWidth = getTrackWidth(el, itemCount);
    const pageWidth = getPageWidth(el);
    if (trackWidth <= 0 || pageWidth <= 0) return;

    clearTimeout(settleTimerRef.current);
    jumpingRef.current = true;

    let from = snapToPage(el);
    el.scrollLeft = from;

    const amount = pageWidth * direction;
    let target = from + amount;

    if (direction > 0 && target >= trackWidth * 2) {
      from -= trackWidth;
      el.scrollLeft = from;
      target = from + amount;
    } else if (direction < 0 && target < trackWidth) {
      from += trackWidth;
      el.scrollLeft = from;
      target = from + amount;
    }

    requestAnimationFrame(() => {
      jumpingRef.current = false;
      el.scrollTo({ left: target, behavior: "smooth" });
    });
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4 md:gap-6">
        <DesktopSectionHeading
          badgeKey="professionalsBadge"
          titleKey="professionalsTitle"
          highlightKey="professionalsHighlight"
          align="left"
          className="mb-0 w-full md:w-auto"
        />

        <div className="mb-1 hidden shrink-0 items-center gap-2 md:flex">
          <NavButton
            label="Previous professionals"
            side="left"
            onClick={() => scrollByPage(-1)}
          />
          <NavButton
            label="Next professionals"
            side="right"
            onClick={() => scrollByPage(1)}
          />
        </div>
      </div>

      <div
        className="scrollbar-hide mt-5 mb-5 flex flex-nowrap items-center justify-center gap-1.5 overflow-x-auto md:flex-wrap md:justify-start md:gap-2"
        role="tablist"
        aria-label={t("prosFilterAria")}
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "shrink-0 rounded-full font-semibold tracking-tight transition-all duration-200",
                "px-3 py-2 text-[11px] md:px-5 md:py-[0.55rem] md:text-[13px]",
                "focus-visible:ring-2 focus-visible:ring-[#1865EA]/30 focus-visible:ring-offset-2 focus-visible:outline-none",
                active
                  ? "gradient-brand text-white ring-1 ring-[#1865EA]/35"
                  : "bg-white text-[#5B6B82] ring-1 ring-[#DCE3EE] hover:bg-[#F5F8FC] hover:text-[#314158] hover:ring-[#C9D6EA]",
              )}
            >
              {t(filter.labelKey)}
            </button>
          );
        })}
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-1 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-2 pb-2 md:snap-none md:pb-4"
        style={{ gap: GAP_PX }}
      >
        {loopItems.map(({ provider, track }) => (
          <div
            key={`${track}-${provider.id}`}
            className="w-full min-w-full shrink-0 snap-start py-1 md:w-[var(--desktop-tile)] md:min-w-[var(--desktop-tile)]"
            style={{ ["--desktop-tile"]: desktopTileWidth }}
          >
            <TopRatedProviderCard
              provider={provider}
              categorySlug={provider.categorySlug}
              desktop
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
        <NavButton
          label="Previous professionals"
          side="left"
          onClick={() => scrollByPage(-1)}
        />
        <NavButton
          label="Next professionals"
          side="right"
          onClick={() => scrollByPage(1)}
        />
      </div>
    </div>
  );
}
