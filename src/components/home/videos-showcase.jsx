"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookmarkCheck,
  Eye,
  Heart,
  MessageCircle,
  PlayCircle,
  Share2,
  Sparkles,
} from "lucide-react";

import { useRequireLoginToBook } from "@/hooks/use-require-login-to-book";
import { useWebLocale } from "@/hooks/use-web-locale";
import { buildReelsRoute } from "@/lib/navigation/back-navigation";
import { cn } from "@/lib/utils";
import { reels } from "@/mock/reels";
import { formatCompactNumber } from "@/utils/format.utils";

/** Use full mock set so the strip stays longer before looping */
const SHOWCASE_REELS = reels;
const HOLD_MS = 1800;
const SLIDE_MS = 600;
const DRAG_THRESHOLD_PX = 48;
const ALL_REELS_HREF = buildReelsRoute({ from: "home", view: "all" });

function ReelPanel({
  reel,
  play,
  isCenter,
  onPause,
  popularBadge,
  suppressClickRef,
  href = ALL_REELS_HREF,
}) {
  const videoRef = useRef(null);
  const handle = reel.handle || reel.providerName;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (play) {
      video.muted = true;
      const attempt = video.play();
      if (attempt) attempt.catch(() => {});
      return;
    }

    video.pause();
  }, [play, reel.id]);

  return (
    <Link
      href={href}
      draggable={false}
      aria-label={`Watch ${reel.title}`}
      onClick={(event) => {
        if (suppressClickRef?.current) {
          event.preventDefault();
          suppressClickRef.current = false;
        }
      }}
      onMouseEnter={() => onPause(true)}
      onMouseLeave={() => onPause(false)}
      className={cn(
        "relative aspect-[2/3] w-[var(--panel)] shrink-0 overflow-hidden rounded-[1.35rem]",
        "origin-center bg-[#111827] ring-1 ring-[#D0D5DD]/70",
        "transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]",
        "select-none",
        isCenter
          ? "z-20 scale-[1.06] opacity-100 ring-[#1865EA]/40"
          : "z-10 scale-[0.94] opacity-75",
      )}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.poster || reel.thumbnailUrl}
        className="absolute inset-0 size-full object-cover"
        muted
        playsInline
        loop
        preload="metadata"
        aria-hidden
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/25"
      />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-2.5">
        {reel.isPopular ? (
          <span className="inline-flex h-[19px] items-center rounded-full bg-white/15 px-2 text-[9px] leading-none font-semibold text-white backdrop-blur-md">
            {popularBadge}
          </span>
        ) : (
          <span aria-hidden className="h-[19px]" />
        )}
        <span className="inline-flex h-[19px] items-center gap-1 rounded-full bg-black/35 px-1.5 text-[9px] leading-none font-medium text-white backdrop-blur-md">
          <Eye className="size-2.5 shrink-0" aria-hidden />
          {formatCompactNumber(reel.views || 0)}
        </span>
      </div>

      <div className="absolute top-[44%] right-1.5 z-10 flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center gap-0.5">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-md">
            <Heart className="size-3.5 text-white" aria-hidden />
          </span>
          <span className="text-[9px] font-semibold text-white drop-shadow">
            {formatCompactNumber(reel.likes || 0)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-md">
            <MessageCircle className="size-3.5 text-white" aria-hidden />
          </span>
          <span className="text-[9px] font-semibold text-white drop-shadow">
            {formatCompactNumber(reel.comments || 0)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-md">
            <Share2 className="size-3.5 text-white" aria-hidden />
          </span>
          <span className="text-[9px] font-semibold text-white drop-shadow">
            {formatCompactNumber(reel.shares || 0)}
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 pr-8">
        <div className="mb-1.5 flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={reel.providerAvatar}
            alt=""
            className="size-6 rounded-full object-cover ring-1 ring-white/80"
          />
          <span className="truncate rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            @{handle}
          </span>
        </div>

        <p className="line-clamp-1 text-[11px] leading-tight font-semibold text-white">
          {reel.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-white/85">
          {reel.caption}
        </p>
        {Array.isArray(reel.hashtags) && reel.hashtags.length > 0 ? (
          <p className="mt-1 line-clamp-1 text-[9px] text-[#9EC5FF]">
            {reel.hashtags.slice(0, 3).join(" ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/** Desktop-only — center focus hold + smooth slide, seamless infinite loop */
export function VideosShowcase({ className }) {
  const { t } = useWebLocale();
  const { getBookHref } = useRequireLoginToBook();
  const reelsHref = getBookHref(ALL_REELS_HREF);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, delta: 0 });
  const suppressClickRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const count = SHOWCASE_REELS.length;
  /** Duplicate once so we can slide past the last into a clone, then snap back */
  const loopReels = [...SHOWCASE_REELS, ...SHOWCASE_REELS];

  const videoPoints = [
    {
      icon: PlayCircle,
      title: t("videosPoint1Title"),
      desc: t("videosPoint1Desc"),
    },
    {
      icon: Sparkles,
      title: t("videosPoint2Title"),
      desc: t("videosPoint2Desc"),
    },
    {
      icon: BookmarkCheck,
      title: t("videosPoint3Title"),
      desc: t("videosPoint3Desc"),
    },
  ];

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || dragging || count < 2) return undefined;

    const timer = window.setTimeout(() => {
      setAnimate(true);
      setActiveIndex((current) => current + 1);
    }, HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [inView, paused, dragging, count, activeIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const onEnd = (event) => {
      if (event.target !== track) return;
      if (activeIndex < count) return;
      setAnimate(false);
      setActiveIndex(activeIndex % count);
    };

    track.addEventListener("transitionend", onEnd);
    return () => track.removeEventListener("transitionend", onEnd);
  }, [activeIndex, count]);

  const endDrag = () => {
    if (!dragRef.current.active) return;

    const delta = dragRef.current.delta;
    dragRef.current.active = false;
    setDragging(false);
    setDragPx(0);
    setAnimate(true);

    if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;

    suppressClickRef.current = true;

    if (delta < 0) {
      setActiveIndex((current) => current + 1);
      return;
    }

    setActiveIndex((current) => {
      if (current > 0) return current - 1;
      return count - 1;
    });
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    dragRef.current = { active: true, startX: event.clientX, delta: 0 };
    setDragging(true);
    setPaused(true);
    setAnimate(false);
    setDragPx(0);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    dragRef.current.delta = delta;
    setDragPx(delta);
  };

  const onPointerUp = (event) => {
    if (!dragRef.current.active) return;
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      /* already released */
    }
    endDrag();
  };

  return (
    <section
      id="videos"
      aria-label="Provider videos"
      className={cn(
        "scroll-mt-28",
        "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        className,
      )}
    >
      <div className="relative overflow-x-clip border-y border-[#E8EDF5] bg-[#F7F8FA]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_35%,rgba(24,101,234,0.1)_0%,transparent_52%)]"
        />

        <div className="relative mx-auto w-full max-w-[calc(96rem-60px)] px-4 py-8 md:px-[4.875rem] md:py-9 xl:px-[5.875rem] xl:py-11">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-8 xl:gap-10">
            <div className="flex w-full max-w-none flex-col items-center text-center lg:items-start lg:pr-2 lg:text-left">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <span aria-hidden className="h-px w-8 bg-[#C9D3E2] md:w-10" />
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#1865EA] uppercase md:text-[12px] md:tracking-[0.22em]">
                  {t("videosBadge")}
                </span>
                <span aria-hidden className="h-px w-8 bg-[#C9D3E2] md:w-10 lg:hidden" />
              </div>

              <h2 className="mt-3 max-w-xl text-[1.65rem] leading-[1.1] font-bold tracking-tight text-[#0F1B2D] md:mt-4 md:text-[calc(2.15rem-4px)] md:leading-[1.08] lg:text-[2.5rem]">
                {t("videosTitle")}
                <span className="mt-1 block bg-[linear-gradient(105deg,#1865EA_0%,#58A1FF_100%)] bg-clip-text text-transparent">
                  {t("videosHighlight")}
                </span>
              </h2>

              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-[#667085] md:text-[15px] lg:text-[15.5px]">
                {t("videosBody")}
              </p>

              <ul className="mt-5 hidden w-[calc(100%-12px)] gap-3 md:mt-6 md:grid xl:gap-3.5">
                {videoPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <li
                      key={point.title}
                      className="flex gap-3 rounded-2xl bg-white/70 px-3.5 py-3 ring-1 ring-[#E8EDF5]"
                    >
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#1865EA] ring-1 ring-[#D6E4FF]">
                        <Icon className="size-4" strokeWidth={2.1} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] leading-snug font-semibold text-[#0F1B2D]">
                          {point.title}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-snug text-[#667085]">
                          {point.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Link
                href={reelsHref}
                className={cn(
                  "gradient-brand mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 md:mt-7",
                  "text-sm font-semibold text-white transition-opacity hover:opacity-95",
                )}
              >
                {t("videosCta")}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div
              ref={stageRef}
              className={cn(
                "relative w-full min-w-0 overflow-hidden py-4 md:py-6",
                "[--gap:0.9rem] [--panel:12.25rem] sm:[--panel:13rem] md:[--gap:1.15rem] md:[--panel:15rem] xl:[--gap:1.35rem] xl:[--panel:16.5rem]",
                "[mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)]",
                "[-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)]",
                dragging ? "cursor-grabbing" : "cursor-grab",
              )}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => {
                if (!dragRef.current.active) setPaused(false);
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div
                ref={trackRef}
                className="flex w-max items-center gap-[var(--gap)] py-2 will-change-transform"
                style={{
                  marginLeft: "calc(50% - (var(--panel) / 2))",
                  transform: `translateX(calc(-${activeIndex} * (var(--panel) + var(--gap)) + ${dragPx}px))`,
                  transition:
                    animate && !dragging
                      ? `transform ${SLIDE_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1)`
                      : "none",
                }}
              >
                {loopReels.map((reel, index) => (
                  <ReelPanel
                    key={`${reel.id}-${index}`}
                    reel={reel}
                    isCenter={index === activeIndex}
                    play={inView && index === activeIndex && !paused && !dragging}
                    onPause={setPaused}
                    popularBadge={t("popularBadgeShort")}
                    suppressClickRef={suppressClickRef}
                    href={reelsHref}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
