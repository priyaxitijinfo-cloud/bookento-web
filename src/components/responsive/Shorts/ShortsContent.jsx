"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Eye,
  LayoutGrid,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { ReelSlide } from "@/components/provider-booking/reels/reel-slide";
import { ReelsFeedToggle } from "@/components/provider-booking/reels/reels-feed-toggle";
import {
  ReelsActionButton,
  ReelsCategorySheet,
  ReelsCommentsSheet,
  REELS_ACTION_ICONS,
  ReelsReportSheet,
  ReelsShareSheet,
} from "@/components/provider-booking/reels/reels-sheets";
import { categoryListingRoute, providerPackageRoute } from "@/constants/routes.constants";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/utils/format.utils";

function SavedReelTile({ reel, index, isSaved, onSelectReel, onToggleSave }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "80px 0px", threshold: 0.5 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!isVisible) {
      video.pause();
      return undefined;
    }

    video.muted = true;
    const attempt = video.play();
    if (attempt) {
      attempt.catch(() => {
        try {
          video.currentTime = 0.01;
        } catch {
          // Ignore seek errors while metadata is still loading.
        }
      });
    }

    return undefined;
  }, [isVisible, reel.videoUrl]);

  return (
    <div
      ref={containerRef}
      className="relative isolate aspect-[3/4] w-full overflow-hidden rounded-md bg-[#111827]"
    >
      <button
        type="button"
        onClick={() => onSelectReel(index)}
        className="absolute inset-0 block w-full overflow-hidden text-left"
        aria-label={`Open reel by ${reel.providerName}`}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="absolute inset-0 size-full object-cover object-center"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />

        <span className="absolute bottom-2.5 left-2.5 z-[1] inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Eye className="size-3.5" />
          {formatCompactNumber(reel.views)}
        </span>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleSave(reel.id);
        }}
        className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center text-white transition-opacity hover:opacity-80"
        aria-label={isSaved ? "Remove from saved" : "Save reel"}
      >
        <Bookmark className={cn("size-5", isSaved && "fill-white")} />
      </button>
    </div>
  );
}

export function SavedReelsGrid({
  savedReels,
  savedIds,
  onSelectReel,
  onToggleSave,
  className,
}) {
  return (
    <div className={className}>
      {savedReels.map((reel, index) => (
        <SavedReelTile
          key={reel.id}
          reel={reel}
          index={index}
          isSaved={savedIds.includes(reel.id)}
          onSelectReel={onSelectReel}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}

function getDisplayLikes(reel, liked) {
  const delta = (liked[reel.id] ? 1 : 0) - (reel.isLiked ? 1 : 0);
  return reel.likes + delta;
}

function reelToProvider(reel) {
  return {
    id: reel.providerId,
    businessName: reel.providerName,
    avatar: reel.providerAvatar,
  };
}

function stopReelAction(handler) {
  return (event) => {
    event.preventDefault();
    event.stopPropagation();
    handler?.();
  };
}

function ReelsPlayer({
  visibleReels,
  activeIndex,
  setActiveIndex,
  pageTitle,
  backHref,
  onBack,
  backLabel,
  muted,
  setMuted,
  liked,
  toggleLike,
  savedIds,
  onToggleSave,
  scrollRef,
  scrollToIndex,
  isProgrammaticScrollRef,
  wheelLockRef,
  className,
  enableFeedFilter = false,
}) {
  const router = useRouter();
  const { setProviderId, setPackageId } = useBookingStore();
  const [activeSheet, setActiveSheet] = useState(null);
  const [showMuteControl, setShowMuteControl] = useState(false);
  const [saveBumpId, setSaveBumpId] = useState(null);
  const [feedFilter, setFeedFilter] = useState("popular");
  const [slideHeight, setSlideHeight] = useState(0);
  const muteHideTimerRef = useRef(null);
  const saveBumpTimerRef = useRef(null);

  const filteredReels = useMemo(() => {
    if (!enableFeedFilter) return visibleReels;

    if (feedFilter === "nearby") {
      return visibleReels.filter((reel) => reel.isNearby !== false);
    }
    return visibleReels.filter((reel) => reel.isPopular !== false);
  }, [enableFeedFilter, feedFilter, visibleReels]);

  const activeReel = filteredReels[activeIndex];
  const isReelSaved = activeReel ? savedIds.includes(activeReel.id) : false;

  const reelProvider = useMemo(
    () => (activeReel ? reelToProvider(activeReel) : null),
    [activeReel],
  );

  const savedMap = useMemo(
    () => Object.fromEntries(savedIds.map((id) => [id, true])),
    [savedIds],
  );

  useEffect(() => {
    setActiveSheet(null);
  }, [activeIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const updateSlideHeight = () => {
      const height = container.clientHeight;
      if (height > 0) setSlideHeight(height);
    };

    updateSlideHeight();
    const observer = new ResizeObserver(updateSlideHeight);
    observer.observe(container);
    return () => observer.disconnect();
  }, [scrollRef]);

  useEffect(() => {
    if (activeIndex >= filteredReels.length && filteredReels.length > 0) {
      setActiveIndex(filteredReels.length - 1);
    }
  }, [activeIndex, filteredReels.length, setActiveIndex]);

  const revealMuteControl = useCallback(() => {
    setShowMuteControl(true);
    if (muteHideTimerRef.current) clearTimeout(muteHideTimerRef.current);
    muteHideTimerRef.current = window.setTimeout(() => {
      setShowMuteControl(false);
    }, 2500);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setMuted((value) => !value);
    revealMuteControl();
  }, [revealMuteControl, setMuted]);

  const handleReelTap = useCallback(
    (event) => {
      if (event.target.closest("button, a, [data-no-reel-tap]")) return;
      revealMuteControl();
    },
    [revealMuteControl],
  );

  useEffect(() => {
    setShowMuteControl(false);
    if (muteHideTimerRef.current) clearTimeout(muteHideTimerRef.current);
  }, [activeIndex]);

  useEffect(
    () => () => {
      if (muteHideTimerRef.current) clearTimeout(muteHideTimerRef.current);
      if (saveBumpTimerRef.current) clearTimeout(saveBumpTimerRef.current);
    },
    [],
  );

  const handleSaveClick = useCallback(() => {
    if (!activeReel) return;

    onToggleSave(activeReel.id);
    setSaveBumpId(activeReel.id);

    if (saveBumpTimerRef.current) clearTimeout(saveBumpTimerRef.current);
    saveBumpTimerRef.current = window.setTimeout(() => {
      setSaveBumpId(null);
    }, 350);
  }, [activeReel, onToggleSave]);

  const handleBookNow = useCallback(
    (packageId) => {
      if (!activeReel) return;
      setProviderId(activeReel.providerId);
      setPackageId(packageId);
      router.push(providerPackageRoute(activeReel.providerId, packageId));
    },
    [activeReel, router, setPackageId, setProviderId],
  );

  const handleFeedFilterChange = useCallback(
    (filter) => {
      if (filter === feedFilter) return;

      const currentReelId = filteredReels[activeIndex]?.id;
      const nextList =
        filter === "nearby"
          ? visibleReels.filter((reel) => reel.isNearby !== false)
          : visibleReels.filter((reel) => reel.isPopular !== false);

      let nextIndex = 0;
      if (currentReelId) {
        const found = nextList.findIndex((reel) => reel.id === currentReelId);
        nextIndex = found >= 0 ? found : 0;
      }

      setFeedFilter(filter);
      setActiveIndex(nextIndex);
      requestAnimationFrame(() => scrollToIndex(nextIndex));
    },
    [activeIndex, feedFilter, filteredReels, scrollToIndex, setActiveIndex, visibleReels],
  );

  const handleCategoryApply = useCallback(
    (slug) => {
      router.push(categoryListingRoute(slug));
    },
    [router],
  );

  const closeSheet = () => setActiveSheet(null);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;

    const container = scrollRef.current;
    if (!container || slideHeight <= 0) return;

    const index = Math.round(container.scrollTop / slideHeight);

    if (index !== activeIndex && index >= 0 && index < filteredReels.length) {
      setActiveIndex(index);
    }
  }, [activeIndex, filteredReels.length, isProgrammaticScrollRef, scrollRef, setActiveIndex, slideHeight]);

  const handleWheel = useCallback(
    (event) => {
      if (activeSheet || wheelLockRef.current || slideHeight <= 0) return;

      event.preventDefault();
      event.stopPropagation();

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(
        Math.max(activeIndex + direction, 0),
        filteredReels.length - 1,
      );

      if (nextIndex === activeIndex) return;

      wheelLockRef.current = true;
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex, "smooth");

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 450);
    },
    [
      activeIndex,
      activeSheet,
      filteredReels.length,
      scrollToIndex,
      setActiveIndex,
      slideHeight,
      wheelLockRef,
    ],
  );

  if (filteredReels.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-black p-6 text-center">
        <div>
          <p className="font-semibold text-white">No reels found</p>
          <p className="mt-2 text-sm text-white/70">Try switching between Popular and Nearby.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div className="absolute right-3 top-3 z-20 hidden gap-2 md:flex">
        {enableFeedFilter && (
          <button
            type="button"
            onClick={() => setActiveSheet("category")}
            className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
            aria-label="Open categories"
          >
            <LayoutGrid className="size-4" />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="relative z-0 h-full w-full touch-pan-y snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth scrollbar-hide"
        onScroll={handleScroll}
        onWheel={handleWheel}
        onClick={handleReelTap}
      >
        {filteredReels.map((reel, index) => (
          <ReelSlide
            key={reel.id}
            reel={reel}
            provider={reelToProvider(reel)}
            isActive={index === activeIndex}
            muted={muted}
            slideHeight={slideHeight}
            onBookNow={handleBookNow}
          />
        ))}
      </div>

      {activeReel ? (
        <>
          {!activeSheet && (
            <>
              {enableFeedFilter ? (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-4">
                  <ReelsFeedToggle value={feedFilter} onChange={handleFeedFilterChange} />
                  <button
                    type="button"
                    onClick={() => setActiveSheet("category")}
                    className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md md:hidden"
                    aria-label="Open categories"
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="safe-top pointer-events-auto absolute inset-x-0 top-0 z-20 p-4 md:hidden">
                  <div className="flex min-h-10 items-center gap-2">
                    {onBack ? (
                      <button
                        type="button"
                        onClick={stopReelAction(onBack)}
                        className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-background/20"
                        aria-label={backLabel}
                      >
                        <ArrowLeft className="size-5" />
                      </button>
                    ) : (
                      <Link
                        href={backHref}
                        onClick={stopReelAction()}
                        className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-background/20"
                        aria-label={backLabel}
                      >
                        <ArrowLeft className="size-5" />
                      </Link>
                    )}
                    <h1 className="text-lg font-bold text-white">{pageTitle}</h1>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300",
                  showMuteControl ? "opacity-100" : "opacity-0",
                )}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleMuteToggle();
                  }}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-transform duration-300",
                    showMuteControl ? "pointer-events-auto scale-100" : "pointer-events-none scale-95",
                  )}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-hidden={!showMuteControl}
                  tabIndex={showMuteControl ? 0 : -1}
                >
                  {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </button>
              </div>

              <div className="pointer-events-auto absolute right-3 bottom-[198px] z-50 flex w-11 flex-col items-center gap-3 md:right-4 md:bottom-[182px]">
                <ReelsActionButton
                  icon={REELS_ACTION_ICONS.like}
                  activeIcon={REELS_ACTION_ICONS.likeActive}
                  label={formatCompactNumber(getDisplayLikes(activeReel, liked))}
                  onClick={() => {
                    const willLike = !liked[activeReel.id];
                    toggleLike(activeReel.id);
                    toast.success(willLike ? "Added to liked" : "Removed from liked");
                  }}
                  active={Boolean(liked[activeReel.id])}
                />
                <ReelsActionButton
                  icon={REELS_ACTION_ICONS.comment}
                  label={formatCompactNumber(activeReel.comments)}
                  onClick={() => setActiveSheet("comments")}
                />
                <ReelsActionButton
                  icon={REELS_ACTION_ICONS.share}
                  onClick={() => setActiveSheet("share")}
                />
                <span
                  className={cn(
                    "inline-flex shrink-0 transition-transform duration-200 ease-out",
                    saveBumpId === activeReel.id && "scale-[1.18]",
                  )}
                >
                  <ReelsActionButton
                    icon={REELS_ACTION_ICONS.save}
                    activeIcon={REELS_ACTION_ICONS.saveActive}
                    onClick={handleSaveClick}
                    active={isReelSaved}
                  />
                </span>
                <ReelsActionButton
                  icon={REELS_ACTION_ICONS.report}
                  onClick={() => setActiveSheet("report")}
                />
              </div>
            </>
          )}

          <ReelsCommentsSheet
            open={activeSheet === "comments"}
            onClose={closeSheet}
            reel={activeReel}
            provider={reelProvider}
            contained
          />
          <ReelsShareSheet
            open={activeSheet === "share"}
            onClose={closeSheet}
            reel={activeReel}
            provider={reelProvider}
            saved={savedMap}
            onToggleSave={onToggleSave}
            contained
          />
          <ReelsReportSheet open={activeSheet === "report"} onClose={closeSheet} contained />
          {enableFeedFilter && (
            <ReelsCategorySheet
              open={activeSheet === "category"}
              onClose={closeSheet}
              selectedCategory="doctor"
              onApply={handleCategoryApply}
              contained
            />
          )}
        </>
      ) : null}
    </div>
  );
}

export function ReelsPlayerShell({
  enabled,
  scrollRef,
  activeIndex,
  setActiveIndex,
  ...playerProps
}) {
  const isProgrammaticScrollRef = useRef(false);
  const wheelLockRef = useRef(false);

  const scrollToIndex = useCallback(
    (index, behavior = "auto") => {
      const container = scrollRef.current;
      if (!container) return;

      const height = container.clientHeight;
      if (!height) return;

      isProgrammaticScrollRef.current = true;
      container.scrollTo({ top: index * height, behavior });

      window.setTimeout(
        () => {
          isProgrammaticScrollRef.current = false;
        },
        behavior === "smooth" ? 450 : 100,
      );
    },
    [scrollRef],
  );

  useEffect(() => {
    if (!enabled) return undefined;

    scrollToIndex(activeIndex);
    return undefined;
  }, [enabled, activeIndex, scrollToIndex]);

  useEffect(() => {
    if (!enabled) return undefined;

    const container = scrollRef.current;
    if (!container) return undefined;

    const syncScrollPosition = () => {
      scrollToIndex(activeIndex, "auto");
    };

    const observer = new ResizeObserver(syncScrollPosition);
    observer.observe(container);

    return () => observer.disconnect();
  }, [enabled, activeIndex, scrollRef, scrollToIndex]);

  return (
    <ReelsPlayer
      {...playerProps}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      scrollRef={scrollRef}
      scrollToIndex={scrollToIndex}
      isProgrammaticScrollRef={isProgrammaticScrollRef}
      wheelLockRef={wheelLockRef}
    />
  );
}
