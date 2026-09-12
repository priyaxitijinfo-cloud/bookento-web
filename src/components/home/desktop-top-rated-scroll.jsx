"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DesktopSectionHeading } from "@/components/home/section-header";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { cn } from "@/lib/utils";

const VISIBLE = 4;
const GAP_PX = 20;
const LOOP_TRACKS = 3;

function getTrackWidth(scroller, itemCount) {
  const child = scroller.children[itemCount];
  if (!child || !scroller.children[0]) return 0;
  return child.offsetLeft - scroller.children[0].offsetLeft;
}

/** Exact width of one page (4 full cards + gaps between them) */
function getPageWidth(scroller) {
  const next = scroller.children[VISIBLE];
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
  const scrollerRef = useRef(null);
  const jumpingRef = useRef(false);
  const settleTimerRef = useRef(null);
  const readyRef = useRef(false);

  const itemCount = providers.length;
  const loopItems = Array.from({ length: LOOP_TRACKS }, (_, track) =>
    providers.map((provider) => ({ provider, track })),
  ).flat();

  const tileWidth = `calc((100% - ${(VISIBLE - 1) * GAP_PX}px) / ${VISIBLE})`;

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
  }, [itemCount]);

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
    <div className="hidden md:block">
      <div className="mb-2 flex items-end justify-between gap-6">
        <DesktopSectionHeading
          badgeKey="professionalsBadge"
          titleKey="professionalsTitle"
          highlightKey="professionalsHighlight"
          align="left"
          className="mb-0"
        />

        <div className="mb-1 flex shrink-0 items-center gap-2">
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
        ref={scrollerRef}
        className="scrollbar-hide -mx-1 flex overflow-x-auto overscroll-x-contain px-2 pt-2 pb-6"
        style={{ gap: GAP_PX }}
      >
        {loopItems.map(({ provider, track }) => (
          <div
            key={`${track}-${provider.id}`}
            className="shrink-0 py-1"
            style={{ width: tileWidth, minWidth: tileWidth }}
          >
            <TopRatedProviderCard
              provider={provider}
              categorySlug={provider.categorySlug}
              desktop
            />
          </div>
        ))}
      </div>
    </div>
  );
}
