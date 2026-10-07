"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { SectionHeader, DesktopSectionHeading } from "@/components/home/section-header";
import { ServiceCard } from "@/components/home/service-card";
import {
  HOME_POPULAR_SERVICES,
  WEB_HOME_POPULAR_SERVICES,
} from "@/constants/popular-services";
import { ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const LOOP_TRACKS = 3;

function MobileScrollNav({ onPrev, onNext }) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
      <button
        type="button"
        aria-label="Previous popular services"
        onClick={onPrev}
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          "border border-[#DCE3EE] bg-white text-[#243044]",
          "transition-colors duration-150",
          "active:border-[#1865EA] active:text-[#1865EA]",
          "focus-visible:ring-2 focus-visible:ring-[#1865EA]/25 focus-visible:outline-none",
        )}
      >
        <ChevronLeft className="size-[18px]" strokeWidth={2.25} />
      </button>
      <button
        type="button"
        aria-label="Next popular services"
        onClick={onNext}
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          "border border-[#DCE3EE] bg-white text-[#243044]",
          "transition-colors duration-150",
          "active:border-[#1865EA] active:text-[#1865EA]",
          "focus-visible:ring-2 focus-visible:ring-[#1865EA]/25 focus-visible:outline-none",
        )}
      >
        <ChevronRight className="size-[18px]" strokeWidth={2.25} />
      </button>
    </div>
  );
}

function getTrackWidth(scroller, itemCount) {
  const first = scroller.children[0];
  const next = scroller.children[itemCount];
  if (!first || !next) return 0;
  return next.offsetLeft - first.offsetLeft;
}

function getStepWidth(scroller) {
  const first = scroller.children[0];
  const second = scroller.children[1];
  if (!first) return Math.max(scroller.clientWidth * 0.85, 240);
  if (!second) return first.offsetWidth;
  return second.offsetLeft - first.offsetLeft;
}

/** Mobile popular strip — swipe + bottom buttons loop forever */
function PopularMobileLoop({ services }) {
  const scrollerRef = useRef(null);
  const jumpingRef = useRef(false);
  const settleTimerRef = useRef(null);
  const readyRef = useRef(false);
  const itemCount = services.length;

  const loopItems = Array.from({ length: LOOP_TRACKS }, (_, track) =>
    services.map((svc, index) => ({ svc, track, index })),
  ).flat();

  const normalizeLoop = () => {
    const el = scrollerRef.current;
    if (!el || jumpingRef.current || !readyRef.current || itemCount === 0) return;

    const trackWidth = getTrackWidth(el, itemCount);
    if (trackWidth <= 0) return;

    let left = el.scrollLeft;
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
    if (!el || itemCount === 0) return undefined;

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

    el.addEventListener("scroll", scheduleNormalize, { passive: true });
    el.addEventListener("scrollend", normalizeLoop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimerRef.current);
      el.removeEventListener("scroll", scheduleNormalize);
      el.removeEventListener("scrollend", normalizeLoop);
    };
  }, [itemCount]);

  const scrollByStep = (direction) => {
    const el = scrollerRef.current;
    if (!el || itemCount === 0) return;

    const trackWidth = getTrackWidth(el, itemCount);
    const step = getStepWidth(el);
    if (trackWidth <= 0 || step <= 0) return;

    clearTimeout(settleTimerRef.current);
    jumpingRef.current = true;

    let from = el.scrollLeft;
    const amount = step * direction;
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
    <>
      <div
        ref={scrollerRef}
        className="scrollbar-hide -mr-4 touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth md:hidden"
      >
        <div className="flex gap-3">
          {loopItems.map(({ svc, track, index }) => (
            <div
              key={`${track}-${svc.id}`}
              className="w-[min(18.5rem,82vw)] shrink-0 snap-start"
            >
              <ServiceCard service={svc} index={index} desktop />
            </div>
          ))}
          <div className="w-4 shrink-0 snap-none" aria-hidden="true" />
        </div>
      </div>
      <MobileScrollNav onPrev={() => scrollByStep(-1)} onNext={() => scrollByStep(1)} />
    </>
  );
}

export function PopularServicesShowcase({ className, web = false }) {
  const { t } = useWebLocale();

  return (
    <section
      id="popular"
      className={cn(
        "scroll-mt-28",
        "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        "py-8 md:py-10",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[calc(96rem-60px)] px-4 md:px-[4.875rem] xl:px-[5.875rem]">
        {!web ? (
          <SectionHeader
            title="Popular Services"
            href={ROUTES.SERVICES}
            className="md:hidden"
          />
        ) : null}

        <div
          className={cn(
            "mb-5 items-end justify-between gap-4 md:mb-6 md:gap-6",
            web ? "flex" : "hidden md:flex",
          )}
        >
          <DesktopSectionHeading
            badgeKey="popularBadge"
            titleKey="popularTitle"
            highlightKey="popularHighlight"
            align="left"
            className="mb-0 w-full md:w-auto"
          />
          <Link
            href={ROUTES.SERVICES}
            className="mb-1 hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#1865EA] focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:outline-none md:inline-flex md:text-[15px]"
          >
            {t("popularServicesSeeAll")}
            <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
          </Link>
        </div>

        {!web ? (
          <div className="scrollbar-hide -mr-4 touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth md:hidden">
            <div className="flex gap-3">
              {HOME_POPULAR_SERVICES.map((svc, i) => (
                <div
                  key={svc.id}
                  className="w-[calc((100vw-4.25rem)/2)] shrink-0 snap-start"
                >
                  <ServiceCard service={svc} index={i} />
                </div>
              ))}
              <div className="w-4 shrink-0 snap-none" aria-hidden="true" />
            </div>
          </div>
        ) : (
          <PopularMobileLoop services={WEB_HOME_POPULAR_SERVICES} />
        )}

        <div className="hidden gap-5 md:grid md:grid-cols-4 md:gap-5 xl:gap-6">
          {WEB_HOME_POPULAR_SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} service={svc} index={i} desktop />
          ))}
        </div>
      </div>
    </section>
  );
}
